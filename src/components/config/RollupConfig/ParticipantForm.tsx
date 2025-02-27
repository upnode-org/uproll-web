 "use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { RollupConfig } from "@/lib/opSchema";
import { SelectField } from "./Components/SelectField";
import { InputField } from "./Components/InputField";

export type ParticipantFormProps = {
  index: number;
  register: UseFormRegister<RollupConfig>;
  control: Control<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
  remove: (index: number) => void;
};

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  index,
  register,
  control,
  errors,
  remove,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Participant {index + 1}</h4>
        <Button variant="destructive" size="sm" onClick={() => remove(index)}>
          <Trash2 className="h-4 w-4" /> Remove
        </Button>
      </div>
      <SelectField
        label="Execution Layer Type"
        options={[
          { label: "op-geth", value: "op-geth" },
          { label: "other", value: "other" },
        ]}
        control={control}
        name={`participants.${index}.el_type`}
        error={errors.participants?.[index]?.el_type?.message as string}
      />
      <InputField
        label="Execution Layer Image"
        registration={register(`participants.${index}.el_image` as const)}
        error={errors.participants?.[index]?.el_image?.message as string}
      />
      <SelectField
        label="Consensus Layer Type"
        options={[
          { label: "op-node", value: "op-node" },
          { label: "other", value: "other" },
        ]}
        control={control}
        name={`participants.${index}.cl_type`}
        error={errors.participants?.[index]?.cl_type?.message as string}
      />
      <InputField
        label="Consensus Layer Image"
        registration={register(`participants.${index}.cl_image` as const)}
        error={errors.participants?.[index]?.cl_image?.message as string}
      />
    </div>
  );
};
