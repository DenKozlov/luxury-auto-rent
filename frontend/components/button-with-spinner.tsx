import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type ButtonProps = React.ComponentProps<typeof Button>;
interface ButtonWithSpinnerProps extends ButtonProps {
  isLoading: boolean;
  label: string;
}

const ButtonWithSpinner = ({
  isLoading,
  label,
  type,
  variant,
  ...rest
}: ButtonWithSpinnerProps) => (
  <Button type={type} variant={variant} className="gap-2" {...rest}>
    {isLoading && <Spinner />} {label}
  </Button>
);

export default ButtonWithSpinner;
