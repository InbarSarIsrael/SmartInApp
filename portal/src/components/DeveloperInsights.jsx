// Summarizes SDK tracking health and user interaction rates.
function DeveloperInsights({ analytics }) {
  const views = analytics ? analytics.views : 0
  const clicks = analytics ? analytics.clicks : 0
  const dismisses = analytics ? analytics.dismisses : 0

  const ctr = views > 0 ? (clicks / views) * 100 : 0
  const dismissRate = views > 0 ? (dismisses / views) * 100 : 0
  const interactionRate = views > 0 ? ((clicks + dismisses) / views) * 100 : 0

  const diagnostics = [
    {
      label: 'View Tracking',
      description: 'Checks if the SDK is sending view events.',
      status: views > 0 ? 'Tracking OK' : 'Waiting for views',
      tone: views > 0 ? 'healthy' : 'waiting',
    },
    {
      label: 'Click Tracking',
      description: 'Checks if CTA clicks are being reported.',
      status:
        views > 0 && clicks === 0
          ? 'Check CTA events'
          : clicks > 0
            ? 'Tracking OK'
            : 'Waiting for clicks',
      tone: views > 0 && clicks === 0 ? 'warning' : clicks > 0 ? 'healthy' : 'waiting',
    },
    {
      label: 'Dismiss Pressure',
      description: 'Shows if users close messages too often.',
      status:
        views > 0 && dismissRate > 50
          ? 'High dismiss rate'
          : views > 0
            ? 'Looks stable'
            : 'Waiting for data',
      tone: views > 0 && dismissRate > 50 ? 'warning' : views > 0 ? 'healthy' : 'waiting',
    },
  ]

  const metrics = [
    {
      label: 'CTR',
      value: `${ctr.toFixed(1)}%`,
      description: 'Clicks out of total views.',
    },
    {
      label: 'Dismiss Rate',
      value: `${dismissRate.toFixed(1)}%`,
      description: 'Dismisses out of total views.',
    },
    {
      label: 'Interaction Rate',
      value: `${interactionRate.toFixed(1)}%`,
      description: 'Clicks and dismisses out of total views.',
    },
  ]

  return (
    <div className="chart-card developer-insights-card">
      <div className="developer-insights-header">
        <h3>Developer Insights</h3>
        <p>
          A quick health check for the SDK analytics events and how users react
          after seeing in-app messages.
        </p>
      </div>

      <div className="developer-metrics">
        {metrics.map((metric) => (
          <div className="developer-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.description}</small>
          </div>
        ))}
      </div>

      <div className="developer-diagnostics">
        {diagnostics.map((item) => (
          <div className="diagnostic-row" key={item.label}>
            <div>
              <span>{item.label}</span>
              <small>{item.description}</small>
            </div>
            <strong className={`diagnostic-status ${item.tone}`}>
              {item.status}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeveloperInsights
