import { action, computed, makeObservable, observable } from 'mobx'

export class FrameStore {
  @observable frames: Map<string, FrameInfo> = new Map()
  @observable selectedFrameId: string | null = null

  constructor() {
    makeObservable(this)
  }

  @action
  addFrame(frameInfo: FrameInfo) {
    // Use URL as stable key to avoid duplicates on reload
    // but keep the original frameId for filtering
    const existingFrame = Array.from(this.frames.values()).find(
      f => f.url === frameInfo.url && f.isTop === frameInfo.isTop,
    )

    if (existingFrame) {
      // Update existing frame with new frameId
      this.frames.delete(existingFrame.frameId)
      this.frames.set(frameInfo.frameId, frameInfo)

      // Update selectedFrameId if it was pointing to the old frame
      if (this.selectedFrameId === existingFrame.frameId) {
        this.selectedFrameId = frameInfo.frameId
      }
    } else {
      // New frame
      this.frames.set(frameInfo.frameId, frameInfo)
    }
  }

  @action
  setSelectedFrame(frameId: string | null) {
    this.selectedFrameId = frameId
  }

  @action
  clearFrames() {
    this.frames.clear()
    this.selectedFrameId = null
  }

  @computed
  get frameList(): FrameInfo[] {
    return Array.from(this.frames.values()).sort((a, b) => {
      // Top frame first
      if (a.isTop) return -1
      if (b.isTop) return 1
      // Then sort by URL
      return a.url.localeCompare(b.url)
    })
  }

  @computed
  get hasMultipleFrames(): boolean {
    return this.frames.size > 1
  }

  @computed
  get selectedFrame(): FrameInfo | null {
    if (!this.selectedFrameId) return null
    return this.frames.get(this.selectedFrameId) || null
  }
}


