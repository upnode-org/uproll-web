"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function OpContractDeployerForm() {
  const { register } = useFormContext<Config>();

  return (
    <div className="space-y-4 border p-4 rounded">
      <h3 className="text-xl font-bold">OP Contract Deployer</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Image</Label>
          <Input
            {...register("optimism_package.op_contract_deployer_params.image")}
          />
        </div>
        <div>
          <Label>L1 Artifacts Locator</Label>
          <Input
            {...register("optimism_package.op_contract_deployer_params.l1_artifacts_locator")}
          />
        </div>
        <div>
          <Label>L2 Artifacts Locator</Label>
          <Input
            {...register("optimism_package.op_contract_deployer_params.l2_artifacts_locator")}
          />
        </div>
      </div>
    </div>
  );
}