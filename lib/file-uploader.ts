import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Constants
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the uploads directory exists
async function ensureUploadsDir() {
   try {
      await fs.access(UPLOADS_DIR);
   } catch {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
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

      // Optimize and save the image using Sharp
      const optimizedBuffer = await sharp(buffer)
         .resize({ width: 1200 }) // Resize to a max width of 1200px (optional)
         .toFormat('webp', { quality: 80 }) // Convert to WebP with 80% quality
         .toBuffer();

      await fs.writeFile(filePath, optimizedBuffer);

      // Return the relative URL for the saved image
      return `/uploads/${fileName}`;
   } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image.');
   }
}

export async function deleteImage(relativePath: string): Promise<void> {
   try {
      const filePath = path.join(process.cwd(), 'public', relativePath);

      // Check if the file exists before attempting to delete
      await fs.access(filePath);
      await fs.unlink(filePath);
   } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image.');
   }
}
