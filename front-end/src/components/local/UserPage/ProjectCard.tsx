"use client";
import React, { useEffect, useState } from "react";
import { ProjectProps } from "./UserProjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProjectCard = ({ ...props }: ProjectProps) => {
  const [categoryColor, setCategoryColor] = useState<string>("");
  const pathName = usePathname()

  useEffect(() => {
    switch (props.category) {
      case "Desenvolvimento":
        setCategoryColor("bg-purple-400");
        break;
      case "Infraestrutura":
        setCategoryColor("bg-rose-400");
        break;
      case "Designe":
        setCategoryColor("bg-teal-400");
        break;
      case "Planejamento":
        setCategoryColor("bg-orange-200");
        break;
      default:
        setCategoryColor("bg-white");
        break;
    }
  }, []);

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle className="  text-[22px] ">
            <Link
              className="hover:text-yellow-400 transition"
              href={`${pathName}/project/${props._id}`}
            >
              {props.title}
            </Link>
          </CardTitle>
          <CardDescription className=" flex items-start flex-col space-x-2 ">
            <span className="font-semibold ml-2 ">
              Orçamento:{" "}
              <span className="text-yellow-400">{props.budget.toLocaleString('pt-BR', {style: "currency", currency: "BRL"})}</span>
            </span>
            <div className="flex items-center space-x-1">
              {" "}
              <div
                className={`${categoryColor}  h-[12px] w-[12px] rounded-full`}
              ></div>{" "}
              <span className="font-semibold">{props.category}</span>
            </div>
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
