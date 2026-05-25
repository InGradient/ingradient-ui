import React from 'react'
import { Box, Stack, Text } from '../../primitives'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const ROW_GRID_STYLE = {
  display: 'grid' as const,
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 'var(--ig-space-5)',
  alignItems: 'center' as const,
}

const COPY_STYLE = { minWidth: 0, gap: 'var(--ig-space-1)' }

export function LabelValueRow({
  title,
  description,
  meta,
  control,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  control?: React.ReactNode
}) {
  return (
    <Card
      elevation="panel"
      radius="var(--ig-radius-lg)"
      padding="var(--ig-space-6) var(--ig-space-7)"
    >
      <Box style={ROW_GRID_STYLE}>
        <Stack gap={1} style={COPY_STYLE}>
          <ActionBar>
            <Text size="14px" weight={700}>{title}</Text>
            {meta}
          </ActionBar>
          {description ? <Text size="12px" tone="muted">{description}</Text> : null}
        </Stack>
        {control}
      </Box>
    </Card>
  )
}
