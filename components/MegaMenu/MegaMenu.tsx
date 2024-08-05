'use client';

import { Button, MegaMenu, Navbar } from 'flowbite-react';
import {
    ChartPieIcon,
    ExclamationTriangleIcon, HomeIcon, ListBulletIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';
import AcmeLogo from "@/components/acme-logo";
import Link from "next/link";
import {usePathname} from "next/navigation";
import clsx from "clsx";

export default function MainMenu() {

    const linksDataRepo = [
        { name: 'Overview', href: '/base-repo', icon: ChartPieIcon},
        { name: 'Create Resource', href: '/base-repo/resources/create', icon: PlusCircleIcon },
        { name: 'Search', href: '/base-repo/resources/search', icon: PlusCircleIcon },
        { name: 'Resources', href: '/base-repo/resources', icon: ListBulletIcon },
    ];

    const linksMetadataRepo = [
        { name: 'Overview', href: '/metadata-repo', icon: ChartPieIcon},
        { name: 'Create Schema', href: '/metadata-repo/schema/create', icon: PlusCircleIcon },
        { name: 'Create Metadata', href: '/metadata-repo/metadata/create', icon: PlusCircleIcon },
        { name: 'Search', href: '/metadata-repo/metadata/search', icon: PlusCircleIcon },
        { name: 'Schemas', href: '/metadata-repo/schemas', icon: ListBulletIcon },
        { name: 'Metadata', href: '/metadata-repo/metadata', icon: ListBulletIcon },
    ];


    const pathname = usePathname();

    const searchEnabled= process.env.SEARCH_BASE_URL != undefined;

    return (
        <MegaMenu>
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4 md:space-x-8">
                <Navbar.Brand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
                </Navbar.Brand>
                <div className="order-2 hidden items-center md:flex">
                    <a
                        href="#"
                        className="mr-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:mr-2 md:px-5 md:py-2.5"
                    >
                        Login
                    </a>
                    <Button href="#">Sign up</Button>
                </div>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Navbar.Link href="#">Home</Navbar.Link>
                    <Navbar.Link>
                        <MegaMenu.Dropdown toggle={<>Repo</>}>
                            <ul className="grid grid-cols-3">
                        {linksDataRepo.map((link, cnt) => {
                            if(link.name === "Search" && !searchEnabled){
                                return null;
                            }
                            console.log((cnt+1)%3 == 0);

                            const LinkIcon = link.icon;
                            return (
                                <li key={cnt} className={"space-y-4 p-4"}>
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={clsx(
                                        'flex h-[48px] items-center justify-center gap-2 hover:underline font-medium m-2',
                                        {
                                            'underline': pathname === link.href,
                                        },
                                    )}
                                >
                                    <LinkIcon className="w-6" />
                                    <p className="md:block">{link.name}</p>
                                </Link>
                                </li>
                            );
                        })}
                            </ul>
                        </MegaMenu.Dropdown>
                    </Navbar.Link>

                    <Navbar.Link>
                        <MegaMenu.Dropdown toggle={<>MetaRepo</>}>
                            <ul className="grid grid-cols-3">
                                {linksMetadataRepo.map((link, cnt) => {
                                    if(link.name === "Search" && !searchEnabled){
                                        return null;
                                    }

                                    const LinkIcon = link.icon;
                                    return (
                                        <li key={cnt} className={"space-y-4 p-4"}>
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={clsx(
                                                    'flex h-[48px] items-center justify-center gap-2 hover:underline font-medium',
                                                    {
                                                        'underline': pathname === link.href,
                                                    },
                                                )}
                                            >
                                                <LinkIcon className="w-6" />
                                                <p className="md:block">{link.name}</p>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </MegaMenu.Dropdown>
                    </Navbar.Link>



                    <Navbar.Link href="#">Contact</Navbar.Link>
                </Navbar.Collapse>
            </div>
        </MegaMenu>
    );
}
