"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from 'zod'

const addEventSchema= z.object({
  starts:z.string().transform(p=> new Date(p)),
  ends:z.string().transform(p=> new Date(p)),
  desc: z.string()
})

export type TAddEventSchema = z.infer<typeof addEventSchema>;

export default function AddEventPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TAddEventSchema>({
    resolver: zodResolver(addEventSchema),
    defaultValues:{
      desc:'',
      starts:new Date(),
      ends:new Date()
    }
  });

  const onSubmit = async (data: TAddEventSchema) => {
    console.log(data);
    
  };


  return (
    <div className="w-1/2 m-auto pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">

      <Input
          {...register("starts")}
          type="date"
          placeholder="Baslangic tarihi"
          className="px-4 py-2 rounded"
        />
        {errors.starts && (
          <p className="text-red-500">{`${errors.starts.message}`}</p>
        )}

        <Input
          {...register("ends")}
          type="date"
          placeholder="Bitis tarihi"
          className="px-4 py-2 rounded"
        />
        {errors.ends && (
          <p className="text-red-500">{`${errors.ends.message}`}</p>
        )}

        <Input
          {...register("desc")}
          type="text"
          placeholder="Aciklama"
          className="px-4 py-2 rounded"
        />
        {errors.desc && (
          <p className="text-red-500">{`${errors.desc.message}`}</p>
        )}
        <Button
          disabled={isSubmitting}
          type="submit"
        >
          Ekle
        </Button>
        {/* {error && (
          <p className="text-red-500 text-center">{`${error}`}</p>
        )} */}
      </form>
    </div>
  );
}