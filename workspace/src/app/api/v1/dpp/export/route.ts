
// --- File: src/app/api/v1/dpp/export/route.ts ---
// Description: Conceptual API endpoint to simulate exporting DPP data.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';

// Helper to convert JSON to CSV (simple implementation)
function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => {
      const strValue = String(value).replace(/"/g, '""'); // Escape double quotes
      return `"${strValue}"`; // Enclose in double quotes
    }).join(',')
  );
  return `${headers}\n${rows.join('\n')}`;
}

// Helper to pick specific fields from an object
function pickFields(obj: Record<string, any>, fields: string[]): Record<string, any> {
  const picked: Record<string, any> = {};
  fields.forEach(field => {
    const keys = field.split('.');
    let currentVal = obj;
    let found = true;
    for (const key of keys) {
      if (currentVal && typeof currentVal === 'object' && key in currentVal) {
        currentVal = currentVal[key];
      } else {
        found = false;
        break;
      }
    }
    if (found) {
      picked[field.replace(/\./g, '_')] = currentVal; // Flatten nested keys for CSV
    } else {
      picked[field.replace(/\./g, '_')] = ''; // Or handle missing fields as needed
    }
  });
  return picked;
}


export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const format = searchParams.get('format') || 'json';
  const fieldsParam = searchParams.get('fields');

  let dppsToExport: DigitalProductPassport[] = [...MOCK_DPPS];

  if (idsParam) {
    const ids = idsParam.split(',').map(id => id.trim());
    dppsToExport = MOCK_DPPS.filter(dpp => ids.includes(dpp.id));
  }

  if (dppsToExport.length === 0) {
    return NextResponse.json({ error: { code: 404, message: "No products found matching criteria or specified IDs." } }, { status: 404 });
  }

  let exportData: any = dppsToExport;

  if (fieldsParam) {
    const fields = fieldsParam.split(',').map(f => f.trim());
    exportData = dppsToExport.map(dpp => pickFields(dpp, fields));
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + dppsToExport.length * 20));

  if (format === 'csv') {
    if (!Array.isArray(exportData) || exportData.length === 0) {
        return NextResponse.json({ error: { code: 400, message: "No data to export to CSV." } }, { status: 400 });
    }
    const csvData = convertToCSV(exportData);
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="dpp_export_${Date.now()}.csv"`,
      },
    });
  } else if (format === 'xml') {
    // Conceptual XML export - in a real app, use a library like 'xmlbuilder'
    let xmlData = '<DPPExport>';
    exportData.forEach((dpp: any) => {
      xmlData += '<DigitalProductPassport>';
      Object.entries(dpp).forEach(([key, value]) => {
        xmlData += `<${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
      });
      xmlData += '</DigitalProductPassport>';
    });
    xmlData += '</DPPExport>';
    return new NextResponse(xmlData, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="dpp_export_${Date.now()}.xml"`,
      },
    });
  } else if (format === 'json') {
    return NextResponse.json(exportData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="dpp_export_${Date.now()}.json"`,
      },
    });
  } else {
    return NextResponse.json({ error: { code: 400, message: `Unsupported format: ${format}. Supported formats: json, csv, xml.` } }, { status: 400 });
  }
}
