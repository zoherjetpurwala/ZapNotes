import { LightningBoltIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./ui/loading-spinner";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { LogInIcon, LogOutIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="active:scale-90 transition-all duration-300">
          <div className="flex items-center">
            <LightningBoltIcon className="w-6 h-6 text-yellow-400" />
            <span className="ml-1 text-2xl sm:text-3xl font-bold text-white">
              Zap<span className="text-yellow-400">Notes</span>
            </span>
          </div>
        </Link>

        <div className="flex gap-4">
          {session ? (
            <DropdownMenu asChild>
              <DropdownMenuTrigger>
                <div className="flex">
                  <Image
                    src={session.user.image}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOutIcon className="mr-1 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signIn("google")}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 active:scale-90 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-full shadow-lg"
              aria-label="Sign in with Google"
            >
              <LogInIcon className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
