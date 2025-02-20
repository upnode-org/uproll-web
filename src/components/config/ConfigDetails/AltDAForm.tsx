"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import defaultConfig from "@/const/defaultConfig";
export default function AltDAForm() {
  const { register, watch, setValue } = useFormContext<Config>();
  const useAltDa = watch("optimism_package.altda_deploy_config.use_altda", defaultConfig.optimism_package.altda_deploy_config.use_altda);

  return (
    <div className="space-y-4 p-4">
      

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={useAltDa}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              setValue("optimism_package.altda_deploy_config.use_altda", checked);
            }
          }}
        />
        <Label>Use AltDA</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>DA Commitment Type</Label>
          <Input
            {...register("optimism_package.altda_deploy_config.da_commitment_type")}
          />
        </div>
        <div>
          <Label>DA Challenge Window</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_challenge_window", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>DA Resolve Window</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_resolve_window", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>DA Bond Size</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_bond_size", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>DA Resolver Refund Percentage</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_resolver_refund_percentage", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>
    </div>
  );
}