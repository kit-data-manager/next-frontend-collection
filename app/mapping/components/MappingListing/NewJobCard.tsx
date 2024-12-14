import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import React from "react";
import {cva} from "class-variance-authority";

interface MappingCardProps {
    addJobCallback: Function;
}

export function NewJobCard({addJobCallback}: MappingCardProps) {

    const variants = cva("w-full h-full pt-6", {
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
    const isOverlay = false;
    const isDragging = false;

    return (
        <Card
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                //: element.anonymous ? "anonymous" : element.self ? "self" : undefined,
            })}>
            <CardContent className="flex place-content-center h-full whitespace-pre-wrap">
                <Button
                    variant="ghost"
                    onClick={() => addJobCallback()}
                    title="Schedule new Mapping Job"
                    className="w-full h-full self-center">
                    <Icon icon={"line-md:plus-circle-filled"}
                          className="h-24 w-24 align-middle justify-center"/>
                </Button>
            </CardContent>
        </Card>
    );

}
