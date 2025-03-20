"use client";
import React from "react";
import { useWatch, useFormContext, Controller } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { SquareButtonSelector } from "./Components/SquareButtonSelector";
import { InputField } from "./Components/InputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const SettlementLayerForm: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<RollupConfig>();

  const selectedNetwork = useWatch({
    control,
    name: "settlement_layer.selection",
  });

  const useSameRpc = useWatch({
    control,
    name: "settlement_layer.use_same_rpc",
    defaultValue: true,
  });

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Settlement Layer</legend>
      <SquareButtonSelector
        label="Selection"
        options={[
          {
            label: "Etheruem Mainnet",
            value: "ETH Mainnet",
            image: "/pngkey.com-ethereum-png-2645391.png",
            bg: "bg-[#647AEF]",
          },
          {
            label: "Etheruem Sepolia",
            value: "ETH Sepolia",
            image: "/eth-sepolia.png",
            bg: "bg-white",
          },
          {
            label: "Custom Network",
            value: "Custom",
            image: "/custom.png",
            bg: "bg-white",
          },
        ]}
        control={control}
        name="settlement_layer.selection"
        error={errors.settlement_layer?.selection?.message as string}
      />
      {selectedNetwork === "Custom" && (
        <>
          <InputField
            label="Chain ID"
            name="settlement_layer.chain_id"
          />
          {/* <InputField
            label="L1 Block Time"
            name="settlement_layer.l1_block_time"
          /> */}
        </>
      )}

      <div className="flex items-center space-x-2 mt-6 mb-4">
        <Controller
          control={control}
          name="settlement_layer.use_same_rpc"
          defaultValue={true}
          render={({ field }) => (
            <Checkbox
              id="use-same-rpc"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="use-same-rpc" className="text-sm font-medium">
          Use same RPC for both execution and consensus layers
        </Label>
      </div>

      {useSameRpc ? (
        <InputField
          label="Settlement RPC"
          name="settlement_layer.execution_rpc"
        />
      ) : (
        <>
          <InputField
            label="Execution Layer RPC"
            name="settlement_layer.execution_rpc"
            type="text"
          />
          <InputField
            label="Execution Layer WebSocket URL"
            name="settlement_layer.el_ws_url"
            type="text"
          />
          <InputField
            label="Consensus Layer RPC"
            name="settlement_layer.consensus_rpc"
            type="text"
          />
        </>
      )}
    </fieldset>
  );
};
