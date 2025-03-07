/**
 * This file contains the Zod schemas and TypeScript types corresponding to the
 * JSON structure of the rollup configuration.
 *
 * The configuration includes:
 * • Rollup name
 * • Settlement layer (choose ETH Mainnet, ETH Sepolia, or Custom)
 *   - If "Custom" is selected, chain_id and l1_block_time are required.
 *   - settlement_rpc is always required.
 * • Participants
 *   - Defaults to one op-geth (execution layer) with one op-node (consensus layer)
 *   - Supported EL types: op-geth, op-reth, op-erigon, op-nethermind, op-besu
 *   - Supported CL types: op-node, hildr
 *   - Users can add more participants.
 * • Signer Configuration
 *   - Deployer private key, batcher key or signer endpoint,
 *     sequencer key or signer endpoint, and proposer key or signer endpoint.
 * • Admin configuration
 *   - L1 System Admin (finalSystemOwner) and L2 Proxy Admin (proxyAdminOwner)
 * • Chain configuration
 *   - L2 Chain ID, L2 block time (default 2s), proof maturity delay,
 *     dispute game finality delay seconds,
 *     fee recipient and withdrawal network configuration.
 * • Gas configuration
 *   - Block gas limit, EIP-1559 elasticity, denominators, and fee scalars.
 * • Data Availability configuration
 *   - Data availability provider options:
 *       • ETH Blob + Calldata (auto)
 *       • ETH Blob (blob)
 *       • ETH Calldata (calldata)
 *       • Custom (custom)
 *   - Batch submission frequency
 *   - [If Custom is selected]:
 *       • DA server endpoint
 *       • Commitment type (Generic or Keccak256)
 *         - If Generic, a DA Challenge Contract Address is required
 *       • DA Challenge Window
 *       • DA Resolve Window
 * • Interop Configuration
 *   - Enable interop (Checkbox)
 *   - Dependency set (Array) with:
 *       • Chain ID
 *       • WebSocket RPC Endpoint
 *       • Activation Time
 *       • History minimum time
 */

import { z, ZodError } from "zod";

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
  message: "Invalid address",
});

const urlSchema = z.string().url({
  message: "Invalid URL",
});

/* -------------------------------------------------------------------------
   Settlement Layer Schema
   -------------------------------------------------------------------------*/

const SettlementLayerSchema = z
  .object({
    selection: z.enum(["ETH Mainnet", "ETH Sepolia", "Custom"]),
    chain_id: z.number().optional(),
    l1_block_time: z.number().optional(),
    settlement_rpc: urlSchema,
  })
  .superRefine((data, ctx) => {
    if (data.selection === "Custom") {
      if (!data.chain_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A custom settlement layer requires a chain ID",
          path: ["chain_id"],
        });
      }
      if (!data.l1_block_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A custom settlement layer requires an L1 Block Time (e.g., '15s' or '30s')",
          path: ["l1_block_time"],
        });
      }
    }
  });

/* -------------------------------------------------------------------------
   Participants Schema
   -------------------------------------------------------------------------*/

/**
 * A simplified participant schema with two sections:
 * - Execution layer (EL) with supported types: op-geth, op-reth, op-erigon, op-nethermind, op-besu
 * - Consensus layer (CL) with supported types: op-node, hildr
 */

export const EL_TYPES = [
  "op-geth",
  "op-reth",
  "op-erigon",
  "op-nethermind",
  "op-besu",
] as const;
export const CL_TYPES = ["op-node", "hildr"] as const;

export type EL_TYPES = (typeof EL_TYPES)[number];
export type CL_TYPES = (typeof CL_TYPES)[number];

const ParticipantSchema = z.object({
  // Execution Layer configuration
  el_type: z.enum(EL_TYPES).default(EL_TYPES[0]),
  el_image: z.string().optional(),
  // Consensus Layer configuration
  cl_type: z.enum(CL_TYPES).default(CL_TYPES[0]),
  cl_image: z.string().optional(),
});

/**
 * Participants array defaults to a single participant.
 */
const ParticipantsSchema = z.array(ParticipantSchema).min(1);

/* -------------------------------------------------------------------------
   Signer Configuration Schema
   -------------------------------------------------------------------------*/

const SignerConfigSchema = z.object({
  deployer_private_key: addressSchema,
  type: z.enum(["private_key", "signer_endpoint"]),
  batcher_value: addressSchema,
  sequencer_value: addressSchema,
  proposer_value: addressSchema,
});

