"use client"

import Link from "next/link"
import Image from 'next/image'
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle } from "lucide-react"
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Claims",
    href: "/dashboard/claims",
    icon: FileText,
  },
  {
    title: "New Claim",
    href: "/dashboard/claims/new",
    icon: PlusCircle,
  },
  // {
  //   title: "Templates",
  //   // href: "/dashboard/templates",
  //   href: '#',
  //   icon: FileBox,
  // },
  // {
  //   title: "Team",
  //   // href: "/dashboard/team",
  //   href: '#',
  //   icon: Users,
  // },
]

// Update the SidebarHeader to ensure logo and text are properly aligned and styled
// This will ensure the logo is centered when collapsed
export function DashboardNav() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"



  return (
    <>
      <SidebarHeader className="border-b border-border/40">
        <Link href="/dashboard" className={cn("h-12 flex items-center gap-2", isCollapsed ? "justify-center px-0" : "px-2")}>
          <div className="size-8 flex items-center">
            <Image src={'/logos/claimmate-logo-sm.png'} width={76} height={76} alt="ClaimMate logo" className='size-8' />
          </div>
          {!isCollapsed &&
            <div className="w-24 flex items-center">
              <Image src={'/logos/claimmate-logo-text.png'} width={250} height={44} alt="ClaimMate logo" className='w-full' />
            </div>
          }
        </Link>
      </SidebarHeader>

      <div className='pt-4'> 
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href + item.title}>
            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title} className={`${pathname === item.href ? 'text-accent font-medium' : 'text-primary'} hover:text-accent`}
            >
              <Link href={item.href} >
                <item.icon className="size-5" />
                <span >{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        </SidebarMenu>
      </div>

      
    </>
  )
}