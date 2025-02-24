"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import FormInputField from "./Components/FormInput";
import { Textarea } from "@/components/ui/textarea";
import FormFieldArray from "./Components/FormFieldArray";
export default function InteropForm() {
  const { register } = useFormContext<Config>();

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Supervisor Params</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormInputField   
          name="optimism_package.interop.supervisor_params.image" 
          label="Image"
          />
          <FormInputField 
          name="optimism_package.interop.supervisor_params.dependency_set" 
          label="Dependency Set"
          />
        </div>
        <FormFieldArray
          label="Extra Params"
          fieldArrayName="optimism_package.interop.supervisor_params.extra_params"
          placeholder="Extra param"
          buttonText="Add Extra Param"
        />
        </div>
      </div>
  );
}