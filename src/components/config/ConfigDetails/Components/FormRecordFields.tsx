"use client";
import { useFormContext, useFieldArray, FieldPathByValue, FieldError } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Config, Record } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import FormInput from "./FormInput";
import get from "lodash.get";
import ErrorMessage from "./ErrorMessage";

type FormRecordFieldProps = {
  label: string;
  fieldArrayName: FieldPathByValue<Config, Record>;
  buttonText?: string;
};

export default function FormRecordField({
  label,
  fieldArrayName,
  buttonText = "Add",
}: FormRecordFieldProps) {
  const { control, formState: { errors } } = useFormContext<Config>();
  const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

  // Retrieve error for the entire field array.
  const arrayError = get(errors, fieldArrayName);

  return (
    <div className="w-full col-span-2">
      <div className="flex items-center justify-between space-x-2 mb-2">
        <Label>{label}</Label>
        <Button type="button" onClick={() => append({ value: "", key: "" })}>
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2 mb-2 bg-stone-50 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold">Node Selector {index + 1}</h5>
            <Button variant="outline" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FormInput
              label="Key"
              name={`${fieldArrayName}.${index}.key` as FieldPathByValue<Config, string>}
            />
            <span className="text-center w-4 mt-5">:</span>
            <FormInput
              label="Value"
              name={`${fieldArrayName}.${index}.value` as FieldPathByValue<Config, string>}
            />
          </div>
        </div>
      ))}
      {arrayError &&
        !Array.isArray(arrayError) &&
        "message" in arrayError && (
          <ErrorMessage error={arrayError as FieldError} />
        )}
    </div>
  );
}
