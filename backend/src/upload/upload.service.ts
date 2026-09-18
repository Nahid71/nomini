import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { diskStorage } from 'multer';

export const UPLOADS_FOLDER = path.join(process.cwd(), 'uploads');

@Injectable()
export class UploadService {
  constructor() {
    this.ensureUploadsDirectoryExists();
  }

  ensureUploadsDirectoryExists(): void {
    if (!fs.existsSync(UPLOADS_FOLDER)) {
      fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
    }
  }

  static getMulterStorage() {
    if (!fs.existsSync(UPLOADS_FOLDER)) {
      fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
    }

    return diskStorage({
      destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const randomHash = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const safeFilename = `${timestamp}-${randomHash}${ext}`;
        cb(null, safeFilename);
      },
    });
  }

  static fileFilter(req: any, file: Express.Multer.File, cb: any) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Invalid file format (${file.mimetype}). Allowed types: JPG, PNG, WEBP, GIF, SVG, BMP, PDF`,
        ),
        false,
      );
    }
  }

  formatFileResponse(file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
