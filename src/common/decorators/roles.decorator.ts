import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

// Dipakai di controller: @Roles(UserRole.member) atau @Roles(UserRole.admin_space)
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
