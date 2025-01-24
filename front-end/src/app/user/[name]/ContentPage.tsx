"use client";
import UserCard from "@/components/local/UserCard";
import { AuthContext } from "@/context/AuthContext";
import { UserTypeProps } from "@/context/ContentContext";
import React from "react";
import { useEffect, useContext, useState } from "react";

const ContentPage = ({ name }: { name: string }) => {
  const [userPage, setUserPage] = useState<UserTypeProps>();

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

  useEffect(() => {
    pegarDados();
  }, []);

  return (
    <main className="flex max-h-screen p-8 pb-20 max-w-screen font-[family-name:var(--font-geist-sans)]">
      <UserCard name={userPage?.username} />
    </main>
  );
};

export default ContentPage;
