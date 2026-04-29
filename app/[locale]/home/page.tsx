"use client";

import Button from "@/components/Button";
import LabeledInput from "@/components/LabeledInput";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import VeterinariansTable from "./_components/VeterinariansTable";
import { useEffect } from "react";
import { useClinicStore } from "@/context/activeClinicStore";
import { useVeterinarians } from "@/hooks/useVeterinarians";
import VetImages from "./_components/VetImages";
import ClinicImage from "./_components/ClinicImage";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

export default function HomePage() {
  type VetRow = Database["public"]["Tables"]["veterinarians"]["Row"];

  const t = useTranslations("HomePage");

  const { activeClinic } = useClinicStore();
  const router = useRouter();

  const params = useParams();
  const locale = params.locale as string;

  const { vets, loading } = useVeterinarians();

  const handleExit = () => {
    router.replace(`/${locale}`);
  };

  const navigateToDashboard = () => {
    router.push(`/${locale}/dashboard`);
  };

  useEffect(() => {
    if (!activeClinic) {
      router.replace(`/${locale}`); // Redirige al login si no hay clínica activa
    }
  }, [activeClinic, locale, router]);

  if (!activeClinic) return null;

  // Function for activate enter to system button when user press enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      navigateToDashboard();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="w-[1100px] h-[640px] bg-blue-200 flex flex-col items-center rounded-md text-sm"
    >
      {/* NavBar */}
      <div className="w-full">
        <Navbar>{t("echosoft")}</Navbar>
      </div>

      {/* =============== Top sections ================= */}
      <div className="flex flex-row gap-2 mb-7 mr-3">
        {/* First Section */}
        <div className="w-[520px] h-[370px] flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            {/* Logo */}
            <div className="flex flex-col items-center justify-start pl-4 pt-8">
              <ClinicImage />
              <h1 className="text-6xl font-bold pt-4">{t("echosoft")}</h1>
            </div>

            {/* Profile & Signature */}
            <VetImages />
          </div>

          {/* Clinic Name */}
          <div className="text-center">
            <h3 className="text-gray-500 font-bold text-lg">
              {`${activeClinic?.name.toUpperCase()}`}
            </h3>
          </div>
        </div>

        {/* Second Section */}
        <div className="w-[550px] h-[350px] py-2 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">{t("veterinarians")}</h2>

          {/* Veterinarians table */}
          <VeterinariansTable vets={vets as VetRow[]} loading={loading} />
        </div>
      </div>

      {/* =============== Bottom sections ================= */}

      <div className="w-full flex flex-row gap-6 items-center justify-center">
        {/* Third Section */}
        <div className="w-[62%] bg-[#f5faff] relative rounded p-4 mx-2 ">
          <div className="absolute top-0 left-0 bg-[#3399ff] px-8 py-1 rounded-tr-none rounded-bl-none rounded-tl rounded-br-0 text-sm">
            {t("loginSection")}
          </div>
          <div className="mt-4 space-y-3 mr-4">
            <div className="flex justify-center items-center">
              <label className="font-bold px-2">{t("serialNumber")}</label>
              <span className="text-[#1344a0] font-bold">500</span>
            </div>

            <LabeledInput
              value={activeClinic?.address}
              disabled={true}
              inputClassName="w-110"
            >
              {t("address")}
            </LabeledInput>

            <LabeledInput
              value={activeClinic?.phone}
              disabled={true}
              inputClassName="flex-none w-110"
            >
              {t("phones")}
            </LabeledInput>

            <div className="flex flex-row">
              <Button
                onClick={navigateToDashboard}
                className="ml-30 px-3 py-1 pt-1.5 font-bold bg-orange-300 border border-orange-500 hover:bg-orange-400"
              >
                {t("enterSystem")}
              </Button>

              <Button
                onClick={handleExit}
                className="ml-auto px-3 py-1 pt-1.5 font-bold bg-green-300 border border-gray-50 hover:bg-green-400 relative -translate-y-4"
              >
                {t("exit")}
              </Button>
            </div>
          </div>
        </div>

        {/* Fourth Section */}
        <div className="flex flex-col items-center justify-center text-center -translate-y-4 scale-y-115 scale-x-110 ">
          <p className="text-3xl font-bold m-0">{t("webVersion")}</p>
          <p className="text-4xl font-bold mt-2">06/04/2026</p>
          <div className="mt-5">
            <p className="bg-[#3399ff] w-[320px] rounded-t-md m-0">
              {t("exeUpdatedDate")}
            </p>
            <p className="bg-[#f5faff] text-red-600 text-2xl font-semibold w-[320px] rounded-b-md m-0 py-4">
              07/03/2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
