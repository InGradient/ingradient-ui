# Recipe: Form Layout

FormGroup + FieldRow + NumberField + SearchField 조합으로 설정 폼.

## 코드

```tsx
import { useState } from 'react'
import {
  FormGroup, FieldRow, NumberField, SearchField, TextField,
} from '@ingradient/ui/components'

function SettingsForm() {
  const [exposure, setExposure] = useState(50)
  const [gain, setGain] = useState(1.0)
  const [name, setName] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormGroup title="Camera" description="Capture parameters">
        <FieldRow label="Exposure" hint="0~100">
          <NumberField value={exposure} onChange={setExposure} min={0} max={100} />
        </FieldRow>
        <FieldRow label="Gain" hint="0.1~10.0">
          <NumberField value={gain} onChange={setGain} min={0.1} max={10} step={0.1} />
        </FieldRow>
      </FormGroup>

      <FormGroup title="General">
        <FieldRow label="Project Name">
          <TextField value={name} onChange={(e) => setName(e.target.value)} />
        </FieldRow>
      </FormGroup>
    </div>
  )
}
```
