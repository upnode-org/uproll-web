"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";
import { RollupConfig } from "@/lib/opSchema";

export type InputFieldProps = {
  label: string;
  type?: string;
  registration: ReturnType<UseFormRegister<RollupConfig>>;
  error?: string;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  registration,
  error,
  placeholder,
}) => {
  const errorId = `${registration.name}-error`;
  return (
    <div className="space-y-1 mt-2">
      <Label
        htmlFor={registration.name as string}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={registration.name as string}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`bg-white ${error ? "border-red-500" : ""}`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
      />
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};
