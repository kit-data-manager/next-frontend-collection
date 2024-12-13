import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {cva} from "class-variance-authority";
import {fetchMappingJobStatus} from "@/lib/mapping/client_data";

interface MappingCardProps {
    reloadCallback: Function;
}

export function NewJobCard({}: MappingCardProps) {

    const variants = cva("w-full h-full", {
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
            <CardContent className="flex justify-content-center align-middle whitespace-pre-wrap">
                <Button
                    variant="ghost"
                    className="w-full h-full self-center">
                    <Icon icon={"line-md:plus-circle-filled"}
                          className="h-24 w-24 align-middle justify-center"/>
                </Button>
            </CardContent>
        </Card>
    );

}
