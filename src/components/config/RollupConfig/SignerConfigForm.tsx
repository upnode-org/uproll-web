"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
export const SignerConfigForm: React.FC = () => {
  const { watch, setValue } = useFormContext<RollupConfig>();

  const signerType = watch("signer_config.type");

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        name="signer_config.deployer_private_key"
      />
      <Tabs defaultValue={signerType} onValueChange={(value) => {
        setValue("signer_config.type", value as "private_key" | "signer_endpoint");
      }}>
        <TabsList className="mt-4 w-full">
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
            name="signer_config.batcher_value"
          />
          <InputField
            label="Sequencer Private Key"
            name="signer_config.sequencer_value"
          />
          <InputField
            label="Proposer Private Key"
            name="signer_config.proposer_value"
          />
        </TabsContent>
        {/* TODO: Add address for each signer endpoint */}
        <TabsContent value="signer_endpoint">
          <InputField
            label="Batcher Signer Endpoint"
            name="signer_config.batcher_value"
          />
          <InputField
            label="Sequencer Signer Endpoint"
            name="signer_config.sequencer_value"
          />
          <InputField
            label="Proposer Signer Endpoint"
            name="signer_config.proposer_value"
          />
        </TabsContent>
      </Tabs>
    </fieldset>
  );
};
