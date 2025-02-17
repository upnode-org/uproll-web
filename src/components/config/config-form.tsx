"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ConfigForm() {
  const [config, setConfig] = useState({
    optimism_package: {
      observability: {
        enabled: true,
        prometheus_params: {
          storage_tsdb_retention_time: "1d",
          storage_tsdb_retention_size: "512MB",
          min_cpu: 10,
          max_cpu: 1000,
          min_mem: 128,
          max_mem: 2048,
          image: "prom/prometheus:latest",
        },
        grafana_params: {
          dashboard_sources: [],
          min_cpu: 10,
          max_cpu: 1000,
          min_mem: 128,
          max_mem: 2048,
          image: "grafana/grafana:latest",
        },
      },
      interop: {
        enabled: false,
        supervisor_params: {
          image: "",
          dependency_set: "",
          extra_params: [],
        },
      },
      global_log_level: "info",
    },
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement config creation logic
    console.log("Creating config:", config)
    router.push("/config/view")
  }

  const handleChange = (section: string, subsection: string, field: string, value: any) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      optimism_package: {
        ...prevConfig.optimism_package,
        [section]: {
          ...prevConfig.optimism_package[section as keyof typeof prevConfig.optimism_package],
          [subsection]: {
            ...prevConfig.optimism_package[section as keyof typeof prevConfig.optimism_package][subsection as any],
            [field]: value,
          },
        },
      },
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="observability">
          <AccordionTrigger>Observability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="observability-enabled"
                  checked={config.optimism_package.observability.enabled}
                  onCheckedChange={(checked) => handleChange("observability", "enabled", "", checked)}
                />
                <Label htmlFor="observability-enabled">Enabled</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prometheus-retention-time">Prometheus Retention Time</Label>
                <Input
                  id="prometheus-retention-time"
                  value={config.optimism_package.observability.prometheus_params.storage_tsdb_retention_time}
                  onChange={(e) =>
                    handleChange("observability", "prometheus_params", "storage_tsdb_retention_time", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prometheus-retention-size">Prometheus Retention Size</Label>
                <Input
                  id="prometheus-retention-size"
                  value={config.optimism_package.observability.prometheus_params.storage_tsdb_retention_size}
                  onChange={(e) =>
                    handleChange("observability", "prometheus_params", "storage_tsdb_retention_size", e.target.value)
                  }
                />
              </div>
              {/* Add more fields for prometheus_params and grafana_params */}
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
                  checked={config.optimism_package.interop.enabled}
                  onCheckedChange={(checked) => handleChange("interop", "enabled", "", checked)}
                />
                <Label htmlFor="interop-enabled">Enabled</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor-image">Supervisor Image</Label>
                <Input
                  id="supervisor-image"
                  value={config.optimism_package.interop.supervisor_params.image}
                  onChange={(e) => handleChange("interop", "supervisor_params", "image", e.target.value)}
                />
              </div>
              {/* Add more fields for supervisor_params */}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="space-y-2">
        <Label htmlFor="global-log-level">Global Log Level</Label>
        <Input
          id="global-log-level"
          value={config.optimism_package.global_log_level}
          onChange={(e) =>
            setConfig((prevConfig) => ({
              ...prevConfig,
              optimism_package: {
                ...prevConfig.optimism_package,
                global_log_level: e.target.value,
              },
            }))
          }
        />
      </div>
      <Button type="submit">Create Config</Button>
    </form>
  )
}

