import { API_BASE_URL } from '../config'

// Handles creating and editing in-app messages.
function MessageForm({ message, projectId, onBack }) {
  const isEditMode = !!message.message_id

  // Converts backend dates into datetime-local input values.
  const formatDateForInput = (date) => {
    if (!date) {
      return ''
    }

    return date.slice(0, 16)
  }

  // Converts datetime-local values into backend-friendly timestamps.
  const formatDateForBackend = (date) => {
    if (!date) {
      return null
    }

    return `${date}:00`
  }

  // Removes the time part so date validation compares whole days.
  const getDateOnly = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  // Validates form data and sends create or update requests.
  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)

    const payload = {
      title: formData.get('title'),
      content: formData.get('content'),
      type: formData.get('type'),
      placement: formData.get('placement'),
      button_text: formData.get('button_text'),
      action_target: formData.get('action_target'),
      target_audience: formData.get('target_audience'),
      enabled: formData.get('enabled') === 'on',
      start_date: formatDateForBackend(formData.get('start_date')),
      end_date: formatDateForBackend(formData.get('end_date')),
    }

    const startDate = payload.start_date ? new Date(payload.start_date) : null
    const endDate = payload.end_date ? new Date(payload.end_date) : null
    const today = getDateOnly(new Date())
    const startDateOnly = startDate ? getDateOnly(startDate) : null
    const endDateOnly = endDate ? getDateOnly(endDate) : null

    if (startDateOnly && startDateOnly < today) {
      alert('Start Date cannot be earlier than today')
      return
    }

    if (endDateOnly && endDateOnly < today) {
      alert('End Date cannot be earlier than today')
      return
    }

    if (startDateOnly && endDateOnly && endDateOnly < startDateOnly) {
      alert('End Date cannot be earlier than Start Date')
      return
    }

    if (!isEditMode) {
      payload.project_id = projectId
    }

    const url = isEditMode
      ? `${API_BASE_URL}/messages/${message.message_id}`
      : `${API_BASE_URL}/messages`

    const method = isEditMode ? 'PATCH' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      alert('Failed to save message')
      return
    }

    onBack()
  }

  return (
    <div className="app">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <h1 className="dashboard-title">
        {isEditMode ? 'Edit Message' : 'New Message'}
      </h1>

      <form className="details-card" onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" defaultValue={message.title || ''} />

        <label>Content</label>
        <textarea name="content" defaultValue={message.content || ''} />

        <label>Type</label>
        <select name="type" defaultValue={message.type || 'DIALOG'}>
          <option value="DIALOG">DIALOG</option>
          <option value="BANNER">BANNER</option>
        </select>

        <label>Placement</label>
        <input name="placement" defaultValue={message.placement || ''} />

        <label>Button Text</label>
        <input name="button_text" defaultValue={message.button_text || ''} />

        <label>Action Target</label>
        <input
          name="action_target"
          defaultValue={message.action_target || ''}
          placeholder="home_screen"
        />

        <label>Target Audience</label>
        <input
          name="target_audience"
          defaultValue={message.target_audience || 'ALL'}
          placeholder="ALL"
        />

        <label className="checkbox-label">
          <input
            name="enabled"
            type="checkbox"
            defaultChecked={message.enabled ?? true}
          />
          Enabled
        </label>

        <label>Start Date</label>
        <input
          name="start_date"
          type="datetime-local"
          defaultValue={formatDateForInput(message.start_date)}
        />

        <label>End Date</label>
        <input
          name="end_date"
          type="datetime-local"
          defaultValue={formatDateForInput(message.end_date)}
        />

        <button className="create-button" type="submit">
          {isEditMode ? 'Save Changes' : 'Create Message'}
        </button>
      </form>
    </div>
  )
}

export default MessageForm
