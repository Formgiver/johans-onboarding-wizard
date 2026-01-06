/**
 * Wizard Output Generation Utilities
 * 
 * Functions to generate customer summaries and PM/Zendesk draft outputs
 * from wizard step inputs. These are derived data, not persisted.
 */

type WizardStepData = {
  step_key: string
  title: string
  description: string | null
  step_type: string
  position: number
  is_required: boolean
  input_value: unknown
}

/**
 * Generate a customer-friendly summary of what they've submitted
 */
export function generateCustomerSummary(
  wizardName: string,
  steps: WizardStepData[]
): string {
  const lines: string[] = []

  lines.push(`# ${wizardName} - Your Submission Summary`)
  lines.push('')
  lines.push('Thank you for completing this onboarding wizard. Here is a summary of the information you provided:')
  lines.push('')

  const stepsWithInput = steps.filter(
    (step) => step.input_value !== null && step.input_value !== undefined && step.input_value !== ''
  )

  if (stepsWithInput.length === 0) {
    lines.push('No information has been submitted yet.')
    return lines.join('\n')
  }

  stepsWithInput.forEach((step) => {
    lines.push(`## ${step.position}. ${step.title}`)
    
    if (step.description) {
      lines.push(`*${step.description}*`)
    }

    const formattedValue = formatValueForDisplay(step.input_value, step.step_type)
    lines.push(`**Answer:** ${formattedValue}`)
    lines.push('')
  })

  lines.push('---')
  lines.push('If you need to make changes, please contact your project manager.')

  return lines.join('\n')
}

/**
 * Generate a structured PM/Zendesk draft for handover or support ticket
 */
export function generatePMZendeskDraft(
  wizardName: string,
  projectName: string,
  organizationName: string,
  steps: WizardStepData[]
): string {
  const lines: string[] = []

  lines.push('='.repeat(60))
  lines.push(`ONBOARDING INFORMATION: ${wizardName}`)
  lines.push('='.repeat(60))
  lines.push('')
  lines.push(`Organization: ${organizationName}`)
  lines.push(`Project: ${projectName}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('-'.repeat(60))
  lines.push('')

  const stepsWithInput = steps.filter(
    (step) => step.input_value !== null && step.input_value !== undefined && step.input_value !== ''
  )

  if (stepsWithInput.length === 0) {
    lines.push('⚠️ NO INFORMATION SUBMITTED YET')
    lines.push('')
    lines.push('Customer has not completed any steps in this wizard.')
    return lines.join('\n')
  }

  // Group required vs optional
  const requiredSteps = stepsWithInput.filter((s) => s.is_required)
  const optionalSteps = stepsWithInput.filter((s) => !s.is_required)

  if (requiredSteps.length > 0) {
    lines.push('📋 REQUIRED INFORMATION')
    lines.push('')
    requiredSteps.forEach((step) => {
      lines.push(`[${step.step_key}] ${step.title}`)
      const formattedValue = formatValueForDisplay(step.input_value, step.step_type)
      lines.push(`  → ${formattedValue}`)
      lines.push('')
    })
  }

  if (optionalSteps.length > 0) {
    lines.push('-'.repeat(60))
    lines.push('')
    lines.push('📝 ADDITIONAL INFORMATION')
    lines.push('')
    optionalSteps.forEach((step) => {
      lines.push(`[${step.step_key}] ${step.title}`)
      const formattedValue = formatValueForDisplay(step.input_value, step.step_type)
      lines.push(`  → ${formattedValue}`)
      lines.push('')
    })
  }

  lines.push('='.repeat(60))
  lines.push('END OF ONBOARDING INFORMATION')
  lines.push('='.repeat(60))

  return lines.join('\n')
}

/**
 * Format a value for human-readable display based on its type
 */
function formatValueForDisplay(value: unknown, stepType: string): string {
  if (value === null || value === undefined) {
    return '(not provided)'
  }

  if (stepType === 'checkbox') {
    return value === true ? '✓ Yes' : '✗ No'
  }

  if (typeof value === 'string') {
    return value.trim() || '(empty)'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  // For complex objects, use JSON representation
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

/**
 * Calculate completion statistics for display
 */
export function calculateCompletionStats(steps: WizardStepData[]): {
  total: number
  completed: number
  required: number
  requiredCompleted: number
  percentComplete: number
} {
  const total = steps.length
  const required = steps.filter((s) => s.is_required).length

  const completed = steps.filter(
    (s) => s.input_value !== null && s.input_value !== undefined && s.input_value !== ''
  ).length

  const requiredCompleted = steps.filter(
    (s) =>
      s.is_required &&
      s.input_value !== null &&
      s.input_value !== undefined &&
      s.input_value !== ''
  ).length

  const percentComplete = required > 0 ? Math.round((requiredCompleted / required) * 100) : 100

  return {
    total,
    completed,
    required,
    requiredCompleted,
    percentComplete,
  }
}
