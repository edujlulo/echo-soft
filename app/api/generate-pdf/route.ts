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

    // For be sure the image has been uploaded
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
