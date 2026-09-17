import { Module } from '@nestjs/common';

import { AdminProfileController } from './admin-profile.controller';
import { AdminProfileService } from './admin-profile.service';
import { AdminMemberController } from './admin-member.controller';
import { AdminMemberService } from './admin-member.service';
import { AdminSpaceController } from './admin-space.controller';
import { AdminSpaceService } from './admin-space.service';
import { AdminDiskonController } from './admin-diskon.controller';
import { AdminDiskonService } from './admin-diskon.service';
import { AdminReservasiController } from './admin-reservasi.controller';
import { AdminReservasiService } from './admin-reservasi.service';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';

@Module({
  controllers: [
    AdminProfileController,
    AdminMemberController,
    AdminSpaceController,
    AdminDiskonController,
    AdminReservasiController,
    AdminReportController,
  ],
  providers: [
    AdminProfileService,
    AdminMemberService,
    AdminSpaceService,
    AdminDiskonService,
    AdminReservasiService,
    AdminReportService,
  ],
})
export class AdminModule {}
