
export default function fixMarkdown(markdown: string): string {
  // Normalize newlines
  markdown = markdown.replace(/\\n/g, "\n"); // Convert \n to actual newlines
  markdown = markdown.replace(/\n\n\n+/g, "\n\n"); // Normalize multiple newlines to double newlines

  return markdown.trim(); // Trim leading/trailing whitespace
}
