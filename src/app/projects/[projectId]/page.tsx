import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
        <h1>Project</h1>
        <p>You must be logged in to view this project.</p>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go to login
        </Link>
      </div>
    )
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .eq('id', projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
      <Link href="/projects" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Back to Projects
      </Link>
      <h1 style={{ marginTop: '20px' }}>{project.name}</h1>
      <p style={{ color: '#666' }}>
        Status: <strong>{project.status}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Created: {new Date(project.created_at).toLocaleDateString()}
      </p>

      <nav style={{ marginTop: '40px' }}>
        <Link
          href={`/projects/${projectId}/wizards`}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          View Wizards
        </Link>
      </nav>
    </div>
  )
}
