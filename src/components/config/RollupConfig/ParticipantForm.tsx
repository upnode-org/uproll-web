"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CL_TYPES, EL_TYPES, RollupConfig } from "@/lib/opSchema";
import { SelectField } from "./Components/SelectField";
import { InputField } from "./Components/InputField";
import { Plus } from "lucide-react";
import defaultRollup from "@/const/defaultRollup";

export const ParticipantsForm: React.FC = () => {
  const { control } = useFormContext<RollupConfig>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const handleAddParticipant = () => {
    append(defaultRollup.participants[0]);
  };

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold space-x-2 flex items-center justify-between gap-2">
        Participants
        <Button
          size={null}
          type="button"
          onClick={handleAddParticipant}
          className="p-0.5 rounded-full"
        >
          <Plus />
        </Button>
      </legend>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <ParticipantForm index={index} remove={remove} />
          {index < fields.length - 1 && (
            <div className="border-t border-gray-300 my-4"></div>
          )}
        </React.Fragment>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No participants added. Click the + button to add a participant.
        </div>
      )}
    </fieldset>
  );
};

export default ParticipantsForm;

type ParticipantFormProps = {
  index: number;
  remove: (index: number) => void;
};

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  index,
  remove,
}) => {
  const { register, control, formState: { errors } } = useFormContext<RollupConfig>();

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
        options={Object.values(EL_TYPES).map((type) => ({ label: type, value: type }))}
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
        options={Object.values(CL_TYPES).map((type) => ({ label: type, value: type }))}
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
