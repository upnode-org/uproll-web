"use server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Retrieves all configurations for a specific user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of configurations.
 */
export async function getUserConfigurations(userId: string) {
  try {
    const configurations = await prisma.configuration.findMany({
      where: { userId },
    });
    return configurations;
  } catch (error) {
    console.error("Error fetching configurations for user:", error);
    throw error;
  }
}

/**
 * Retrieves the detailed configuration for a specific user.
 *
 * @param userId - The ID of the user.
 * @param configId - The ID of the configuration.
 * @returns A promise that resolves to the configuration details or null if not found.
 */
export async function getConfigurationDetail(userId: string, configId: string) {
  try {

    const tolerationRelationIdOmit = {
      configurationId: true,
      elParticipantId: true,
      clParticipantId: true,
      participantId: true,
    }

    const configuration = await prisma.configuration.findFirst({
      where: {
        id: configId,
        userId,
      },
      include: {
        // Dont need to include user
        globalTolerations: {
          omit: tolerationRelationIdOmit,
        },
        observability: {
          omit: {
            ConfigurationId: true,
          },
          include: {
            prometheusParams: true,
            grafanaParams: true,
          },
        },
        interop: {
          omit: {
            ConfigurationId: true,
          },
          include: {
            supervisorParams: true,
          },
        },
        altdaDeployConfig: {
          omit: {
          ConfigurationId: true,
        }},
        chains: {
          include: {
            participants: {
              include: {
                tolerations: {
                  omit: tolerationRelationIdOmit,
                },
                elTolerations: {
                  omit: tolerationRelationIdOmit,
                },
                clTolerations: {
                  omit: tolerationRelationIdOmit,
                },
              },
            },
            networkParams: true,
            batcherParams: true,
            challengerParams: true,
            proposerParams: true,
            mevParams: true,
            daServerParams: true,
          },
        },
        opContractDeployer: true,
      },
    });

    configuration?.globalTolerations[0].clParticipantId
    return configuration;
  } catch (error) {
    console.error("Error fetching configuration detail for user:", error);
    throw error;
  }
}

export type ConfigurationDetailResponse = Awaited<
  ReturnType<typeof getConfigurationDetail>
>;

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
/**
 * Creates a new configuration for a specific user.
 *
 * @param config - The configuration details.
 * @param userId - The ID of the user. If not provided the config will be created as a public config and will expire after 24 hours.
 * @returns A promise that resolves to the new configuration details or null if error.
 */
export async function createConfiguration(
  config: ConfigurationDetailResponse,
  userId?: string
) {
  try {
    if (!config) {
      throw new Error("Configuration is required");
    }

    const configurationData: Prisma.ConfigurationCreateInput = {
      // Configuration
      name: config.name,
      description: config.description,
      globalLogLevel: config.globalLogLevel,
      persistent: config.persistent,
      expiresAt: userId ? undefined : new Date(Date.now() + EXPIRATION_TIME),
      user: userId
        ? {
            connect: {
              id: userId,
            },
          }
        : undefined,
      globalNodeSelectors: {
        create: config.globalNodeSelectors,
      },
      globalTolerations: {
        create: config.globalTolerations.map((toleration) => ({
          ...toleration
        })),
      },
      
      // Observability
      observability: config.observability
        ? {
            create: {
              ...config.observability,
              prometheusParams: config.observability.prometheusParams
                ? { connect: { id: config.observability.prometheusParams.id } }
                : undefined,
              grafanaParams: config.observability.grafanaParams
                ? { connect: { id: config.observability.grafanaParams.id } }
                : undefined,
            },
          }
        : undefined,

      // Interop
      interop: config.interop
        ? {
            create: {
              ...config.interop,
              supervisorParams: config.interop.supervisorParams
                ? { connect: { id: config.interop.supervisorParams.id } }
                : undefined,
            },
          }
        : undefined,

      // Altda Deploy Config
      altdaDeployConfig: config.altdaDeployConfig
        ? { create: config.altdaDeployConfig }
        : undefined,

      // Chains
      chains: { create: config.chains },

      // Op Contract Deployer
      opContractDeployer: config.opContractDeployer
        ? { create: config.opContractDeployer }
        : undefined,
    };

    const newConfig = await prisma.configuration.create({
      data: configurationData,
    });
    return newConfig;
  } catch (error) {
    console.error("Error creating configuration:", error);
    throw error;
  }
}

export type ConfigurationDetailUpdate = Partial<ConfigurationDetailResponse>;

export async function updateConfiguration(
  config: ConfigurationDetailUpdate,
  configId: string
) {
  if (!config) {
    throw new Error("Configuration is required");
  }

  try {
    const updatedConfig = await prisma.configuration.update({
      where: { id: configId },
      data: {
        observability: config.observability
          ? {
              update: {
                ...config.observability,
                prometheusParams: config.observability.prometheusParams
                  ? { connect: { id: config.observability.prometheusParams.id } }
                  : undefined,
                grafanaParams: config.observability.grafanaParams
                  ? { connect: { id: config.observability.grafanaParams.id } }
                  : undefined,
              },
            }
          : undefined,
        interop: config.interop
          ? {
              update: {
                ...config.interop,
                supervisorParams: config.interop.supervisorParams
                  ? { connect: { id: config.interop.supervisorParams.id } }
                  : undefined,
              },
            }
          : undefined,
        altdaDeployConfig: config.altdaDeployConfig
          ? { update: config.altdaDeployConfig }
          : undefined,
        chains: config.chains && config.chains.length > 0
          ? { update: config.chains.map((chain) => ({
              where: { id: chain.id },
              data: {
                ...chain,
                networkParams: chain.networkParams
                  ? { update: chain.networkParams }
                  : undefined,
                participants: {
                  update: chain.participants.map((participant) => ({
                    where: { id: participant.id },
                    data: {
                      ...participant,
                      tolerations: {
                        update: participant.tolerations.map((tolerance) => ({
                          where: { id: tolerance.id },
                          data: tolerance,
                        })),
                      },
                      elTolerations: {
                        update: participant.elTolerations.map((tolerance) => ({
                          where: { id: tolerance.id },
                          data: tolerance,
                        })),
                      },
                      clTolerations: {
                        update: participant.clTolerations.map((tolerance) => ({
                          where: { id: tolerance.id },
                          data: tolerance,
                        })),
                      },                      
                    },
                  })),
                },
              },
            })),
            }
          : undefined,
        opContractDeployer: config.opContractDeployer
          ? { update: config.opContractDeployer }
          : undefined,
      },
    });
    return updatedConfig;
  } catch (error) {
    console.error("Error updating configuration:", error);
    throw error;
  }
}
