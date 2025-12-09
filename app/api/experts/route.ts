// Import necessary modules for Next.js API routes
import { NextResponse, NextRequest } from 'next/server'; // Ensure NextRequest is also imported
import { getExperts } from '@/api/entities'; // Your existing import for fetching experts

// Define your API route handler function for GET requests
export async function GET(req: NextRequest) { // Using NextRequest for better type safety
  try {
    // ----------------------------------------------------------------------
    // Your actual API logic for handling experts goes here.
    // This is where you would typically:
    // - Call your getExperts function to fetch data
    // - Process any request parameters (e.g., req.nextUrl.searchParams)
    // ----------------------------------------------------------------------

    const experts = await getExperts(); // Execute your getExperts function

    // Return a successful response with the experts data
    return NextResponse.json({ data: experts }, { status: 200 });

  } catch (error: unknown) {
    // Log the error for debugging purposes
    console.error('[v0] Experts API error:', error); // Updated console.error message

    // Safely determine the error message to send back
    let errorMessage = 'An unknown error occurred while retrieving experts.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Return an error response
    return NextResponse.json({ data: null, error: errorMessage }, { status: 500 });
  }
}

// You might also have POST, PUT, DELETE functions here if your API supports them

