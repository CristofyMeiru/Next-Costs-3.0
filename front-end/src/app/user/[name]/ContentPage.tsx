'use client'
import { AuthContext } from '@/context/AuthContext'
import { UserTypeProps } from '@/context/ContentContext'
import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { unknown } from 'zod'

const ContentPage = ({name}: {name: string}) => {

    const [userPage, setUserPage] = useState<UserTypeProps>()

    async function pegarDados() {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/username/${name}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
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
    <div>ContentPage e seu nome é {userPage?.email ? userPage.username : "vixi"}</div>
  )
}

export default ContentPage