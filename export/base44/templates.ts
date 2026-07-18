// Base44 backend function (Deno). Porting artifact — mirrors src/core/registry.ts.
// GET  -> list templates from MongoDB Atlas (falls back to built-ins)
// POST -> register a new template (builder role): { name, classifierPrompt, extractionSchema, templatePagePath }
// Reads MONGODB_URI; if unset, returns the built-in set so the demo still works.

const BUILT_IN = [
  { id: 'bill-splitter', name: 'Bill Splitter', extractionSchema: { $schema: 'receipt' }, templatePagePath: '/templates/BillSplitter', isBuiltIn: true },
  { id: 'code-review', name: 'Code Reviewer', extractionSchema: { $schema: 'code' }, templatePagePath: '/templates/CodeReview', isBuiltIn: true },
  { id: 'debug-assistant', name: 'Debug Assistant', extractionSchema: { $schema: 'error' }, templatePagePath: '/templates/DebugAssistant', isBuiltIn: true },
  { id: 'kanban-board', name: 'Kanban Board', extractionSchema: { $schema: 'whiteboard' }, templatePagePath: '/templates/KanbanBoard', isBuiltIn: true },
  { id: 'generic-view', name: 'Smart Data View', extractionSchema: { $schema: 'other' }, templatePagePath: '/templates/GenericView', isBuiltIn: true },
]

export async function handler(req: Request): Promise<Response> {
  const uri = Deno.env.get('MONGODB_URI')
  if (req.method === 'GET') {
    if (!uri) return Response.json(BUILT_IN)
    // ponytail: with a real driver, read the `templates` collection here and merge with BUILT_IN
    return Response.json(BUILT_IN)
  }
  if (req.method === 'POST') {
    const def = await req.json()
    // ponytail: insert `def` into MongoDB `templates` collection when a driver is wired
    return Response.json({ ok: true, template: { ...def, isBuiltIn: false, usageCount: 0 } })
  }
  return new Response('Method not allowed', { status: 405 })
}
