"use client";
import React, { useContext, useState } from "react";
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
import * as AD from "../ui/alert-dialog";

const Header = () => {
  const pathName = usePathname();
  const { user } = useContext(AuthContext);
  const { setTheme, theme } = useTheme();

  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);

  const ignorePages = ["/", "/user/auth", "/user/register"];

  if (ignorePages.includes(pathName)) {
    return <></>;
  }
  if (!user) {
    return (
      <header className=" bg-stone-950 text-neutral-100 flex justify-between items-center p-4 pl-8">
        <Skeleton className=" size-9 " />
        <Skeleton className=" ml-20 w-[350px] h-[36px] " />
        <Skeleton className=" w-[80px] h-[36px] " />
      </header>
    );
  }
  //handleOpenChange soluciona o bug do dropdownMenu deixar pagina congelada
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      //remove the style="pointer-events: none;" from the body
      document.body.style.pointerEvents = "auto";
    }
  };

  async function logoutAccount() {
    const authToken = sessionStorage.getItem("authToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout/${user?.username}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        sessionStorage.removeItem('authToken')
        return window.location.href = '/'
      })
      .catch((err) => {
        return console.log(err); 
      });
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
      <DM.DropdownMenu onOpenChange={handleOpenChange}>
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
            <Button
              onClick={() => {
                setIsLogoutOpen(!isLogoutOpen);
              }}
              className=" font-bold w-full "
              variant="outline"
            >
              Log out
            </Button>
          </DM.DropdownMenuItem>
        </DM.DropdownMenuContent>
      </DM.DropdownMenu>
      <AD.AlertDialog open={isLogoutOpen}>
        <AD.AlertDialogTrigger asChild></AD.AlertDialogTrigger>
        <AD.AlertDialogContent>
          <AD.AlertDialogHeader>
            <AD.AlertDialogTitle>Fazer logout</AD.AlertDialogTitle>
            <AD.AlertDialogDescription>
              Você saira da sua sessão atual se continuar.
            </AD.AlertDialogDescription>
          </AD.AlertDialogHeader>
          <AD.AlertDialogFooter>
            <AD.AlertDialogCancel onClick={() => setIsLogoutOpen(false)}>
              Cancel
            </AD.AlertDialogCancel>
            <AD.AlertDialogAction onClick={logoutAccount}>Log out</AD.AlertDialogAction>
          </AD.AlertDialogFooter>
        </AD.AlertDialogContent>
      </AD.AlertDialog>
    </header>
  );
};

export default Header;
