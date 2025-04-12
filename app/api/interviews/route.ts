import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const interviews = await prisma.interviews.findMany({
      where: {
        ...(session.user.isAdmin ? {} : { user_id: parseInt(session.user.id) }),
        start_time: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
          }
        }
      },
      orderBy: {
        start_time: "asc",
      },
    });

    // Also fetch all active users for the dropdown
    const users = session.user.isAdmin ? await prisma.users.findMany({
      where: {
        is_active: true,
        is_archived: false,
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
      },
      orderBy: {
        first_name: 'asc',
      },
    }) : [];

    return NextResponse.json({ 
      success: true, 
      data: interviews,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const interview = await prisma.interviews.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
        candidate_name: data.candidate_name,
        position: data.position,
        status: "SCHEDULED",
        user_id: parseInt(session.user.id),
      },
    });

    return NextResponse.json({ success: true, data: interview });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json({ success: false, error: "Failed to create interview" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const interview = await prisma.interviews.update({
      where: {
        interview_id: data.interview_id,
      },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
        candidate_name: data.candidate_name,
        position: data.position,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: interview });
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json({ success: false, error: "Failed to update interview" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const interview = await prisma.interviews.update({
      where: {
        interview_id: data.interview_id,
      },
      data: {
        status: data.status,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: interview });
  } catch (error) {
    console.error("Error updating interview status:", error);
    return NextResponse.json({ success: false, error: "Failed to update interview status" }, { status: 500 });
  }
} 