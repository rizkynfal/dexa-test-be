import { AppException, STATUS_CODE_SERVICE } from '@attendance/common';
import { PrismaService } from '@attendance/lib';
import { Injectable } from '@nestjs/common';
import { AttendanceStatus } from 'generated/prisma/enums';
import { uuidv7 } from 'uuidv7';
import { CheckInDto } from './dto/checkin.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}
  async dashboard(userId: string) {
    if (!userId)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );
    const user = await this.prismaService.users.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );

    const attendance = await this.prismaService.attendance.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        workDate: 'desc',
      },
    });
    const startDateCurrentMonth = new Date(new Date().getFullYear(), 0, 1);
    const endDateCurrentMonth = new Date(new Date().getFullYear(), 11, 31);
    const totalHadirCurrentMonth = attendance.filter((a) => {
      return (
        a.status === AttendanceStatus.HADIR &&
        a.workDate! >= startDateCurrentMonth &&
        a.workDate! <= endDateCurrentMonth
      );
    });
    const totalWorkingTimeMs = attendance.reduce((total, item) => {
      if (!item.checkInTime || !item.checkOutTime) {
        return total;
      }

      return (
        total +
        (new Date(item.checkOutTime).getTime() -
          new Date(item.checkInTime).getTime())
      );
    }, 0);
    const totalTidakHadir = attendance.filter((a) => {
      return (
        a.status === AttendanceStatus.TIDAK_HADIR &&
        a.workDate! >= startDateCurrentMonth &&
        a.workDate! <= endDateCurrentMonth
      );
    });
    return {
      totalHadirCurrentMonth: totalHadirCurrentMonth.length,
      totalTidakHadir: totalTidakHadir.length,
      totalJamKerja: totalWorkingTimeMs / (1000 * 60 * 60),
    };
  }
  async findAll() {
    const attendance = await this.prismaService.attendance.findMany({
      include: {
        user: true,
      },
    });
    return attendance;
  }

  async findMe(userId: string) {
    if (!userId)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );
    const user = await this.prismaService.users.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );
    const attendance = await this.prismaService.attendance.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        workDate: 'desc',
      },
    });
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    });

    const today = formatter.format(new Date());

    const isTodayExist = attendance.find((a) => {
      if (!a.workDate) return false;

      if (formatter.format(new Date(a.workDate)) === today) return true;
    });
    if (!attendance || (!isTodayExist && isTodayExist === undefined)) {
      // asumsi pulang kerja jam 17.00
      const isAbsent = new Date().getHours() >= 17.1;
      const newEntry = await this.prismaService.attendance.create({
        data: {
          id: uuidv7(),
          workDate: new Date(today),
          status: isAbsent
            ? AttendanceStatus.TIDAK_HADIR
            : AttendanceStatus.BELUM_CHECKIN,
          userId: userId,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      });
      attendance.push({ ...newEntry, user: user });
    }
    return attendance;
  }
  async checkIn(userId: string, dto: CheckInDto) {
    if (!userId || dto.photo === undefined || dto.photo === null)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'SUBMIT_CHECKIN_FAILED',
        'Submit checkin failed',
      );
    return this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.users.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user)
        throw new AppException(
          STATUS_CODE_SERVICE.BAD_REQUEST,
          'USER_NOT_FOUND',
          'User not found',
        );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + 1);
      const isTodayExist = await prisma.attendance.findFirst({
        where: {
          userId: userId,
          workDate: {
            gte: today,
            lt: nextDay,
          },
        },
      });
      if (!isTodayExist) {
        const newEntry = await prisma.attendance.create({
          data: {
            id: uuidv7(),
            workDate: new Date(),
            checkInPhotoUrl: dto.photo,
            checkInTime: new Date(),
            checkInNote: dto.note,
            status: AttendanceStatus.HADIR,
            userId: userId,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
        return { ...newEntry, user: user };
      } else {
        const updatedEntry = await prisma.attendance.update({
          where: {
            id: isTodayExist.id,
          },
          data: {
            status: AttendanceStatus.HADIR,
            checkInPhotoUrl: dto.photo,
            checkInTime: new Date(),
            checkInNote: dto.note,
          },
        });
        return { ...updatedEntry, user: user };
      }
    });
  }
  async checkOut(userId: string, dto: CheckInDto) {
    if (!userId || dto.photo === undefined || dto.photo === null)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'SUBMIT_CHECKIN_FAILED',
        'Submit checkin failed',
      );
    return this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.users.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user)
        throw new AppException(
          STATUS_CODE_SERVICE.BAD_REQUEST,
          'USER_NOT_FOUND',
          'User not found',
        );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isTodayExist = await prisma.attendance.findFirst({
        where: {
          userId: userId,
          workDate: {
            equals: today,
          },
        },
      });
      if (!isTodayExist) {
        throw new AppException(
          STATUS_CODE_SERVICE.BAD_REQUEST,
          'SUBMIT_CHECKOUT_FAILED',
          'Anda Belum Melakukan Check In Hari Ini',
        );
      }
      const updatedEntry = await prisma.attendance.update({
        where: {
          id: isTodayExist.id,
        },
        data: {
          checkOutPhotoUrl: dto.photo,
          checkOutTime: new Date(),
          checkOutNote: dto.note,
        },
      });
      return { ...updatedEntry, user: user };
    });
  }
  async setViewOnly(userId: string, date: Date, isViewOnly: boolean) {
    if (!userId)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );
    const workDate = new Date(date);

    const nextDay = new Date(workDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const attendance = await this.prismaService.attendance.findFirst({
      where: {
        userId: userId,
        workDate: {
          gte: workDate,
          lt: nextDay,
        },
      },
    });
    if (!attendance)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'ATTENDANCE_NOT_FOUND',
        'Attendance not found',
      );
    await this.prismaService.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        isViewOnly,
      },
    });
    return await this.findAll();
  }
  async resubmitCheckIn(userId: string, date: Date) {
    const user = await this.prismaService.users.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
      );
    const workDate = new Date(date);
    const nextDay = new Date(workDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const attendance = await this.prismaService.attendance.findFirst({
      where: {
        userId: userId,
        workDate: {
          gte: workDate,
          lt: nextDay,
        },
      },
    });
    if (!attendance)
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'ATTENDANCE_NOT_FOUND',
        'Attendance not found',
      );
    if (attendance.isViewOnly) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'ATTENDANCE_CANNOT_RESUBMIT',
        'Attendance is view only',
      );
    }
    await this.prismaService.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        status: AttendanceStatus.BELUM_CHECKIN,
        checkInPhotoUrl: null,
        checkInTime: null,
        checkInNote: null,
        checkOutNote: null,
        checkOutPhotoUrl: null,
        updatedAt: new Date(),
      },
    });
    return await this.findAll();
  }
}
