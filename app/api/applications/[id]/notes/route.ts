import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Updates application notes in the database
 * PUT /api/applications/[id]/notes
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get application ID from URL params
    const applicationId = params.id;
    
    if (!applicationId || isNaN(parseInt(applicationId))) {
      console.error("Invalid application ID:", applicationId);
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }
    
    // Log the request for debugging
    console.log("Processing notes update for application ID:", applicationId);
    
    // Get notes and userId from request body
    const requestData = await request.json();
    console.log("Request data:", requestData);
    
    const { notes, userId } = requestData;

    if (typeof notes !== "string") {
      console.error("Invalid notes format:", notes);
      return NextResponse.json(
        { success: false, error: "Notes must be a string" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId) {
      console.error("Missing userId in request");
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const authenticatedUserId = parseInt(userId.toString());
    
    // Find the application
    console.log("Looking for application with ID:", parseInt(applicationId));
    const application = await prisma.applications.findUnique({
      where: { application_id: parseInt(applicationId) }
    });

    if (!application) {
      console.error("Application not found:", applicationId);
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Log available fields for debugging
    console.log("Available fields on application:", Object.keys(application));
    console.log("Found application:", application.application_id, "User ID:", application.user_id);
    
    // Verify the application belongs to the user
    if (application.user_id !== authenticatedUserId) {
      console.error(
        "Permission denied. Request user ID:", authenticatedUserId, 
        "Application user ID:", application.user_id
      );
      return NextResponse.json(
        { success: false, error: "You do not have permission to update this application" },
        { status: 403 }
      );
    }

    // Log the update operation
    console.log("Updating application with notes:", notes.substring(0, 50) + (notes.length > 50 ? "..." : ""));
    
    // Try a raw query approach for updating the notes
    try {
      await prisma.$executeRaw`UPDATE applications SET notes = ${notes} WHERE application_id = ${parseInt(applicationId)}`;
      
      // Fetch the updated application
      const updatedApplication = await prisma.applications.findUnique({
        where: { application_id: parseInt(applicationId) }
      });
      
      console.log("Notes updated successfully for application:", applicationId);
      
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