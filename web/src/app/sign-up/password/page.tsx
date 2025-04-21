"use client"

import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useEmailInputStore } from "@/zustand/providers/email-input-store-provider";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email input cannot be empty. " })
        .email({ message: "Not a valid email address. " }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long. "})
});

export default function SignUpPasswordPage() {
    const { email } = useEmailInputStore(state => state);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email,
            password: "",
        },
    });

    const onSubmit = (values: { email: string, password: string }) => {
        console.log(values);
    };

    return (
        <main className="flex flex-1">
            <section className="flex items-center justify-center flex-1">
                <div className="w-[80%] flex flex-col">
                    <p className="w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-[5rem] lg:text-[6rem] font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                        spaces
                    </p>
                    <span className="text-2xl"> Your personal cloud storage </span>
                </div>
            </section>
            <section className="bg-zinc-800 w-[400px]">
                <div className="mx-auto w-[80%] mt-[120px] flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-medium"> Create an account </span>
                        <span className="text-sm text-zinc-300"> Set your password to continue </span>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input disabled placeholder="Email address" className="h-12 rounded-lg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <PasswordInput placeholder="Password" className="h-12 rounded-lg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-12 rounded-lg cursor-pointer">
                                Continue
                            </Button>
                        </form>
                    </Form>
                    <div className="flex items-center justify-center gap-1 text-sm">
                        <span> Already have an account? </span>
                        <Link href="/login" className="text-[#81a7ff] hover:underline"> Log-in </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}