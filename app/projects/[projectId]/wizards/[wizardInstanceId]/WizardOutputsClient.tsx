'use client'

import { useState } from 'react'

type WizardOutputsClientProps = {
  customerSummary: string
  pmDraft: string
}

export default function WizardOutputsClient({
  customerSummary,
  pmDraft,
}: WizardOutputsClientProps) {
  const [copied, setCopied] = useState<'customer' | 'pm' | null>(null)

  const handleCopy = async (text: string, type: 'customer' | 'pm') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        These summaries are generated from the wizard inputs above and can be copied for
        customer communication or PM handover.
      </p>

      {/* Customer Summary */}
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0 }}>Customer Summary</h3>
          <button
            onClick={() => handleCopy(customerSummary, 'customer')}
            style={{
              padding: '8px 16px',
              backgroundColor: copied === 'customer' ? '#28a745' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {copied === 'customer' ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          A customer-friendly summary of their submission. Share this with the customer as
          confirmation.
        </p>
        <pre
          style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '13px',
            lineHeight: '1.6',
            overflow: 'auto',
            maxHeight: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {customerSummary}
        </pre>
      </div>

      {/* PM / Zendesk Draft */}
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '20px',
          backgroundColor: '#fff8e1',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0 }}>PM / Zendesk Draft</h3>
          <button
            onClick={() => handleCopy(pmDraft, 'pm')}
            style={{
              padding: '8px 16px',
              backgroundColor: copied === 'pm' ? '#28a745' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {copied === 'pm' ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          Structured handover information for Project Managers. Copy and paste into Zendesk or
          internal tracking systems.
        </p>
        <pre
          style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '13px',
            lineHeight: '1.6',
            overflow: 'auto',
            maxHeight: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'monospace',
          }}
        >
          {pmDraft}
        </pre>
      </div>
    </div>
  )
}
