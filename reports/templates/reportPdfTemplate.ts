interface ReportTemplateUltrasoundImage {
  id: string;
  src: string;
  alt?: string;
  fileName?: string | null;
}

interface ReportTemplateProps {
  report: string;
  formConsultation: any;
  selectedPet: any;
  activeVet: any;
  activeClinic: any;
  image: any;
  images: {
    profile?: string;
  };
  ultrasoundImages?: ReportTemplateUltrasoundImage[];
  ultrasoundLayout?: "grid-6" | "single";
}

export function reportPdfTemplate({
  report,
  formConsultation,
  selectedPet,
  activeVet,
  activeClinic,
  image,
  images,
  ultrasoundImages = [],
  ultrasoundLayout = "grid-6",
}: ReportTemplateProps): string {
  function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }

    return chunks;
  }

  const imagesPerPage = ultrasoundLayout === "single" ? 1 : 6;
  const ultrasoundPages = chunkArray(ultrasoundImages, imagesPerPage);

  const ultrasoundPagesHtml = ultrasoundPages
    .map((pageImages, pageIndex) => {
      const isSingleLayout = ultrasoundLayout === "single";
      const emptySlots = isSingleLayout
        ? 0
        : Math.max(0, 6 - pageImages.length);

      const emptySlotsHtml = isSingleLayout
        ? ""
        : Array.from({ length: emptySlots })
            .map(
              () => `<div class="ultrasound-slot ultrasound-slot-empty"></div>`,
            )
            .join("");

      const imagesHtml = pageImages
        .map(
          (img) => `
          <div class="ultrasound-slot ${
            isSingleLayout ? "ultrasound-slot-single" : ""
          }">
            <div class="ultrasound-image-frame ${
              isSingleLayout ? "ultrasound-image-frame-single" : ""
            }">
              <img
                class="ultrasound-image"
                src="${img.src}"
                alt="${img.alt ?? "Ultrasound image"}"
              />
            </div>
          </div>
        `,
        )
        .join("");

      return `
      <div class="ultrasound-page ${pageIndex > 0 ? "page-break" : ""} ${
        isSingleLayout ? "ultrasound-page-single" : ""
      }">
        <div class="ultrasound-page-title">Imágenes de ecografía</div>
        <div class="${
          isSingleLayout ? "ultrasound-grid-single" : "ultrasound-grid"
        }">
          ${imagesHtml}
          ${emptySlotsHtml}
        </div>
      </div>
    `;
    })
    .join("");

  // ============ TO CHECK STYLES BUGS ============
  // * {
  //   outline: 1px solid red;
  // }

  return `
    <html>
      <head>
        <style>
          body {
  font-family: Arial, sans-serif;
  padding-right: 30px;
  padding-left: 30px;
  padding-bottom: 0;
  padding-top: 0;
  margin-bottom: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.page {
  position: relative;
  break-inside: avoid;
}

/* ============= CLINIC LOGO STYLES ============= */
.clinic-logo {
  max-width: 300px;
  max-height: 200px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto 10px auto;
  margin-top: 10px;
  margin-bottom: 20px;
}

/* ============= REPORT TITLE ============= */
h3 {
  text-align: center;
  margin: 0;
  margin-bottom: 10px;
}

/* ============= PET DETAILS SECTION ============= */
.pet-details {
  width: 100%;
  border: 2px solid #1e3a5f; /* azul oscuro profesional */
  border-radius: 6px;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 0;
  font-size: 14px;
}

.pet-details td {
  padding: 10px 14px;
  vertical-align: top;
  width: 33%;
}

.pet-details tr:not(:last-child) td {
  padding-bottom: 6px;
}

/* Opcional: mejorar legibilidad */
.pet-details strong {
  color: black;
}

/* =============== REPORT TEXT ================ */
.report-text {
  white-space: pre-line;
  margin-bottom: 0;
}

.ultrasound-page {
  width: 100%;
  margin-top: 24px;
  break-inside: avoid;
}

.ultrasound-page-single {
  min-height: 0;
}

.page-break {
  break-before: page;
}

.ultrasound-page-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 14px 0;
  text-align: center;
}

.ultrasound-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 16px;
  width: 100%;
}

.ultrasound-grid-single {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.ultrasound-slot {
  width: 100%;
  break-inside: avoid;
}

.ultrasound-slot-single {
  width: 100%;
}

.ultrasound-image-frame {
  width: 100%;
  height: 210px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.ultrasound-image-frame-single {
  width: 100%;
  height: 760px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: white;
}

.ultrasound-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
  display: block;
}

.ultrasound-slot-empty .ultrasound-image-frame {
  border: none;
  background: transparent;
}

/* =============== FOOTER STYLES ================ */

.footer > div > div:first-child {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 🔥 baja la imagen */
}

.top-footer-section-container {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
}

/* PET IMAGE STYLES */

.pet-image {
  max-width: 150px;
  max-height: 250px;
  width: auto;
  height: auto;
  display: block;
}

.footer-signature-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.signature-line {
  width: 45%;
  height: 2px;
  background-color: black;
  margin: 0 auto 8px auto; /* centra horizontalmente */
}
        </style>
      </head>

  <body>
    <div class="page">
      <!-- ============= HEADER ============== -->
      <div>
        <!-- CLINIC LOGO -->
        <div>
          <img
  class="clinic-logo"
  src="${image || ""}"
  alt="Clinic logo"
/>
          <!-- <img class="clinic-logo" src="logointegral.jpg" alt="Clinic logo" /> -->
        </div>
        <!-- REPORT TITLE -->
        <div>
          <h3>${formConsultation?.report_title ?? ""}</h3>
        </div>
        <!-- PET DETAILS -->
        <table class="pet-details">
          <tr>
            <td><strong>Dueño:</strong> ${selectedPet?.owner ?? ""}</td>
            <td><strong>Mascota:</strong> ${selectedPet?.name ?? ""}</td>
            <td>
              <strong>Fecha:</strong> ${
                formConsultation?.consultation_date ?? ""
              }
            </td>
          </tr>

          <tr>
            <td><strong>Especie:</strong> ${selectedPet?.species ?? ""}</td>
            <td><strong>Raza:</strong> ${selectedPet?.breed ?? ""}</td>
            <td><strong>Sexo:</strong> ${selectedPet?.sex ?? ""}</td>
          </tr>

          <tr>
            <td>
              <strong>Referido:</strong> ${selectedPet?.referred_by ?? ""}
            </td>
            <td><strong>Edad:</strong> ${selectedPet?.birth_date ?? ""}</td>
            <td><strong>Peso:</strong> ${selectedPet?.weight ?? ""}</td>
          </tr>
        </table>
      </div>
      <!-- =============== REPORT =============== -->
      <div class="report-text">
      ${report ?? ""}
      </div>

      ${ultrasoundPagesHtml}
    </div>
  </body>
</html>
  `;
}
