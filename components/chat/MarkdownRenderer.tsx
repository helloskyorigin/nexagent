'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  if (!content) return null;

  return (
    <div className={cn('w-full text-[#ECECF1] leading-[1.65] md:leading-[1.7] font-normal text-[16px] md:text-[18px] tracking-normal break-words', className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-7 mb-3.5 first:mt-0 tracking-tight break-words">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg sm:text-xl font-bold text-white mt-6 mb-3 first:mt-0 tracking-tight break-words">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-semibold text-white mt-5 mb-2.5 first:mt-0 break-words">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-[15px] sm:text-base font-semibold text-[#ECECF1] mt-4 mb-2 first:mt-0 break-words">
                {children}
              </h4>
            );
          },
          p({ children }) {
            return <p className="leading-[1.65] md:leading-[1.7] mb-4 sm:mb-4.5 last:mb-0 break-words">{children}</p>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-[#ECECF1]">{children}</em>;
          },
          del({ children }) {
            return <del className="line-through text-[#8E8EA0]">{children}</del>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-[3px] border-[#5486E9] pl-4 py-1.5 text-[#C5C5D2] italic my-4 rounded-r bg-white/[0.02]">
                {children}
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
            return <li className="leading-[1.65] md:leading-[1.7] text-[16px] md:text-[18px] break-words">{children}</li>;
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
            return <td className="px-4 py-3 text-[#ECECF1] border-b border-white/[0.05] align-top">{children}</td>;
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
