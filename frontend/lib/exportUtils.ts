/**
 * Native client-side export utilities replacing Google Sheets API dependencies.
 */

// Format JSON as a downloadable string
export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Format Array of Objects as CSV
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => 
    Object.values(obj)
      .map(val => (typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val))
      .join(",")
  );
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate a simple PDF representation by calling window.print() after rendering an overlay
export const downloadPDF = (data: any, title: string) => {
  // Since we don't want to add heavy libraries like jsPDF, we will create a temporary
  // printable HTML view and trigger the browser print dialog.
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error("Print window blocked by browser popup blocker.");
    return;
  }

  const dateStr = new Date().toLocaleString();
  
  let contentHtml = "";
  if (Array.isArray(data)) {
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      contentHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #2E7D32; color: white;">
              ${headers.map(h => `<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(h => `<td style="padding: 8px; border: 1px solid #ddd;">${row[h]}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    } else {
      contentHtml = "<p>No data available.</p>";
    }
  } else {
    contentHtml = `<pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${JSON.stringify(data, null, 2)}</pre>`;
  }

  const html = `
    <html>
      <head>
        <title>${title} - Report Export</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { border-bottom: 2px solid #2E7D32; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1B5E20; }
          .meta { color: #666; font-size: 12px; margin-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EcoSphere Environmental Report</h1>
          <h2>${title}</h2>
          <div class="meta">
            <p>Generated: ${dateStr}</p>
            <p>Verification Source: Local Client Engine</p>
          </div>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="no-print" style="margin-top: 40px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #2E7D32; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Save as PDF
          </button>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
