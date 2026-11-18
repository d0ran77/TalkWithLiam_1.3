import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { GroundedPlaceSource } from '../hooks/useWillerbyRouteGuide.tsx';

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`b-${keyCounter++}`} className="font-semibold text-[#18181B]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (linkMatch) {
        nodes.push(
          <a
            key={`a-${keyCounter++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-stone-300 hover:decoration-[#2D5A43] text-[#18181B] hover:text-[#2D5A43] transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface GroundedMarkdownViewProps {
  markdown: string;
  compact?: boolean;
}

export const GroundedMarkdownView: React.FC<GroundedMarkdownViewProps> = ({
  markdown,
  compact = false,
}) => {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line, idx, arr) => !(line.trim() === '' && arr[idx - 1]?.trim() === ''));

  const blocks: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let blockKey = 0;

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    blocks.push(
      <ul
        key={`ul-${blockKey++}`}
        className={`space-y-1.5 ${compact ? 'text-[12px]' : 'text-[12.5px] sm:text-[13px]'} text-stone-700 leading-relaxed pl-3.5`}
      >
        {bulletBuffer.map((item, i) => (
          <li key={i} className="relative pl-1.5 list-disc marker:text-stone-400">
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushBullets();
      continue;
    }

    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushBullets();
      const headingText = trimmed.replace(/^#{1,3}\s+/, '');
      blocks.push(
        <h5
          key={`h-${blockKey++}`}
          className={`font-semibold text-[#18181B] tracking-wide uppercase border-t border-stone-200/70 first:border-t-0 first:pt-0 pt-2.5 mt-2 first:mt-0 ${
            compact ? 'text-[10.5px] tracking-[0.12em]' : 'text-[11px] tracking-[0.14em]'
          }`}
        >
          {headingText}
        </h5>
      );
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
      continue;
    }

    flushBullets();
    blocks.push(
      <p
        key={`p-${blockKey++}`}
        className={`${compact ? 'text-[12px]' : 'text-[12.5px] sm:text-[13px]'} text-stone-700 leading-relaxed`}
      >
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushBullets();

  return <div className="space-y-2">{blocks}</div>;
};

interface GroundedSourcesListProps {
  sources: GroundedPlaceSource[];
  compact?: boolean;
}

export const GroundedSourcesList: React.FC<GroundedSourcesListProps> = ({
  sources,
  compact = false,
}) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="pt-3 border-t border-stone-200/80 space-y-2">
      <div className="flex items-center justify-between gap-2 text-[10.5px] uppercase tracking-[0.14em] font-semibold text-stone-500">
        <span>Verified Google Maps Places</span>
        <span className="font-mono tabular-nums text-stone-400">{sources.length}</span>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-2`}>
        {sources.map((place) => (
          <a
            key={place.uri}
            href={place.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-1 p-2.5 rounded-xl bg-white/80 hover:bg-white border border-stone-200/90 hover:border-[#2D5A43]/40 transition-colors text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-start gap-1.5 text-[12px] font-medium text-[#18181B] group-hover:text-[#2D5A43] transition-colors leading-snug">
                <MapPin className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#2D5A43] shrink-0 mt-0.5" />
                <span>{place.title}</span>
              </span>
              <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A43] shrink-0 mt-0.5" />
            </div>

            {place.reviewSnippets && place.reviewSnippets.length > 0 && (
              <p className="text-[11px] text-stone-500 leading-snug line-clamp-2 pl-5">
                &ldquo;{place.reviewSnippets[0]}&rdquo;
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};
