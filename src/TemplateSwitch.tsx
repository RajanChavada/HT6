import { BillSplitter } from './templates/BillSplitter'
import { CodeReview } from './templates/CodeReview'
import { DebugAssistant } from './templates/DebugAssistant'
import { KanbanBoard } from './templates/KanbanBoard'
import { GenericView } from './templates/GenericView'
import type { Receipt, Code, ErrorData, Whiteboard, Generic } from './core/types'

export function TemplateSwitch({ templateId, data }: { templateId: string; data: unknown }) {
  switch (templateId) {
    case 'bill-splitter':
      return <BillSplitter data={data as Receipt} />
    case 'code-review':
      return <CodeReview data={data as Code} />
    case 'debug-assistant':
      return <DebugAssistant data={data as ErrorData} />
    case 'kanban-board':
      return <KanbanBoard data={data as Whiteboard} />
    default:
      return <GenericView data={data as Generic} />
  }
}
