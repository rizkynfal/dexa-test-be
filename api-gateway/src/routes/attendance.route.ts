import {
  Controller,
  Get,
  Param,
  Inject,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES_CONFIG } from '../config';
import { serviceCall } from 'src/lib/microservice.util';
import { CheckInDto } from '@gateway/dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiConsumes } from '@nestjs/swagger';
import fs from 'fs';
import path from 'path';
import { AuthGuard } from '@nestjs/passport';
const serviceConfig = SERVICES_CONFIG;
@Controller('attendance')
export class AttendanceControllerGateway {
  constructor(
    @Inject(serviceConfig.ATTENDANCE.NAME)
    private readonly attendanceClient: ClientProxy,
  ) {}
  @Get('list')
  async attendance() {
    const pattern = { cmd: 'get_attendance_list' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(this.attendanceClient.send(pattern, ''));
  }
  @Get('me/:id')
  async attendanceMe(@Param('id') id: string) {
    const pattern = { cmd: 'get_attendance_me' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(this.attendanceClient.send(pattern, id));
  }
  @Get('dashboard/:id')
  async attendanceDashboard(@Param('id') id: string) {
    const pattern = { cmd: 'get_attendance_dashboard' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(this.attendanceClient.send(pattern, id));
  }
  @Post('checkin/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const id = req.params.id;

          const uploadPath = path.join(
            process.cwd(),
            'uploads',
            'attendance',
            'checkin',
            id as string,
          );

          fs.mkdirSync(uploadPath, { recursive: true });

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async checkin(
    @Param('id') id: string,
    @Body() dto: CheckInDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const pattern = { cmd: '[,]' };
    const photoUrl = `/uploads/attendance/checkin/${id}/${photo.filename}`;
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(
      this.attendanceClient.send(pattern, {
        id,
        dto: { ...dto, photo: photoUrl },
      }),
    );
  }

  @Post('checkout/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const id = req.params.id;

          const uploadPath = path.join(
            process.cwd(),
            'uploads',
            'attendance',
            'checkout',
            id as string,
          );

          fs.mkdirSync(uploadPath, { recursive: true });

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async checkout(
    @Param('id') id: string,
    @Body() dto: CheckInDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const pattern = { cmd: 'user_check_out' };
    const photoUrl = `/uploads/attendance/checkout/${id}/${photo.filename}`;
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(
      this.attendanceClient.send(pattern, {
        id,
        dto: { ...dto, photo: photoUrl },
      }),
    );
  }
  @Post('set-view-only')
  async setViewOnly(
    @Body() dto: { id: string; date: Date; isViewOnly: boolean },
  ) {
    const pattern = { cmd: 'set_view_only' };
    return await serviceCall(this.attendanceClient.send(pattern, dto));
  }
  @Post('resubmit-checkin')
  async resubmitCheckin(@Body() dto: { id: string; date: Date }) {
    const pattern = { cmd: 'resubmit_checkin' };
    return await serviceCall(this.attendanceClient.send(pattern, dto));
  }
}
