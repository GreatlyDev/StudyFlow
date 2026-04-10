function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDate(first, second) {
  return toIsoDate(first) === toIsoDate(second);
}

function buildCalendarDays(displayDate) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const firstDay = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstDay);

  const lastDay = (lastOfMonth.getDay() + 6) % 7;
  const endDate = new Date(lastOfMonth);
  endDate.setDate(lastOfMonth.getDate() + (6 - lastDay));

  const days = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

export default function CalendarWidget({ displayDate, selectedDate, eventDates = [] }) {
  const days = buildCalendarDays(displayDate);
  const selected = selectedDate || displayDate;
  const eventSet = new Set(eventDates);

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <div className="cal-month">{monthFormatter.format(displayDate)}</div>
        <div className="cal-year">{displayDate.getFullYear()}</div>
      </div>

      <div className="cal-grid">
        {["M", "T", "W", "T", "F", "S", "S"].map((label) => (
          <div key={label} className="cal-day-label">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const isoDate = toIsoDate(day);
          const classNames = [
            "cal-date",
            day.getMonth() !== displayDate.getMonth() ? "muted" : "",
            sameDate(day, selected) ? "active" : "",
            eventSet.has(isoDate) ? "has-event" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={isoDate} className={classNames}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
