"use client";
import { ProjectProps } from "@/components/local/UserPage/UserProjects";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import * as f from "@/components/ui/form";
import * as s from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import React, { useContext, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ServiceWindow from "@/components/local/ProjectPage/ServiceWindow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

const editProjectSchema = z.object({
  title: z.string().min(0, "Informe o titulo do projeto.").optional(),
  content: z.string().min(0, "Informe a descrição do projeto").optional(),
  category: z
    .string({ required_error: "Selecione uma categoria, por favor." })
    .optional(),
  budget: z.coerce
    .number()
    .min(0, "Informe o orçamento do projeto.")
    .optional(),
});

type editProjectProps = z.infer<typeof editProjectSchema>;

const ContentProjectPage = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState<ProjectProps | undefined>(undefined);
  const [categoryColor, setCategoryColor] = useState<string>("");
  const { user } = useContext(AuthContext);

  const form = useForm<editProjectProps>({
    resolver: zodResolver(editProjectSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      category: "",
      budget: 0,
      content: "",
    },
  });

  async function getProjectData() {
    const authToken = sessionStorage.getItem("authToken");

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/get_project_by_id/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return setProject(data.projectRequired);
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  async function onEditSubmit(data: editProjectProps) {
    const dataJson = {
      title: data.title == "" ? undefined : data.title,
      category: data.category == "" ? undefined : data.category,
      budget: data.budget == 0 ? undefined : data.budget,
      content: data.content == "" ? undefined : data.content,
    };
    const authToken = sessionStorage.getItem("authToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/edit/${projectId}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        toast({
          title: "Projeto atualizado.",
          description: "Seu projeto foi atualizado com êxito.",
        });
        return window.location.reload();
      })
      .catch((err) => {
        return console.log(err);
      });
  }
  async function deleteProject() {
    const authToken = sessionStorage.getItem("authToken");
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/delete/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((res) => {
        if (res.status == 200) {
          return console.log("Ao menos o status é 200");
        }
      })
      .then((data) => {
        toast({
          title: "Projeto deletado.",
          description: "Seu projeto foi deletado com sucesso.",
        });
        return (window.location.href = `/user/${user?.username}`);
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  useEffect(() => {
    getProjectData();
  }, []);

  if (!project) {
    return (
      <main className="max-h-screen p-8 pb-20  max-w-full">
        <Skeleton className="  h-full w-full" />
      </main>
    );
  }

  return (
    <main className="flex max-h-screen p-8 pb-20  max-w-full font-[family-name:var(--font-geist-sans)]">
      <section className=" bg-stone-100 dark:bg-stone-950 rounded-md h-full p-4 w-full">
        <section className=" dark:bg-stone-950 flex h-full  p-4 justify-between w-full">
          <h1 className=" text-yellow-500 dark:text-yellow-300 text-3xl font-semibold ">
            Projeto: {project.title}
          </h1>
          <div className=" flex items-center space-x-5 ">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Editar projeto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edição do projeto</DialogTitle>
                  <DialogDescription>
                    Digite as informações correspondentes a nova versão do
                    projeto.
                  </DialogDescription>
                </DialogHeader>
                <f.Form {...form}>
                  <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onEditSubmit)}
                  >
                    <f.FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <f.FormItem>
                          <f.FormLabel>Titulo do projeto</f.FormLabel>
                          <f.FormControl>
                            <Input
                              type="text"
                              placeholder="Informe o titulo do projeto aqui"
                              {...field}
                            />
                          </f.FormControl>
                          <f.FormMessage />
                        </f.FormItem>
                      )}
                    />
                    <f.FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <f.FormItem>
                          <f.FormLabel>Categoria</f.FormLabel>
                          <s.Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <f.FormControl>
                              <s.SelectTrigger>
                                <s.SelectValue placeholder="Selecione uma categoria" />
                              </s.SelectTrigger>
                            </f.FormControl>
                            <s.SelectContent>
                              <s.SelectItem value="Desenvolvimento">
                                Desenvolvimento
                              </s.SelectItem>
                              <s.SelectItem value="Infraestrutura">
                                Infraestrutura
                              </s.SelectItem>
                              <s.SelectItem value="Designe">
                                Designe
                              </s.SelectItem>
                              <s.SelectItem value="Planejamento">
                                Planejamento
                              </s.SelectItem>
                            </s.SelectContent>
                          </s.Select>
                        </f.FormItem>
                      )}
                    />
                    <f.FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <f.FormItem>
                          <f.FormLabel>Orçamento</f.FormLabel>
                          <f.FormControl>
                            <Input
                              type="number"
                              placeholder="Qual será o orçamento?"
                              {...field}
                            />
                          </f.FormControl>
                          <f.FormMessage />
                        </f.FormItem>
                      )}
                    />
                    <f.FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <f.FormItem>
                          <f.FormLabel>Descrição</f.FormLabel>
                          <f.FormControl>
                            <Textarea

                              placeholder="Descreva o objetivo do projeto."
                              {...field}
                            />
                          </f.FormControl>
                          <f.FormMessage />
                        </f.FormItem>
                      )}
                    />
                    <Button type="submit">Editar</Button>
                  </form>
                </f.Form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ao fazer isso você não poderá mais acessar os dados desse
                    projeto nem recupera-los.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteProject}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Deletar <Trash />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
        <hr />
        <section className="flex space-x-4 p-4">
          <section className=" flex flex-col space-y-4 w-1/3 justify-between p-4 ">
            <span
              className={`${buttonVariants({
                variant: "secondary",
              })} cursor-default dark:hover:bg-stone-800 shadow-md shadow-stone-500 dark:shadow-none`}
            >
              Categoria: <span className={``}>{project.category}</span>
            </span>
            <span
              className={`${buttonVariants({
                variant: "secondary",
              })} cursor-default dark:hover:bg-stone-800 shadow-md shadow-stone-500 dark:shadow-none`}
            >
              Orçamento:{" "}
              <span className="text-yellow-400">
                {project.budget.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
            <span
              className={`${buttonVariants({
                variant: "secondary",
              })} cursor-default dark:hover:bg-stone-800 shadow-md shadow-stone-500 dark:shadow-none`}
            >
              Total usado:{" "}
              <span className="text-yellow-400">R${project.budget_used}</span>
            </span>
            <div className=" bg-stone-100 dark:bg-stone-800 flex flex-col rounded-md p-4 shadow-md shadow-stone-500 dark:shadow-none ">
              <Label className="mb-1  ">Descrição</Label>
              <span className=" ml-2 text-stone-900 dark:text-stone-300 text-[14px]">
                {project.content}
              </span>
            </div>
          </section>
          <ServiceWindow className=" h-[340px] w-2/3 full rounded-md border" />
        </section>
      </section>
    </main>
  );
};

export default ContentProjectPage;
