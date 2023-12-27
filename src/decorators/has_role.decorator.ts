import { SetMetadata } from "@nestjs/common";
import { Role } from "src/constant/roleEnum";

export const HasRoles = (...roles: Role[]) => SetMetadata("roles", roles);
