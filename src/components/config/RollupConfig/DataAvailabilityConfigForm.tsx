"use client";
import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { RollupConfig, DA_PROVIDER_SYSTEM_VALUES, DA_PROVIDER_DISPLAY_NAMES } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { SelectField } from "./Components/SelectField";

export const DataAvailabilityConfigForm: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<RollupConfig>();

  const dataAvailabilityProvider = useWatch({
    control,
    name: "data_availability_config.data_availability_provider",
  });

  const commitmentType = useWatch({
    control,
    name: "data_availability_config.commitment_type",
  });

  // Helper function to safely access nested error messages
  const getErrorMessage = (path: string): string | undefined => {
    type NestedRecord = Record<string, unknown | { message?: string }>;
    let current: NestedRecord | undefined = errors as unknown as NestedRecord;
    for (const key of path.split('.')) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key] as NestedRecord;
      } else {
        return undefined;
      }
    }
    return (current as { message?: string })?.message;
  };

  // Create options for the select field
  const daProviderOptions = [
    ...Object.entries(DA_PROVIDER_DISPLAY_NAMES).map(([value, label]) => ({
      label,
      value,
    })),
  ];

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Data Availability Configuration</legend>
      
      <SelectField
        label="Data Availability Provider"
        options={daProviderOptions}
        control={control}
        name="data_availability_config.data_availability_provider"
        error={getErrorMessage("data_availability_config.data_availability_provider")}
      />
      
      <InputField
        label="Batch Submission Frequency (minutes)"
        type="number"
        registration={register("data_availability_config.batch_submission_frequency", {
          valueAsNumber: true,
        })}
        error={getErrorMessage("data_availability_config.batch_submission_frequency")}
      />
      
      {dataAvailabilityProvider === DA_PROVIDER_SYSTEM_VALUES.CUSTOM && (
        <>
          <InputField
            label="DA Server Endpoint"
            registration={register("data_availability_config.da_server_endpoint")}
            error={getErrorMessage("data_availability_config.da_server_endpoint")}
          />
          
          <SelectField
            label="Commitment Type"
            options={[
              { label: "Generic", value: "Generic" },
              { label: "Keccak256", value: "Keccak256" },
            ]}
            control={control}
            name="data_availability_config.commitment_type"
            error={getErrorMessage("data_availability_config.commitment_type")}
          />
          
          {commitmentType === "Generic" && (
            <InputField
              label="DA Challenge Contract Address"
              registration={register("data_availability_config.da_challenge_contract_address")}
              error={getErrorMessage("data_availability_config.da_challenge_contract_address")}
            />
          )}
          
          <InputField
            label="DA Challenge Window"
            registration={register("data_availability_config.da_challenge_window")}
            error={getErrorMessage("data_availability_config.da_challenge_window")}
          />
          
          <InputField
            label="DA Resolve Window"
            registration={register("data_availability_config.da_resolve_window")}
            error={getErrorMessage("data_availability_config.da_resolve_window")}
          />
        </>
      )}
    </fieldset>
  );
}; 