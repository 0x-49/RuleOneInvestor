import React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose
} from './sheet';

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

interface SheetWrapperProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  side?: SheetSide;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function SheetWrapper({
  trigger,
  title,
  description,
  content,
  footer,
  side = 'right',
  open,
  onOpenChange,
  className
}: SheetWrapperProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side} className={className}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        
        {content}
        
        {footer && (
          <SheetFooter>
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
