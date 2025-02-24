"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { EL_TYPES, CL_TYPES, LOG_LEVELS, Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import defaultParticipant from "@/const/defaultParticipant";
import ErrorMessage from "../Components/ErrorMessage";
import defaultChain from "@/const/defaultChain";
import FormCheckbox from "../Components/FormCheckbox";
import FormSelect from "../Components/FormSelect";
import FormInputField from "../Components/FormInput";
type ChainItemFormProps = {
  chainIndex: number;
  onRemove: () => void;
};

export default function ChainItemForm({ chainIndex, onRemove }: ChainItemFormProps) {
  const { register, watch, control, setValue, formState: { errors } } = useFormContext<Config>();

  const { fields: participantFields, append: appendParticipant, remove: removeParticipant } =
    useFieldArray({
      control,
      name: `optimism_package.chains.${chainIndex}.participants`,
    });
  const { fields: additionalServiceFields, append: appendService, remove: removeService } =
    useFieldArray({
      control,
      name: `optimism_package.chains.${chainIndex}.additional_services`,
    });

  // New field arrays for comma-separated fields converted into arrays
  const { fields: batcherExtraParamsFields, append: appendBatcherExtraParam, remove: removeBatcherExtraParam } =
    useFieldArray({
      control,
      name: `optimism_package.chains.${chainIndex}.batcher_params.extra_params`,
    });

  const { fields: challengerExtraParamsFields, append: appendChallengerExtraParam, remove: removeChallengerExtraParam } =
    useFieldArray({
      control,
      name: `optimism_package.chains.${chainIndex}.challenger_params.extra_params`,
    });

  const { fields: proposerExtraParamsFields, append: appendProposerExtraParam, remove: removeProposerExtraParam } =
    useFieldArray({
      control,
      name: `optimism_package.chains.${chainIndex}.proposer_params.extra_params`,
    });

  const { fields: daServerCmdFields, append: appendDaServerCmd, remove: removeDaServerCmd } =
    useFieldArray<Config>({
      control,
      name: `optimism_package.chains.${chainIndex}.da_server_params.cmd`,
    });

  const fundDevAccounts = watch(`optimism_package.chains.${chainIndex}.network_params.fund_dev_accounts`, defaultChain.network_params.fund_dev_accounts);

  const enabled = watch(`optimism_package.chains.${chainIndex}.challenger_params.enabled`, defaultChain.challenger_params.enabled);

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Chain {chainIndex + 1}</h4>
        <Button variant="outline" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Network Params */}
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
              type="number"
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
            type="number"
            />
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.network_params.isthmus_time_offset`} 
            label="Isthmus Time Offset"
            type="number"
            />
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.network_params.interop_time_offset`} 
            label="Interop Time Offset"
            type="number"
              />
            <FormCheckbox
              label="Fund Dev Accounts"
              watchName={`optimism_package.chains.${chainIndex}.network_params.fund_dev_accounts`}
            />
          </div>
        </section>

        {/* Batcher Params */}
        <section>
          <h5 className="font-semibold">Batcher Params</h5>
          <div className="grid gap-4">
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.batcher_params.image`} 
            label="Image"
            />
            <div>
              <Label>Extra Params</Label>
              {batcherExtraParamsFields.map((field, index) => (
                <>
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Input
                      {...register(`optimism_package.chains.${chainIndex}.batcher_params.extra_params.${index}`)}
                      placeholder="param"
                    />
                    <Button variant="outline" size="icon" onClick={() => removeBatcherExtraParam(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.batcher_params?.extra_params?.[index]} />
                </>
              ))}
              <Button type="button" onClick={() => appendBatcherExtraParam([''])}>
                Add Extra Param
              </Button>
            </div>
          </div>
        </section>

        {/* Challenger Params */}
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
            <div>
              <Label>Extra Params</Label>
              {challengerExtraParamsFields.map((field, index) => (
                <>
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Input
                      {...register(`optimism_package.chains.${chainIndex}.challenger_params.extra_params.${index}`)}
                      placeholder="param"
                    />
                    <Button variant="outline" size="icon" onClick={() => removeChallengerExtraParam(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.challenger_params?.extra_params?.[index]} />
                </>
              ))}
              <Button type="button" onClick={() => appendChallengerExtraParam('')}>
                Add Extra Param
              </Button>
            </div>
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

        {/* Proposer Params */}
        <section>
          <h5 className="font-semibold">Proposer Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.proposer_params.image`} 
            label="Image"
            />
            <div>
              <Label>Extra Params</Label>
              {proposerExtraParamsFields.map((field, index) => (
                <>
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Input
                      {...register(`optimism_package.chains.${chainIndex}.proposer_params.extra_params.${index}`)}
                      placeholder="param"
                  />
                  <Button variant="outline" size="icon" onClick={() => removeProposerExtraParam(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  </div>
                  <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.proposer_params?.extra_params?.[index]} />
                </>
              ))}
              <Button type="button" onClick={() => appendProposerExtraParam('')}>
                Add Extra Param
              </Button>
            </div>
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.proposer_params.game_type`} 
            label="Game Type"
            type="number"
            />
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.proposer_params.proposal_internal`} 
            label="Proposal Internal"
            type="number"
            />
          </div>
        </section>

        {/* MEV Params */}
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
            type="number"
            />
          </div>
        </section>

        {/* DA Server Params */}
        <section>
          <h5 className="font-semibold">DA Server Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <FormInputField 
            name={`optimism_package.chains.${chainIndex}.da_server_params.image`} 
            label="Image"
            />
            <div>
              <Label>Command</Label>
              {daServerCmdFields.map((field, index) => (
                <>
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Input
                      {...register(`optimism_package.chains.${chainIndex}.da_server_params.cmd.${index}`)}
                    placeholder="command"
                  />
                  <Button variant="outline" size="icon" onClick={() => removeDaServerCmd(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.da_server_params?.cmd?.[index]} />
                </>
              ))}
              <Button type="button" onClick={() => appendDaServerCmd('')}>
                Add Command
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section>
          <h5 className="font-semibold">Additional Services</h5>
          {additionalServiceFields.map((service, sIndex) => (
            <>
              <div key={service.id} className="flex items-center space-x-2">
                <Input
                  {...register(`optimism_package.chains.${chainIndex}.additional_services.${sIndex}`)}
                placeholder="Service name"
              />
              <Button variant="outline" size="icon" onClick={() => removeService(sIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              </div>
              <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.additional_services?.[sIndex]} />
            </>
          ))}
          <Button type="button" onClick={() => appendService('')}>
            Add Service
          </Button>
        </section>

        {/* Participants */}
        <section>
          <h5 className="font-semibold">Participants</h5>
          {participantFields.map((participant, pIndex) => (
            <div key={participant.id} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h6 className="font-semibold">Participant {pIndex + 1}</h6>
                <Button variant="outline" size="icon" onClick={() => removeParticipant(pIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label>Node Selectors</Label>
                <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.node_selectors`)} />
                {/* <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.node_selectors} /> */}
              </div>
              <div>
                <Label>Tolerations</Label>
                <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.tolerations`)} />
                <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.tolerations} />
              </div>
              <div>
                <Label>Count</Label>
                <Input
                  type="number"
                  {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.count`, {
                    valueAsNumber: true,
                  })}
                />
                <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.count} />
              </div>

              <h6>Consensus Layer</h6>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Type"
                  watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_type`}
                  options={CL_TYPES}
                />
                <div>
                  <Label>Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_image`)} />
                  <ErrorMessage error={errors.optimism_package?.chains?.[chainIndex]?.participants?.[pIndex]?.cl_image} />
                </div>
                <FormSelect
                  label="Log Level"
                  watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_log_level`}
                  options={LOG_LEVELS}
                />
                <div>
                  <Label>Builder Type</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_builder_type`)} />
                </div>
                <div>
                  <Label>Builder Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_builder_image`)} />
                </div>
              </div>
              <h6>Execution Layer</h6>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Type"
                  watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_type`}
                  options={EL_TYPES}
                />
                <div>
                  <Label>Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_image`)} />
                </div>
                <FormSelect
                  label="Log Level"
                  watchName={`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_log_level`}
                  options={LOG_LEVELS}
                />
                <div>
                  <Label>Builder Type</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_builder_type`)} />
                </div>
                <div>
                  <Label>Builder Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_builder_image`)} />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => appendParticipant(defaultParticipant)}>
            Add Participant
          </Button>
        </section>
      </div>
    </div>
  );
}