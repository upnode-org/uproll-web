"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CL_TYPES, Config, EL_TYPES, LOG_LEVELS } from "@/lib/configSchema";
import defaultParticipant from "@/const/defaultParticipant";
import FormCheckbox from "../Components/FormCheckbox";
import FormSelect from "../Components/FormSelect";
import FormInputField from "../Components/FormInput";
import ErrorMessage from "../Components/ErrorMessage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DynamicFieldArray from "../Components/FormFieldArray";
import FormTolerationFieldArray from "../Components/FormTolerationFieldArray";
import FormRecordField from "../Components/FormRecordFields";
import FormFieldArray from "../Components/FormFieldArray";
// --- NetworkParamsSection ---
function NetworkParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <h5 className="font-semibold">Network Params</h5>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.network`}
          label="Network"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.network_id`}
          label="Network ID"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.seconds_per_slot`}
          label="Seconds Per Slot"
          type="number"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.name`}
          label="Name"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.fjord_time_offset`}
          label="Fjord Time Offset"
          type="number"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.granite_time_offset`}
          label="Granite Time Offset"
          type="number"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.holocene_time_offset`}
          label="Holocene Time Offset"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.isthmus_time_offset`}
          label="Isthmus Time Offset"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.network_params.interop_time_offset`}
          label="Interop Time Offset"
        />
        <FormCheckbox
          label="Fund Dev Accounts"
          watchName={`optimism_package.chains.${chainIndex}.network_params.fund_dev_accounts`}
        />
      </div>
    </section>
  );
}

// --- BatcherParamsSection ---
function BatcherParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <h5 className="font-semibold">Batcher Params</h5>
      <div className="grid gap-4">
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.batcher_params.image`}
          label="Image"
        />
        <DynamicFieldArray
          label="Extra Params"
          fieldArrayName={`optimism_package.chains.${chainIndex}.batcher_params.extra_params`}
          placeholder="Batcher param"
          buttonText="Add Extra Param"
        />
      </div>
    </section>
  );
}

// --- ChallengerParamsSection ---
function ChallengerParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <h5 className="font-semibold">Challenger Params</h5>
      <div className="grid grid-cols-2 gap-4">
        <FormCheckbox
          label="Enabled"
          watchName={`optimism_package.chains.${chainIndex}.challenger_params.enabled`}
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.challenger_params.image`}
          label="Image"
        />
        <DynamicFieldArray
          label="Extra Params"
          fieldArrayName={`optimism_package.chains.${chainIndex}.challenger_params.extra_params`}
          placeholder="Challenger param"
          buttonText="Add Extra Param"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.challenger_params.cannon_prestates_path`}
          label="Cannon Prestates Path"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.challenger_params.cannon_prestates_url`}
          label="Cannon Prestates URL"
        />
      </div>
    </section>
  );
}

// --- ProposerParamsSection ---
function ProposerParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <h5 className="font-semibold">Proposer Params</h5>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.proposer_params.image`}
          label="Image"
        />
        <DynamicFieldArray
          label="Extra Params"
          fieldArrayName={`optimism_package.chains.${chainIndex}.proposer_params.extra_params`}
          placeholder="Proposer param"
          buttonText="Add Extra Param"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.proposer_params.game_type`}
          label="Game Type"
          type="number"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.proposer_params.proposal_internal`}
          label="Proposal Internal"
        />
      </div>
    </section>
  );
}

// --- MEVParamsSection ---
function MEVParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <h5 className="font-semibold">MEV Params</h5>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.mev_params.rollup_boost_image`}
          label="Rollup Boost Image"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.mev_params.builder_host`}
          label="Builder Host"
        />
        <FormInputField
          name={`optimism_package.chains.${chainIndex}.mev_params.builder_port`}
          label="Builder Port"
        />
      </div>
    </section>
  );
}

// --- DAServerParamsSection ---
function DAServerParamsSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section className="gap-4 flex flex-col">
      <h5 className="font-semibold">DA Server Params</h5>
      <FormInputField
        name={`optimism_package.chains.${chainIndex}.da_server_params.image`}
        label="Image"
      />
      <DynamicFieldArray
        label="Command"
        fieldArrayName={`optimism_package.chains.${chainIndex}.da_server_params.cmd`}
        placeholder="command"
        buttonText="Add Command"
      />
    </section>
  );
}

// --- AdditionalServicesSection ---
function AdditionalServicesSection({ chainIndex }: { chainIndex: number }) {
  return (
    <section>
      <DynamicFieldArray
        label="Additional Services"
        fieldArrayName={`optimism_package.chains.${chainIndex}.additional_services`}
        placeholder="Service name"
        buttonText="Add Service"
      />
    </section>
  );
}

