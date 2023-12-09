'use client'
import { deleteEvent } from "@/lib/actions";
import { Button } from "./ui/button";
import { Trash2 as Remove } from "lucide-react";

export default function DeleteButton(props:{id:number}){
  return <Button size='icon' onClick={()=> deleteEvent(props.id)}><Remove/></Button>
}