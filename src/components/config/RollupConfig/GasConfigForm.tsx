 "use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";

export const GasConfigForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<RollupConfig>();

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Gas Configuration</legend>
      <InputField
        label="L2 Genesis Block Gas Limit"
        type="number"
        registration={register("gas_config.l2_genesis_block_gas_limit", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.l2_genesis_block_gas_limit?.message as string}
      />
      <InputField
        label="EIP 1559 Elasticity"
        type="number"
        registration={register("gas_config.eip1559_elasticity", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_elasticity?.message as string}
      />
      <InputField
        label="EIP 1559 Denominator"
        type="number"
        registration={register("gas_config.eip1559_denominator", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_denominator?.message as string}
      />
      <InputField
        label="EIP 1559 Denominator Canyon"
        type="number"
        registration={register("gas_config.eip1559_denominator_canyon", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_denominator_canyon?.message as string}
      />
      <InputField
        label="Gas Price Oracle Base Fee Scalar"
        type="number"
        registration={register("gas_config.gas_price_oracle_base_fee_scalar", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.gas_price_oracle_base_fee_scalar?.message as string}
      />
      <InputField
        label="Gas Price Oracle Blob Base Fee Scalar"
        type="number"
        registration={register("gas_config.gas_price_oracle_blob_base_fee_scalar", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.gas_price_oracle_blob_base_fee_scalar?.message as string}
      />
    </fieldset>
  );
};
