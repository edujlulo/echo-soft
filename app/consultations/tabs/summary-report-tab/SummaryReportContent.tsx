import React from "react";
import ReportDraft from "./ReportDraft";
import PetInfoForm from "./PetInfoForm";
import ReportActions from "./ReportActions";

export default function SummaryReportContent() {
  return (
    <>
      {/* ====== Main content ======= */}
      <div className="flex flex-col gap-2">
        {/* ======== Top section ======== */}
        <div className="flex flex-row gap-1">
          {/* ======= Report draft ====== */}
          <div>
            <ReportDraft />
          </div>

          {/* ====== Pet info form ====== */}

          <div>
            <PetInfoForm />
          </div>
        </div>

        {/* ======= Actions buttons ======= */}

        <div>
          <ReportActions />
        </div>
      </div>
    </>
  );
}
