import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface ButtonWithSpinnerProps {
  isLoading: boolean;
  label: string;
}

const ButtonWithSpinner = ({ isLoading, label }: ButtonWithSpinnerProps) => (
  <Button type="submit" className="gap-2">
    {isLoading && <Spinner />} {label}
  </Button>
);

export default ButtonWithSpinner;
