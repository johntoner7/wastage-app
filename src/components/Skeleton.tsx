import "./Skeleton.css";

export function ListSkeleton() {
  return (
    <div className="skeleton" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div className="skeleton__category" key={i}>
          <div className="skeleton__bar skeleton__bar--title" />
          {i === 0 &&
            [0, 1, 2].map((j) => (
              <div className="skeleton__row" key={j}>
                <div className="skeleton__badge" />
                <div className="skeleton__bar skeleton__bar--name" />
                <div className="skeleton__bar skeleton__bar--qty" />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
