import { RollupConfig } from "@/lib/opSchema";

const defaultRollup: RollupConfig = {
  rollup_name: "Untitled Configuration",
  settlement_layer: {
    selection: "ETH Mainnet",
    chain_id: "",
    l1_block_time: "",
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
    batcher_private_key_or_signer_endpoint: "",
    sequencer_private_key_or_signer_endpoint: "",
    proposer_private_key_or_signer_endpoint: "",
  },
  admin_config: {
    final_system_owner: "",
    proxy_admin_owner: "",
  },
  chain_config: {
    l2_chain_id: "",
    l2_block_time: "2s",
    proof_maturity_delay_seconds: 0,
    base_fee_vault_recipient: "",
    l1_fee_vault_recipient: "",
    sequencer_fee_vault_recipient: "",
    base_fee_vault_withdrawal_network: "",
    l1_fee_vault_withdrawal_network: "",
    sequencer_fee_vault_withdrawal_network: "",
    disputeGameFinalityDelaySeconds: 0
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
    data_availability_provider: "ETH Blob + Calldata",
    batch_submission_frequency: 0,
  },
  interop_config: {
    enable_interop: false,
  },
};

export default defaultRollup;