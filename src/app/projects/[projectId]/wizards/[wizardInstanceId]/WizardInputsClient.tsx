'use client'

import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Button, Alert } from '@/components/ui'

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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                type="checkbox"
                id={`input-${step.step_id}`}
                checked={(value as boolean) || false}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [step.step_id]: e.target.checked }))
                }
                className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm/6">
              <label htmlFor={`input-${step.step_id}`} className="font-medium text-gray-900 cursor-pointer">
                {(step.config.label as string) || 'Confirm'}
              </label>
            </div>
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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        )

      default:
        return (
          <textarea
            id={`input-${step.step_id}`}
            value={JSON.stringify(step.existing_data, null, 2)}
            readOnly
            className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-xs font-mono text-gray-900 outline-1 -outline-offset-1 outline-gray-300 min-h-20"
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
            className="rounded-lg bg-white shadow-sm inset-ring inset-ring-gray-200 p-6 mb-6"
          >
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {step.position}. {step.title}
                {step.is_required && <span className="text-red-600"> *</span>}
              </h3>
              {step.description && (
                <p className="mt-1 text-sm text-gray-600">{step.description}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor={`input-${step.step_id}`} className="block text-sm font-medium text-gray-900 mb-2">
                  {step.step_type === 'checkbox' ? '' : 'Your answer'}
                </label>
                {renderStepInput(step)}
              </div>

              <div className="flex items-center gap-x-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave(step.step_id)}
                  disabled={saving[step.step_id]}
                >
                  {saving[step.step_id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 size-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>

                {messages[step.step_id] && (
                  <div className="flex items-center gap-x-2">
                    {messages[step.step_id].type === 'success' ? (
                      <>
                        <CheckCircleIcon className="size-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {messages[step.step_id].text}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="size-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          {messages[step.step_id].text}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
