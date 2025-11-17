import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromImage } from '@/src/api/nvidiaOcrClient';
import { supabase } from '@/src/config/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] OCR upload request received');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const userId = formData.get('userId') as string;
    const analysisType = formData.get('analysisType') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    console.log('[v0] Processing image:', file.name, file.type);

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    console.log('[v0] Calling NVIDIA OCR API...');
    
    // Extract text using NVIDIA OCR
    const extractedText = await extractTextFromImage(base64Image);
    
    console.log('[v0] Text extracted, length:', extractedText?.length || 0);

    // Store in Supabase
    const { data: analysis, error: dbError } = await supabase
      .from('SoilAnalysis')
      .insert({
        user_id: userId,
        analysis_type: analysisType,
        ocr_text: extractedText,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('[v0] Database error:', dbError);
      throw dbError;
    }

    console.log('[v0] OCR analysis saved to database');

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        extractedText,
        analysis
      }
    });

  } catch (error) {
    console.error('[v0] OCR upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Failed to process image',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
