import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";

export async function POST(req: Request) {
  try {
    const { report } = await req.json();

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const html = reportPdfTemplate(report);

    await page.setContent(html, { waitUntil: "domcontentloaded" });

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
      { status: 500 }
    );
  }
}
