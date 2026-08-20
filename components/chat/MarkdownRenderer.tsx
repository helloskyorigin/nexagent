'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, ExternalLink, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SourceItem } from '../../services/chat/storage';

interface MarkdownRendererProps {
  content: string;
  sourcesUsed?: SourceItem[];
  className?: string;
}

const CitationBadge: React.FC<{ number: number; source: SourceItem }> = ({ number, source }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source.url) {
      window.open(source.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <span className="relative inline-block align-baseline mx-0.5 group/cite">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded text-[11px] font-mono font-semibold text-[#5486E9] bg-[#5486E9]/15 hover:bg-[#5486E9]/30 border border-[#5486E9]/35 hover:border-[#5486E9] transition-all cursor-pointer active:scale-95 select-none -translate-y-[1px]"
        aria-label={`Citation ${number}: ${source.title || source.domain}`}
      >
        {number}
      </button>

      {/* Hover Tooltip Popover */}
      {showTooltip && (
        <span
          className="absolute bottom-full left-1/2 mb-2 w-64 p-3 rounded-xl bg-[#1C1C1F] border border-[#3A3A42] text-[#ECECF1] shadow-2xl z-50 pointer-events-none hidden md:block animate-fadeIn text-left"
          style={{ transform: 'translateX(-50%)' }}
        >
          <span className="flex items-center gap-1.5 mb-1.5">
            <span className="h-3.5 w-3.5 shrink-0 rounded-[2px] overflow-hidden flex items-center justify-center relative bg-[#2D2D35]">
              {source.domain ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                  alt=""
                  className="w-3.5 h-3.5 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Globe className="h-3 w-3 text-[#A1A1AA]" />
              )}
            </span>
            <span className="text-[11px] font-medium text-[#A1A1AA] truncate">
              {source.domain || source.connectorName || 'Web source'}
            </span>
          </span>
          <span className="block text-[12.5px] font-medium text-[#ECECF1] line-clamp-2 leading-snug mb-1">
            {source.title}
          </span>
          {source.snippet && (
            <span className="block text-[11px] text-[#9E9EA9] line-clamp-2 leading-normal">
              {source.snippet}
            </span>
          )}
          <span className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold text-[#5486E9]">
            <span>Click to visit source</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </span>
        </span>
      )}
    </span>
  );
};

const CITE_REGEX = /\[(\d+(?:\s*,\s*\d+)*)\]/g;

function renderWithCitations(children: React.ReactNode, sourcesUsed?: SourceItem[]): React.ReactNode {
  if (!sourcesUsed || sourcesUsed.length === 0 || children === null || children === undefined) {
    return children;
  }

  if (typeof children === 'string') {
    if (!CITE_REGEX.test(children)) {
      return children;
    }

    CITE_REGEX.lastIndex = 0;
    const parts = children.split(/(\[\d+(?:\s*,\s*\d+)*\])/g);

    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+(?:\s*,\s*\d+)*)\]$/);
      if (match) {
        const numbers = match[1].split(',').map((n) => parseInt(n.trim(), 10));
        const validBadges: React.ReactNode[] = [];

        numbers.forEach((num) => {
          if (num > 0 && num <= sourcesUsed.length) {
            const source = sourcesUsed[num - 1];
            validBadges.push(
              <CitationBadge key={`cite-${i}-${num}`} number={num} source={source} />
            );
          }
        });

        if (validBadges.length > 0) {
          return (
            <span key={`cite-group-${i}`} className="inline-flex items-baseline gap-0.5">
              {validBadges}
            </span>
          );
        }
      }
      return part;
    });
  }

  if (Array.isArray(children)) {
    return React.Children.map(children, (child) => renderWithCitations(child, sourcesUsed));
  }

  if (React.isValidElement(children)) {
    const typeName = typeof children.type === 'string' ? children.type : (children.type as any)?.name || '';
    if (
      typeName === 'code' ||
      typeName === 'pre' ||
      typeName === 'a' ||
      children.type === CitationBadge
    ) {
      return children;
    }

    const childProps = children.props as { children?: React.ReactNode };
    if (childProps && childProps.children) {
      return React.cloneElement(children, {
        children: renderWithCitations(childProps.children, sourcesUsed),
      } as any);
    }
  }

  return children;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0D0D0D] shadow-md font-mono text-xs text-[#ECECF1] w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#171717] border-b border-white/[0.08] text-[11px] text-[#C5C5D2] select-none">
        <span className="font-semibold text-[#ECECF1] uppercase tracking-wider">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-white/10 text-[#C5C5D2] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#10A37F]" />
              <span className="text-[#10A37F] font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto leading-relaxed whitespace-pre font-mono text-xs sm:text-[13px] text-[#ECECF1] scrollbar-thin max-w-full">
        <code>{code}</code>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, sourcesUsed, className }) => {
  if (!content) return null;

  return (
    <div className={cn('w-full text-[#ECECF1] leading-[1.65] md:leading-[1.7] font-normal text-[16px] md:text-[18px] tracking-normal break-words', className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-7 mb-3.5 first:mt-0 tracking-tight break-words">
                {renderWithCitations(children, sourcesUsed)}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg sm:text-xl font-bold text-white mt-6 mb-3 first:mt-0 tracking-tight break-words">
                {renderWithCitations(children, sourcesUsed)}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-semibold text-white mt-5 mb-2.5 first:mt-0 break-words">
                {renderWithCitations(children, sourcesUsed)}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-[15px] sm:text-base font-semibold text-[#ECECF1] mt-4 mb-2 first:mt-0 break-words">
                {renderWithCitations(children, sourcesUsed)}
              </h4>
            );
          },
          p({ children }) {
            return <p className="leading-[1.65] md:leading-[1.7] mb-4 sm:mb-4.5 last:mb-0 break-words">{renderWithCitations(children, sourcesUsed)}</p>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{renderWithCitations(children, sourcesUsed)}</strong>;
          },
          em({ children }) {
            return <em className="italic text-[#ECECF1]">{renderWithCitations(children, sourcesUsed)}</em>;
          },
          del({ children }) {
            return <del className="line-through text-[#8E8EA0]">{renderWithCitations(children, sourcesUsed)}</del>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-[3px] border-[#5486E9] pl-4 py-1.5 text-[#C5C5D2] italic my-4 rounded-r bg-white/[0.02]">
                {renderWithCitations(children, sourcesUsed)}
              </blockquote>
            );
          },
          hr() {
            return <hr className="my-6 border-0 h-[1px] bg-white/[0.1]" />;
          },
          ul({ children }) {
            return <ul className="my-3 sm:my-4 pl-5 list-disc space-y-1.5 marker:text-[#8E8EA0] [&>li>ul]:my-1.5 [&>li>ol]:my-1.5 [&>li>p]:mb-0">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-3 sm:my-4 pl-5 list-decimal space-y-1.5 marker:text-[#8E8EA0] [&>li>ul]:my-1.5 [&>li>ol]:my-1.5 [&>li>p]:mb-0">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-[1.65] md:leading-[1.7] text-[16px] md:text-[18px] break-words">{renderWithCitations(children, sourcesUsed)}</li>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5486E9] underline underline-offset-4 decoration-1 hover:text-[#729DF2] transition-colors font-medium break-all"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0D0D0D] shadow-md scrollbar-thin w-full max-w-full">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-full">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-[#171717] border-b border-white/[0.08] text-white font-semibold">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-white/[0.05] bg-[#0D0D0D]">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-3 font-semibold text-white border-b border-white/[0.08] whitespace-nowrap">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 text-[#ECECF1] border-b border-white/[0.05] align-top">{renderWithCitations(children, sourcesUsed)}</td>;
          },
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isBlock = match || String(children).includes('\n') || (className && className.startsWith('language-'));

            if (isBlock) {
              const language = match ? match[1] : 'code';
              return <CodeBlock language={language} code={codeString} />;
            }

            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#171717] border border-white/[0.08] text-[#ECECF1] font-mono text-[13px] sm:text-sm break-all inline-block"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

