import connectDB from "@/models/utils/db";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const teachers = await Teacher.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error("Fetch teachers error:", err);

    return NextResponse.json(
      {
        message: "Failed to fetch teachers.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const name = body?.name?.trim();
    const email = body?.email?.trim().toLowerCase();

    if (!name) {
      return NextResponse.json(
        {
          message: "Teacher name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "Teacher email is required.",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Please provide a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const existingTeacher = await Teacher.findOne({
      email,
    });

    if (existingTeacher) {
      return NextResponse.json(
        {
          message:
            "A teacher account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const teacher = await Teacher.create({
      name,
      email,
    });

    return NextResponse.json(
      teacher,
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error("Add teacher error:", err);

    // Handle MongoDB duplicate-key error as an additional safeguard
    if (err?.code === 11000) {
      return NextResponse.json(
        {
          message:
            "A teacher account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to add teacher.",
      },
      {
        status: 500,
      }
    );
  }
}