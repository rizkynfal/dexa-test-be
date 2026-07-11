import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CheckInDto } from './dto/checkin.dto';

@ApiTags('Attendance')
@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  @MessagePattern({ cmd: 'get_attendance_list' })
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @MessagePattern({ cmd: 'get_attendance_me' })
  @Get('me/:id')
  findMe(@Payload() id: string) {
    return this.attendanceService.findMe(id);
  }
  @MessagePattern({ cmd: 'get_attendance_dashboard' })
  @Get('dashboard/:id')
  dashboard(@Payload() id: string) {
    return this.attendanceService.dashboard(id);
  }
  @MessagePattern({ cmd: 'user_check_in' })
  @Post('checkin/:id')
  checkIn(@Payload() payload: { id: string; dto: CheckInDto }) {
    return this.attendanceService.checkIn(payload.id, payload.dto);
  }
  @MessagePattern({ cmd: 'user_check_out' })
  @Post('checkout/:id')
  checkOut(@Payload() payload: { id: string; dto: CheckInDto }) {
    return this.attendanceService.checkOut(payload.id, payload.dto);
  }
  @MessagePattern({ cmd: 'set_view_only' })
  @Post('set-view-only')
  setViewOnly(
    @Payload() payload: { id: string; date: Date; isViewOnly: boolean },
  ) {
    return this.attendanceService.setViewOnly(
      payload.id,
      payload.date,
      payload.isViewOnly,
    );
  }

  @MessagePattern({ cmd: 'resubmit_checkin' })
  resubmitCheckIn(@Payload() payload: { id: string; date: Date }) {
    return this.attendanceService.resubmitCheckIn(payload.id, payload.date);
  }
}
