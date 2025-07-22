"use client"

import React from "react";
import { useStorageTreeStore } from "@/zustand/providers/storage-tree-provider";

import { styled } from "@mui/material/styles";

import {
    useTreeItem2,
    UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";
import {
    TreeItem2Content,
    TreeItem2IconContainer,
    TreeItem2GroupTransition,
    TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";

import { Progress } from "@/components/ui/progress";
import { FileIcon } from "@/components/custom/data/file-icon";

import { formatFileSize } from "@/lib/custom/file-size";

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    padding: theme.spacing(1.2, 1),
}));

interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, "rootRef">,
        Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const TreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const { itemMap } = useStorageTreeStore(state => state);
    
    const { id, itemId, label, disabled, children, ...other } = props;
    const item = itemMap.get(itemId);

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getGroupTransitionProps,
        status,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const capacity = Number("5e+10"); // TODO: dependent on the total storage capacity
    const used = item?.size ?? 0;
    const percentageUsed = used / capacity * 100;

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()} className="flex items-center justify-between">
                    <section className="flex items-center gap-4">
                        <TreeItem2IconContainer {...getIconContainerProps()}>
                            <TreeItem2Icon status={status} />
                        </TreeItem2IconContainer>
                        <div className="flex items-center gap-4">
                            <FileIcon contentType={item?.contentType} className="h-4 w-4" />
                            <span className="font-light"> {label} </span>
                        </div>
                    </section>
                    <section className="flex items-center gap-4 justify-end">
                        <span className="text-sm font-light"> {formatFileSize(used)} ({percentageUsed.toFixed(2)}%) </span>
                        <Progress
                            value={(used / capacity) * 100}
                            className="w-[300px] bg-zinc-700"
                        />
                    </section>
                </CustomTreeItemContent>
                {children && (
                    <TreeItem2GroupTransition {...getGroupTransitionProps()} />
                )}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});