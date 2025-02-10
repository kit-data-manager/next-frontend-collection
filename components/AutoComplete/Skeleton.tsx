import {cn} from "@/lib/general/utils";

function Skeleton({
                      className,
                      ...props
                  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            data-testid="skeleton"
            {...props}
        />
    );
}

export { Skeleton };
