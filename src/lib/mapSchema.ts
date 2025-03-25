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
            withdrawal_delay: config.chain_config.proof_maturity_delay_seconds,
            fee_withdrawal_network: config.chain_config.fee_withdrawal_network,
            // sequencer_fee_recipient: config.chain_config.fee_recipient,
            dispute_game_finality_delay:
              config.chain_config.dispute_game_finality_delay,
          },

          // Admin parameters
          // admin: {
          //     l1_proxy_admin: config.admin_config.proxy_admin_owner,
          //     l2_proxy_admin: config.admin_config.proxy_admin_owner,
          // },

          // Participants section
          participants: config.participants,

          // Gas configuration section
          gas_params: {
            gas_limit: config.gas_config.l2_genesis_block_gas_limit,
            eip_1559_elasticity: config.gas_config.eip1559_elasticity,
            eip_1559_denominator: config.gas_config.eip1559_denominator,
            base_fee_scalar:
              config.gas_config.gas_price_oracle_base_fee_scalar,
            blob_base_fee_scalar:
              config.gas_config.gas_price_oracle_blob_base_fee_scalar,
          },

          // Signer configuration section
          sequencer_params: {
            ...(config.signer_config.type === "private_key"
              ? {
                  private_key: config.signer_config.sequencer_private_key,
                }
              : {
                  signer_endpoint: config.signer_config.sequencer_endpoint,
                  signer_address: config.signer_config.sequencer_address,
                }),
          },
          batcher_params: {
            ...(config.signer_config.type === "private_key"
              ? {
                  private_key: config.signer_config.batcher_private_key,
                }
              : {
                  signer_endpoint: config.signer_config.batcher_endpoint,
                  signer_address: config.signer_config.batcher_address,
                }),
          },
          proposer_params: {
            ...(config.signer_config.type === "private_key"
              ? {
                  private_key: config.signer_config.proposer_private_key,
                }
              : {
                  signer_endpoint: config.signer_config.proposer_endpoint,
                  signer_address: config.signer_config.proposer_address,
                }),
          },
          challenger_params: {
            ...(config.signer_config.type === "private_key"
              ? {
                  private_key: config.signer_config.challenger_private_key,
                }
              : {
                  signer_endpoint: config.signer_config.challenger_endpoint,
                  signer_address: config.signer_config.challenger_address,
                }),
          },

          ...(config.data_availability_config.data_availability_provider ===
            "custom" && {
            da_server_params: {
              server_endpoint: config.data_availability_config.da_server_endpoint
            },
          })
        },
      ],

      // Alt Data Availability Configuration
      altda_deploy_config: {
        da_type: config.data_availability_config.data_availability_provider,
        da_max_channel_duration:
          config.data_availability_config.batch_submission_frequency,
        ...(config.data_availability_config.data_availability_provider ===
          "custom" && {
          da_server: config.data_availability_config.da_server_endpoint,
          da_commitment_type: config.data_availability_config.commitment_type,
          da_challenge_proxy:
            config.data_availability_config.da_challenge_contract_address,
          da_challenge_window:
            config.data_availability_config.da_challenge_window,
          da_resolve_window: config.data_availability_config.da_resolve_window,
          da_bond_size: config.data_availability_config.da_bond_size,
          da_bond_duration: config.data_availability_config.da_bond_duration,
          da_resolver_refund_percentage:
            config.data_availability_config.da_resolver_refund_percentage,
        }),
      },



      // Contract deployer parameter defaults
      op_contract_deployer_params: {
        image:
          "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-deployer:v0.0.12",
        l1_artifacts_locator:
          "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
        l2_artifacts_locator:
          "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
      },

      // Interop configuration
      interop: {
        enabled: config.interop_config.enable_interop,
        ...(config.interop_config.enable_interop && {
          supervisor_params: {
            dependency_set: formatDependencySet(config),
          },
        }),
      },
    },

    // External L1 Network parameters
    external_l1_network_params: {
      rpc_kind: getRPCKind(config.settlement_layer.execution_rpc),
      network_id: getL1ChainId(config),
      // seconds_per_slot: getL1BlockTime(config),

      el_rpc_url: config.settlement_layer.execution_rpc,

      el_ws_url: config.settlement_layer.use_same_rpc
        ? // If use same rpc, replace http with ws or if https replace with wss
          config.settlement_layer.execution_rpc
            .replace("https", "wss")
            .replace("http", "ws")
        : // If use different rpc, use the el_ws_url
          config.settlement_layer.el_ws_url,

      cl_rpc_url: config.settlement_layer.use_same_rpc
        ? config.settlement_layer.execution_rpc
        : // If use different rpc, use the consensus_rpc
          config.settlement_layer.consensus_rpc,

      priv_key: config.signer_config.deployer_private_key,
    },

    // Unmodified config for development and debugging
    ...(process.env.NODE_ENV === "development" && {
      unmodified_config: config,
    }),
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
// function getL1BlockTime(config: RollupConfig): number | undefined {
//   if (
//     config.settlement_layer.selection === "ETH Mainnet" ||
//     config.settlement_layer.selection === "ETH Sepolia"
//   ) {
//     return undefined;
//   } else {
//     return config.settlement_layer.l1_block_time || undefined;
//   }
// }

// Define an interface for dependency values
interface DependencyValue {
  chainId: string;
  activationTime: number;
  historyMinTime: number;
}

// Helper function to format dependency set for interop
//  Id's are in quotes whereas times are numbers. Also, values are camelcase instead of separated by _
function formatDependencySet(
  config: RollupConfig
): string {
  if (!config.interop_config.dependency_set) {
    return "{}";
  }

  const dependencies: Record<string, DependencyValue> = {};

  config.interop_config.dependency_set.forEach((dep) => {
    const chainId = dep.chain_id.toString();
    dependencies[chainId] = {
      chainId: chainId,
      activationTime: dep.activation_time || 0,
      historyMinTime: dep.history_min_time || 0,
    };
  });

  return dependencies.toString();
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
