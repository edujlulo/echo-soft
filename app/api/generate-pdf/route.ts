import { NextResponse } from "next/server";
// import puppeteer from "puppeteer-core";
// import puppeteer from "puppeteer";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";

export const runtime = "nodejs";

async function toBase64(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Image fetch failed:", url);
      return null;
    }

    const buffer = await res.arrayBuffer();
    return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
  } catch (e) {
    console.error("Image error:", e);
    return null;
  }
}

interface PdfUltrasoundImage {
  id: string;
  src: string;
  alt?: string;
  fileName?: string | null;
}

interface PdfUltrasoundImageBase64 {
  id: string;
  src: string;
  alt: string;
  fileName: string | null;
}

async function toBase64ImageList(
  images: PdfUltrasoundImage[] | undefined,
): Promise<PdfUltrasoundImageBase64[]> {
  if (!images || images.length === 0) {
    return [];
  }

  const results = await Promise.all(
    images.map(async (img) => {
      const base64 = await toBase64(img.src);

      if (!base64) {
        return null;
      }

      return {
        id: img.id,
        src: base64,
        alt: img.alt ?? "Ultrasound image",
        fileName: img.fileName ?? null,
      };
    }),
  );

  return results.filter((img): img is PdfUltrasoundImageBase64 => img !== null);
}

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
      ultrasoundImages,
    } = await req.json();

    const profileBase64 = images?.profile
      ? await toBase64(images.profile)
      : null;

    const ultrasoundImagesBase64 = await toBase64ImageList(ultrasoundImages);

    // // For allow to work on production:
    let browser;

    const isProd = process.env.VERCEL === "1";

    try {
      if (isProd) {
        const chromium = (await import("@sparticuz/chromium")).default;
        const puppeteer = (await import("puppeteer-core")).default;

        browser = await puppeteer.launch({
          args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      } else {
        const puppeteer = (await import("puppeteer")).default;

        browser = await puppeteer.launch({
          headless: true,
        });
      }
    } catch (err) {
      console.error("Browser launch failed:", err);
      throw err;
    }

    const page = await browser.newPage();

    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    page.on("error", (err) => console.error("PAGE ERROR:", err));

    // =========== FOR DEBUG ==============
    //     const html = `
    //   <html>
    //     <body>
    //       <h1>This is a test PDF</h1>
    //     </body>
    //   </html>
    // `;
    // =========== FOR DEBUG ==============

    // ========== REAL HTML PDF REPORT TEMPLATE ============
    const html = reportPdfTemplate({
      report,
      formConsultation,
      selectedPet,
      activeVet,
      activeClinic,
      image,
      images,
      ultrasoundImages: ultrasoundImagesBase64,
    });

    await page.setContent(html, { waitUntil: "load" });

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

    // =========== FOR DEBUG ==============
    // const pdfBuffer = await page.pdf({
    //   format: "A4",
    // });
    // =========== FOR DEBUG ==============

    // =============================== REAL PAGE.PDF PDFBUFFER ===================================
    let pdfBuffer;

    try {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,

        // 🔥 ACTIVAR HEADER/FOOTER NATIVO
        displayHeaderFooter: true,

        headerTemplate: `<div></div>`,

        footerTemplate: `
        <div style="
          width: 100%;
          height: 80px;
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
                profileBase64
                  ? `<img src="${profileBase64}" style="height: 60px; object-fit: contain;" />`
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
              <div>Dirección: ${activeClinic?.address ?? ""}</div>
              <div>Teléfono: ${activeClinic?.phone ?? ""}</div>
            </div>

          </div>
        </div>
      `,

        // 🔥 CLAVE para que no se solape
        margin: {
          top: "30px",
          bottom: "160px",
          left: "30px",
          right: "30px",
        },
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      throw err;
    }

    // Console logs:
    console.log("PDF size:", pdfBuffer.length);
    console.log("Profile base64 exists:", !!profileBase64);
    console.log("HTML length:", html.length);
    console.log("Image URL:", images?.profile);

    await browser.close();

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=report.pdf",
      },
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Error generating PDF" },
      { status: 500 },
    );
  }
}
