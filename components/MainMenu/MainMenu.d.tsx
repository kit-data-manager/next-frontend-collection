export interface SubMenu  {
    serviceName:string;
    icon? : string;
    href?:string;
    menuItems?: MenuItem[];
}
export interface MenuItem  {
    name: string;
    href: string;
    icon: string;
    description: string;
    requiresSession?:boolean;
    requiresSearch?:boolean;
}
