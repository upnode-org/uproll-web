"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";

export const ChainConfigForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<RollupConfig>();

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Chain Configuration</legend>
      <InputField
        label="L2 Chain ID"
        registration={register("chain_config.l2_chain_id")}
        error={errors.chain_config?.l2_chain_id?.message as string}
      />
      <InputField
        label="L2 Block Time"
        registration={register("chain_config.l2_block_time")}
        error={errors.chain_config?.l2_block_time?.message as string}
      />
      <InputField
        label="Proof Maturity Delay Seconds"
        type="number"
        registration={register("chain_config.proof_maturity_delay_seconds", {
          valueAsNumber: true,
        })}
        error={errors.chain_config?.proof_maturity_delay_seconds?.message as string}
      />
      <InputField
        label="Dispute Game Finality Delay Seconds"
        type="number"
        registration={register("chain_config.disputeGameFinalityDelaySeconds", {
          valueAsNumber: true,
        })}
        error={errors.chain_config?.disputeGameFinalityDelaySeconds?.message as string}
      />
      <InputField
        label="Base Fee Vault Recipient"
        registration={register("chain_config.base_fee_vault_recipient")}
        error={errors.chain_config?.base_fee_vault_recipient?.message as string}
      />
      <InputField
        label="L1 Fee Vault Recipient"
        registration={register("chain_config.l1_fee_vault_recipient")}
        error={errors.chain_config?.l1_fee_vault_recipient?.message as string}
      />
      <InputField
        label="Sequencer Fee Vault Recipient"
        registration={register("chain_config.sequencer_fee_vault_recipient")}
        error={errors.chain_config?.sequencer_fee_vault_recipient?.message as string}
      />
      <InputField
        label="Base Fee Vault Withdrawal Network"
        registration={register("chain_config.base_fee_vault_withdrawal_network")}
        error={errors.chain_config?.base_fee_vault_withdrawal_network?.message as string}
      />
      <InputField
        label="L1 Fee Vault Withdrawal Network"
        registration={register("chain_config.l1_fee_vault_withdrawal_network")}
        error={errors.chain_config?.l1_fee_vault_withdrawal_network?.message as string}
      />
      <InputField
        label="Sequencer Fee Vault Withdrawal Network"
        registration={register("chain_config.sequencer_fee_vault_withdrawal_network")}
        error={errors.chain_config?.sequencer_fee_vault_withdrawal_network?.message as string}
      />
    </fieldset>
  );
};
