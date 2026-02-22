"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { SelectInput } from "@/components/select";
import { DatePicker } from "./date-picker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const events = [
  { value: "Thanksgiving Sunday", label: "Thanksgiving Sunday" },
  { value: "Encounter Sunday", label: "Encounter Sunday" },
  { value: "Refocus Sunday", label: "Refocus Sunday" },
  { value: "Rooted Sunday", label: "Rooted Sunday" },
  { value: "Evolve Service", label: "Evolve Service" },
  { value: "Digging Deep", label: "Digging Deep" },
  { value: "Special Event", label: "Special Event" },
];

const formSchema = z.object({
  maleCount: z.number("Please enter a number").min(0, "Must be at least 0"),
  femaleCount: z.number("Please enter a number").min(0, "Must be at least 0"),
  childrenCount: z.number("Please enter a number").min(0, "Must be at least 0"),
  attendanceDate: z.date("Please select a Date"),
  activityType: z.string("Please select an activity/service"),
});

type FormPayload = Omit<z.infer<typeof formSchema>, "attendanceDate"> & {
  attendanceDate: string;
};

export function AttendanceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maleCount: 0,
      femaleCount: 0,
      childrenCount: 0,
      activityType: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: FormPayload) => {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedDate = values.attendanceDate.toISOString().split("T")[0];

    const payload = {
      ...values,
      attendanceDate: formattedDate,
    };

    const res = await mutation.mutateAsync(payload);

    if (res.success) {
      toast.success("Attendance submitted successfully.");
      form.reset();
    }
  };

  const isSubmitting = form.formState.isSubmitting || mutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <FormField
            control={form.control}
            name="activityType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Activity/Service</FormLabel>
                <FormControl>
                  <SelectInput
                    data={events}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attendanceDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <FormField
            control={form.control}
            name="maleCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Male</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="femaleCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Female</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childrenCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Children</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-min ml-auto cursor-pointer">
          <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          <Save />
        </Button>
      </form>
    </Form>
  );
}
