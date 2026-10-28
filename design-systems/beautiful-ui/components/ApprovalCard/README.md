Human-in-the-loop questions the agent asks before acting, one at a time.

## When to use

- The stack slides between questions, the step counter rolls like an odometer, and the footer pairs a quiet Skip with a dark Continue.
- Single-choice answers auto-advance; multi-select waits.
- Consumer supplies `questions` (`radio` or `check`), `labels`, and `onSubmitted` / `onAnswerChange`.

## Props

```ts
{ questions, labels, onSubmitted, onAnswerChange, resettable, }?: {
    questions?: ApprovalQuestion[];
    labels?: Partial<ApprovalLabels>;
    onSubmitted?: (answers: Record<number, number[]>) => void;
    onAnswerChange?: (questionIndex: number, answer: number[]) => void;
    resettable?: boolean;
    variant?: string;
}
```

Full types: `components/ApprovalCard/ApprovalCard.d.ts`. Source: `components/primitives/ApprovalCard.tsx` in slev12397/beautiful-ui.
