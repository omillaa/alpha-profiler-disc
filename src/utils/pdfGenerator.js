/* ============================================================
   EXECUTIVE 6-PAGE PDF GENERATOR ENGINE
   ============================================================ */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captures 6 distinct page elements from the DOM and generates a 6-page A4 PDF document.
 * @param {string} respondentName - Name of the respondent for filename
 * @param {Array<string>} pageElementIds - Array of 6 DOM element IDs ('pdf-page-1' .. 'pdf-page-6')
 */
export async function downloadExecutivePDF(respondentName, pageElementIds = [
  "pdf-page-1",
  "pdf-page-2",
  "pdf-page-3",
  "pdf-page-4",
  "pdf-page-5",
  "pdf-page-6"
]) {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    for (let i = 0; i < pageElementIds.length; i++) {
      const elementId = pageElementIds[i];
      const element = document.getElementById(elementId);

      if (!element) {
        console.warn(`Element #${elementId} not found for PDF page generation.`);
        continue;
      }

      // Render DOM element to high-res canvas
      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    }

    const cleanName = (respondentName || "Respondente").replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`Relatorio_Profiler_DISC_${cleanName}.pdf`);
    return true;
  } catch (error) {
    console.error("Erro na geração do PDF:", error);
    alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
    return false;
  }
}
