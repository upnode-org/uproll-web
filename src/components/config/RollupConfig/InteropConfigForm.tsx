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
  const { register, setValue, control, formState: { errors } } = useFormContext<RollupConfig>();

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
          <div className="flex justify-between items-center">
            <h4 className="text-md font-semibold">Dependency Set</h4>
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
              className="p-1 rounded-full"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 p-3 rounded-md">
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
                registration={register(`interop_config.dependency_set.${index}.chain_id` as const)}
                error={errors.interop_config?.dependency_set?.[index]?.chain_id?.message as string}
              />
              
              <InputField
                label="WebSocket RPC Endpoint"
                registration={register(`interop_config.dependency_set.${index}.websocket_rpc_endpoint` as const)}
                error={errors.interop_config?.dependency_set?.[index]?.websocket_rpc_endpoint?.message as string}
              />
              
              <InputField
                label="Activation Time"
                registration={register(`interop_config.dependency_set.${index}.activation_time` as const)}
                error={errors.interop_config?.dependency_set?.[index]?.activation_time?.message as string}
              />
              
              <InputField
                label="History Min Time"
                registration={register(`interop_config.dependency_set.${index}.history_min_time` as const)}
                error={errors.interop_config?.dependency_set?.[index]?.history_min_time?.message as string}
              />
            </div>
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