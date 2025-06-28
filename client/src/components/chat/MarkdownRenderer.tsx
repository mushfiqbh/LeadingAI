"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      // fallback if clipboard API fails
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedCode(code);
    }
  };

  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => setCopiedCode(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  // Process the content to handle escaped newlines and ensure proper markdown formatting
  const processContent = (text: string) => {
    return text
      .replace(/\\n/g, "\n") // Convert \n to actual newlines
      .replace(/\n\n\n+/g, "\n\n") // Normalize multiple newlines to double newlines
      .trim();
  };

  const processedContent = processContent(content);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-gray-900 border-b border-gray-200 pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0 text-gray-900">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-gray-800">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-gray-800">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-gray-700">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-medium mb-2 mt-3 first:mt-0 text-gray-700">
            {children}
          </h6>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="mb-4 pl-6 space-y-1 list-disc marker:text-blue-500">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 pl-6 space-y-1 list-decimal marker:text-blue-500 marker:font-medium">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,

        pre: ({ children }) => (
          <div className="relative group mb-4">
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-gray-700">
              {children}
            </pre>
          </div>
        ),

        // Code blocks
        code: ({ className, children, ...props }) => {
          const languageMatch = /language-(\w+)/.exec(className || "");
          const codeContent = String(children || "").replace(/\n$/, "");

          if (languageMatch) {
            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 text-xs font-medium rounded-t-lg border-b border-gray-700">
                  <span className="capitalize">{languageMatch[1]}</span>
                  <button
                    onClick={() => handleCopyCode(codeContent)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeContent ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-relaxed rounded-b-lg">
                  <code className={className} {...props}>
                    {codeContent}
                  </code>
                </pre>
              </div>
            );
          }

          // inline code
          return (
            <code
              className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border"
              {...props}
            >
              {children}
            </code>
          );
        },

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic rounded-r-lg">
            {children}
          </blockquote>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-gray-200">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
          >
            {children}
          </a>
        ),

        // Horizontal rule
        hr: () => <hr className="my-6 border-t border-gray-300" />,

        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-800">{children}</em>
        ),

        // Strikethrough
        del: ({ children }) => (
          <del className="line-through text-gray-500">{children}</del>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
