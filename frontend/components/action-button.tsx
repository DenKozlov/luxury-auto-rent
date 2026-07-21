import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVertical } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { MouseEventHandler } from "react";
import ButtonWithSpinner from "./button-with-spinner";

type ButtonVariantType = VariantProps<typeof buttonVariants>["variant"];
interface ActionButtonProps {
  actions: {
    action: string;
    handler: MouseEventHandler<HTMLButtonElement>;
    isLoading: boolean;
  }[];
  variant?: ButtonVariantType;
  isDisabled: boolean;
}

const ActionButton = ({
  actions,
  variant = "ghost",
  isDisabled,
}: ActionButtonProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer"
          disabled={isDisabled}
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="end">
        {actions.map(({ action, handler, isLoading }) => (
          <DropdownMenuItem key={action} className="text-base p-0">
            <ButtonWithSpinner
              className="w-full cursor-pointer"
              variant={variant}
              onClick={handler}
              isLoading={isLoading}
              label={action}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButton;
