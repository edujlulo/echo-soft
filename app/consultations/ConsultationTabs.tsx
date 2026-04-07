"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import PetDetailsAndReason from "./tabs/PetDetailsAndReason";
import LiverGallbladderKidneys from "./tabs/LiverGallbladderKidneys";
import SpleenPancreasStomachSmallIntestine from "./tabs/SpleenPancreasStomachSmallIntestine";
import LargeIntestineBladderUrethraLymph from "./tabs/LargeIntestineBladderUrethraLymph";
import AdrenalUterusOvaries from "./tabs/AdrenalUterusOvaries";
import MammaryGlandsAndOthers from "./tabs/MammaryGlandsAndOthers";
import EyeMuscleVeinBone from "./tabs/EyeMuscleVeinBone";
import SummaryReportContent from "./tabs/summary-report-tab/SummaryReportContent";
import UltrasoundImagesContent from "./tabs/ultrasound-images-tab/UltrasoundImagesContent";
import { useConsultationPetForm } from "@/hooks/useConsultationPetForm";

export default function ConsultationTabs() {
  const [value, setValue] = useState(0);

  const { selectedPet, setField, isSaving, statusMessage, calculateAge } =
    useConsultationPetForm();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className="min-h-0 mx-4 flex flex-col flex-1 bg-amber-50 rounded-t-lg rounded-b-sm">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="standard"
        // slotProps={{
        //   indicator: {
        //     sx: { display: "none" }, // oculta la línea de abajo de la tab activa
        //   },
        // }}
        sx={{
          display: "flex",
          "& .MuiTabs-flexContainer": {
            justifyContent: "flex-start", // Las tabs se alinean al inicio
          },
          "& .MuiTabs-indicator": {
            display: "none", // oculta el indicador por completo
          },
          "& .MuiTab-root": {
            fontSize: "0.88rem",
            textTransform: "none",
            minWidth: 0,
            minHeight: 0,
            height: 30,
            flex: "0 1 auto",
            paddingX: 1.8,
            backgroundColor: "#FEEDA9", // color de fondo de las tabs
            color: "#000", // color del texto por defecto
            borderRight: "1px solid #999", // línea divisoria entre tabs
            borderBottom: "1px solid #bbb",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            "&:hover": {
              backgroundColor: "#FDDD6C", // un poco más claro al pasar el mouse
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#FFFBEB", // fondo de la tab activa
            color: "#172554 !important", // text-blue-950
            fontWeight: "bold", // opcional: más clásico
            borderBottom: "none",
          },
        }}
      >
        <Tab label="Mascotas" />
        <Tab label="Hígado, Vesícula, Riñones" />
        <Tab label="Bazo, Pancreas, Estom., Int. delg." />
        <Tab label="Int. Grue., Vejiga, Uretra, Linfon." />
        <Tab label="Gl. Adre, Utero, Ovario" />
        <Tab label="G. Mamarias, Otros" />
        <Tab label="Ocular, Muscular, Venas, Óseo" />
        <Tab label="Informe" />
        <Tab label="Imágenes" />
      </Tabs>

      <Box className="min-h-0 pb-2 px-4 overflow-y-auto flex flex-col">
        {value === 0 && (
          <PetDetailsAndReason
            selectedPet={selectedPet}
            setField={setField}
            isSaving={isSaving}
            statusMessage={statusMessage}
            calculateAge={calculateAge}
          />
        )}
        {value === 1 && <LiverGallbladderKidneys />}
        {value === 2 && <SpleenPancreasStomachSmallIntestine />}
        {value === 3 && <LargeIntestineBladderUrethraLymph />}
        {value === 4 && <AdrenalUterusOvaries />}
        {value === 5 && <MammaryGlandsAndOthers />}
        {value === 6 && <EyeMuscleVeinBone />}
        {value === 7 && (
          <SummaryReportContent
            selectedPet={selectedPet}
            setField={setField}
            isSaving={isSaving}
            statusMessage={statusMessage}
            calculateAge={calculateAge}
          />
        )}
        {value === 8 && <UltrasoundImagesContent />}
      </Box>
    </Box>
  );
}
