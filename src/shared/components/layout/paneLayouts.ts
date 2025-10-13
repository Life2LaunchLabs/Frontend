import { PaneGridSpec } from './PageLayout';

/// layout/types.ts
export type BP<T> = T | { base: T; md?: T; lg?: T };
export type Track = string; // e.g. '1fr', 'minmax(0, 720px)'

export type ColDef = { id: string; width: BP<Track> };

export type StackedColumnsParams = {
  cols: ColDef[];
  /** collapse to single column at these breakpoints; default { base: false, md: false, lg: false } */
  stackAt?: { base?: boolean; md?: boolean; lg?: boolean };
  gap?: BP<string>;
  center?: boolean;                 // horizontally center the track(s)
  rowHeights?: 'content' | 'fill';  // default 'content' => min-content
  alignItems?: BP<React.CSSProperties['alignItems']>; // override per need
  justifyItems?: BP<React.CSSProperties['justifyItems']>;
};

export type PaneContent = {
  content: React.ReactNode;
  css?: any;
  area?: string;
  column?: string;
  spanRows?: boolean;
};

export type GridModeFn<P> = (params: P, tokens: any) => PaneGridSpec;


const resolveBP = <T,>(v: BP<T>, bp: 'base'|'md'|'lg') =>
  typeof v === 'object' && 'base' in v ? (v[bp] ?? v.base) : v;

export const stackedColumns: (params: StackedColumnsParams, tokens: any) => PaneGridSpec =
({ cols, stackAt, gap, center, alignItems, justifyItems }, tokens) => {
  const sa = { base: false, md: false, lg: false, ...(stackAt ?? {}) };

  const colTrack = (bp: 'base'|'md'|'lg') => {
    const collapsed = !!sa[bp];
    if (collapsed) {
      const first = cols[0]?.width ?? '1fr';
      const w = resolveBP(first, 'base'); // when collapsed, just use base width of first col
      return `minmax(0, ${w})`;
    }
    return cols.map(c => resolveBP(c.width, bp)).join(' ');
  };

  const areasFor = (bp: 'base'|'md'|'lg'): string[] => {
    const collapsed = !!sa[bp];
    if (collapsed) return cols.map(c => c.id);  // each column becomes its own row
    return [cols.map(c => c.id).join(' ')];     // side-by-side
  };

  return {
    columns: { base: colTrack('base'), md: colTrack('md'), lg: colTrack('lg') },
    rows: 'auto',
    areas: { base: areasFor('base'), md: areasFor('md'), lg: areasFor('lg') },
    gap: gap ?? tokens.spacing[5],
    justifyContent: center ? 'center' : 'start',
    justifyItems: justifyItems ?? 'stretch',
    alignItems: alignItems ?? 'start',
    // NOTE: PageLayout’s grid wrapper will set gridAutoRows based on rowHeights
    // because PaneGridSpec is pure template config.
  };
};

