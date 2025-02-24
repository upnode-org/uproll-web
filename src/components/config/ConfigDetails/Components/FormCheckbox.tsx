import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Config } from "@/lib/configSchema";
import { FieldPathByValue, useFormContext } from "react-hook-form";

type CheckboxProps = {
    watchName: FieldPathByValue<Config, boolean | undefined>;
    label?: string;
}

export default function FormCheckbox({watchName, label}: CheckboxProps) {
    const { watch, setValue } = useFormContext<Config>();
    const useValue = watch(watchName);

    return (
        <div className={`flex items-center space-x-2 ${label ? "pt-5" : ""}`}>
            <Checkbox
                id={watchName}
                checked={useValue}
                onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                        setValue(watchName, checked);
                    }
                }}
            />
            {label && <Label htmlFor={watchName}>{label}</Label>}
        </div>
    )
}
