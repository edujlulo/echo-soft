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
}

export function reportPdfTemplate({
  report,
  formConsultation,
  selectedPet,
  activeVet,
  activeClinic,
  image,
  images,
}: ReportTemplateProps): string {
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
    </div>
  </body>
</html>
  `;
}
