function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TimelineCard({ item }) {
  if (item.variant === "blocked") {
    return (
      <div className="card-blocked">
        <span>{item.title}</span>
      </div>
    );
  }

  if (item.variant === "primary") {
    return (
      <div className="card-primary">
        <div className="card-row">
          <div>
            <div className="card-subtitle">{item.subtitle}</div>
            <div className="card-title">{item.title}</div>
          </div>
          {item.badge ? (
            <div className="badge-ai">
              <SparkIcon />
              {item.badge}
            </div>
          ) : null}
        </div>
        <div className="card-footer">
          <span>{item.footer}</span>
          <div className="card-icon-circle">
            <ArrowIcon />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-standard">
      <div className="card-subtitle">{item.subtitle}</div>
      <div className="card-title">{item.title}</div>
    </div>
  );
}

export default function StudyPlanTimeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <div
          key={item.id}
          className={`timeline-item ${item.variant === "primary" ? "active" : ""}`}
        >
          <div className="timeline-time">{item.timeLabel}</div>
          <div className="timeline-track">
            <div className="timeline-dot" />
            <div className="timeline-line" />
          </div>
          <div className="timeline-content">
            <TimelineCard item={item} />
            {!item.isLast ? <div className="time-divider" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
