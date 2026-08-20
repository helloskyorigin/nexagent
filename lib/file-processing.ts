import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

export async function extractTextFromFile(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimeType === 'application/vnd.ms-excel') {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      let text = '';
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        text += `\n--- Sheet: ${sheetName} ---\n`;
        text += xlsx.utils.sheet_to_csv(worksheet);
      });
      return text;
    } else if (mimeType === 'text/csv') {
      return buffer.toString('utf-8');
    } else if (mimeType.startsWith('text/') || filename.endsWith('.txt') || filename.endsWith('.md') || isCodeFile(filename)) {
      return buffer.toString('utf-8');
    } else if (mimeType.startsWith('image/')) {
      // Vision processing will be handled separately via the vision path
      return '[IMAGE FILE]';
    } else {
      return `Unsupported file type: ${mimeType}`;
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Could not parse file content');
  }
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    '.js', '.ts', '.tsx', '.jsx', '.py', '.rb', '.go', '.rs', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.html', '.css', '.scss', '.json', '.yaml', '.yml'
  ];
  return codeExtensions.some(ext => filename.endsWith(ext));
}

export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  let currentPos = 0;
  while (currentPos < text.length) {
    chunks.push(text.slice(currentPos, currentPos + maxChunkSize));
    currentPos += maxChunkSize;
  }
  return chunks;
}
