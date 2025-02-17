import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ShieldCheck} from "lucide-react";
import {Icon} from "@iconify-icon/react";
import React from "react";

interface TabsHeaderProps {
    createMode?: boolean;
}

export function TabsHeader({createMode = false}: TabsHeaderProps) {
    return (<TabsList>
        <TabsTrigger value="metadata"><Icon icon={"material-symbols-light:edit-square-outline"}
                                            className="h-4 w-4 mr-2"
                                            width={"16"}
                                            height={"16"}/>Edit Metadata</TabsTrigger>
        <TabsTrigger value="access" disabled={createMode}><ShieldCheck className="h-4 w-4 mr-2"/>Access
            Permissions</TabsTrigger>
    </TabsList>);
}
