"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { consultationCategories } from "@/config/consultationCategories";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useTranslations } from "next-intl";

export default function OrgansTable() {
  const t = useTranslations("QuickModeSection");

  const setActiveCategory = useEditableSelectListStore(
    (state) => state.setActiveCategory
  );

  const setActiveField = useEditableSelectListStore(
    (state) => state.setActiveField
  );

  const activeCategory = useEditableSelectListStore(
    (state) => state.activeCategory
  );

  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: t("organ"),
      flex: 1,
    },
  ];

  const rows = consultationCategories.map((c, index) => {
    const translatedLabels: Record<string, string> = {
      urinary_bladder: t("urinaryBladder"),
      spleen: t("spleen"),
      pancreas: t("pancreas"),
      left_kidney: t("leftKidney"),
      liver: t("liver"),
      uterus: t("uterus"),
      right_kidney: t("rightKidney"),
      gallbladder: t("gallbladder"),
      stomach: t("stomach"),
      small_intestine: t("smallIntestine"),
      colon: t("colon"),
      urethra: t("urethra"),
      lymph_nodes: t("lymphNodes"),
      adrenal_glands: t("adrenalGlands"),
      ovaries: t("ovaries"),
      thyroid_glands: t("thyroidGlands"),
      mammary_glands: t("mammaryGlands"),
      ocular_study: t("ocularStudy"),
      muscular_study: t("muscularStudy"),
      bones_others: t("bonesOthers"),
      thorax_lungs: t("thoraxLungs"),
      others: t("others"),
      major_vessels: t("majorVessels"),
      abdominal_cavity: t("abdominalCavity"),
      conclusions: t("conclusions"),
      observations: t("observations"),
    };

    return {
      id: index + 1,
      label: c.key ? translatedLabels[c.key] ?? c.label : c.label,
      key: c.key,
    };
  });

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooter
      rowHeight={26}
      columnHeaderHeight={28}
      disableRowSelectionOnClick
      checkboxSelection={false}
      onRowClick={(params) => {
        setActiveCategory(params.row.key);
        setActiveField(params.row.label);
      }}
      getRowClassName={(params) =>
        params.row.key === activeCategory ? "selected-row" : ""
      }
      sx={{
        border: "1px solid #93c5fd",

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#dbeafe",
          color: "#172554",
        },

        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#dbeafe",
          color: "#172554",
          borderRight: "1px solid #93c5fd",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold",
        },

        "& .MuiDataGrid-cell": {
          borderRight: "1px solid #93c5fd",
          borderBottom: "1px solid #93c5fd",
        },

        "& .MuiDataGrid-row": {
          borderBottom: "1px solid #93c5fd",
        },

        "& .MuiDataGrid-row.selected-row, & .MuiDataGrid-row.selected-row:hover":
          {
            backgroundColor: "#93c5fd",
          },
      }}
    />
  );
}
