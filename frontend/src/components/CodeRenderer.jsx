import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import {
  a11yLight,
  stackoverflowDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "../hooks/useTheme";

// Function to decode Unicode emoji like \uD83C\uDD95
const decodeUnicodeEmoji = (text) => {
  return text.replace(/\\u[0-9A-Fa-f]{4}/g, (match) =>
    String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
  );
};

// Function to extract the problem name and topicId from Leetcode URLs
const processLeetcodeLink = (href) => {
  const regex = /https:\/\/leetcode\.com\/problems\/([a-zA-Z0-9-]+)\/solutions\/(\d+)/;
  const match = href.match(regex);

  if (match) {
    const problemName = match[1]; // The problem name (e.g., "find-common-characters")
    const topicId = match[2]; // The topicId (e.g., "5264546")

    return {
      text: problemName.replace(/-/g, " "), // Convert hyphens to spaces for display
      url: `/discuss_topic/${topicId}`, // The custom URL
    };
  }

  return null; // If not a Leetcode link, return null
};

const CodeRenderer = ({ inputText }) => {
  const { isDarkMode } = useTheme();
  // Replace escape characters like \' with just a single quote '
  const formattedText = decodeUnicodeEmoji(inputText)
    .replace(/\\'/g, "'") // Handle escaped single quotes
    .replace(/\\n/g, "  \n"); // Ensure newline handling

  const renderers = {
    // Render bold and italic text
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,

    // Render unordered list
    ul: ({ children }) => (
      <ul className="list-disc pl-10 leading-[1.75rem]">{children}</ul>
    ),
    li: ({ children }) => <li className="leading-[1.75rem]">{children}</li>,

    // Render ordered list
    ol: ({ children }) => (
      <ol className="list-decimal pl-10 leading-[1.75rem] list-inside">
        {children}
      </ol>
    ),

    // Render links with custom Leetcode behavior
    a: ({ href, children }) => {
      // Check if the link matches Leetcode problem and solution format
      const leetcodeData = processLeetcodeLink(href);
      if (leetcodeData) {
        // If it matches, return a custom link
        return (
          <a
            href={leetcodeData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {leetcodeData.text} {/* Display problem name as link text */}
          </a>
        );
      }

      // Default behavior for other links
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {children}
        </a>
      );
    },

    // Render images
    img: ({ src, alt }) => (
      <div className="flex justify-center">
        <img src={src} alt={alt} className="max-w-full rounded-lg" />
      </div>
    ),

    // Render blockquotes for notes
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 pl-4 mt-2 leading-[2rem] ${
        isDarkMode ? "text-gray-400 border-gray-600" : "text-gray-600 border-gray-300"
      }`}>
        {children}
      </blockquote>
    ),

    // Render tables
    table: ({ children }) => (
      <table className={`w-auto border-collapse table-auto leading-[1.75rem] ${
        isDarkMode ? "border-gray-700" : ""
      }`}>
        {children}
      </table>
    ),
    th: ({ children }) => (
      <th className={`border p-2 text-left leading-[1.75rem] ${
        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 bg-gray-100"
      }`}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`border p-2 break-words leading-[1.75rem] ${
        isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300"
      }`}>
        {children}
      </td>
    ),

    // Render inline code
    code: ({ inline, children }) => {
      return inline ? (
        <code className={`rounded ${
          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"
        }`}>{children}</code>
      ) : (
        <SyntaxHighlighter language="javascript" style={isDarkMode ? stackoverflowDark : a11yLight}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },

    // Render text with emoji by decoding the Unicode
    text: ({ children }) => <span>{parse(decodeUnicodeEmoji(children))}</span>,

    // Render line breaks <br />
    br: () => <br />,

    // Render horizontal lines <hr /> with custom spacing
    hr: () => <hr className="border-t-2 border-gray-300 my-6" />,
  };

  return (
    <div className="leading-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
        components={renderers}
        className="my-5"
      >
        {formattedText}
      </ReactMarkdown>
    </div>
  );
};

CodeRenderer.propTypes = {
  inputText: PropTypes.string.isRequired,
};

export default CodeRenderer;
