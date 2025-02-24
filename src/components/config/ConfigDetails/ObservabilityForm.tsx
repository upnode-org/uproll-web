"use client";

import { useFormContext } from "react-hook-form";
import { Config } from "@/lib/configSchema"; // Our top-level form type
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import defaultConfig from "@/const/defaultConfig";
import FormCheckbox from "./Components/FormCheckbox";
import FormInputField from "./Components/FormInput";

export default function ObservabilityForm() {
  const { register } = useFormContext<Config>();

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Prometheus Params</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormInputField 
          name={"optimism_package.observability.prometheus_params.storage_tsdb_retention_time"} 
          label="Retention Time" />
          <div>
            <Label>Retention Time</Label>
            <Input
              {...register("optimism_package.observability.prometheus_params.storage_tsdb_retention_time")}
            />
          </div>
          <div>
            <Label>Retention Size</Label>
            <Input
              {...register("optimism_package.observability.prometheus_params.storage_tsdb_retention_size")}
            />
          </div>
          <div>
            <Label>Min CPU</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.prometheus_params.min_cpu", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Max CPU</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.prometheus_params.max_cpu", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Min Memory</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.prometheus_params.min_mem", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Max Memory</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.prometheus_params.max_mem", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Image</Label>
            <Input
              {...register("optimism_package.observability.prometheus_params.image")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Grafana Params</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Dashboard Sources</Label>
            <Textarea
              {...register("optimism_package.observability.grafana_params.dashboard_sources")}
            />
          </div>
          <div>
            <Label>Min CPU</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.grafana_params.min_cpu", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Max CPU</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.grafana_params.max_cpu", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Min Memory</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.grafana_params.min_mem", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Max Memory</Label>
            <Input
              type="number"
              {...register("optimism_package.observability.grafana_params.max_mem", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label>Image</Label>
            <Input
              {...register("optimism_package.observability.grafana_params.image")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}