"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { EL_TYPES, ELType, CL_TYPES, CLType, LOG_LEVELS, LogLevel, Config } from "@/lib/configSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import defaultParticipant from "@/const/defaultParticipant";

type ChainItemFormProps = {
  chainIndex: number;
  onRemove: () => void;
};

export default function ChainItemForm({ chainIndex, onRemove }: ChainItemFormProps) {
  const { register, control, setValue } = useFormContext<Config>();

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
            <div>
              <Label>Network</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.network`)} />
            </div>
            <div>
              <Label>Network ID</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.network_id`)} />
            </div>
            <div>
              <Label>Seconds Per Slot</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.network_params.seconds_per_slot`, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.name`)} />
            </div>
            <div>
              <Label>Fjord Time Offset</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.network_params.fjord_time_offset`, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Granite Time Offset</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.network_params.granite_time_offset`, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Holocene Time Offset</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.holocene_time_offset`)} />
            </div>
            <div>
              <Label>Isthmus Time Offset</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.isthmus_time_offset`)} />
            </div>
            <div>
              <Label>Interop Time Offset</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.network_params.interop_time_offset`)} />
            </div>x
            <div>
              <Label>Fund Dev Accounts</Label>
              <input
                type="checkbox"
                {...register(`optimism_package.chains.${chainIndex}.network_params.fund_dev_accounts`)}
              />
            </div>
          </div>
        </section>

        {/* Batcher Params */}
        <section>
          <h5 className="font-semibold">Batcher Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.batcher_params.image`)} />
            </div>
            <div>
              <Label>Extra Params (comma-separated)</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.batcher_params.extra_params`)}
                placeholder="param1, param2"
              />
            </div>
          </div>
        </section>

        {/* Challenger Params */}
        <section>
          <h5 className="font-semibold">Challenger Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Enabled</Label>
              <input
                type="checkbox"
                {...register(`optimism_package.chains.${chainIndex}.challenger_params.enabled`)}
              />
            </div>
            <div>
              <Label>Image</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.challenger_params.image`)} />
            </div>
            <div>
              <Label>Extra Params (comma-separated)</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.challenger_params.extra_params`)}
                placeholder="param1, param2"
              />
            </div>
            <div>
              <Label>Cannon Prestates Path</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.challenger_params.cannon_prestates_path`)} />
            </div>
            <div>
              <Label>Cannon Prestates URL</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.challenger_params.cannon_prestates_url`)} />
            </div>
          </div>
        </section>

        {/* Proposer Params */}
        <section>
          <h5 className="font-semibold">Proposer Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.proposer_params.image`)} />
            </div>
            <div>
              <Label>Extra Params (comma-separated)</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.proposer_params.extra_params`)}
                placeholder="param1, param2"
              />
            </div>
            <div>
              <Label>Game Type</Label>
              <Input
                type="number"
                {...register(`optimism_package.chains.${chainIndex}.proposer_params.game_type`, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Proposal Internal</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.proposer_params.proposal_internal`)} />
            </div>
          </div>
        </section>

        {/* MEV Params */}
        <section>
          <h5 className="font-semibold">MEV Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rollup Boost Image</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.mev_params.rollup_boost_image`)} />
            </div>
            <div>
              <Label>Builder Host</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.mev_params.builder_host`)} />
            </div>
            <div>
              <Label>Builder Port</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.mev_params.builder_port`)} />
            </div>
          </div>
        </section>

        {/* DA Server Params */}
        <section>
          <h5 className="font-semibold">DA Server Params</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image</Label>
              <Input {...register(`optimism_package.chains.${chainIndex}.da_server_params.image`)} />
            </div>
            <div>
              <Label>Command (comma-separated)</Label>
              <Input
                {...register(`optimism_package.chains.${chainIndex}.da_server_params.cmd`)}
                placeholder="cmd1, cmd2"
              />
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section>
          <h5 className="font-semibold">Additional Services</h5>
          {additionalServiceFields.map((service, sIndex) => (
            <div key={service.id} className="flex items-center space-x-2">
              <Input
                {...register(`optimism_package.chains.${chainIndex}.additional_services.${sIndex}`)}
                placeholder="Service name"
              />
              <Button variant="outline" size="icon" onClick={() => removeService(sIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendService({
            key: "",
            operator: "EQUAL",
            value: "",
            effect: "NO_SCHEDULE"
          })}>
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
                </div>
                <div>
                  <Label>Tolerations</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.tolerations`)} />
                </div>
                <div>
                  <Label>Count</Label>
                  <Input
                    type="number"
                    {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.count`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

              <h6>Consensus Layer</h6>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={participant.cl_type}
                    onValueChange={(value: CLType) =>
                      setValue(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_type`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_image`)} />
                </div>
                <div>
                  <Label>Log Level</Label>
                  <Select
                    value={participant.cl_log_level}
                    onValueChange={(value: LogLevel) =>
                      setValue(`optimism_package.chains.${chainIndex}.participants.${pIndex}.cl_log_level`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOG_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <div>
                  <Label>Type</Label>
                  <Select
                    value={participant.el_type}
                    onValueChange={(value: ELType) =>
                      setValue(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_type`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image</Label>
                  <Input {...register(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_image`)} />
                </div>
                <div>
                  <Label>Log Level</Label>
                  <Select
                    value={participant.el_log_level}
                    onValueChange={(value: LogLevel) =>
                      setValue(`optimism_package.chains.${chainIndex}.participants.${pIndex}.el_log_level`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOG_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
