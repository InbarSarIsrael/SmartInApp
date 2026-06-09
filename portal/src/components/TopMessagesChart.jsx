// Shows the highest CTR messages as horizontal bars.
function TopMessagesChart({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="chart-card">
        <h3>Top Messages by CTR</h3>
        <p className="empty-chart">No analytics data yet</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3>Top Messages by CTR</h3>

      <div className="bar-chart">
        {messages.map((message) => {
          const ctr = Math.min(message.ctr, 100)

          return (
            <div className="bar-row" key={message.message_id}>
              <div className="bar-label">
                <span>{message.title}</span>
                <strong>{message.ctr.toFixed(1)}%</strong>
              </div>

              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${ctr}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopMessagesChart
