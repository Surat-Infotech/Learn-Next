import cleanHtml from './remove-tags';

const HtmlContent = ({ html }: { html: string }) => (
  // The following div uses dangerouslySetInnerHTML to render the sanitized HTML
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: cleanHtml(html) }} />
);
export default HtmlContent;
