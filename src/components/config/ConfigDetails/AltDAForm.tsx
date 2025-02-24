"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AltDAForm() {
  const { register, formState: { errors } } = useFormContext<Config>();

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Commitment Type</Label>
          <Input
            {...register("optimism_package.altda_deploy_config.da_commitment_type")}
          />
        </div>
        <div>
          <Label>Challenge Window</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_challenge_window", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>Resolve Window</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_resolve_window", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>Bond Size</Label>
          <Input
            type="number"
            {...register("optimism_package.altda_deploy_config.da_bond_size", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <Label>Resolver Refund Percentage</Label>
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