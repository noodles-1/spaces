"use client"

import React, { useState } from "react";

import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react";

import { CircleX, Loader2, PenLine, Trash, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { registerUser, updateProfilePicture } from "@/actions/user";

import { customToast } from "@/lib/custom/utils";

import { ResponseDto } from "@/dto/response-dto";

import { PROFILE_PICTURE_FILE_SIZE_LIMIT } from "@/constants/limits";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const formSchema = z.object({
    profilePicture: z
        .instanceof(File)
        .refine(file => {
            return ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
        }, { 
            message: "Only .png, .jpg, or .jpeg file types allowed." 
        })
        .refine(file => {
            return file.size <= PROFILE_PICTURE_FILE_SIZE_LIMIT;
        }, {
            message: "File size should not exceed 2MB." 
        })
        .optional(),
    customUsername: z
        .string()
        .min(4, { message: "Username cannot be less than 4 characters." })
        .refine(value => {
            if (value === "")
                return true;

            return /^[a-zA-Z0-9]+$/.test(value) && !value.includes(";");
        }, {
            message: "Username can only contain letters or numbers"
        })
        .refine(async (value) => {
            if (value === "")
                return true;

            if (value.includes(";"))
                return true;

            const response = await fetch(`${SERVER_URL}/user/users/custom-username-exists/${value}`);
            const responseData: ResponseDto = await response.json();
            
            if (responseData.data) {
                return !responseData.data.userExists;
            }

            return false;
        }, {
            message: "Username already exists."
        })
});

export default function AuthSetupPage() {
    const router = useRouter();

    const { data: session, status } = useSession();

    const [imageFile, setImageFile] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customUsername: ""
        }
    });
    
    const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null || event.target.files.length === 0) {
            return;
        }

        const imageFileInput = event.target.files[0];
        setImageFile(URL.createObjectURL(imageFileInput));
        form.setValue("profilePicture", imageFileInput);
    };

    const removeImageInput = () => {
        setImageFile(null);
        form.setValue("profilePicture", undefined)
    };
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (session === null)
                return;

            setLoading(true);
            await registerUser(session, values.customUsername);

            if (values.profilePicture)
                await updateProfilePicture(values.profilePicture);

            router.push("/spaces/home");
        }
        catch (err) {
            signOut({ callbackUrl: "/login" });
            customToast({
                icon: <CircleX className="w-4 h-4" fill="white" />,
                message: err as string
            });
        }
        finally {
            setLoading(false);
        }
    };

    if (status === "authenticated") {
        // TODO: redirect to home
    }
    
    return (
        <main className="relative flex flex-col items-center justify-center flex-1 h-screen space-y-12 bg-zinc-800">
            <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-right text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-left">
                spaces
            </p>
            <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-semibold"> Welcome to spaces! </span>
                <span className="text-lg text-[#abc4ff]"> Setup your profile to continue. </span>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-[20rem] flex flex-col items-center space-y-7">
                    <FormField
                        control={form.control}
                        name="profilePicture"
                        render={() => (
                            <FormItem className="flex flex-col items-center">
                                <div className="relative">
                                    <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full outline-2 group">
                                        {imageFile ? 
                                            <img src={imageFile} className="object-cover w-full h-full rounded-full" />
                                        :
                                            <UserRound height={50} width={50} className="stroke-zinc-500" />
                                        }
                                        <FormControl>
                                            <label 
                                                className="absolute h-[120px] w-[120px] flex items-center justify-center transition-opacity duration-150 rounded-full opacity-0 cursor-pointer group-hover:opacity-60 bg-zinc-600"
                                            >
                                                <PenLine color="white" height={40} width={40} opacity={70} />
                                                <input 
                                                    type="file"
                                                    accept="image/png,image/jpg,image/jpeg"
                                                    onChange={handleImageInput}
                                                    className="hidden"
                                                />
                                            </label>
                                        </FormControl>
                                    </div>
                                    {imageFile &&
                                        <div 
                                            className="absolute -bottom-1 -right-1 rounded-full bg-zinc-600 h-[38px] w-[38px] flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors duration-150"
                                            onClick={removeImageInput}
                                        >
                                            <Trash height={22} width={22} color="#c3adff" />
                                        </div>
                                    }
                                </div>
                                <FormMessage className="text-[12px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customUsername"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center w-full">
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="spaces username"
                                        className="font-semibold text-center rounded-full h-14"
                                    />
                                </FormControl>
                                <FormMessage className="text-[12px]" />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit"
                        variant="outline"
                        disabled={loading}
                        className="h-12 w-36 rounded-full cursor-pointer"
                    >
                        {loading && <Loader2 className="animate-spin"/>}
                        {loading ?
                            "Logging-in..."
                        :
                            "Continue"
                        }
                    </Button>
                </form>
            </Form>
            <Button 
                variant="link" 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="cursor-pointer text-[#c3adff]"
            > 
                Cancel setup 
            </Button>
        </main>
    );
}