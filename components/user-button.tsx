'use client'

import { signOut, useSession } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
export default function UserButton() {

  const session = useSession()
  if (session.status == "unauthenticated") {
    return (
      <Link
        href='/login'
        className={buttonVariants({ variant: "ghost" })}
      >
        <LogIn />
      </Link>

    )
  }


  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut()}
    >
      <LogOut />
    </Button>
  )
}