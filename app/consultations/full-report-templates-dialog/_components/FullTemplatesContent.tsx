"use client";

import Button from "@/components/Button";
import FullTemplatesTable from "./FullTemplatesTable";
import FullTemplatesTextarea from "./FullTemplatesTextarea";
import FullTemplatesActions from "./FullTemplatesActions";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function FullTemplatesContent({
  setIsFullTemplatesDialogOpen,
}: Props) {
  return (
    <div className="h-full w-full min-h-0 px-10 pt-4 pb-4 flex flex-col gap-4 ">
      <div className="h-full w-full min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0 w-full flex flex-row gap-3 items-stretch">
          {/* ========== FULL TEMPLATES TABLE =========== */}
          <FullTemplatesTable />

          {/* ========== FULL TEMPLATES TEXTAREA =========== */}
          <div className="h-full min-w-0 flex-1">
            <FullTemplatesTextarea />
          </div>
        </div>

        {/* ========== FULL TEMPLATES ACTIONS BUTTONS =========== */}
        <FullTemplatesActions
          setIsFullTemplatesDialogOpen={setIsFullTemplatesDialogOpen}
        />
      </div>
    </div>
  );
}
