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
 *     sequencer fee recipient (all three recipient fields must be identical),
 *     and fee withdrawal network (all three fields must be identical).
 * • Gas configuration
 *   - Block gas limit, EIP-1559 elasticity, denominators, and fee scalars.
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
          message: "chain_id is required for a custom settlement layer",
          path: ["chain_id"],
        });
      }
      if (!data.l1_block_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "l1_block_time is required for a custom settlement layer",
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
const ParticipantSchema = z.object({
  // Execution Layer configuration
  el_type: z.enum(["op-geth", "other"]).default("op-geth"),
  el_image: z.string().default("op-geth:latest"),
  // Consensus Layer configuration
  cl_type: z.enum(["op-node", "other"]).default("op-node"),
  cl_image: z.string().default("op-node:latest"),
});

/**
 * Participants array defaults to a single participant.
 */
const ParticipantsSchema = z.array(ParticipantSchema).default([
  {
    el_type: "op-geth",
    el_image: "op-geth:latest",
    cl_type: "op-node",
    cl_image: "op-node:latest",
  },
]);

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
 * The fee recipient fields (baseFeeVaultRecipient, l1FeeVaultRecipient, and sequencerFeeVaultRecipient)
 * as well as the fee withdrawal network fields (baseFeeVaultWithdrawalNetwork,
 * l1FeeVaultWithdrawalNetwork, and sequencerFeeVaultWithdrawalNetwork) must be identical.
 */
const ChainConfigSchema = z
  .object({
    l2_chain_id: z.string(),
    l2_block_time: z.string().default("2s"),
    proof_maturity_delay_seconds: z.number(),
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
        message: "Fee recipient fields must be identical",
        path: ["base_fee_vault_recipient"],
      });
    }
    if (
      data.base_fee_vault_withdrawal_network !== data.l1_fee_vault_withdrawal_network ||
      data.l1_fee_vault_withdrawal_network !== data.sequencer_fee_vault_withdrawal_network
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee withdrawal network fields must be identical",
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
