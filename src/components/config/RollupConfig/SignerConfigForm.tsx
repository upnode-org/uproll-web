"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
export const SignerConfigForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<RollupConfig>();

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        registration={register("signer_config.deployer_private_key")}
        error={errors.signer_config?.deployer_private_key?.message as string}
      />
      <Tabs defaultValue="Private Key" onValueChange={(value) => {
        console.log(value);
      }}>
        <TabsList className="my-4 w-full">
          <TabsTrigger className="w-full" value="Private Key">
            Private Key
          </TabsTrigger>
          <TabsTrigger className="w-full" value="Signer Endpoint">
            Signer Endpoint
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Private Key">
        <InputField
        label="Batcher Private Key"
        registration={register("signer_config.batcher_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.batcher_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Sequencer Private Key"
        registration={register("signer_config.sequencer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.sequencer_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Proposer Private Key"
        registration={register("signer_config.proposer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.proposer_private_key_or_signer_endpoint?.message as string
        }
      />
        </TabsContent>
        <TabsContent value="Signer Endpoint">
          <InputField
            label="Batcher Signer Endpoint"
            registration={register("signer_config.batcher_private_key_or_signer_endpoint")}
            error={errors.signer_config?.batcher_private_key_or_signer_endpoint?.message as string}
          />
          <InputField
            label="Sequencer Signer Endpoint"
            registration={register("signer_config.sequencer_private_key_or_signer_endpoint")}
            error={errors.signer_config?.sequencer_private_key_or_signer_endpoint?.message as string}
          />
          <InputField
            label="Proposer Signer Endpoint"
            registration={register("signer_config.proposer_private_key_or_signer_endpoint")}
            error={errors.signer_config?.proposer_private_key_or_signer_endpoint?.message as string}
          />
        </TabsContent>
      </Tabs>
    </fieldset>
  );
};
