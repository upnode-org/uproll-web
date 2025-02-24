/**
 * This file contains the Zod schemas and TypeScript types corresponding to the
 * JSON structure of the configuration.
 *
 * This simplifies the configuration schema.
 *
 * Because Prisma schema relations and CRUD operations are over complex, we use a
 * JSON field  in the configuration table to store the configuration data.
 */

import { z, ZodError } from "zod";

export const OPERATOR_TYPES = ["EQUAL", "EXISTS"] as const;
export type OperatorType = (typeof OPERATOR_TYPES)[number];

export const EFFECT_TYPES = [
  "NO_SCHEDULE",
  "NO_EXECUTE",
  "PREFER_NO_SCHEDULE",
] as const;
export type EffectType = (typeof EFFECT_TYPES)[number];

const TolerationSchema = z.object({
  key: z.string(),
  operator: z.enum(OPERATOR_TYPES),
  value: z.string(),
  effect: z.enum(EFFECT_TYPES),
  toleration_seconds: z.number().optional(),
});

/* -------------------------------------------------------------------------
     Optimism Package Schemas
     -------------------------------------------------------------------------*/

// Prometheus configuration for observability
const PrometheusParamsSchema = z.object({
  storage_tsdb_retention_time: z.string(),
  storage_tsdb_retention_size: z.string(),
  min_cpu: z.number(),
  max_cpu: z.number(),
  min_mem: z.number(),
  max_mem: z.number(),
  image: z.string(),
});

// Grafana configuration for observability
const GrafanaParamsSchema = z.object({
  dashboard_sources: z.array(
    z.object({
      value: z.string(),
    })
  ),
  min_cpu: z.number(),
  max_cpu: z.number(),
  min_mem: z.number(),
  max_mem: z.number(),
  image: z.string(),
});

// Observability configuration
const ObservabilitySchema = z.object({
  enabled: z.boolean(),
  prometheus_params: PrometheusParamsSchema,
  grafana_params: GrafanaParamsSchema,
});

