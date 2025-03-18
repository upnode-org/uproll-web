"use client";
import React from "react";
import { InputField } from "./Components/InputField";

export const ChainConfigForm: React.FC = () => {
  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Chain Configuration</legend>
      <InputField
        label="L2 Chain ID"
        name="chain_config.l2_chain_id"
      />
      <InputField
        label="L2 Block Time"
        name="chain_config.l2_block_time"
      />
      <InputField
        label="Proof Maturity Delay (Seconds)"
        name="chain_config.proof_maturity_delay_seconds"
      />
      <InputField
        label="Dispute Game Finality Delay (Seconds)"
        name="chain_config.dispute_game_finality_delay"
      />
      {/* <InputField
        label="Fee Recipient Address"
        name="chain_config.fee_recipient"
      /> */}
      <InputField
        label="Fee Withdrawal Network Address"
        name="chain_config.fee_withdrawal_network"
      />
    </fieldset>
  );
};
