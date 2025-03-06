"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
export const SignerConfigForm: React.FC = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<RollupConfig>();

  const signerType = watch("signer_config.type");

  console.log(signerType);

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        registration={register("signer_config.deployer_private_key")}
        error={errors.signer_config?.deployer_private_key?.message as string}
      />
      <Tabs defaultValue={signerType} onValueChange={(value) => {
        setValue("signer_config.type", value as "private_key" | "signer_endpoint");
      }}>
        <TabsList className="my-4 w-full">
          <TabsTrigger className="w-full" value="private_key">
            Private Key
          </TabsTrigger>
          <TabsTrigger className="w-full" value="signer_endpoint">
            Signer Endpoint
          </TabsTrigger>
        </TabsList>
        <TabsContent value="private_key">
        <InputField
        label="Batcher Private Key"
        registration={register("signer_config.batcher_value")}
        error={
          errors.signer_config?.batcher_value?.message as string
        }
      />
      <InputField
        label="Sequencer Private Key"
        registration={register("signer_config.sequencer_value")}
        error={
          errors.signer_config?.sequencer_value?.message as string
        }
      />
      <InputField
        label="Proposer Private Key"
        registration={register("signer_config.proposer_value")}
        error={
          errors.signer_config?.proposer_value?.message as string
        }
      />
        </TabsContent>
        <TabsContent value="signer_endpoint">
          <InputField
            label="Batcher Signer Endpoint"
            registration={register("signer_config.batcher_value")}
            error={errors.signer_config?.batcher_value?.message as string}
          />
          <InputField
            label="Sequencer Signer Endpoint"
            registration={register("signer_config.sequencer_value")}
            error={errors.signer_config?.sequencer_value?.message as string}
          />
          <InputField
            label="Proposer Signer Endpoint"
            registration={register("signer_config.proposer_value")}
            error={errors.signer_config?.proposer_value?.message as string}
          />
        </TabsContent>
      </Tabs>
    </fieldset>
  );
};
