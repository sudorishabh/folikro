"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Registration schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setSuccess(data.message);
      setError(null);
      form.reset();
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
      setSuccess(null);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setError(null);
    setSuccess(null);
    registerMutation.mutate(data);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-3xl font-bold text-center'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john.doe@example.com'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                        disabled={registerMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className='bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20'>
                  {error}
                </div>
              )}

              {success && (
                <div className='bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 text-sm p-3 rounded-md border border-green-200 dark:border-green-800'>
                  {success}
                </div>
              )}

              <Button
                type='submit'
                className='w-full'
                disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={() => signIn("google", { callbackUrl: "/" })}>
            <svg
              className='mr-2 h-4 w-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='google'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 488 512'>
              <path
                fill='currentColor'
                d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-sm text-muted-foreground text-center'>
            Already have an account?{" "}
            <Link
              href='/auth/login'
              className='text-primary hover:underline font-medium'>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
