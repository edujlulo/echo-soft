interface ReportTemplateProps {
  report: string;
  formConsultation: any;
  selectedPet: any;
}

export function reportPdfTemplate({
  report,
  formConsultation,
  selectedPet,
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

h1 {
  text-align: center;
  margin-bottom: 30px;
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

        </style>
      </head>
      <body>
    <!-- ============= HEADER ============== -->
    <div>
      <!-- CLINIC LOGO -->
      <div>
        <p>Here will be the clinic logo</p>
      </div>

      <!-- REPORT TITLE -->
      <div>
        <h1>${formConsultation?.report_title}</h1>
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
          <td><strong>Raza:</strong> ${selectedPet?.breed}</td>
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
    <p>Here will be the footer</p>
  </body>
    </html>
  `;
}
