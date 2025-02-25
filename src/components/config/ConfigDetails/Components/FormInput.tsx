"use client";
import React from "react";
import {
  FieldError,
  FieldPathByValue,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import get from "lodash.get";
import ErrorMessage from "./ErrorMessage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Config } from "@/lib/configSchema";

interface FormInputProps<T extends string | number> {
  label?: string;
  type?: string;
  name: FieldPathByValue<Config, T>;
  registerOptions?: RegisterOptions<Config, FieldPathByValue<Config, T>>;
}

const FormInput = <T extends string | number>({
  label,
  type = "text",
  name,
  registerOptions = {},
}: FormInputProps<T>) => {
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
    <div className="w-full">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        type={type}
        {...register(
          name,
          finalRegisterOptions as RegisterOptions<Config, FieldPathByValue<Config, T>>
        )}
        className="w-full bg-white"
      />
      {fieldError && <ErrorMessage error={fieldError as FieldError} />}
    </div>
  );
};

export default FormInput;
