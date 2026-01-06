import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Johan's Onboarding Wizard</h1>
      <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '2rem' }}>
        Welcome to the BRP onboarding platform. Get started by exploring your projects.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Link
          href="/projects"
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
        >
          View My Projects
        </Link>

        <Link
          href="/login"
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            border: '1px solid #0070f3',
            color: '#0070f3',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
        >
          Login / Sign Up
        </Link>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Features</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>✅ Structured wizard workflows</li>
          <li>✅ Automatic progress tracking</li>
          <li>✅ Multiple input types (text, select, checkbox, etc.)</li>
          <li>✅ Country-specific fields</li>
          <li>✅ Customer summaries and PM handover drafts</li>
          <li>✅ Sales handover integration</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff8e1', borderRadius: '8px', fontSize: '0.875rem' }}>
        <p><strong>Note:</strong> You need to be logged in and have projects with wizard instances to see the full functionality.</p>
      </div>
    </div>
  );
}
  a:hover {
    opacity: 0.8;
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
