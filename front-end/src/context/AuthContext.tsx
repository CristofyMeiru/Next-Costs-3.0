"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import { UserTypeProps } from "./ContentContext";

type typeContextProps = {
  user: UserTypeProps | null
}
export const AuthContext = createContext({} as typeContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserTypeProps | null>(null);
  const router = useRouter();
  const pathName = usePathname();
  
  async function getAuthToken() {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/refresh_auth`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.status === 401 || !res.ok) {
          console.log(res.json())
          if (pathName != "/user/auth" && pathName != "/" && pathName != '/user/register') {
            return (window.location.href = "/user/auth");
          }
        }
        return res.json();
      })
      .then((data) => {
        return sessionStorage.setItem("authToken", data.authToken);
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  async function getUserData() {
    const authToken = sessionStorage.getItem("authToken");
    if (authToken == "undefined" || !authToken) {
      console.log("passou por aqui");
      return getAuthToken();
    } else {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get_user_data`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${authToken}`,
          },
        }
      )
        .then((res) => {
          if (res.status === 401) {
            
            return getAuthToken();
          }
          return res.json();
        })
        .then((data) => {
          
          return setUser(data.user);
        })
        .catch((err) => {
          return console.log(err.message);
        });
    }
  }

  useEffect(() => {
    if(!user){
      getUserData()
      console.log(user)
    }else {
      console.log(user)
    }
  }, []);
  const props = {
    user,
  };
  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
