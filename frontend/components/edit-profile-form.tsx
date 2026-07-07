"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "better-auth";
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
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUploader from "./image-uploader";
import { usersService } from "@/services/users.service";

const formSchema = z.object({
  name: z.string().min(6).max(50),
  image: z
    .file()
    .optional()
    .refine((file) => !file || file.size < 5000000, "Max size 5MB"),
});

type EditFormValues = z.infer<typeof formSchema>;

export function ProfileEditDialog({ user }: { user: User }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user.name || "" },
  });

  const onSubmit = async (values: EditFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.image instanceof File) {
        formData.append("file", values.image);
      }
      await usersService.updateMe(formData);
      toast.success("Profile has been updated", { position: "top-right" });
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      toast.error("Profile update failed. Please try again", {
        position: "top-right",
      });
      console.error(error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
      <Dialog open={isEditing} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <Field>
                  <ImageUploader {...field} currentImage={user.image} />
                  <FieldDescription className="text-red-500">
                    {errors.image?.message}
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    autoComplete="off"
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.name}
                  />
                  <FieldDescription className="text-red-500">
                    {errors.name?.message}
                  </FieldDescription>
                </Field>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="gap-2">
                {isSubmitting && <Spinner />} Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
