"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldPathByValue, useFormContext } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";
import { RollupConfig } from "@/lib/opSchema";
import defaultRollup from "@/const/defaultRollup";
import get from "lodash.get";
import { isNumberField } from "@/lib/utils";

export type InputFieldProps = {
  label: string;
  name: FieldPathByValue<RollupConfig, string | number | undefined>;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  name
}) => {
  const { register, formState: { errors } } = useFormContext<RollupConfig>();
  if(name === undefined) {
    throw new Error("Name is not defined");
  }

  const fieldType = isNumberField(name) ? 'number' : 'text';
  const errorId = `${name}-error`;
  const defaultPlaceholder = placeholder || get(defaultRollup, name);
  const errorMessage = get(errors, name);
  return (
    <div className="space-y-1 mt-2">
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={name as string}
        type={fieldType}
        placeholder={defaultPlaceholder as string}
        {...register(name, {
          valueAsNumber: fieldType === "number",
        })}
        className={`bg-white ${errorMessage ? "border-red-500" : ""}`}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={!!errorMessage}
      />
      {errorMessage && typeof errorMessage === 'object' && 'message' in errorMessage && (
        <ErrorMessage id={errorId} error={errorMessage.message as string} />
      )}
    </div>
  );
};
