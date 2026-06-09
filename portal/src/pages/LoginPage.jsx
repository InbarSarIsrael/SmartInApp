import { useState } from 'react'
import { API_BASE_URL } from '../config'

// Handles project login and project creation for the portal.
function LoginPage({ onLogin }) {
  const [apiKey, setApiKey] = useState('')
  const [projectName, setProjectName] = useState('')
  const [createdApiKey, setCreatedApiKey] = useState('')
  const [error, setError] = useState('')
  const [signupError, setSignupError] = useState('')

  // Logs in to an existing project with its API key.
  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/portal/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      })

      if (!response.ok) {
        setError('Invalid API key')
        return
      }

      const data = await response.json()
      onLogin(data.project)
    } catch {
      setError('Failed to connect to server')
    }
  }

  // Creates a new project and shows its generated API key.
  const handleCreateProject = async (event) => {
    event.preventDefault()
    setSignupError('')
    setCreatedApiKey('')

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_name: projectName }),
      })

      if (!response.ok) {
        setSignupError('Failed to create project')
        return
      }

      const data = await response.json()
      setCreatedApiKey(data.project.api_key)
      setApiKey(data.project.api_key)
      setProjectName('')
    } catch {
      setSignupError('Failed to connect to server')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="login-brand">SmartInApp</div>

          <h1>Welcome back</h1>
          <p className="login-subtitle">
            Sign in with your project API key to manage messages and analytics.
          </p>

          <label htmlFor="api-key">Project API Key</label>

          <input
            id="api-key"
            type="text"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="pk_..."
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Enter Portal</button>
        </form>

        <hr />

        <form onSubmit={handleCreateProject}>
          <p className="login-subtitle">Don't have a project yet?</p>

          <h2>Create Project</h2>

          <label htmlFor="project-name">Project Name</label>

          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="BookStore App"
          />

          {signupError && <p className="login-error">{signupError}</p>}

          <button type="submit">Create</button>

          {createdApiKey && (
            <div className="created-key-box">
              <strong>Your API Key:</strong>
              <p>{createdApiKey}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginPage
