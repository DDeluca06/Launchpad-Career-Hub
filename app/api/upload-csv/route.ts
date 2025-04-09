import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

/**
 * Interface defining the expected structure of a user record from the CSV file.
 * Each field corresponds to a column in the CSV file.
 */
interface CSVUser {
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** User's email address */
  email: string;
  /** User's username */
  username: string;
  /** User's password */
  password: string;
  /** User's identification number */
  id_number: string;
  /** User's program phase */
  program_phase: string;
}

/**
 * List of required fields that must be present in the CSV file.
 * These fields are mandatory for each user record.
 */
const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'username',
  'password',
  'id_number',
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
 * 5. Returns the processed data or appropriate error messages
 * 
 * @param req - The incoming request containing the CSV file
 * @returns A response with either the processed data or an error message
 */
export async function POST(req: NextRequest) {
  try {
    console.log('Received upload request');
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validate file presence
    if (!file) {
      console.log('No file found in request');
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      console.log('Invalid file type:', file.name);
      return NextResponse.json(
        { success: false, error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Read and parse CSV content
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileContent = buffer.toString('utf-8');
    console.log('File content length:', fileContent.length);

    let records: CSVUser[];
    try {
      // Parse CSV with options:
      // - columns: true - Use first row as headers
      // - skip_empty_lines: true - Ignore empty lines
      // - trim: true - Remove whitespace from values
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      console.log('Parsed records:', records.length);
    } catch (parseError) {
      console.error('CSV parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    // Validate records presence
    if (!records || records.length === 0) {
      console.log('No records found in CSV');
      return NextResponse.json(
        { success: false, error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    // Validate required fields presence
    const missingFields = REQUIRED_FIELDS.filter(
      field => !records[0].hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
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
      return !record.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || // Email validation
             !record.username.trim() || // Username not empty
             !record.first_name.trim() || // First name not empty
             !record.last_name.trim() || // Last name not empty
             !record.password.trim() || // Password not empty
             !record.id_number.trim() || // ID number not empty
             !record.program_phase.trim(); // Program phase not empty
    });

    if (invalidRecords.length > 0) {
      console.log('Found invalid records:', invalidRecords.length);
      return NextResponse.json(
        { 
          success: false, 
          error: `Found ${invalidRecords.length} invalid records. Please check the data format.` 
        },
        { status: 400 }
      );
    }

    /**
     * Transform the CSV records into the format expected by the application.
     * This step combines first_name and last_name into a single name field
     * and maps program_phase to program for compatibility.
     */
    const transformedRecords = records.map(record => ({
      name: `${record.first_name} ${record.last_name}`,
      username: record.username,
      email: record.email,
      password: record.password,
      program: record.program_phase,
      id_number: record.id_number
    }));

    console.log('Successfully processed CSV file');
    return NextResponse.json(
      { success: true, data: transformedRecords },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}
