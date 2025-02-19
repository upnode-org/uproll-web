"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Download, Save, Trash2 } from "lucide-react"
import { v4 } from "uuid"
import CommandCopy from "../CommandCopy"
import { toast } from "@/hooks/use-toast"
import { updateConfig, postConfig, deleteConfig } from "@/services/client/config"
import { ConfigurationDetailResponse } from "@/services/server/configuration"
import { defaultConfig } from "@/const/deafultConfig"
import { CreateConfigurationDTO } from "@/app/api/configs/route"

// ----------------------------------------------------------------------
// Helper: set a nested value on an object given a full dot-notation path,
// supporting array indexes using bracket notation (e.g. "chains[0].networkParams")
function setNestedValue(obj: any, path: string, value: any) {
  const parts = path.split(".")
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const arrayRegex = /(.*?)\[(\d+)\]$/
    const match = arrayRegex.exec(part)
    if (match) {
      const arrayName = match[1]
      const index = parseInt(match[2], 10)
      if (!current[arrayName]) {
        current[arrayName] = []
      }
      if (!current[arrayName][index]) {
        current[arrayName][index] = {}
      }
      current = current[arrayName][index]
    } else {
      if (!current[part]) {
        current[part] = {}
      }
      current = current[part]
    }
  }
  // Set the value on the last part
  const lastPart = parts[parts.length - 1]
  const arrayRegex = /(.*?)\[(\d+)\]$/
  const match = arrayRegex.exec(lastPart)
  if (match) {
    const arrayName = match[1]
    const index = parseInt(match[2], 10)
    if (!current[arrayName]) {
      current[arrayName] = []
    }
    current[arrayName][index] = value
  } else {
    current[lastPart] = value
  }
}

// ----------------------------------------------------------------------
// Updated handleInputChange that combines "path" and "field" into one full path.
function useHandleInputChange(
  config: any,
  setConfig: (config: any) => void
) {
  return (path: string, field: string, value: any) => {
    setConfig((prevConfig: any) => {
      const newConfig = { ...prevConfig }
      // If path is provided, combine with field; otherwise update the top-level.
      const fullPath = path ? `${path}.${field}` : field
      setNestedValue(newConfig, fullPath, value)
      return newConfig
    })
  }
}

