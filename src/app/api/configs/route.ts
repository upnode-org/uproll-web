import prisma from "@/lib/prisma";
import { Configuration } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Needs to be authenticated to link to a user
export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newConfig = await req.json() as Configuration;

    const config = await prisma.configuration.create({
        data: {
            ...newConfig,
            userId: newConfig.userId as string,
            globalNodeSelectors: newConfig.globalNodeSelectors as InputJsonValue,
            globalTolerations: newConfig.globalTolerations as InputJsonValue,
        }
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error creating configuration:', error);
    return NextResponse.json({ error: 'Failed to create configuration' }, { status: 500 });
  }
}
