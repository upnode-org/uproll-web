"use client";
import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { RollupConfig, DA_PROVIDER_SYSTEM_VALUES, DA_PROVIDER_DISPLAY_NAMES } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { SelectField } from "./Components/SelectField";

export const DataAvailabilityConfigForm: React.FC = () => {
  const { control } = useFormContext<RollupConfig>();

  const dataAvailabilityProvider = useWatch({
    control,
    name: "data_availability_config.data_availability_provider",
  });

  const commitmentType = useWatch({
    control,
    name: "data_availability_config.commitment_type",
  });

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
        name="data_availability_config.data_availability_provider"
      />

      <InputField
        label="Batch Submission Frequency (minutes)"
        name="data_availability_config.batch_submission_frequency"
      />

      {dataAvailabilityProvider === DA_PROVIDER_SYSTEM_VALUES.CUSTOM && (
        <>
          <InputField
            label="Server Endpoint"
            name="data_availability_config.da_server_endpoint"
          />

          <SelectField
            label="Commitment Type"
            options={[
              { label: "Generic", value: "Generic" },
              { label: "KeccakCommitment", value: "KeccakCommitment" },
            ]}
            name="data_availability_config.commitment_type"
          />

          {commitmentType === "Generic" && (
            <InputField
              label="Challenge Contract Address"
              name="data_availability_config.da_challenge_contract_address"
              type="text"
            />
          )}

          <InputField
            label="Challenge Window"
            name="data_availability_config.da_challenge_window"
          />

          <InputField
            label="Resolve Window"
            name="data_availability_config.da_resolve_window"
          />

          <InputField
            label="Bond Size"
            name="data_availability_config.da_bond_size"
          />

          <InputField
            label="Bond Duration"
            name="data_availability_config.da_bond_duration"
          />

          <InputField
            label="Resolver Refund Percentage (%) "
            name="data_availability_config.da_resolver_refund_percentage"
          />
        </>
      )}
    </fieldset>
  );
}; 