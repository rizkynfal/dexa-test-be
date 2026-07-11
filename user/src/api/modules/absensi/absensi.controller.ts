import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbsensiService } from './absensi.service';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('Absensi')
@Controller('absensi')
export class AbsensiController {
  constructor(private readonly absensiService: AbsensiService) {}
  @MessagePattern({ cmd: 'get_absensi' })
  @Get()
  getAbsensi() {
    return this.absensiService.getAbsensi();
  }
}
