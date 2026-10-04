"use client";

import { useState } from "react";
import { CheckIcon, ChevronRightIcon, CloseIcon } from "@/components/atoms/Icons";

/* What a test run found. The summary bar says how many passed, failed and were
 * skipped (counts as well as color). A suite with a failure opens by itself;
 * a failing test shows its message under the name. Counts are derived from the
 * suites, so they cannot disagree with the rows. */

export type TestStatus = "passed" | "failed" | "skipped";

export type TestCase = { id: string; name: string; status: TestStatus; duration?: string; message?: string };

export type TestSuite = { id: string; name: string; tests: readonly TestCase[] };

export type TestResultsLabels = {
  passed: string;
  failed: string;
  skipped: string;
  total: (count: number) => string;
};

export const TEST_RESULTS_LABELS: TestResultsLabels = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
  total: (count) => `${count} tests`,
};

export function countTests(suites: readonly TestSuite[]): Record<TestStatus, number> {
  const counts: Record<TestStatus, number> = { passed: 0, failed: 0, skipped: 0 };
  for (const suite of suites) for (const test of suite.tests) counts[test.status] += 1;
  return counts;
}

function StatusMark({ status }: { status: TestStatus }) {
  if (status === "passed") return <CheckIcon className="text-green" size={13} />;
  if (status === "failed") return <CloseIcon className="text-red" size={13} />;
  return <span className="inline-block w-3 text-center text-ink-3">–</span>;
}

function Suite({ suite, labels }: { suite: TestSuite; labels: TestResultsLabels }) {
  const failed = suite.tests.filter((test) => test.status === "failed").length;
  const [open, setOpen] = useState(failed > 0);
  return (
    <section>
      <button
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-left hover:bg-hover"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <ChevronRightIcon className={`text-ink-3 transition-transform ${open ? "rotate-90" : ""}`} size={12} />
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink">{suite.name}</span>
        <span className={`font-mono text-[11px] ${failed > 0 ? "text-red" : "text-ink-3"}`}>
          {failed > 0 ? `${failed} ${labels.failed}` : `${suite.tests.length}`}
        </span>
      </button>
      {open ? (
        <ul className="pb-1 pl-6">
          {suite.tests.map((test) => (
            <li className="px-2 py-1" key={test.id}>
              <div className="flex items-center gap-2">
                <StatusMark status={test.status} />
                <span className={`min-w-0 flex-1 truncate text-[12px] ${test.status === "failed" ? "text-ink" : "text-ink-2"}`}>{test.name}</span>
                {test.duration ? <span className="font-mono text-[10.5px] text-ink-3">{test.duration}</span> : null}
              </div>
              {test.message ? (
                <pre className="mt-1 whitespace-pre-wrap rounded-control bg-red-tint px-2 py-1.5 font-mono text-[11px] leading-relaxed text-red">{test.message}</pre>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export type TestResultsProps = {
  suites: readonly TestSuite[];
  /** Whole-run time, already formatted. */
  duration?: string;
  labels?: Partial<TestResultsLabels>;
};

export function TestResults({ suites, duration, labels: labelOverrides }: TestResultsProps) {
  const labels = { ...TEST_RESULTS_LABELS, ...labelOverrides };
  const counts = countTests(suites);
  const total = counts.passed + counts.failed + counts.skipped;
  return (
    <div className="w-full max-w-[460px] rounded-card bg-surface p-2 shadow-card">
      <div className="px-2 pb-2 pt-1">
        <div className="flex items-baseline gap-3 text-[12px]">
          <span className="text-green">
            {counts.passed} {labels.passed}
          </span>
          {counts.failed > 0 ? (
            <span className="text-red">
              {counts.failed} {labels.failed}
            </span>
          ) : null}
          {counts.skipped > 0 ? (
            <span className="text-ink-3">
              {counts.skipped} {labels.skipped}
            </span>
          ) : null}
          <span className="ml-auto font-mono text-[11px] text-ink-3">
            {labels.total(total)}
            {duration ? ` · ${duration}` : ""}
          </span>
        </div>
        <div aria-hidden className="mt-1.5 flex h-1 overflow-hidden rounded-full bg-line">
          <span className="bg-green" style={{ width: `${total ? (counts.passed / total) * 100 : 0}%` }} />
          <span className="bg-red" style={{ width: `${total ? (counts.failed / total) * 100 : 0}%` }} />
        </div>
      </div>
      {suites.map((suite) => (
        <Suite key={suite.id} labels={labels} suite={suite} />
      ))}
    </div>
  );
}

const SUITES: TestSuite[] = [
  {
    id: "catalog",
    name: "catalog.test.mjs",
    tests: [
      { id: "1", name: "scans a component folder", status: "passed", duration: "12ms" },
      { id: "2", name: "rejects an unknown category", status: "passed", duration: "3ms" },
      { id: "3", name: "lists every problem at once", status: "passed", duration: "5ms" },
    ],
  },
  {
    id: "docs",
    name: "docs-check.test.mjs",
    tests: [
      { id: "4", name: "flags a dead link", status: "passed", duration: "8ms" },
      {
        id: "5",
        name: "flags a path that does not exist",
        status: "failed",
        duration: "21ms",
        message: "AssertionError: expected 2 problems, got 1\n  at docs-check.test.mjs:64",
      },
      { id: "6", name: "honors docs-check-ignore", status: "skipped" },
    ],
  },
];

export default function TestResultsDemo({ variant }: { variant?: string }) {
  const suites =
    variant === "All passed"
      ? SUITES.map((suite) => ({
          ...suite,
          tests: suite.tests.map((test): TestCase => ({ ...test, status: test.status === "skipped" ? "skipped" : "passed", message: undefined })),
        }))
      : SUITES;
  return (
    <div className="w-full pb-8">
      <TestResults duration="0.9s" suites={suites} />
    </div>
  );
}
