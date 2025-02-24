"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import FormInputField from "./Components/FormInput";
export default function OpContractDeployerForm() {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInputField 
        name="optimism_package.op_contract_deployer_params.image" 
        label="Image"
        />
        <FormInputField 
        name="optimism_package.op_contract_deployer_params.l1_artifacts_locator" 
        label="L1 Artifacts Locator"
        />
        <FormInputField 
        name="optimism_package.op_contract_deployer_params.l2_artifacts_locator" 
        label="L2 Artifacts Locator"
        />
      </div>
    </div>
  );
}