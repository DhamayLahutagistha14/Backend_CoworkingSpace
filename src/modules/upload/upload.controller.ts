import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiSecurity, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

// Filter: hanya terima file gambar
function imageFileFilter(req: any, file: any, callback: any) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return callback(
      new BadRequestException('Hanya file gambar (.jpg, .jpeg, .png, .webp) yang diperbolehkan!'),
      false,
    );
  }
  callback(null, true);
}

function makeStorage(folder: string) {
  return diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  });
}

// Schema body untuk Swagger supaya muncul tombol "Choose File"
const fileUploadBodySchema = {
  schema: {
    type: 'object',
    properties: { file: { type: 'string', format: 'binary' } },
  },
};

@ApiTags('12. Upload File')
@ApiSecurity('x-maker-key')
@Controller('upload')
@UseGuards(MakerKeyGuard)
export class UploadController {
  // POST /api/upload/image - Upload gambar umum
  @ApiOperation({ summary: 'Upload gambar umum (disimpan di folder /uploads/general)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileUploadBodySchema)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', { storage: makeStorage('general'), fileFilter: imageFileFilter }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File wajib diupload!');
    return {
      message: 'File berhasil diupload',
      data: {
        filename: file.filename,
        original_name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${BASE_URL}/uploads/general/${file.filename}`,
      },
    };
  }

  // POST /api/upload/spaces - Upload foto ruangan/space
  @ApiOperation({ summary: 'Upload foto ruangan/space (disimpan di folder /uploads/spaces)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileUploadBodySchema)
  @Post('spaces')
  @UseInterceptors(
    FileInterceptor('file', { storage: makeStorage('spaces'), fileFilter: imageFileFilter }),
  )
  uploadSpace(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File wajib diupload!');
    return {
      message: 'Foto space berhasil diupload',
      data: { filename: file.filename, url: `${BASE_URL}/uploads/spaces/${file.filename}` },
    };
  }

  // POST /api/upload/members - Upload foto profil member
  @ApiOperation({ summary: 'Upload foto profil member (disimpan di folder /uploads/members)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileUploadBodySchema)
  @Post('members')
  @UseInterceptors(
    FileInterceptor('file', { storage: makeStorage('members'), fileFilter: imageFileFilter }),
  )
  uploadMember(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File wajib diupload!');
    return {
      message: 'Foto member berhasil diupload',
      data: { filename: file.filename, url: `${BASE_URL}/uploads/members/${file.filename}` },
    };
  }
}
