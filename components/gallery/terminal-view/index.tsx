"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalIcon } from "@/components/atoms/Icons";

/* Output of one command. A line is a command, output or an error, drawn so you
 * can tell them apart without color alone: commands lead with a prompt mark,
 * errors with "!". The view follows the end while the command runs, and stops
 * following if you scroll up. The host owns the lines and the status. */

export type TerminalLine = { id: string; text: string; stream?: "command" | "out" | "err" };

export type TerminalStatus = "running" | "done" | "failed";

export type TerminalViewLabels = { running: string; done: string; failed: (code?: number) => string; empty: string };

export const TERMINAL_LABELS: TerminalViewLabels = {
  running: "Running",
  done: "Done",
  failed: (code) => (code === undefined ? "Failed" : `Exit ${code}`),
  empty: "No output yet.",
};

const lineClass = (stream: TerminalLine["stream"]) =>
  stream === "command" ? "text-ink" : stream === "err" ? "text-red" : "text-ink-2";

export type TerminalViewProps = {
  title?: string;
  lines: readonly TerminalLine[];
  status: TerminalStatus;
  exitCode?: number;
  labels?: Partial<TerminalViewLabels>;
};

export function TerminalView({ title = "bash", lines, status, exitCode, labels: labelOverrides }: TerminalViewProps) {
  const labels = { ...TERMINAL_LABELS, ...labelOverrides };
  const body = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  useEffect(() => {
    const el = body.current;
    if (el && following.current) el.scrollTop = el.scrollHeight;
  }, [lines.length]);
  const word = status === "running" ? labels.running : status === "done" ? labels.done : labels.failed(exitCode);
  return (
    <div className="w-full max-w-[460px] overflow-hidden rounded-card bg-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <TerminalIcon className="text-ink-3" size={13} />
        <span className="flex-1 truncate font-mono text-[11px] text-ink-2">{title}</span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] ${status === "failed" ? "text-red" : status === "done" ? "text-green" : "text-orange"}`}>
          {status === "running" ? <span className="size-1.5 animate-pulse rounded-full bg-orange motion-reduce:animate-none" /> : null}
          {word}
        </span>
      </div>
      <div
        className="max-h-56 overflow-auto bg-inset px-3 py-2 font-mono text-[11.5px] leading-relaxed"
        onScroll={(event) => {
          const el = event.currentTarget;
          following.current = el.scrollHeight - el.scrollTop - el.clientHeight < 12;
        }}
        ref={body}
      >
        {lines.length === 0 ? <p className="text-ink-3">{labels.empty}</p> : null}
        {lines.map((line) => (
          <div className={`flex gap-2 whitespace-pre-wrap break-all ${lineClass(line.stream)}`} key={line.id}>
            <span aria-hidden className="w-2 shrink-0 text-ink-3">
              {line.stream === "command" ? "$" : line.stream === "err" ? "!" : ""}
            </span>
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const OK: TerminalLine[] = [
  { id: "1", stream: "command", text: "npm test" },
  { id: "2", text: "> catalog.test.mjs" },
  { id: "3", text: "  ✓ scans a component folder (12ms)" },
  { id: "4", text: "  ✓ rejects an unknown category (3ms)" },
  { id: "5", text: "  ✓ lists every problem at once (5ms)" },
  { id: "6", text: "37 passed" },
];
const FAIL: TerminalLine[] = [
  { id: "1", stream: "command", text: "npm run build" },
  { id: "2", text: "Compiling…" },
  { id: "3", stream: "err", text: "Type error: Property 'status' does not exist on type 'Run'." },
  { id: "4", stream: "err", text: "  at components/gallery/run-card/index.tsx:48" },
];

export default function TerminalViewDemo({ variant }: { variant?: string }) {
  const script = variant === "Failed" ? FAIL : OK;
  const [count, setCount] = useState(1);
  useEffect(() => {
    setCount(1);
  }, [variant]);
  useEffect(() => {
    if (count >= script.length) return;
    const timer = setTimeout(() => setCount((value) => value + 1), 700);
    return () => clearTimeout(timer);
  }, [count, script.length]);
  const finished = count >= script.length;
  return (
    <div className="w-full pb-8">
      <TerminalView
        exitCode={variant === "Failed" ? 1 : 0}
        lines={script.slice(0, count)}
        status={!finished ? "running" : variant === "Failed" ? "failed" : "done"}
        title={script[0]!.text}
      />
    </div>
  );
}
