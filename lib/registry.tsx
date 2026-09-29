"use client";

import type { ComponentType } from "react";
import { META, type Meta } from "./meta";
import { DEMOS } from "./demos.generated";

export type Entry = Meta & { Demo: ComponentType<{ variant?: string }> };

export const REGISTRY: Entry[] = META.map((m) => ({ ...m, Demo: DEMOS[m.id] }));

/** id → entry (with its Demo), for rendering GROUPS. */
export const ENTRY_BY_ID: Record<string, Entry> = Object.fromEntries(REGISTRY.map((e) => [e.id, e]));
