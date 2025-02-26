import { parseConfig } from "@/lib/opSchema";
import prisma from "@/lib/prisma";
import {
  deleteConfiguration,
  updateConfiguration,
} from "@/services/server/configuration";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Update a configuration
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    if (!id) {
      console.error("Id is required");
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

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
    if (!parsedResult.success) {
      console.error("Invalid configuration", parsedResult.error);
      return NextResponse.json(
        { error: "Invalid configuration", details: parsedResult.error },
        { status: 400 }
      );
    }
    const parsedConfig = parsedResult.data;

    const session = await getServerSession(authOptions);

    const updatedConfig = await updateConfiguration(
      parsedConfig,
      id,
      name,
      session?.user.id
    );

    if (!updatedConfig) {
      console.error("Failed to update configuration");
      return NextResponse.json(
        { error: "Failed to update configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Configuration updated successfully",
      status: 200,
      data: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating configuration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const config = await prisma.configuration.findUnique({
      where: { id: id },
    });

    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }

    if (config?.userId && config.userId !== session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteConfiguration(id);

    return NextResponse.json(
      { message: "Configuration deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting configuration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// Not needed, handled by SSR
// export async function GET(
//   _: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//     const id = (await params).id
//   try {
//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     const config = await prisma.configuration.findUnique({
//       where: { id },
//     });

//     if (!config) {
//       return NextResponse.json(
//         { error: "Configuration not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(config);
//   } catch (error) {
//     console.error("Error getting configuration:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }