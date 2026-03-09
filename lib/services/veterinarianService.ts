import { getVeterinarians } from "@/lib/queries/veterinarians";

export async function listVeterinarians() {
  return await getVeterinarians();
}
