import { Role } from 'src/entities/types/boardUserRole.type';

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
