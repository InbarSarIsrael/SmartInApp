import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard'
import { API_BASE_URL } from '../config'

const LIVE_REFRESH_INTERVAL_MS = 3000

// Shows one message with live analytics and edit/delete actions.
function MessageDetails({ message, onBack, onDelete, onEdit }) {
  // Formats optional backend date values for display.
  const formatDate = (date) => {
    if (!date) {
      return 'None'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Invalid date'
    }

    return parsedDate.toLocaleString('en-GB')
  }

  // Confirms and deletes the selected message.
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this message?'
    )

    if (!confirmed) { return }

    const response = await fetch(
      `${API_BASE_URL}/messages/${message.message_id}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      alert('Failed to delete message')
      return
    }

    onDelete()
  }
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    let isActive = true

    // Loads the latest analytics for the selected message.
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/analytics/${message.message_id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const data = await response.json()

        if (!isActive) {
          return
        }

        setAnalytics(data)
      } catch {
        setAnalytics(null)
      }
    }

    fetchAnalytics()
    const refreshInterval = window.setInterval(
      fetchAnalytics,
      LIVE_REFRESH_INTERVAL_MS
    )

    return () => {
      isActive = false
      window.clearInterval(refreshInterval)
    }
  }, [message.message_id])

  // Converts CTR into a short human-readable performance label.
  const getPerformanceFeedback = () => {
    if (!analytics || analytics.views === 0) {
      return 'Not enough data yet'
    }

    if (analytics.ctr >= 10) {
      return 'Good performance'
    }

    if (analytics.ctr >= 3) {
      return 'Average performance'
    }

    return 'Low performance'
  }

  return (
    <div className="app">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <h1 className="dashboard-title">Message Details</h1>

      <div className="details-card">
        <div className="field-card">
          <h3>Title</h3>
          <p>{message.title}</p>
        </div>

        <div className="field-card">
          <h3>Content</h3>
          <p>{message.content}</p>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Type</span>
            <strong>{message.type}</strong>
          </div>

          <div className="detail-item">
            <span>Placement</span>
            <strong>{message.placement}</strong>
          </div>

          <div className="detail-item">
            <span>Button Text</span>
            <strong>{message.button_text || 'None'}</strong>
          </div>

          <div className="detail-item">
            <span>Action Target</span>
            <strong>{message.action_target || 'None'}</strong>
          </div>

          <div className="detail-item">
            <span>Start Date</span>
            <strong>{formatDate(message.start_date)}</strong>
          </div>

          <div className="detail-item">
            <span>End Date</span>
            <strong>{formatDate(message.end_date)}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>
              <span className={`status-badge ${message.status.toLowerCase()}`}>
                {message.status}
              </span>
            </strong>
          </div>

        </div>

        <div className="details-actions">
          <button className="edit-button" onClick={() => onEdit(message)}>
            Edit Message
          </button>

          <button className="delete-button" onClick={handleDelete}>
            Delete Message
          </button>
        </div>

      </div>

      {analytics && (
        <div className="details-card">
          <h2>Analytics</h2>

          <div className="kpi-container">
            <KpiCard
              title="Views"
              value={analytics.views}
            />
            <KpiCard title="Clicks" value={analytics.clicks} />

            <KpiCard title="Dismisses" value={analytics.dismisses} />

            <KpiCard title="CTR" value={`${analytics.ctr.toFixed(1)}%`} />
          </div>
          <p className="performance-feedback">
            {getPerformanceFeedback()}
          </p>
        </div>

      )}
    </div>
  )
}

export default MessageDetails
