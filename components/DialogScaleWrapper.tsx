"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

type DialogScaleWrapperProps = {
  children: ReactNode;
  baseWidth: number;
  baseHeight: number;
  minScale?: number;
  className?: string;
};

const VIEWPORT_PADDING = 16;

function getViewportSize() {
  if (typeof window === "undefined") return null;

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function DialogScaleWrapper({
  children,
  baseWidth,
  baseHeight,
  minScale = 0.8,
  className = "",
}: DialogScaleWrapperProps) {
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

  const layout = useMemo(() => {
    const viewportWidth = viewportSize?.width ?? baseWidth;
    const viewportHeight = viewportSize?.height ?? baseHeight;

    const availableWidth = Math.max(viewportWidth - VIEWPORT_PADDING * 2, 0);
    const availableHeight = Math.max(viewportHeight - VIEWPORT_PADDING * 2, 0);

    const scale = viewportSize
      ? Math.max(
          minScale,
          Math.min(availableWidth / baseWidth, availableHeight / baseHeight, 1),
        )
      : 1;

    return {
      scale,
      scaledWidth: baseWidth * scale,
      scaledHeight: baseHeight * scale,
    };
  }, [baseHeight, baseWidth, minScale, viewportSize]);

  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        width: layout.scaledWidth,
        height: layout.scaledHeight,
      }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${layout.scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
