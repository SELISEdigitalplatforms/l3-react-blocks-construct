import DOMPurify from 'dompurify';

/**
 * Enhanced HTML Sanitizer for Quill Editor Content
 *
 * Sanitizes HTML content while preserving all Quill editor functionalities:
 * - Text formatting (bold, italic, underline, strikethrough)
 * - Lists (ordered and unordered)
 * - Text alignment
 * - Text direction (RTL/LTR)
 * - Font sizes
 * - Links
 * - Line breaks and paragraphs
 *
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - Sanitized HTML content
 */

export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b',
      'strong',
      'i',
      'em',
      'u',
      'br',
      'p',
      'span',
      'div',

      's',
      'strike',
      'del',

      'ul',
      'ol',
      'li',

      'a',

      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',

      'blockquote',
    ],

    ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel', 'dir'],

    ALLOWED_STYLES: [
      'font-weight',
      'font-style',
      'text-decoration',
      'text-decoration-line',

      'text-align',

      'font-size',

      'direction',

      'color',
      'background-color',

      'line-height',
      'margin',
      'margin-left',
      'margin-right',
      'padding',
      'padding-left',
      'padding-right',
    ],

    KEEP_CONTENT: true,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false,

    ALLOWED_URI_REGEXP:
      /^(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp:|[^a-z]|[a-z+.-]+(?:[^a-z+.:]|$))/i,
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  });
};
