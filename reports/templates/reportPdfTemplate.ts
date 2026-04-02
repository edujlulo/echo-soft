interface ReportTemplateProps {
  report: string;
  formConsultation: any;
  selectedPet: any;
  activeVet: any;
  activeClinic: any;
}

export function reportPdfTemplate({
  report,
  formConsultation,
  selectedPet,
  activeVet,
  activeClinic,
}: ReportTemplateProps): string {
  return `
    <html>
      <head>
        <style>
          body {
  font-family: Arial, sans-serif;
  padding: 40px;
  white-space: pre-line;
}

html,
body {
  height: 100%;
}

.page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

h2 {
  text-align: center;
}

/* ============= PET DETAILS SECTION ============= */
.pet-details {
  width: 100%;
  border: 2px solid #1e3a5f; /* azul oscuro profesional */
  border-radius: 6px;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 25px;
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

/* =============== FOOTER STYLES ================ */
.signature-line {
  width: 45%;
  height: 2px;
  background-color: black;
  margin: 0 auto 8px auto; /* centra horizontalmente */
}

.footer {
  margin-top: auto; /* 🔥 esto empuja el footer abajo */
  page-break-inside: avoid;
}

/* BLOQUE FIRMA (centrado) */
.footer-signature {
  text-align: center;
  margin-bottom: 20px;
}

.footer-signature p {
  margin: 2px 0;
  font-size: 14px;
}

/* BLOQUE CLÍNICA (izquierda y en negrita) */
.footer-clinic {
  text-align: left;
  font-weight: bold;
  font-size: 13px;
}

.footer-clinic p {
  margin: 2px 0;
}
        </style>
      </head>
      <body>
     <div class="page">
      <!-- ============= HEADER ============== -->
      <div>
        <!-- CLINIC LOGO -->
        <div>
          <p>Here will be the clinic logo</p>
        </div>

        <!-- REPORT TITLE -->
        <div>
          <h2>${formConsultation?.report_title}</h2>
        </div>

        <!-- PET DETAILS -->
        <table class="pet-details">
          <tr>
            <td><strong>Dueño:</strong> ${selectedPet?.owner}</td>
            <td><strong>Mascota:</strong> ${selectedPet?.name}</td>
            <td>
              <strong>Fecha:</strong> ${formConsultation?.consultation_date}
            </td>
          </tr>

          <tr>
            <td><strong>Especie:</strong> ${selectedPet?.species}</td>
            <td><strong>Raza:</strong> ${selectedPet?.breed ?? ""}</td>
            <td><strong>Sexo:</strong> ${selectedPet?.sex}</td>
          </tr>

          <tr>
            <td><strong>Referido:</strong> ${selectedPet?.referred_by}</td>
            <td><strong>Edad:</strong> ${selectedPet?.birth_date}</td>
            <td><strong>Peso:</strong> ${selectedPet?.weight}</td>
          </tr>
        </table>
      </div>
      <!-- =============== REPORT =============== -->
      <p>${report}</p>

      <!-- ============== FOOTER ============== -->
      <div class="footer">
        <div class="footer-signature">
          <div class="signature-line"></div>

          <p>${activeVet.name}</p>
          <p>${activeVet.registration_number}</p>
          <p>${activeClinic.name}</p>
        </div>

        <div class="footer-clinic">
          <p>Dirección: ${activeClinic.address}</p>
          <p>Teléfonos: ${activeClinic.phone}</p>
        </div>
      </div>
    </div>
  </body>
    </html>
  `;
}
