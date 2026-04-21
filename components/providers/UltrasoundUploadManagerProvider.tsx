"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ultrasoundUploadManager,
  type UploadManagerState,
} from "@/lib/uploads/ultrasoundUploadManager";

const UltrasoundUploadManagerContext = createContext(ultrasoundUploadManager);

export function UltrasoundUploadManagerProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UltrasoundUploadManagerContext.Provider value={ultrasoundUploadManager}>
      {children}
    </UltrasoundUploadManagerContext.Provider>
  );
}

export function useUltrasoundUploadManager() {
  const manager = useContext(UltrasoundUploadManagerContext);

  const state = useSyncExternalStore(
    manager.subscribe.bind(manager),
    manager.getState.bind(manager),
    manager.getState.bind(manager),
  ) as UploadManagerState;

  return {
    manager,
    state,
  };
}
