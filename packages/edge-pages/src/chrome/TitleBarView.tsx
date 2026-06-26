import { iconSizeNumbers } from '@ingradient/ui'
import {
  WindowMinimizeIcon, WindowRestoreIcon, WindowCloseIcon, WindowMaximizeIcon,
} from '@ingradient/ui/components'
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
          : <BrandMark size={iconSizeNumbers.lg} alt={logoAlt} />}
        <LogoText>{labels.appName}</LogoText>
      </LogoArea>
      <DragRegion />
      <Controls>
        <Btn onClick={onMinimize} title={labels.minimize}>
          <WindowMinimizeIcon size={iconSizeNumbers.xs} strokeWidth={2} />
        </Btn>
        <Btn onClick={onMaximize} title={isMaximized ? labels.restore : labels.maximize}>
          {isMaximized
            ? <WindowRestoreIcon size={iconSizeNumbers["2xs"]} strokeWidth={2} />
            : <WindowMaximizeIcon size={iconSizeNumbers["2xs"]} strokeWidth={2} />}
        </Btn>
        <Btn $variant="close" onClick={onClose} title={labels.close}>
          <WindowCloseIcon size={iconSizeNumbers.xsPlus} strokeWidth={2} />
        </Btn>
      </Controls>
    </Bar>
  )
}
