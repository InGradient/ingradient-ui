import { useCallback, useId, useRef } from 'react'
import ReactDOM from 'react-dom'
import { DialogShell, Switch, useClickOutside, iconSizeNumbers } from '@ingradient/ui'
import { Button, DatePickerField, DropdownSelect, AlertCircleIcon, CheckCircleIcon, FilterIcon, ImageIcon, InfoIcon } from '@ingradient/ui/components'
import {
  Container, Header, FilterButtonWrap, FilterPopover,
  FilterSection, FilterSectionTitle, FilterRow, DateRow, DateLabel, FilterButtonLabel,
  LogList, LogItem, LogTime, LogMessage, DetailPanel, DetailImageClickable,
  ImageModalImg, DetailContent, DetailPlaceholder,
  LogPlaceholder,
} from './LogPanelView.styles'
import { getTimeFromMsg, type DatePreset } from './log-filters'
import { LogDetailTableView } from './LogDetailTableView'
import type { LogPanelViewProps } from './types'

export function LogPanelView(props: LogPanelViewProps): JSX.Element {
  const {
    entries, hasMore,
    showFilterPopover, datePreset, dateFrom, dateTo,
    showProgress, showConnections, showDebug,
    hoveredLogIndex, hoveredLog, displayImageUrl, modalImageUrl,
    labels,
    onToggleFilterPopover, onCloseFilterPopover,
    onSetDatePreset, onSetDateFrom, onSetDateTo,
    onSetShowProgress, onSetShowConnections, onSetShowDebug,
    onSetHoveredLogIndex, onSetPanelHovered, onScrollNearBottom,
    onOpenImageModal, onCloseImageModal, onOpenSavedImage,
  } = props

  const filterId = useId()
  const filterPopoverRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const logListRef = useRef<HTMLDivElement>(null)

  useClickOutside({
    refs: [filterPopoverRef, filterButtonRef],
    onClickOutside: onCloseFilterPopover,
    enabled: showFilterPopover,
    event: 'mousedown',
  })

  const handleScroll = useCallback(() => {
    const el = logListRef.current
    if (!el || !hasMore) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      onScrollNearBottom()
    }
  }, [hasMore, onScrollNearBottom])

  const panelVisible = hoveredLog !== null

  return (
    <Container onMouseLeave={(event) => {
      if (!event.currentTarget.contains(document.activeElement) && !modalImageUrl) onSetHoveredLogIndex(null)
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !(event.relatedTarget as HTMLElement | null)?.closest('[role="dialog"]') && !modalImageUrl) {
        onSetPanelHovered(false)
        onSetHoveredLogIndex(null)
      }
    }} onKeyDown={(event) => {
      if (event.key === 'Escape' && !modalImageUrl) {
        onCloseFilterPopover()
        onSetPanelHovered(false)
        onSetHoveredLogIndex(null)
        logListRef.current?.focus()
      }
    }}>
      <Header>
        <span>{labels.title}</span>
        <FilterButtonWrap>
          <Button variant="secondary" size="sm" ref={filterButtonRef} onClick={onToggleFilterPopover} title={labels.filterButton}>
            <FilterIcon size={iconSizeNumbers.sm} /><FilterButtonLabel>{labels.filterButton}</FilterButtonLabel>
          </Button>
          {showFilterPopover && (
            <FilterPopover ref={filterPopoverRef}>
              <FilterSection>
                <FilterSectionTitle id={`${filterId}-preset-label`}>{labels.filterByDate}</FilterSectionTitle>
                <DropdownSelect
                  aria-label={labels.filterByDate}
                  value={datePreset}
                  options={[
                    { value: 'all',    label: labels.dateAll },
                    { value: 'today',  label: labels.dateToday },
                    { value: 'last7',  label: labels.dateLast7 },
                    { value: 'last30', label: labels.dateLast30 },
                    { value: 'custom', label: labels.dateCustom },
                  ]}
                  onChange={(v) => onSetDatePreset(v as DatePreset)}
                />
                {datePreset === 'custom' && (
                  <>
                    <DateRow role="group" aria-labelledby={`${filterId}-from`}>
                      <DateLabel id={`${filterId}-from`}>{labels.dateFrom}</DateLabel>
                      <DatePickerField placeholder={labels.dateFrom} value={dateFrom} onChange={onSetDateFrom} />
                    </DateRow>
                    <DateRow role="group" aria-labelledby={`${filterId}-to`}>
                      <DateLabel id={`${filterId}-to`}>{labels.dateTo}</DateLabel>
                      <DatePickerField placeholder={labels.dateTo} value={dateTo} onChange={onSetDateTo} />
                    </DateRow>
                  </>
                )}
              </FilterSection>
              <FilterSection>
                <FilterSectionTitle>{labels.filterLogType}</FilterSectionTitle>
                <FilterRow>
                  <Switch id={`${filterId}-progress`} checked={showProgress} onChange={(e) => onSetShowProgress(e.target.checked)} />
                  <label htmlFor={`${filterId}-progress`}>{labels.filterProgress}</label>
                </FilterRow>
                <FilterRow>
                  <Switch id={`${filterId}-connections`} checked={showConnections} onChange={(e) => onSetShowConnections(e.target.checked)} />
                  <label htmlFor={`${filterId}-connections`}>{labels.filterConnections}</label>
                </FilterRow>
                <FilterRow>
                  <Switch id={`${filterId}-debug`} checked={showDebug} onChange={(e) => onSetShowDebug(e.target.checked)} />
                  <label htmlFor={`${filterId}-debug`}>{labels.filterDebug}</label>
                </FilterRow>
              </FilterSection>
            </FilterPopover>
          )}
        </FilterButtonWrap>
      </Header>
      <LogList ref={logListRef} role="region" aria-label={labels.title} tabIndex={0} onScroll={handleScroll}>
        {entries.length === 0 && <LogPlaceholder>{labels.noActivity}</LogPlaceholder>}
        {entries.map(({ log, index: i }) => (
          <LogItem
            key={i}
            type={log.type}
            onMouseEnter={() => onSetHoveredLogIndex(i)}
            tabIndex={0}
            role="button"
            aria-expanded={hoveredLogIndex === i}
            aria-controls={`${filterId}-detail`}
            onFocus={() => onSetHoveredLogIndex(i)}
            onClick={() => onSetHoveredLogIndex(i)}
            onKeyDown={(event) => {
              const rows = Array.from(logListRef.current?.querySelectorAll<HTMLElement>('[role="button"]') ?? [])
              const index = rows.indexOf(event.currentTarget)
              const next = event.key === 'ArrowDown' ? rows[index + 1] : event.key === 'ArrowUp' ? rows[index - 1] : event.key === 'Home' ? rows[0] : event.key === 'End' ? rows[rows.length - 1] : null
              if (next) { event.preventDefault(); next.focus() }
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSetHoveredLogIndex(i)
                document.getElementById(`${filterId}-detail`)?.focus()
              }
            }}
            data-active={hoveredLogIndex === i || undefined}
          >
            <LogTime>{getTimeFromMsg(log.msg ?? '') || '—'}</LogTime>
            {log.type === 'error'   && <AlertCircleIcon size={iconSizeNumbers.sm} color="var(--ig-color-danger)" />}
            {log.type === 'success' && <CheckCircleIcon size={iconSizeNumbers.sm} color="var(--ig-color-success)" />}
            {log.type === 'info'    && <InfoIcon        size={iconSizeNumbers.sm} color="var(--ig-color-accent-soft)" />}
            <LogMessage title={log.msg ?? ''}>
              {(log.msg ?? '').replace(/^\[\d{1,2}:\d{2}:\d{2}\]\s*/, '')}
            </LogMessage>
          </LogItem>
        ))}
        {hasMore && <LogPlaceholder style={{ minHeight: 'var(--ig-control-height-sm)' }}>...</LogPlaceholder>}
      </LogList>
      <DetailPanel
        id={`${filterId}-detail`}
        role="region"
        aria-label={`${labels.title} detail`}
        tabIndex={-1}
        onFocus={() => onSetPanelHovered(true)}
        $visible={panelVisible}
        onMouseEnter={() => onSetPanelHovered(true)}
        onMouseLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) onSetPanelHovered(false) }}
      >
        <DetailContent>
          {hoveredLog ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => { onSetHoveredLogIndex(null); onSetPanelHovered(false); logListRef.current?.focus() }}>Close log detail</Button>
              {displayImageUrl && (
                <Button variant="ghost" aria-label="Enlarge capture image" onClick={() => onOpenImageModal(displayImageUrl)}>
                  <DetailImageClickable src={displayImageUrl} alt="Capture" />
                </Button>
              )}
              {hoveredLog.imagePath && !displayImageUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  style={{ marginBottom: 'var(--ig-space-4)' }}
                  onClick={() => onOpenSavedImage(hoveredLog.imagePath!)}
                >
                  <ImageIcon size={iconSizeNumbers.sm} /> {labels.openSavedImage}
                </Button>
              )}
              <LogDetailTableView text={hoveredLog.detail ?? hoveredLog.msg} />
            </>
          ) : (
            <DetailPlaceholder>{labels.hoverHint}</DetailPlaceholder>
          )}
        </DetailContent>
      </DetailPanel>
      {modalImageUrl && ReactDOM.createPortal(
        <DialogShell title="Capture enlarged" onClose={onCloseImageModal}>
          <ImageModalImg src={modalImageUrl} alt="Capture enlarged" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
        </DialogShell>,
        document.body,
      )}
    </Container>
  )
}
