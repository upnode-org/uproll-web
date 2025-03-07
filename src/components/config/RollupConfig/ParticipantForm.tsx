"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CL_TYPES, EL_TYPES, RollupConfig } from "@/lib/opSchema";
import { SelectField } from "./Components/SelectField";
import { InputField } from "./Components/InputField";
import { Plus } from "lucide-react";
import defaultRollup from "@/const/defaultRollup";
import { Checkbox } from "@/components/ui/checkbox";

export const EL_IMAGES: {[key:string]:string} = {
  "op-geth": "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-geth:latest",
  "op-reth": "ghcr.io/paradigmxyz/op-reth:latest",
  "op-erigon": "testinprod/op-erigon:latest",
  "op-nethermind": "nethermind/nethermind:latest",
  "op-besu": "ghcr.io/optimism-java/op-besu:latest",
};

export const CL_IMAGES: {[key:string]:string} = {
  "op-node": "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-node:develop",
  "hildr": "ghcr.io/optimism-java/hildr:latest",
};

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
  const { setValue, watch } = useFormContext<RollupConfig>();
  
  const participants = watch("participants");
  
  // Use local state for the default images toggle instead of form context
  const [useDefaultElImages, setUseDefaultElImages] = useState(
    !participants[index]?.el_image
  );
  const [useDefaultClImages, setUseDefaultClImages] = useState(
    !participants[index]?.cl_image
  );
  
  // Watch for changes in the type selections
  const elType = watch(`participants.${index}.el_type` as const);
  const clType = watch(`participants.${index}.cl_type` as const);

  // Update images when types change or when useDefaultImages changes
  
  // Initialize default image states based on current participant values
  useEffect(() => {
    if (participants && participants[index]) {
      setUseDefaultElImages(!participants[index].el_image);
      setUseDefaultClImages(!participants[index].cl_image);
    }
  }, [participants, index]);
  
  useEffect(() => {
    if (useDefaultElImages) {
      // Set images to undefined when using defaults
      setValue(`participants.${index}.el_image` as const, undefined, { shouldValidate: false });
    } else if (elType) {
      // Set default image as initial value when toggling to custom
      const defaultElImage = elType && EL_IMAGES[elType] ? EL_IMAGES[elType] : "";
      setValue(`participants.${index}.el_image` as const, defaultElImage, { shouldValidate: false });
    }
  }, [useDefaultElImages, elType, index, setValue, watch]);
  
  useEffect(() => {
    if (useDefaultClImages) {
      setValue(`participants.${index}.cl_image` as const, undefined, { shouldValidate: false });
    } else if (clType) {
      const defaultClImage = clType && CL_IMAGES[clType] ? CL_IMAGES[clType] : "";
      setValue(`participants.${index}.cl_image` as const, defaultClImage, { shouldValidate: false });
    }
  }, [useDefaultClImages, clType, index, setValue, watch]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Participant {index + 1}</h4>
        {participants.length > 1 && (
          <Button variant="destructive" size="sm" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        )}
      </div>

      <SelectField
        label="Execution Layer Type"
        options={Object.values(EL_TYPES).map((type) => ({ label: type, value: type }))}
        name={`participants.${index}.el_type`}
      />
       <div className="flex items-center space-x-2  mt-4">
        <Checkbox
          id={`use-default-el-images-${index}`}
          checked={useDefaultElImages}
          onCheckedChange={(checked) => {
            setUseDefaultElImages(checked === true);
          }}
        />
        <label
          htmlFor={`use-default-el-images-${index}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use default Execution Layer image
        </label>
      </div>
      {!useDefaultElImages && (
          <InputField
            label="Execution Layer Image"
            name={`participants.${index}.el_image`}
          />
      )}
      <div className="mt-4"></div>
      <SelectField
        label="Consensus Layer Type"
        options={Object.values(CL_TYPES).map((type) => ({ label: type, value: type }))}
        name={`participants.${index}.cl_type`}
      />
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id={`use-default-cl-images-${index}`}
          checked={useDefaultClImages}
          onCheckedChange={(checked) => {
            setUseDefaultClImages(checked === true);
          }}
        />
        <label
          htmlFor={`use-default-cl-images-${index}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use default Consensus Layer image
        </label>
      </div>
      {!useDefaultClImages && (
        <InputField
          label="Consensus Layer Image"
          name={`participants.${index}.cl_image`}
        />
      )}
    </div>
  );
};
