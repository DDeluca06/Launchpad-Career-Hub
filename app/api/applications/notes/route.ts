import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Updates application notes in the database
 * POST /api/applications/notes
 */
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { applicationId, notes, userId } = requestData;

    if (!applicationId || isNaN(parseInt(applicationId))) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    if (typeof notes !== "string") {
      return NextResponse.json(
        { success: false, error: "Notes must be a string" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const authenticatedUserId = parseInt(userId.toString());
    
    const application = await prisma.applications.findUnique({
      where: { application_id: parseInt(applicationId) }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    if (application.user_id !== authenticatedUserId) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to update this application" },
        { status: 403 }
      );
    }
    
    try {
      await prisma.$executeRaw`UPDATE applications SET notes = ${notes} WHERE application_id = ${parseInt(applicationId)}`;
      
      const updatedApplication = await prisma.applications.findUnique({
        where: { application_id: parseInt(applicationId) }
      });
      
      return NextResponse.json({
        success: true,
        application: updatedApplication
      });
    } catch (updateError) {
      console.error("Error with direct SQL update:", updateError);
      throw updateError;
    }

  } catch (error) {
    console.error("Error updating application notes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application notes: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 