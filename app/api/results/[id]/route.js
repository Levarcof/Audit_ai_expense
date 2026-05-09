import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Audit from "@/models/Audit";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Audit ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const audit = await Audit.findOne({
      publicId: id,
    });

    if (!audit) {
      return NextResponse.json(
        {
          success: false,
          error: "Audit not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        audit,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Fetch Audit API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
