"use client";

import { useState, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, Save, Trash2 } from "lucide-react";
import { v4 } from "uuid";
import CommandCopy from "../CommandCopy";
import { toast } from "@/hooks/use-toast";
import { updateConfig, postConfig, deleteConfig } from "@/services/client/config";
import { defaultConfig } from "@/const/deafultConfig";
import { Config, ConfigSchema } from "@/lib/configSchema";
import { useRouter } from "next/navigation";

/* ============================================================================
   HELPER FUNCTIONS FOR NESTED UPDATES
   ----------------------------------------------------------------------------
   Two helpers are used:
   1. setNestedValue – Recursively update a nested value immutably.
   2. parsePath – Convert a base path plus field (using dot and bracket notation)
      into an array of keys.
   ---------------------------------------------------------------------------- */

// Recursively update a nested value.
function setNestedValue(obj: any, path: (string | number)[], value: any): any {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: setNestedValue(obj?.[key] ?? {}, rest, value),
  };
}

// Convert a basePath and field into an array of keys.
// Supports dot notation and bracket notation.
function parsePath(basePath: string, field: string): (string | number)[] {
  if (!basePath) return [field];
  const keys: (string | number)[] = [];
  const regex = /([^[.\]]+)|\[(\d+)\]/g;
  const fullPath = basePath + "." + field;
  let match;
  while ((match = regex.exec(fullPath)) !== null) {
    if (match[1]) {
      keys.push(match[1]);
    } else if (match[2]) {
      keys.push(Number(match[2]));
    }
  }
  return keys;
}

/* ============================================================================
   TYPES FOR NESTED UPDATES & REDUCER
   ----------------------------------------------------------------------------
   A helper type (PathValue) recursively extracts the type of the nested
   property at a given path in the Config object.
   ---------------------------------------------------------------------------- */

// Recursively extract the type of a nested property.
type PathValue<T, P extends (keyof any)[]> =
  P extends [infer K, ...infer Rest]
    ? K extends keyof T
      ? Rest extends (keyof any)[]
        ? PathValue<T[K], Rest>
        : never
      : never
    : T;

// Generic action for updating nested config fields.
// A default generic parameter is provided so that if you’re not supplying a
// key array explicitly, you can use the overload that takes a basePath and field.
type ConfigAction<P extends (string | number)[] = (string | number)[]> = {
  type: "SET_FIELD";
  path: P;
  value: PathValue<Config, P>;
};

/* ============================================================================
   REDUCER
   ----------------------------------------------------------------------------
   The reducer listens for SET_FIELD actions, updates the nested value using
   setNestedValue, and then validates the new state against the Zod schema.
   ---------------------------------------------------------------------------- */
const configReducer = (state: Config, action: ConfigAction): Config => {
  switch (action.type) {
    case "SET_FIELD": {
      const newState = setNestedValue(state, action.path, action.value);
      const validation = ConfigSchema.safeParse(newState);
      if (!validation.success) {
        console.error("Validation errors:", validation.error.format());
      }
      return newState;
    }
    default:
      return state;
  }
};

/* ============================================================================
   COMPONENT
   ----------------------------------------------------------------------------
   The component uses useReducer to manage its config state and provides a
   helper (handleInputChange) that supports two calling styles:
   1. handleInputChange(["optimism_package", "global_log_level"], value)
   2. handleInputChange("optimism_package.observability", "enabled", checked)
   ---------------------------------------------------------------------------- */
