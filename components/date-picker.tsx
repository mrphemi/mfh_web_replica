"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  onChange: (date: Date) => void;
  value: Date | undefined;
};

export function DatePicker({ onChange, value }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {value ? format(value, "dd/MM/yyyy") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            disabled={{ after: new Date() }}
            onSelect={(date) => {
              setOpen(false);
              onChange(date!);
            }}
            className="w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
