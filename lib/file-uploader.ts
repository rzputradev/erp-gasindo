import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const MAX_FILE_SIZE = 1000000; // 1MB
const ACCEPTED_IMAGE_TYPES = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp'
];

// Ensure the uploads directory exists
async function ensureUploadsDir() {
   try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
   } catch (error) {
      console.error('Failed to create uploads directory:', error);
      throw new Error('Failed to initialize upload directory');
   }
}

export async function saveImage(files: FileList): Promise<string> {
   if (!files || files.length !== 1) {
      throw new Error('Image is required.');
   }

   const file = files[0];

   // Validate file size
   if (file.size > MAX_FILE_SIZE) {
      throw new Error('Max file size is 1MB.');
   }

   // Validate file type
   if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('.jpg, .jpeg, .png, and .webp files are accepted.');
   }

   try {
      await ensureUploadsDir();

      // Generate a unique filename
      const fileExtension = path.extname(file.name) || '.jpg'; // Default to .jpg if no extension
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      // Convert Blob to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save the file to the filesystem
      await fs.writeFile(filePath, buffer);

      // Return the relative URL for the saved image
      return `/uploads/${fileName}`;
   } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image.');
   }
}
