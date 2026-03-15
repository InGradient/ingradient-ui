import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import type { Bbox, ClassItem, ImageItem, Point } from './types'

const GridCellSpinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

// --- Icons (inline SVG) ---
const CursorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 3l4 14 2-6 6-2L5 3z" />
  </svg>
)
const BboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="1" />
  </svg>
)
const PointIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
  </svg>
)
const ClassificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12.5L12.5 20a2 2 0 0 1-2.8 0L4 14.3a2 2 0 0 1 0-2.8L11.5 4A2 2 0 0 1 12.9 3.4H18a2 2 0 0 1 2 2v5.1a2 2 0 0 1-.6 1.4Z" />
    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)
const UndoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 10h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H3" />
    <path d="M3 10l4-4M3 10l4 4" />
  </svg>
)
const RedoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10H11a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5h10" />
    <path d="M21 10l-4-4M21 10l-4 4" />
  </svg>
)
const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)
const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)
const ZoomInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M11 8v6M8 11h6" />
  </svg>
)
const ZoomOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M8 11h6" />
  </svg>
)
const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
)
const ArchiveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" />
    <path d="M10 12h4" />
  </svg>
)
const DISCONNECTED_ANNOTATION_COLOR = '#7f8b9d'
const MAX_ANNOTATION_HISTORY = 50

// --- ImageDetailModal ---
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 0;
  cursor: default;
`
const ModalContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 95vw;
  max-width: 95vw;
  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100vw;
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    .mobile-sidebar-backdrop {
      display: block !important;
    }
  }
`
const MainArea = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
`
const ModalToolbar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  @media (max-width: 768px) {
    padding: 8px 12px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    .mobile-info-btn {
      display: flex !important;
    }
  }
`
const CoordReadout = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #aaa;
  user-select: all;
  white-space: normal;
  word-break: break-all;
  margin-right: 8px;
`
const IconBtn = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? '#444' : 'transparent')};
  color: #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover:not(:disabled) { background: #333; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const DangerIconBtn = styled(IconBtn)`
  color: #ff8f8f;
  &:hover:not(:disabled) {
    background: rgba(164, 44, 44, 0.22);
    color: #ffb3b3;
  }
`
const TopRightGroup = styled.div`
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
`
const CloseBtn = styled(IconBtn)``
const ContextMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
`
const ContextMenuList = styled.div.attrs<{ $x: number; $y: number }>((p) => ({
  style: { left: p.$x, top: p.$y },
}))<{ $x: number; $y: number }>`
  position: fixed;
  z-index: 101;
  min-width: 120px;
  padding: 4px 0;
  background: #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`
const ContextMenuItem = styled.div`
  position: relative;
  display: block;
  width: 100%;
`
const ContextMenuButton = styled.button<{ $danger?: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: none;
  color: ${(p) => (p.$danger ? '#e53935' : '#e0e0e0')};
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.08); }
`
const ContextMenuDeleteItem = styled(ContextMenuButton).attrs({ $danger: true })``
const ContextMenuSub = styled.div.attrs<{ $left: number; $top: number }>((p) => ({
  style: { left: p.$left, top: p.$top },
}))<{ $left: number; $top: number }>`
  position: fixed;
  z-index: 102;
  min-width: 140px;
  padding: 4px 0;
  background: #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`
const ContextMenuSubItem = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 14px;
  border: none;
  background: none;
  color: #e0e0e0;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.08); }
`
const ImageAndDotsRow = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;
`
const ImageWrap = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`
const GroupDotsStrip = styled.div`
  width: 28px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`
const GroupDot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#4a9eff' : '#555')};
  transition: background 0.15s;
  &:hover {
    background: ${(p) => (p.$active ? '#6bb0ff' : '#777')};
  }
`
const GroupDotWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`
const GroupDotRepLabel = styled.span`
  font-size: 9px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`
const ClassSidebarResizer = styled.div`
  width: 4px;
  flex-shrink: 0;
  cursor: col-resize;
  background: transparent;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`
const ClassSidebar = styled.div.attrs<{ $width: number; $mobileVisible?: boolean }>((p) => ({
  style: { width: `${p.$width}px` },
}))<{ $mobileVisible?: boolean }>`
  flex-shrink: 0;
  border-left: 1px solid #333;
  background: #222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: 768px) {
    display: ${(p) => (p.$mobileVisible ? 'flex' : 'none')};
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: min(320px, 88vw) !important;
    z-index: 20;
    box-shadow: -8px 0 32px rgba(0,0,0,0.6);
  }
`
const ClassSidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #333;
  gap: 8px;
`
const ClassSidebarTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
`
const AiDetectBtn = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: ${(p) => (p.$disabled ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, rgba(147, 112, 219, 0.25) 0%, rgba(74, 158, 255, 0.2) 100%)')};
  color: ${(p) => (p.$disabled ? '#555' : '#b19cd9')};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(147, 112, 219, 0.35) 0%, rgba(74, 158, 255, 0.3) 100%);
    color: #c9b3f0;
  }
  &:focus-visible {
    outline: 2px solid #7b68ee;
    outline-offset: 2px;
  }
  svg {
    width: 16px;
    height: 16px;
    filter: ${(p) => (p.$disabled ? 'none' : 'drop-shadow(0 0 4px rgba(177, 156, 217, 0.5))')};
  }
`
const AiDetectBtnWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
const AiDetectSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: aiDetectSpin 0.7s linear infinite;
  @keyframes aiDetectSpin {
    to { transform: rotate(360deg); }
  }
`
const AiDetectToast = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 200px;
  max-width: 260px;
  padding: 8px 10px;
  font-size: 12px;
  color: #e0e0e0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 50;
  white-space: normal;
  animation: aiDetectToastFade 2.5s ease-out forwards;
  pointer-events: none;
  @keyframes aiDetectToastFade {
    0%, 75% { opacity: 1; }
    100% { opacity: 0; }
  }
`
const AiDetectChecklistTooltip = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  min-width: 220px;
  padding: 8px 12px 10px;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 100;
  pointer-events: none;
`
const AiDetectChecklistTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
`
const AiDetectChecklistRow = styled.div<{ $done: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${(p) => (p.$done ? '#aaa' : '#666')};
  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }
`
const CheckIcon = styled.span<{ $done: boolean }>`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => (p.$done ? '#43a047' : '#555')};
  font-size: 12px;
`
const ImageInfoSection = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
`
const ImageInfoTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
`
const ImageInfoRow = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
  min-width: 0;
`
const ImageInfoLabel = styled.span`
  color: #666;
  flex-shrink: 0;
`
const ImageInfoValue = styled.span`
  color: #e0e0e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const SplitChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
const SplitChipButton = styled.button<{ $active: boolean; $tone: 'eval' | 'test' | 'clear' }>`
  padding: 0 10px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid
    ${(p) =>
      p.$active
        ? p.$tone === 'eval'
          ? 'rgba(96, 165, 250, 0.8)'
          : p.$tone === 'test'
            ? 'rgba(251, 191, 36, 0.82)'
            : 'rgba(203, 213, 225, 0.55)'
        : 'rgba(255, 255, 255, 0.12)'};
  background:
    ${(p) =>
      p.$active
        ? p.$tone === 'eval'
          ? 'rgba(37, 99, 235, 0.26)'
          : p.$tone === 'test'
            ? 'rgba(217, 119, 6, 0.24)'
            : 'rgba(71, 85, 105, 0.3)'
        : 'rgba(255, 255, 255, 0.04)'};
  color:
    ${(p) =>
      p.$active
        ? p.$tone === 'eval'
          ? '#d7e9ff'
          : p.$tone === 'test'
            ? '#ffecbf'
            : '#e2e8f0'
        : '#9aa7b8'};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    border-color:
      ${(p) =>
        p.$tone === 'eval'
          ? 'rgba(96, 165, 250, 0.72)'
          : p.$tone === 'test'
            ? 'rgba(251, 191, 36, 0.74)'
            : 'rgba(203, 213, 225, 0.46)'};
    color: #f8fbff;
  }
`
const ClassList = styled.div`
  padding: 8px;
`
const SidebarScroll = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
`
const SidebarScrollInner = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`
const ClassRow = styled.div<{ $selected?: boolean; $classified?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 4px;
  border: 1px solid
    ${(p) =>
      p.$selected || p.$classified ? 'rgba(74, 158, 255, 0.38)' : 'rgba(127, 139, 157, 0.16)'};
  background: ${(p) =>
    p.$selected || p.$classified ? 'rgba(74, 158, 255, 0.2)' : 'rgba(127, 139, 157, 0.12)'};
  cursor: pointer;
  &:hover {
    background: ${(p) =>
      p.$selected || p.$classified ? 'rgba(74, 158, 255, 0.24)' : 'rgba(127, 139, 157, 0.18)'};
  }
`
const ClassColorSwatch = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.2);
`
const ClassNameText = styled.span<{ $active?: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 2px 4px;
  font-size: 13px;
  color: ${(p) => (p.$active ? '#d9ecff' : '#9aa5b5')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const CommentsSection = styled.div`
  margin-top: auto;
  padding: 12px 14px 16px;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const CommentsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`
const CommentsTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`
const CommentCount = styled.span`
  font-size: 11px;
  color: #7f8b9d;
`
const CommentThread = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const CommentCard = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const CommentMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`
const CommentAuthor = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #e5eeff;
`
const CommentTimestamp = styled.div`
  font-size: 11px;
  color: #7f8b9d;
`
const CommentMetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`
const CommentBody = styled.div`
  font-size: 12px;
  line-height: 1.55;
  color: #b7c2d4;
  white-space: pre-wrap;
  word-break: break-word;
`
const CommentMentionText = styled.span`
  color: #8fc3ff;
  font-weight: 700;
`
const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const CommentActionButton = styled.button<{ $danger?: boolean }>`
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: ${(p) => (p.$danger ? '#f19999' : '#8fc3ff')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.08);
    color: ${(p) => (p.$danger ? '#ffb3b3' : '#c6e0ff')};
  }
`
const CommentComposer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #333;
  background: #171717;
  color: #e0e0e0;
  font-size: 13px;
  line-height: 1.5;
  box-sizing: border-box;
`
const CommentComposerActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`
const CommentHint = styled.div`
  font-size: 11px;
  color: #7f8b9d;
