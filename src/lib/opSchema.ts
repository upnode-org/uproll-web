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
 *   - Users can add more participants.
 * • Signer Configuration
 *   - Deployer private key, batcher key or signer endpoint,
 *     sequencer key or signer endpoint, and proposer key or signer endpoint.
 * • Admin configuration
 *   - L1 System Admin (finalSystemOwner) and L2 Proxy Admin (proxyAdminOwner)
 * • Chain configuration
 *   - L2 Chain ID, L2 block time (default 2s), withdrawal delay,
 *     Extra Withdrawal Delay After Proof Finalized (disputeGameFinalityDelaySeconds),
 *     sequencer fee recipient (all three recipient fields must be identical),
 *     and fee withdrawal network (all three fields must be identical).
 * • Gas configuration
 *   - Block gas limit, EIP-1559 elasticity, denominators, and fee scalars.
 * • Data Availability configuration
 *   - Data availability provider (Choose one):
 *       • ETH Blob + Calldata (OP_BATCHER_DATA_AVAILABILITY_TYPE=auto)
 *       • ETH Blob (OP_BATCHER_DATA_AVAILABILITY_TYPE=blob)
 *       • ETH Calldata (OP_BATCHER_DATA_AVAILABILITY_TYPE=calldata)
 *       • Custom (altda.enabled=true; may not require OP_BATCHER_DATA_AVAILABILITY_TYPE)
 *   - Batch submission frequency (user input in minutes, corresponding to OP_BATCHER_MAX_CHANNEL_DURATION in blocks)
 *   - [If Custom is selected]:
 *       • DA server endpoint
 *       • Commitment type (Select Generic and Keccak256)
 *         - If Generic, a DA Challenge Contract Address is required
 *       • DA Challenge Window
 *       • DA Resolve Window
 * • Interop Configuration
 *   - Enable interop (Checkbox)
 *   - Dependency set (Array) with:
 *       • Chain ID
 *       • WebSocket RPC Endpoint
 *       • Activation Time
 *       • History Min Time
 */

import { z, ZodError } from "zod";

/* -------------------------------------------------------------------------
   Settlement Layer Schema
   -------------------------------------------------------------------------*/

const SettlementLayerSchema = z
  .object({
    selection: z.enum(["ETH Mainnet", "ETH Sepolia", "Custom"]),
    chain_id: z.string().optional(),
    l1_block_time: z.string().optional(),
    settlement_rpc: z.string(),
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
 * - Execution layer (default type: "op-geth")
 * - Consensus layer (default type: "op-node")
 */

export const EL_TYPES = ["op-geth", "op-reth", "op-erigon", "op-nethermind", "op-besu"] as const;
export const CL_TYPES = ["op-node", "hildr"] as const;

export type EL_TYPES = typeof EL_TYPES[number];
export type CL_TYPES = typeof CL_TYPES[number];

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
  deployer_private_key: z.string(),
  batcher_private_key_or_signer_endpoint: z.string(),
  sequencer_private_key_or_signer_endpoint: z.string(),
  proposer_private_key_or_signer_endpoint: z.string(),
});

/* -------------------------------------------------------------------------
   Admin Configuration Schema
   -------------------------------------------------------------------------*/

const AdminConfigSchema = z.object({
  final_system_owner: z.string(),
  proxy_admin_owner: z.string(),
});

/* -------------------------------------------------------------------------
   Chain Configuration Schema
   -------------------------------------------------------------------------*/

/**
 * Chain configuration includes L2 chain settings and fee parameters.
 * The fee recipient fields (base_fee_vault_recipient, l1_fee_vault_recipient, and sequencer_fee_vault_recipient)
 * as well as the fee withdrawal network fields (base_fee_vault_withdrawal_network,
 * l1_fee_vault_withdrawal_network, and sequencer_fee_vault_withdrawal_network) must be identical.
 * Additionally, disputeGameFinalityDelaySeconds represents the extra withdrawal delay after proof finalized.
 */
