import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Document, Packer, Paragraph, TextRun } from 'docx'

export class ExportService {
  private static instance: ExportService

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  async exportAsPDF(content: string, fileName: string): Promise<void> {
    try {
      // Create a temporary div to render the HTML content
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content
      tempDiv.style.width = "800px"
      tempDiv.style.padding = "40px"
      tempDiv.style.backgroundColor = "white"
      document.body.appendChild(tempDiv)

      // Convert the div to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      document.body.removeChild(tempDiv)

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${fileName}.pdf`)
    } catch (error) {
      console.error("PDF export error:", error)
      throw new Error("Failed to export as PDF")
    }
  }

  async exportAsWord(content: string, fileName: string): Promise<void> {
    try {
      // Create a Blob with the content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h3 { color: #333; margin-top: 20px; }
              p { margin: 10px 0; }
              strong { color: #000; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `

      const blob = new Blob([htmlContent], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      // Create download link and trigger download
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Word export error:", error)
      throw new Error("Failed to export as Word document")
    }
  }

  async exportAsPlainText(content: string, fileName: string): Promise<void> {
    try {
      // Convert HTML to plain text
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content
      const plainText = tempDiv.textContent || tempDiv.innerText || ""

      // Create download link
      const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Text export error:", error)
      throw new Error("Failed to export as text")
    }
  }
}

export async function exportToPDF(content: string, claim: Claim): Promise<Blob> {
  const doc = new jsPDF()
  
  // Set font and size
  doc.setFont('helvetica')
  doc.setFontSize(12)
  
  // Add content with word wrapping
  const splitText = doc.splitTextToSize(content, 180)
  doc.text(splitText, 15, 20)
  
  return doc.output('blob')
}

export async function exportToDOCX(content: string, claim: Claim): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun(content)
          ],
        }),
      ],
    }],
  })

  return await Packer.toBlob(doc)
}

export async function exportToTXT(content: string, claim: Claim): Promise<Blob> {
  return new Blob([content], { type: 'text/plain' })
} 