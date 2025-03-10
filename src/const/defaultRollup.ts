import { RollupConfig } from "@/lib/opSchema";

/**
 * Utility type that makes all properties of type T required when they match the specified type U.
 * For numeric fields, this ensures they have at least a value of NaN to make sure input fields work with empty numbers.
 */
type RequiredByType<T, U> = {
  [K in keyof T]: T[K] extends U
    ? T[K]
    : T[K] extends object
    ? RequiredByType<T[K], U>
    : T[K];
};

// Numbers need to be atleast NaN to work with input fields
const defaultRollup: RequiredByType<RollupConfig, number> = {
  rollup_name: "Default Configuration",
  settlement_layer: {
    selection: "ETH Mainnet",
    execution_rpc: "",
    use_same_rpc: true,
    chain_id: NaN,
    l1_block_time: NaN,
  },
  participants: [
    {
      el_type: "op-geth",
      cl_type: "op-node",
    },
  ],
  signer_config: {
    deployer_private_key: "",
    type: "private_key",
    batcher_private_key: "",
    sequencer_private_key: "",
    proposer_private_key: "",
    challenger_private_key: "",
  },
  admin_config: {
    final_system_owner: "",
    proxy_admin_owner: "",
  },
  chain_config: {
    l2_chain_id: 877655,
    l2_block_time: 2,
    proof_maturity_delay_seconds: 0,
    fee_recipient: "",
    withdrawal_network: "",
    disputeGameFinalityDelaySeconds: 3600,
  },
  gas_config: {
    eip1559_elasticity: NaN,
    eip1559_denominator: NaN,
    gas_price_oracle_base_fee_scalar: NaN,
    gas_price_oracle_blob_base_fee_scalar: NaN,
    extra_withdrawal_delay: NaN,
    l2_genesis_block_gas_limit: 0
  },
  data_availability_config: {
    data_availability_provider: "auto",
    batch_submission_frequency: 0,
  },
  interop_config: {
    enable_interop: false,
  },
};

export default defaultRollup;