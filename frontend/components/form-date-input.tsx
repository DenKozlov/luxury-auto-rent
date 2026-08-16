import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { type Mode } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormDateInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  error?: string;
  mode?: Mode;
}

export default function FormDateInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  error,
  mode = "single",
}: FormDateInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="date">{label}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="justify-start font-normal cursor-pointer hover:bg-background hover:text-accent-foreground"
                aria-invalid={!!error}
              >
                <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                <span
                  className={cn({
                    "text-muted-foreground": !field.value,
                  })}
                >
                  {field.value ? field.value.toLocaleDateString() : placeholder}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                required
                mode={mode}
                // defaultMonth={date}
                captionLayout="dropdown"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FieldError errors={[{ message: error }]} />
        </Field>
      )}
    />
  );
}
