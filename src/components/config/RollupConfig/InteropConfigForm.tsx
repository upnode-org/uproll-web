"use client";
import React from "react";
import { useWatch, useFieldArray, useFormContext } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { InputField } from "./Components/InputField";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const InteropConfigForm: React.FC = () => {
  const { register, setValue, control } = useFormContext<RollupConfig>();

  const enableInterop = useWatch({
    control,
    name: "interop_config.enable_interop",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "interop_config.dependency_set",
  });

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Interop Configuration</legend>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="enable-interop"
          {...register("interop_config.enable_interop")}
          checked={enableInterop}
          onCheckedChange={(checked) => {
            setValue("interop_config.enable_interop", checked === true);
          }}
        />
        <Label htmlFor="enable-interop">Enable Interop</Label>
      </div>

      {enableInterop && (
        <div className="space-y-4">
          <div className="flex items-center">
            <h4 className="text-md font-semibold mr-2">Dependency Set</h4>
            <Button
              type="button"
              onClick={() =>
                append({
                  chain_id: "",
                  websocket_rpc_endpoint: "",
                  activation_time: "",
                  history_min_time: "",
                })
              }
              className="p-0.5 rounded-full"
              size={null}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <InteropConfig index={index} remove={remove} />
              {index < fields.length - 1 && (
                <div className="border-t border-gray-300 my-4"></div>
              )}
            </React.Fragment>
          ))}

          {fields.length === 0 && enableInterop && (
            <div className="text-center py-4 text-gray-500">
              No dependencies added. Click the + button to add a dependency.
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
};

type InteropConfigFormProps = {
  index: number;
  remove: (index: number) => void;
};


const InteropConfig: React.FC<InteropConfigFormProps> = ({
  index,
  remove,
}) => {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium">Dependency {index + 1}</h5>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
          className="h-7 px-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <InputField
        label="Chain ID"
        name={`interop_config.dependency_set.${index}.chain_id`}
      />

      <InputField
        label="WebSocket RPC Endpoint"
        name={`interop_config.dependency_set.${index}.websocket_rpc_endpoint`}
      />

      <InputField
        label="Activation Time"
        name={`interop_config.dependency_set.${index}.activation_time`}
      />

      <InputField
        label="History Min Time"
        name={`interop_config.dependency_set.${index}.history_min_time`}
      />
    </div>
  )
};
