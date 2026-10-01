/**
 * Law Firm Management System - Sector Report Export & Extraction Utilities
 * Formats CSV, JSON, and prepares print-ready data for all firm practice sectors.
 */

export interface ExportColumn {
  header: string;
  key: string;
  format?: (value: any, row?: any) => string | number;
}

export interface SectorReportSummaryStat {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface SectorReportConfig {
  sectorId: string;
  sectorName: string;
  title: string;
  description: string;
  category: 'Practice' | 'Finance' | 'Intelligence' | 'Governance';
  iconName: string;
  columns: ExportColumn[];
  defaultFilename: string;
  statutoryReference?: string;
}

/**
 * Downloads tabular data as a clean, Excel-compatible CSV file.
 * Automatically adds UTF-8 BOM (\uFEFF) to ensure currency symbols and characters render in MS Excel.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void {
  const sanitizeCell = (cell: any): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    // Escape double quotes by doubling them
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const headerLine = headers.map(sanitizeCell).join(',');
  const rowLines = rows.map(row => row.map(sanitizeCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', cleanFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads data as formatted JSON for API ingestion, auditor exchange, or system backups.
 */
export function exportToJson(filename: string, data: any): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  link.setAttribute('download', cleanFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies structured report summary to the clipboard.
 */
export async function copyReportSummaryToClipboard(
  title: string,
  stats: SectorReportSummaryStat[],
  recordCount: number
): Promise<boolean> {
  try {
    const text = [
      `=== ${title.toUpperCase()} ===`,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Records: ${recordCount}`,
      '--- Key Performance Metrics ---',
      ...stats.map(s => `${s.label}: ${s.value}`),
      '=================================='
    ].join('\n');

    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
