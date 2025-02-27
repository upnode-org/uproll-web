 "use client";
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";

export type SignerConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

export const SignerConfigForm: React.FC<SignerConfigFormProps> = ({
  register,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        registration={register("signer_config.deployer_private_key")}
        error={errors.signer_config?.deployer_private_key?.message as string}
      />
      <InputField
        label="Batcher Private Key or Signer Endpoint"
        registration={register("signer_config.batcher_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.batcher_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Sequencer Private Key or Signer Endpoint"
        registration={register("signer_config.sequencer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.sequencer_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Proposer Private Key or Signer Endpoint"
        registration={register("signer_config.proposer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.proposer_private_key_or_signer_endpoint?.message as string
        }
      />
    </fieldset>
  );
};
