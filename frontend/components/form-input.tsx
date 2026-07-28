import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface FormControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  error?: string;
}

const FormControllerInput = <T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  error,
}: FormControllerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            id={name}
            autoComplete="off"
            placeholder={placeholder}
            aria-invalid={!!error}
          />
          <FieldError errors={[{ message: error }]} />
        </Field>
      )}
    />
  );
};

export default FormControllerInput;
