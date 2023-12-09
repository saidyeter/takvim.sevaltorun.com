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
import { createEvent, updateEvent } from "@/lib/actions";
import { createEventRequestSchema } from "@/lib/source-api";

const eventFormSchema = z.object({
  starts: z.string(),
  ends: z.string(),
  desc: z.string().min(4, 'En az 4 karakter giriniz')
})
  .refine((data) => new Date(data.starts) <= new Date(data.ends), {
    message: "Başlangıç tarihi bitiş tarihinden sonra olamaz",
    path: ["starts"],
  })


export type TEventFormSchema = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  role: 'add' | 'edit'
  defaultVal?: TEventFormSchema,
  id?: number
}

export default function EventForm(props: EventFormProps) {

  const form = useForm<TEventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      desc: props.defaultVal?.desc ?? '',
      starts: getLocaleDate(props.defaultVal?.starts ? new Date(props.defaultVal?.starts) : new Date()),
      ends: getLocaleDate(props.defaultVal?.ends ? new Date(props.defaultVal?.ends) : new Date())
    }
  });

  const onSubmit = async (data: TEventFormSchema) => {
    if (props.role == 'add') {
      await createEvent(createEventRequestSchema.parse(data))
    } else if (props.role == 'edit') {
      await updateEvent(props.id ?? -1, createEventRequestSchema.parse(data))
    }
  };


  return (
    <Form {...form}>
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
            {props.role == 'add' ? 'Ekle' : "Kaydet"}
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