/* -------------------------------------------------------------------------
   Admin Configuration Schema
   -------------------------------------------------------------------------*/

const AdminConfigSchema = z.object({
  final_system_owner: addressSchema,
  proxy_admin_owner: addressSchema,
});

/* -------------------------------------------------------------------------
   Chain Configuration Schema
   -------------------------------------------------------------------------*/

/**
 * Chain configuration includes L2 chain settings and fee parameters.
 * - l2_chain_id: The chain ID for the L2 network
 * - l2_block_time: Time between L2 blocks in seconds (default: 2)
 * - proof_maturity_delay_seconds: Delay for proof maturity
 * - disputeGameFinalityDelaySeconds: Extra withdrawal delay after proof finalized
 * - fee_recipient: Address to receive sequencer fees
 * - withdrawal_network: Address for fee withdrawal network
 */

const ChainConfigSchema = z.object({
  l2_chain_id: z.number().min(1),
  l2_block_time: z.number().min(1),
  proof_maturity_delay_seconds: z.number().min(0),
  disputeGameFinalityDelaySeconds: z.number().min(0),
  // Sequencer fee recipient
  fee_recipient: addressSchema,
  // Fee withdrawal network
  withdrawal_network: addressSchema,
});

/* -------------------------------------------------------------------------
   Gas Configuration Schema
   -------------------------------------------------------------------------*/

const GasConfigSchema = z.object({
  l2_genesis_block_gas_limit: z.number().min(1),
  eip1559_elasticity: z.number().min(1),
  eip1559_denominator: z.number().min(1),
  eip1559_denominator_canyon: z.number().min(1),
  gas_price_oracle_base_fee_scalar: z.number().min(1),
  gas_price_oracle_blob_base_fee_scalar: z.number().min(0),
});

/* -------------------------------------------------------------------------
   Data Availability Configuration Schema
   -------------------------------------------------------------------------*/

const BaseDataAvailabilityConfigSchema = z.object({
  batch_submission_frequency: z.number(),
});

// System values for data availability types
export const DA_PROVIDER_SYSTEM_VALUES = {
  AUTO: "auto",
  BLOB: "blob",
  CALLDATA: "calldata",
  CUSTOM: "custom",
} as const;

// Display names for the UI
export const DA_PROVIDER_DISPLAY_NAMES = {
  [DA_PROVIDER_SYSTEM_VALUES.AUTO]: "ETH Blob + Calldata",
  [DA_PROVIDER_SYSTEM_VALUES.BLOB]: "ETH Blob",
  [DA_PROVIDER_SYSTEM_VALUES.CALLDATA]: "ETH Calldata",
  [DA_PROVIDER_SYSTEM_VALUES.CUSTOM]: "Custom",
} as const;

// Array of display names for UI rendering
export const DATA_AVAILABILITY_PROVIDERS = Object.values(
  DA_PROVIDER_DISPLAY_NAMES
);

// Function to convert display name to system value
export const getDAProviderSystemValue = (displayName: string): string => {
  for (const [systemValue, displayNameValue] of Object.entries(
    DA_PROVIDER_DISPLAY_NAMES
  )) {
    if (displayNameValue === displayName) {
      return systemValue;
    }
  }
  return DA_PROVIDER_SYSTEM_VALUES.AUTO; // Default value
};

const NonCustomDataAvailabilityConfigSchema =
  BaseDataAvailabilityConfigSchema.extend({
    data_availability_provider: z.enum([
      DA_PROVIDER_SYSTEM_VALUES.AUTO,
      DA_PROVIDER_SYSTEM_VALUES.BLOB,
      DA_PROVIDER_SYSTEM_VALUES.CALLDATA,
    ]),
  });

const BaseCustomDataAvailabilityConfigSchema =
  BaseDataAvailabilityConfigSchema.extend({
    data_availability_provider: z.literal(DA_PROVIDER_SYSTEM_VALUES.CUSTOM),
    da_server_endpoint: urlSchema,
    commitment_type: z.enum(["Generic", "Keccak256"]),
    da_challenge_contract_address: addressSchema,
    da_challenge_window: z.number().min(1),
    da_resolve_window: z.number().min(1),
  });

// Create a union from plain ZodObjects.
const DataAvailabilityConfigSchemaRaw = z.discriminatedUnion(
  "data_availability_provider",
  [
    NonCustomDataAvailabilityConfigSchema,
    BaseCustomDataAvailabilityConfigSchema,
  ]
);

