import React from "react";

export interface DropdownItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}
