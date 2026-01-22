import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/general/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded border bg-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-primary-foreground",
                info: "bg-info text-primary-foreground rounded border-0 ml-1 mr-2",
                noborder: "text-primary-foreground border-0 underline px-1 py-0",
                nodeco: "text-primary-foreground border-0 px-1 py-1",
                thumb_unset: "bg-error rounded text-black border-0",
                thumb_set: "bg-success rounded text-black border-0",
                properties: "bg-accent rounded text-accent-foreground border-0",
                contextual: "bg-contextual text-contextual-foreground",
                contextual_disabled: "bg-secondary"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({
                   className,
                   variant,
                   asChild = false,
                   ...props
               }: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
