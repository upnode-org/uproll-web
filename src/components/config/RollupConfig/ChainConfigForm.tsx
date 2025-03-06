"use client";
import React from "react";
import { InputField } from "./Components/InputField";

export const ChainConfigForm: React.FC = () => {
  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Chain Configuration</legend>
      <InputField
        label="L2 Chain ID"
        type="number"
        name="chain_config.l2_chain_id"
      />
      <InputField
        label="L2 Block Time"
        type="number"
        name="chain_config.l2_block_time"
      />
      <InputField
        label="Proof Maturity Delay Seconds"
        type="number"
        name="chain_config.proof_maturity_delay_seconds"
      />
      <InputField
        label="Dispute Game Finality Delay Seconds"
        type="number"
        name="chain_config.disputeGameFinalityDelaySeconds"
      />
      <InputField
        label="Fee Recipient"
        name="chain_config.fee_recipient"
      />
      <InputField
        label="Withdrawal Network"
        name="chain_config.withdrawal_network"
      />
    </fieldset>
  );
};
