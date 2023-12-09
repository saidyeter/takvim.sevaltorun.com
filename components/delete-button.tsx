'use client'
import { deleteEvent } from "@/lib/actions";
import { Button } from "./ui/button";

export default function DeleteButton(props:{id:number}){
  return <Button onClick={()=> deleteEvent(props.id)}>Sil</Button>
}