import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export async function generatePDFFromHTML(html: string): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.zIndex = '-9999';
  container.style.backgroundColor = '#ffffff';
  container.style.width = '750px';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    // Collect link positions BEFORE html2canvas (which may alter layout)
    const linkAnnotations: { x: number; y: number; w: number; h: number; url: string }[] = [];
    const containerRect = container.getBoundingClientRect();
    const links = container.querySelectorAll('a[href]');
    links.forEach((link) => {
      const rect = link.getBoundingClientRect();
      const href = link.getAttribute('href');
      if (href) {
        linkAnnotations.push({
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          w: rect.width,
          h: rect.height,
          url: href,
        });
      }
    });

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 750,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      margin,
      imgWidth,
      Math.min(imgHeight, pageHeight - margin * 2)
    );

    // Convert pixel positions to PDF mm coordinates and add clickable link areas
    const pxToMm = imgWidth / 750;
    linkAnnotations.forEach(({ x, y, w, h, url }) => {
      pdf.link(
        margin + x * pxToMm,
        margin + y * pxToMm,
        w * pxToMm,
        h * pxToMm,
        { url }
      );
    });

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateBulkZip(
  files: { blob: Blob; filename: string }[],
  zipName: string
): Promise<void> {
  const zip = new JSZip();
  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, `${zipName}.zip`);
}