const ChainConfigSchema = z
  .object({
    l2_chain_id: z.string(),
    l2_block_time: z.string().default("2s"),
    proof_maturity_delay_seconds: z.number(),
    disputeGameFinalityDelaySeconds: z.number(),
    // Sequencer fee recipients
    base_fee_vault_recipient: z.string(),
    l1_fee_vault_recipient: z.string(),
    sequencer_fee_vault_recipient: z.string(),
    // Fee withdrawal networks
    base_fee_vault_withdrawal_network: z.string(),
    l1_fee_vault_withdrawal_network: z.string(),
    sequencer_fee_vault_withdrawal_network: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.base_fee_vault_recipient !== data.l1_fee_vault_recipient ||
      data.l1_fee_vault_recipient !== data.sequencer_fee_vault_recipient
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "All fee recipient fields (Base Fee Vault Recipient, L1 Fee Vault Recipient, Sequencer Fee Vault Recipient) must match. Please ensure they are identical.",
        path: ["base_fee_vault_recipient"],
      });
    }
    if (
      data.base_fee_vault_withdrawal_network !== data.l1_fee_vault_withdrawal_network ||
      data.l1_fee_vault_withdrawal_network !== data.sequencer_fee_vault_withdrawal_network
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "All fee withdrawal network fields (Base Fee Vault Withdrawal Network, L1 Fee Vault Withdrawal Network, Sequencer Fee Vault Withdrawal Network) must match. Please ensure they are identical.",
        path: ["base_fee_vault_withdrawal_network"],
      });
    }
  });

/* -------------------------------------------------------------------------
   Gas Configuration Schema
   -------------------------------------------------------------------------*/

const GasConfigSchema = z.object({
  l2_genesis_block_gas_limit: z.number(),
  eip1559_elasticity: z.number(),
  eip1559_denominator: z.number(),
  eip1559_denominator_canyon: z.number(),
  gas_price_oracle_base_fee_scalar: z.number(),
  gas_price_oracle_blob_base_fee_scalar: z.number(),
});

/* -------------------------------------------------------------------------
   Data Availability Configuration Schema
   -------------------------------------------------------------------------*/

   const BaseDataAvailabilityConfigSchema = z.object({
    batch_submission_frequency: z.number(),
  });
  
  const NonCustomDataAvailabilityConfigSchema = BaseDataAvailabilityConfigSchema.extend({
    data_availability_provider: z.enum(["ETH Blob + Calldata", "ETH Blob", "ETH Calldata"]),
  });
  
  const BaseCustomDataAvailabilityConfigSchema = BaseDataAvailabilityConfigSchema.extend({
    data_availability_provider: z.literal("Custom"),
    da_server_endpoint: z.string(),
    commitment_type: z.enum(["Generic", "Keccak256"]),
    da_challenge_contract_address: z.string().optional(),
    da_challenge_window: z.string(),
    da_resolve_window: z.string(),
  });
  
  // Create a union from plain ZodObjects.
  const DataAvailabilityConfigSchemaRaw = z.discriminatedUnion("data_availability_provider", [
    NonCustomDataAvailabilityConfigSchema,
    BaseCustomDataAvailabilityConfigSchema,
  ]);
  
  // Now, apply the extra validation for the Custom case on the union.
  const DataAvailabilityConfigSchema = DataAvailabilityConfigSchemaRaw.superRefine((data, ctx) => {
    if (
      data.data_availability_provider === "Custom" &&
      data.commitment_type === "Generic" &&
      !data.da_challenge_contract_address
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Generic commitment type requires DA Challenge Contract Address",
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
  chain_id: z.string(),
  websocket_rpc_endpoint: z.string(),
  activation_time: z.string(),
  history_min_time: z.string(),
});

const InteropConfigurationSchema = z
  .object({
    enable_interop: z.boolean().default(false),
    dependency_set: z.array(InteropDependencySchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enable_interop && (!data.dependency_set || data.dependency_set.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Interop is enabled but no dependencies provided in dependency set",
        path: ["dependency_set"],
      });
    }
  });

/* -------------------------------------------------------------------------
   Overall Rollup Configuration Schema
   -------------------------------------------------------------------------*/



export const RollupConfigSchema = z.object({
  rollup_name: z.string(),
  settlement_layer: SettlementLayerSchema,
  participants: ParticipantsSchema,
  signer_config: SignerConfigSchema,
  admin_config: AdminConfigSchema,
  chain_config: ChainConfigSchema,
  gas_config: GasConfigSchema,
  data_availability_config: DataAvailabilityConfigSchema,
  interop_config: InteropConfigurationSchema,
});

/* -------------------------------------------------------------------------
   Inferred TypeScript Types
   -------------------------------------------------------------------------*/

export type SettlementLayer = z.infer<typeof SettlementLayerSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type SignerConfig = z.infer<typeof SignerConfigSchema>;
export type AdminConfig = z.infer<typeof AdminConfigSchema>;
export type ChainConfig = z.infer<typeof ChainConfigSchema>;
export type GasConfig = z.infer<typeof GasConfigSchema>;
export type DataAvailabilityConfig = z.infer<typeof DataAvailabilityConfigSchema>;
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
    console.error("Rollup configuration validation errors:", result.error.issues);
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
  return JSON.stringify(config, null, 2);
}