"use client";
import React from "react";
import { Controller, Control } from "react-hook-form";
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
  control: Control<RollupConfig>;
  name: string;
  error?: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
}) => {
  const errorId = `${name}-error`;
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
            defaultValue={field.value as string}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
          >
            <SelectTrigger className={`bg-white ${error ? "border-red-500" : ""}`}>
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
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};