`
const CommentButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const CommentButton = styled.button<{ $secondary?: boolean }>`
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$secondary ? 'rgba(255,255,255,0.12)' : '#4a9eff')};
  background: ${(p) => (p.$secondary ? 'rgba(255,255,255,0.04)' : 'rgba(74, 158, 255, 0.16)')};
  color: ${(p) => (p.$secondary ? '#c6cfdb' : '#a8d0ff')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
const EmptyComments = styled.div`
  font-size: 12px;
  color: #7f8b9d;
`
const CommentError = styled.div`
  font-size: 11px;
  color: #f4a5a5;
`
const ConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(4, 8, 14, 0.64);
`
const ConfirmCard = styled.div`
  width: min(420px, 100%);
  padding: 18px;
  border-radius: 16px;
  background: #171c24;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #edf4ff;
`
const ConfirmText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #aeb9cb;
`
const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
`
const ConfirmButton = styled.button<{ $danger?: boolean; $secondary?: boolean }>`
  padding: 8px 13px;
  border-radius: 8px;
  border: 1px solid
    ${(p) =>
      p.$danger
        ? 'rgba(255, 138, 138, 0.34)'
        : p.$secondary
          ? 'rgba(255,255,255,0.12)'
          : '#4a9eff'};
  background:
    ${(p) =>
      p.$danger
        ? 'rgba(164, 44, 44, 0.22)'
        : p.$secondary
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(74, 158, 255, 0.16)'};
  color: ${(p) => (p.$danger ? '#ffb0b0' : p.$secondary ? '#d2d9e4' : '#a8d0ff')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
const ConfirmError = styled.div`
  font-size: 12px;
  color: #ffb3b3;
`
const MentionMenu = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 8px);
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: #151b24;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
  z-index: 30;
`
const MentionOption = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${(p) => (p.$active ? 'rgba(74, 158, 255, 0.14)' : 'transparent')};
  color: #e5eeff;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  &:hover {
    background: rgba(74, 158, 255, 0.14);
  }
`
const MentionPrimary = styled.span`
  font-weight: 700;
`
const MentionSecondary = styled.span`
  color: #7f8b9d;
`
const ClassHoverCard = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  width: min(280px, calc(100vw - 24px));
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(12, 16, 26, 0.97);
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.35);
  z-index: 1201;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const ClassHoverTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #eef4ff;
`
const ClassHoverDescription = styled.span`
  font-size: 12px;
  line-height: 1.5;
  color: #a8b3c7;
  white-space: pre-wrap;
`
const ClassHoverImage = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`
const ZoomWrap = styled.div.attrs<{ $zoom: number; $panX: number; $panY: number }>((p) => ({
  style: {
    transform: `translate(${p.$panX}px, ${p.$panY}px) scale(${p.$zoom})`,
    transformOrigin: 'center center',
  },
}))`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
/** Wrapper sized to image aspect ratio so 0-1 coords match image (and thumbnail). */
const ImageAreaWrap = styled.div<{ $aspect: number }>`
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: ${(p) => p.$aspect};
  flex-shrink: 0;
`
const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`
const ModalImageLoading = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 12, 12, 0.28);
  pointer-events: none;
`
const BboxLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: auto;
  cursor: crosshair;
`
const CrosshairOverlay = styled.div.attrs<{ $x: number; $y: number }>(() => ({
  style: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
  },
}))`
  z-index: 2;
`
const CrosshairLineV = styled.div.attrs<{ $x: number; $color: string }>((p) => ({
  style: {
    position: 'absolute',
    left: `${p.$x}px`,
    top: 0,
    width: 0,
    height: '100%',
    borderLeft: `1px dashed ${p.$color ?? '#888'}`,
    boxSizing: 'border-box',
  },
}))<{ $x: number; $color?: string }>``
const CrosshairLineH = styled.div.attrs<{ $y: number; $color: string }>((p) => ({
  style: {
    position: 'absolute',
    top: `${p.$y}px`,
    left: 0,
    width: '100%',
    height: 0,
    borderTop: `1px dashed ${p.$color ?? '#888'}`,
    boxSizing: 'border-box',
  },
}))<{ $y: number; $color?: string }>``
const CursorSelectLayer = styled.div<{ $cursor?: string }>`
  position: absolute;
  inset: 0;
  pointer-events: auto;
  cursor: ${(p) => p.$cursor ?? 'default'};
`
const RESIZE_HANDLE_RADIUS = 0.03
const MIN_BBOX_SIZE = 0.01
type BboxHandle = 'nw' | 'ne' | 'se' | 'sw'

function isEditableEventTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

const ResizeHandle = styled.div.attrs<{ $left: number; $top: number }>((p) => ({
  style: { left: `${(p?.$left ?? 0) * 100}%`, top: `${(p?.$top ?? 0) * 100}%` },
}))`
  position: absolute;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  background: #fff;
  border: 2px solid #f90;
  border-radius: 2px;
  pointer-events: none;
  box-sizing: border-box;
`
const BboxRect = styled.div.attrs<{
  $left: number
  $top: number
  $width: number
  $height: number
  $selected?: boolean
  $color?: string
}>((p) => {
  const c = p?.$color ?? DISCONNECTED_ANNOTATION_COLOR
  const r = parseInt(c.slice(1, 3), 16)
  const g = parseInt(c.slice(3, 5), 16)
  const b = parseInt(c.slice(5, 7), 16)
  return {
    style: {
      left: `${(p?.$left ?? 0) * 100}%`,
      top: `${(p?.$top ?? 0) * 100}%`,
      width: `${(p?.$width ?? 0) * 100}%`,
      height: `${(p?.$height ?? 0) * 100}%`,
      border: p?.$selected ? `3px solid #f90` : `2px solid ${c}`,
      background: p?.$selected ? 'rgba(255, 153, 0, 0.2)' : `rgba(${r}, ${g}, ${b}, 0.2)`,
    },
  }
})`
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
`
const BboxLabel = styled.div.attrs<{
  $left: number
  $top: number
  $color?: string
}>((p) => ({
  style: {
    left: `${(p?.$left ?? 0) * 100}%`,
    top: `${(p?.$top ?? 0) * 100}%`,
    background: p?.$color ?? DISCONNECTED_ANNOTATION_COLOR,
  },
}))`
  position: absolute;
  transform: translateY(-100%);
  margin-top: -4px;
  max-width: min(220px, 70%);
  padding: 3px 8px;
  border-radius: 999px;
  color: #f8fbff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
  pointer-events: none;
`
const PointMarker = styled.div.attrs<{ $x: number; $y: number; $selected?: boolean; $color?: string }>((p) => ({
  style: {
    left: `${(p?.$x ?? 0) * 100}%`,
    top: `${(p?.$y ?? 0) * 100}%`,
    background: p?.$selected ? '#f90' : (p?.$color ?? DISCONNECTED_ANNOTATION_COLOR),
    border: p?.$selected ? '3px solid #fff' : '2px solid #fff',
  },
}))`
  position: absolute;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
  pointer-events: none;
  box-sizing: border-box;
`

const DEFAULT_CLASS_COLORS = ['#4a9eff', '#e53935', '#43a047', '#fb8c00', '#8e24aa', '#00acc1']
/** Crosshair color when no class is selected (no annotation allowed). */
const CROSSHAIR_NO_CLASS_COLOR = '#888'

