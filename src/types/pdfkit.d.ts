declare module 'pdfkit' {
  import { EventEmitter } from 'events';

  class PDFDocument extends EventEmitter {
    constructor(options?: any);
    text(text: string, options?: any): PDFDocument;
    text(text: string, x: number, y: number, options?: any): PDFDocument;
    moveTo(x: number, y: number): PDFDocument;
    lineTo(x: number, y: number): PDFDocument;
    stroke(): PDFDocument;
    rect(x: number, y: number, width: number, height: number): PDFDocument;
    fontSize(size: number): PDFDocument;
    font(name: string, size?: number): PDFDocument;
    image(path: string, x?: number, y?: number, options?: any): PDFDocument;
    addPage(options?: any): PDFDocument;
    pipe(destination: any): PDFDocument;
    moveDown(lines?: number): PDFDocument;
    end(): void;
    on(event: string, callback: (chunk: Buffer) => void): PDFDocument;
    on(event: string, callback: () => void): PDFDocument;
    [key: string]: any;
  }

  export = PDFDocument;
}
