'use strict';

/**
 * templateEngine.js
 *
 * Replaces {{N}} placeholders in a template string with the
 * corresponding values supplied by the caller.
 *
 * Example
 * -------
 *   template : "Hello {{1}}, hope you are doing well. Regards, {{2}}"
 *   values   : { "1": "Prakash", "2": "Sai" }
 *   result   : "Hello Prakash, hope you are doing well. Regards, Sai"
 *
 * Placeholder rules
 * -----------------
 * - Format  : {{N}}  where N is a positive integer (1-based index).
 * - A single placeholder may appear multiple times — all occurrences are replaced.
 * - Unknown placeholders (no matching key) are left as-is by default
 *   but can be configured to throw or replace with an empty string.
 */

const PLACEHOLDER_REGEX = /\{\{(\d+)\}\}/g;

/**
 * Count the highest placeholder index found in a template string.
 * Useful for validation and storing metadata in the DB.
 *
 * @param {string} template
 * @returns {number}
 */
function countPlaceholders(template) {
  let max = 0;
  let match;
  const re = new RegExp(PLACEHOLDER_REGEX.source, 'g');
  while ((match = re.exec(template)) !== null) {
    const idx = parseInt(match[1], 10);
    if (idx > max) max = idx;
  }
  return max;
}

/**
 * Extract the unique placeholder indices from a template string.
 *
 * @param {string} template
 * @returns {number[]}  sorted array of unique indices
 */
function extractPlaceholderIndices(template) {
  const indices = new Set();
  const re = new RegExp(PLACEHOLDER_REGEX.source, 'g');
  let match;
  while ((match = re.exec(template)) !== null) {
    indices.add(parseInt(match[1], 10));
  }
  return [...indices].sort((a, b) => a - b);
}

/**
 * Replace all {{N}} tokens in `template` using the `values` map.
 *
 * @param {string}  template           - The template string.
 * @param {Object}  values             - { "1": "value1", "2": "value2", … }
 * @param {Object}  [options]
 * @param {string}  [options.onMissing='keep']
 *                    'keep'  — leave unknown tokens as-is (default)
 *                    'empty' — replace with empty string
 *                    'throw' — throw an Error
 * @returns {string}
 */
function render(template, values = {}, options = {}) {
  if (typeof template !== 'string') {
    throw new TypeError('template must be a string');
  }
  if (typeof values !== 'object' || values === null) {
    throw new TypeError('values must be a plain object');
  }

  const { onMissing = 'keep' } = options;

  return template.replace(PLACEHOLDER_REGEX, (token, index) => {
    const key = index.toString();

    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const replacement = values[key];
      // Coerce to string and sanitise whitespace
      return String(replacement == null ? '' : replacement).trim();
    }

    // Handle missing value
    if (onMissing === 'throw') {
      throw new Error(`Missing value for placeholder ${token}`);
    }
    if (onMissing === 'empty') {
      return '';
    }
    // Default: keep token intact
    return token;
  });
}

/**
 * Render both the HTML and plain-text bodies of a template.
 *
 * @param {Object} template   - DB row (subject, body_html, body_text)
 * @param {Object} values     - Placeholder values map
 * @returns {{ subject: string, html: string, text: string|null }}
 */
function renderTemplate(template, values) {
  return {
    subject: render(template.subject,   values),
    html   : render(template.body_html, values),
    text   : template.body_text ? render(template.body_text, values) : null,
  };
}

module.exports = {
  render,
  renderTemplate,
  countPlaceholders,
  extractPlaceholderIndices,
  PLACEHOLDER_REGEX,
};
