import { useState } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CircleCheck, CircleX, Loader2, Plus } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createItem } from "@/services/storage";

import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";

export function NewFolder() {
    const pathname = usePathname();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const createFolderMutation = useMutation({
        mutationFn: createItem
    });

    const queryClient = useQueryClient();

    const formSchema = z.object({
        folderName: z
            .string()
            .min(1, { message: "Folder name cannot be empty." })
            .max(200, { message: "Folder name cannot be more than 200 characters." })
            .refine(value => {
                if (value === "")
                    return true;
    
                return /^(?!\.{1,2}$)[^/]+$/.test(value) && !value.includes(";");
            }, {
                message: "Invalid folder name."
            })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            folderName: ""
        }
    });
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const paths = pathname.split("/");
            const parentId = paths.length === 4 ? paths[3] : undefined;
            await createFolderMutation.mutateAsync({
                name: values.folderName,
                type: "FOLDER",
                parentId
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: "Created new folder successfully."
            });

            form.setValue("folderName", "");
            setOpen(false);
            
            if (parentId) {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items", parentId]
                });
            }
            else {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items"]
                });
            }
        }
        catch (error) {
            const axiosError = error as AxiosError;
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

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <div className="w-full">
                    <Button
                        variant="secondary"
                        className="w-full p-0 rounded-xl hover:cursor-pointer h-[3rem]"
                        onClick={() => setOpen(true)}
                    >
                        <div className="flex items-center w-full gap-4 px-6 text-left">
                            <Plus className="stroke-[4px]" />
                            <span> New folder </span>
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 w-[28rem] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="font-medium"> New folder </DialogTitle>
                    {pathname.startsWith("/spaces/folders") ?
                        <DialogDescription> Create new folder on this current directory </DialogDescription>
                    :
                        <DialogDescription> Create new folder on the <strong> home </strong> directory </DialogDescription>
                    }
                </DialogHeader>
                <main className="flex flex-col gap-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <section className="flex flex-col gap-8">
                                <section className="flex flex-col gap-1">
                                    <span className="font-medium text-zinc-300 text-sm"> Folder name: </span>
                                    <FormField 
                                        control={form.control}
                                        name="folderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="example: my folder"
                                                        className="w-full rounded-xl"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[12px]" />
                                            </FormItem>
                                        )}
                                    />
                                </section>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="link" className="cursor-pointer text-spaces-tertiary" onClick={() => setOpen(false)}>
                                            Close
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" className="cursor-pointer" disabled={loading}>
                                        {loading && <Loader2 className="animate-spin"/>}
                                        {loading ?
                                            "Creating..."
                                        :
                                            "Create"
                                        }
                                    </Button>
                                </DialogFooter>
                            </section>
                        </form>
                    </Form>
                </main>
            </DialogContent>
        </Dialog>
    );
}