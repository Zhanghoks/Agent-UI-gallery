"use client";

import type { ReactNode } from "react";
import {
  ArrowUpRightIcon,
  BoardIcon,
  ChartIcon,
  FileIcon,
  MarkdownIcon,
  MetricsIcon,
  TableIcon,
  type IconProps,
} from "@/components/atoms/Icons";

/* One artifact, five densities. The host supplies the preview; this view
 * never fetches bytes. No open callback means the artifact stays visible
 * and cannot be opened. Version marks appear from v2 up. */

export type ArtifactKind = "file" | "markdown" | "chart" | "table" | "metrics" | "board";

export type WorkflowArtifactData = {
  id: string;
  kind: ArtifactKind;
  title: string;
  detail?: string;
  description?: string;
  /** Hidden when missing or below 2. */
  version?: number;
  preview?: ReactNode;
};

export type ArtifactLabels = {
  more: (count: number) => string;
  file: string;
  markdown: string;
  chart: string;
  table: string;
  metrics: string;
  board: string;
};

export const ARTIFACT_LABELS: ArtifactLabels = {
  more: (count) => `${count} more`,
  file: "File",
  markdown: "Markdown",
  chart: "Chart",
  table: "Table",
  metrics: "Metrics",
  board: "Board",
};

const KIND_ICON: Record<ArtifactKind, (props: IconProps) => ReactNode> = {
  file: FileIcon,
  markdown: MarkdownIcon,
  chart: ChartIcon,
  table: TableIcon,
  metrics: MetricsIcon,
  board: BoardIcon,
};

const STRIP_MAX = 3;
const INDEX_CAP = 6;

export type WorkflowArtifactPillProps = {
  artifact: WorkflowArtifactData;
  onOpen?: (artifactId: string) => void;
  labels?: ArtifactLabels;
};

export type WorkflowArtifactStripProps = {
  artifacts: readonly WorkflowArtifactData[];
  onOpen?: (artifactId: string) => void;
  labels?: ArtifactLabels;
};

export type WorkflowArtifactTileProps = WorkflowArtifactPillProps;
export type WorkflowDeliverableProps = WorkflowArtifactPillProps;

export type WorkflowArtifactIndexProps = {
  artifacts: readonly WorkflowArtifactData[];
  onOpen?: (artifactId: string) => void;
  onOpenMore?: () => void;
  labels?: ArtifactLabels;
};

export function showsVersion(version?: number): boolean {
  return version !== undefined && version >= 2;
}

function KindMark({ kind }: { kind: ArtifactKind }) {
  const Icon = KIND_ICON[kind];
  return (
    <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-md bg-hover text-ink-2">
      <Icon size={12} />
    </span>
  );
}

function VersionTail({ version }: { version?: number }) {
  if (!showsVersion(version)) return <span className="wf-pill-tail" />;
  return <span className="wf-pill-tail">v{version}</span>;
}

export function WorkflowArtifactPill({
  artifact,
  onOpen,
  labels = ARTIFACT_LABELS,
}: WorkflowArtifactPillProps) {
  return (
    <button
      type="button"
      className="wf-pill"
      disabled={!onOpen}
      aria-label={`${labels[artifact.kind]} ${artifact.title}`}
      onClick={() => onOpen?.(artifact.id)}
    >
      <KindMark kind={artifact.kind} />
      <span className="truncate">{artifact.title}</span>
      {artifact.detail ? <span className="truncate font-mono text-[10px] text-ink-3">{artifact.detail}</span> : null}
      <VersionTail version={artifact.version} />
    </button>
  );
}

export function WorkflowArtifactStrip({
  artifacts,
  onOpen,
  labels = ARTIFACT_LABELS,
}: WorkflowArtifactStripProps) {
  const shown = artifacts.slice(0, STRIP_MAX);
  const more = artifacts.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((artifact) => (
        <WorkflowArtifactPill artifact={artifact} key={artifact.id} labels={labels} onOpen={onOpen} />
      ))}
      {more > 0 ? <span className="text-[12px] text-ink-3">+{more}</span> : null}
    </div>
  );
}

function HitTarget({
  artifact,
  onOpen,
  labels,
  children,
}: {
  artifact: WorkflowArtifactData;
  onOpen?: (artifactId: string) => void;
  labels: ArtifactLabels;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <button
        type="button"
        className="absolute inset-0 rounded-lg disabled:cursor-default"
        disabled={!onOpen}
        aria-label={`${labels[artifact.kind]} ${artifact.title}`}
        onClick={() => onOpen?.(artifact.id)}
      />
    </div>
  );
}

function Caption({ artifact, openable }: { artifact: WorkflowArtifactData; openable: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <KindMark kind={artifact.kind} />
      <span className="truncate text-[13px] text-ink">{artifact.title}</span>
      {artifact.detail ? <span className="truncate font-mono text-[10px] text-ink-3">{artifact.detail}</span> : null}
      <VersionTail version={artifact.version} />
      {openable ? <ArrowUpRightIcon className="shrink-0 text-ink-3" size={12} /> : null}
    </div>
  );
}

