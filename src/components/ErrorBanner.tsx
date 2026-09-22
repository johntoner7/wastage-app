import "./ErrorBanner.css";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="errorbanner">
      <span className="errorbanner__text">{message}</span>
      {onRetry && (
        <button type="button" className="errorbanner__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
