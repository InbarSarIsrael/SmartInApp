import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config'

const MESSAGES_PER_PAGE = 5
const LIVE_REFRESH_INTERVAL_MS = 3000

// Shows project messages with live refresh and pagination.
function MessagesTable({
  projectId,
  onViewMessage,
  onEditMessage,
  onToggleEnabled,
}) {
  const [messages, setMessages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // Loads and sorts the latest messages for the project.
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/project/${projectId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      const sortedMessages = [...data.messages].sort(
        (firstMessage, secondMessage) =>
          secondMessage.message_id - firstMessage.message_id
      )

      setMessages(sortedMessages)
    } catch {
      setMessages([])
    }
  }, [projectId])

  useEffect(() => {
    if (!projectId) {
      return undefined
    }

    const initialRefreshTimeout = window.setTimeout(fetchMessages, 0)
    const refreshInterval = window.setInterval(
      fetchMessages,
      LIVE_REFRESH_INTERVAL_MS
    )

    return () => {
      window.clearTimeout(initialRefreshTimeout)
      window.clearInterval(refreshInterval)
    }
  }, [fetchMessages, projectId])

  // Toggles a message and reloads the table afterwards.
  const handleToggle = async (message) => {
    await onToggleEnabled(message)
    fetchMessages()
  }

  const totalPages = Math.max(1, Math.ceil(messages.length / MESSAGES_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  // Returns only the messages that belong on the current page.
  const paginatedMessages = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * MESSAGES_PER_PAGE
    const endIndex = startIndex + MESSAGES_PER_PAGE

    return messages.slice(startIndex, endIndex)
  }, [messages, safeCurrentPage])

  // Moves the table to the previous page.
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  // Moves the table to the next page.
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  return (
    <div className="messages-table-card">
      <table className="messages-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Placement</th>
            <th>AUDIENCE</th>
            <th>ACTION TARGET</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedMessages.map((message) => (
            <tr key={message.message_id}>
              <td>{message.title}</td>
              <td>{message.type}</td>
              <td>{message.placement}</td>
              <td>{message.target_audience || 'ALL'}</td>
              <td>{message.action_target || 'None'}</td>
              <td>
                <span className={`status-badge ${message.status.toLowerCase()}`}>
                  {message.status}
                </span>
              </td>

              <td>
                <div className="table-actions">
                  <button onClick={() => onViewMessage(message)}>
                    View
                  </button>

                  <button onClick={() => onEditMessage(message)}>
                    Edit
                  </button>

                  <button onClick={() => handleToggle(message)}>
                    {message.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {messages.length > MESSAGES_PER_PAGE && (
        <div className="table-pagination">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            Prev
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1

              return (
                <button
                  className={
                    page === safeCurrentPage
                      ? 'pagination-page active'
                      : 'pagination-page'
                  }
                  key={page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            className="pagination-button"
            disabled={safeCurrentPage === totalPages}
            onClick={goToNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default MessagesTable
