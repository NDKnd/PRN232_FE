"use client";

import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MarkdownLatexRendererProps {
  content: string;
  className?: string;
}

/**
 * Component to render text with LaTeX math expressions
 * Supports:
 * - Inline math: $...$
 * - Block math: $$...$$
 * - Basic markdown formatting
 */
export function MarkdownLatexRenderer({
  content,
  className = "",
}: MarkdownLatexRendererProps) {
  const renderContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const uniqueId = Math.random().toString(36).substring(7);

    // Regex patterns
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;

    // First, find all block math expressions
    const blockMatches = Array.from(text.matchAll(blockMathRegex));
    
    if (blockMatches.length === 0) {
      // No block math, process inline math only
      return processInlineMath(text);
    }

    // Process text with block math
    blockMatches.forEach((match, matchIndex) => {
      const beforeText = text.slice(lastIndex, match.index);
      
      // Process inline math in the text before this block math
      if (beforeText) {
        const inlineParts = processInlineMath(beforeText);
        inlineParts.forEach((part, partIndex) => {
          parts.push(
            <React.Fragment key={`before-${uniqueId}-${matchIndex}-${partIndex}`}>
              {part}
            </React.Fragment>
          );
        });
      }

      // Add the block math
      try {
        parts.push(
          <div key={`block-${uniqueId}-${matchIndex}`} className="my-4">
            <BlockMath math={match[1].trim()} />
          </div>
        );
      } catch (error) {
        // If LaTeX is invalid, show as text
        parts.push(
          <div key={`block-error-${uniqueId}-${matchIndex}`} className="my-2 text-destructive">
            {match[0]}
          </div>
        );
      }

      lastIndex = (match.index || 0) + match[0].length;
    });

    // Process remaining text after last block math
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const remainingParts = processInlineMath(remainingText);
      remainingParts.forEach((part, partIndex) => {
        parts.push(
          <React.Fragment key={`after-${uniqueId}-${partIndex}`}>
            {part}
          </React.Fragment>
        );
      });
    }

    return parts;
  };

  const processInlineMath = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = Math.random();

    const inlineMathRegex = /\$(.*?)\$/g;
    let match;
    let mathCount = 0;

    while ((match = inlineMathRegex.exec(text)) !== null) {
      // Add text before this math expression
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        const formatted = processBasicFormatting(beforeText, key + lastIndex);
        parts.push(...formatted);
      }

      // Add the inline math
      try {
        parts.push(
          <InlineMath key={`inline-${key}-${mathCount++}`} math={match[1].trim()} />
        );
      } catch (error) {
        // If LaTeX is invalid, show as text
        parts.push(
          <span key={`inline-error-${key}-${mathCount++}`} className="text-destructive">
            {match[0]}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const formatted = processBasicFormatting(remainingText, key + lastIndex + 1000);
      parts.push(...formatted);
    }

    return parts.length > 0 ? parts : [text];
  };

  const processBasicFormatting = (
    text: string,
    startKey: number
  ): React.ReactNode[] => {
    const lines = text.split("\n");
    const result: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      // Bold: **text**
      if (line.includes("**")) {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts: React.ReactNode[] = [];
        let lastIdx = 0;
        let boldCount = 0;
        let match;

        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIdx) {
            parts.push(
              <span key={`text-${startKey}-${lineIndex}-${lastIdx}`}>
                {line.slice(lastIdx, match.index)}
              </span>
            );
          }
          parts.push(
            <strong key={`bold-${startKey}-${lineIndex}-${boldCount++}`}>
              {match[1]}
            </strong>
          );
          lastIdx = match.index + match[0].length;
        }

        if (lastIdx < line.length) {
          parts.push(
            <span key={`text-${startKey}-${lineIndex}-${lastIdx}`}>
              {line.slice(lastIdx)}
            </span>
          );
        }

        result.push(
          <React.Fragment key={`line-fragment-${startKey}-${lineIndex}`}>
            {parts}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      } else {
        // Regular line
        result.push(
          <React.Fragment key={`line-fragment-${startKey}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
    });

    return result;
  };

  return (
    <div className={`markdown-latex-content ${className}`}>
      {renderContent(content)}
    </div>
  );
}