export function ConfigDetails({
  id,
  initialConfig,
}: {
  id?: string;
  initialConfig?: Config;
}) {
  const [state, dispatch] = useReducer(
    configReducer,
    initialConfig || defaultConfig
  );
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Overload signatures for handleInputChange:
  // 1. When called with an array of keys.
  function handleInputChange<P extends (string | number)[]>(
    path: P,
    value: PathValue<Config, P>
  ): void;
  // 2. When called with a basePath string and field string.
  function handleInputChange(
    basePath: string,
    field: string,
    value: any
  ): void;
  // Implementation:
  function handleInputChange(...args: any[]): void {
    if (args.length === 2) {
      const [path, value] = args;
      dispatch({ type: "SET_FIELD", path, value });
    } else if (args.length === 3) {
      const [basePath, field, value] = args;
      const path = parsePath(basePath, field);
      dispatch({ type: "SET_FIELD", path, value });
    }
  }

  // (Your save, download, and delete handlers would go here.)

  return (
    <div className="space-y-6 pt-4">
      {/* Action buttons */}
      <div className="flex justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <Button onClick={() => {/* handleSave implementation */}}>
            <Save className="w-4 h-4" /> {id ? "Save" : "Create"}
          </Button>
          <Button onClick={() => {/* handleDownload implementation */}}>
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
          <Button variant="destructive" onClick={() => {/* handleDelete implementation */}}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        )}
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Name and Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="global_log_level">Global Log Level</Label>
            <Select
              value={state.optimism_package.global_log_level || ""}
              onValueChange={(value) =>
                // Using the array form for full type safety.
                handleInputChange(
                  ["optimism_package", "global_log_level"] as const,
                  value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent>
                {["ERROR", "WARN", "INFO", "DEBUG", "TRACE"].map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="persistent"
            checked={state.optimism_package.persistent || false}
            onCheckedChange={(checked) =>
              // Using the basePath/field overload.
              handleInputChange("optimism_package", "persistent", checked)
            }
          />
          <Label htmlFor="persistent">Persistent</Label>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Observability */}
          <AccordionItem value="observability">
            <AccordionTrigger>Observability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="observability-enabled"
                    checked={
                      state.optimism_package.observability?.enabled || false
                    }
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "optimism_package.observability",
                        "enabled",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="observability-enabled">Enabled</Label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Prometheus Params
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prometheus-retention-time">
                        Retention Time
                      </Label>
                      <Input
                        id="prometheus-retention-time"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.storage_tsdb_retention_time || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "storage_tsdb_retention_time",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-retention-size">
                        Retention Size
                      </Label>
                      <Input
                        id="prometheus-retention-size"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.storage_tsdb_retention_size || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "storage_tsdb_retention_size",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-min-cpu">Min CPU</Label>
                      <Input
                        id="prometheus-min-cpu"
                        type="number"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.min_cpu || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "min_cpu",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-max-cpu">Max CPU</Label>
                      <Input
                        id="prometheus-max-cpu"
                        type="number"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.max_cpu || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "max_cpu",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-min-mem">Min Memory</Label>
                      <Input
                        id="prometheus-min-mem"
                        type="number"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.min_mem || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "min_mem",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-max-mem">Max Memory</Label>
                      <Input
                        id="prometheus-max-mem"
                        type="number"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.max_mem || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "max_mem",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-image">Image</Label>
                      <Input
                        id="prometheus-image"
                        value={
                          state.optimism_package.observability
                            ?.prometheus_params?.image || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.prometheus_params",
                            "image",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Grafana Params</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="grafana-dashboard-sources">
                        Dashboard Sources
                      </Label>
                      <Textarea
                        id="grafana-dashboard-sources"
                        value={JSON.stringify(
                          state.optimism_package.observability?.grafana_params
                            ?.dashboard_sources || [],
                          null,
                          2
                        )}
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "dashboard_sources",
                            JSON.parse(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-min-cpu">Min CPU</Label>
                      <Input
                        id="grafana-min-cpu"
                        type="number"
                        value={
                          state.optimism_package.observability?.grafana_params
                            ?.min_cpu || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "min_cpu",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-max-cpu">Max CPU</Label>
                      <Input
                        id="grafana-max-cpu"
                        type="number"
                        value={
                          state.optimism_package.observability?.grafana_params
                            ?.max_cpu || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "max_cpu",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-min-mem">Min Memory</Label>
                      <Input
                        id="grafana-min-mem"
                        type="number"
                        value={
                          state.optimism_package.observability?.grafana_params
                            ?.min_mem || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "min_mem",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-max-mem">Max Memory</Label>
                      <Input
                        id="grafana-max-mem"
                        type="number"
                        value={
                          state.optimism_package.observability?.grafana_params
                            ?.max_mem || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "max_mem",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-image">Image</Label>
                      <Input
                        id="grafana-image"
                        value={
                          state.optimism_package.observability?.grafana_params
                            ?.image || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.observability.grafana_params",
                            "image",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Interop */}
          <AccordionItem value="interop">
            <AccordionTrigger>Interop</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interop-enabled"
                    checked={state.optimism_package.interop?.enabled || false}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "optimism_package.interop",
                        "enabled",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="interop-enabled">Enabled</Label>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Supervisor Params
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supervisor-image">Image</Label>
                      <Input
                        id="supervisor-image"
                        value={
                          state.optimism_package.interop?.supervisor_params
                            ?.image || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.interop.supervisor_params",
                            "image",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="supervisor-dependency-set">
                        Dependency Set
                      </Label>
                      <Input
                        id="supervisor-dependency-set"
                        value={
                          state.optimism_package.interop?.supervisor_params
                            ?.dependency_set || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.interop.supervisor_params",
                            "dependency_set",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="supervisor-extra-params">
                        Extra Params (JSON)
                      </Label>
                      <Textarea
                        id="supervisor-extra-params"
                        value={JSON.stringify(
                          state.optimism_package.interop?.supervisor_params
                            ?.extra_params || [],
                          null,
                          2
                        )}
                        onChange={(e) =>
                          handleInputChange(
                            "optimism_package.interop.supervisor_params",
                            "extra_params",
                            JSON.parse(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* AltDA Deploy Config */}
          <AccordionItem value="altda-deploy-config">
            <AccordionTrigger>AltDA Deploy Config</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-altda"
                    checked={
                      state.optimism_package.altda_deploy_config?.use_altda ||
                      false
                    }
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "optimism_package.altda_deploy_config",
                        "use_altda",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="use-altda">Use AltDA</Label>
                </div>
                <div>
                  <Label htmlFor="da-commitment-type">
                    DA Commitment Type
                  </Label>
                  <Input
                    id="da-commitment-type"
                    value={
                      state.optimism_package.altda_deploy_config
                        ?.da_commitment_type || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "optimism_package.altda_deploy_config",
                        "da_commitment_type",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="da-challenge-window">
                      DA Challenge Window
                    </Label>
                    <Input
                      id="da-challenge-window"
                      type="number"
                      value={
                        state.optimism_package.altda_deploy_config
                          ?.da_challenge_window || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "optimism_package.altda_deploy_config",
                          "da_challenge_window",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="da-resolve-window">
                      DA Resolve Window
                    </Label>
                    <Input
                      id="da-resolve-window"
                      type="number"
                      value={
                        state.optimism_package.altda_deploy_config
                          ?.da_resolve_window || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "optimism_package.altda_deploy_config",
                          "da_resolve_window",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="da-bond-size">DA Bond Size</Label>
                    <Input
                      id="da-bond-size"
                      type="number"
                      value={
                        state.optimism_package.altda_deploy_config
                          ?.da_bond_size || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "optimism_package.altda_deploy_config",
                          "da_bond_size",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="da-resolver-refund-percentage">
                      DA Resolver Refund Percentage
                    </Label>
                    <Input
                      id="da-resolver-refund-percentage"
                      type="number"
                      value={
                        state.optimism_package.altda_deploy_config
                          ?.da_resolver_refund_percentage || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "optimism_package.altda_deploy_config",
                          "da_resolver_refund_percentage",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Chains */}
          <AccordionItem value="chains">
            <AccordionTrigger>Chains</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {state.optimism_package.chains?.map((chain, index: number) => (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={chain.network_params.network + index}
                  >
                    <AccordionItem value={`chain-${index}`}>
                      <AccordionTrigger>
                        Chain {index + 1}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`chain-${index}-network`}>
                                Network
                              </Label>
                              <Input
                                id={`chain-${index}-network`}
                                value={
                                  chain.network_params?.network || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `optimism_package.chains[${index}].network_params`,
                                    "network",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`chain-${index}-network-id`}>
                                Network ID
                              </Label>
                              <Input
                                id={`chain-${index}-network-id`}
                                value={
                                  chain.network_params?.network_id || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `optimism_package.chains[${index}].network_params`,
                                    "network_id",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`chain-${index}-participants`}>
                              Participants
                            </Label>
                            <div className="space-y-2">
                              {chain.participants?.map(
                                (participant, pIndex: number) => (
                                  <div
                                    key={participant.el_type + pIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <Select
                                      value={participant.el_type}
                                      onValueChange={(value) =>
                                        handleInputChange(
                                          `optimism_package.chains[${index}].participants[${pIndex}]`,
                                          "el_type",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select EL type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[
                                          "op-geth",
                                          "op-reth",
                                          "op-erigon",
                                          "op-nethermind",
                                          "op-besu",
                                        ].map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      value={participant.cl_type}
                                      onValueChange={(value) =>
                                        handleInputChange(
                                          `optimism_package.chains[${index}].participants[${pIndex}]`,
                                          "cl_type",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select CL type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {["op-node", "hildr"].map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newParticipants = [
                                          ...chain.participants,
                                        ];
                                        newParticipants.splice(pIndex, 1);
                                        handleInputChange(
                                          `optimism_package.chains[${index}]`,
                                          "participants",
                                          newParticipants
                                        );
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                              <Button
                                onClick={() => {
                                  const newParticipant = {
                                    id: v4(),
                                    el_type: "op-geth",
                                    el_image: "",
                                    el_log_level: "",
                                    el_extra_env_vars: {},
                                    el_extra_labels: {},
                                    el_extra_params: [],
                                    el_tolerations: [],
                                    el_volume_size: 0,
                                    el_min_cpu: 0,
                                    el_max_cpu: 0,
                                    el_min_mem: 0,
                                    el_max_mem: 0,
                                    cl_type: "op-node",
                                    cl_image: "",
                                    cl_log_level: "",
                                    cl_extra_env_vars: {},
                                    cl_extra_labels: {},
                                    cl_extra_params: [],
                                    cl_tolerations: [],
                                    cl_volume_size: 0,
                                    cl_min_cpu: 0,
                                    cl_max_cpu: 0,
                                    cl_min_mem: 0,
                                    cl_max_mem: 0,
                                    el_builder_type: "",
                                    el_builder_image: "",
                                    cl_builder_type: "",
                                    cl_builder_image: "",
                                    node_selectors: {},
                                    tolerations: [],
                                    count: 1,
                                  };
                                  handleInputChange(
                                    `optimism_package.chains[${index}]`,
                                    "participants",
                                    [
                                      ...(chain.participants || []),
                                      newParticipant,
                                    ]
                                  );
                                }}
                              >
                                Add Participant
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                <Button
                  onClick={() => {
                    const newChain = {
                      id: v4(),
                      network_params: {
                        network: "",
                        network_id: "",
                        seconds_per_slot: 0,
                        name: "",
                        fjord_time_offset: 0,
                        granite_time_offset: 0,
                        holocene_time_offset: "",
                        isthmus_time_offset: "",
                        interop_time_offset: "",
                        fund_dev_accounts: false,
                      },
                      batcher_params: { image: "", extra_params: [] },
                      challenger_params: {
                        enabled: false,
                        image: "",
                        extra_params: [],
                        cannon_prestates_path: "",
                        cannon_prestates_url: "",
                      },
                      proposer_params: {
                        image: "",
                        extra_params: [],
                        game_type: 0,
                        proposal_internal: "",
                      },
                      mev_params: {
                        rollup_boost_image: "",
                        builder_host: "",
                        builder_port: "",
                      },
                      additional_services: [],
                      da_server_params: { image: "", cmd: [] },
                    };
                    handleInputChange(
                      "optimism_package",
                      "chains",
                      [...(state.optimism_package.chains || []), newChain]
                    );
                  }}
                >
                  Add Chain
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* OP Contract Deployer */}
          <AccordionItem value="op-contract-deployer">
            <AccordionTrigger>OP Contract Deployer</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deployer-image">Image</Label>
                  <Input
                    id="deployer-image"
                    value={
                      state.optimism_package.op_contract_deployer_params?.image ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "optimism_package.op_contract_deployer_params",
                        "image",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="l1-artifacts-locator">
                    L1 Artifacts Locator
                  </Label>
                  <Input
                    id="l1-artifacts-locator"
                    value={
                      state.optimism_package.op_contract_deployer_params
                        ?.l1_artifacts_locator || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "optimism_package.op_contract_deployer_params",
                        "l1_artifacts_locator",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="l2-artifacts-locator">
                    L2 Artifacts Locator
                  </Label>
                  <Input
                    id="l2-artifacts-locator"
                    value={
                      state.optimism_package.op_contract_deployer_params
                        ?.l2_artifacts_locator || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "optimism_package.op_contract_deployer_params",
                        "l2_artifacts_locator",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}
