// Import necessary modules for Next.js API routes
import { NextResponse, NextRequest } from 'next/server';

// Assuming you have a function to fetch forum posts, similar to getExperts
// You might need to adjust the import path if it's different in your project
import { getForumPosts } from '@/api/entities'; // <-- ADJUST THIS IMPORT IF NEEDED

// Define your API route handler function for GET requests
export async function GET(req: NextRequest) {
  try {
    // ----------------------------------------------------------------------
    // Your actual logic to fetch forum posts from Supabase goes here.
    // Replace the 'await getForumPosts()' with your specific implementation.
    // ----------------------------------------------------------------------

    const forumPosts = await getForumPosts(); // Call your function to get forum posts

    // Return a successful response with the forum posts data
    return NextResponse.json({ data: forumPosts }, { status: 200 });

  } catch (error: unknown) {
    // Log the error for debugging purposes
    console.error('[v0] Forum posts API error:', error);

    // Safely determine the error message to send back
    let errorMessage = 'An unknown error occurred while retrieving forum posts.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Return an error response
    return NextResponse.json({ data: null, error: errorMessage }, { status: 500 });
  }
}

// You can add other HTTP methods (POST, PUT, DELETE) here if your API supports them.

