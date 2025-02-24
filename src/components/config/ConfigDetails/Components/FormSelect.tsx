import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldPathByValue, useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";

type FormSelectProps<T extends string> = {
  label?: string;
  watchName: FieldPathByValue<Config, T | undefined>;
  options: readonly T[];
};

export default function FormSelect<T extends string>({
  label,
  watchName,
  options,
}: FormSelectProps<T>) {
  const { watch, setValue } = useFormContext<Config>();

  const watchedValue = watch(watchName) as T | undefined;

  return (
    <div>
      {label && <Label htmlFor={String(watchName)}>{label}</Label>}
      <Select
        value={watchedValue as string}
        onValueChange={(value) => {
          // ignore the type error, it's fine. Works as expected.
          // @ts-ignore
          setValue(watchName, value as T);
        }}
      >
        <SelectTrigger id={String(watchName)}
        >
          <SelectValue placeholder={`Select ${label?.toLowerCase() || "option"}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={watchName + "-" + option} value={option as string}>
              {option as string}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}