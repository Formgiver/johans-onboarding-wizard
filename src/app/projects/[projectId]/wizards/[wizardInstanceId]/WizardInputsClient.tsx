'use client'

import { useState } from 'react'

type StepInput = {
  step_id: string
  step_key: string
  title: string
  description: string | null
  position: number
  is_required: boolean
  existing_data: Record<string, unknown>
}

type WizardInputsClientProps = {
  wizardInstanceId: string
  steps: StepInput[]
}

export default function WizardInputsClient({
  wizardInstanceId,
  steps,
}: WizardInputsClientProps) {
  const [stepData, setStepData] = useState<Record<string, string>>(
    steps.reduce((acc, step) => {
      acc[step.step_id] = JSON.stringify(step.existing_data, null, 2)
      return acc
    }, {} as Record<string, string>)
  )

  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({})

  const handleSave = async (stepId: string) => {
    setSaving((prev) => ({ ...prev, [stepId]: true }))
    setMessages((prev) => {
      const copy = { ...prev }
      delete copy[stepId]
      return copy
    })

    let parsedData: Record<string, unknown>
    try {
      parsedData = JSON.parse(stepData[stepId] || '{}')
    } catch {
      setMessages((prev) => ({
        ...prev,
        [stepId]: { type: 'error', text: 'Invalid JSON format' },
      }))
      setSaving((prev) => ({ ...prev, [stepId]: false }))
      return
    }

    try {
      const response = await fetch('/api/wizard-inputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wizard_instance_id: wizardInstanceId,
          wizard_step_id: stepId,
          data: parsedData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      setMessages((prev) => ({
        ...prev,
        [stepId]: { type: 'success', text: 'Saved successfully' },
      }))
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [stepId]: {
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to save',
        },
      }))
    } finally {
      setSaving((prev) => ({ ...prev, [stepId]: false }))
    }
  }

  return (
    <div>
      {steps.map((step) => (
        <div
          key={step.step_id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>
            {step.position}. {step.title}
            {step.is_required && <span style={{ color: 'red' }}> *</span>}
          </h3>
          {step.description && <p style={{ color: '#666', fontSize: '14px' }}>{step.description}</p>}

          <label htmlFor={`input-${step.step_id}`} style={{ display: 'block', marginTop: '12px', fontWeight: 'bold' }}>
            Input Data (JSON):
          </label>
          <textarea
            id={`input-${step.step_id}`}
            value={stepData[step.step_id] || '{}'}
            onChange={(e) =>
              setStepData((prev) => ({ ...prev, [step.step_id]: e.target.value }))
            }
            style={{
              width: '100%',
              minHeight: '120px',
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '8px',
            }}
          />

          <button
            onClick={() => handleSave(step.step_id)}
            disabled={saving[step.step_id]}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: saving[step.step_id] ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving[step.step_id] ? 'not-allowed' : 'pointer',
            }}
          >
            {saving[step.step_id] ? 'Saving...' : 'Save'}
          </button>

          {messages[step.step_id] && (
            <p
              style={{
                marginTop: '8px',
                color: messages[step.step_id].type === 'success' ? 'green' : 'red',
                fontSize: '14px',
              }}
            >
              {messages[step.step_id].text}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
