"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { differenceInYears, format } from "date-fns";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/form-input";
import { MapProvider } from "@/components/providers/map-provider";
import { RentalLocationsSection } from "@/components/rental-locations-section";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import FormDateInput from "@/components/form-date-input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { rentalsService } from "@/services/rentals.service";
import { toast } from "sonner";

const filtersSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email("Incorrect email format")),
  phone: z
    .string()
    .min(1, "Phone is required")
    .pipe(z.string().regex(/^\+?[1-9]\d{1,14}$/, "Incorrect phone format")),

  dateOfBirth: z.date({ message: "Date of birth is required" }).refine(
    (date) => {
      const age = differenceInYears(new Date(), date);
      return age >= 18;
    },
    {
      message: "You must be at least 18 years old",
    },
  ),
  driverLicenseNumber: z.string().min(1, "License number is required"),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    { message: "Rent range is required" },
  ),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Return location is required"),
});

export type RentalFormValues = z.infer<typeof filtersSchema>;

interface BookingFormProps {
  carName: string;
  carId: string;
  pricePerDay: number;
}

interface Rental {
  carId: string;
  totalPrice: number;
  dropoffLocation: string;
  pickupLocation: string;
  startDate: Date;
  endDate: Date;
}

interface Client {
  dateOfBirth: Date;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  driverLicenseNumber: string;
}

export interface CheckoutPayload {
  client: Client;
  rental: Rental;
}

export function RentalForm({ carName, pricePerDay, carId }: BookingFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useMutation({
    mutationFn: (values: CheckoutPayload) => rentalsService.checkout(values),
    onSuccess: async (response) => {
      window.location.href = response?.redirectUrl;
    },
    onError: (e) => {
      console.error(e.response?.data?.message);
      toast.error("Failed to proceed to payment");
    },
  });

  const methods = useForm<RentalFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      driverLicenseNumber: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const dateRange = useWatch({
    control,
    name: "dateRange",
  });

  const calculateDays = useCallback(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const diffTime = Math.abs(
      dateRange.to.getTime() - dateRange.from.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  }, [dateRange]);

  const totalDays = useMemo(() => calculateDays(), [calculateDays]);
  const totalPrice = totalDays * pricePerDay;

  const onSubmit = ({
    dateOfBirth,
    dateRange: { from, to },
    pickupLocation,
    dropoffLocation,
    email,
    phone,
    firstName,
    lastName,
    driverLicenseNumber,
  }: RentalFormValues) => {
    const rental = {
      carId,
      totalPrice,
      startDate: from,
      endDate: to,
      dropoffLocation,
      pickupLocation,
    };
    const client = {
      dateOfBirth,
      email,
      phone,
      firstName,
      lastName,
      driverLicenseNumber,
    };
    mutate({ rental, client });
  };

  const onDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 text-base font-medium transition-all">
          Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-137.5 h-[90vh] max-h-195 flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {`Book "${carName}"`}
          </DialogTitle>
        </DialogHeader>

        <MapProvider>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-base font-semibold">Personal details</p>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <FormInput
                    control={control}
                    name="firstName"
                    placeholder="Enter your first name"
                    label="First name"
                    error={errors.firstName?.message}
                  />
                  <FormInput
                    control={control}
                    name="lastName"
                    placeholder="Enter your last name"
                    label="Last name"
                    error={errors.lastName?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <FormInput
                    control={control}
                    name="email"
                    placeholder="Enter your email"
                    label="Email"
                    error={errors.email?.message}
                  />
                  <FormInput
                    control={control}
                    name="phone"
                    placeholder="Enter your cell phone"
                    label="Phone"
                    error={errors.phone?.message}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormDateInput
                    control={control}
                    name="dateOfBirth"
                    placeholder="Select date of birth"
                    label="Date of birth"
                    error={errors.dateOfBirth?.message}
                  />
                  <FormInput
                    control={control}
                    name="driverLicenseNumber"
                    placeholder="Enter your license number"
                    label={`Driver's License Number`}
                    error={errors.driverLicenseNumber?.message}
                  />
                </div>
                <Separator />
                <p className="text-base font-semibold">Renting details</p>
                <Controller
                  name="dateRange"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="dateCalendar">
                        Rental date range
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal cursor-pointer hover:bg-background hover:text-accent-foreground"
                            aria-invalid={!!errors.dateRange}
                          >
                            <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                            {field.value?.from && field.value?.to ? (
                              `${format(field.value.from, "PP")} - ${format(field.value.to, "PP")}`
                            ) : (
                              <span
                                className={cn({
                                  "text-muted-foreground": !field.value,
                                })}
                              >
                                Select rental date range
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={{ before: new Date() }}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldError
                        errors={[{ message: errors.dateRange?.message }]}
                      />
                    </Field>
                  )}
                />
                <RentalLocationsSection />
                {totalDays > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border text-sm">
                    <span>
                      {totalDays} {totalDays === 1 ? "day" : "days"} ×{" "}
                      {pricePerDay} usd
                    </span>
                    <span className="text-lg font-semibold">
                      {"In total:"} {totalPrice.toLocaleString()} USD
                    </span>
                  </div>
                )}
              </div>
              <DialogFooter className="p-6 pt-4 border-t bg-background">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                >
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </MapProvider>
      </DialogContent>
    </Dialog>
  );
}
