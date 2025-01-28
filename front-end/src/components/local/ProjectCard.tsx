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
} from "../ui/card";

const ProjectCard = ({ ...props }: ProjectProps) => {
  const [categoryColor, setCategoryColor] = useState<string>("");

  useEffect(() => {
    switch (props.category) {
      case "Desenvolvimento":
        setCategoryColor("bg-purple-400");
        break;
      case "Infraestrutura":
        setCategoryColor("bg-rose-400");
        break;
        case "Designe":
            setCategoryColor("bg-teal-400")
            break;
        case "Planejamento":
            setCategoryColor("bg-orange-200")
            break
        default:
            setCategoryColor("bg-white")
            break
    }
  }, []);

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription className=" flex space-x-2 items-center ">
            {" "}
            <div
              className={`${categoryColor} h-[12px] w-[12px] rounded-full`}
            ></div>{" "}
            <span>{props.category}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>{props.content}</CardContent>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