// Supervisor configuration for interop mode
const SupervisorParamsSchema = z.object({
  image: z.string(),
  dependency_set: z.string(),
  extra_params: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

// Interop configuration
const InteropSchema = z.object({
  enabled: z.boolean(),
  supervisor_params: SupervisorParamsSchema,
});

// AltDA deploy configuration
// TODO: Repo says some of this may be removed/not needed
const AltdaDeployConfigSchema = z.object({
  use_altda: z.boolean(),
  da_commitment_type: z.string(), // e.g. "KeccakCommitment"
  da_challenge_window: z.number(),
  da_resolve_window: z.number(),
  da_bond_size: z.number(),
  da_resolver_refund_percentage: z.number(),
});

/* -------------------------------------------------------------------------
     Participant & Chain Schemas
     -------------------------------------------------------------------------*/

export const LOG_LEVELS = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const EL_TYPES = [
  "op-geth",
  "op-reth",
  "op-erigon",
  "op-nethermind",
  "op-besu",
] as const;
export type ELType = (typeof EL_TYPES)[number];

export const CL_TYPES = ["op-node", "hildr"] as const;
export type CLType = (typeof CL_TYPES)[number];

const record = z.array(z.object({
  key: z.string(),
  value: z.string(),
}))

export type Record = z.infer<typeof record>;

// Schema for a single participant within a chain.
const ParticipantSchema = z.object({
  // EL (Execution Layer) specific parameters
  el_type: z.enum(EL_TYPES),
  el_image: z.string(),
  el_log_level: z.enum(LOG_LEVELS),
  el_extra_env_vars: record,
  el_extra_labels: record,
  el_extra_params: z.array(z.object({
    value: z.string(),
  })),
  el_tolerations: z.array(TolerationSchema),
  el_volume_size: z.number(),
  el_min_cpu: z.number(),
  el_max_cpu: z.number(),
  el_min_mem: z.number(),
  el_max_mem: z.number(),

  // CL (Consensus Layer) specific parameters
  cl_type: z.enum(CL_TYPES),
  cl_image: z.string(),
  cl_log_level: z.enum(LOG_LEVELS),
  cl_extra_env_vars: record,
  cl_extra_labels: record,
  cl_extra_params: z.array(
    z.object({
      value: z.string(),
    })
  ),
  cl_tolerations: z.array(TolerationSchema),
  cl_volume_size: z.number(),
  cl_min_cpu: z.number(),
  cl_max_cpu: z.number(),
  cl_min_mem: z.number(),
  cl_max_mem: z.number(),

  // Builder client specific flags
  el_builder_type: z.string(),
  el_builder_image: z.string(),
  cl_builder_type: z.string(),
  cl_builder_image: z.string(),

  // Participant-level configurations
  node_selectors: record,
  // Global tolerations for the participant
  tolerations: z.array(TolerationSchema),
  count: z.number(),
});

// Network parameters for each chain
const NetworkParamsSchema = z.object({
  network: z.string(),
  network_id: z.string(),
  seconds_per_slot: z.number(),
  name: z.string(),
  // These time offsets are provided as numbers, as per the spec.
  fjord_time_offset: z.number(),
  granite_time_offset: z.number(),
  // These time offsets are provided as empty strings when not activated.
  holocene_time_offset: z.string(),
  isthmus_time_offset: z.string(),
  interop_time_offset: z.string(),
  fund_dev_accounts: z.boolean(),
});

// Batcher configuration
const BatcherParamsSchema = z.object({
  image: z.string(),
  extra_params: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

// Challenger configuration
const ChallengerParamsSchema = z.object({
  enabled: z.boolean(),
  image: z.string(),
  extra_params: z.array(
    z.object({
      value: z.string(),
    })
  ),
  cannon_prestates_path: z.string(),
  cannon_prestates_url: z.string(),
});

// Proposer configuration
const ProposerParamsSchema = z.object({
  image: z.string(),
  extra_params: z.array(
    z.object({
      value: z.string(),
    })
  ),
  game_type: z.number(),
  proposal_internal: z.string(),
});

// MEV configuration
const MevParamsSchema = z.object({
  rollup_boost_image: z.string(),
  builder_host: z.string(),
  builder_port: z.string(),
});

// DA Server configuration
const DaServerParamsSchema = z.object({
  image: z.string(),
  cmd: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

// Chain configuration (L2 network)
const ChainSchema = z.object({
  participants: z.array(ParticipantSchema),
  network_params: NetworkParamsSchema,
  batcher_params: BatcherParamsSchema,
  challenger_params: ChallengerParamsSchema,
  proposer_params: ProposerParamsSchema,
  mev_params: MevParamsSchema,
  additional_services: z.array(
    z.object({
      value: z.string(),
    })
  ),
  da_server_params: DaServerParamsSchema,
});

// L2 contract deployer configuration
const OpContractDeployerParamsSchema = z.object({
  image: z.string(),
  l1_artifacts_locator: z.string(),
  l2_artifacts_locator: z.string(),
});

// Optimism package overall configuration
const OptimismPackageSchema = z.object({
  observability: ObservabilitySchema,
  interop: InteropSchema,
  altda_deploy_config: AltdaDeployConfigSchema,
  chains: z.array(ChainSchema),
  op_contract_deployer_params: OpContractDeployerParamsSchema,
  global_log_level: z.enum(LOG_LEVELS),
  global_node_selectors: record,
  global_tolerations: z.array(TolerationSchema),
  persistent: z.boolean(),
});

/* -------------------------------------------------------------------------
     Ethereum Package Schema
     -------------------------------------------------------------------------*/

const EthereumPackageSchema = z.object({
  network_params: z.object({
    preset: z.string(),
    genesis_delay: z.number(),
    additional_preloaded_contracts: z.string(),
  }),
});

/* -------------------------------------------------------------------------
     Main Config Schema
     -------------------------------------------------------------------------*/

// The overall configuration includes both the optimism_package and ethereum_package.
export const ConfigSchema = z.object({
  optimism_package: OptimismPackageSchema,
  ethereum_package: EthereumPackageSchema,
});

// Inferred TypeScript type from schemas
export type Toleration = z.infer<typeof TolerationSchema>;
export type PrometheusParams = z.infer<typeof PrometheusParamsSchema>;
export type GrafanaParams = z.infer<typeof GrafanaParamsSchema>;
export type Observability = z.infer<typeof ObservabilitySchema>;
export type SupervisorParams = z.infer<typeof SupervisorParamsSchema>;
export type Interop = z.infer<typeof InteropSchema>;
export type AltdaDeployConfig = z.infer<typeof AltdaDeployConfigSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type NetworkParams = z.infer<typeof NetworkParamsSchema>;
export type BatcherParams = z.infer<typeof BatcherParamsSchema>;
export type ChallengerParams = z.infer<typeof ChallengerParamsSchema>;
export type ProposerParams = z.infer<typeof ProposerParamsSchema>;
export type MevParams = z.infer<typeof MevParamsSchema>;
export type DaServerParams = z.infer<typeof DaServerParamsSchema>;
export type Chain = z.infer<typeof ChainSchema>;
export type OpContractDeployerParams = z.infer<
  typeof OpContractDeployerParamsSchema
>;
export type OptimismPackage = z.infer<typeof OptimismPackageSchema>;
export type EthereumPackage = z.infer<typeof EthereumPackageSchema>;
export type Config = z.infer<typeof ConfigSchema>;

/* -------------------------------------------------------------------------
     Utility Functions
     -------------------------------------------------------------------------*/

/**
 * Validates and parses the configuration object (parsed from YAML or JSON).
 *
 * @param data - The raw configuration data to validate.
 * @returns The validated configuration object typed as `Config`.
 * @throws An error with detailed message, if validation fails.
 */
export function parseConfig(data: unknown): {
  success: boolean;
  data: Config;
  error: ZodError | null;
} {
  const result = ConfigSchema.safeParse(data);
  if (!result.success) {
    console.error("Configuration validation errors:", result.error.issues);
    return {
      success: false,
      data: data as Config,
      error: result.error,
    };
  }
  return {
    success: true,
    data: result.data,
    error: null,
  };
}

/**
 * Converts a configuration object into a JSON string.
 *
 * @param config - The configuration object to stringify.
 * @returns A JSON string representation of the configuration.
 */
export function stringifyConfig(config: Config): string {
  return JSON.stringify(config, null, 2);
}
