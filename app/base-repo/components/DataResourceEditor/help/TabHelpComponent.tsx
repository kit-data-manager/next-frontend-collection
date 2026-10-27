import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

interface TabHelpProps {
  title: string;
  icon: React.ReactNode;
  content: string | React.ReactNode;
  warning?: string;
}

export function TabHelpComponent({
  title,
  icon,
  content,
  warning,
}: TabHelpProps) {
  return (
    <Alert>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <span>{content}</span>
        {warning && (
          <>
            <br />
            <br />
            <span className={'text-warn'}>{warning}</span>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
