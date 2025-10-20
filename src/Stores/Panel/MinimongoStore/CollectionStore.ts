import { Searchable } from '@/Stores/Common/Searchable'
import { makeObservable } from 'mobx'
import { PanelStore } from '@/Stores/PanelStore'

export class CollectionStore extends Searchable<IDocumentWrapper> {
  constructor() {
    super()
    makeObservable(this)
  }

  filterFunction = (collection: IDocumentWrapper[], search: string) =>
    collection
      .filter(
        document =>
          !search ||
          JSON.stringify(document)
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
      .filter(document => {
        const selectedFrameId = PanelStore.frameStore.selectedFrameId
        // Show all if no frame selected
        if (!selectedFrameId) return true
        // Show documents without frameInfo when a frame is selected (backwards compatibility)
        if (!document.frameInfo) return true
        // Otherwise, filter by frameId
        return document.frameInfo.frameId === selectedFrameId
      })
}
