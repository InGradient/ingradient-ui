import { Badge } from '../feedback/badge'

export function Stepper({
  steps,
  activeStep,
}: {
  steps: string[]
  activeStep: number
}) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge $tone={index <= activeStep ? 'accent' : 'neutral'}>{index + 1}</Badge>
          <span style={{ color: index <= activeStep ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)' }}>{step}</span>
        </div>
      ))}
    </div>
  )
}
