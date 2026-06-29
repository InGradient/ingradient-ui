import type { VideoHTMLAttributes } from 'react'
import styled from 'styled-components'
import { gradientAngles } from '../../tokens/core'

export type VideoAspectRatio = '1/1' | '4/3' | '16/9' | '16/10' | '9/16'

const Frame = styled.div<{ $ratio?: VideoAspectRatio }>`
  position: relative;
  aspect-ratio: ${(p) => p.$ratio ?? 'auto'};
  background:
    linear-gradient(
      ${gradientAngles.diagonal},
      var(--ig-color-media-placeholder-a) 0%,
      var(--ig-color-media-placeholder-b) 100%
    ),
    var(--ig-color-surface-interactive);
  border-radius: var(--ig-radius-md);
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    display: block;
    background: var(--ig-color-surface-muted);
  }
`

export interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'children'> {
  src: string
  poster?: string
  ratio?: VideoAspectRatio
  controls?: boolean
}

/**
 * 토큰 기반 HTML5 비디오 래퍼. 토글 가능한 `ratio` 로 frame 비율을 잡고
 * 내부 `<video>` 는 cover 로 렌더링한다.
 */
export function VideoPlayer({
  src,
  poster,
  ratio,
  controls = true,
  ...rest
}: VideoPlayerProps) {
  return (
    <Frame $ratio={ratio}>
      <video src={src} poster={poster} controls={controls} {...rest} />
    </Frame>
  )
}
