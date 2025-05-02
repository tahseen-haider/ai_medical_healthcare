import MarkDown from "react-markdown"
import DOMPurify from "dompurify"
import { renderToString } from 'react-dom/server'

 function Markdown({ text }: { text: string }) {

  const markedUnsecureElement = renderToString(<MarkDown>{text}</MarkDown>); 
  const secureMarkedHTML = DOMPurify.sanitize(markedUnsecureElement);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: secureMarkedHTML }} // Inject HTML content
    />
  );
}

export default Markdown;
