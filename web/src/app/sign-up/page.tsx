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
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email input cannot be empty. " })
        .email({ message: "Not a valid email address. " }),
});

export default function SignUpPage() {
    const router = useRouter();

    const { setEmailInput } = useEmailInputStore(state => state);
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    });

    const onSubmit = (values: { email: string }) => {
        setEmailInput(values.email);
        router.push("/sign-up/password");
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
                    <span className="text-xl font-medium"> Create an account </span>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Email address" className="h-12 rounded-lg" {...field} />
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
                    <div className="flex items-center w-full gap-3 my-2">
                        <Separator className="flex-1 bg-zinc-600" />
                        <span className="text-sm"> OR </span>
                        <Separator className="flex-1 bg-zinc-600" />
                    </div>
                    <Button variant="outline" className="flex justify-start w-full h-14 rounded-lg cursor-pointer">
                        <div className="flex items-center w-full gap-4 mx-2">
                            <svg fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            <span> Continue with Github </span>
                        </div>
                    </Button>
                </div>
            </section>
        </main>
    );
}