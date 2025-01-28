"use client";
import UserCard from "@/components/local/UserCard";
import UserProjects, { ProjectProps } from "@/components/local/UserProjects";
import { AuthContext } from "@/context/AuthContext";
import { UserTypeProps } from "@/context/ContentContext";
import React from "react";
import { useEffect, useContext, useState } from "react";

const ContentPage = ({ name }: { name: string }) => {
  const [userPage, setUserPage] = useState<UserTypeProps>();
  const [allProjects, setAllProjects] = useState<ProjectProps[]>([])
  
  const {user} = useContext(AuthContext)


  const isAuthor = user?.username == userPage?.username ? true : false

  async function pegarDados() {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/username/${name}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return setUserPage(data.user);
      })
      .catch((err) => {
        return console.log(err);
      });
  }
  async function getProjects() {
    const authToken = sessionStorage.getItem("authToken");
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/get_all_by_user/${name}`,
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
        return setAllProjects(data.allProjects);
      })
      .catch((err) => {
        return console.log(err);
      });
  }
  useEffect(() => {
    pegarDados();
    getProjects();
  }, []);
  
  return (
    <main className="flex max-h-screen p-8 pb-20 max-w-screen font-[family-name:var(--font-geist-sans)]">
      <UserCard name={userPage?.username} isAuthor={isAuthor} />
      <UserProjects allProjects={allProjects} isAuthor={isAuthor} />
    </main>
  );
};

export default ContentPage;
