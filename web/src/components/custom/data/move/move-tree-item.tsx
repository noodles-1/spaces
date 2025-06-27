"use client"

import React from "react";

import { FolderSymlink, Home } from "lucide-react";

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

import { FileIcon } from "@/components/custom/data/file-icon";

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    padding: theme.spacing(1.2, 1),
}));

interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, "rootRef">,
        Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

export const MoveTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getGroupTransitionProps,
        status,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()} className="flex items-center justify-between text-[14px]">
                    <section className="flex items-center gap-2">
                        <TreeItem2IconContainer {...getIconContainerProps()}>
                            <TreeItem2Icon status={status} />
                        </TreeItem2IconContainer>
                        <div className="flex items-center gap-3">
                            {itemId === "HOME" &&
                                <Home className="h-4 w-4" />
                            }
                            {itemId === "SHARED" &&
                                <FolderSymlink className="h-4 w-4" />
                            }
                            {!["HOME", "SHARED"].includes(itemId) &&
                                <FileIcon className="h-4 w-4" />
                            }
                            <span className="font-light"> {label} </span>
                        </div>
                    </section>
                </CustomTreeItemContent>
                {children && (
                    <TreeItem2GroupTransition {...getGroupTransitionProps()} />
                )}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});