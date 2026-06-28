import { Badge } from '../feedback/badge'

export function Stepper({
  steps,
  activeStep,
}: {
  steps: string[]
  activeStep: number
}) {
  return (
    <ol style={{ display: 'flex', gap: 'var(--ig-space-5)', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}>
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === activeStep ? 'step' : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}
        >
          <Badge $tone={index <= activeStep ? 'accent' : 'neutral'}>{index + 1}</Badge>
          <span style={{ color: index <= activeStep ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)' }}>{step}</span>
        </li>
      ))}
    </ol>
  )
}
