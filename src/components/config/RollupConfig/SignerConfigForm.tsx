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
      <Tabs
        value={signerType}
        onValueChange={(value) => {
          setValue("signer_config.type", value as "private_key" | "signer_endpoint");
        }}
        className="mt-4"
      >
        <TabsList className="mt-4 mb-2 w-full">
          <TabsTrigger value="private_key" className="w-full">Private Key</TabsTrigger>
          <TabsTrigger value="signer_endpoint" className="w-full">Signer Endpoint</TabsTrigger>
        </TabsList>
        {/* Private Key Tab */}
        <TabsContent value="private_key">
          <InputField
            label="Batcher Private Key"
            name="signer_config.batcher_private_key"
          />
          <InputField
            label="Sequencer Private Key"
            name="signer_config.sequencer_private_key"
          />
          <InputField
            label="Proposer Private Key"
            name="signer_config.proposer_private_key"
          />
          <InputField
            label="Challenger Private Key"
            name="signer_config.challenger_private_key"
          />
        </TabsContent>
        {/* Signer Endpoint Tab */}
        <TabsContent value="signer_endpoint">
          <InputField
            label="Batcher Signer Endpoint"
            name="signer_config.batcher_endpoint"
            placeholder="http://127.0.0.1:4000/key/..."
          />
          <InputField
            label="Batcher Address"
            name="signer_config.batcher_address"
            placeholder="0x..."
          />
          <InputField
            label="Sequencer Signer Endpoint"
            name="signer_config.sequencer_endpoint"
            placeholder="http://127.0.0.1:4000/key/..."
          />
          <InputField
            label="Sequencer Address"
            name="signer_config.sequencer_address"
            placeholder="0x..."
          />
          <InputField
            label="Proposer Signer Endpoint"
            name="signer_config.proposer_endpoint"
            placeholder="http://127.0.0.1:4000/key/..."
          />
          <InputField
            label="Proposer Address"
            name="signer_config.proposer_address"
            placeholder="0x..."
          />
          <InputField
            label="Challenger Signer Endpoint"
            name="signer_config.challenger_endpoint"
            placeholder="http://127.0.0.1:4000/key/..."
          />
          <InputField
            label="Challenger Address"
            name="signer_config.challenger_address"
            placeholder="0x..."
          />
        </TabsContent>
      </Tabs>
    </fieldset>
  );
};
