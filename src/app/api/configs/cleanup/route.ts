import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {

    const configs = await prisma.configuration.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({ message: `Deleted ${configs.count} configurations` }, { status: 200 });
  } catch (error) {
    console.error("Error deleting configurations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
