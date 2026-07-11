import { Injectable } from '@nestjs/common';

@Injectable()
export class AbsensiService {
  constructor() {}
  async getAbsensi() {
    return 'absensi';
  }
}
