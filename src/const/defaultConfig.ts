import { Config, Toleration, Chain } from "@/lib/configSchema";

const defaultConfig: Required<Config> = {
  optimism_package: {
    global_log_level: "INFO",
    global_node_selectors: [] as Array<{ value: string; key: string }>,
    persistent: false,
    global_tolerations: [] as Toleration[],
    chains: [] as Chain[],
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
        dashboard_sources: [] as Array<{ value: string }>,
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
        extra_params: [] as Array<{ value: string }>,
      },
    },
    altda_deploy_config: {
      use_altda: false,
      da_commitment_type: "KeccakCommitment",
      da_challenge_window: 100,
      da_resolve_window: 100,
      da_bond_size: 0,
      da_resolver_refund_percentage: 0,
    },
    op_contract_deployer_params: {
      image: "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-deployer:v0.0.11",
      l1_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-c193a1863182092bc6cb723e523e8313a0f4b6e9c9636513927f1db74c047c15.tar.gz",
      l2_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-c193a1863182092bc6cb723e523e8313a0f4b6e9c9636513927f1db74c047c15.tar.gz",
    },
  },
  ethereum_package: {
    network_params: {
      preset: "minimal",
      genesis_delay: 5,
      additional_preloaded_contracts: `
        {
          "0x4e59b44847b379578588920cA78FbF26c0B4956C": {
            "balance": "0ETH",
            "code": "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3",
            "storage": {},
            "nonce": "1"
          }
        }
      `,
    },
  },
};

export default defaultConfig;