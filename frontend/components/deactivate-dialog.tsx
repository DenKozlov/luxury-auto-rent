import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getExpiryDate } from "@/lib/utils";
import { format } from "date-fns";
import { Spinner } from "./ui/spinner";
import { UseMutateFunction } from "@tanstack/react-query";

const DeactivateDialog = ({
  onDeactivate,
  isPending,
}: {
  onDeactivate: UseMutateFunction;
  isPending: boolean;
}) => {
  const expiryDate = getExpiryDate(30);
  const formattedDate = format(expiryDate, "PPP");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Deactivate account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deactivate account</DialogTitle>
          <DialogDescription>
            Your account will be deactivated and you will lose access to login.
            You can reactivate your account until
            <span className="font-bold">{formattedDate}</span>. After that, it
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="cursor-pointer" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer gap-2 bg-red-600 hover:bg-red-700"
            onClick={() => onDeactivate()}
          >
            {isPending && <Spinner />} Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateDialog;
