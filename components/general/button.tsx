import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={clsx(
                'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ' +
                'hover:underline bg-accent text-accent-foreground ' +
                'aria-disabled:opacity-50',
                className,
            )}
        >
            {children}
        </button>
    );
}
