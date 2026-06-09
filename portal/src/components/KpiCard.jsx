// Displays one dashboard metric card.
function KpiCard(props) {
  return (
    <div className="kpi-card">
      <h2>{props.title}</h2>
      <p>{props.value}</p>
    </div>
  )
}

export default KpiCard
