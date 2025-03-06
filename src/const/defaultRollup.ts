import { RollupConfig } from "@/lib/opSchema";

const defaultRollup: RollupConfig = {
  rollup_name: "Default Configuration",
  external_l1_network_params: {
    rpc_kind: "basic",
    el_rpc_url: "",
    el_ws_url: "",
    cl_rpc_url: "",
    network_id: "1",
    priv_key: "3",
  },
  settlement_layer: {
    selection: "ETH Mainnet",
    settlement_rpc: "",
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
    batcher_value: "",
    sequencer_value: "",
    proposer_value: "",
  },
  admin_config: {
    final_system_owner: "",
    proxy_admin_owner: "",
  },
  chain_config: {
    l2_chain_id: "877655",
    l2_block_time: "2",
    proof_maturity_delay_seconds: 0,
    base_fee_vault_recipient: "",
    l1_fee_vault_recipient: "",
    sequencer_fee_vault_recipient: "",
    base_fee_vault_withdrawal_network: "",
    l1_fee_vault_withdrawal_network: "",
    sequencer_fee_vault_withdrawal_network: "",
    disputeGameFinalityDelaySeconds: 0,
  },
  gas_config: {
    l2_genesis_block_gas_limit: 0,
    eip1559_elasticity: 0,
    eip1559_denominator: 0,
    eip1559_denominator_canyon: 0,
    gas_price_oracle_base_fee_scalar: 0,
    gas_price_oracle_blob_base_fee_scalar: 0,
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