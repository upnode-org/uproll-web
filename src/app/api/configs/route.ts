import prisma from "@/lib/prisma";
import {
  AltdaDeployConfig,
  Chain,
  Interop,
  Observability,
  OpContractDeployer,
  Prisma,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

export type CreateConfigurationDTO = {
  name: string;
  observability?: Observability;
  interop?: Interop;
  altdaDeployConfig?: AltdaDeployConfig;
  chains: Chain[];
  opContractDeployer?: OpContractDeployer;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const newConfig = (await req.json()) as CreateConfigurationDTO;

    if (!newConfig) {
      return NextResponse.json(
        { error: "Configuration is required" },
        { status: 400 }
      );
    }

    // Build the common configuration data
    const configurationData: Prisma.ConfigurationCreateInput = {
      name: newConfig.name,
      observability: newConfig.observability
        ? { create: newConfig.observability }
        : undefined,
      interop: newConfig.interop ? { create: newConfig.interop } : undefined,
      altdaDeployConfig: newConfig.altdaDeployConfig
        ? { create: newConfig.altdaDeployConfig }
        : undefined,
      chains: { create: newConfig.chains },
      opContractDeployer: newConfig.opContractDeployer
        ? { create: newConfig.opContractDeployer }
        : undefined,
      user: {
        connect: {
          id: session?.user.id,
        },
      },
      expiresAt: session ? undefined : new Date(Date.now() + EXPIRATION_TIME),
    };

    const config = await prisma.configuration.create({
      data: configurationData,
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error creating configuration:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}
