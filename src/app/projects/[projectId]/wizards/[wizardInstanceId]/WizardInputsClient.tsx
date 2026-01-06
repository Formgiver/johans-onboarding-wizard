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
  step_type: 'text' | 'textarea' | 'select' | 'checkbox' | 'country_specific'
  config: Record<string, unknown>
}

type WizardInputsClientProps = {
  wizardInstanceId: string
  steps: StepInput[]
  projectCountry?: string
}

export default function WizardInputsClient({
  wizardInstanceId,
  steps,
  projectCountry,
}: WizardInputsClientProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    steps.reduce((acc, step) => {
      const existingValue = step.existing_data.value
      if (step.step_type === 'checkbox') {
        acc[step.step_id] = existingValue === true
      } else {
        acc[step.step_id] = existingValue || ''
      }
      return acc
    }, {} as Record<string, unknown>)
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

    try {
      const dataToSave = { value: formData[stepId] }

      const response = await fetch('/api/wizard-inputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wizard_instance_id: wizardInstanceId,
          wizard_step_id: stepId,
          data: dataToSave,
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

  const renderStepInput = (step: StepInput) => {
    const value = formData[step.step_id]

    switch (step.step_type) {
      case 'text':
        return (
          <input
            type="text"
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [step.step_id]: e.target.value }))
            }
            placeholder={(step.config.placeholder as string) || ''}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        )

      case 'textarea':
        return (
          <textarea
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [step.step_id]: e.target.value }))
            }
            placeholder={(step.config.placeholder as string) || ''}
            rows={(step.config.rows as number) || 4}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        )

      case 'select': {
        const options = (step.config.options as Array<{ value: string; label: string }>) || []
        return (
          <select
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [step.step_id]: e.target.value }))
            }
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="">-- Select --</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      }

      case 'checkbox':
        return (
          <div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id={`input-${step.step_id}`}
                checked={(value as boolean) || false}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [step.step_id]: e.target.checked }))
                }
                style={{ marginRight: '8px' }}
              />
              <span>{(step.config.label as string) || 'Confirm'}</span>
            </label>
          </div>
        )

      case 'country_specific':
        return (
          <input
            type="text"
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [step.step_id]: e.target.value }))
            }
            placeholder={(step.config.placeholder as string) || ''}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        )

      default:
        return (
          <textarea
            id={`input-${step.step_id}`}
            value={JSON.stringify(step.existing_data, null, 2)}
            readOnly
            style={{
              width: '100%',
              minHeight: '80px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
            }}
          />
        )
    }
  }

  return (
    <div>
      {steps.map((step) => {
        if (step.step_type === 'country_specific') {
          const allowedCountries = (step.config.countries as string[]) || []
          if (projectCountry && !allowedCountries.includes(projectCountry)) {
            return null
          }
        }

        return (
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
            {step.description && (
              <p style={{ color: '#666', fontSize: '14px' }}>{step.description}</p>
            )}

            <div style={{ marginTop: '12px' }}>
              {renderStepInput(step)}
            </div>

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
        )
      })}
    </div>
  )
}
