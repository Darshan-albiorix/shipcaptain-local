'use client';
import { IdCardIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@repo/ui/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
  { title: 'Roles & Permissions', url: '/roles', icon: IdCardIcon },
  { title: 'Admins', url: '/admins', icon: UsersIcon },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-[#E7E2D9]">
        <SidebarGroup>
          <SidebarGroupLabel className='my-2'>
            <Image
              src="/logo-black.png"
              alt="Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-xl font-bold">Admin Panel</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {links.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={isActive ? 'bg-primary text-primary-foreground' : ''}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}


