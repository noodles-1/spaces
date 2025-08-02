"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CircleCheck, CircleX, Loader2, PenLine, UserRound } from "lucide-react";

import { signOutUser, updateProfilePicture, updateCustomUsername } from "@/services/user";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
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

import { ResponseDto } from "@/dto/response-dto";
import { User } from "@/types/response/user-type";

import { AxiosError, AxiosResponse } from "axios";
import axiosClient from "@/lib/axios-client";
import { customToast } from "@/lib/custom/custom-toast";

import { PROFILE_PICTURE_FILE_SIZE_LIMIT } from "@/constants/limits";

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
        .max(20, { message: "Username cannot be more than 20 characters." })
        .refine(value => {
            if (value === "")
                return true;

            return /^[a-zA-Z0-9]+$/.test(value) && !value.includes(";");
        }, {
            message: "Username can only contain letters or numbers."
        })
        .refine(async (value) => {
            if (value === "")
                return true;

            if (value.includes(";"))
                return true;

            const customUsernameExistsResponse = await axiosClient.get(`/user/users/custom-username-exists/${value}`);
            const customUsernameExistsResponseData: ResponseDto<{ userExists: boolean }> = customUsernameExistsResponse.data;

            const currentUserResponse = await axiosClient.get(`/user/users/me`);
            const currentUserResponseData: ResponseDto<User> = currentUserResponse.data;
            
            if (customUsernameExistsResponseData.data && currentUserResponseData.data) {
                if (customUsernameExistsResponseData.data.userExists && currentUserResponseData.data.user.customUsername === value) {
                    return true;
                }

                return !customUsernameExistsResponseData.data.userExists;
            }

            return false;
        }, {
            message: "Username already exists."
        })
});

export function ProfileButton() {
    const router = useRouter();

    const { data: userData } = useQuery<AxiosResponse<ResponseDto<User>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me")
    });

    const [imageFile, setImageFile] = useState<string | null>(null);
    const [submitLoading, setLoading] = useState<boolean>(false);
    const [loggedOut, setLoggedOut] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const signOutMutation = useMutation({
        mutationFn: signOutUser
    });
    
    const updateProfilePictureMutation = useMutation({
        mutationFn: updateProfilePicture
    });

    const updateCustomUsernameMutation = useMutation({
        mutationFn: updateCustomUsername
    });
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        if (userData?.data.data.user.customUsername) {
            setImageFile(userData.data.data.user.profilePictureUrl);
            form.setValue("customUsername", userData.data.data.user.customUsername);
        }
    }, [userData, form]);

    if (!userData || !userData.data.data.user) {
        return null;
    }

    const user = userData.data.data.user;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            await updateCustomUsernameMutation.mutateAsync({
                customUsername: values.customUsername
            });

            if (values.profilePicture)
                await updateProfilePictureMutation.mutateAsync({ imageFile: values.profilePicture });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: "Profile updated successfully."
            });

            queryClient.invalidateQueries({
                queryKey: ["current-user"]
            });
        }
        catch (err) {
            const axiosError = err as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoggedOut(true);
        await signOutMutation.mutateAsync();
        router.push("/login");
    };

    const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null || event.target.files.length === 0) {
            return;
        }

        const imageFileInput = event.target.files[0];
        setImageFile(URL.createObjectURL(imageFileInput));
        form.setValue("profilePicture", imageFileInput);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open && user.customUsername) {
            setImageFile(user.profilePictureUrl);
            form.setValue("customUsername", user.customUsername);
        }
    };

    return (
        <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <div className="flex items-center h-full">
                    <Button variant="ghost" className="mx-4 h-[4rem] p-0 group cursor-pointer">
                        <div className="flex items-center w-full h-full gap-3 px-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full outline-2 outline-zinc-500 group-hover:outline-[#7076a7]">
                                {userData.data.data.user.profilePictureUrl ?
                                    <img src={user.profilePictureUrl ?? ""} className="object-cover w-full h-full rounded-full" />
                                : 
                                    <UserRound />
                                }
                            </div>
                            <span className="group-hover:text-[#bfc7ff]"> {user.customUsername} </span>
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 flex flex-col gap-3">
                <DialogHeader>
                    <DialogTitle className="font-medium"> Profile </DialogTitle>
                    <DialogDescription> Edit your profile details </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <section className="flex gap-8 pb-8">
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
                                        </div>
                                        <FormMessage className="text-[12px] text-center max-w-[100px]" />
                                    </FormItem>
                                )}
                            />
                            <section className="w-full space-y-1 text-sm">
                                <section className="space-y-4 ">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-medium text-zinc-300"> Username: </span>
                                        <FormField 
                                            control={form.control}
                                            name="customUsername"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input 
                                                            {...field}
                                                            className="w-full font-semibold rounded-xl"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-[12px]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="flex items-center gap-1"> 
                                            <span className="font-medium text-zinc-300"> Connected with: </span>
                                            <div className="flex items-center gap-2">
                                                {user.provider} 
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </section>
                        </section>
                        <DialogFooter className="flex items-center justify-end">
                            <Button type="button" variant="outline" className="cursor-pointer hover:text-red-300" onClick={() => handleLogout()} disabled={loggedOut}>
                                {loggedOut ?
                                    "Logging-out..."
                                :
                                    "Logout"
                                }
                            </Button>
                            <Button type="submit" className="cursor-pointer" disabled={submitLoading}>
                                {submitLoading && <Loader2 className="animate-spin"/>}
                                {submitLoading ?
                                    "Saving..."
                                :
                                    "Save changes"
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
