import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
        <h1>Projects</h1>
        <p>You must be logged in to view projects.</p>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go to login
        </Link>
      </div>
    )
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
        <h1>Projects</h1>
        <p style={{ color: 'red' }}>Error loading projects: {error.message}</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Back to Home
      </Link>
      <h1 style={{ marginTop: '20px' }}>My Projects</h1>
      <p>Logged in as: {user.email}</p>
      {projects && projects.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map((project: { id: string; name: string; status: string; created_at: string }) => (
            <li
              key={project.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <h2 style={{ margin: '0 0 8px 0' }}>{project.name}</h2>
              <p style={{ margin: '4px 0', color: '#666' }}>
                Status: <strong>{project.status}</strong>
              </p>
              <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </p>
              <Link
                href={`/projects/${project.id}/wizards`}
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                View Wizards →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  )
}