function formatImageDate(isoOrLocal: string): string {
  if (!isoOrLocal) return '—'
  try {
    const d = new Date(isoOrLocal)
    if (Number.isNaN(d.getTime())) return isoOrLocal
    return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return isoOrLocal
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export interface ImageDetailModalProps {
  image: ImageItem
  onClose: () => void
  initialBboxes?: Bbox[]
  onBboxesChange?: (imageId: string, bboxes: Bbox[]) => void
  initialPoints?: Point[]
  onPointsChange?: (imageId: string, points: Point[]) => void
  /** When provided, undo/redo call this with both bboxes and points so parent can update thumbnail once. */
  onAnnotationsChange?: (imageId: string, bboxes: Bbox[], points: Point[]) => void
  /** Optional list of classes (name + color). When provided, parent can persist via onClassesChange. */
  initialClasses?: ClassItem[]
  /** If provided, marks which classes are enabled for this image's dataset. */
  enabledClassIds?: string[]
  onClassesChange?: (classes: ClassItem[]) => void
  /** Optional hook to auto-enable a newly created class (e.g. connect it to current dataset). */
  onRequestEnableClass?: (classId: string) => void
  /** When provided, an AI action is shown next to the Class title. Returns detected bboxes to merge; may return { bboxes, ranInference } for message when none detected. */
  onRequestAutoDetection?: (imageId: string) => Promise<Bbox[] | { bboxes: Bbox[]; ranInference?: boolean }>
  /** Optional extra requirements for AI detection (e.g. model assigned, class mapped). Called with current selectedClassId. */
  aiDetectChecklist?: (selectedClassId: string | null) => Array<{ id: string; label: string; done: boolean }>
  /** When provided with length > 1, shows a vertical dot strip on the right to switch between images; annotations are per-image via groupAnnotations. */
  groupImages?: ImageItem[]
  /** Per-image bboxes and points when groupImages is used. Key = image id. */
  groupAnnotations?: Record<string, { bboxes: Bbox[]; points: Point[] }>
  /** Initial group image index to show when the parent image changes. */
  initialGroupImageIndex?: number
  /** Called when the group image index changes inside the modal. */
  onGroupImageIndexChange?: (index: number) => void
  /** Called when the current image or group classification labels change. */
  onClassificationLabelChange?: (imageIds: string[], classIds: string[]) => void
  /** Called when the current image split changes. */
  onSplitChange?: (imageId: string, split: 'eval' | 'test' | null) => void
  /** Called when the current image or group should be deleted. */
  onDeleteImages?: (imageIds: string[]) => Promise<void> | void
  /** Resolves API-relative asset paths such as /uploads/... into usable URLs. */
  assetUrlResolver?: (path: string) => string
  /** When true, bbox overlays also show the class name label. */
  showBboxClassNames?: boolean
  commentsByImageId?: Record<
    string,
    Array<{
      id: string
      image_id: string
      project_id: string
      author_email: string
      author_name?: string | null
      body: string
      created_at: string
      updated_at: string
      mentions: string[]
      can_edit: boolean
    }>
  >
  mentionCandidates?: Array<{ email: string; name?: string | null }>
  onCreateComment?: (imageId: string, body: string) => Promise<void> | void
  onUpdateComment?: (imageId: string, commentId: string, body: string) => Promise<void> | void
  onDeleteComment?: (imageId: string, commentId: string) => Promise<void> | void
  /** Called when the user swipes right-to-left (next image) or presses ArrowRight. */
  onRequestNext?: () => void
  /** Called when the user swipes left-to-right (prev image) or presses ArrowLeft. */
  onRequestPrev?: () => void
}

type AnnotationState = { bboxes: Bbox[]; points: Point[] }
type ImageComment = NonNullable<ImageDetailModalProps['commentsByImageId']>[string][number]

function nextClassId(): string {
  return 'class-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)
}

export function ImageDetailModal({
  image,
  onClose,
  initialBboxes,
  onBboxesChange,
  initialPoints,
  onPointsChange,
  onAnnotationsChange,
  initialClasses,
  enabledClassIds,
  onRequestAutoDetection,
  aiDetectChecklist,
  groupImages,
  groupAnnotations,
  initialGroupImageIndex,
  onGroupImageIndexChange,
  onClassificationLabelChange,
  onSplitChange,
  onDeleteImages,
  assetUrlResolver,
  showBboxClassNames = false,
  commentsByImageId,
  mentionCandidates,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onRequestNext,
  onRequestPrev,
}: ImageDetailModalProps) {
  const hasGroup = groupImages != null && groupImages.length > 1
  const [groupImageIndex, setGroupImageIndex] = useState(initialGroupImageIndex ?? 0)
  const currentImage = hasGroup && groupImages[groupImageIndex] != null
    ? groupImages[groupImageIndex]
    : image

  const [mode, setMode] = useState<'cursor' | 'bbox' | 'point' | 'classification'>('cursor')
  const [bboxes, setBboxes] = useState<Bbox[]>(initialBboxes ?? [])
  const [points, setPoints] = useState<Point[]>(initialPoints ?? [])
  const [classificationByImageId, setClassificationByImageId] = useState<Record<string, string[]>>({})
  const [classes, setClasses] = useState<ClassItem[]>(() =>
    initialClasses?.length ? initialClasses : [{ id: nextClassId(), name: 'Class 1', color: DEFAULT_CLASS_COLORS[0], locked: false }]
  )
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const enabledSet = useMemo(() => (enabledClassIds != null ? new Set(enabledClassIds) : null), [enabledClassIds])
  const selectableClasses = useMemo(
    () => (enabledSet ? classes.filter((c) => enabledSet.has(c.id)) : classes),
    [classes, enabledSet]
  )
  const resolveAssetUrl = useCallback(
    (path?: string | null) => {
      if (!path) return ''
      return assetUrlResolver ? assetUrlResolver(path) : path
    },
    [assetUrlResolver]
  )
  const showClassPreview = useCallback((item: ClassItem, element: HTMLElement) => {
    const hasContent = !!(item.description?.trim() || item.reference_image_url)
    if (!hasContent) return
    const rect = element.getBoundingClientRect()
    const width = Math.min(280, window.innerWidth - 24)
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12)
    const top = Math.min(rect.bottom + 10, window.innerHeight - 220)
    setHoveredClassPreview({ item, top, left })
  }, [])
  const getColorForClassId = useCallback(
    (classId: string | undefined): string => {
      if (!classId) return DISCONNECTED_ANNOTATION_COLOR
      const c = classes.find((x) => x.id === classId)
      return c?.color ?? DISCONNECTED_ANNOTATION_COLOR
    },
    [classes]
  )
  const getNameForClassId = useCallback(
    (classId: string | undefined): string => {
      if (!classId) return ''
      const item = classes.find((entry) => entry.id === classId)
      return item?.name ?? ''
    },
    [classes]
  )
  const [{ history, historyIndex }, setAnnotationHistory] = useState<{
    history: AnnotationState[]
    historyIndex: number
  }>(() => ({
    history: [{ bboxes: initialBboxes ?? [], points: initialPoints ?? [] }],
    historyIndex: 0,
  }))
  const [drawing, setDrawing] = useState<Bbox | null>(null)
  const [selectedBboxIndex, setSelectedBboxIndex] = useState<number | null>(null)
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null)
  const [liveNorm, setLiveNorm] = useState<{ nx: number; ny: number } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [contextMenuClassSubOpen, setContextMenuClassSubOpen] = useState(false)
  const [hoveredClassPreview, setHoveredClassPreview] = useState<{
    item: ClassItem
    top: number
    left: number
  } | null>(null)
  const contextMenuSubCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [classSidebarWidth, setClassSidebarWidth] = useState(280)
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false)
  const [commentDraft, setCommentDraft] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [archiveCommentTarget, setArchiveCommentTarget] = useState<ImageComment | null>(null)
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false)
  const [deleteImageError, setDeleteImageError] = useState<string | null>(null)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [isCommentSaving, setIsCommentSaving] = useState(false)
  const [mentionIndex, setMentionIndex] = useState(0)
  const [mentionRange, setMentionRange] = useState<{ start: number; end: number; query: string } | null>(null)
  const sidebarDragRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const [imageAspectFromLoad, setImageAspectFromLoad] = useState(1)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isAutoDetecting, setIsAutoDetecting] = useState(false)
  const [aiDetectTooltipVisible, setAiDetectTooltipVisible] = useState(false)
  const [aiDetectMessage, setAiDetectMessage] = useState<string | null>(null)
  const aiDetectMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const panStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null)
  const maybePanRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null)
  const PAN_DELTA_THRESHOLD = 5
  const wrapRef = useRef<HTMLDivElement>(null)
  const dotsStripRef = useRef<HTMLDivElement>(null)
  const imageAspect =
    currentImage.width != null &&
    currentImage.height != null &&
    currentImage.width > 0 &&
    currentImage.height > 0
      ? currentImage.width / currentImage.height
      : imageAspectFromLoad
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{
    type: 'bbox' | 'bbox-resize' | 'point'
    index: number
    startX: number
    startY: number
    startBbox?: Bbox
    startPoint?: Point
    handle?: BboxHandle
    latestBboxes?: Bbox[]
    latestPoints?: Point[]
  } | null>(null)

  const imageUrl = currentImage.original_url || currentImage.preview_url || currentImage.thumb_url
  const classificationTargetImageIds = useMemo(
    () => (hasGroup && groupImages && groupImages.length > 0 ? groupImages.map((item) => item.id) : [currentImage.id]),
    [currentImage.id, groupImages, hasGroup]
  )
  const classificationAssignedClassIds = useMemo(() => {
    const assigned: string[] = []
    const seen = new Set<string>()
    const sourceImages = hasGroup && groupImages && groupImages.length > 0 ? groupImages : [currentImage]
    sourceImages.forEach((item) => {
      const classIds =
        classificationByImageId[item.id] ??
        item.classification_class_ids ??
        (item.classification_class_id ? [item.classification_class_id] : [])
      classIds.forEach((classId) => {
        if (!classId || seen.has(classId)) return
        seen.add(classId)
        assigned.push(classId)
      })
    })
    return assigned
  }, [classificationByImageId, currentImage, groupImages, hasGroup])
  const currentComments = useMemo(() => {
    if (!commentsByImageId) return []
    if (!hasGroup || !groupImages || groupImages.length === 0) {
      return commentsByImageId[currentImage.id] ?? []
    }
    return groupImages
      .flatMap((groupImage) => commentsByImageId[groupImage.id] ?? [])
      .slice()
      .sort((left, right) => {
        const leftTs = new Date(left.created_at).getTime()
        const rightTs = new Date(right.created_at).getTime()
        if (leftTs !== rightTs) return leftTs - rightTs
        return left.id.localeCompare(right.id)
      })
  }, [commentsByImageId, currentImage.id, groupImages, hasGroup])
  const mentionDisplayByEmail = useMemo(
    () =>
      Object.fromEntries(
        (mentionCandidates ?? []).map((candidate) => [
          candidate.email.toLowerCase(),
          candidate.name?.trim() ? candidate.name.trim() : candidate.email,
        ])
      ) as Record<string, string>,
    [mentionCandidates]
  )

  const updateGroupImageIndex = useCallback(
    (next: number | ((prev: number) => number)) => {
      setGroupImageIndex((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        const maxIndex = hasGroup && groupImages ? groupImages.length - 1 : 0
        return Math.max(0, Math.min(maxIndex, raw))
      })
    },
    [groupImages, hasGroup]
  )

  const handleSidebarResizerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = classSidebarWidth
    sidebarDragRef.current = { startX, startWidth }
    const minWidth = 200
    const maxWidth = 480

    const handleMouseMove = (ev: MouseEvent) => {
      if (!sidebarDragRef.current) return
      const delta = ev.clientX - sidebarDragRef.current.startX
      // Dragging left (delta < 0) increases width, dragging right decreases width
      const next = Math.max(minWidth, Math.min(maxWidth, sidebarDragRef.current.startWidth - delta))
      setClassSidebarWidth(next)
    }

    const handleMouseUp = () => {
      sidebarDragRef.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [classSidebarWidth])

  const updateMentionState = useCallback(
    (value: string, caretPosition: number | null | undefined) => {
      if (caretPosition == null) {
        setMentionRange(null)
        return
      }
      const beforeCaret = value.slice(0, caretPosition)
      const match = beforeCaret.match(/(^|\s)@([^\s@]*)$/)
      if (!match) {
        setMentionRange(null)
        return
      }
      const query = match[2] ?? ''
      const start = caretPosition - query.length - 1
      setMentionRange({ start, end: caretPosition, query })
    },
    []
  )

  const filteredMentionCandidates = useMemo(() => {
    if (!mentionRange) return []
    const query = mentionRange.query.trim().toLowerCase()
    const candidates = mentionCandidates ?? []
    const getCandidateRank = (candidate: { email: string; name?: string | null }) => {
      const normalizedName = (candidate.name ?? '').trim().toLowerCase()
      const normalizedEmail = candidate.email.toLowerCase()
      if (!query) {
        return normalizedName ? 0 : 3
      }
      if (normalizedName.startsWith(query)) return 0
      if (normalizedName.includes(query)) return 1
      if (normalizedEmail.startsWith(query)) return 2
      if (normalizedEmail.includes(query)) return 3
      return 4
    }
    return candidates
      .filter((candidate) => getCandidateRank(candidate) < 4)
      .sort((left, right) => {
        const rankDiff = getCandidateRank(left) - getCandidateRank(right)
        if (rankDiff !== 0) return rankDiff
        const leftName = (left.name ?? '').trim().toLowerCase()
        const rightName = (right.name ?? '').trim().toLowerCase()
        if (leftName !== rightName) return leftName.localeCompare(rightName)
        return left.email.localeCompare(right.email)
      })
      .slice(0, 6)
  }, [mentionCandidates, mentionRange])

  useEffect(() => {
    setCommentDraft('')
    setEditingCommentId(null)
    setArchiveCommentTarget(null)
    setCommentError(null)
    setMentionRange(null)
    setMentionIndex(0)
  }, [currentImage.id])

  useEffect(() => {
    if (mentionIndex >= filteredMentionCandidates.length) {
      setMentionIndex(0)
    }
  }, [filteredMentionCandidates.length, mentionIndex])

  const insertMentionCandidate = useCallback(
    (candidate: { email: string; name?: string | null }) => {
      if (!mentionRange) return
      const replacement = `@${candidate.email} `
      const next = commentDraft.slice(0, mentionRange.start) + replacement + commentDraft.slice(mentionRange.end)
      const nextCaret = mentionRange.start + replacement.length
      setCommentDraft(next)
      setMentionRange(null)
      requestAnimationFrame(() => {
        const element = commentTextareaRef.current
        if (!element) return
        element.focus()
        element.setSelectionRange(nextCaret, nextCaret)
      })
    },
    [commentDraft, mentionRange]
  )

  const renderCommentBody = useCallback(
    (body: string) =>
      body.split(/(@[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g).map((part, index) => {
        const match = part.match(/^@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/)
        if (!match) {
          return <React.Fragment key={index}>{part}</React.Fragment>
        }
        const email = match[1].toLowerCase()
        return <CommentMentionText key={index}>@{mentionDisplayByEmail[email] ?? match[1]}</CommentMentionText>
      }),
    [mentionDisplayByEmail]
  )

  const handleStartEditComment = useCallback((comment: ImageComment) => {
    setCommentDraft(comment.body)
    setEditingCommentId(comment.id)
    setCommentError(null)
    requestAnimationFrame(() => {
      commentTextareaRef.current?.focus()
    })
  }, [])

  const handleDeleteComment = useCallback(
    async (comment: ImageComment) => {
      if (!onDeleteComment || isCommentSaving) return
      setIsCommentSaving(true)
      setCommentError(null)
      try {
        await onDeleteComment(comment.image_id, comment.id)
        if (editingCommentId === comment.id) {
          setCommentDraft('')
          setEditingCommentId(null)
        }
        setArchiveCommentTarget(null)
      } catch (error) {
        setCommentError(error instanceof Error ? error.message : 'Failed to delete comment.')
      } finally {
        setIsCommentSaving(false)
      }
    },
    [editingCommentId, isCommentSaving, onDeleteComment]
  )

  const handleSubmitComment = useCallback(async () => {
    const trimmed = commentDraft.trim()
    if (!trimmed || isCommentSaving) return
    setIsCommentSaving(true)
    setCommentError(null)
    try {
      if (editingCommentId) {
        if (!onUpdateComment) return
        await onUpdateComment(currentImage.id, editingCommentId, trimmed)
      } else {
        if (!onCreateComment) return
        await onCreateComment(currentImage.id, trimmed)
      }
      setCommentDraft('')
      setEditingCommentId(null)
      setMentionRange(null)
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Failed to save comment.')
    } finally {
      setIsCommentSaving(false)
    }
  }, [commentDraft, currentImage.id, editingCommentId, isCommentSaving, onCreateComment, onUpdateComment])

  useEffect(() => {
    if (hasGroup && groupImages && groupAnnotations) {
      const img = groupImages[groupImageIndex]
      if (img) {
        const ann = groupAnnotations[img.id] ?? { bboxes: [], points: [] }
        setBboxes(ann.bboxes)
        setPoints(ann.points)
        setAnnotationHistory({ history: [{ bboxes: ann.bboxes, points: ann.points }], historyIndex: 0 })
      }
      return
    }
    const initial = { bboxes: initialBboxes ?? [], points: initialPoints ?? [] }
    setBboxes(initial.bboxes)
    setPoints(initial.points)
    setAnnotationHistory({ history: [initial], historyIndex: 0 })
    if (initialClasses?.length) {
      setClasses(initialClasses)
      setSelectedClassId((prev) => (prev && initialClasses.some((c) => c.id === prev)) ? prev : null)
    }
  }, [hasGroup, groupImages, groupAnnotations, groupImageIndex, image.id, initialBboxes, initialPoints, initialClasses])

  useEffect(() => {
    setSelectedBboxIndex(null)
    setSelectedPointIndex(null)
    setDrawing(null)
    drawStartRef.current = null
    dragRef.current = null
    maybePanRef.current = null
    panStartRef.current = null
    setCrosshairPos(null)
    setLiveNorm(null)
    setContextMenu(null)
  }, [currentImage.id])

  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [image.id])

  useEffect(() => {
    setIsImageLoading(true)
  }, [currentImage.id, imageUrl])

  useEffect(() => {
    const next: Record<string, string[]> = {}
    const sourceImages = groupImages && groupImages.length > 0 ? groupImages : [image]
    sourceImages.forEach((item) => {
      next[item.id] = item.classification_class_ids ?? (item.classification_class_id ? [item.classification_class_id] : [])
    })
    setClassificationByImageId(next)
  }, [groupImages, image])

  useEffect(() => {
    if (!hasGroup || !groupImages) {
      setGroupImageIndex(0)
      return
    }
    const nextIndex = Math.max(0, Math.min(groupImages.length - 1, initialGroupImageIndex ?? 0))
    setGroupImageIndex(nextIndex)
  }, [groupImages, hasGroup, image.id, initialGroupImageIndex])

  useEffect(() => {
    onGroupImageIndexChange?.(groupImageIndex)
  }, [groupImageIndex, onGroupImageIndexChange])

  useEffect(() => {
    const el = dotsStripRef.current
    if (!el || !hasGroup || !groupImages) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      updateGroupImageIndex((i) => {
        if (e.deltaY < 0 && i > 0) return i - 1
        if (e.deltaY > 0 && i < groupImages.length - 1) return i + 1
        return i
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [hasGroup, groupImages, updateGroupImageIndex])

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 })
  }, [zoom])

  useEffect(() => {
    if (!hoveredClassPreview) return
    const clear = () => setHoveredClassPreview(null)
    window.addEventListener('scroll', clear, true)
    return () => window.removeEventListener('scroll', clear, true)
  }, [hoveredClassPreview])

  useEffect(() => {
    return () => {
      if (aiDetectMessageTimeoutRef.current) {
        clearTimeout(aiDetectMessageTimeoutRef.current)
      }
    }
  }, [])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  const clamp01 = useCallback((v: number) => Math.max(0, Math.min(1, v)), [])
  const clampBboxToImage = useCallback((b: Bbox): Bbox => {
    const x = clamp01(b.x)
    const y = clamp01(b.y)
    const w = Math.max(MIN_BBOX_SIZE, Math.min(b.w, 1 - x))
    const h = Math.max(MIN_BBOX_SIZE, Math.min(b.h, 1 - y))
    return { x, y, w, h }
  }, [clamp01])

  const handleBboxMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== 'bbox' || !selectedClassId) return
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp01((e.clientX - rect.left) / rect.width)
      const y = clamp01((e.clientY - rect.top) / rect.height)
      drawStartRef.current = { x, y }
      setDrawing({ x, y, w: 0, h: 0 })
    },
    [mode, selectedClassId, clamp01]
  )
  const handleBboxMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (drawStartRef.current == null || mode !== 'bbox') return
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const start = drawStartRef.current
      const cx = clamp01((e.clientX - rect.left) / rect.width)
      const cy = clamp01((e.clientY - rect.top) / rect.height)
      const x = Math.min(start.x, cx)
      const y = Math.min(start.y, cy)
      const w = Math.abs(cx - start.x)
      const h = Math.abs(cy - start.y)
      setDrawing(clampBboxToImage({ x, y, w, h }))
    },
    [mode, clamp01, clampBboxToImage]
  )
  const pushState = useCallback((nextBboxes: Bbox[], nextPoints: Point[]) => {
    setAnnotationHistory((prev) => {
      const truncated = prev.history.slice(0, prev.historyIndex + 1)
      const next = [...truncated, { bboxes: nextBboxes, points: nextPoints }].slice(-MAX_ANNOTATION_HISTORY)
      return { history: next, historyIndex: next.length - 1 }
    })
  }, [])

  const assignClassToSelection = useCallback(
    (classId: string) => {
      if (enabledSet && !enabledSet.has(classId)) {
        return
      }
      setSelectedClassId(classId)
      if (selectedBboxIndex != null) {
        const nextBboxes = bboxes.map((b, i) => (i === selectedBboxIndex ? { ...b, classId } : b))
        pushState(nextBboxes, points)
        setBboxes(nextBboxes)
        if (onAnnotationsChange) onAnnotationsChange(currentImage.id, nextBboxes, points)
        else onBboxesChange?.(currentImage.id, nextBboxes)
      } else if (selectedPointIndex != null) {
        const nextPoints = points.map((p, i) => (i === selectedPointIndex ? { ...p, classId } : p))
        pushState(bboxes, nextPoints)
        setPoints(nextPoints)
        if (onAnnotationsChange) onAnnotationsChange(currentImage.id, bboxes, nextPoints)
        else onPointsChange?.(currentImage.id, nextPoints)
      }
    },
    [selectedBboxIndex, selectedPointIndex, bboxes, points, currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange, pushState, enabledSet]
  )

  const handleClassificationToggle = useCallback(
    (classId: string) => {
      if (enabledSet && !enabledSet.has(classId)) return
      setSelectedClassId(classId)
      const nextClassIds = classificationAssignedClassIds.includes(classId)
        ? classificationAssignedClassIds.filter((item) => item !== classId)
        : [...classificationAssignedClassIds, classId]
      setClassificationByImageId((prev) => {
        const next = { ...prev }
        classificationTargetImageIds.forEach((imageId) => {
          next[imageId] = nextClassIds
        })
        return next
      })
      onClassificationLabelChange?.(classificationTargetImageIds, nextClassIds)
    },
    [classificationAssignedClassIds, classificationTargetImageIds, enabledSet, onClassificationLabelChange]
  )

  const aiDetectRequirements = useMemo(() => {
    const bboxToolSelected = mode === 'bbox'
    const base = [{ id: 'bbox', label: 'Select Bbox tool (in tool list below)', done: bboxToolSelected }]
    const extra = aiDetectChecklist?.(selectedClassId) ?? []
    return [...base, ...extra]
  }, [selectedClassId, mode, aiDetectChecklist])
  const aiDetectAllDone = aiDetectRequirements.every((r) => r.done)

  const handleRequestAutoDetection = useCallback(() => {
    if (!onRequestAutoDetection || !aiDetectAllDone) return
    console.log('[AI Detect] button clicked', { imageId: currentImage.id })
    if (aiDetectMessageTimeoutRef.current) {
      clearTimeout(aiDetectMessageTimeoutRef.current)
      aiDetectMessageTimeoutRef.current = null
    }
    setAiDetectMessage(null)
    setIsAutoDetecting(true)
    onRequestAutoDetection(currentImage.id)
      .then((raw) => {
        const result = Array.isArray(raw) ? { bboxes: raw, ranInference: undefined as boolean | undefined } : raw
        const detected = result.bboxes ?? []
        const ranInference = result.ranInference
        console.log('[AI Detect] callback resolved', { imageId: currentImage.id, detectedCount: detected.length, ranInference })
        if (detected.length) {
          const withClass = detected.map((b) => ({
            ...b,
            classId: b.classId ?? selectedClassId ?? undefined,
          }))
          const nextBboxes = [...bboxes, ...withClass]
          pushState(nextBboxes, points)
          setBboxes(nextBboxes)
          if (onAnnotationsChange) onAnnotationsChange(currentImage.id, nextBboxes, points)
          else onBboxesChange?.(currentImage.id, nextBboxes)
          setAiDetectMessage(`${detected.length} object(s) detected`)
        } else {
          setAiDetectMessage(
            ranInference === false ? 'No objects detected (detection service not yet connected)' : 'No objects detected'
          )
        }
      })
      .catch((err) => {
        console.log('[AI Detect] callback rejected', { imageId: currentImage.id, error: err?.message ?? String(err) })
        setAiDetectMessage(err?.message ?? 'Detection failed')
      })
      .finally(() => {
        setIsAutoDetecting(false)
        aiDetectMessageTimeoutRef.current = setTimeout(() => {
          setAiDetectMessage(null)
          aiDetectMessageTimeoutRef.current = null
        }, 2500)
      })
  }, [
    onRequestAutoDetection,
    currentImage.id,
    aiDetectAllDone,
    selectedClassId,
    bboxes,
    points,
    pushState,
    onAnnotationsChange,
    onBboxesChange,
  ])

  const handleBboxMouseUp = useCallback(() => {
    if (drawing && (drawing.w > 0.01 || drawing.h > 0.01)) {
      const clamped = { ...clampBboxToImage(drawing), classId: selectedClassId ?? undefined }
      const nextBboxes = [...bboxes, clamped]
      pushState(nextBboxes, points)
      setBboxes(nextBboxes)
      onBboxesChange?.(currentImage.id, nextBboxes)
      const newIndex = nextBboxes.length - 1
      setSelectedBboxIndex(newIndex)
      setSelectedPointIndex(null)
    }
    drawStartRef.current = null
    setDrawing(null)
  }, [drawing, bboxes, points, currentImage.id, onBboxesChange, pushState, clampBboxToImage, selectedClassId])

  const handlePointClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== 'point' || !selectedClassId) return
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp01((e.clientX - rect.left) / rect.width)
      const y = clamp01((e.clientY - rect.top) / rect.height)
      const nextPoints = [...points, { x, y, classId: selectedClassId }]
      pushState(bboxes, nextPoints)
      setPoints(nextPoints)
      onPointsChange?.(currentImage.id, nextPoints)
    },
    [mode, points, bboxes, currentImage.id, onPointsChange, pushState, clamp01, selectedClassId]
  )

  const getNorm = useCallback((e: React.MouseEvent | MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return { nx: 0, ny: 0 }
    return {
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  const updateCrosshair = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      setCrosshairPos({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      })
      setLiveNorm({ nx: (e.clientX - rect.left) / rect.width, ny: (e.clientY - rect.top) / rect.height })
    },
    [zoom]
  )
  const clearCrosshair = useCallback(() => {
    setCrosshairPos(null)
    setLiveNorm(null)
  }, [])

  const hitTestResizeHandle = useCallback(
    (nx: number, ny: number): BboxHandle | null => {
      if (selectedBboxIndex == null) return null
      const b = bboxes[selectedBboxIndex]
      if (!b) return null
      const corners: { h: BboxHandle; cx: number; cy: number }[] = [
        { h: 'se', cx: b.x + b.w, cy: b.y + b.h },
        { h: 'sw', cx: b.x, cy: b.y + b.h },
        { h: 'ne', cx: b.x + b.w, cy: b.y },
        { h: 'nw', cx: b.x, cy: b.y },
      ]
      for (const { h, cx, cy } of corners) {
        const d = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2)
        if (d < RESIZE_HANDLE_RADIUS) return h
      }
      return null
    },
    [selectedBboxIndex, bboxes]
  )

  const hitTest = useCallback(
    (nx: number, ny: number): { type: 'point'; index: number } | { type: 'bbox'; index: number } | null => {
      const pointThreshold = 0.04
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i]
        const d = Math.sqrt((nx - p.x) ** 2 + (ny - p.y) ** 2)
        if (d < pointThreshold) return { type: 'point', index: i }
      }
      for (let i = bboxes.length - 1; i >= 0; i--) {
        const b = bboxes[i]
        if (nx >= b.x && nx <= b.x + b.w && ny >= b.y && ny <= b.y + b.h) return { type: 'bbox', index: i }
      }
      return null
    },
    [points, bboxes]
  )

  const resizeBboxFromHandle = useCallback((b: Bbox, handle: BboxHandle, nx: number, ny: number): Bbox => {
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
    const cx = clamp(nx, 0, 1)
    const cy = clamp(ny, 0, 1)
    let x = b.x
    let y = b.y
    let w = b.w
    let h = b.h
    if (handle === 'se') {
      w = clamp(cx - b.x, MIN_BBOX_SIZE, 1 - b.x)
      h = clamp(cy - b.y, MIN_BBOX_SIZE, 1 - b.y)
    } else if (handle === 'sw') {
      x = clamp(cx, 0, b.x + b.w - MIN_BBOX_SIZE)
      w = b.x + b.w - x
      h = clamp(cy - b.y, MIN_BBOX_SIZE, 1 - b.y)
      y = b.y
    } else if (handle === 'ne') {
      y = clamp(cy, 0, b.y + b.h - MIN_BBOX_SIZE)
      h = b.y + b.h - y
      w = clamp(cx - b.x, MIN_BBOX_SIZE, 1 - b.x)
      x = b.x
    } else {
      x = clamp(cx, 0, b.x + b.w - MIN_BBOX_SIZE)
      y = clamp(cy, 0, b.y + b.h - MIN_BBOX_SIZE)
      w = b.x + b.w - x
      h = b.y + b.h - y
    }
    return clampBboxToImage({ x, y, w, h })
  }, [clampBboxToImage])

  const handleCursorMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== 'cursor') return
      const { nx, ny } = getNorm(e)
      const resizeHandle = hitTestResizeHandle(nx, ny)
      if (resizeHandle != null && selectedBboxIndex != null) {
        dragRef.current = {
          type: 'bbox-resize',
          index: selectedBboxIndex,
          startX: nx,
          startY: ny,
          startBbox: { ...bboxes[selectedBboxIndex] },
          handle: resizeHandle,
          latestBboxes: [...bboxes],
          latestPoints: [...points],
        }
        return
      }
      const hit = hitTest(nx, ny)
      if (hit) {
        const sameBbox = hit.type === 'bbox' && selectedBboxIndex === hit.index && selectedPointIndex === null
        const samePoint = hit.type === 'point' && selectedPointIndex === hit.index && selectedBboxIndex === null
        if (sameBbox) {
          dragRef.current = {
            type: 'bbox',
            index: hit.index,
            startX: nx,
            startY: ny,
            startBbox: { ...bboxes[hit.index] },
            latestBboxes: [...bboxes],
            latestPoints: [...points],
          }
          return
        }
        if (samePoint) {
          dragRef.current = {
            type: 'point',
            index: hit.index,
            startX: nx,
            startY: ny,
            startPoint: { ...points[hit.index] },
            latestBboxes: [...bboxes],
            latestPoints: [...points],
          }
          return
        }
        const newBboxIndex = hit.type === 'bbox' ? hit.index : null
        const newPointIndex = hit.type === 'point' ? hit.index : null
        setSelectedBboxIndex(newBboxIndex)
        setSelectedPointIndex(newPointIndex)
      } else {
        if (zoom > 1) {
          maybePanRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            startX: pan.x,
            startY: pan.y,
          }
          return
        }
        setSelectedBboxIndex(null)
        setSelectedPointIndex(null)
      }
    },
    [mode, hitTest, hitTestResizeHandle, getNorm, selectedBboxIndex, selectedPointIndex, selectedClassId, bboxes, points, zoom, pan.x, pan.y]
  )

  const handleCursorMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== 'cursor') return
      setLiveNorm(getNorm(e))
      const maybePan = maybePanRef.current
      if (maybePan) {
        const dx = e.clientX - maybePan.clientX
        const dy = e.clientY - maybePan.clientY
        if (Math.abs(dx) > PAN_DELTA_THRESHOLD || Math.abs(dy) > PAN_DELTA_THRESHOLD) {
          panStartRef.current = { ...maybePan }
          maybePanRef.current = null
        } else {
          return
        }
      }
      const panStart = panStartRef.current
      if (panStart) {
        setPan({
          x: panStart.startX + (e.clientX - panStart.clientX),
          y: panStart.startY + (e.clientY - panStart.clientY),
        })
        return
      }
      const drag = dragRef.current
      if (!drag) return
      const { nx, ny } = getNorm(e)
      if (drag.type === 'bbox-resize' && drag.handle && drag.startBbox) {
        const updated = resizeBboxFromHandle(drag.startBbox, drag.handle, nx, ny)
        setBboxes((prev) => {
          const next = [...prev]
          next[drag.index] = updated
          dragRef.current && (dragRef.current.latestBboxes = next)
          return next
        })
        return
      }
      const dx = nx - drag.startX
      const dy = ny - drag.startY
      if (drag.type === 'bbox' && drag.startBbox) {
        const b = drag.startBbox
        const newX = Math.max(0, Math.min(1 - b.w, b.x + dx))
        const newY = Math.max(0, Math.min(1 - b.h, b.y + dy))
        const updated = { ...b, x: newX, y: newY }
        drag.startX = nx
        drag.startY = ny
        drag.startBbox = updated
        setBboxes((prev) => {
          const next = [...prev]
          next[drag.index] = updated
          dragRef.current && (dragRef.current.latestBboxes = next)
          return next
        })
      } else if (drag.type === 'point' && drag.startPoint) {
        const p = drag.startPoint
        const newX = Math.max(0, Math.min(1, p.x + dx))
        const newY = Math.max(0, Math.min(1, p.y + dy))
        const updated = { x: newX, y: newY }
        drag.startX = nx
        drag.startY = ny
        drag.startPoint = updated
        setPoints((prev) => {
          const next = [...prev]
          next[drag.index] = updated
          dragRef.current && (dragRef.current.latestPoints = next)
          return next
        })
      }
    },
    [mode, getNorm, resizeBboxFromHandle]
  )

  const handleCursorMouseUp = useCallback(() => {
    const wasMaybePan = maybePanRef.current != null
    maybePanRef.current = null
    panStartRef.current = null
    if (wasMaybePan) {
      setSelectedBboxIndex(null)
      setSelectedPointIndex(null)
    }
    const drag = dragRef.current
    if (drag) {
      if ((drag.type === 'bbox' || drag.type === 'bbox-resize') && drag.latestBboxes) {
        pushState(drag.latestBboxes, drag.latestPoints ?? points)
        setBboxes(drag.latestBboxes)
        if (onAnnotationsChange) onAnnotationsChange(currentImage.id, drag.latestBboxes, drag.latestPoints ?? points)
        else onBboxesChange?.(currentImage.id, drag.latestBboxes)
      } else if (drag.type === 'point' && drag.latestPoints) {
        pushState(drag.latestBboxes ?? bboxes, drag.latestPoints)
        setPoints(drag.latestPoints)
        if (onAnnotationsChange) onAnnotationsChange(currentImage.id, drag.latestBboxes ?? bboxes, drag.latestPoints)
        else onPointsChange?.(currentImage.id, drag.latestPoints)
      }
      dragRef.current = null
    }
  }, [currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange, pushState, bboxes, points])

  const handleCursorMouseLeave = useCallback(() => {
    setLiveNorm(null)
    handleCursorMouseUp()
  }, [handleCursorMouseUp])

  const handleDeleteSelected = useCallback(() => {
    if (selectedBboxIndex !== null) {
      const nextBboxes = bboxes.filter((_, i) => i !== selectedBboxIndex)
      pushState(nextBboxes, points)
      setBboxes(nextBboxes)
      setSelectedBboxIndex(null)
      if (onAnnotationsChange) onAnnotationsChange(currentImage.id, nextBboxes, points)
      else {
        onBboxesChange?.(currentImage.id, nextBboxes)
      }
    } else if (selectedPointIndex !== null) {
      const nextPoints = points.filter((_, i) => i !== selectedPointIndex)
      pushState(bboxes, nextPoints)
      setPoints(nextPoints)
      setSelectedPointIndex(null)
      if (onAnnotationsChange) onAnnotationsChange(currentImage.id, bboxes, nextPoints)
      else {
        onPointsChange?.(currentImage.id, nextPoints)
      }
    }
  }, [selectedBboxIndex, selectedPointIndex, bboxes, points, currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange, pushState])

  const openContextMenu = useCallback((e: React.MouseEvent) => {
    if (selectedBboxIndex == null && selectedPointIndex == null) return
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [selectedBboxIndex, selectedPointIndex])

  const closeContextMenu = useCallback(() => {
    if (contextMenuSubCloseTimerRef.current) {
      clearTimeout(contextMenuSubCloseTimerRef.current)
      contextMenuSubCloseTimerRef.current = null
    }
    setContextMenu(null)
    setContextMenuClassSubOpen(false)
  }, [])

  const handleContextMenuDelete = useCallback(() => {
    handleDeleteSelected()
    setContextMenu(null)
  }, [handleDeleteSelected])

  const handleUndo = useCallback(() => {
    setAnnotationHistory((prev) => {
      if (prev.historyIndex <= 0) return prev
      const nextIndex = prev.historyIndex - 1
      const state = prev.history[nextIndex]
      setBboxes(state.bboxes)
      setPoints(state.points)
      if (onAnnotationsChange) {
        onAnnotationsChange(currentImage.id, state.bboxes, state.points)
      } else {
        onBboxesChange?.(currentImage.id, state.bboxes)
        onPointsChange?.(currentImage.id, state.points)
      }
      return { ...prev, historyIndex: nextIndex }
    })
  }, [currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange])

  const handleRedo = useCallback(() => {
    setAnnotationHistory((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev
      const nextIndex = prev.historyIndex + 1
      const state = prev.history[nextIndex]
      setBboxes(state.bboxes)
      setPoints(state.points)
      if (onAnnotationsChange) {
        onAnnotationsChange(currentImage.id, state.bboxes, state.points)
      } else {
        onBboxesChange?.(currentImage.id, state.bboxes)
        onPointsChange?.(currentImage.id, state.points)
      }
      return { ...prev, historyIndex: nextIndex }
    })
  }, [currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange])

  const handleReset = useCallback(() => {
    const empty = { bboxes: [] as Bbox[], points: [] as Point[] }
    setBboxes(empty.bboxes)
    setPoints(empty.points)
    setAnnotationHistory({ history: [empty], historyIndex: 0 })
    if (onAnnotationsChange) {
      onAnnotationsChange(currentImage.id, [], [])
    } else {
      onBboxesChange?.(currentImage.id, [])
      onPointsChange?.(currentImage.id, [])
    }
  }, [currentImage.id, onBboxesChange, onPointsChange, onAnnotationsChange])

  const handleSplitChange = useCallback(
    (nextSplit: 'eval' | 'test' | null) => {
      onSplitChange?.(currentImage.id, nextSplit)
    },
    [currentImage.id, onSplitChange]
  )

  const openDeleteImageDialog = useCallback(() => {
    if (!onDeleteImages) return
    setDeleteImageError(null)
    setDeleteImageDialogOpen(true)
  }, [onDeleteImages])

  const closeDeleteImageDialog = useCallback(() => {
    if (isDeletingImage) return
    setDeleteImageDialogOpen(false)
    setDeleteImageError(null)
  }, [isDeletingImage])

  const handleDeleteImages = useCallback(
    async (imageIds: string[]) => {
      if (!onDeleteImages || imageIds.length === 0 || isDeletingImage) return
      setDeleteImageError(null)
      setIsDeletingImage(true)
      try {
        await onDeleteImages(imageIds)
        setDeleteImageDialogOpen(false)
      } catch (error) {
        setDeleteImageError(error instanceof Error ? error.message : 'Delete failed')
      } finally {
        setIsDeletingImage(false)
      }
    },
    [isDeletingImage, onDeleteImages]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableEventTarget(e.target)) return
      if (hasGroup && groupImages && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        if (e.key === 'ArrowUp') {
          updateGroupImageIndex((i) => Math.max(0, i - 1))
        } else {
          updateGroupImageIndex((i) => Math.min(groupImages.length - 1, i + 1))
        }
        return
      }
      if (e.key === 'Escape') {
        if (deleteImageDialogOpen) {
          closeDeleteImageDialog()
          return
        }
        if (contextMenu != null) {
          setContextMenu(null)
        } else if (selectedBboxIndex !== null || selectedPointIndex !== null) {
          setSelectedBboxIndex(null)
          setSelectedPointIndex(null)
        } else onClose()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteSelected()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) handleRedo()
        else handleUndo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasGroup, groupImages, onClose, handleUndo, handleRedo, handleDeleteSelected, selectedBboxIndex, selectedPointIndex, contextMenu, updateGroupImageIndex, deleteImageDialogOpen, closeDeleteImageDialog])

  const zoomIn = useCallback(() => setZoom((z) => Math.min(3, z + 0.25)), [])
  const zoomOut = useCallback(() => setZoom((z) => Math.max(1, z - 0.25)), [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) zoomIn()
      else if (e.deltaY > 0) zoomOut()
    },
    [zoomIn, zoomOut]
  )
  const imageWrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = imageWrapRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }, [])
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return
    const t = e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const THRESHOLD = 50
    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal swipe
      if (Math.abs(dx) < THRESHOLD) return
      if (dx < 0) onRequestNext?.()
      else onRequestPrev?.()
    } else {
      // vertical swipe — navigate within group
      if (Math.abs(dy) < THRESHOLD || !hasGroup || !groupImages) return
      if (dy < 0) updateGroupImageIndex((i) => Math.min(groupImages.length - 1, i + 1))
      else updateGroupImageIndex((i) => Math.max(0, i - 1))
    }
  }, [onRequestNext, onRequestPrev, hasGroup, groupImages, updateGroupImageIndex])

  return (
    <Overlay>
      <Backdrop onClick={handleBackdropClick} aria-hidden />
      {contextMenu != null && (
        <>
          <ContextMenuBackdrop onClick={closeContextMenu} aria-hidden />
          <ContextMenuList $x={contextMenu.x} $y={contextMenu.y} onClick={(e) => e.stopPropagation()}>
            <ContextMenuDeleteItem type="button" onClick={handleContextMenuDelete}>
              Delete
            </ContextMenuDeleteItem>
            <ContextMenuItem
              onMouseEnter={() => {
                if (contextMenuSubCloseTimerRef.current) {
                  clearTimeout(contextMenuSubCloseTimerRef.current)
                  contextMenuSubCloseTimerRef.current = null
                }
                setContextMenuClassSubOpen(true)
              }}
              onMouseLeave={() => {
                contextMenuSubCloseTimerRef.current = setTimeout(() => setContextMenuClassSubOpen(false), 200)
              }}
            >
              <ContextMenuButton as="div" style={{ cursor: 'default' }}>
                Class →
              </ContextMenuButton>
            </ContextMenuItem>
          </ContextMenuList>
          {contextMenuClassSubOpen && (
            <ContextMenuSub
              $left={contextMenu.x + 120}
              $top={contextMenu.y}
              onMouseEnter={() => {
                if (contextMenuSubCloseTimerRef.current) {
                  clearTimeout(contextMenuSubCloseTimerRef.current)
                  contextMenuSubCloseTimerRef.current = null
                }
              }}
              onMouseLeave={() => {
                contextMenuSubCloseTimerRef.current = setTimeout(() => setContextMenuClassSubOpen(false), 200)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectableClasses.map((c) => (
                <ContextMenuSubItem
                  key={c.id}
                  type="button"
                  $color={c.color}
                  onMouseEnter={(e) => showClassPreview(c, e.currentTarget)}
                  onMouseLeave={() => setHoveredClassPreview((prev) => (prev?.item.id === c.id ? null : prev))}
                  onFocus={(e) => showClassPreview(c, e.currentTarget)}
                  onBlur={() => setHoveredClassPreview((prev) => (prev?.item.id === c.id ? null : prev))}
                  onClick={() => {
                    assignClassToSelection(c.id)
                    closeContextMenu()
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  {c.name}
                </ContextMenuSubItem>
              ))}
            </ContextMenuSub>
          )}
        </>
      )}
      <ModalContent onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <MainArea>
      <TopRightGroup>
        <IconBtn type="button" title="Zoom out" disabled={zoom <= 1} onClick={(e) => { e.stopPropagation(); zoomOut(); }}>
          <ZoomOutIcon />
        </IconBtn>
        <IconBtn type="button" title="Zoom in" onClick={(e) => { e.stopPropagation(); zoomIn(); }}>
          <ZoomInIcon />
        </IconBtn>
        <CloseBtn type="button" title="Close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <CloseIcon />
        </CloseBtn>
      </TopRightGroup>
      <ModalToolbar>
        <CoordReadout>
          {selectedBboxIndex != null && bboxes[selectedBboxIndex]
            ? (() => {
                const b = bboxes[selectedBboxIndex]
                const f = (v: number) => Number.isFinite(v) ? v.toFixed(4) : '0'
                return `bbox x=${f(b.x)} y=${f(b.y)} w=${f(b.w)} h=${f(b.h)}`
              })()
            : selectedPointIndex != null && points[selectedPointIndex]
              ? (() => {
                  const p = points[selectedPointIndex]
                  const f = (v: number) => Number.isFinite(v) ? v.toFixed(4) : '0'
                  return `point x=${f(p.x)} y=${f(p.y)}`
                })()
              : liveNorm != null
                ? (() => {
                    const f = (v: number) => Number.isFinite(v) ? v.toFixed(4) : '0'
                    return `cursor x=${f(liveNorm.nx)} y=${f(liveNorm.ny)}`
                  })()
                : '\u00a0'}
        </CoordReadout>
        <IconBtn type="button" title="Cursor (select & move)" $active={mode === 'cursor'} onClick={() => setMode('cursor')}>
          <CursorIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Draw bbox"
          $active={mode === 'bbox'}
          onClick={() => {
            setSelectedBboxIndex(null)
            setSelectedPointIndex(null)
            setMode('bbox')
          }}
        >
          <BboxIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Add point"
          $active={mode === 'point'}
          onClick={() => {
            setSelectedBboxIndex(null)
            setSelectedPointIndex(null)
            setMode('point')
          }}
        >
          <PointIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Classification"
          $active={mode === 'classification'}
          onClick={() => {
            setSelectedBboxIndex(null)
            setSelectedPointIndex(null)
            setMode('classification')
          }}
        >
          <ClassificationIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Undo (Ctrl+Z)"
          $active={false}
          disabled={historyIndex <= 0}
          onClick={handleUndo}
        >
          <UndoIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Redo (Ctrl+Y)"
          $active={false}
          disabled={historyIndex >= history.length - 1}
          onClick={handleRedo}
        >
          <RedoIcon />
        </IconBtn>
        <IconBtn
          type="button"
          title="Reset (clear all bboxes & points)"
          $active={false}
          disabled={bboxes.length === 0 && points.length === 0}
          onClick={handleReset}
        >
          <ResetIcon />
        </IconBtn>
        <DangerIconBtn
          type="button"
          title={hasGroup ? 'Delete image or group' : 'Delete image'}
          disabled={!onDeleteImages || isDeletingImage}
          onClick={openDeleteImageDialog}
        >
          <TrashIcon />
        </DangerIconBtn>
        {/* Mobile info toggle — only visible on mobile */}
        <IconBtn
          type="button"
          title="Info & classes"
          $active={mobileSidebarVisible}
          onClick={() => setMobileSidebarVisible((v) => !v)}
          style={{ marginLeft: 'auto', display: 'none' }}
          className="mobile-info-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </IconBtn>
      </ModalToolbar>
      <ImageAndDotsRow>
      {hasGroup && groupImages && (
        <GroupDotsStrip ref={dotsStripRef} title="Scroll or click to switch image (↑↓ keys)">
          {groupImages.map((_, i) => (
            <GroupDotWrap key={i}>
              <GroupDot
                type="button"
                $active={i === groupImageIndex}
                onClick={() => updateGroupImageIndex(i)}
                aria-label={i === 0 ? `Representative, image 1 of ${groupImages.length}` : `Image ${i + 1} of ${groupImages.length}`}
                title={i === 0 ? `Representative (1 of ${groupImages.length})` : `Image ${i + 1} of ${groupImages.length}`}
              />
              {i === 0 && <GroupDotRepLabel>Rep</GroupDotRepLabel>}
            </GroupDotWrap>
          ))}
        </GroupDotsStrip>
      )}
      <ImageWrap ref={imageWrapRef}>
        <ZoomWrap $zoom={zoom} $panX={pan.x} $panY={pan.y}>
          <ImageAreaWrap ref={wrapRef} $aspect={imageAspect}>
            <ModalImg
              src={imageUrl}
              alt={currentImage.name || currentImage.id}
              draggable={false}
              onError={() => setIsImageLoading(false)}
              onLoad={(e) => {
                const el = e.currentTarget
                if (el.naturalWidth && el.naturalHeight) {
                  const natW = el.naturalWidth
                  const natH = el.naturalHeight
                  const aspectFromImg = natW / natH
                  setImageAspectFromLoad(aspectFromImg)
                }
                setIsImageLoading(false)
              }}
            />
            {isImageLoading && (
              <ModalImageLoading>
                <GridCellSpinner />
              </ModalImageLoading>
            )}
            {mode === 'cursor' && (
          <CursorSelectLayer
            $cursor="default"
            onMouseDown={handleCursorMouseDown}
            onMouseMove={handleCursorMouseMove}
            onMouseUp={handleCursorMouseUp}
            onMouseLeave={handleCursorMouseLeave}
            onContextMenu={openContextMenu}
          />
        )}
        {mode === 'bbox' && (
          <BboxLayer
            onMouseDown={handleBboxMouseDown}
            onMouseMove={(e) => {
              updateCrosshair(e)
              handleBboxMouseMove(e)
            }}
            onMouseUp={handleBboxMouseUp}
            onMouseLeave={() => {
              clearCrosshair()
              handleBboxMouseUp()
            }}
          />
        )}
        {mode === 'point' && (
          <BboxLayer
            onClick={handlePointClick}
            onMouseMove={updateCrosshair}
            onMouseLeave={clearCrosshair}
          />
        )}
        {(mode === 'bbox' || mode === 'point') && crosshairPos != null && (
          <CrosshairOverlay $x={crosshairPos.x} $y={crosshairPos.y}>
            <CrosshairLineV $x={crosshairPos.x} $color={selectedClassId ? getColorForClassId(selectedClassId) : CROSSHAIR_NO_CLASS_COLOR} />
            <CrosshairLineH $y={crosshairPos.y} $color={selectedClassId ? getColorForClassId(selectedClassId) : CROSSHAIR_NO_CLASS_COLOR} />
          </CrosshairOverlay>
        )}
        {bboxes.map((b, i) => (
          <React.Fragment key={i}>
            <BboxRect
              $left={b.x}
              $top={b.y}
              $width={b.w}
              $height={b.h}
              $selected={selectedBboxIndex === i}
              $color={getColorForClassId(b.classId)}
            />
            {showBboxClassNames && getNameForClassId(b.classId) && (
              <BboxLabel
                $left={b.x}
                $top={b.y}
                $color={selectedBboxIndex === i ? '#f90' : getColorForClassId(b.classId)}
                title={getNameForClassId(b.classId)}
              >
                {getNameForClassId(b.classId)}
              </BboxLabel>
            )}
          </React.Fragment>
        ))}
        {drawing && (drawing.w > 0 || drawing.h > 0) && (
          <BboxRect
            $left={drawing.x}
            $top={drawing.y}
            $width={drawing.w}
            $height={drawing.h}
            $color={getColorForClassId(selectedClassId ?? undefined)}
          />
        )}
        {points.map((p, i) => (
          <PointMarker
            key={i}
            $x={p.x}
            $y={p.y}
            $selected={selectedPointIndex === i}
            $color={getColorForClassId(p.classId)}
          />
        ))}
        {mode === 'cursor' && selectedBboxIndex != null && bboxes[selectedBboxIndex] && (() => {
          const b = bboxes[selectedBboxIndex]
          return (
            <>
              <ResizeHandle $left={b.x} $top={b.y} />
              <ResizeHandle $left={b.x + b.w} $top={b.y} />
              <ResizeHandle $left={b.x + b.w} $top={b.y + b.h} />
              <ResizeHandle $left={b.x} $top={b.y + b.h} />
            </>
          )
        })()}
          </ImageAreaWrap>
        </ZoomWrap>
      </ImageWrap>
      </ImageAndDotsRow>
      </MainArea>
      <ClassSidebarResizer onMouseDown={handleSidebarResizerMouseDown} />
      <ClassSidebar $width={classSidebarWidth} $mobileVisible={mobileSidebarVisible}>
        <ImageInfoSection>
          <ImageInfoTitle>Image info</ImageInfoTitle>
          {hasGroup && groupImages && (
            <ImageInfoRow>
              <ImageInfoLabel>Position</ImageInfoLabel>
              <ImageInfoValue>
                {groupImageIndex === 0
                  ? `Representative (1 of ${groupImages.length})`
                  : `Image ${groupImageIndex + 1} of ${groupImages.length}`}
              </ImageInfoValue>
            </ImageInfoRow>
          )}
          <ImageInfoRow>
            <ImageInfoLabel>File</ImageInfoLabel>
            <ImageInfoValue title={currentImage.name ?? currentImage.id}>{(currentImage.name ?? currentImage.id) || '—'}</ImageInfoValue>
          </ImageInfoRow>
          <ImageInfoRow>
            <ImageInfoLabel>Uploaded</ImageInfoLabel>
            <ImageInfoValue>{currentImage.created_at ? formatImageDate(currentImage.created_at) : '—'}</ImageInfoValue>
          </ImageInfoRow>
          <ImageInfoRow>
            <ImageInfoLabel>Captured</ImageInfoLabel>
            <ImageInfoValue>{currentImage.captured_at ? formatImageDate(currentImage.captured_at) : '—'}</ImageInfoValue>
          </ImageInfoRow>
          <ImageInfoRow>
            <ImageInfoLabel>Source</ImageInfoLabel>
            <ImageInfoValue>{currentImage.source === 'camera' ? 'Camera' : 'Upload'}</ImageInfoValue>
          </ImageInfoRow>
          {currentImage.source === 'camera' && currentImage.camera_ip && (
            <ImageInfoRow>
              <ImageInfoLabel>Camera IP</ImageInfoLabel>
              <ImageInfoValue title={currentImage.camera_ip}>{currentImage.camera_ip}</ImageInfoValue>
            </ImageInfoRow>
          )}
          {currentImage.uploader && (
            <ImageInfoRow>
              <ImageInfoLabel>Uploader</ImageInfoLabel>
              <ImageInfoValue>{currentImage.uploader}</ImageInfoValue>
            </ImageInfoRow>
          )}
          {((currentImage.width != null && currentImage.width > 0) || (currentImage.height != null && currentImage.height > 0)) && (
            <ImageInfoRow>
              <ImageInfoLabel>Dimensions</ImageInfoLabel>
              <ImageInfoValue>{currentImage.width ?? 0} × {currentImage.height ?? 0}</ImageInfoValue>
            </ImageInfoRow>
          )}
          {currentImage.size_bytes != null && currentImage.size_bytes > 0 && (
            <ImageInfoRow>
              <ImageInfoLabel>Size</ImageInfoLabel>
              <ImageInfoValue>{formatBytes(currentImage.size_bytes)}</ImageInfoValue>
            </ImageInfoRow>
          )}
          <ImageInfoRow>
            <ImageInfoLabel>Split</ImageInfoLabel>
            <SplitChipRow>
              <SplitChipButton
                type="button"
                $tone="clear"
                $active={currentImage.split == null}
                onClick={() => handleSplitChange(null)}
              >
                Train
              </SplitChipButton>
              <SplitChipButton
                type="button"
                $tone="eval"
                $active={currentImage.split === 'eval'}
                onClick={() => handleSplitChange(currentImage.split === 'eval' ? null : 'eval')}
              >
                Eval
              </SplitChipButton>
              <SplitChipButton
                type="button"
                $tone="test"
                $active={currentImage.split === 'test'}
                onClick={() => handleSplitChange(currentImage.split === 'test' ? null : 'test')}
              >
                Test
              </SplitChipButton>
            </SplitChipRow>
          </ImageInfoRow>
        </ImageInfoSection>
        <ClassSidebarTitleRow>
          <ClassSidebarTitle>Class</ClassSidebarTitle>
          {onRequestAutoDetection && (
            <AiDetectBtnWrap
              onMouseEnter={() => setAiDetectTooltipVisible(true)}
              onMouseLeave={() => setAiDetectTooltipVisible(false)}
            >
              {aiDetectTooltipVisible && (
                <AiDetectChecklistTooltip role="tooltip" aria-live="polite">
                  <AiDetectChecklistTitle>AI detection</AiDetectChecklistTitle>
                  {aiDetectRequirements.map((r) => (
                    <AiDetectChecklistRow key={r.id} $done={r.done}>
                      <CheckIcon $done={r.done} aria-hidden>
                        {r.done ? (
                          <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </CheckIcon>
                      <span>{r.label}</span>
                    </AiDetectChecklistRow>
                  ))}
                </AiDetectChecklistTooltip>
              )}
              {aiDetectMessage && (
                <AiDetectToast role="status">{aiDetectMessage}</AiDetectToast>
              )}
              <AiDetectBtn
                type="button"
                $disabled={!aiDetectAllDone || isAutoDetecting}
                disabled={!aiDetectAllDone || isAutoDetecting}
                onClick={handleRequestAutoDetection}
                title={
                  isAutoDetecting
                    ? 'Detecting…'
                    : aiDetectAllDone
                      ? 'Run AI object detection on this image'
                      : 'Hover for requirements'
                }
                aria-label="Run AI object detection"
              >
                {isAutoDetecting ? (
                  <AiDetectSpinner aria-hidden />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor" opacity={0.9} />
                    <path d="M19 14L19.8 16.2L22 17L19.8 17.8L19 20L18.2 17.8L16 17L18.2 16.2L19 14Z" fill="currentColor" opacity={0.7} />
                    <path d="M5 4L5.6 5.8L7.4 6.4L5.6 7L5 8.8L4.4 7L2.6 6.4L4.4 5.8L5 4Z" fill="currentColor" opacity={0.7} />
                  </svg>
                )}
              </AiDetectBtn>
            </AiDetectBtnWrap>
          )}
        </ClassSidebarTitleRow>
        <SidebarScroll>
          <SidebarScrollInner>
          <ClassList>
            {selectableClasses.map((c) => {
              const isAssignedToSelection =
                (selectedBboxIndex != null && bboxes[selectedBboxIndex]?.classId === c.id) ||
                (selectedPointIndex != null && points[selectedPointIndex]?.classId === c.id)
              const isClassificationAssigned = classificationAssignedClassIds.includes(c.id)
              const isActivelySelected =
                mode === 'classification' ? false : selectedClassId === c.id || isAssignedToSelection
              return (
                <ClassRow
                  key={c.id}
                  $selected={isActivelySelected}
                  $classified={isClassificationAssigned}
                  onMouseEnter={(e) => showClassPreview(c, e.currentTarget)}
                  onMouseLeave={() => setHoveredClassPreview((prev) => (prev?.item.id === c.id ? null : prev))}
                  onFocus={(e) => showClassPreview(c, e.currentTarget)}
                  onBlur={() => setHoveredClassPreview((prev) => (prev?.item.id === c.id ? null : prev))}
                  onClick={() => {
                    if (mode === 'classification') {
                      handleClassificationToggle(c.id)
                    } else if (selectedClassId === c.id) {
                      setSelectedClassId(null)
                    } else {
                      assignClassToSelection(c.id)
                    }
                  }}
                >
                  <ClassColorSwatch $color={c.color} />
                  <ClassNameText $active={isActivelySelected || isClassificationAssigned} title={c.name}>
                    {c.name}
                  </ClassNameText>
                </ClassRow>
              )
            })}
          </ClassList>
          <CommentsSection>
            <CommentsHeader>
              <CommentsTitle>Comments</CommentsTitle>
              <CommentCount>{currentComments.length}</CommentCount>
            </CommentsHeader>
            {currentComments.length === 0 ? (
              <EmptyComments>
                {hasGroup ? 'No comments yet for this group.' : 'No comments yet for this image.'}
              </EmptyComments>
            ) : (
              <CommentThread>
                {currentComments.map((comment) => (
                  <CommentCard key={comment.id}>
                    <CommentMetaRow>
                      <CommentAuthor>{comment.author_name || comment.author_email}</CommentAuthor>
                      <CommentMetaRight>
                        <CommentTimestamp>{formatImageDate(comment.updated_at || comment.created_at)}</CommentTimestamp>
                        {comment.can_edit && (
                          <CommentActions>
                            <CommentActionButton
                              type="button"
                              onClick={() => handleStartEditComment(comment)}
                              title="Edit comment"
                              aria-label="Edit comment"
                            >
                              <PencilIcon />
                            </CommentActionButton>
                        <CommentActionButton
                          type="button"
                          $danger
                          onClick={() => setArchiveCommentTarget(comment)}
                          title="Archive comment"
                          aria-label="Archive comment"
                        >
                              <ArchiveIcon />
                            </CommentActionButton>
                          </CommentActions>
                        )}
                      </CommentMetaRight>
                    </CommentMetaRow>
                    <CommentBody>{renderCommentBody(comment.body)}</CommentBody>
                  </CommentCard>
                ))}
              </CommentThread>
            )}
            <CommentComposer>
              {mentionRange && filteredMentionCandidates.length > 0 && (
                <MentionMenu>
                  {filteredMentionCandidates.map((candidate, index) => (
                    <MentionOption
                      key={candidate.email}
                      type="button"
                      $active={index === mentionIndex}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        insertMentionCandidate(candidate)
                      }}
                    >
                      <MentionPrimary>{candidate.name || candidate.email}</MentionPrimary>
                      <MentionSecondary>{candidate.email}</MentionSecondary>
                    </MentionOption>
                  ))}
                </MentionMenu>
              )}
              <CommentTextarea
                ref={commentTextareaRef}
                value={commentDraft}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  setCommentDraft(value)
                  updateMentionState(value, event.currentTarget.selectionStart)
                }}
                onClick={(event) => updateMentionState(event.currentTarget.value, event.currentTarget.selectionStart)}
                onKeyUp={(event) => updateMentionState(event.currentTarget.value, event.currentTarget.selectionStart)}
                onKeyDown={(event) => {
                  if (mentionRange && filteredMentionCandidates.length > 0) {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      setMentionIndex((prev) => (prev + 1) % filteredMentionCandidates.length)
                      return
                    }
                    if (event.key === 'ArrowUp') {
                      event.preventDefault()
                      setMentionIndex((prev) => (prev - 1 + filteredMentionCandidates.length) % filteredMentionCandidates.length)
                      return
                    }
                    if (event.key === 'Enter' || event.key === 'Tab') {
                      event.preventDefault()
                      insertMentionCandidate(filteredMentionCandidates[mentionIndex])
                      return
                    }
                    if (event.key === 'Escape') {
                      setMentionRange(null)
                      return
                    }
                  }
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                    event.preventDefault()
                    void handleSubmitComment()
                  }
                }}
                placeholder="Add a comment. Use @username to mention a project member."
              />
              {commentError && <CommentError>{commentError}</CommentError>}
              <CommentComposerActions>
                <CommentHint>Press Ctrl/Cmd+Enter to submit.</CommentHint>
                <CommentButtons>
                  {editingCommentId && (
                    <CommentButton
                      type="button"
                      $secondary
                      onClick={() => {
                        setEditingCommentId(null)
                        setCommentDraft('')
                        setCommentError(null)
                        setMentionRange(null)
                      }}
                      disabled={isCommentSaving}
                    >
                      Cancel
                    </CommentButton>
                  )}
                  <CommentButton
                    type="button"
                    onClick={() => void handleSubmitComment()}
                    disabled={isCommentSaving || !commentDraft.trim()}
                  >
                    {isCommentSaving ? 'Saving…' : editingCommentId ? 'Update' : 'Post'}
                  </CommentButton>
                </CommentButtons>
              </CommentComposerActions>
            </CommentComposer>
          </CommentsSection>
          </SidebarScrollInner>
        </SidebarScroll>
      </ClassSidebar>
      {/* Mobile sidebar backdrop */}
      {mobileSidebarVisible && (
        <div
          onClick={() => setMobileSidebarVisible(false)}
          style={{
            display: 'none',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 19,
          }}
          className="mobile-sidebar-backdrop"
        />
      )}
      {hoveredClassPreview && (
        <ClassHoverCard $top={hoveredClassPreview.top} $left={hoveredClassPreview.left}>
          <ClassHoverTitle>{hoveredClassPreview.item.name}</ClassHoverTitle>
          {hoveredClassPreview.item.reference_image_url ? (
            <ClassHoverImage
              src={resolveAssetUrl(hoveredClassPreview.item.reference_image_url)}
              alt={`${hoveredClassPreview.item.name} reference`}
            />
          ) : null}
          {hoveredClassPreview.item.description?.trim() ? (
            <ClassHoverDescription>{hoveredClassPreview.item.description.trim()}</ClassHoverDescription>
          ) : null}
        </ClassHoverCard>
      )}
      {archiveCommentTarget && (
        <ConfirmOverlay onClick={() => (isCommentSaving ? undefined : setArchiveCommentTarget(null))}>
          <ConfirmCard onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>Archive comment?</ConfirmTitle>
            <ConfirmText>
              This will remove the selected comment from this image thread.
            </ConfirmText>
            <ConfirmActions>
              <ConfirmButton
                type="button"
                $secondary
                onClick={() => setArchiveCommentTarget(null)}
                disabled={isCommentSaving}
              >
                Cancel
              </ConfirmButton>
              <ConfirmButton
                type="button"
                $danger
                onClick={() => void handleDeleteComment(archiveCommentTarget)}
                disabled={isCommentSaving}
              >
                {isCommentSaving ? 'Archiving…' : 'Archive'}
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmOverlay>
      )}
      {deleteImageDialogOpen && (
        <ConfirmOverlay onClick={closeDeleteImageDialog}>
          <ConfirmCard onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>{hasGroup ? 'Delete from group?' : 'Delete image?'}</ConfirmTitle>
            <ConfirmText>
              {hasGroup
                ? 'Choose whether to delete only the currently opened image or every image in this group.'
                : 'This will permanently remove the current image from the dataset.'}
            </ConfirmText>
            {deleteImageError ? <ConfirmError>{deleteImageError}</ConfirmError> : null}
            <ConfirmActions>
              <ConfirmButton
                type="button"
                $secondary
                onClick={closeDeleteImageDialog}
                disabled={isDeletingImage}
              >
                Cancel
              </ConfirmButton>
              {hasGroup && groupImages ? (
                <ConfirmButton
                  type="button"
                  $danger
                  onClick={() => void handleDeleteImages([currentImage.id])}
                  disabled={isDeletingImage}
                >
                  {isDeletingImage ? 'Deleting…' : 'This image'}
                </ConfirmButton>
              ) : null}
              <ConfirmButton
                type="button"
                $danger
                onClick={() => void handleDeleteImages(hasGroup && groupImages ? groupImages.map((item) => item.id) : [currentImage.id])}
                disabled={isDeletingImage}
              >
                {isDeletingImage ? 'Deleting…' : hasGroup ? 'Entire group' : 'Delete'}
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmOverlay>
      )}
      </ModalContent>
    </Overlay>
  )
}
