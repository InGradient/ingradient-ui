import { useCallback, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Switch, useClickOutside } from '@ingradient/ui'
import { DatePickerField, DropdownSelect } from '@ingradient/ui/components'
import { AlertCircle, CheckCircle, Filter, ImageIcon, Info } from 'lucide-react'
import {
  Container, Header, FilterButtonWrap, FilterActionButton, FilterPopover,
  FilterSection, FilterSectionTitle, FilterRow, DateRow, DateLabel, FilterButtonLabel,
  LogList, LogItem, LogTime, LogMessage, DetailPanel, DetailImageClickable,
  ImageModalOverlay, ImageModalImg, DetailContent, DetailPlaceholder, OpenImageButton,
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
    <Container>
      <Header>
        <span>{labels.title}</span>
        <FilterButtonWrap>
          <FilterActionButton ref={filterButtonRef} onClick={onToggleFilterPopover} title={labels.filterButton}>
            <Filter size={14} /><FilterButtonLabel>{labels.filterButton}</FilterButtonLabel>
          </FilterActionButton>
          {showFilterPopover && (
            <FilterPopover ref={filterPopoverRef}>
              <FilterSection>
                <FilterSectionTitle as="label" htmlFor="log-filter-date-preset">{labels.filterByDate}</FilterSectionTitle>
                <DropdownSelect
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
                    <DateRow>
                      <DateLabel>{labels.dateFrom}</DateLabel>
                      <DatePickerField value={dateFrom} onChange={onSetDateFrom} />
                    </DateRow>
                    <DateRow>
                      <DateLabel>{labels.dateTo}</DateLabel>
                      <DatePickerField value={dateTo} onChange={onSetDateTo} />
                    </DateRow>
                  </>
                )}
              </FilterSection>
              <FilterSection>
                <FilterSectionTitle>{labels.filterLogType}</FilterSectionTitle>
                <FilterRow>
                  <Switch checked={showProgress} onChange={(e) => onSetShowProgress(e.target.checked)} />
                  <span>{labels.filterProgress}</span>
                </FilterRow>
                <FilterRow>
                  <Switch checked={showConnections} onChange={(e) => onSetShowConnections(e.target.checked)} />
                  <span>{labels.filterConnections}</span>
                </FilterRow>
                <FilterRow>
                  <Switch checked={showDebug} onChange={(e) => onSetShowDebug(e.target.checked)} />
                  <span>{labels.filterDebug}</span>
                </FilterRow>
              </FilterSection>
            </FilterPopover>
          )}
        </FilterButtonWrap>
      </Header>
      <LogList ref={logListRef} onScroll={handleScroll}>
        {entries.length === 0 && <LogPlaceholder>{labels.noActivity}</LogPlaceholder>}
        {entries.map(({ log, index: i }) => (
          <LogItem
            key={i}
            type={log.type}
            onMouseEnter={() => onSetHoveredLogIndex(i)}
            onMouseLeave={() => onSetHoveredLogIndex(null)}
            data-active={hoveredLogIndex === i || undefined}
          >
            <LogTime>{getTimeFromMsg(log.msg ?? '') || '—'}</LogTime>
            {log.type === 'error'   && <AlertCircle size={14} color="var(--ig-color-danger)" />}
            {log.type === 'success' && <CheckCircle size={14} color="var(--ig-color-success)" />}
            {log.type === 'info'    && <Info        size={14} color="var(--ig-color-accent-soft)" />}
            <LogMessage title={log.msg ?? ''}>
              {(log.msg ?? '').replace(/^\[\d{1,2}:\d{2}:\d{2}\]\s*/, '')}
            </LogMessage>
          </LogItem>
        ))}
        {hasMore && <LogPlaceholder style={{ minHeight: 32 }}>...</LogPlaceholder>}
      </LogList>
      <DetailPanel
        $visible={panelVisible}
        onMouseEnter={() => onSetPanelHovered(true)}
        onMouseLeave={() => onSetPanelHovered(false)}
      >
        <DetailContent>
          {hoveredLog ? (
            <>
              {displayImageUrl && (
                <DetailImageClickable
                  src={displayImageUrl}
                  alt="Capture"
                  onClick={() => onOpenImageModal(displayImageUrl)}
                />
              )}
              {hoveredLog.imagePath && !displayImageUrl && (
                <OpenImageButton type="button" onClick={() => onOpenSavedImage(hoveredLog.imagePath!)}>
                  <ImageIcon size={14} /> {labels.openSavedImage}
                </OpenImageButton>
              )}
              <LogDetailTableView text={hoveredLog.detail ?? hoveredLog.msg} />
            </>
          ) : (
            <DetailPlaceholder>{labels.hoverHint}</DetailPlaceholder>
          )}
        </DetailContent>
      </DetailPanel>
      {modalImageUrl && ReactDOM.createPortal(
        <ImageModalOverlay onClick={onCloseImageModal}>
          <ImageModalImg src={modalImageUrl} alt="Capture enlarged" />
        </ImageModalOverlay>,
        document.body,
      )}
    </Container>
  )
}
