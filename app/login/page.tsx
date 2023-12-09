"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/react'
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from 'zod'

const signInSchema= z.object({
  pincode:z.string()
})

export type TSignInSchema = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error') ? 'Kullanıcı adı veya parola hatalı!' : ''
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: TSignInSchema) => {
    await signIn('credentials', {
      pincode: data.pincode,
      callbackUrl
    })
  };


  return (
    <div className="w-1/2 m-auto pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    

        <Input
          {...register("pincode")}
          type="password"
          placeholder="Parola"
          className="px-4 py-2 rounded"
        />
        {errors.pincode && (
          <p className="text-red-500">{`${errors.pincode.message}`}</p>
        )}
        <Button
          disabled={isSubmitting}
          type="submit"
        >
          Giriş Yap
        </Button>
        {error && (
          <p className="text-red-500 text-center">{`${error}`}</p>
        )}
      </form>
    </div>
  );
}