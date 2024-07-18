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
  { name: 'Create Resource', href: '/base-repo/resource/create', icon: PlusCircleIcon },

];

export default function NavLinksDataResources() {
  const pathname = usePathname();
  const searchEnabled= process.env.SEARCH_BASE_URL != undefined;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if(link.name === "Search" && !searchEnabled){
          return (
              <span
                  key={link.name}
                  className={clsx(
                      'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm text-gray-400 font-medium md:flex-none md:justify-start md:p-2 md:px-3',
                      {
                        'bg-sky-100 text-blue-600': pathname === link.href,
                      },
                  )}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </span>
          );
        }


        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
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