// --- ParticipantsSection ---
function ParticipantsSection({ chainIndex }: { chainIndex: number }) {
  const { control, register, formState: { errors } } = useFormContext<Config>();
  const { fields: participantFields, append: appendParticipant, remove: removeParticipant } = useFieldArray({
    control,
    name: `optimism_package.chains.${chainIndex}.participants`,
  });

  return (
    <section>
      <h5 className="font-semibold">Participants</h5>
      {participantFields.map((participant, pIndex) => (
        <div key={participant.id} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center mb-4">
            <h6 className="font-semibold">Participant {pIndex + 1}</h6>
            <Button variant="outline" size="icon" onClick={() => removeParticipant(pIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Participant-Level Settings */}
          <FormRecordField
            label="Node Selectors"
            fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.node_selectors` as const}
          />
          <div className="mb-2">
            <FormTolerationFieldArray
              label="Tolerations"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.tolerations` as const}
            />
          </div>
          <div className="mb-2">
            <Label>Count</Label>
            <Input
              type="number"
              {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.count` as const, {
                valueAsNumber: true,
              })}
            />
            <ErrorMessage
              error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.count}
            />
          </div>

          {/* Consensus Layer */}
          <h6 className="font-semibold mt-4">Consensus Layer</h6>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <FormSelect
              label="Type"
              watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_type`}
              options={CL_TYPES}
            />
            <div>
              <Label>Image</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_image` as const)}
              />
              <ErrorMessage
                error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.cl_image}
              />
            </div>
            <FormSelect
              label="Log Level"
              watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_log_level`}
              options={LOG_LEVELS}
            />
            <div>
              <Label>Builder Type</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_builder_type` as const)}
              />
            </div>
            <div>
              <Label>Builder Image</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_builder_image` as const)}
              />
            </div>
          </div>

          {/* Consensus Layer - Advanced Settings */}
          <h6 className="font-semibold mt-4">Consensus Layer Advanced Settings</h6>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <FormRecordField
              label="Extra Env Vars"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_extra_env_vars` as const}
            />
            <FormRecordField
              label="Extra Labels"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_extra_labels` as const}
            />
            <div>
              <Label>Volume Size (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_volume_size` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Min CPU (millicores)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_min_cpu` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Max CPU (millicores)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_max_cpu` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Min Mem (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_min_mem` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Max Mem (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_max_mem` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <FormFieldArray
              label="Extra Params"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_extra_params` as const}
              placeholder="Extra param"
              buttonText="Add Extra Param"
            />
            <FormTolerationFieldArray
              label="Tolerations"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_tolerations` as const}
            />
          </div>

          {/* Execution Layer */}
          <h6 className="font-semibold mt-4">Execution Layer</h6>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <FormSelect
              label="Type"
              watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_type`}
              options={EL_TYPES}
            />
            <div>
              <Label>Image</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_image` as const)}
              />
            </div>
            <FormSelect
              label="Log Level"
              watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_log_level`}
              options={LOG_LEVELS}
            />
            <div>
              <Label>Builder Type</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_builder_type` as const)}
              />
            </div>
            <div>
              <Label>Builder Image</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_builder_image` as const)}
              />
            </div>
          </div>

          {/* Execution Layer - Advanced Settings */}
          <h6 className="font-semibold mt-4">Execution Layer Advanced Settings</h6>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
          {/* TODO: Add proper fields for these */}
          <FormRecordField
              label="Extra Env Vars"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_extra_env_vars` as const}
            />
            <FormFieldArray
              label="Extra Labels"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_extra_labels` as const}
              placeholder="Extra label"
              buttonText="Add Extra Label"
            />
            <div>
              <Label>Volume Size (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_volume_size` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Min CPU (millicores)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_min_cpu` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Max CPU (millicores)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_max_cpu` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Min Mem (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_min_mem` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Max Mem (MB)</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_max_mem` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <FormFieldArray
              label="Extra Params"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_extra_params` as const}
              placeholder="Extra param"
              buttonText="Add Extra Param"
            />
            <FormTolerationFieldArray
              label="Tolerations"
              fieldArrayName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_tolerations` as const}
            />
          </div>
        </div>
      ))}
      <Button type="button" onClick={() => appendParticipant(defaultParticipant)}>
        Add Participant
      </Button>
    </section>
  );
}

// --- Main ChainItemForm component ---
type ChainItemFormProps = {
  chainIndex: number;
  onRemove: () => void;
};

export default function ChainItemForm({ chainIndex, onRemove }: ChainItemFormProps) {
  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Chain {chainIndex + 1}</h4>
        <Button variant="outline" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <NetworkParamsSection chainIndex={chainIndex} />
        <BatcherParamsSection chainIndex={chainIndex} />
        <ChallengerParamsSection chainIndex={chainIndex} />
        <ProposerParamsSection chainIndex={chainIndex} />
        <MEVParamsSection chainIndex={chainIndex} />
        <DAServerParamsSection chainIndex={chainIndex} />
        <AdditionalServicesSection chainIndex={chainIndex} />
        <ParticipantsSection chainIndex={chainIndex} />
      </div>
    </div>
  );
}