import React from 'react';
import classNames from 'classnames';
import {Badge} from "@/components/ui/badge";
import {CardHeader, Card, CardContent} from "@/components/ui/card";
import {Icon} from "@iconify-icon/react";

const ServiceStatusCard =
    ({ serviceName,serviceVersion, status, link, ledStatus }) => {
  let statusColor = '';
  let statusText = '';

  switch (status) {
    case 'active':
      statusColor = 'bg-green-800';
      statusText = 'Active';
      break;
    case 'inactive':
      statusColor = 'bg-red-800';
      statusText = 'Inactive';
      break;
    case 'maintenance':
      statusColor = 'bg-yellow-600';
      statusText = 'Maintenance';
      break;
    default:
      statusColor = 'bg-gray-600';
      statusText = 'Unknown';
  }

  return (
    <a href={link}>
        <Card
            className={classNames(
                "relative w-full rounded-lg border border-gray-200 shadow-md hover:shadow-md transition-all",
                link ? "cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-150" : "opacity-80"
            )}
        >
            {/* Header */}
            <CardHeader>
                <div className="min-w-0 bg-ring-background p-3 rounded-lg shadow-md">
                    <h3 className="truncate text-lg font-semibold text-primary-foreground">
                        {serviceName}
                    </h3>
                    <p className="truncate text-sm text-primary-foreground">
                        {serviceVersion}
                    </p>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex items-center justify-between mt-2 px-3 py-2 gap-4">
                {/* LED row */}
                <div className="flex items-center gap-1">
                    {ledStatus.length === 0 && <div className="w-2 h-2" />}
                    {ledStatus.map((led, index) => (
                        <div key={index} className="relative group">
                            <div
                                className={classNames(
                                    "w-2.5 h-2.5 rounded-full transition-all",
                                    led.status === "UP"
                                        ? "bg-green-500"
                                        : led.status === "DOWN"
                                            ? "bg-red-500"
                                            : "bg-gray-600"
                                )}
                                style={{
                                    boxShadow:
                                        "inset 2px 2px 3px rgba(0,0,0,0.3), inset -2px -2px 3px rgba(255,255,255,0.3)",
                                    transition: "all 0.3s ease-in-out",
                                }}
                            />
                            {led.tooltip && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-1.5 py-0.5 rounded-md whitespace-nowrap transition-opacity duration-200">
                                    {led.tooltip}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Status badge */}
                <Badge
                    className={classNames(
                        "px-2 py-1 text-white rounded-full text-sm",
                        statusColor
                    )}
                    style={{
                        boxShadow:
                            "inset 2px 2px 3px rgba(0,0,0,0.3), inset -2px -2px 3px rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    {statusText}
                </Badge>
            </CardContent>

            {/* Optional click indicator */}
            {link && (
                <div className="absolute top-2 right-2 text-primary-foreground">
                    <span className="text-xs">Click</span>
                    <Icon icon="si:click-duotone" className="h-6 w-6 text-primary-foreground"/>
                </div>

            )}
        </Card>


    </a>
  );
};

export function ServiceStatusCardSkeleton() {
    return (
        <ServiceStatusCard serviceName={"Loading..."} serviceVersion={""} status={"unknown"} ledStatus={[]} link={undefined}/>
    )
}

export default ServiceStatusCard;

