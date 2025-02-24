"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema"; // Our top-level form type
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormInputField from "./Components/FormInput";

export default function ObservabilityForm() {
  const { register } = useFormContext<Config>();
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Prometheus Params</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormInputField 
          name="optimism_package.observability.prometheus_params.storage_tsdb_retention_time" 
          label="Retention Time" 
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.storage_tsdb_retention_size" 
          label="Retention Size" 
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.min_cpu" 
          label="Min CPU" 
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.max_cpu" 
          label="Max CPU"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.min_mem" 
          label="Min Memory"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.max_mem" 
          label="Max Memory"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.prometheus_params.image" 
          label="Image"
          />
        </div>

      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Grafana Params</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* TODO: Create a component for dashboard sources */}
          <div className="col-span-2">
            <Label>Dashboard Sources</Label>
            <Textarea
              {...register("optimism_package.observability.grafana_params.dashboard_sources")}
            />
          </div>
          <FormInputField 
          name="optimism_package.observability.grafana_params.min_cpu" 
          label="Min CPU"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.grafana_params.max_cpu" 
          label="Max CPU"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.grafana_params.min_mem" 
          label="Min Memory"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.grafana_params.max_mem" 
          label="Max Memory"
          type="number"
          />
          <FormInputField 
          name="optimism_package.observability.grafana_params.image" 
          label="Image"
          />
        </div>
      </div>
    </div>
  );
}