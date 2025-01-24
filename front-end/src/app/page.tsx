'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {

  const {user} = useContext(AuthContext)
  if(user){
    return window.location.href = "/user/" + user.username
  }
  return (
    <main className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 w-screen font-[family-name:var(--font-geist-sans)]">
      <div className=" flex flex-col items-center justify-start ">
        <section className=" flex items-center ">
          <h1 className=" text-5xl">
            Bem vindo ao{" "}
            <span className=" text-yellow-400 font-bold mr-2">Next Costs</span>
          </h1>
          <Image src="/costs_logo.png" height={70} width={70} alt="coin.png" />
        </section>
  
        <span className=" text-gray-300 ">
          Comece a gerenciar seus projetos agora mesmo!
        </span>
        <section className="space-x-5 m-7">
          <Link
            href="/user/auth"
            className={buttonVariants({ variant: "default" })}
          >
            Fazer login
          </Link>
          <Link
            href="/user/register"
            className={buttonVariants({ variant: "default" })}
          >
            Criar conta
          </Link>
        </section>
      </div>
      <Image
        className=" bg-slate-50 p-10 rounded-xl"
        src="/savings.svg"
        height={500}
        width={500}
        alt="savings.png"
      />
    </main>
  );
}
