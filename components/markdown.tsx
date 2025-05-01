import markdownit from "markdown-it";
import DOMPurify from "dompurify";

const md = markdownit()
export default function Markdown({text}: {text: string}) {
    const htmlContent = md.render(text);
    const sanitized = DOMPurify.sanitize(htmlContent);
  return (
    <div dangerouslySetInnerHTML={{__html: sanitized}}></div>
  )
}
