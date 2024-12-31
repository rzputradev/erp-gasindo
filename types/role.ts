import { Location, Role } from "@prisma/client";

export interface RoleWithLocation extends Role {
   location: Location | null
}