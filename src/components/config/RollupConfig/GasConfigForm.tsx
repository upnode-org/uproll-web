"use client";
import React from "react";
import { InputField } from "./Components/InputField";

export const GasConfigForm: React.FC = () => {

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Gas Configuration</legend>
      <InputField
        label="L2 Genesis Block Gas Limit"
        name="gas_config.l2_genesis_block_gas_limit"
      />
      <InputField
        label="EIP 1559 Elasticity"
        name="gas_config.eip1559_elasticity"
      />
      <InputField
        label="EIP 1559 Denominator"
        name="gas_config.eip1559_denominator"
      />
      <InputField
        label="EIP 1559 Denominator Canyon"
        name="gas_config.eip1559_denominator_canyon"
      />
      <InputField
        label="Gas Price Oracle Base Fee Scalar"
        name="gas_config.gas_price_oracle_base_fee_scalar"
      />
      <InputField
        label="Gas Price Oracle Blob Base Fee Scalar"
        name="gas_config.gas_price_oracle_blob_base_fee_scalar"
      />
    </fieldset>
  );
};
