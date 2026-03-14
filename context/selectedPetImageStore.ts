"use client";

import { create } from "zustand";

export type PetImageType = "profile";

export interface PetImages {
  profile: string | null;
}

interface SelectedPetImageState {
  images: PetImages;
  loading: Record<PetImageType, boolean>;

  setImages: (images: Partial<PetImages>) => void;
  setLoading: (loading: Partial<Record<PetImageType, boolean>>) => void;
  resetImages: () => void;
}

export const useSelectedPetImageStore = create<SelectedPetImageState>(
  (set) => ({
    images: {
      profile: null,
    },
    loading: {
      profile: false,
    },

    setImages: (images) =>
      set((state) => ({
        images: { ...state.images, ...images },
      })),

    setLoading: (loading) =>
      set((state) => ({
        loading: { ...state.loading, ...loading },
      })),

    resetImages: () =>
      set({
        images: { profile: null },
        loading: { profile: false },
      }),
  }),
);
