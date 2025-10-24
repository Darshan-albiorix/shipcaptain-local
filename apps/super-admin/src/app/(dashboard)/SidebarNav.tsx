'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/roles', label: 'Roles & Permissions' },
  // { href: '/dashboard/settings', label: 'Settings' },
];

export default function SidebarNav({ setIsSidebarOpen }: { setIsSidebarOpen: (isSidebarOpen: boolean) => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1.5">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsSidebarOpen(false)}
            className={
              `px-3 py-2 rounded-md transition ` +
              (isActive
                ? 'bg-[#E7E2D9] text-black font-bold shadow-sm'
                : 'text-black/80 hover:bg-white/50')
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}


