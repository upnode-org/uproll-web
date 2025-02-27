"use client";
import React from "react";
import { useWatch, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { SquareButtonSelector } from "./Components/SquareButtonSelector";
import { InputField } from "./Components/InputField";

export type SettlementLayerFormProps = {
  register: UseFormRegister<RollupConfig>;
  control: Control<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

export const SettlementLayerForm: React.FC<SettlementLayerFormProps> = ({
  register,
  control,
  errors,
}) => {
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
            registration={register("settlement_layer.chain_id")}
            error={errors.settlement_layer?.chain_id?.message as string}
          />
          <InputField
            label="L1 Block Time"
            registration={register("settlement_layer.l1_block_time")}
            error={errors.settlement_layer?.l1_block_time?.message as string}
          />
        </>
      )}
      <InputField
        label="Settlement RPC"
        registration={register("settlement_layer.settlement_rpc")}
        error={errors.settlement_layer?.settlement_rpc?.message as string}
      />
    </fieldset>
  );
};
