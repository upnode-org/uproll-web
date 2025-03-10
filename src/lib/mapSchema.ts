import { RollupConfig } from "./opSchema";
const transformConfig = (config: RollupConfig) => {  
    // Create a structured optimism_package based on the mapping table
    const transformedConfig = {
      optimism_package: {
        chains: [
          {
            // Chain configuration section
            network_params: {
              name: config.rollup_name,
              network_id: config.chain_config.l2_chain_id,
              seconds_per_slot: config.chain_config.l2_block_time,
              sequencer_fee_recipient: config.chain_config.fee_recipient,
              sequencer_fee_withdrawal: config.chain_config.withdrawal_network,
              withdrawal_delay: config.chain_config.proof_maturity_delay_seconds,
            },
            
            // Participants section
            participants: config.participants,
            
            // Gas configuration section
            gas_config: {
              gas_limit: config.gas_config.l2_genesis_block_gas_limit,
              gas_price_oracle_base_fee_scalar: config.gas_config.gas_price_oracle_base_fee_scalar,
              gas_price_oracle_blob_base_fee_scalar: config.gas_config.gas_price_oracle_blob_base_fee_scalar,
              denominator: config.gas_config.eip1559_denominator,
              dispute_game_finality_delay_seconds: config.chain_config.disputeGameFinalityDelaySeconds,
            },

            // Signer configuration section
            sequencer_params: {
                ...(config.signer_config.type === "private_key" ? {
                    private_key: config.signer_config.sequencer_private_key,
                } : {
                    signer_endpoint: config.signer_config.sequencer_endpoint,
                    signer_address: config.signer_config.sequencer_address,
                }),
            },
            batcher_params: {
                ...(config.signer_config.type === "private_key" ? {
                    private_key: config.signer_config.batcher_private_key,
                } : {
                    signer_endpoint: config.signer_config.batcher_endpoint,
                    signer_address: config.signer_config.batcher_address,
                }),
            },
            proposer_params: {
                ...(config.signer_config.type === "private_key" ? {
                    private_key: config.signer_config.proposer_private_key,
                } : {
                    signer_endpoint: config.signer_config.proposer_endpoint,
                    signer_address: config.signer_config.proposer_address,
                }),
            },

          }
        ],
        
        // Alt Data Availability Configuration
        altda_deploy_config: {
          da_type: config.data_availability_config.data_availability_provider,
          da_max_channel_duration: config.data_availability_config.batch_submission_frequency,
          ...((config.data_availability_config.data_availability_provider === "custom") && {
            da_server: config.data_availability_config.da_server_endpoint,
            da_commitment_type: config.data_availability_config.commitment_type,
            da_challenge_proxy: config.data_availability_config.da_challenge_contract_address,
            da_challenge_window: config.data_availability_config.da_challenge_window,
            da_resolve_window: config.data_availability_config.da_resolve_window,
          }),
        },
        
        // Contract deployer parameter defaults
        op_contract_deployer_params: {
          image: "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-deployer:v0.0.12",
          l1_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
          l2_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
        },
        
        // Interop configuration
        interop: {
          enabled: config.interop_config.enable_interop,
          dependency_set: config.interop_config.enable_interop ? formatDependencySet(config) : undefined,
        }
      },
      
      // External L1 Network parameters
      external_l1_network_params: {
        kind: getRPCKind(config.settlement_layer.execution_rpc),
        network_id: getL1ChainId(config),
        seconds_per_slot: getL1BlockTime(config),

        el_rpc_url: config.settlement_layer.execution_rpc,

        ws_rpc_url: config.settlement_layer.use_same_rpc ? 
        // If use same rpc, replace http with ws or if https replace with wss
        config.settlement_layer.execution_rpc.replace("https", "wss").replace("http", "ws") :
        // If use different rpc, use the ws_rpc_url
        config.settlement_layer.ws_rpc_url,

        cl_rpc_url: config.settlement_layer.use_same_rpc ? 
        config.settlement_layer.execution_rpc :
        // If use different rpc, use the consensus_rpc
        config.settlement_layer.consensus_rpc,
      },
  
      // Unmodified config for development and debugging
      unmodified_config: config,
    };
    
    // Remove undefined properties
    return JSON.parse(JSON.stringify(transformedConfig));
  };
  
  // Helper function to get L1 chain ID based on settlement layer
  function getL1ChainId(config: RollupConfig): number {
    if (config.settlement_layer.selection === "ETH Mainnet") {
      return 1;
    } else if (config.settlement_layer.selection === "ETH Sepolia") {
      return 11155111;
    } else {
      return config.settlement_layer.chain_id || 1;
    }
  }
  
  // Helper function to get L1 block time based on settlement layer
  function getL1BlockTime(config: RollupConfig): number | undefined {
    if (config.settlement_layer.selection === "ETH Mainnet" || 
        config.settlement_layer.selection === "ETH Sepolia") {
      return undefined;
    } else {
      return config.settlement_layer.l1_block_time || undefined;
    }
  }
  
  // Define an interface for dependency values
  interface DependencyValue {
    chainIndex: number;
    activationTime: number;
    historyMinTime: number;
  }
  
  // Helper function to format dependency set for interop
  function formatDependencySet(config: RollupConfig): { dependencies: Record<string, DependencyValue> } | Record<string, never> {
    if (!config.interop_config.dependency_set) {
      return {};
    }
    
    const dependencies: Record<string, DependencyValue> = {};
    
    config.interop_config.dependency_set.forEach(dep => {
      dependencies[dep.chain_id] = {
        chainIndex: dep.chain_id,
        activationTime: dep.activation_time || 0,
        historyMinTime: dep.history_min_time || 0
      };
    });
    
    return { dependencies };
  }
  
  function getRPCKind(rpcUrl: string): "alchemy" | "quicknode" | "basic" {
    if (rpcUrl.includes(".alchemy")) {
      return "alchemy";
    } else if (rpcUrl.includes(".quicknode")) {
      return "quicknode";
    } else {
      return "basic";
    }
  }

export default transformConfig;