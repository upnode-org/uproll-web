"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import defaultConfig from "@/const/defaultConfig";
export default function InteropForm() {
  const { register, watch, setValue } = useFormContext<Config>();
  const useInterop = watch("optimism_package.interop.enabled", defaultConfig.optimism_package.interop.enabled);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Supervisor Params</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Image</Label>
            <Input
              {...register("optimism_package.interop.supervisor_params.image")}
            />
          </div>
          <div>
            <Label>Dependency Set</Label>
            <Input
              {...register("optimism_package.interop.supervisor_params.dependency_set")}
            />
          </div>
          <div className="col-span-2">
            <Label>Extra Params</Label>
            <Textarea
              {...register("optimism_package.interop.supervisor_params.extra_params")}
              placeholder="Enter JSON array"
            />
          </div>
        </div>
      </div>
    </div>
  );
}