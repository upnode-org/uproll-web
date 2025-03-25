import { RollupConfig } from "@/lib/opSchema";

type ToString<T> = T extends (infer U)[]
  ? ToString<U>[]
  : T extends object
  ? { [K in keyof T]: ToString<T[K]> }
  : string;

const placeholderRollup: ToString<RollupConfig> = {
  rollup_name: "Configuration Name",
  settlement_layer: {
    selection: "Custom",
    use_same_rpc: "true",
    chain_id: "1",
    // l1_block_time: "12",
    el_ws_url: "wss://eth-mainnet.rpc.com/your-api-key",
    execution_rpc: "https://eth-mainnet.rpc.com/your-api-key",
    consensus_rpc: "https://eth-mainnet.rpc.com/your-api-key",
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
  //   final_system_owner: "0x...",
  //   proxy_admin_owner: "0x...",
  // }, 
  chain_config: {
    l2_chain_id: ">0",
    l2_block_time: ">0 and <L1 block time",
    proof_maturity_delay_seconds: "0",
    // fee_recipient: "0x...",
    fee_withdrawal_network: "0x...",
    dispute_game_finality_delay: "3600",
  },
  gas_config: {
    l2_genesis_block_gas_limit: ">0",
    eip1559_elasticity: ">0",
    eip1559_denominator: ">0",
    gas_price_oracle_base_fee_scalar: ">0",
    gas_price_oracle_blob_base_fee_scalar: ">0",
    extra_withdrawal_delay: ">0",
  },
  data_availability_config: {
    data_availability_provider: "custom",
    batch_submission_frequency: ">0",
    da_server_endpoint: "https://da-server.com/your-api-key",
    commitment_type: "Generic",
    da_challenge_contract_address: "0x...",
    da_challenge_window: ">0",
    da_resolve_window: ">0",
    da_bond_size: ">0",
    da_bond_duration: ">0",
    da_resolver_refund_percentage: "5",
  },
  interop_config: {
    enable_interop: "true",
    dependency_set: [{
      chain_id: "1",
      websocket_rpc_endpoint: "https://eth-mainnet.rpc.com/your-api-key",
      activation_time: "1",
      history_min_time: "1",
    }],
  },
} as const;

export default placeholderRollup;