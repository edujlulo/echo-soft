import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";

export async function POST(req: Request) {
  try {
    const {
      report,
      formConsultation,
      selectedPet,
      activeVet,
      activeClinic,
      image,
      images,
    } = await req.json();

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // 🔥 importante en servidores
    });

    const page = await browser.newPage();

    const html = reportPdfTemplate({
      report,
      formConsultation,
      selectedPet,
      activeVet,
      activeClinic,
      image,
      images,
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    // ✅ asegurar que TODAS las imágenes cargan
    await page.evaluate(async () => {
      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,

      // 🔥 ACTIVAR HEADER/FOOTER NATIVO
      displayHeaderFooter: true,

      headerTemplate: `<div></div>`,

      footerTemplate: `
        <div style="
          width: 100%;
          font-size: 10px;
          padding: 0 30px;
          box-sizing: border-box;
        ">
          <div style="
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          ">

            <!-- LEFT: PET IMAGE -->
            <div>
              ${
                images?.profile
                  ? `<img src="${images.profile}" style="height: 60px; object-fit: contain;" />`
                  : ``
              }
            </div>

            <!-- CENTER: SIGNATURE -->
            <div style="text-align: center; margin-bottom: 25px">
              <div style="
                border-top: 1px solid black;
                width: 150px;
                margin: 5px auto 5px auto;
              "></div>
              <div>${activeVet?.name ?? ""}</div>
              <div>${activeVet?.registration_number ?? ""}</div>
              <div>${activeClinic?.name ?? ""}</div>
            </div>

            <!-- RIGHT: CLINIC INFO -->
            <div style="text-align: right; max-width: 200px; margin-bottom: 25px">
              <div>${activeClinic?.address ?? ""}</div>
              <div>${activeClinic?.phone ?? ""}</div>
            </div>

          </div>
        </div>
      `,

      // 🔥 CLAVE para que no se solape
      margin: {
        top: "30px",
        bottom: "120px",
        left: "30px",
        right: "30px",
      },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=report.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generating PDF" },
      { status: 500 },
    );
  }
}
