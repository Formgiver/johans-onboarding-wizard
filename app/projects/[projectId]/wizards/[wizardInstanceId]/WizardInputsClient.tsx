'use client'

import { useState, useCallback } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'

/**
 * WizardInputsClient - Guided step input form
 * 
 * Design principles:
 * - Inputs feel guided, safe, and understandable
 * - Clear validation feedback
 * - Auto-save with visual confirmation
 * - Collapsible completed steps to reduce cognitive load
 */

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

type StepStatus = 'empty' | 'partial' | 'complete'

function getStepStatus(step: StepInput, value: unknown): StepStatus {
  if (step.step_type === 'checkbox') {
    return value === true ? 'complete' : 'empty'
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return 'complete'
  }
  return 'empty'
}

export default function WizardInputsClient({
  wizardInstanceId,
  steps,
  projectCountry,
}: WizardInputsClientProps) {
  // Initialize form data from existing data
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
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>(
    // Mark steps with existing data as saved
    steps.reduce((acc, step) => {
      if (step.existing_data.value !== undefined) {
        acc[step.step_id] = true
      }
      return acc
    }, {} as Record<string, boolean>)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    // Expand steps that are not completed
    steps.reduce((acc, step) => {
      const value = step.existing_data.value
      const isComplete = step.step_type === 'checkbox' 
        ? value === true 
        : typeof value === 'string' && value.trim().length > 0
      acc[step.step_id] = !isComplete
      return acc
    }, {} as Record<string, boolean>)
  )

  const handleSave = useCallback(async (stepId: string) => {
    setSaving((prev) => ({ ...prev, [stepId]: true }))
    setErrors((prev) => {
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

      setSavedStatus((prev) => ({ ...prev, [stepId]: true }))
      
      // Collapse after successful save if complete
      const step = steps.find(s => s.step_id === stepId)
      if (step) {
        const value = formData[stepId]
        const isComplete = step.step_type === 'checkbox'
          ? value === true
          : typeof value === 'string' && value.trim().length > 0
        if (isComplete) {
          setExpandedSteps((prev) => ({ ...prev, [stepId]: false }))
        }
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [stepId]: err instanceof Error ? err.message : 'Failed to save',
      }))
    } finally {
      setSaving((prev) => ({ ...prev, [stepId]: false }))
    }
  }, [formData, steps, wizardInstanceId])

  const handleChange = useCallback((stepId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [stepId]: value }))
    // Mark as unsaved when changed
    setSavedStatus((prev) => ({ ...prev, [stepId]: false }))
  }, [])

  const toggleStep = useCallback((stepId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
  }, [])

  // Filter out steps that don't apply to the project's country
  const visibleSteps = steps.filter((step) => {
    if (step.step_type === 'country_specific') {
      const allowedCountries = (step.config.countries as string[]) || []
      if (projectCountry && !allowedCountries.includes(projectCountry)) {
        return false
      }
    }
    return true
  })

  return (
    <div className="space-y-4">
      {visibleSteps.map((step, index) => {
        const value = formData[step.step_id]
        const status = getStepStatus(step, value)
        const isExpanded = expandedSteps[step.step_id]
        const isSaved = savedStatus[step.step_id]
        const isSaving = saving[step.step_id]
        const error = errors[step.step_id]

        return (
          <div
            key={step.step_id}
            className={`overflow-hidden rounded-lg bg-white shadow-sm ring-1 transition-all ${
              error 
                ? 'ring-red-300' 
                : status === 'complete' && isSaved
                  ? 'ring-green-200'
                  : 'ring-gray-200'
            }`}
          >
            {/* Step Header - Always visible */}
            <button
              type="button"
              onClick={() => toggleStep(step.step_id)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-x-3">
                {/* Step number/status indicator */}
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    status === 'complete' && isSaved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {status === 'complete' && isSaved ? (
                    <CheckIcon className="size-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step title */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {step.title}
                    {step.is_required && (
                      <span className="ml-1 text-red-500" aria-label="Required">*</span>
                    )}
                  </h3>
                  {!isExpanded && status === 'complete' && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {step.step_type === 'checkbox' 
                        ? 'Confirmed' 
                        : String(value).slice(0, 50) + (String(value).length > 50 ? '...' : '')
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                {isSaving && (
                  <span className="text-xs text-gray-500">Saving...</span>
                )}
                {status === 'complete' && isSaved && !isExpanded && (
                  <span className="inline-flex items-center gap-x-1 text-xs text-green-600">
                    <CheckCircleIcon className="size-4" />
                    Saved
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUpIcon className="size-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="size-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Step Content - Expandable */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-4">
                {step.description && (
                  <p className="mb-4 text-sm text-gray-600">{step.description}</p>
                )}

                {/* Input field */}
                <div className="space-y-4">
                  <StepInputField
                    step={step}
                    value={value}
                    onChange={(newValue) => handleChange(step.step_id, newValue)}
                  />

                  {/* Error message */}
                  {error && (
                    <div className="flex items-center gap-x-2 text-sm text-red-600">
                      <ExclamationCircleIcon className="size-4" />
                      {error}
                    </div>
                  )}

                  {/* Save button and status */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSave(step.step_id)}
                      disabled={isSaving}
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                      {isSaving ? (
                        <>
                          <svg className="mr-2 size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save answer'
                      )}
                    </button>

                    {isSaved && !isSaving && (
                      <span className="inline-flex items-center gap-x-1 text-sm text-green-600">
                        <CheckCircleIcon className="size-4" />
                        Saved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * StepInputField renders the appropriate input based on step type
 */
function StepInputField({
  step,
  value,
  onChange,
}: {
  step: StepInput
  value: unknown
  onChange: (value: unknown) => void
}) {
  const inputClasses = "block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"

  switch (step.step_type) {
    case 'text':
    case 'country_specific':
      return (
        <div>
          <label htmlFor={`input-${step.step_id}`} className="sr-only">
            {step.title}
          </label>
          <input
            type="text"
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={(step.config.placeholder as string) || 'Enter your answer...'}
            className={inputClasses}
          />
        </div>
      )

    case 'textarea':
      return (
        <div>
          <label htmlFor={`input-${step.step_id}`} className="sr-only">
            {step.title}
          </label>
          <textarea
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={(step.config.placeholder as string) || 'Enter your answer...'}
            rows={(step.config.rows as number) || 4}
            className={inputClasses}
          />
        </div>
      )

    case 'select': {
      const options = (step.config.options as Array<{ value: string; label: string }>) || []
      return (
        <div>
          <label htmlFor={`input-${step.step_id}`} className="sr-only">
            {step.title}
          </label>
          <select
            id={`input-${step.step_id}`}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select an option...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    case 'checkbox':
      return (
        <label className="flex cursor-pointer items-center gap-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
          <input
            type="checkbox"
            id={`input-${step.step_id}`}
            checked={(value as boolean) || false}
            onChange={(e) => onChange(e.target.checked)}
            className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <span className="text-sm text-gray-700">
            {(step.config.label as string) || 'I confirm this is correct'}
          </span>
        </label>
      )

    default:
      return (
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Unsupported input type: {step.step_type}</p>
        </div>
      )
  }
}
