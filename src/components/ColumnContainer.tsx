import { useSortable } from "@dnd-kit/sortable";
import type { Column, Id } from "../types"
import { Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities"

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void
}

const ColumnContainer = ({ column, deleteColumn }: Props) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        }
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging){
        return <div ref={setNodeRef} style={style} className="bg-[#161C22] w-87.5 h-125 max-h-125 rounded-md flex flex-col opacity-60 border-rose-500 border-2"></div>
    }

    return (
        <div className="bg-[#161C22] w-87.5 h-125 max-h-125 rounded-md flex flex-col" ref={setNodeRef} style={style}>
            <div className="bg-[#0D1117] text-md h-15 cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-4 flex gap-3 items-center justify-between" {...attributes} {...listeners}>
                <div className="flex gap-2 items-center">
                    <div className=" items-center bg-[#161C22] px-4 py-2 text-sm rounded-full">0</div>
                    <div>{column.title}</div>
                </div>
                <button className="flex hover:stroke-white hover:bg-[#161C22] cursor-pointer p-2 rounded-full gap-5" onClick={() => deleteColumn(column.id)}><Trash2 className="text-red-500 " /></button>
            </div>
            <div className="flex justify-center items-center grow bg-[#161C22] px-2 py-1 text-sm">Content</div>
            <div>Footer</div>
        </div>
    )
}

export default ColumnContainer