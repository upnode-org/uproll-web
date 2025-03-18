import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createConfiguration,
  batchDeleteConfigurations,
} from "@/services/server/configuration";
import { parseConfig } from "@/lib/opSchema";

// Create a new configuration
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const dto = (await req.json()).data;

    if (!dto || !dto.config) {
      console.error("Configuration is required");
      return NextResponse.json(
        { error: "Configuration is required" },
        { status: 400 }
      );
    }
    const { name, config } = dto;


    const parsedResult = parseConfig(config);
    if (!parsedResult.success || !parsedResult.data) {
      console.error("Invalid configuration:", parsedResult.error);
      return NextResponse.json(
        { error: "Invalid configuration", details: parsedResult.error },
        { status: 400 }
      );
    }
    const parsedConfig = parsedResult.data;

    const newConfig = await createConfiguration(
      parsedConfig,
      session?.user.id,
      name,
    );

    return NextResponse.json({
      message: "Configuration created successfully",
      status: 201,
      data: newConfig.id,
    });
  } catch (error) {
    console.error("Error creating configuration:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const dto = (await req.json());
    const ids = dto.ids;
    if (!ids) {
      console.error("Configuration ID is required");
      return NextResponse.json(
        { error: "Configuration ID is required" },
        { status: 400 }
      );
    }

    if (!session?.user.id) {
      console.error("User ID is required");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const deletedConfig = await batchDeleteConfigurations(
      session?.user.id,
      ids as string[]
    );
    return NextResponse.json({
      message: "Configurations deleted successfully",
      status: 200,
      data: deletedConfig,
    });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    return NextResponse.json(
      { error: "Failed to delete configuration" },
      { status: 500 }
    );
  }
}
