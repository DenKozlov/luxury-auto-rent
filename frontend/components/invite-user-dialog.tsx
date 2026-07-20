import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ButtonWithSpinner from "./button-with-spinner";
import { UseMutateFunction } from "@tanstack/react-query";
import { Invitation } from "@/types";
import { InviteFormValues } from "@/schemas/invite-schema";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormReset,
} from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

interface InviteUserDialogProps {
  isPending: boolean;
  isInviting: boolean;
  mutate: UseMutateFunction<Invitation, Error, InviteFormValues, unknown>;
  reset: UseFormReset<InviteFormValues>;
  setIsInviting: Dispatch<SetStateAction<boolean>>;
  control: Control<InviteFormValues, unknown, InviteFormValues>;
  handleSubmit: UseFormHandleSubmit<InviteFormValues, InviteFormValues>;
  errors: FieldErrors<InviteFormValues>;
  roles: {
    label: string;
    value: string;
  }[];
}

const InviteUserDialog = ({
  mutate,
  isPending,
  reset,
  isInviting,
  setIsInviting,
  control,
  handleSubmit,
  errors,
  roles,
}: InviteUserDialogProps) => {
  const onSubmit = (values: InviteFormValues) => {
    mutate(values);
  };

  const handleCancel = () => {
    reset();
    setIsInviting(false);
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setIsInviting(true)}>
        Invite user
      </Button>
      <Dialog open={isInviting} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Add email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    autoComplete="off"
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.email}
                  />
                  <FieldDescription className="text-red-500">
                    {errors.email?.message}
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Select role</FieldLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={roles.length < 2}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <ButtonWithSpinner
                type="submit"
                isLoading={isPending}
                label="Send invitation"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteUserDialog;
