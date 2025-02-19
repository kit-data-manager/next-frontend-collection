import React from 'react';
import classNames from 'classnames';
import {Badge} from "@/components/ui/badge";
import {CardHeader, Card, CardContent, CardFooter} from "@/components/ui/card";

const ServiceStatusCard = ({ serviceName,serviceVersion, status, link, ledStatus }) => {
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
    <Card className="w-full rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="bg-ring-background p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary-background truncate">{serviceName}</h3>
          <p className="text-sm text-secondary-background truncate">{serviceVersion}</p>
        </div>

      </CardHeader>
      <CardContent>
        <div className="flex gap-1 mt-1">
          {ledStatus.length === 0?
              <div className="w-3 h-3 ">
                {/* Spacing for uniform alignment */}
              </div>
          :null}
          {ledStatus.map((led, index) => (
              <div key={`card_${index}`} className="relative group">
                <div
                    className={classNames(
                        'w-3 h-3 transition-all shadow-md',
                        led.status === "UP" ? 'bg-green-500' : led.status === "DOWN" ? 'bg-red-500' : 'bg-gray-600', 'relative',
                    )}
                    style={{
                      boxShadow: led.status
                          ? 'inset 3px 3px 5px rgba(0, 0, 0, 0.3), inset -3px -3px 5px rgba(255, 255, 255, 0.3)'  // Green: Embossed effect (light top-left, dark bottom-right)
                          : 'inset 3px 3px 5px rgba(0, 0, 0, 0.3), inset -3px -3px 5px rgba(255, 255, 255, 0.3)', // Red: Same effect
                      transition: 'all 0.3s ease-in-out' // Smooth transition for the embossed look
                    }}
                />
                {/* Tooltip */}
                {led.tooltip ?
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md mt-1 transition-opacity duration-200">
                  {led.tooltip}
                </div>
                :null }
              </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge className={classNames('px-3 py-1 text-white rounded-full', statusColor)}
               style={{
                 boxShadow: status === "active"
                     ? 'inset 3px 3px 5px rgba(0, 0, 0, 0.3), inset -3px -3px 5px rgba(255, 255, 255, 0.3)'  // Green: Embossed effect (light top-left, dark bottom-right)
                     : 'inset 3px 3px 5px rgba(0, 0, 0, 0.3), inset -3px -3px 5px rgba(255, 255, 255, 0.3)', // Red: Same effect
                 transition: 'all 0.3s ease-in-out' // Smooth transition for the embossed look
               }}
        >
          {statusText}
        </Badge>
        {link && (
            <a
                href={link}
                className="text-blue-500 hover:text-blue-700 text-sm"
                target="_self"
                rel="noopener noreferrer"
            >
              Visit...
            </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceStatusCard;

