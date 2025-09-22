import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content but preserves <iframe> and <img> tags.
 * @param {string} html The HTML content to sanitize.
 * @returns {string} Sanitized HTML.
 */
export default function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
  });
}
