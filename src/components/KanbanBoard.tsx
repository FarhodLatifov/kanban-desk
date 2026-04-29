import { PlusCircle } from "lucide-react"
import { useState, useMemo } from "react"
import type { Column, Id } from "../types"
import ColumnContainer from "./ColumnContainer"
import { createPortal } from "react-dom"

import { DndContext, type DragStartEvent, DragOverlay, type DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"

const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3
            }
        })
    )

    function generateId() {
        return Math.floor(Math.random() * 100000)
    }

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
    }

    function deleteColumn(id: Id) {
        const filteredColumn = columns.filter(col => col.id !== id)
        setColumns(filteredColumn)
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return
        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId)
            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                <div className="m-auto flex gap-4">
                    <SortableContext items={columnsId}>
                        <div className="flex gap-4">{columns.map(col => <ColumnContainer column={col} deleteColumn={deleteColumn} key={col.id} />)}</div>
                    </SortableContext>
                    <button className="h-15 w-87.5 cursor-pointer rounded-lg bg-[#0D1117] border-2 border-[#161C22] ring-rose-500 hover:ring-2 p-4 flex items-center gap-2" onClick={createNewColumn}><PlusCircle color="white" />Add Column</button>
                </div>
                {
                    createPortal(
                        <DragOverlay>
                            {activeColumn && <ColumnContainer column={activeColumn}
                                deleteColumn={deleteColumn} />}
                        </DragOverlay>, document.body
                    )
                }
            </DndContext>
        </div>
    )
}

export default KanbanBoard