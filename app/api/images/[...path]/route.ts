import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const UPLOADS_DIR = path.join(process.cwd(), 'public');

// Define the MIME types for supported image extensions
const MIME_TYPES: Record<string, string> = {
   '.jpg': 'image/jpeg',
   '.jpeg': 'image/jpeg',
   '.png': 'image/png',
   '.webp': 'image/webp',
   '.gif': 'image/gif'
};

export async function GET(
   req: Request,
   { params }: { params: any }
): Promise<NextResponse> {
   try {
      // Construct the file path
      const imagePath = await params.path.join('/');
      const fullPath = path.join(UPLOADS_DIR, imagePath);

      // Check if the file exists
      await fs.access(fullPath);

      // Read the file
      const fileBuffer = await fs.readFile(fullPath);

      // Get the file extension
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Return the image with the appropriate headers
      return new NextResponse(fileBuffer, {
         headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable' // Cache for 1 year
         }
      });
   } catch (error) {
      console.error('Error serving image:', error);
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
   }
}
