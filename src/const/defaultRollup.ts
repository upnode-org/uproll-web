import { RollupConfig } from "@/lib/opSchema";

// Numbers need to be atleast NaN to work with input fields
const defaultRollup: RollupConfig = {
  rollup_name: "Unnamed Rollup",
  settlement_layer: {
    selection: "ETH Mainnet",
    execution_rpc: "",
    use_same_rpc: true,
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
  // admin_config: {
  //   final_system_owner: "",
  //   proxy_admin_owner: "",
  // },
  chain_config: {
    l2_chain_id: 877655,
    l2_block_time: 2,
    proof_maturity_delay_seconds: NaN,
    // fee_recipient: "",
    fee_withdrawal_network: "L1",
    dispute_game_finality_delay: 3600,
  },
  gas_config: {
    eip1559_elasticity: NaN,
    eip1559_denominator: NaN,
    gas_price_oracle_base_fee_scalar: NaN,
    gas_price_oracle_blob_base_fee_scalar: NaN,
    // extra_withdrawal_delay: NaN,
    l2_genesis_block_gas_limit: NaN,
  },
  data_availability_config: {
    data_availability_provider: "auto",
    batch_submission_frequency: 1,
  },
  // interop_config: {
  //   enable_interop: false,
  // },
};

export default defaultRollup;