import { type NextRequest, NextResponse } from "next/server";

// Dynamic import to avoid pdf-parse initialization issues
async function parsePDF(buffer: Buffer): Promise<string> {
  // Use pdf-parse with custom options to avoid test file loading
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let text = "";

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      // Parse PDF
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await parsePDF(buffer);
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      // Parse plain text
      text = await file.text();
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      // For DOC/DOCX, we'll extract basic text
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Basic text extraction for DOCX (XML-based)
      if (fileName.endsWith(".docx")) {
        const decoder = new TextDecoder("utf-8");
        const content = decoder.decode(uint8Array);
        // Extract text between XML tags (simplified)
        text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      } else {
        // For .doc files, try to extract readable text
        const decoder = new TextDecoder("utf-8", { fatal: false });
        text = decoder.decode(uint8Array).replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ").trim();
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Clean up the extracted text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return NextResponse.json({
      success: true,
      text,
      length: text.length,
    });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse document" },
      { status: 500 }
    );
  }
}
