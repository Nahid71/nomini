import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Uploads')
@Controller('api/v1/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check upload service status' })
  health() {
    return { status: 'ok', storage: 'local_disk', folder: 'uploads' };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload a single image or file from local machine to server' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'File uploaded successfully to server' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: UploadService.getMulterStorage(),
      fileFilter: UploadService.fileFilter,
      limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB max limit
      },
    }),
  )
  uploadSingle(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please select and upload a valid file');
    }
    return this.uploadService.formatFileResponse(file);
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload multiple images or files from local machine to server' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: UploadService.getMulterStorage(),
      fileFilter: UploadService.fileFilter,
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadMultiple(@UploadedFiles() files?: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please select at least one file to upload');
    }
    return files.map((f) => this.uploadService.formatFileResponse(f));
  }
}
