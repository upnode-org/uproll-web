"use server";
import { RollupConfig, parseConfig } from "@/lib/opSchema";
import prisma from "@/lib/prisma";

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
export async function getConfigurationDetail(configId: string, userId: string | undefined) {
  try {
    const configuration = await prisma.configuration.findFirst({
      where: { id: configId },
    });


    // const parsedConfig = parseConfig(configuration?.config);

    // if (!parsedConfig.success) {
    //   throw new Error("Configuration not found");
    // }

    if(configuration?.userId === undefined || configuration?.userId === null) {
      return {
        config: configuration?.config,
        name: configuration?.name,
      };
    }

    if (configuration?.userId !== userId) {
      throw new Error("Not authorized to view this configuration");
    }

    return {
      config: configuration?.config,
      name: configuration?.name,
    };
  } catch (error) {
    console.error("Error fetching configuration detail for user:", error);
    throw new Error("Configuration not found");
  }
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
/**
 * Creates a new configuration for a specific user.
 *
 * @param config - The configuration details.
 * @param userId - The ID of the user. If not provided the config will be created as a public config and will expire after 24 hours.
 * @returns A promise that resolves to the new configuration details or null if error.
 */
export async function createConfiguration(
  config: RollupConfig,
  userId?: string,
  name?: string,
) {
  try {
    const expiresAt = userId ? undefined : new Date(new Date().getTime() + EXPIRATION_TIME);    

    const newConfig = await prisma.configuration.create({
      data: {
        config: config,
        name: name || "Untitled Configuration",
        ...(userId
          ? { user: { connect: { id: userId } } }
          : { expiresAt }),
      },
    });
    return newConfig;
  } catch (error) {
    console.error("Error creating configuration:", error);
    throw error;
  }
}

export async function updateConfiguration(
  config: RollupConfig,
  configId: string,
  name?: string,
  userId?: string
) {
  try {
    const updatedConfig = await prisma.configuration.update({
      where: { id: configId, ...(userId ? { userId: userId } : {}) },
      data: {
        config: config,
        name: name || undefined,
      },
    });
    return updatedConfig;
  } catch (error) {
    console.error("Error updating configuration:", error);
    throw error;
  }
}

export async function deleteConfiguration(configId: string) {
  try {
    await prisma.configuration.delete({
      where: { id: configId },
    });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    throw error;
  }
}

export async function batchDeleteConfigurations(userId: string, configIds: string[]) {
  try {
    await prisma.configuration.deleteMany({
      where: { userId, id: { in: configIds } },
    });
  } catch (error) {
    console.error("Error deleting configurations:", error);
    throw error;
  }
}
