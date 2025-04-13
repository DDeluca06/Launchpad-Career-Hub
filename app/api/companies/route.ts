import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

/**
 * GET /api/companies
 * 
 * Fetch all companies or filter by query parameters
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated by default
    const user = await isAdmin();
    const { searchParams } = new URL(request.url);
    
    // Optional filter parameters
    const nameFilter = searchParams.get('name');
    const partnerOnly = searchParams.get('partnerOnly') === 'true';
    
    // Build the where clause
    const where: any = {};
    
    if (nameFilter) {
      where.name = {
        contains: nameFilter,
        mode: 'insensitive'
      };
    }
    
    if (partnerOnly) {
      where.is_partner = true;
    }
    
    // Get companies with filtering
    const companies = await prisma.companies.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json({ companies });
  } catch (error: any) {
    if (error.message === 'Not authenticated' || error.message === 'Not authorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'An error occurred while fetching companies' }, { status: 500 });
  }
}

/**
 * POST /api/companies
 * 
 * Create a new company
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    
    // Check for duplicate company names (case-insensitive)
    const existingCompany = await prisma.companies.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingCompany) {
      return NextResponse.json({ 
        error: 'A company with this name already exists',
        company: existingCompany
      }, { status: 409 });
    }
    
    // Create the company
    const company = await prisma.companies.create({
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industry,
        location: data.location,
        logo_url: data.logo_url,
        is_partner: !!data.is_partner,
      }
    });
    
    return NextResponse.json({ company });
  } catch (error: any) {
    if (error.message === 'Not authenticated' || error.message === 'Not authorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'An error occurred while creating the company' }, { status: 500 });
  }
}

/**
 * PUT /api/companies
 * 
 * Update a company by ID
 */
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    
    // Get the company ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    // Parse the request body
    const data = await request.json();
    
    // If name is being updated, check for duplicates
    if (data.name) {
      const existingCompany = await prisma.companies.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          NOT: {
            company_id: parseInt(id)
          }
        }
      });
      
      if (existingCompany) {
        return NextResponse.json({ 
          error: 'A company with this name already exists',
          company: existingCompany
        }, { status: 409 });
      }
    }
    
    // Update the company
    const company = await prisma.companies.update({
      where: { company_id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industry,
        location: data.location,
        logo_url: data.logo_url,
        is_partner: data.is_partner !== undefined ? data.is_partner : undefined,
      }
    });
    
    return NextResponse.json({ company });
  } catch (error: any) {
    if (error.message === 'Not authenticated' || error.message === 'Not authorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'An error occurred while updating the company' }, { status: 500 });
  }
} 