export function ConfigDetails({ id, initialConfig }: { id?: string, initialConfig?: ConfigurationDetailResponse }) {
  const [config, setConfig] = useState<ConfigurationDetailResponse>(initialConfig || defaultConfig)
  const handleInputChange = useHandleInputChange(config, setConfig)

  const handleDownload = () => {
    // TODO: Implement download logic for existing configs
    console.log("Downloading config:", id)
    toast({
      title: "Config downloaded",
      description: "Your config has been downloaded successfully",
    })
  }

  async function handleSave() {
    const saveConfig = async () => {
      if (!config) {
        throw new Error("No config provided")
      }
      try {
        let response = null;
        if (id) {
          response = await updateConfig(config as CreateConfigurationDTO, id)
        } else {
          console.log("Creating new config");
          response = await postConfig(config as CreateConfigurationDTO)
        }

        if (response.success) {
          return "Configuration saved!"
        } else {
          throw new Error("Failed to save configuration")
        }
      } catch (error) {
        console.error(error)
      }
    }

    try {
      const result = await toast.promise(saveConfig(), {
        loading: {
          title: id ? "Saving config..." : "Creating config...",
          description: "Please wait.",
        },
        success: {
          title: "Success!",
          description: id
            ? "Your configuration has been saved."
            : "Your configuration has been created.",
        },
        error: {
          title: "Error",
          description: "Failed to save configuration.",
        },
      })
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    // TODO: Implement delete logic for existing configs
    const removeConfig = async () => {
      if (!id) {
        throw new Error("No config id provided")
      }
      try {
        const response = await deleteConfig(id)
        if (response) {
          return "Configuration deleted!"
        } else {
          throw new Error("Failed to delete configuration")
        }
      } catch (error) {
        console.error(error)
      }
    }

    try {
      const result = await toast.promise(removeConfig(), {
        loading: {
          title: id ? "Saving config..." : "Creating config...",
          description: "Please wait.",
        },
        success: {
          title: "Success!",
          description: id
            ? "Your configuration has been saved."
            : "Your configuration has been created.",
        },
        error: {
          title: "Error",
          description: "Failed to save configuration.",
        },
      })
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  if (!config) {
    return <div>No config found</div>
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" /> {config.id ? "Save" : "Create"}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4" /> Download
          </Button>
          <CommandCopy
            command={
              config.id
                ? `uproll deploy ${config.id}`
                : `Save to generate a deploy command`
            }
            disabled={!config.id}
          />
        </div>
        {config.id && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        )}
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={config.name || ""}
              onChange={(e) =>
                handleInputChange("", "name", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="globalLogLevel">Global Log Level</Label>
            <Select
              value={config.globalLogLevel || ""}
              onValueChange={(value) =>
                handleInputChange("", "globalLogLevel", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent>
                {["ERROR", "WARN", "INFO", "DEBUG", "TRACE"].map(
                  (level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="persistent"
            checked={config.persistent || false}
            onCheckedChange={(checked) =>
              handleInputChange("", "persistent", checked)
            }
          />
          <Label htmlFor="persistent">Persistent</Label>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="observability">
            <AccordionTrigger>Observability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="observability-enabled"
                    checked={config.observability?.enabled || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("observability", "enabled", checked)
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
                          config.observability?.prometheusParams
                            ?.storageTsdbRetentionTime || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "storageTsdbRetentionTime",
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
                          config.observability?.prometheusParams
                            ?.storageTsdbRetentionSize || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "storageTsdbRetentionSize",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-min-cpu">
                        Min CPU
                      </Label>
                      <Input
                        id="prometheus-min-cpu"
                        type="number"
                        value={
                          config.observability?.prometheusParams?.minCpu ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "minCpu",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-max-cpu">
                        Max CPU
                      </Label>
                      <Input
                        id="prometheus-max-cpu"
                        type="number"
                        value={
                          config.observability?.prometheusParams?.maxCpu ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "maxCpu",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-min-mem">
                        Min Memory
                      </Label>
                      <Input
                        id="prometheus-min-mem"
                        type="number"
                        value={
                          config.observability?.prometheusParams?.minMem ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "minMem",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-max-mem">
                        Max Memory
                      </Label>
                      <Input
                        id="prometheus-max-mem"
                        type="number"
                        value={
                          config.observability?.prometheusParams?.maxMem ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "maxMem",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="prometheus-image">
                        Image
                      </Label>
                      <Input
                        id="prometheus-image"
                        value={
                          config.observability?.prometheusParams?.image ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.prometheusParams",
                            "image",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Grafana Params
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="grafana-dashboard-sources">
                        Dashboard Sources
                      </Label>
                      <Textarea
                        id="grafana-dashboard-sources"
                        value={JSON.stringify(
                          config.observability?.grafanaParams
                            ?.dashboardSources || {},
                          null,
                          2
                        )}
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
                            "dashboardSources",
                            JSON.parse(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-min-cpu">
                        Min CPU
                      </Label>
                      <Input
                        id="grafana-min-cpu"
                        type="number"
                        value={
                          config.observability?.grafanaParams?.minCpu ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
                            "minCpu",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-max-cpu">
                        Max CPU
                      </Label>
                      <Input
                        id="grafana-max-cpu"
                        type="number"
                        value={
                          config.observability?.grafanaParams?.maxCpu ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
                            "maxCpu",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-min-mem">
                        Min Memory
                      </Label>
                      <Input
                        id="grafana-min-mem"
                        type="number"
                        value={
                          config.observability?.grafanaParams?.minMem ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
                            "minMem",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-max-mem">
                        Max Memory
                      </Label>
                      <Input
                        id="grafana-max-mem"
                        type="number"
                        value={
                          config.observability?.grafanaParams?.maxMem ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
                            "maxMem",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grafana-image">
                        Image
                      </Label>
                      <Input
                        id="grafana-image"
                        value={
                          config.observability?.grafanaParams?.image ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "observability.grafanaParams",
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

          <AccordionItem value="interop">
            <AccordionTrigger>Interop</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interop-enabled"
                    checked={config.interop?.enabled || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("interop", "enabled", checked)
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
                      <Label htmlFor="supervisor-image">
                        Image
                      </Label>
                      <Input
                        id="supervisor-image"
                        value={
                          config.interop?.supervisorParams?.image || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "interop.supervisorParams",
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
                          config.interop?.supervisorParams
                            ?.dependencySet || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "interop.supervisorParams",
                            "dependencySet",
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
                          config.interop?.supervisorParams
                            ?.extraParams || {},
                          null,
                          2
                        )}
                        onChange={(e) =>
                          handleInputChange(
                            "interop.supervisorParams",
                            "extraParams",
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

          <AccordionItem value="altda-deploy-config">
            <AccordionTrigger>AltDA Deploy Config</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-altda"
                    checked={config.altdaDeployConfig?.useAltda || false}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "altdaDeployConfig",
                        "useAltda",
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
                      config.altdaDeployConfig?.daCommitmentType || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "altdaDeployConfig",
                        "daCommitmentType",
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
                        config.altdaDeployConfig?.daChallengeWindow || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "altdaDeployConfig",
                          "daChallengeWindow",
                          Number.parseInt(e.target.value)
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
                        config.altdaDeployConfig?.daResolveWindow || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "altdaDeployConfig",
                          "daResolveWindow",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="da-bond-size">
                      DA Bond Size
                    </Label>
                    <Input
                      id="da-bond-size"
                      type="number"
                      value={
                        config.altdaDeployConfig?.daBondSize || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "altdaDeployConfig",
                          "daBondSize",
                          Number.parseInt(e.target.value)
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
                        config.altdaDeployConfig
                          ?.daResolverRefundPercentage || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "altdaDeployConfig",
                          "daResolverRefundPercentage",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="chains">
            <AccordionTrigger>Chains</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {config.chains?.map((chain: any, index: number) => (
                  <Accordion type="single" collapsible className="w-full" key={chain.id}>
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
                                  chain.networkParams?.network || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `chains[${index}].networkParams`,
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
                                  chain.networkParams?.networkId || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    `chains[${index}].networkParams`,
                                    "networkId",
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
                                (participant: any, pIndex: number) => (
                                  <div
                                    key={participant.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Select
                                      value={participant.elType}
                                      onValueChange={(value) =>
                                        handleInputChange(
                                          `chains[${index}].participants[${pIndex}]`,
                                          "elType",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select EL type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[
                                          "OP_GETH",
                                          "OP_RETH",
                                          "OP_ERIGON",
                                          "OP_NETHERMIND",
                                          "OP_BESU",
                                        ].map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      value={participant.clType}
                                      onValueChange={(value) =>
                                        handleInputChange(
                                          `chains[${index}].participants[${pIndex}]`,
                                          "clType",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select CL type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {["OP_NODE", "HILD"].map((type) => (
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
                                        ]
                                        newParticipants.splice(pIndex, 1)
                                        handleInputChange(
                                          `chains[${index}]`,
                                          "participants",
                                          newParticipants
                                        )
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
                                    elType: "OP_GETH",
                                    clType: "OP_NODE",
                                  }
                                  handleInputChange(
                                    `chains[${index}]`,
                                    "participants",
                                    [
                                      ...(chain.participants || []),
                                      newParticipant,
                                    ]
                                  )
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
                      networkParams: { network: "", networkId: "" },
                      participants: [],
                    }
                    handleInputChange("", "chains", [
                      ...(config.chains || []),
                      newChain,
                    ])
                  }}
                >
                  Add Chain
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="op-contract-deployer">
            <AccordionTrigger>OP Contract Deployer</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deployer-image">Image</Label>
                  <Input
                    id="deployer-image"
                    value={config.opContractDeployer?.image || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "opContractDeployer",
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
                      config.opContractDeployer?.l1ArtifactsLocator || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "opContractDeployer",
                        "l1ArtifactsLocator",
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
                      config.opContractDeployer?.l2ArtifactsLocator || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "opContractDeployer",
                        "l2ArtifactsLocator",
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
  )
}
