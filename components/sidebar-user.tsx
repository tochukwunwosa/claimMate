"use client"

import {
  BellIcon,
  CreditCardIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  UserRound
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {useUser} from '@/contexts/UserContext'
import LogOutBtn from "@/components/auth/log-out-btn"
import { cn } from "@/lib/utils"

export default function SidebarUser({
  isCollapsed}: {
    isCollapsed: boolean}) {
  const {profile, userName} = useUser()
  const { isMobile } = useSidebar()

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={'Profile'}
              size="lg"
              className={cn(
                "cursor-pointer group transition-colors w-full ",
                "data-[state=open]:bg-muted/60 data-[state=open]:text-foreground",
                "hover:text-secondary focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isCollapsed && "justify-center"
              )}
            >
              <div className={cn(
                "flex items-center gap-3 w-full",
              )}>
                <Avatar className="size-5 rounded-lg grayscale shrink-0 px-0">
                  <AvatarImage src={profile?.avatar} alt={userName} />
                  <AvatarFallback className="rounded-full">

                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userName}</span>
                    <span className="truncate w-[50px] text-xs text-muted-foreground">
                      {profile?.email}
                    </span>
                  </div>
                )}
                {!isCollapsed && <MoreVerticalIcon className="ml-auto size-4" />}
              </div>
            </SidebarMenuButton>

          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile?.avatar} alt={userName} />
                  <AvatarFallback className="rounded-full">
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {profile?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:!bg-transparent transition-colors">
              <div onClick={(e) => e.stopPropagation()}>
                <LogOutBtn text="Log out" icon={true} />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
