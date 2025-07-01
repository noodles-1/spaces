import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CircleCheck, CircleX, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { renameItem } from "@/services/storage";

import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RenameForm({
    selectedItems,
    setOpen
}: {
    selectedItems: Item[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const pathname = usePathname();

    const [loading, setLoading] = useState<boolean>(false);

    const selectedItemRef = useRef<Item | null>(null);

    const queryClient = useQueryClient();
    const renameItemMutation = useMutation({
        mutationFn: renameItem
    });

    const formSchema = z.object({
        newName: z
            .string()
            .min(1, { message: "Name cannot be empty." })
            .max(200, { message: "Name cannot be more than 200 characters." })
            .refine(value => {
                if (value === "")
                    return true;
    
                return /^(?!\.{1,2}$)[^/]+$/.test(value) && !value.includes(";");
            }, {
                message: "Invalid name."
            })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newName: ""
        }
    });

    useEffect(() => {
        if (selectedItems.length === 1) {
            selectedItemRef.current = selectedItems[0];
            if (selectedItemRef.current.type === "FOLDER") {
                form.setValue("newName", selectedItems[0].name);
            }
            else {
                const slices = selectedItemRef.current.name.split(".");
                form.setValue("newName", slices.slice(0, slices.length - 1).join("."));
            }
        }
    }, [selectedItems]);
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (selectedItemRef.current === null)
            return;

        try {
            setLoading(true);

            const paths = pathname.split("/");
            const parentId = paths.length === 4 ? paths[3] : undefined;
            const itemFileExtension = selectedItemRef.current.type === "FILE" ? selectedItemRef.current.name.split(".").slice(-1)[0] : undefined;
            await renameItemMutation.mutateAsync({
                itemId: selectedItemRef.current.id,
                itemFileExtension,
                newItemName: values.newName,
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message: `Renamed to ${values.newName}.`
            });

            form.setValue("newName", "");
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

            queryClient.invalidateQueries({
                queryKey: ["user-accessible-items-recursive"]
            });
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
            selectedItemRef.current = null;
        }
    };

    return (
        <DialogContent className="bg-zinc-800 w-[28rem] [&>button]:hidden">
            <DialogHeader>
                <DialogTitle className="font-medium"> Rename </DialogTitle>
            </DialogHeader>
            <main className="flex flex-col gap-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <section className="flex flex-col gap-8">
                            <section className="flex flex-col gap-1">
                                <span className="font-medium text-zinc-300 text-sm"> New name: </span>
                                <div className="flex items-center gap-2">
                                    <FormField 
                                        control={form.control}
                                        name="newName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        className="w-full rounded-xl"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[12px]" />
                                            </FormItem>
                                        )}
                                    />
                                    {selectedItemRef.current && selectedItemRef.current.type === "FILE" &&
                                        <span className="text-zinc-400"> .{selectedItemRef.current.name.split(".").slice(-1)[0]} </span>
                                    }
                                </div>
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
                                        "Renaming..."
                                    :
                                        "Rename"
                                    }
                                </Button>
                            </DialogFooter>
                        </section>
                    </form>
                </Form>
            </main>
        </DialogContent>
    );
}