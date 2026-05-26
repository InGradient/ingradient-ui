import { Minus, Minimize2, X, Maximize2 } from 'lucide-react'
import { BrandMark } from '@ingradient/ui/brand'
import {
  Bar, LogoArea, LogoImg, LogoText, DragRegion, Controls, Btn,
} from './TitleBarView.styles'
import type { TitleBarViewProps } from './types'

export function TitleBarView(props: TitleBarViewProps): JSX.Element {
  const {
    isMaximized, logoSrc, logoAlt = 'Ingradient', labels,
    onMinimize, onMaximize, onClose,
  } = props

  return (
    <Bar>
      <LogoArea>
        {logoSrc
          ? <LogoImg src={logoSrc} alt={logoAlt} draggable={false} />
          : <BrandMark size={18} alt={logoAlt} />}
        <LogoText>{labels.appName}</LogoText>
      </LogoArea>
      <DragRegion />
      <Controls>
        <Btn onClick={onMinimize} title={labels.minimize}>
          <Minus size={12} strokeWidth={2} />
        </Btn>
        <Btn onClick={onMaximize} title={isMaximized ? labels.restore : labels.maximize}>
          {isMaximized
            ? <Minimize2 size={11} strokeWidth={2} />
            : <Maximize2 size={11} strokeWidth={2} />}
        </Btn>
        <Btn $variant="close" onClick={onClose} title={labels.close}>
          <X size={13} strokeWidth={2} />
        </Btn>
      </Controls>
    </Bar>
  )
}
