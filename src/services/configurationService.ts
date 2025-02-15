"use server"
import { PrismaClient } from '@prisma/client';

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
    console.error('Error fetching configurations for user:', error);
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
    const configuration = await prisma.configuration.findFirst({
      where: {
        id: configId,
        userId, // ensures that the configuration belongs to the user
      },
      // Optionally include related fields if you need full details:
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
            challengerParams: true,
            proposerParams: true,
            mevParams: true,
            daServerParams: true,
          },
        },
        opContractDeployer: true,
      },
    });
    return configuration;
  } catch (error) {
    console.error('Error fetching configuration detail for user:', error);
    throw error;
  }
}
