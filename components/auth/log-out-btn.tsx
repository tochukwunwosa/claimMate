"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils'

export default function LogOutBtn({
  text,
  icon = false,
}: {
  text: string;
  icon?: boolean;
}) {
  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={cn("w-full cursor-pointer flex gap-2 items-center text-destructive  py-2")}>
          {icon ? <LogOut className="size-4" /> : null}
          <div className="flex flex-col">
            <span className=" text-sm font-normal px-0 py-0">
              {text}
            </span>
          </div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will end your session. You’ll need to log in again to continue using your account.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut} className='hover:bg-destructive/80 bg-destructive'>Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
