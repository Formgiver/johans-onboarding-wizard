import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WizardsPage({
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
        <h1>Wizards</h1>
        <p>You must be logged in to view wizards.</p>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go to login
        </Link>
      </div>
    )
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .single()

  if (!project) {
    notFound()
  }

  const { data: instances, error } = await supabase
    .from('wizard_instances')
    .select(`
      id,
      status,
      activated_at,
      created_at,
      wizards (
        id,
        name,
        description
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
        <h1>Wizards</h1>
        <p style={{ color: 'red' }}>Error loading wizards: {error.message}</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
      <Link
        href={`/projects/${projectId}`}
        style={{ color: '#0070f3', textDecoration: 'underline' }}
      >
        ← Back to Project
      </Link>
      <h1 style={{ marginTop: '20px' }}>Wizards for {project.name}</h1>

      {instances && instances.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          {instances.map((instance: { id: string; status: string; created_at: string; wizards: unknown }) => {
            const wizard = instance.wizards as { id: string; name: string; description: string | null } | null
            return (
              <li
                key={instance.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '12px',
                }}
              >
                <h2 style={{ margin: '0 0 8px 0' }}>
                  {wizard?.name || 'Unknown Wizard'}
                </h2>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  Status: <strong>{instance.status}</strong>
                </p>
                <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                  Created: {new Date(instance.created_at).toLocaleDateString()}
                </p>
                <Link
                  href={`/projects/${projectId}/wizards/${instance.id}`}
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
                  View Details
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p style={{ marginTop: '30px' }}>No wizard instances found for this project.</p>
      )}
    </div>
  )
}
