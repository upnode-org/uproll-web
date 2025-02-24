"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Button } from "@/components/ui/button";
import ChainItemForm from "./ChainItemForm";
import defaultChain from "@/const/defaultChain";

export default function ChainsForm() {
  const { control } = useFormContext<Config>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "optimism_package.chains",
  });

  return (
    <div className="space-y-4 p-4">
      

      {fields.map((chain, index) => (
        <ChainItemForm
          key={chain.id} 
          chainIndex={index}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        onClick={() => append(defaultChain)}
      >
        Add Chain
      </Button>
    </div>
  );
}