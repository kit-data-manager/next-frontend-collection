import type {UniqueIdentifier} from "@dnd-kit/core";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cva} from "class-variance-authority";
import {ColumnId} from "./KanbanBoard";
import {Icon} from "@iconify-icon/react";
import React from "react";

export type Element = {
    id: UniqueIdentifier;
    columnId: ColumnId;
    content: string;
    icon: string;
    hidden: boolean;
    anonymous: boolean;
    self: boolean;
}

type BoardCardProps = {
    element: Element;
    isOverlay?: boolean;
}

export type ElementType = "Element";

export type ElementDragData = {
    type: ElementType;
    element: Element;
}

export function BoardCard({element, isOverlay}: BoardCardProps) {
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: element.id,
        data: {
            type: "Element",
            element,
        } satisfies ElementDragData,
        attributes: {
            roleDescription: "Element",
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary",
            },
            special: {
                anonymous: "border-2 border-sky-500",
                self: "border-2 border-red-400"
            }
        },
    });

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                special: element.anonymous ? "anonymous" : element.self ? "self" : undefined,
            })}>
            <CardContent className="p-4 flex items-center align-middle text-left whitespace-pre-wrap">
                <Button
                    variant="ghost"
                    {...attributes}
                    {...listeners}
                    className="p-1 -ml-2 h-auto cursor-grab">
                    <span className="sr-only">Move Element</span>
                    <Icon icon={element.icon}
                          className="h-6 w-6 mr-2"
                          width={"24"}
                          height={"24"}/>
                </Button>
                {element.content}
            </CardContent>
        </Card>
    );
}
