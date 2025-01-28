"use client";
import React, { useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Camera, CameraIcon } from "lucide-react";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import * as D from "../ui/dialog";
import * as F from "../ui/form";
import { Input } from "../ui/input";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";

const profileImageSchema = z.object({
  profile_image: z.instanceof(FileList).optional(),
});
type profileImageType = z.infer<typeof profileImageSchema>;

const UserCard = ({ name, isAuthor }: { name?: string; isAuthor?: boolean }) => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast()

  const form = useForm<profileImageType>({
    resolver: zodResolver(profileImageSchema),
    mode: "onBlur",
    defaultValues: {
      profile_image: undefined,
    },
  });
  const fileRef = form.register("profile_image");

  const [showCam, setShowCam] = useState<boolean>(false);

  async function onSubmit(data: profileImageType) {
    if (!data.profile_image) {
      return null;
    }
    const formData = new FormData();
    formData.append("profile_image", data.profile_image[0]);
    const authToken = sessionStorage.getItem("authToken");
    if (!user) {
      return 0;
    }
    
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/set_profile_image`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${authToken}`,
          username: user.username
        },
        body: formData,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        toast({
          title: "Foto de perfil alterada.",
          description: "Ao recarregar a pagina sua imagem será atualizada."
        });
        return console.log(data, JSON.stringify(data.body));
      });
  }

  if (!name) {
    return <Skeleton className=" w-1/6  p-4 py-32 rounded-md " />;
  }
  return (
    <section className="  text-stone-800 dark:text-white dark:bg-stone-950 border border-stone-200 shadow shadow-stone-200 dark:shadow-none flex flex-col items-center p-4 py-10 w-1/6 max-h-64 rounded-md space-y-4 ">
      <Avatar
        className=" size-32"
        onMouseEnter={() => {
          setShowCam(true);
        }}
        onMouseLeave={() => {
          setShowCam(false);
        }}
      >
        <AvatarImage
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${name}.jpeg`}
        />
        <AvatarFallback>S/N</AvatarFallback>
      </Avatar>
      { isAuthor ? (<D.Dialog>
        {showCam ? (
          <D.DialogTrigger asChild>
            <Button
              onMouseEnter={() => setShowCam(true)}
              onMouseLeave={() => {
                setShowCam(false);
              }}
              className=" flex justify-center items-center rounded-full p-4 w-[20px] h-[20px] bg-stone-400 text-black dark:bg-stone-600 dark:text-white absolute top-[230px] left-[80px] "
            >
              <Camera />
            </Button>
          </D.DialogTrigger>
        ) : (
          <></>
        )}
        <D.DialogContent>
          <D.DialogHeader>
            <D.DialogTitle>Mudar foto de perfil</D.DialogTitle>
            <D.DialogDescription>
              Mude sua foto de perfil para outra imagem .jpeg ou .png
            </D.DialogDescription>
          </D.DialogHeader>
          <F.Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <F.FormField
                control={form.control}
                name="profile_image"
                render={({ field }) => (
                  <F.FormItem>
                    <F.FormLabel>
                      Arraste a imagem até esse campo abaixo, ou clique para
                      selecionar.
                    </F.FormLabel>
                    <F.FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        placeholder="Adicione a imagem aqui"
                        {...fileRef}
                        
                      />
                    </F.FormControl>
                    <F.FormMessage />
                  </F.FormItem>
                )}
              />
              <Button type="submit">Mudar foto</Button>
            </form>
          </F.Form>
        </D.DialogContent>
      </D.Dialog>) : (
        <></>
      )}
      <span className="font-bold">{name}</span>
    </section>
  );
};

export default UserCard;
