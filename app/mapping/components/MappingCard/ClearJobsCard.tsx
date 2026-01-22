import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify-icon/react";
import React from "react";
import {cva} from "class-variance-authority";

interface ClearJobsCardProps {
    removeJobsCallback: Function;
}

export function ClearJobsCard({removeJobsCallback}: ClearJobsCardProps) {

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

    return (
        <Card className={variants({
            dragging: undefined,
        })}>
            <CardContent className="flex place-content-center h-full whitespace-pre-wrap">
                <Button
                    variant="ghost"
                    onClick={() => removeJobsCallback()}
                    title="Remove all Mapping Jobs"
                    className="w-full h-full self-center ">
                    <Icon icon={"solar:eraser-linear"} width={"96"} height={"96"}
                          className="h-24 w-24 align-middle justify-center"/>
                </Button>
            </CardContent>
        </Card>
    );

}
