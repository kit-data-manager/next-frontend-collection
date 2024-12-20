export interface SubMenu  {
    serviceName:string;
    menuItems: MenuItem[];
}
export interface MenuItem  {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string
    } & React.RefAttributes<SVGSVGElement>>;
    description: string;
    requiresSession?:boolean;
    requiresSearch?:boolean;
}
