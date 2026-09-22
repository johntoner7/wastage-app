/**
 * Small D1-backed API for the wastage app's one table. Mirrors the trust
 * model the app used with Supabase: there's no login step, just a shared
 * token embedded in the built JS (checked here so a stranger can't hit the
 * API directly, but not meaningfully secret — see README.md).
 */

interface EntryRow {
  entry_date: string;
  product_id: string;
  quantity: number;
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  return crypto.subtle.timingSafeEqual(aBytes, bBytes);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

function isValidDate(date: string | null): date is string {
  return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const authHeader = request.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!env.API_TOKEN || !timingSafeEqual(token, env.API_TOKEN)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/entries" && request.method === "GET") {
        const date = url.searchParams.get("date");
        if (!isValidDate(date)) return json({ error: "Invalid or missing date" }, 400);
        const { results } = await env.DB.prepare(
          "select product_id, quantity from wastage_entries where entry_date = ?",
        )
          .bind(date)
          .all<EntryRow>();
        const entries: Record<string, number> = {};
        for (const row of results) entries[row.product_id] = row.quantity;
        return json(entries);
      }

      if (url.pathname === "/entries" && request.method === "PUT") {
        const body = (await request.json()) as { date?: string; productId?: string; quantity?: number };
        if (!isValidDate(body.date ?? null) || !body.productId || !(body.quantity! > 0)) {
          return json({ error: "Invalid entry" }, 400);
        }
        await env.DB.prepare(
          `insert into wastage_entries (entry_date, product_id, quantity, updated_at)
           values (?, ?, ?, datetime('now'))
           on conflict (entry_date, product_id)
           do update set quantity = excluded.quantity, updated_at = excluded.updated_at`,
        )
          .bind(body.date, body.productId, body.quantity)
          .run();
        return json({ ok: true });
      }

      if (url.pathname === "/entries" && request.method === "DELETE") {
        const date = url.searchParams.get("date");
        const productId = url.searchParams.get("productId");
        if (!isValidDate(date)) return json({ error: "Invalid or missing date" }, 400);
        if (productId) {
          await env.DB.prepare("delete from wastage_entries where entry_date = ? and product_id = ?")
            .bind(date, productId)
            .run();
        } else {
          await env.DB.prepare("delete from wastage_entries where entry_date = ?").bind(date).run();
        }
        return json({ ok: true });
      }

      if (url.pathname === "/history" && request.method === "GET") {
        const exclude = url.searchParams.get("exclude");
        if (!isValidDate(exclude)) return json({ error: "Invalid or missing exclude" }, 400);
        const { results } = await env.DB.prepare(
          `select entry_date, count(*) as item_count from wastage_entries
           where entry_date != ? group by entry_date order by entry_date desc`,
        )
          .bind(exclude)
          .all<{ entry_date: string; item_count: number }>();
        return json(results.map((r) => ({ date: r.entry_date, itemCount: r.item_count })));
      }

      return json({ error: "Not found" }, 404);
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : "Internal error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
