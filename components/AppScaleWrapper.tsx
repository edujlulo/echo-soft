"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const DEFAULT_BASE_SIZE = {
  width: 1600,
  height: 800,
};

const MIN_SCALE = 0.8;

const ROUTE_BASE_SIZES: Record<string, { width: number; height: number }> = {
  "/consultations": { width: 1600, height: 800 },
  "/dashboard": { width: 1400, height: 700 },
  "/home": { width: 1100, height: 640 },
};

type AppScaleWrapperProps = {
  children: ReactNode;
};

function getViewportSize() {
  if (typeof window === "undefined") {
    return DEFAULT_BASE_SIZE;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function AppScaleWrapper({ children }: AppScaleWrapperProps) {
  const pathname = usePathname();
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    function handleResize() {
      setViewportSize(getViewportSize());
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseSize =
    !viewportSize || pathname === "/"
      ? (viewportSize ?? DEFAULT_BASE_SIZE)
      : (ROUTE_BASE_SIZES[pathname] ?? DEFAULT_BASE_SIZE);

  const scale = viewportSize
    ? Math.max(
        MIN_SCALE,
        Math.min(
          viewportSize.width / baseSize.width,
          viewportSize.height / baseSize.height,
          1,
        ),
      )
    : 1;

  const scaledWidth = baseSize.width * scale;
  const scaledHeight = baseSize.height * scale;
  const offsetX = viewportSize ? (viewportSize.width - scaledWidth) / 2 : 0;
  const offsetY = viewportSize ? (viewportSize.height - scaledHeight) / 2 : 0;
  const fitsWidth = viewportSize && scaledWidth <= viewportSize.width;
  const fitsHeight = viewportSize && scaledHeight <= viewportSize.height;

  useEffect(() => {
    if (!viewportSize) return;

    const root = document.documentElement;

    root.style.setProperty("--app-scale", String(scale));
    root.style.setProperty("--app-base-width", `${baseSize.width}px`);
    root.style.setProperty("--app-base-height", `${baseSize.height}px`);
    root.style.setProperty("--app-scaled-width", `${scaledWidth}px`);
    root.style.setProperty("--app-scaled-height", `${scaledHeight}px`);
    root.style.setProperty("--app-offset-x", `${offsetX}px`);
    root.style.setProperty("--app-offset-y", `${offsetY}px`);

    return () => {
      root.style.removeProperty("--app-scale");
      root.style.removeProperty("--app-base-width");
      root.style.removeProperty("--app-base-height");
      root.style.removeProperty("--app-scaled-width");
      root.style.removeProperty("--app-scaled-height");
      root.style.removeProperty("--app-offset-x");
      root.style.removeProperty("--app-offset-y");
    };
  }, [
    scale,
    baseSize.width,
    baseSize.height,
    scaledWidth,
    scaledHeight,
    offsetX,
    offsetY,
  ]);

  return (
    <div
      className={`flex h-screen w-screen overflow-auto ${
        fitsHeight ? "items-center" : "items-start"
      } ${fitsWidth ? "justify-center" : "justify-start"}`}
    >
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <div
          style={{
            width: baseSize.width,
            height: baseSize.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
