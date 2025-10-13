# Admin Activity Edit Mode - Implementation Plan

## 📋 Core Features Overview

### 🎯 Main Functionality
1. **Edit Mode Toggle**: Edit button → switches to edit page with Discard/Save buttons
2. **Three-Column Layout**: Left panel (block types) + Main content (editable pages) + Fixed positioning
3. **Multi-Level Editing**: Activity metadata, Page metadata, Block content
4. **Drag & Drop System**: Block types → pages, blocks within pages, page reordering
5. **CRUD Operations**: Create/Read/Update/Delete for pages and blocks
6. **Auto-save State Management**: Track changes, handle conflicts, version updates

## 🏗️ Component Architecture

```
AdminActivityEditPage
├── EditToolbar (top: Back + Discard + Save)
├── EditLayout
│   ├── LeftPanel (fixed, draggable block types)
│   ├── MainContent (scrollable page editor)
│   │   ├── ActivityMetaEditor
│   │   ├── PageEditCard[] (draggable, with + buttons between)
│   │   │   ├── PageMetaEditor
│   │   │   ├── BlockEditor[] (draggable within page)
│   │   │   └── AddBlockDropZone
│   │   └── AddPageButton
│   └── (Right space reserved for future features)
```

## 🔧 Technical Implementation Strategy

### 1. Drag & Drop Libraries
- **React DnD**: Professional drag/drop with multi-context support
- **Contexts**: `BlockTypePalette`, `PageReordering`, `BlockReordering`
- **Drop Zones**: Page cards (for new blocks), between pages (for reordering)

### 2. State Management
```typescript
interface EditState {
  activityVersion: ActivityVersion;
  pages: EditablePage[];
  changes: ChangeTracker;
  isDirty: boolean;
  saveState: 'idle' | 'saving' | 'error';
}

interface EditablePage extends Page {
  blocks: EditableBlock[];
  isNew?: boolean;
  hasChanges?: boolean;
}

interface EditableBlock extends Block {
  isNew?: boolean;
  hasChanges?: boolean;
  validationErrors?: string[];
}
```

### 3. API Design
```typescript
// New endpoints needed:
PUT /api/activities/activities/{slug}/
PUT /api/activities/pages/{pageId}/
POST /api/activities/pages/
DELETE /api/activities/pages/{pageId}/
PUT /api/activities/blocks/{blockId}/
POST /api/activities/blocks/
DELETE /api/activities/blocks/{blockId}/
```

### 4. Block Type System
```typescript
interface BlockTypePalette {
  text: { icon: 'text_fields', defaultConfig: {...} };
  media: { icon: 'image', defaultConfig: {...} };
  question: { icon: 'quiz', defaultConfig: {...} };
  divider: { icon: 'horizontal_rule', defaultConfig: {...} };
}
```

## 📱 UX Flow

### Navigation Flow
1. Detail page → Edit button → Edit page
2. Edit page → Discard (confirm) → Detail page
3. Edit page → Save → Detail page (with success toast)

### Editing Flow
1. **Activity Level**: Title, description, status, metadata
2. **Page Level**: Title, index, metadata, add/delete/reorder
3. **Block Level**: All config fields, add/delete/reorder

### Drag & Drop Interactions
1. **Block Types → Page**: Creates new block at drop position
2. **Page Reordering**: Visual feedback, ghost placeholder
3. **Block Reordering**: Within page boundaries only
4. **Visual Feedback**: Drag previews, drop indicators, hover states

## 🔒 Data Integrity
- **Optimistic Updates**: Immediate UI feedback
- **Conflict Resolution**: Version checking before save
- **Validation**: Real-time validation with error display
- **Backup**: Auto-save to localStorage for crash recovery

## 🎨 Design System Integration
- **Consistent Styling**: Use existing admin theme
- **Loading States**: Skeleton loaders during save operations
- **Error Handling**: Toast notifications + inline validation
- **Accessibility**: Keyboard navigation for drag/drop alternatives

## 🚀 Implementation Phases

### Phase 1: Basic Edit Page Structure
- [ ] Create AdminActivityEditPage component
- [ ] Add edit button to detail page
- [ ] Implement routing (/admin/activities/:slug/edit)
- [ ] Basic layout with toolbar and content area
- [ ] Activity metadata editing form

### Phase 2: Page Management
- [ ] Create PageEditCard component
- [ ] Implement page creation with + buttons
- [ ] Add page deletion with confirmation
- [ ] Basic page metadata editing

### Phase 3: Block Editing
- [ ] Create BlockEditor components for each type
- [ ] Implement block metadata editing
- [ ] Add block creation and deletion
- [ ] Form validation and error handling

### Phase 4: Drag & Drop System
- [ ] Install and configure React DnD
- [ ] Implement block type palette (left panel)
- [ ] Add drag/drop for block types → pages
- [ ] Implement page reordering
- [ ] Add block reordering within pages

### Phase 5: Save/Discard System
- [ ] Create update API endpoints
- [ ] Implement change tracking
- [ ] Add save/discard functionality
- [ ] Conflict resolution and error handling

### Phase 6: Polish & UX
- [ ] Loading states and animations
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Auto-save to localStorage
- [ ] Accessibility improvements

## 📝 Notes
- Use existing admin design system and components
- Maintain consistent styling with current admin pages
- Ensure all interactions work on both desktop and tablet
- Consider performance for activities with many pages/blocks
- Plan for future features like collaborative editing