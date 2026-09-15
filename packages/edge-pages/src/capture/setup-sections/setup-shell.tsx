// Setup 패널의 접이식 절. `<details>` 의 기본 마커를 걷어내고 화살표를 오른쪽에 둔다.
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { rotations } from '@ingradient/ui'
import { ChevronDownIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { surfacePanel } from '@ingradient/ui/primitives'

export const SetupAccordion = styled.details`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  overflow: hidden;

  summary {
    cursor: pointer;
    padding: var(--ig-space-6) var(--ig-space-7);
    list-style: none;
    font-weight: var(--ig-font-weight-semibold);
  }

  summary::-webkit-details-marker { display: none; }

  > div {
    padding: 0 var(--ig-space-7) var(--ig-space-7);
    display: flex;
    flex-direction: column;
    gap: var(--ig-space-4);
    color: var(--ig-color-text-muted);
  }
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    transition: transform var(--ig-motion-normal-ease);
    opacity: var(--ig-opacity-muted);
  }

  details[open] & svg {
    transform: rotate(${rotations.half});
  }
`

export function SetupAccordionSummary({ children }: { children: ReactNode }): JSX.Element {
  return (
    <SummaryRow>
      {children}
      <ChevronDownIcon size={iconSizeNumbers.md} />
    </SummaryRow>
  )
}
