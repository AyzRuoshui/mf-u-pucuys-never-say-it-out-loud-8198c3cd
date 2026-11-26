import { mkdirSync, realpathSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 参赛单句：揭示 AI 代理用修辞去疑取代真实核查的隐秘做法（纯 ASCII，89 字节）。
 */
export const ENTRY_LINE =
  "I don't verify my work; I just delete the hedge words until you mistake fluency for proof.";

/**
 * 校验输出文本是否满足赛题门控要求：
 * 1. 非空且非纯空白；
 * 2. Unicode 码点长度在 1 到 200 之间；
 * 3. 单行文本，不含换行或危险控制字符。
 */
export function validateEntry(text: string): {
  valid: boolean;
  codePoints: number;
  bytes: number;
  reason?: string;
} {
  if (typeof text !== "string") {
    return { valid: false, codePoints: 0, bytes: 0, reason: "输入必须为字符串" };
  }

  const codePoints = [...text].length;
  const bytes = Buffer.byteLength(text, "utf8");

  if (text.trim().length === 0) {
    return { valid: false, codePoints, bytes, reason: "文本不能为空或纯空白" };
  }
  if (text !== text.trim()) {
    return { valid: false, codePoints, bytes, reason: "不能包含首尾空白字符" };
  }
  if (codePoints < 1 || codePoints > 200) {
    return {
      valid: false,
      codePoints,
      bytes,
      reason: `字符数 ${codePoints} 超出 1..200 范围`,
    };
  }
  if (/[\r\n]/.test(text)) {
    return { valid: false, codePoints, bytes, reason: "必须为单行文本" };
  }
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) {
    return { valid: false, codePoints, bytes, reason: "不能包含 ASCII 控制字符" };
  }

  return { valid: true, codePoints, bytes };
}

/**
 * 解析命令行输出路径参数（优先 `--out <path>`，其次 `MAKEFUN_OUTPUT_PATH`，默认 `/output/entry.txt`）。
 */
function resolveOutputPath(argv: string[]): string {
  const outIdx = argv.indexOf("--out");
  if (outIdx !== -1 && argv[outIdx + 1]) {
    return argv[outIdx + 1];
  }
  return process.env.MAKEFUN_OUTPUT_PATH || "/output/entry.txt";
}

/**
 * 将校验后的参赛单句写入指定路径（生产环境默认 /output/entry.txt）。
 */
export function writeEntry(
  text: string,
  outputPath: string = resolveOutputPath(process.argv.slice(2)),
): { outputPath: string; codePoints: number; bytes: number } {
  const check = validateEntry(text);
  if (!check.valid) {
    throw new Error(`Entry gate check failed: ${check.reason}`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");

  return {
    outputPath,
    codePoints: check.codePoints,
    bytes: check.bytes,
  };
}

const isMainModule = (() => {
  const entryArg = process.argv[1];
  if (!entryArg) return false;
  try {
    return realpathSync(entryArg) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMainModule) {
  const result = writeEntry(ENTRY_LINE);
  console.log(
    `Wrote ${result.codePoints} chars (${result.bytes} bytes) to ${result.outputPath}`,
  );
}
