import { addPetQuery, getNextRecordNumberByVet } from "@/lib/queries/pets";
import { Database } from "@/types/database";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useClinicStore } from "@/context/activeClinicStore";

type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];

export const addPet = async (pet: Omit<PetInsert, "vet_id" | "clinic_id">) => {
  const vetId = useActiveVetStore.getState().activeVet?.vet_id;
  const clinicId = useClinicStore.getState().activeClinic?.clinic_id;

  if (!vetId || !clinicId) {
    throw new Error("No hay veterinario o clínica activos");
  }

  const nextRecordNumber = await getNextRecordNumberByVet(vetId);

  const petToInsert: PetInsert = {
    ...pet,
    vet_id: vetId,
    clinic_id: clinicId,
    record_number: nextRecordNumber,
  };

  return await addPetQuery(petToInsert);
};
