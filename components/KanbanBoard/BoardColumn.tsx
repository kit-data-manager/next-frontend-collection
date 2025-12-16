import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {type UniqueIdentifier, useDndContext} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import React, {useMemo} from "react";
import {BoardCard, Element} from "./BoardCard";
import {cva} from "class-variance-authority";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Badge} from "../ui/badge";
import {Icon} from "@iconify-icon/react";

export interface Column {
  id: UniqueIdentifier;
  title: string;
  icon: string;
}

export type ColumnType = "Column";

export type ColumnDragData = {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  elements: Element[];
  isOverlay?: boolean;
}

export const BoardColumn = ({ column, elements, isOverlay }: BoardColumnProps) => {
  const tasksIds = useMemo(() => {
    return elements.map((task) => task.id);
  }, [elements]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    "max-h-[500px] w-full bg-primary shrink-0 snap-center mt-4 overflow-y-auto",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary"
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}>
      <CardHeader className="p-4 font-semibold text-sm border-b-2 bg-gray-100 dark:bg-secondary flex flex-row items-center justify-between">
        <Icon icon={column.icon}
              className="h-6 w-6 mr-2"
              width={"24"}
              height={"24"}/>
        <h1>{column.title}</h1>
        <Badge variant="outline">{elements.length}</Badge>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {elements.length === 0 ? (
              <div className="flex grow items-center justify-center">
                <p className="text-gray-400">No elements here.</p>
              </div>
            ) : (
                elements.map((task) => (!task.hidden ? <BoardCard key={task.id} element={task} /> : undefined))
            )}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  const dndContext = useDndContext();

  const variations = cva("px-2 min-h-[400px] lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });
//Scrollbars behaved messy, so let's remove them for now
  return (
    <ScrollArea className={variations({ dragging: dndContext.active ? "active" : "default" })}>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
