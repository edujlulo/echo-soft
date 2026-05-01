"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import Navbar from "./Navbar";

type DialogVariant = "default" | "danger";

interface AppDialogProps {
  isOpen: boolean;
  onClose: () => void;

  navbarTitle: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;

  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showFooter?: boolean;

  isLoading?: boolean;
  disableClose?: boolean;

  variant?: DialogVariant;

  widthClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  panelClassName?: string;

  footer?: React.ReactNode;
  confirmLoadingLabel?: string;
}

export default function AppDialog({
  isOpen,
  onClose,
  navbarTitle,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  showCloseButton = true,
  showCancelButton = true,
  showFooter = true,
  isLoading = false,
  disableClose = false,
  variant = "default",
  widthClassName = "w-[600px]",
  bodyClassName = "",
  footerClassName = "",
  panelClassName = "",
  footer,
  confirmLoadingLabel = "En proceso...",
}: AppDialogProps) {
  function handleClose() {
    if (disableClose || isLoading) return;
    onClose();
  }

  async function handleConfirm() {
    if (!onConfirm || isLoading) return;
    await onConfirm();
  }

  function handleCancel() {
    if (disableClose || isLoading) return;

    if (onCancel) {
      onCancel();
      return;
    }

    onClose();
  }

  const confirmButtonClassName =
    variant === "danger"
      ? "w-34 bg-red-600 hover:bg-red-700 text-white"
      : "w-35";

  const isLoadingButtonClassName = isLoading ? "w-50" : "";

  const shouldRenderDefaultFooter =
    showFooter && !footer && (confirmLabel || showCancelButton);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      {/* Panel */}
      <Dialog.Panel
        className={`bg-gray-300 rounded-md ${widthClassName} z-50 border border-gray-500 shadow-lg relative ${panelClassName}`}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            disabled={disableClose || isLoading}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
            aria-label="Close dialog"
          >
            ×
          </button>
        )}

        {/* Navbar */}
        <div className="w-full">
          <Navbar>{navbarTitle}</Navbar>
        </div>

        {/* Body */}
        <div className={`py-4 px-4 ${bodyClassName}`}>
          {title && (
            <Dialog.Title className="text-lg font-semibold mb-2">
              {title}
            </Dialog.Title>
          )}

          {description && <div className="mb-3 text-sm">{description}</div>}

          {children}
        </div>

        {/* Custom footer */}
        {showFooter && footer && (
          <div className={`pb-6 flex justify-center gap-3 ${footerClassName}`}>
            {footer}
          </div>
        )}

        {/* Default footer */}
        {shouldRenderDefaultFooter && (
          <div className={`pb-6 flex justify-center gap-3 ${footerClassName}`}>
            {confirmLabel && (
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className={`${confirmButtonClassName} ${isLoadingButtonClassName}`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>{confirmLoadingLabel}</span>
                  </span>
                ) : (
                  confirmLabel
                )}
              </Button>
            )}

            {showCancelButton && (
              <Button
                type="button"
                onClick={handleCancel}
                disabled={disableClose || isLoading}
                className="w-32"
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
