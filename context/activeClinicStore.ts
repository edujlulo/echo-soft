"use client";

import { create } from "zustand";

interface Clinic {
  clinic_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ClinicState {
  activeClinic: Clinic | null;
  setActiveClinic: (clinic: Clinic) => void;
  clearActiveClinic: () => void;
}

export const useClinicStore = create<ClinicState>((set) => ({
  activeClinic: null,
  setActiveClinic: (clinic) => set({ activeClinic: clinic }),
  clearActiveClinic: () => set({ activeClinic: null }),
}));
