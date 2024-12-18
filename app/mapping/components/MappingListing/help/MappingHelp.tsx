import {Rotate3D} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify/react";
import React from "react";

export function MappingHelp() {
    return (
        <Alert>
            <Rotate3D className="h-4 w-4"/>
            <AlertTitle>Execute Mappings</AlertTitle>
            <AlertDescription>
                                <span>Here you can schedule the execution of Mapping Jobs performed by the configured MappingService. In order to create a new mapping job,
                                use the <Badge variant="outline" className={"bg-secondary"}>
                                                <Icon fontSize={16}
                                                      icon={"gridicons:add"}
                                                      className="h-4 w-4"/></Badge> button, which opens a dialog where you can select a mapping and upload input files depending on
                                    the selected mapping. For each input file, a new card representing the according Mapping Job is created and appended to the grid below. The card show
                                    he

                                    The status of each Mapping Job will be queried regularly. As soon as a Mapping Job has finished, it&#39;s state will change to
                                    <Badge variant="nodeco"><Icon fontSize={16}
                                                                  icon={"material-symbols:check-box-outline"}
                                                                  className="h-4 w-4 mr-2"/>SUCCEEDED</Badge>
                                    and you can download the mapping result using the  <Badge variant="outline"
                                                                                              className={"bg-secondary"}>
                                                <Icon fontSize={16}
                                                      icon={"material-symbols-light:download"}
                                                      className="h-4 w-4"/></Badge> button. After downloading you may remove the Mapping Job using the <Badge
                                        variant="outline" className={"bg-secondary"}>
                                                <Icon fontSize={16}
                                                      icon={"solar:eraser-linear"}
                                                      className="h-4 w-4"/></Badge> button on each card. This will remove the local Mapping Job and all output files on the server.
                                    In case you want to remove all finished or failed Mapping Jobs, you can use the bigger <Badge
                                        variant="outline" className={"bg-secondary"}>
                                                <Icon fontSize={16}
                                                      icon={"solar:eraser-linear"}
                                                      className="h-4 w-4"/></Badge> button at the end of the grid, which is available if more than 4 Mapping Jobs are registered.
                                    <br/><br/>
                                        <span className={"text-warn "}>There is an overall limit of 20 locally stored Mapping Jobs. If this limit is reached, you are no longer able to submit new Mapping Jobs.
                                            In that case, you have to remove some listed Mapping Jobs before you are able to submit new Mapping Jobs.</span>
                            </span>
            </AlertDescription>
        </Alert>
    );
}
