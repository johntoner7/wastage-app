import "./ConfigNotice.css";

export function ConfigNotice() {
  return (
    <div className="confignotice">
      <div className="confignotice__badge">⚠</div>
      <h1 className="confignotice__title">Not connected yet</h1>
      <p className="confignotice__body">
        This app needs an API URL to store today's sheet, so it can be shared across
        devices. Add <code>VITE_API_URL</code> and <code>VITE_API_TOKEN</code> to a{" "}
        <code>.env</code> file (see <code>.env.example</code>), then restart the dev server or
        redeploy.
      </p>
      <p className="confignotice__body confignotice__body--muted">Full steps are in README.md.</p>
    </div>
  );
}
