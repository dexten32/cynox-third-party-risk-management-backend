import mammoth from "mammoth";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

export const parseDocxBuffer = async (buffer: Buffer): Promise<string> => {
  const result = await mammoth.convertToHtml({ buffer });
  const cleanHtml = purify.sanitize(result.value);
  return cleanHtml;
};
