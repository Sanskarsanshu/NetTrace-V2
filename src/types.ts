export type FolderTone =
  | 'sand'
  | 'green'
  | 'violet'
  | 'orange'
  | 'blue'
  | 'teal'
  | 'rose'
  | 'olive'
  | 'slate';

export type ChapterKind =
  | 'setup'
  | 'problem'
  | 'solution'
  | 'technique'
  | 'insight'
  | 'tradeoff'
  | 'recap';

export type CalloutKind = 'warn' | 'tip' | 'insight';

export type MetricLevel = 'neutral' | 'good' | 'warn' | 'bad';

export interface MetricDef {
  id: string;
  label: string;
}

export interface MetricValue {
  value: string | number;
  suffix?: string;
  level?: MetricLevel;
}

export type EntityKind =
  | 'laptop'
  | 'server'
  | 'router'
  | 'switch'
  | 'block'
  | 'cloud'
  | 'db'
  | 'osi-stack';

export type NodeTone = 'blue' | 'orange' | 'gold' | 'green' | 'violet' | 'rose' | 'slate';

export interface NodeTag {
  text: string;
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'violet' | 'blue';
  pos?: 'top' | 'bottom';
}

export interface SceneEntity {
  id: string;
  kind: EntityKind;
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  tone?: NodeTone;
  icon?: string;
  tags?: NodeTag[];
  highlight?: boolean;
  dim?: boolean;
  /** For osi-stack: which layers (1..7) are currently active / highlighted / wrapped */
  activeLayer?: number;
  wrappedLayers?: number[];
  direction?: 'down' | 'up';
}

export interface SceneLink {
  id: string;
  from: string;
  to: string;
  via?: [number, number][];
  style?: 'solid' | 'dashed' | 'beat' | 'off';
  label?: string;
  arrow?: 'end' | 'both' | 'none';
}

export type PacketKind = 'http' | 'tls' | 'tcp' | 'ip' | 'eth' | 'bits' | 'res' | 'fail';

export interface SceneFlow {
  linkId: string;
  kind: PacketKind;
  rate?: number; // packets per 2.4s cycle
  reverse?: boolean;
  label?: string;
}

export interface PacketBlock {
  label: string;
  sub?: string;
  color: string;
  textColor?: string;
  active?: boolean;
}

export interface StageMiniCard {
  x: number; // SVG viewport x (0..920)
  y: number; // SVG viewport y (0..540)
  width?: number;
  title: string;
  lines?: { key: string; val: string; tone?: 'normal' | 'good' | 'warn' | 'bad' | 'accent' }[];
  packetStack?: PacketBlock[];
  footer?: string;
}

export interface SceneSpec {
  entities: SceneEntity[];
  links: SceneLink[];
  flows: SceneFlow[];
  cards?: StageMiniCard[];
}

export interface LessonStep {
  short: string;
  chapter: ChapterKind;
  title: string;
  body: string[];
  callout?: {
    kind: CalloutKind;
    title?: string;
    text: string;
  };
  changes?: string[]; // prefixed with '+ ', '- ', or '~ '
  takeaways?: string[];
  metrics: Record<string, MetricValue>;
  scene: SceneSpec;
}

export interface LessonGoal {
  text: string;
  step: number; // 1-based step index when goal becomes checked
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  minutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  metrics: MetricDef[];
  legend: { kind: PacketKind; label: string }[];
  goals: LessonGoal[];
  steps: LessonStep[];
}

export interface SyllabusLessonMeta {
  id: string;
  title: string;
  summary: string;
  minutes?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  ready: boolean;
}

export interface SyllabusModule {
  id: string;
  num: string;
  title: string;
  tone: FolderTone;
  lessons: SyllabusLessonMeta[];
}
