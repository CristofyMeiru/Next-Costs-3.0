"use client";
import React, { useContext } from "react";
import * as f from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(4, "Nome precisa ter ao menos 4 letras")
    .max(30, "Nome precisa ter menos de 30 letras"),
  email: z.string().min(1, "Insira um email válido"),
  pass: z.string().min(6, "Senha precisa ter pelo menos 6 letras."),
  confirm_pass: z.string(),
});
type registerFormType = z.infer<typeof registerFormSchema>;

const RegisterUser = () => {

  
  const form = useForm<registerFormType>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      pass: "",
      confirm_pass: "",
    },
  });

  async function onSubmit(data: registerFormType) {
    await fetch(`http://localhost:3333/user/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("sucesso");
      })
      .catch((err) => {});
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 pb-18 w-screen font-[family-name:var(--font-geist-sans)]">
      <h2 className=" text-2xl font-semibold ">Criar conta no Next Costs</h2>
      <span className=" text-[12px] text-stone-300 ">Para começar com os projetos, vamos criar sua conta!</span>
      <f.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center w-2/6 mt-10 border border-stone-400 dark:border-stone-700 p-5 rounded-lg space-y-2 "
        >
          <f.FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <f.FormItem className="w-full">
                <f.FormLabel>Nome de usuário</f.FormLabel>
                <f.FormControl>
                  <Input placeholder="Informe seu nome de usuário" {...field} />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
          <f.FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <f.FormItem className="w-full">
                <f.FormLabel>Email</f.FormLabel>
                <f.FormControl>
                  <Input placeholder="Informe seu email" {...field} />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
          <f.FormField
            control={form.control}
            name="pass"
            render={({ field }) => (
              <f.FormItem className="w-full">
                <f.FormLabel>Senha</f.FormLabel>
                <f.FormControl>
                  <Input
                    type="password"
                    placeholder="Crie uma senha"
                    {...field}
                  />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
          <f.FormField
            control={form.control}
            name="confirm_pass"
            render={({ field }) => (
              <f.FormItem className="w-full">
                <f.FormLabel>Confirme a senha</f.FormLabel>
                <f.FormControl>
                  <Input
                    type="password"
                    placeholder="Digite novamente a senha"
                    {...field}
                  />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}     
          />
          <Button type="submit" className="w-full">Criar conta</Button>
        </form>
      </f.Form>
      <Link href="/user/auth" className=" text-[12px] text-stone-300 hover:text-yellow-400 transition-all ">Já tem uma conta? Clique aqui.</Link>
    </main>
  );
};

export default RegisterUser;
