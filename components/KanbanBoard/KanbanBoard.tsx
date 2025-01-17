import {startTransition, useCallback, useId, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";

import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    useSensor,
    useSensors,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
    Active,
    Over,
    DataRef,
} from "@dnd-kit/core";
import {SortableContext, arrayMove} from "@dnd-kit/sortable";
import {type Element, BoardCard, ElementDragData} from "./BoardCard";
import {type Column, BoardColumn, BoardContainer, ColumnDragData} from "./BoardColumn";
import {coordinateGetter} from "./multipleContainersKeyboardPreset";

export type NestedColumn = Column & {
    children?: NestedColumn[];
};

const defaultCols: NestedColumn[] = [

];

export type ColumnId = (typeof defaultCols)[number]["id"];



interface KonbanBoardProps {
    columns: NestedColumn[];
    elements: Element[];
    setElements: Function;
}

export function KanbanBoard({ columns, elements, setElements }: KonbanBoardProps) {
    //const [columns, setColumns] = useState<Column[]>(columns);
    defaultCols.push(...columns);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeElement, setActiveElement] = useState<Element | null>(null);
    const dndContextId = useId();

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    const hasDraggableData = <T extends Active | Over>(
        entry: T | null | undefined
    ): entry is T & {
        data: DataRef<ElementDragData | ColumnDragData>;
    } => {
        if (!entry) {
            return false;
        }

        const data = entry.data.current;

        return data?.type === "Column" || data?.type === "Element";
    };

    // Helper function to flatten nested columns
    const flattenColumns = useCallback((cols: NestedColumn[]): Column[] => {
        return cols.flatMap((col) =>
            col.children ? [{id: col.id, title: col.title, icon: col.icon}, ...flattenColumns(col.children)] : [col]
        );
    }, []);

    const flatColumns = useMemo(() => flattenColumns(columns), [columns, flattenColumns]);
    const columnsId = useMemo(() => flatColumns.map((col) => col.id), [flatColumns]);

    // recursively render nested columns
    const renderNestedColumns = (cols: NestedColumn[]) => {
        return cols.map((col) => {
            const elementsInColumn = elements.filter((element) => element.columnId === col.id);

            if (col.children && col.children.length > 0) {
                // If the column has children, only render it if it has elements directly assigned
                return (
                    <div key={col.id} className="flex flex-col">
                        {elementsInColumn.length > 0 && <BoardColumn column={col} elements={elementsInColumn}/>}
                        <div className={elementsInColumn.length > 0 ? "ml-4 mt-2" : ""}>
                            {renderNestedColumns(col.children)}
                        </div>
                    </div>
                );
            } else {
                // If it's a leaf node, always render it
                return <BoardColumn key={col.id} column={col} elements={elementsInColumn}/>;
            }
        });
    };

    const onDragStart = (event: DragStartEvent) => {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Column") {
            setActiveColumn(data.column);
            return;
        }

        if (data?.type === "Element") {
            setActiveElement(data.element);
            return;
        }
    };

    const onDragEnd = async (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveElement(null);

        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (!hasDraggableData(active)) return;

        const activeData = active.data.current;

        if (activeId === overId) return;

        //column drag currently not supported/needed
        /*if (activeData?.type === "Column") {
            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
                const overColumnIndex = columns.findIndex((col) => col.id === overId);
                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            });
        } else */
        if (activeData?.type === "Element") {
            // Handle element movement
            const newColumnId = hasDraggableData(over)
                ? over.data.current?.type === "Column"
                    ? (over.id as ColumnId)
                    : (over.data.current as ElementDragData).element.columnId
                : (over.id as ColumnId);

            const oldColumnId = activeData.element.columnId;

            if (oldColumnId !== newColumnId) {
                // Update the element's columnId in the local state
                setElements((elements) => {
                    return elements.map((element) =>
                        element.id === activeId ? {...element, columnId: newColumnId} : element
                    );
                });
            }
        }
    };

    const onDragOver = (event: DragOverEvent) => {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveAElement = activeData?.type === "Element";
        const isOverAElement = overData?.type === "Element";

        if (!isActiveAElement) return;

        // I'm dropping an Element over another Element
        if (isActiveAElement && isOverAElement) {
            startTransition(() => {
                setElements((elements) => {
                    const activeIndex = elements.findIndex((t) => t.id === activeId);
                    const overIndex = elements.findIndex((t) => t.id === overId);
                    const activeElement = elements[activeIndex];
                    const overElement = elements[overIndex];
                    if (activeElement && overElement && activeElement.columnId !== overElement.columnId) {
                        activeElement.columnId = overElement.columnId;
                        return arrayMove(elements, activeIndex, overIndex - 1);
                    }

                    return arrayMove(elements, activeIndex, overIndex);
                });
            });

        }

        const isOverAColumn = overData?.type === "Column";

        // I'm dropping an Element over a column
        if (isActiveAElement && isOverAColumn) {

            startTransition(() => {
                setElements((elements) => {
                    const activeIndex = elements.findIndex((t) => t.id === activeId);
                    const activeElement = elements[activeIndex];
                    if (activeElement) {
                        activeElement.columnId = overId as ColumnId;
                        return arrayMove(elements, activeIndex, activeIndex);
                    }
                    return elements;
                });
            });

        }
    };

    return (
        <DndContext
            id={dndContextId}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}>
            <BoardContainer>
                <SortableContext items={columnsId}>
                    {renderNestedColumns(columns)}
                </SortableContext>
            </BoardContainer>

            {typeof window !== "undefined" &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                column={activeColumn}
                                elements={elements.filter(
                                    (element) => element.columnId === activeColumn.id
                                )}
                            />
                        )}
                        {activeElement && <BoardCard element={activeElement} isOverlay/>}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
