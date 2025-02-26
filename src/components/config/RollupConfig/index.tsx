"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RollupConfigSchema, RollupConfig } from "@/lib/opSchema";
import HeroWrapper from "@/components/HeroWrapper";
import AnimatedBackground from "@/components/GradientBackground";
import CommandCopy from "@/components/CommandCopy";
import ModalAlert from "@/components/delete/Alert";
import { Button } from "@/components/ui/button";
import { Save, Download, Plus } from "lucide-react";
import { EditableInputField } from "./EditableInputField";
import { SettlementLayerForm } from "./SettlementLayerForm";
import { ParticipantForm } from "./ParticipantForm";
import { SignerConfigForm } from "./SignerConfigForm";
import { AdminConfigForm } from "./AdminConfigForm";
import { ChainConfigForm } from "./ChainConfigForm";
import { GasConfigForm } from "./GasConfigForm";
import defaultRollup from "@/const/defaultRollup";

interface RollupConfigFormProps {
  initialValues?: RollupConfig;
  id?: string;
}

export const RollupConfigForm: React.FC<RollupConfigFormProps> = ({ initialValues, id }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RollupConfig>({
    resolver: zodResolver(RollupConfigSchema),
    defaultValues: initialValues || defaultRollup,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = (data: RollupConfig) => {
    console.log("Rollup Config:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <HeroWrapper
        backgroundElement={
          <AnimatedBackground className="absolute inset-0 h-full w-full" />
        }
      >
        <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-3">
          <EditableInputField
            control={control}
            name="rollup_name"
            error={errors.rollup_name?.message as string}
          />
          <div className="flex justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Button>
                <Save className="w-4 h-4" /> {id ? "Save" : "Create"}
              </Button>
              <Button>
                <Download className="w-4 h-4" /> Download
              </Button>
              <CommandCopy
                command={
                  id
                    ? `uproll deploy ${id}`
                    : `Save to generate a deploy command`
                }
                disabled={!id}
              />
            </div>
            {id && (
              <ModalAlert
                title="Delete Configuration?"
                description="Are you sure you want to delete this configuration? This action cannot be undone."
                onContinue={() => {}}
              />
            )}
          </div>
        </div>
      </HeroWrapper>
      <div className="space-y-6 max-w-4xl mx-auto p-3 sm:p-6">
        <SettlementLayerForm
          register={register}
          control={control}
          errors={errors}
        />
        <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
          <legend className="px-2 text-lg font-semibold space-x-2 flex items-center justify-between gap-2">
            Participants
            <Button
              size={null}
              type="button"
              onClick={() =>
                append({
                  el_type: "op-geth",
                  el_image: "op-geth:latest",
                  cl_type: "op-node",
                  cl_image: "op-node:latest",
                })
              }
              className="p-0.5 rounded-full"
            >
              <Plus />
            </Button>
          </legend>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <ParticipantForm
                index={index}
                register={register}
                control={control}
                errors={errors}
                remove={remove}
              />
              {index < fields.length - 1 && (
                <div className="border-t border-gray-300 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </fieldset>
        <SignerConfigForm register={register} errors={errors} />
        <AdminConfigForm register={register} errors={errors} />
        <ChainConfigForm register={register} errors={errors} />
        <GasConfigForm register={register} errors={errors} />
      </div>
    </form>
  );
};

export default RollupConfigForm;
