import { Office } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const OfficeMapInfo = ({
  selectedOffice,
  setSelectedOffice,
}: {
  selectedOffice: Office;
  setSelectedOffice: Dispatch<SetStateAction<Office | null>>;
}) => {
  const { name, photoUrl, workingHours } = selectedOffice;
  return (
    <div className="absolute bottom-6 left-6 w-72 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-white z-50 animate-in fade-in slide-in-from-bottom-4">
      {photoUrl && (
        <div className="relative h-36 w-full">
          <Image src={photoUrl} alt={name} fill />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between  items-center">
          <h3 className="font-semibold text-sm tracking-wide">{name}</h3>
          <Button
            variant="ghost"
            onClick={() => setSelectedOffice(null)}
            className="text-zinc-400 hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded-full cursor-pointer"
          >
            <X />
          </Button>
        </div>
        <p className="text-zinc-400 text-sm mt-2 flex items-center gap-1.5">
          <span>🕒</span> {workingHours}
        </p>
      </div>
    </div>
  );
};

export default OfficeMapInfo;
