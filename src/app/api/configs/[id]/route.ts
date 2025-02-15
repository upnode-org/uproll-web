import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const config = await prisma.configuration.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting configuration:', error);
    return NextResponse.json({ error: 'Failed to get configuration' }, { status: 500 });
  }
}