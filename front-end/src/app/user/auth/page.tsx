'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React from 'react'
import { Button } from '@/components/ui/button'
import * as f from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

const authFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Informe um nome de usuário." }),
  pass: z.string().min(1, { message: "Informe sua senha." }),
});
type authFormType = z.infer<typeof authFormSchema>

const authPage = () => {

    const {user} = useContext(AuthContext)

    if(user){
      return window.location.href = `/user/${user.username}`
    }

    const { toast } = useToast()
    const form = useForm<authFormType>({
      resolver: zodResolver(authFormSchema),
      mode: 'onBlur',
      defaultValues: {
        username: "",
        pass: ""
      }
    })  
    
    
    async function onSubmit(data: authFormType){
      const nameProfile = data.username
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(res => {
        return res.json()
      }).then(data => {
        toast({
          title: "Login efetuado",
          description: `Bem vindo novamente ${nameProfile}!`
        })
        sessionStorage.setItem('authToken', data.authToken)
        setTimeout(()=> {},3000)
        return window.location.href = `/user/${nameProfile}`
      }).catch(err=> {
        return console.log(err)
      })
    }
    
  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20   font-[family-name:var(--font-geist-sans)]">
      <Image src="/costs_logo.png" width={50} height={50} alt='logo.png' className='mt-20' />
      <h2 className='mb-10 text-2xl '>Fazer login no Next Costs</h2>
      <f.Form {...form} >
        <form className=' flex flex-col items-center border border-stone-400 dark:border-stone-700 p-5 rounded-lg space-y-2 '
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <f.FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <f.FormItem>
                <f.FormLabel>Nome de usuário</f.FormLabel>
                <f.FormControl>
                  <Input placeholder="Digite seu nome de usuário" {...field} />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
          <f.FormField
            control={form.control}
            name="pass"
            render={({ field }) => (
              <f.FormItem className='mt-2 mb-2'>
                <f.FormLabel>Senha</f.FormLabel>
                <f.FormControl>
                  <Input
                    type="password"
                    placeholder="Digite a sua senha"
                    {...field}
                  />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
          <Link href="#sem_rota" className=' text-stone-300 text-[12px] hover:text-yellow-300 transition-all '>Esqueceu a senha? Clique aqui.</Link>
          <Button type="submit" className='w-full'>Entrar</Button>
        </form>
      </f.Form>
      <Link href="/user/register" className=' text-stone-300 text-[12px] hover:text-yellow-300 transition-all'>Não tem uma conta? Clique aqui.</Link>
    </main>
  );
}

export default authPage