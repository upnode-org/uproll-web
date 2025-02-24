"use client";
import React from "react";
import { FieldError, FieldPath, FieldPathByValue, useFormContext } from "react-hook-form";
import get from "lodash.get";
import ErrorMessage from "./ErrorMessage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Config } from "@/lib/configSchema";

interface FormInputProps {
  label: string;
  type?: string;
  name: FieldPathByValue<Config, number | string>;
  registerOptions?: Record<string, any>;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  name,
  registerOptions = {},
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Config>();

  // Automatically add valueAsNumber if type is "number"
  const finalRegisterOptions =
    type === "number"
      ? { valueAsNumber: true, ...registerOptions }
      : registerOptions;

  // Extract nested error using lodash.get
  const fieldError = get(errors, name);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <Input type={type} {...register(name)} />
      {fieldError && <ErrorMessage error={fieldError as FieldError} />}
    </div>
  );
};

export default FormInput;
