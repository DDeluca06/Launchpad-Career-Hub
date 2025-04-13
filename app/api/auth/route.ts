import { NextResponse } from 'next/server';
// Remove unused import
// import { auth } from '@/lib/auth';

// Main handler for auth requests
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST() {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
}

export async function PUT() {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
}

export async function DELETE() {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
} 