"use client";
import FormInputField from "./Components/FormInput";
import FormFieldArray from "./Components/FormFieldArray";
export default function ObservabilityForm() {
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
          <FormFieldArray
            fieldArrayName="optimism_package.observability.grafana_params.dashboard_sources"
            label="Dashboard Sources"
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
  );
}