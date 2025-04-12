import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Main handler for auth requests
export async function GET(request: Request) {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(request: Request) {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
}

export async function PUT(request: Request) {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request) {
  // For compatibility with existing code
  return NextResponse.json({ status: 'ok' });
} 