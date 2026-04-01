export function reportPdfTemplate(report: string): string {
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
        </style>
      </head>
      <body>
        <h1>Informe clínico</h1>
        <p>${report}</p>
      </body>
    </html>
  `;
}
