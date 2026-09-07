/**
 * Client-Side XSS Sanitization & Input Validation Utility
 * Safeguards inputs (e.g. job_keyword) against injection vectors.
 */

// Suspicious patterns: HTML tags, javascript: pseudo-protocol, event handlers, script tags
const XSS_PATTERNS = [
  /<[^>]*>/gi, // HTML tags e.g. <script>, <img>, <iframe>
  /javascript:/gi, // javascript: protocol
  /data:text\/html/gi, // data URI html
  /vbscript:/gi, // vbscript protocol
  /on\w+\s*=/gi, // inline handlers e.g. onload=, onerror=, onclick=
  /expression\s*\(/gi, // CSS expressions
  /url\s*\(/gi, // CSS url
];

export interface XSSValidationResult {
  isValid: boolean;
  sanitized: string;
  warning: string | null;
}

/**
 * Validates and sanitizes a user-entered search keyword against XSS.
 */
export function sanitizeSearchKeyword(rawInput: string): XSSValidationResult {
  if (!rawInput) {
    return {
      isValid: true,
      sanitized: "",
      warning: null,
    };
  }

  let warning: string | null = null;
  let hasMaliciousPattern = false;

  // Check against known dangerous patterns
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(rawInput)) {
      hasMaliciousPattern = true;
      warning = "Potentially unsafe script or HTML tags detected and removed.";
      break;
    }
  }

  // Check for suspicious characters like < or >
  if (/[<>]/.test(rawInput) && !warning) {
    hasMaliciousPattern = true;
    warning = "Special characters '<' and '>' are disallowed for safety.";
  }

  // Perform multi-step sanitization
  let sanitized = rawInput;

  // 1. Strip script and HTML tags
  sanitized = sanitized.replace(/<[^>]*>?/gm, "");

  // 2. Remove JavaScript/VBScript pseudo-protocols
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/vbscript:/gi, "");

  // 3. Remove inline handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, "");

  // 4. Strip dangerous angle brackets and quotes
  sanitized = sanitized.replace(/[<>"'`]/g, "");

  // 5. Trim excessive whitespace & limit length
  sanitized = sanitized.trim().slice(0, 100);

  return {
    isValid: !hasMaliciousPattern,
    sanitized,
    warning,
  };
}