export function WorkflowArtifactTile({
  artifact,
  onOpen,
  labels = ARTIFACT_LABELS,
}: WorkflowArtifactTileProps) {
  return (
    <HitTarget artifact={artifact} labels={labels} onOpen={onOpen}>
      <div className="w-[180px]">
        {artifact.preview ? (
          <div inert className="mb-2 h-[100px] overflow-hidden rounded-lg bg-inset">
            {artifact.preview}
          </div>
        ) : null}
        <Caption artifact={artifact} openable={Boolean(onOpen)} />
      </div>
    </HitTarget>
  );
}

export function WorkflowDeliverable({
  artifact,
  onOpen,
  labels = ARTIFACT_LABELS,
}: WorkflowDeliverableProps) {
  return (
    <HitTarget artifact={artifact} labels={labels} onOpen={onOpen}>
      <div className="flex gap-3">
        {artifact.preview ? (
          <div inert className="h-[100px] w-[160px] shrink-0 overflow-hidden rounded-lg bg-inset">
            {artifact.preview}
          </div>
        ) : null}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <KindMark kind={artifact.kind} />
            <span className="truncate text-[14px] font-medium text-ink">{artifact.title}</span>
            <VersionTail version={artifact.version} />
            {onOpen ? <ArrowUpRightIcon className="shrink-0 text-ink-3" size={12} /> : null}
          </div>
          {artifact.description ? (
            <p className="mt-1 line-clamp-3 text-[12px] text-ink-2">{artifact.description}</p>
          ) : null}
          {artifact.detail ? <p className="mt-1 font-mono text-[11px] text-ink-3">{artifact.detail}</p> : null}
        </div>
      </div>
    </HitTarget>
  );
}

export function WorkflowArtifactIndex({
  artifacts,
  onOpen,
  onOpenMore,
  labels = ARTIFACT_LABELS,
}: WorkflowArtifactIndexProps) {
  const overflow = artifacts.length > INDEX_CAP;
  const shown = overflow ? artifacts.slice(0, INDEX_CAP - 1) : artifacts;
  const more = artifacts.length - shown.length;
  return (
    <div className="flex flex-col">
      {shown.map((artifact) => (
        <button
          key={artifact.id}
          type="button"
          className="flex h-[26px] items-center gap-1.5 rounded-md px-1 text-left enabled:hover:bg-hover disabled:cursor-default"
          disabled={!onOpen}
          onClick={() => onOpen?.(artifact.id)}
        >
          <KindMark kind={artifact.kind} />
          <span className="truncate text-[12px] text-ink">{artifact.title}</span>
          {artifact.detail ? <span className="truncate font-mono text-[10px] text-ink-3">{artifact.detail}</span> : null}
          <VersionTail version={artifact.version} />
        </button>
      ))}
      {more > 0 ? (
        onOpenMore ? (
          <button type="button" className="flex h-[26px] items-center gap-1.5 px-1 text-[12px] text-ink-2" onClick={onOpenMore}>
            <span className="truncate">{labels.more(more)}</span>
            <ArrowUpRightIcon size={12} />
          </button>
        ) : (
          <span className="flex h-[26px] items-center px-1 text-[12px] text-ink-3">{labels.more(more)}</span>
        )
      ) : null}
    </div>
  );
}

const PREVIEW = (
  <p className="p-2 text-[11px] leading-4 text-ink-2">Cold-chain check passed for three vendors. Two certificates renew this month.</p>
);

const SAMPLE: WorkflowArtifactData[] = [
  { id: "brief", kind: "markdown", title: "Brief", version: 1, detail: "Markdown", description: "What this run was asked to settle.", preview: PREVIEW },
  { id: "spend", kind: "chart", title: "Spend", version: 2, detail: "6 series" },
  { id: "vendors", kind: "table", title: "Vendors", version: 1, detail: "12 rows" },
  { id: "notes", kind: "file", title: "notes.txt", version: 1 },
  { id: "pulse", kind: "metrics", title: "Pulse", version: 3, detail: "4 figures" },
  { id: "board", kind: "board", title: "Launch board", version: 1, detail: "8 cards" },
  { id: "appendix", kind: "file", title: "appendix.pdf", version: 2 },
];

export default function WorkflowArtifactDemo({ variant = "Pill" }: { variant?: string }) {
  const open = () => undefined;
  if (variant === "Strip") return <div className="pb-8"><WorkflowArtifactStrip artifacts={SAMPLE} onOpen={open} /></div>;
  if (variant === "Tile") {
    return (
      <div className="flex flex-wrap gap-4 pb-8">
        <WorkflowArtifactTile artifact={SAMPLE[0]} onOpen={open} />
        <WorkflowArtifactTile artifact={SAMPLE[1]} />
      </div>
    );
  }
  if (variant === "Deliverable") return <div className="pb-8"><WorkflowDeliverable artifact={SAMPLE[0]} onOpen={open} /></div>;
  if (variant === "Index") return <div className="pb-8"><WorkflowArtifactIndex artifacts={SAMPLE} onOpen={open} onOpenMore={open} /></div>;
  return (
    <div className="flex flex-wrap gap-1.5 pb-8">
      {SAMPLE.slice(0, 6).map((artifact, index) => (
        <WorkflowArtifactPill artifact={artifact} key={artifact.id} onOpen={index === 5 ? undefined : open} />
      ))}
    </div>
  );
}
