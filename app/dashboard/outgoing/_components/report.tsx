'use client';

import { Button } from '@/components/ui/button';
import { Contract, Order, OutgoingScale, Transporter } from '@prisma/client';
import { Download } from 'lucide-react';
import { useState } from 'react';
import ExcelJS from 'exceljs';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface ReportProps {
   data: (OutgoingScale & {
      order?: Order & {
         contract?: Contract;
      };
   })[];
   fullAccess: boolean;
}

const applyBorder = (cell: ExcelJS.Cell) => {
   cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
   };
};

const setCellStyle = (
   cell: ExcelJS.Cell,
   options: { bold?: boolean; align?: string; bgColor?: string } = {}
) => {
   const { bold = false, align = 'left', bgColor } = options;
   cell.alignment = { horizontal: align as any, vertical: 'middle' };
   cell.font = { bold };
   if (bgColor) {
      cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: bgColor }
      };
   }
};

export function Report({ data, fullAccess }: ReportProps) {
   const [pending, setPending] = useState<boolean>(false);

   const handleGenerate = async () => {
      setPending(true);
      try {
         const workbook = new ExcelJS.Workbook();

         if (!data || data.length === 0) {
            toast.error('Tidak ada data');
            return;
         }

         const sheet = workbook.addWorksheet('Barang Keluar');
         const columnWidths = fullAccess
            ? [6, 20, 20, 35, 35, 20, 30, 20, 12, 12, 12, 12, 12, 12]
            : [6, 20, 20, 35, 35, 30, 20, 12, 12, 12, 12, 12, 12];
         columnWidths.forEach(
            (width, index) => (sheet.getColumn(index + 2).width = width)
         );

         const titles = [
            {
               range: 'B2:O2',
               value: 'PT. Garuda Sakti Nusantara Indonesia',
               size: 18,
               alignHozontal: 'center'
            },
            {
               cell: 'B3',
               value: 'Laporan Timbangan - Barang Keluar',
               size: 14,
               alignHozontal: 'left'
            }
         ];

         titles.forEach(({ range, cell, value, size, alignHozontal }) => {
            if (range) sheet.mergeCells(range);
            const targetCell = sheet.getCell(cell || range!.split(':')[0]);
            targetCell.value = value;
            targetCell.font = { bold: true, size };
            targetCell.alignment = {
               horizontal: alignHozontal as any,
               vertical: 'middle'
            };
         });

         const headers = fullAccess
            ? [
                 { col: 'B5', value: 'No', merge: 'B5:B6' },
                 { col: 'C5', value: 'Tanggal Masuk', merge: 'C5:C6' },
                 { col: 'D5', value: 'Nomor Tiket', merge: 'D5:D6' },
                 { col: 'E5', value: 'Nomor Pengambilan', merge: 'E5:E6' },
                 { col: 'F5', value: 'Nomor Kontrak', merge: 'F5:F6' },
                 { col: 'G5', value: 'Penyedia Angkutan', merge: 'G5:G6' },
                 { col: 'H5', value: 'Pengemudi', merge: 'H5:H6' },
                 { col: 'I5', value: 'Nomor Kendaraan', merge: 'I5:I6' },
                 { col: 'J5', value: 'Timbangan', merge: 'J5:K5' },
                 { col: 'J6', value: 'Bruto' },
                 { col: 'K6', value: 'Tara' },
                 { col: 'L5', value: 'Neto', merge: 'L5:L6' }
              ]
            : [
                 { col: 'B5', value: 'No', merge: 'B5:B6' },
                 { col: 'C5', value: 'Tanggal Masuk', merge: 'C5:C6' },
                 { col: 'D5', value: 'Nomor Tiket', merge: 'D5:D6' },
                 { col: 'E5', value: 'Nomor Pengambilan', merge: 'E5:E6' },
                 { col: 'F5', value: 'Penyedia Angkutan', merge: 'F5:F6' },
                 { col: 'G5', value: 'Pengemudi', merge: 'G5:G6' },
                 { col: 'H5', value: 'Nomor Kendaraan', merge: 'H5:H6' },
                 { col: 'I5', value: 'Timbangan', merge: 'I5:J5' },
                 { col: 'I6', value: 'Bruto' },
                 { col: 'J6', value: 'Tara' },
                 { col: 'K5', value: 'Neto', merge: 'K5:K6' }
              ];

         headers.forEach(({ col, value, merge }) => {
            if (merge) sheet.mergeCells(merge);
            const cell = sheet.getCell(col);
            cell.value = value;
            setCellStyle(cell, {
               bold: true,
               align: 'center',
               bgColor: '6FC276'
            });
            applyBorder(cell);
         });

         // Inside the data.forEach loop
         data.forEach((row, index) => {
            const tara = row.weightOut === null ? 0 : row.weightOut;
            const transporter =
               row.transporter === Transporter.SELLER
                  ? 'Penjual'
                  : row.transporter === Transporter.BUYER
                    ? 'Pembeli'
                    : row.transporter;
            const rowIndex = index + 7;

            const newRowData = fullAccess
               ? [
                    undefined,
                    index + 1,
                    formatDate(row.entryTime),
                    row.ticketNo,
                    row.order?.orderNo,
                    row.order?.contract?.contractNo,
                    transporter,
                    row.driver,
                    row.plateNo,
                    row.weightIn,
                    tara,
                    undefined // Neto will be dynamically assigned
                 ]
               : [
                    undefined,
                    index + 1,
                    formatDate(row.entryTime),
                    row.ticketNo,
                    row.order?.orderNo,
                    transporter,
                    row.driver,
                    row.plateNo,
                    row.weightIn,
                    tara,
                    undefined // Neto will be dynamically assigned
                 ];

            const newRow = sheet.addRow(newRowData);

            // Correct Neto formula for current row
            const netoColumn = fullAccess ? 'L' : 'K'; // Column for Neto
            const brutoColumn = fullAccess ? 'J' : 'I'; // Column for Bruto
            const taraColumn = fullAccess ? 'K' : 'J'; // Column for Tara

            // Apply formula only if tara (weightOut) is not 0
            if (tara !== 0) {
               newRow.getCell(netoColumn).value = {
                  formula: `${taraColumn}${rowIndex} - ${brutoColumn}${rowIndex}`
               };
            } else {
               newRow.getCell(netoColumn).value = 0; // Default value when tara is 0
            }

            newRow.eachCell((cell) => {
               setCellStyle(cell);
               applyBorder(cell);
            });
         });

         if (fullAccess) {
            // Totals and averages
            const totalRowIdx = data.length + 7;
            const summaryRows = [
               { label: 'Total', rowIndex: totalRowIdx, formula: 'SUM' }
            ];
            summaryRows.forEach(({ label, rowIndex, formula }) => {
               sheet.mergeCells(`B${rowIndex}:I${rowIndex}`);
               const labelCell = sheet.getCell(`B${rowIndex}`);
               labelCell.value = label;
               setCellStyle(labelCell, { bold: true, align: 'center' });
               applyBorder(labelCell);

               ['J', 'K', 'L'].forEach((col) => {
                  const cell = sheet.getCell(`${col}${rowIndex}`);
                  cell.value = {
                     formula: `${formula}(${col}7:${col}${totalRowIdx - 1})`
                  };
                  setCellStyle(cell, { bold: true, align: 'center' });
                  applyBorder(cell);
               });
            });
         } else {
            // Totals and averages
            const totalRowIdx = data.length + 7;
            const summaryRows = [
               { label: 'Total', rowIndex: totalRowIdx, formula: 'SUM' }
            ];
            summaryRows.forEach(({ label, rowIndex, formula }) => {
               sheet.mergeCells(`B${rowIndex}:H${rowIndex}`);
               const labelCell = sheet.getCell(`B${rowIndex}`);
               labelCell.value = label;
               setCellStyle(labelCell, { bold: true, align: 'center' });
               applyBorder(labelCell);

               ['I', 'J', 'K'].forEach((col) => {
                  const cell = sheet.getCell(`${col}${rowIndex}`);
                  cell.value = {
                     formula: `${formula}(${col}7:${col}${totalRowIdx - 1})`
                  };
                  setCellStyle(cell, { bold: true, align: 'center' });
                  applyBorder(cell);
               });
            });
         }

         const buffer = await workbook.xlsx.writeBuffer();
         const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
         });

         const url = URL.createObjectURL(blob);
         const fileName = `Report_${new Date().toISOString().split('T')[0]}.xlsx`;
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         link.remove();
         URL.revokeObjectURL(url);

         toast.success('Laporan berhasil dibuat');
      } catch (error) {
         console.error('Export error:', error);
         toast.error('Gagal membuat laporan.');
      } finally {
         setPending(false);
      }
   };

   return (
      <Button
         className="fixed right-6 top-40 z-50"
         size={'icon'}
         variant={'outline'}
         onClick={handleGenerate}
         disabled={pending}
      >
         <Download className="size-4" />
      </Button>
   );
}
