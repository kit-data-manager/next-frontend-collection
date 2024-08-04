'use client';

import {
  HomeIcon,
    PlusCircleIcon,
    ListBulletIcon,
    ChartPieIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Overview', href: '/base-repo', icon: ChartPieIcon},
  { name: 'Search', href: '/base-repo/resources/search', icon: PlusCircleIcon },
  { name: 'Resources', href: '/base-repo/resources', icon: ListBulletIcon },
  { name: 'Create Resource', href: '/base-repo/resources/create', icon: PlusCircleIcon },

];

export default function NavLinksDataResources() {
  const pathname = usePathname();
  const searchEnabled= process.env.SEARCH_BASE_URL != undefined;

  return (
    <>
      {links.map((link) => {
        if(link.name === "Search" && !searchEnabled){
          return null;
        }

        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={(link.name === "Search" && !searchEnabled) ? {} : link.href}
            className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm  hover:underline font-medium md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'underline': pathname === link.href,
                },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
        })}
    </>
  );
}
