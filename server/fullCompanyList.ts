import { readFileSync } from 'fs';
import { resolve } from 'path';

export function getFullCompanyList(): string {
  try {
    const filePath = resolve('./attached_assets/Pasted-NVDA-NVIDIA-Corporation-2330-TAIWAN-SEMICONDUCTOR-MANUFACTURING-NOVO-B-NOVO-NORDISK-B-A-S-ASML-AS-1748786982199.txt');
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading company list file:', error);
    return '';
  }
}