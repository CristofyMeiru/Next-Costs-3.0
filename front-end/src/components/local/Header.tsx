'use client'
import React, { useContext } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LucideCoins } from 'lucide-react'
import { AuthContext } from '@/context/AuthContext'

const Header = () => {

  const pathName = usePathname()
  const {user} = useContext(AuthContext)

  const ignorePages = ['/', '/user/auth', '/user/register']
  
  if(ignorePages.includes(pathName)){
    return (
      <></>
    )
  }
  
  return (
    <header className=" bg-stone-950 text-neutral-100 flex justify-between items-center p-4 pl-8">
      <Link href="">
        <LucideCoins className=" size-9 text-yellow-300 " />
      </Link>
      <nav className=" ml-20 flex space-x-6">
        <Link href="#">Projetos</Link>
        <Link href="#">Usuários</Link>
        <Link href="#">Sobre nós</Link>
      </nav>
      <section className=" flex items-center space-x-4 ">
        <div>
          <h4 className=" text-[8px] ">Username:</h4>
          <h3 className=' text-[12px] '>{user ? user.username : ""}</h3>
        </div>
        <img
          src="https://github.com/cristofymeiru.png"
          alt="foto-perfil"
          className="size-9 rounded-full "
        />
      </section>
    </header>
  );
}

export default Header