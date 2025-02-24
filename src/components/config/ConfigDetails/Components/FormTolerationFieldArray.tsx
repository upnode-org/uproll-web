import { useFormContext, useFieldArray, FieldArrayPath, FieldPathByValue, FieldArrayPathValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Config, EFFECT_TYPES, OPERATOR_TYPES } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import defaultToleration from "@/const/defaultToleration";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
type FormFieldArrayProps = {
    label: string;
    fieldArrayName: FieldArrayPath<Config>;
    buttonText?: string;
};

export default function FormTolerationFieldArray({
    label,
    fieldArrayName,
    buttonText = "Add",
}: FormFieldArrayProps) {
    const { control } = useFormContext<Config>();
    const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

    return (
        <div className="w-full col-span-2">
            <div className="flex items-center justify-between space-x-2 mb-2">
                <Label>{label}</Label>
                <Button type="button" onClick={() => append(defaultToleration)}>
                    <Plus className="h-4 w-4" />
                    {buttonText}
                </Button>
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 mb-2 bg-stone-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                        <h5 className="font-semibold">Toleration {index + 1}</h5>
                        <Button variant="outline" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <FormInput
                        label="Key"
                        name={`${fieldArrayName}.${index}.key` as FieldPathByValue<Config, string>}
                    />
                    <FormSelect
                        label="Operator"
                        watchName={`${fieldArrayName}.${index}.operator` as FieldPathByValue<Config, string>}
                        options={OPERATOR_TYPES}
                    />
                    <FormSelect
                        label="Effect"
                        watchName={`${fieldArrayName}.${index}.effect` as FieldPathByValue<Config, string>}
                        options={EFFECT_TYPES}
                    />
                    <FormInput 
                        label="Value"
                        name={`${fieldArrayName}.${index}.value` as FieldPathByValue<Config, string>}
                    />
                    <FormInput
                        label="Toleration Seconds"
                        name={`${fieldArrayName}.${index}.toleration_seconds` as FieldPathByValue<Config, number>}
                        type="number"
                    />
                </div>
            ))}
        </div>
    );
}