// Now, apply the extra validation for the Custom case on the union.
const DataAvailabilityConfigSchema =
  DataAvailabilityConfigSchemaRaw.superRefine((data, ctx) => {
    if (
      data.data_availability_provider === DA_PROVIDER_SYSTEM_VALUES.CUSTOM &&
      data.commitment_type === "Generic" &&
      !data.da_challenge_contract_address
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Generic commitment type requires DA Challenge Contract Address",
        path: ["da_challenge_contract_address"],
      });
    }
  });

/* -------------------------------------------------------------------------
   Interop Configuration Schema
   -------------------------------------------------------------------------*/

/**
 * Interop configuration:
 * - enable_interop: Toggle for interop support.
 * - dependency_set: Array of dependencies including chain ID, WebSocket RPC endpoint,
 *   activation time, and history minimum time.
 */
const InteropDependencySchema = z.object({
  chain_id: z.number().min(1),
  websocket_rpc_endpoint: urlSchema,
  activation_time: z.number().min(1),
  history_min_time: z.number().min(0),
});

const InteropConfigurationSchema = z
  .object({
    enable_interop: z.boolean(),
    dependency_set: z.array(InteropDependencySchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.enable_interop &&
      (!data.dependency_set || data.dependency_set.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Interop is enabled but no dependencies provided in dependency set",
        path: ["dependency_set"],
      });
    }
  });

/* -------------------------------------------------------------------------
   Overall Rollup Configuration Schema
   -------------------------------------------------------------------------*/

export const RollupConfigSchema = z
  .object({
    rollup_name: z.string().min(1),
    settlement_layer: SettlementLayerSchema,
    participants: ParticipantsSchema,
    signer_config: SignerConfigSchema,
    admin_config: AdminConfigSchema,
    chain_config: ChainConfigSchema,
    gas_config: GasConfigSchema,
    data_availability_config: DataAvailabilityConfigSchema,
    interop_config: InteropConfigurationSchema,
  })
  .superRefine((data, ctx) => {
    const { l1_block_time } = data.settlement_layer;
    const { l2_block_time } = data.chain_config;
    const { selection } = data.settlement_layer;
    console.log("l1_block_time", l1_block_time);
    console.log("l2_block_time", l2_block_time);
    console.log("selection", selection);
    // TODO: This doesnt work for any settlemnt layer, dont know why`
    if (selection === "Custom") {
      if (!l1_block_time || l2_block_time > l1_block_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `L2 block time cannot be greater than L1 block time (${l1_block_time}s)`,
          path: ["chain_config", "l2_block_time"],
        });
      }
    } else if (l2_block_time >= 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `L2 block time cannot be greater than 14s for ${selection}`,
        path: ["chain_config", "l2_block_time"],
      });
    }
  });

/* -------------------------------------------------------------------------
   Inferred TypeScript Types
   -------------------------------------------------------------------------*/

export type SettlementLayer = z.infer<typeof SettlementLayerSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type AdminConfig = z.infer<typeof AdminConfigSchema>;
export type ChainConfig = z.infer<typeof ChainConfigSchema>;
export type GasConfig = z.infer<typeof GasConfigSchema>;
export type DataAvailabilityConfig = z.infer<
  typeof DataAvailabilityConfigSchema
>;
export type InteropConfig = z.infer<typeof InteropConfigurationSchema>;
export type RollupConfig = z.infer<typeof RollupConfigSchema>;

/* -------------------------------------------------------------------------
   Utility Functions
   -------------------------------------------------------------------------*/

/**
 * Validates and parses the rollup configuration object.
 *
 * @param data - The raw configuration data to validate.
 * @returns An object with success status, the validated configuration,
 *          and error details if validation fails.
 */
export function parseConfig(data: unknown): {
  success: boolean;
  data: RollupConfig;
  error: ZodError | null;
} {
  const result = RollupConfigSchema.safeParse(data);
  if (!result.success) {
    console.error(
      "Rollup configuration validation errors:",
      result.error.issues
    );
    return {
      success: false,
      data: data as RollupConfig,
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
 * Converts a rollup configuration object into a JSON string.
 *
 * @param config - The rollup configuration object to stringify.
 * @returns A formatted JSON string representation of the configuration.
 */
export function stringifyRollupConfig(config: RollupConfig): string {
  // Create a copy of the config object without undefined values
  const cleanConfig = JSON.parse(JSON.stringify(config));

  // If the "other" section is empty, remove it
  if (cleanConfig.other && Object.keys(cleanConfig.other).length === 0) {
    delete cleanConfig.other;
  }

  return JSON.stringify(cleanConfig, null, 2);
}
