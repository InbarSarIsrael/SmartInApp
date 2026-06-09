import './App.css'
import KpiCard from './components/KpiCard'
import MessagesTable from './components/MessagesTable'
import { useEffect, useState } from 'react'
import MessageDetails from './pages/MessageDetails'
import MessageForm from './pages/MessageForm'
import TopMessagesChart from './components/TopMessagesChart'
import EngagementFunnelChart from './components/EngagementFunnelChart'
import DeveloperInsights from './components/DeveloperInsights'
import CtrOverTimeChart from './components/CtrOverTimeChart'
import { API_BASE_URL } from './config'
import LoginPage from './pages/LoginPage'

const LIVE_REFRESH_INTERVAL_MS = 3000

// Loads the main analytics counters for the dashboard.
const fetchDashboardAnalytics = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/analytics/project/${projectId}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics')
  }

  return response.json()
}

// Loads the current message status summary for a project.
const fetchMessageStatusSummary = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/messages/project/${projectId}/status-summary`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch message status summary')
  }

  return response.json()
}

// Loads the project messages with the highest CTR.
const fetchTopMessages = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/analytics/project/${projectId}/top-messages`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch top messages')
  }

  return response.json()
}

// Loads the CTR history points used by the line chart.
const fetchCtrOverTime = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/analytics/project/${projectId}/ctr-over-time`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch CTR over time')
  }

  return response.json()
}

// Controls portal login state, dashboard data, and page navigation.
function App() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null)
  const [messageStatusSummary, setMessageStatusSummary] = useState(null)
  const [topMessages, setTopMessages] = useState([])
  const [ctrOverTime, setCtrOverTime] = useState([])

  const savedProject = JSON.parse(localStorage.getItem('smartinapp_project'))

  const [projectId, setProjectId] = useState(savedProject?.project_id || null)
  const [project, setProject] = useState(savedProject || null)

  useEffect(() => {
    if (!projectId) {
      return
    }
    let isActive = true

    // Refreshes all live dashboard widgets together.
    const loadDashboardData = async () => {
      try {
        const [
          analyticsData,
          statusSummaryData,
          topMessagesData,
          ctrOverTimeData,
        ] = await Promise.all([
          fetchDashboardAnalytics(projectId),
          fetchMessageStatusSummary(projectId),
          fetchTopMessages(projectId),
          fetchCtrOverTime(projectId),
        ])

        if (!isActive) {
          return
        }

        setDashboardAnalytics(analyticsData)
        setMessageStatusSummary(statusSummaryData)
        setTopMessages(topMessagesData.messages)
        setCtrOverTime(ctrOverTimeData.points)
      } catch {
        setDashboardAnalytics(null)
        setMessageStatusSummary(null)
        setTopMessages([])
        setCtrOverTime([])
      }
    }

    loadDashboardData()
    const refreshInterval = window.setInterval(
      loadDashboardData,
      LIVE_REFRESH_INTERVAL_MS
    )

    return () => {
      isActive = false
      window.clearInterval(refreshInterval)
    }
  }, [projectId])

  // Toggles a message status and refreshes the status summary.
  const handleToggleEnabled = async (message) => {
    const response = await fetch(
      `${API_BASE_URL}/messages/${message.message_id}/enabled`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !message.enabled,
        }),
      }
    )

    if (!response.ok) {
      alert('Failed to update message status')
      return
    }

    try {
      const data = await fetchMessageStatusSummary(projectId)
      setMessageStatusSummary(data)
    } catch {
      alert('Failed to refresh message status summary')
    }
  }

  if (!project) {
    return (
      <LoginPage
        onLogin={(loggedProject) => {
          localStorage.setItem(
            'smartinapp_project',
            JSON.stringify(loggedProject)
          )
          setProject(loggedProject)
          setProjectId(loggedProject.project_id)
        }}
      />
    )
  }

  if (selectedMessage) {
    return (
      <MessageDetails
        message={selectedMessage}
        onBack={() => setSelectedMessage(null)}
        onDelete={() => setSelectedMessage(null)}
        onEdit={(message) => {
          setSelectedMessage(null)
          setEditingMessage(message)
        }}
      />
    )
  }

  if (editingMessage) {
    return (
      <MessageForm
        message={editingMessage}
        projectId={projectId}
        onBack={() => setEditingMessage(null)}
      />
    )
  }

  return (
    <div className="app">
      <div className="dashboard-header">
        <h1 className="dashboard-title">SmartInApp Dashboard</h1>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('smartinapp_project')
            setProject(null)
            setProjectId(null)
          }}
        >
          Logout
        </button>
      </div>

      <h1 className="dashboard-title"> {project.project_name} Dashboard </h1>
      <h2 className="section-title">Overview</h2>

      <h3 className="sub-section-title">Message Status Summary</h3>

      <div className="kpi-container">
        <KpiCard
          title="Active"
          value={messageStatusSummary ? messageStatusSummary.active : 0}
        />

        <KpiCard
          title="Future"
          value={messageStatusSummary ? messageStatusSummary.future : 0}
        />

        <KpiCard
          title="Disabled"
          value={messageStatusSummary ? messageStatusSummary.disabled : 0}
        />

        <KpiCard
          title="Expired"
          value={messageStatusSummary ? messageStatusSummary.expired : 0}
        />
      </div>

      <h3 className="sub-section-title">Top Messages by CTR</h3>
      <TopMessagesChart messages={topMessages} />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Views</th>
            <th>Clicks</th>
            <th>CTR</th>
          </tr>
        </thead>

        <tbody>
          {topMessages.map((message, index) => (
            <tr
              className={index === 0 ? 'top-message-row' : ''}
              key={message.message_id}
            >
              <td>{message.title}</td>
              <td>{message.views}</td>
              <td>{message.clicks}</td>
              <td>{message.ctr.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-title">Messages</h2>

      <div className="button-container">
        <button
          className="create-button"
          onClick={() => setEditingMessage({})}
        >
          + Create Message
        </button>
      </div>

      <MessagesTable
        projectId={projectId}
        onViewMessage={setSelectedMessage}
        onEditMessage={setEditingMessage}
        onToggleEnabled={handleToggleEnabled}
      />

      <h2 className="section-title">Analytics</h2>

      <EngagementFunnelChart analytics={dashboardAnalytics} />

      <CtrOverTimeChart points={ctrOverTime} />

      <DeveloperInsights analytics={dashboardAnalytics} />
    </div>
  )
}

export default App
