"use client";
import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LucideCoins, SunIcon, MoonIcon } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import * as A from "../ui/avatar";
import * as DM from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const Header = () => {
  const pathName = usePathname();
  const { user } = useContext(AuthContext);
  const { setTheme, theme } = useTheme();

  const ignorePages = ["/", "/user/auth", "/user/register"];

  if (ignorePages.includes(pathName)) {
    return <></>;
  }
  if(!user){
    return (
      <header className=" bg-stone-950 text-neutral-100 flex justify-between items-center p-4 pl-8">
        <Skeleton className=" size-9 " />
        <Skeleton className=" ml-20 w-[350px] h-[36px] " />
        <Skeleton className=" w-[80px] h-[36px] " />
      </header>
    )
  }
  return (
    <header className=" bg-stone-950 text-neutral-100 flex justify-between items-center p-4 pl-8">
      <Link href={`/user/${user.username}`}>
        <LucideCoins className=" size-9 text-yellow-300 " />
      </Link>
      <nav className=" ml-20 flex space-x-6">
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Projetos
        </Link>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Usuários
        </Link>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Sobre nós
        </Link>
      </nav>
      <DM.DropdownMenu>
        <DM.DropdownMenuTrigger asChild>
          <section className=" hover:cursor-pointer flex items-center space-x-4 ">
            <div>
              <h4 className=" text-[8px] ">Username:</h4>
              <h3 className=" text-[12px] font-bold ">
                {user ? user.username : ""}
              </h3>
            </div>
            <A.Avatar>
              <A.AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user?.username}.jpeg`}
              />
              <A.AvatarFallback>S/N</A.AvatarFallback>
            </A.Avatar>
          </section>
        </DM.DropdownMenuTrigger>
        <DM.DropdownMenuContent className=" dark:bg-stone-900 " align="end">
          <DM.DropdownMenuItem>
            {theme == "light" ? (
              <Button
                className="font-bold"
                variant="outline"
                onClick={() => {
                  setTheme("dark");
                }}
              >
                <SunIcon />
                <span>Light mode</span>
              </Button>
            ) : (
              <Button
                className="font-bold"
                variant="outline"
                onClick={() => {
                  setTheme("light");
                }}
              >
                <MoonIcon /> <span>Dark mode</span>
              </Button>
            )}
          </DM.DropdownMenuItem>
          <DM.DropdownMenuItem>
            <Button className=" font-bold w-full " variant="outline">
              Log out
            </Button>
          </DM.DropdownMenuItem>
        </DM.DropdownMenuContent>
      </DM.DropdownMenu>
    </header>
  );
};

export default Header;
