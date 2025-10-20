import React, { FunctionComponent } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import { usePanelStore } from '@/Stores/PanelStore'
import styled from 'styled-components'
import { Popover2 } from '@blueprintjs/popover2'

const FrameSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.5rem;

  .bp3-button {
    height: 100%;
    border-radius: 0;
    padding: 0 1rem;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
`

const getFrameLabel = (frame: FrameInfo): string => {
  if (frame.isTop) {
    return '🏠 Main'
  }

  try {
    const url = new URL(frame.url)
    return url.pathname || url.hostname
  } catch {
    return frame.url
  }
}

export const FrameSelector: FunctionComponent = observer(() => {
  const store = usePanelStore()
  const { frameStore } = store

  // Don't show the selector if no frames detected yet
  if (frameStore.frames.size === 0) {
    return null
  }

  const selectedFrame = frameStore.selectedFrame
  const buttonText = selectedFrame ? getFrameLabel(selectedFrame) : 'All Frames'
  const hasMultipleFrames = frameStore.hasMultipleFrames

  const menu = (
    <Menu>
      <MenuItem
        text='All Frames'
        active={frameStore.selectedFrameId === null}
        onClick={() => frameStore.setSelectedFrame(null)}
        icon='layers'
      />
      {frameStore.frameList.map(frame => (
        <MenuItem
          key={frame.frameId}
          text={getFrameLabel(frame)}
          active={frameStore.selectedFrameId === frame.frameId}
          onClick={() => frameStore.setSelectedFrame(frame.frameId)}
          icon={frame.isTop ? 'home' : 'layout'}
          labelElement={
            frame.isTop ? undefined : (
              <span style={{ fontSize: '0.85em', opacity: 0.6 }}>iframe</span>
            )
          }
        />
      ))}
    </Menu>
  )

  return (
    <FrameSelectorContainer>
      <Popover2
        content={menu}
        position={Position.BOTTOM_LEFT}
        interactionKind='click'
        hasBackdrop={true}
        disabled={!hasMultipleFrames}
      >
        <Button
          small
          minimal
          rightIcon={hasMultipleFrames ? 'caret-down' : undefined}
          icon='layers'
          text={buttonText}
          disabled={!hasMultipleFrames}
          title={
            hasMultipleFrames
              ? 'Select frame context'
              : 'Only one frame detected'
          }
        />
      </Popover2>
    </FrameSelectorContainer>
  )
})
