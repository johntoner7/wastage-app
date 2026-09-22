import "./ConfigNotice.css";

export function ConfigNotice() {
  return (
    <div className="confignotice">
      <div className="confignotice__badge">⚠</div>
      <h1 className="confignotice__title">Not connected yet</h1>
      <p className="confignotice__body">
        This app needs a Supabase project to store today's sheet, so it can be shared across
        devices. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a{" "}
        <code>.env</code> file (see <code>.env.example</code>), run the SQL in{" "}
        <code>sql/schema.sql</code> against your project, then restart the dev server or redeploy.
      </p>
      <p className="confignotice__body confignotice__body--muted">Full steps are in README.md.</p>
    </div>
  );
}
