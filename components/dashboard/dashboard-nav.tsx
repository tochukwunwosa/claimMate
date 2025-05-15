"use client"

import {useRouter} from 'next/navigation'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle, FileBox, Users, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {useUser} from '@/contexts/UserContext'
import {createClient} from '@/lib/supabase/client'

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Claims",
    // href: "/dashboard/claims",
    href: '#',
    icon: FileText,
  },
  {
    title: "New Claim",
    // href: "/dashboard/claims/new",
    href: '#',
    icon: PlusCircle,
  },
  {
    title: "Templates",
    // href: "/dashboard/templates",
    href: '#',
    icon: FileBox,
  },
  {
    title: "Team",
    // href: "/dashboard/team",
    href: '#',
    icon: Users,
  },
]

// Update the SidebarHeader to ensure logo and text are properly aligned and styled
// This will ensure the logo is centered when collapsed
export function DashboardNav() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { userName } = useUser()
  const router = useRouter()
  const supabase = createClient()
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <>
      <SidebarHeader className="border-b border-border/40">
        <Link href="/" className={cn("h-12 flex items-center gap-2", isCollapsed ? "justify-center px-0" : "px-2")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A3161] flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!isCollapsed && <span className="text-xl font-bold">ClaimMate</span>}
        </Link>
      </SidebarHeader>

      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href + item.title}>
            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title} className={`${pathname === item.href ? 'text-accent font-medium' : 'text-primary'} hover:text-accent`}
            >
              <Link href={item.href} className={cn(isCollapsed && "justify-center")}>
                <item.icon className="h-5 w-5" />
                <span >{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="mt-auto border-t border-border/40">
        <div className={cn("py-2", isCollapsed ? "px-0" : "px-3")}>
          <div className={cn("flex items-center gap-3 py-2", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 flex-shrink-0">
              <User className="h-5 w-5 text-slate-600" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName || 'User'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="h-auto justify-start px-0 py-0 text-sm font-normal text-muted-foreground"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </>
  )
}
