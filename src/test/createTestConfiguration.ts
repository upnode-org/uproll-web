import { LogLevel } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function createTestConfiguration(userId: string) {
  // Replace with the actual user ID you want to associate with this configuration
  const someUserId = userId;

  const newConfig = await prisma.configuration.create({
    data: {
      name: 'My Test Configuration',
      // Option 1: Connect by user ID
      user: {
        connect: {
          id: someUserId,
        },
      },
      // Or Option 2: Provide userId directly if you prefer
      // userId: someUserId,

      // Optional: set a custom log level (defaults to INFO if omitted)
      globalLogLevel: LogLevel.DEBUG,

      // Optional: Provide any global node selectors or extra JSON configurations
      globalNodeSelectors: {
        // This object can contain whatever JSON structure you need
        region: 'us-east-1',
        instanceType: 't3.medium',
      },

      // Optional: Expiration date
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now

      // Example nested create for Observability
      observability: {
        create: {
          enabled: true,
          prometheusParams: {
            create: {
              storageTsdbRetentionTime: '24h',
              storageTsdbRetentionSize: '1GB',
              minCpu: 200, // in millicores
              maxCpu: 500,
              minMem: 256, // in MB
              maxMem: 512,
              image: 'prometheus:latest',
            },
          },
          grafanaParams: {
            create: {
              dashboardSources: {
                // JSON object
                default: 'dashboard-url',
              },
              minCpu: 100,
              maxCpu: 500,
              minMem: 256,
              maxMem: 512,
              image: 'grafana:latest',
            },
          },
        },
      },

      // Example nested create for Interop
      interop: {
        create: {
          enabled: true,
          supervisorParams: {
            create: {
              image: 'supervisor:latest',
              dependencySet: 'default',
              extraParams: {
                // JSON object
                customOption: true,
              },
            },
          },
        },
      },

      // Example nested create for AltdaDeployConfig
      altdaDeployConfig: {
        create: {
          useAltda: true,
          daCommitmentType: 'sample-commitment',
          daChallengeWindow: 12,
          daResolveWindow: 24,
          daBondSize: 1000,
          daResolverRefundPercentage: 10,
        },
      },

      // Example nested create for multiple chains
      chains: {
        create: [
          {
            // Chain #1
            networkParams: {
              create: {
                network: 'testnet',
                networkId: '12345',
                secondsPerSlot: 12,
                name: 'Test Network',
                fundDevAccounts: true,
              },
            },
            batcherParams: {
              create: {
                image: 'batcher:latest',
                extraParams: {
                  extraBatcherOpt: 'foo',
                },
              },
            },
            challengerParams: {
              create: {
                image: 'challenger:latest',
                cannonPrestatesPath: '/opt/cannon',
                cannonPrestatesUrl: 'http://example.com/prestates',
              },
            },
            proposerParams: {
              create: {
                image: 'proposer:latest',
                extraParams: {
                  blockTime: 2,
                },
                gameType: 2,
                proposalInternal: 'some-logic',
              },
            },
            mevParams: {
              create: {
                rollupBoostImage: 'rollup-boost:latest',
                builderHost: 'builder-host',
                builderPort: '1234',
              },
            },
            // If you want DA_SERVER as an additional service
            additionalServices: [ 'BLOCKSCOUT', 'ROLLUP_BOOST', 'DA_SERVER' ],
            daServerParams: {
              create: {
                image: 'daserver:latest',
                cmd: ['arg1', 'arg2'], // JSON array
              },
            },

            // Example participants
            participants: {
              create: [
                {
                  elType: 'OP_GETH',
                  elImage: 'op-geth:latest',
                  elVolumeSize: 5000,
                  elMinCpu: 200,
                  elMaxCpu: 500,
                  elMinMem: 512,
                  elMaxMem: 1024,
                  clType: 'OP_NODE',
                  clImage: 'op-node:latest',
                  clVolumeSize: 1000,
                  clMinCpu: 200,
                  clMaxCpu: 400,
                  clMinMem: 512,
                  clMaxMem: 1024,
                  count: 1,
                },
                // Add more participants as needed...
              ],
            },
          },
        ],
      },

      // Example nested create for OpContractDeployer
      opContractDeployer: {
        create: {
          image: 'contract-deployer:latest',
          l1ArtifactsLocator: '/l1/artifacts/path',
          l2ArtifactsLocator: '/l2/artifacts/path',
        },
      },

      // If you'd like to add custom tolerations globally
      // (though note that Tolerations are in a many-to-many relation):
      // globalTolerations: {
      //   create: [
      //     {
      //       key: 'example-key',
      //       operator: 'EXISTS',
      //       effect: 'NO_SCHEDULE',
      //     },
      //   ],
      // },
    },

    // Optional: include any relations you want returned
    include: {
      observability: {
        include: {
          prometheusParams: true,
          grafanaParams: true,
        },
      },
      interop: {
        include: {
          supervisorParams: true,
        },
      },
      altdaDeployConfig: true,
      chains: {
        include: {
          participants: true,
          networkParams: true,
          batcherParams: true,
          proposerParams: true,
          challengerParams: true,
          mevParams: true,
          daServerParams: true,
        },
      },
      opContractDeployer: true,
    },
  });

  console.log('Configuration created successfully:', newConfig);
}