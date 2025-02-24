"use client";
import FormInputField from "./Components/FormInput";

export default function AltDAForm() {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInputField 
        name="optimism_package.altda_deploy_config.da_commitment_type" 
        label="Commitment Type"
        />
        <FormInputField 
        name="optimism_package.altda_deploy_config.da_challenge_window" 
        label="Challenge Window"
        type="number"
        />
        <FormInputField 
        name="optimism_package.altda_deploy_config.da_resolve_window" 
        label="Resolve Window"
        type="number"
        />
        <FormInputField 
        name="optimism_package.altda_deploy_config.da_bond_size" 
        label="Bond Size"
        type="number"
        />
        <FormInputField 
        name="optimism_package.altda_deploy_config.da_resolver_refund_percentage" 
        label="Resolver Refund Percentage"
        type="number"
        />
      </div>
    </div>
  );
}