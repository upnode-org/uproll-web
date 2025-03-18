"use client";
import React from "react";
import { Controller, get, useFormContext, FieldPath } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage } from "./ErrorMessage";
import { RollupConfig } from "@/lib/opSchema";

export type Option = { label: string; value: string };

export type SelectFieldProps = {
  label: string;
  options: Option[];
  name: FieldPath<RollupConfig>;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  name,
}) => {
  if(name === undefined) {
    throw new Error("Name is undefined");
  }

  const { control, formState: { errors } } = useFormContext<RollupConfig>();

  const errorId = `${name}-error`;
  const errorMessage = get(errors, name);
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Controller
        control={control}
        name={name as keyof RollupConfig}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            defaultValue={field.value as string || options[0].value}
            aria-describedby={errorMessage ? errorId : undefined}
            aria-invalid={!!errorMessage}
          >
            <SelectTrigger className={`bg-white ${errorMessage ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage && typeof errorMessage === 'object' && 'message' in errorMessage ? (
        <ErrorMessage id={errorId} error={errorMessage.message as string} />
      ) : null}
      {
        errorMessage && typeof errorMessage === 'string' ? (
          <ErrorMessage id={errorId} error={errorMessage} />
        ) : null
      }
    </div>
  );
};
