import React from "react";
import ProjectCard from "./ProjectCard";
import { PlusCircle } from "lucide-react";
import { Button } from "../../ui/button";
import * as D from "../../ui/dialog";
import * as s from "../../ui/select";
import * as f from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Skeleton } from "../../ui/skeleton";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useToast } from "@/hooks/use-toast";

export type ProjectProps = {
  _id: string;
  title: string;
  category: string;
  budget: number;
  budget_used: number;
  content: string;
  created_at: Date;
  author: string;
};

const newProjectSchema = z.object({
  title: z.string().min(1, "Informe o titulo do projeto."),
  content: z.string().min(1, "Informe a descrição do projeto"),
  category: z.string({ required_error: "Selecione uma categoria, por favor." }),
  budget: z.coerce.number().min(0, "Informe o orçamento do projeto.")
});
type newProjectType = z.infer<typeof newProjectSchema>;

const UserProjects = ({
  allProjects,
  isAuthor,
}: {
  allProjects: Array<ProjectProps>;
  isAuthor?: boolean;
}) => {
  const form = useForm<newProjectType>({
    resolver: zodResolver(newProjectSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      budget: 0,
      content: "",
    },
  });
  const { toast } = useToast();

  async function onSubmit(data: newProjectType) {
    const authToken = sessionStorage.getItem("authToken");
    console.log(data)
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/create_project`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => {
        if (res.status == 401 || res.status == 400) {
          res.json().then(data => console.log(data))
          throw new Error("");
        }
        return toast({
          title: "Projeto adicionado.",
          description: "Seu projeto foi adicionado com exito.",
        });
      })
      .catch((err) => {
        console.log(err)
        return toast({
          title: "Algo deu errado.",
          description: "Tente novamente mais tarde.",
        });
      });
  }

  
  return (
    <div className="  text-stone-800 dark:text-white min-h-full  w-4/6 p-4 mx-10 space-y-4 ">
      <div className=" flex items-center justify-between w-full ">
        <h2 className="font-semibold">
          {isAuthor ? "Seus projetos" : "Projetos do usuário"}
        </h2>
        {isAuthor ? (
          <D.Dialog>
            <D.DialogTrigger asChild>
              <Button className=" font-semibold flex items-center space-x-4">
                Criar projeto <PlusCircle />
              </Button>
            </D.DialogTrigger>
            <D.DialogContent>
              <D.DialogHeader>
                <D.DialogTitle>Adicionar novo projeto</D.DialogTitle>
                <D.DialogDescription>
                  Informe os dados para adicionar um novo projeto.
                </D.DialogDescription>
              </D.DialogHeader>
              <f.Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <f.FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <f.FormItem>
                        <f.FormLabel>Titulo do projeto</f.FormLabel>
                        <f.FormControl>
                          <Input
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
                            <s.SelectItem value="Designe">Designe</s.SelectItem>
                            <s.SelectItem value="Planejamento">
                              Planejamento
                            </s.SelectItem>
                          </s.SelectContent>
                        </s.Select>
                      </f.FormItem>
                    )}
                  />
                  <f.FormField control={form.control} name="budget" render={({field})=> (
                    <f.FormItem>
                      <f.FormLabel>Orçamento</f.FormLabel>
                      <f.FormControl>
                        <Input type="number" placeholder="Qual será o orçamento?" {...field} />
                      </f.FormControl>
                      <f.FormMessage/>
                    </f.FormItem>
                  )} />
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
                  <Button type="submit">Criar</Button>
                </form>
              </f.Form>
            </D.DialogContent>
          </D.Dialog>
        ) : (
          <></>
        )}
      </div>
      {allProjects.map((project) => (
        <ProjectCard
          key={project._id}
          _id={project._id}
          title={project.title}
          budget={project.budget}
          budget_used={project.budget_used}
          content={project.content}
          category={project.category}
          author={project.author}
          created_at={project.created_at}
        />
      ))}
    </div>
  );
};

export default UserProjects;
