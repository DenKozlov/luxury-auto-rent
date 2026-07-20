"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ImageUploader = ({
  currentImage,
  value,
  onChange,
}: {
  currentImage?: string | null;
  value?: File | null;
  onChange: (file: File | null) => void;
}) => {
  const preview = value ? URL.createObjectURL(value) : currentImage;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={preview || ""} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <Button
        type="button"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
      >
        Update image
      </Button>
    </div>
  );
};

export default ImageUploader;
