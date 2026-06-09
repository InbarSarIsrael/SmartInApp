// Shows total views, clicks, and dismisses as a simple funnel.
function EngagementFunnelChart({ analytics }) {
  const views = analytics ? analytics.views : 0
  const clicks = analytics ? analytics.clicks : 0
  const dismisses = analytics ? analytics.dismisses : 0

  const maxValue = Math.max(views, clicks, dismisses, 1)

  const items = [
    { label: 'Total Views', value: views },
    { label: 'Total Clicks', value: clicks },
    { label: 'Total Dismisses', value: dismisses },
  ]

  return (
    <div className="chart-card">
      <h3>Engagement Funnel</h3>

      <div className="funnel-chart">
        {items.map((item) => {
          const height = (item.value / maxValue) * 100

          return (
            <div className="funnel-item" key={item.label}>
              <div className="funnel-bar-wrap">
                <div
                  className="funnel-bar"
                  style={{ height: `${height}%` }}
                />
              </div>

              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EngagementFunnelChart
