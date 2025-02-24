import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";

type ServiceWindowProps = {
  className?: string;
  project_id?: string;
};
const ServiceWindow = ({ className, project_id }: ServiceWindowProps) => {
  return (
    <ScrollArea className={className}>
      <div className="p-4">
        <Button className=" fixed top-[500px] ">
          <PlusIcon />
        </Button>
        <h4 className=" bg-stone-800 rounded-md mb-4 p-2 text-center text-sm font-medium leading-none">
          Serviços
        </h4>
        {Array(10).fill(0).map((index)=> (
            <ServiceCard/>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ServiceWindow;
