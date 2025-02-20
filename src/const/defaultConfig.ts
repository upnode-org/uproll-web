import { Config } from "@/lib/configSchema";

const defaultConfig: Required<Config> = {
  optimism_package: {
    global_log_level: "INFO",
    global_node_selectors: {},
    persistent: false,
    global_tolerations: [],
    observability: {
      enabled: true,
      prometheus_params: {
        storage_tsdb_retention_time: "1d",
        storage_tsdb_retention_size: "512MB",
        min_cpu: 100,
        max_cpu: 200,
        min_mem: 256,
        max_mem: 512,
        image: "prom-image:latest",
      },
      grafana_params: {
        dashboard_sources: [],
        min_cpu: 50,
        max_cpu: 100,
        min_mem: 128,
        max_mem: 256,
        image: "grafana-image:latest",
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
    altda_deploy_config: {
      use_altda: false,
      da_commitment_type: "",
      da_challenge_window: 0,
      da_resolve_window: 0,
      da_bond_size: 0,
      da_resolver_refund_percentage: 0,
    },
    chains: [],
    op_contract_deployer_params: {
      image: "example-image:latest",
      l1_artifacts_locator: "",
      l2_artifacts_locator: "",
    },
  },
  ethereum_package: {
    network_params: {
      preset: "",
      genesis_delay: 0,
      additional_preloaded_contracts: "",
    },
  },
};

export default defaultConfig;