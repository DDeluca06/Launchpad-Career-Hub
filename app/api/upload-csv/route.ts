import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { PrismaClient, ProgramType } from '../../../lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Interface defining the expected structure of a user record from the CSV file.
 * Each field corresponds to a column in the CSV file.
 */
interface CSVUser {
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** User's username */
  username: string;
  /** User's password */
  password: string;
  /** User's program phase (must be one of: Foundations, 101, LiftOff, Alumni) */
  program_phase: string;
}

/**
 * List of required fields that must be present in the CSV file.
 * These fields are mandatory for each user record.
 */
const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'username',
  'password',
  'program_phase'
];

/**
 * Handles the CSV file upload and processing.
 * 
 * This endpoint:
 * 1. Validates the uploaded file is a CSV
 * 2. Parses the CSV content
 * 3. Validates the required fields and data format
 * 4. Transforms the data into the expected format
 * 5. Creates users in the database using Prisma
 * 6. Returns the processed data or appropriate error messages
 * 
 * @param req - The incoming request containing the CSV file
 * @returns A response with either the processed data or an error message
 */
export async function POST(req: Request) {
  try {
    console.warn('Received upload request');
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validate file presence
    if (!file) {
      console.warn('No file found in request');
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.warn('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      console.warn('Invalid file type:', file.name);
      return NextResponse.json(
        { success: false, error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Read and parse CSV content
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);
    console.warn('File content length:', content.length);

    let records: CSVUser[];
    try {
      // Parse CSV with options:
      // - columns: true - Use first row as headers
      // - skip_empty_lines: true - Ignore empty lines
      // - trim: true - Remove whitespace from values
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      console.warn('Parsed records:', records.length);
    } catch (parseError) {
      console.error('CSV parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    // Validate records presence
    if (!records || records.length === 0) {
      console.warn('No records found in CSV');
      return NextResponse.json(
        { success: false, error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    // Validate required fields presence
    const missingFields = REQUIRED_FIELDS.filter(
      field => !Object.prototype.hasOwnProperty.call(records[0], field)
    );

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate data format and content
    const invalidRecords = records.filter(record => {
      return !record.username.trim() || // Username not empty
             !record.first_name.trim() || // First name not empty
             !record.last_name.trim() || // Last name not empty
             !record.password.trim() || // Password not empty
             !record.program_phase.trim(); // Program phase not empty
    });

    if (invalidRecords.length > 0) {
      console.warn('Found invalid records:', invalidRecords.length);
      return NextResponse.json(
        { 
          success: false, 
          error: `Found ${invalidRecords.length} invalid records. Please check the data format.` 
        },
        { status: 400 }
      );
    }

    // Process records and create users
    const createdUsers = [];
    const errors = [];

    for (const record of records) {
      try {
        // Hash the password
        const passwordHash = await bcrypt.hash(record.password, 10);

        // Convert program phase to the correct format
        const programPhase = record.program_phase;
        console.warn('Raw program phase value:', programPhase);
        console.warn('Program phase length:', programPhase.length);
        console.warn('Program phase char codes:', Array.from(programPhase).map(char => char.charCodeAt(0)));
        
        let programType: ProgramType;
        
        switch (programPhase) {
          case 'Foundations':
            programType = 'FOUNDATIONS';
            break;
          case '101':
            programType = 'ONE_ZERO_ONE';
            break;
          case 'LiftOff':
            programType = 'LIFTOFF';
            break;
          case 'Alumni':
            programType = 'ALUMNI';
            break;
          default:
            return NextResponse.json(
              { error: `Invalid program phase: "${programPhase}". Program phase must be exactly one of: "Foundations", "101", "LiftOff", "Alumni" (case-sensitive)` },
              { status: 400 }
            );
        }

        // Create user with hashed password
        const user = await prisma.users.create({
          data: {
            first_name: record.first_name,
            last_name: record.last_name,
            username: record.username,
            password_hash: passwordHash,
            program: programType,
            is_active: true,
            is_admin: false,
          },
        });

        createdUsers.push(user);
      } catch (error: unknown) {
        console.error('Error creating user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        errors.push(`Failed to create user ${record.username}: ${errorMessage}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Some users could not be created: ${errors.join(', ')}`,
          createdUsers
        },
        { status: 400 }
      );
    }

    console.warn('Successfully processed CSV file');
    return NextResponse.json(
      { success: true, data: createdUsers },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error processing CSV:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
