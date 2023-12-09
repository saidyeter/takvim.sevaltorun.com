"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from 'zod'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createEventRequestSchema } from "@/lib/source-api";
import { createEvent } from "@/lib/actions";

const createEventFormSchema = z.object({
  starts: z.string(),
  ends: z.string(),
  desc: z.string().min(4, 'En az 4 karakter giriniz')
})
  .refine((data) => new Date(data.starts) <= new Date(data.ends), {
    message: "Başlangıç tarihi bitiş tarihinden sonra olamaz",
    path: ["starts", "ends"],
  })


export type TCreateEventFormSchema = z.infer<typeof createEventFormSchema>;

export default function AddEventPage() {
  const form = useForm<TCreateEventFormSchema>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      desc: '',
      starts: getLocaleDate(new Date()),
      ends: getLocaleDate(new Date())
    }
  });

  const onSubmit = async (data: TCreateEventFormSchema) => {

    console.log(1);

    const aaa = await createEvent(createEventRequestSchema.parse(data))
    console.log(2, aaa);

  };


  return (
    <Form {...form}>

      <Label>Geri dönmek için&nbsp;
        <Link href="/" className="underline">tıklayınız</Link>
      </Label>
      <br />
      <br />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <FormField
          control={form.control}
          name="starts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlangıç tarihi</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="px-4 py-2 rounded"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ends"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bitiş tarihi</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="px-4 py-2 rounded"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Açıklama"
                  className="px-4 py-2 rounded"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.isSubmitting ?
          <Label>Ekleniyor</Label> :
          <Button
            type="submit"
          >
            Ekle
          </Button>
        }
      </form>
    </Form>
  );
}

function getLocaleDate(ms: Date) {
  return ms.getFullYear() + '-' +
    (ms.getMonth() + 1).toString().padStart(2, '0') + '-' +
    ms.getDate().toString().padStart(2, '0')
}
