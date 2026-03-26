# Recipe: Image Viewer with Drawing

ImageViewer + DrawingLayer + useDrawingCanvas 조합으로 이미지 위에 rect/point를 그리는 화면.

## 코드

```tsx
import { useState } from 'react'
import {
  ImageViewer, ImageViewerToolbar, DrawingLayer,
  useZoomPan, useDrawingCanvas, useUndoRedo,
  ModeSwitcher,
  type DrawingObject,
} from '@ingradient/ui/components'

function AnnotationViewer({ imageUrl }: { imageUrl: string }) {
  const [mode, setMode] = useState<'cursor' | 'rect' | 'point'>('cursor')
  const zoom = useZoomPan()
  const history = useUndoRedo<DrawingObject[]>({ initialState: [] })

  const { selectedId, drawingPreview, cursor, bindings } = useDrawingCanvas({
    objects: history.state,
    mode,
    onObjectsChange: history.setState,
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <ModeSwitcher
          options={[
            { value: 'cursor', label: 'Select' },
            { value: 'rect', label: 'Rect' },
            { value: 'point', label: 'Point' },
          ]}
          value={mode}
          onChange={(v) => setMode(v as typeof mode)}
          size="sm"
        />
        <ImageViewerToolbar
          zoom={zoom.zoom}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onReset={zoom.reset}
        />
      </div>

      <div style={{ height: 500, cursor }} {...bindings}>
        <ImageViewer src={imageUrl} zoomOptions={{ maxZoom: 5 }}>
          <DrawingLayer
            objects={history.state}
            selectedId={selectedId}
            drawingPreview={drawingPreview}
            showHandles
          />
        </ImageViewer>
      </div>
    </div>
  )
}
```

## 앱에서 추가로 처리할 것

- class/color 할당: `DrawingObject.color`와 `label`을 앱 로직에서 설정
- 저장 API 호출: `history.state`를 서버로 전송
- 키보드 단축키: Delete, Ctrl+Z/Y 등 앱에서 바인딩
