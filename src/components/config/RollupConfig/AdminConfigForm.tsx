"use client";
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";

export type AdminConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

export const AdminConfigForm: React.FC<AdminConfigFormProps> = ({
  register,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Admin Configuration</legend>
      <InputField
        label="Final System Owner (L1 System Admin)"
        registration={register("admin_config.final_system_owner")}
        error={errors.admin_config?.final_system_owner?.message as string}
      />
      <InputField
        label="Proxy Admin Owner (L2 Proxy Admin)"
        registration={register("admin_config.proxy_admin_owner")}
        error={errors.admin_config?.proxy_admin_owner?.message as string}
      />
    </fieldset>
  );
};
