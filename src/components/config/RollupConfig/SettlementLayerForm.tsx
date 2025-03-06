"use client";
import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { SquareButtonSelector } from "./Components/SquareButtonSelector";
import { InputField } from "./Components/InputField";

export const SettlementLayerForm: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<RollupConfig>();


  const selectedNetwork = useWatch({
    control,
    name: "settlement_layer.selection",
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
          <InputField
            label="L1 Block Time"
            name="settlement_layer.l1_block_time"
          />
        </>
      )}
      <InputField
        label="Settlement RPC"
        name="settlement_layer.settlement_rpc"
      />
    </fieldset>
  );
};
