// Draws a line chart of CTR values over time.
function CtrOverTimeChart({ points }) {
  if (!points || points.length === 0) {
    return (
      <div className="chart-card">
        <h3>CTR Over Time</h3>
        <p className="chart-description">
          CTR means: out of all message views, how many became clicks. The line
          shows if that percentage goes up or down over time.
        </p>
        <p className="empty-chart">No CTR data yet</p>
      </div>
    )
  }

  const chartWidth = 640
  const chartHeight = 220
  const padding = 36
  const maxCtr = Math.max(...points.map((point) => point.ctr), 10)

  // Converts a point index into an SVG x-coordinate.
  const getX = (index) => {
    if (points.length === 1) {
      return chartWidth / 2
    }

    return padding + (index / (points.length - 1)) * (chartWidth - padding * 2)
  }

  // Converts a CTR value into an SVG y-coordinate.
  const getY = (ctr) => {
    return chartHeight - padding - (ctr / maxCtr) * (chartHeight - padding * 2)
  }

  const linePoints = points
    .map((point, index) => `${getX(index)},${getY(point.ctr)}`)
    .join(' ')

  const areaPoints = `
    ${padding},${chartHeight - padding}
    ${linePoints}
    ${chartWidth - padding},${chartHeight - padding}
  `

  // Formats chart dates for short axis labels.
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="chart-card">
      <h3>CTR Over Time</h3>
      <p className="chart-description">
        CTR means: out of all message views, how many became clicks. The line
        shows if that percentage goes up or down over time.
      </p>

      <div className="line-chart-wrap">
        <svg
          className="line-chart"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="CTR over time chart"
        >
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            className="chart-axis"
          />

          <polygon points={areaPoints} className="chart-area" />

          <polyline points={linePoints} className="chart-line" />

          {points.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={getX(index)}
                cy={getY(point.ctr)}
                r="5"
                className="chart-point"
              />

              <text
                x={getX(index)}
                y={chartHeight - 10}
                textAnchor="middle"
                className="chart-label"
              >
                {formatDate(point.date)}
              </text>

              <text
                x={getX(index)}
                y={getY(point.ctr) - 12}
                textAnchor="middle"
                className="chart-value"
              >
                {point.ctr.toFixed(1)}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default CtrOverTimeChart
