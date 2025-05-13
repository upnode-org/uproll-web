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
 *       • Commitment type (Generic or KeccakCommitment)
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

const privateKeySchema = z.string().regex(/^(0x)?[0-9a-fA-F]{64}$/, {
  message: "Invalid private key, must be 64 character long hex string",
});

/* -------------------------------------------------------------------------
   Settlement Layer Schema
   -------------------------------------------------------------------------*/

const SettlementLayerSchema = z
  .object({
    selection: z.enum(["ETH Mainnet", "ETH Sepolia", "Custom"]),
    chain_id: z.number().optional(),
    // l1_block_time: z.number().optional(),
    execution_rpc: urlSchema,
    use_same_rpc: z.boolean().default(true),
    consensus_rpc: urlSchema.optional(),
    el_ws_url: urlSchema.optional(),
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
      // if (!data.l1_block_time) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message:
      //       "A custom settlement layer requires an L1 Block Time (e.g., '15s' or '30s')",
      //     path: ["l1_block_time"],
      //   });
      // }
    }
    if (!data.use_same_rpc && !data.consensus_rpc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Consensus Layer RPC is required when using different RPCs",
        path: ["consensus_rpc"],
      });
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

const PrivateKeySignerSchema = z.object({
  type: z.literal("private_key"),
  batcher_private_key: privateKeySchema,
  sequencer_private_key: privateKeySchema,
  proposer_private_key: privateKeySchema,
  challenger_private_key: privateKeySchema,
});

const EndpointSignerSchema = z.object({
  type: z.literal("signer_endpoint"),
  batcher_endpoint: urlSchema,
  batcher_address: addressSchema,
  sequencer_endpoint: urlSchema,
  sequencer_address: addressSchema,
  proposer_endpoint: urlSchema,
  proposer_address: addressSchema,
  challenger_endpoint: urlSchema,
  challenger_address: addressSchema,
});

const SignerConfigSchema = z.discriminatedUnion("type", [
  PrivateKeySignerSchema,
  EndpointSignerSchema,
]).and(z.object({
  deployer_private_key: privateKeySchema,
}));

/* -------------------------------------------------------------------------
   Admin Configuration Schema
   -------------------------------------------------------------------------*/

// const AdminConfigSchema = z.object({
//   final_system_owner: addressSchema,
//   proxy_admin_owner: addressSchema,
// });

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
  dispute_game_finality_delay: z.number().min(0),
  // Sequencer fee recipient
  // currently this is being set equal to the address of the deployer
  // fee_recipient: addressSchema,
  // Fee withdrawal network
  fee_withdrawal_network: z.enum(["L1", "L2"]),
});

/* -------------------------------------------------------------------------
   Gas Configuration Schema
   -------------------------------------------------------------------------*/

const GasConfigSchema = z.object({
  l2_genesis_block_gas_limit: z.number().min(1),
  eip1559_elasticity: z.number().min(1),
  eip1559_denominator: z.number().min(1),
  gas_price_oracle_base_fee_scalar: z.number().min(1),
  gas_price_oracle_blob_base_fee_scalar: z.number().min(0),
  // extra_withdrawal_delay: z.number().min(0),
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
  BLOB: "blobs",
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
    commitment_type: z.enum(["Generic", "KeccakCommitment"]),
    da_challenge_contract_address: z.string().optional(),
    da_challenge_window: z.number().min(1),
    da_resolve_window: z.number().min(1),
    da_bond_size: z.number().min(0),
    da_bond_duration: z.number().min(0),
    da_resolver_refund_percentage: z.number().min(0).max(100),
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
          "Generic commitment type requires a Challenge Contract Address",
        path: ["da_challenge_contract_address"],
      });
    } else if (
      data.data_availability_provider === DA_PROVIDER_SYSTEM_VALUES.CUSTOM &&
      data.commitment_type === "Generic" &&
      !addressSchema.safeParse(data.da_challenge_contract_address).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Challenge Contract Address",
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
// const InteropDependencySchema = z.object({
//   chain_id: z.number().min(1),
//   websocket_rpc_endpoint: urlSchema,
//   activation_time: z.number().min(1),
//   history_min_time: z.number().min(0),
// });

// const InteropConfigurationSchema = z
//   .object({
//     enable_interop: z.boolean(),
//     dependency_set: z.array(InteropDependencySchema).optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (
//       data.enable_interop &&
//       (!data.dependency_set || data.dependency_set.length === 0)
//     ) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message:
//           "Interop is enabled but no dependencies provided in dependency set",
//         path: ["dependency_set"],
//       });
//     }
//   });

/* -------------------------------------------------------------------------
   Overall Rollup Configuration Schema
   -------------------------------------------------------------------------*/

export const RollupConfigSchema = z
  .object({
    // rollup name must be 1-61 characters, lowercase, and hyphenated and not use any other special characters
    // this is mapped to the proper regex in the mapSchema.ts file
    // Add a custom error message
    rollup_name: z.string().min(1).max(61).regex(/^[A-Za-z0-9- ]+$/, {
      message: "Rollup name must not contain any special characters, except for whitespace and hyphens",
    }),
    settlement_layer: SettlementLayerSchema,
    participants: ParticipantsSchema,
    signer_config: SignerConfigSchema,
    // admin_config: AdminConfigSchema,
    chain_config: ChainConfigSchema,
    gas_config: GasConfigSchema,
    data_availability_config: DataAvailabilityConfigSchema,
    // interop_config: InteropConfigurationSchema,
  })
  // .superRefine((data, ctx) => {
  //   const { l1_block_time } = data.settlement_layer;
  //   const { l2_block_time } = data.chain_config;
  //   const { selection } = data.settlement_layer;
  //   // TODO: This doesnt work for any settlemnt layer, dont know why`
  //   if (selection === "Custom") {
  //     if (!l1_block_time || l2_block_time > l1_block_time) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: `L2 block time cannot be greater than L1 block time (${l1_block_time}s)`,
  //         path: ["chain_config", "l2_block_time"],
  //       });
  //     }
  //   } else if (l2_block_time >= 12) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: `L2 block time cannot be greater than 14s for ${selection}`,
  //       path: ["chain_config", "l2_block_time"],
  //     });
  //   }
  // });

/* -------------------------------------------------------------------------
   Inferred TypeScript Types
   -------------------------------------------------------------------------*/

export type SettlementLayer = z.infer<typeof SettlementLayerSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
// export type AdminConfig = z.infer<typeof AdminConfigSchema>;
export type ChainConfig = z.infer<typeof ChainConfigSchema>;
export type GasConfig = z.infer<typeof GasConfigSchema>;
export type DataAvailabilityConfig = z.infer<
  typeof DataAvailabilityConfigSchema
>;
// export type InteropConfig = z.infer<typeof InteropConfigurationSchema>;
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
