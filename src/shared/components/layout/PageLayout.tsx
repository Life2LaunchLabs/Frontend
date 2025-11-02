// PageLayout.tsx
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useTheme } from '../../../styles';
import { PageBackground } from './PageBackground';
import { ContentArea } from './ContentArea';
import { Header } from './Header';
import { AppFooter } from './AppFooter';
import { Pane } from '../surfaces/Pane';
import { paneWidths } from '../../../styles';
import { stackedColumns, StackedColumnsParams } from './paneLayouts';


export interface PaneContent {
  content: React.ReactNode;
  css?: any;
  area?: string; // named grid area
  column?: string;
  spanRows?: boolean;
  invisible?: boolean;
}

type AreasMatrix = string[];
type Responsive<T> = T | { base: T; md?: T; lg?: T };

export interface PaneGridSpec {
  columns: Responsive<string>;
  rows?: Responsive<string>;
  areas?: Responsive<AreasMatrix>;
  gap?: Responsive<string>;
  alignItems?: Responsive<React.CSSProperties['alignItems']>;
  justifyItems?: Responsive<React.CSSProperties['justifyItems']>;
  justifyContent?: Responsive<React.CSSProperties['justifyContent']>;
}

export type LayoutMode = 'default' | 'auth' | 'utility' | 'activity';

export interface UtilityHeaderControls {
  /** Title in the utility header (e.g., "Settings") */
  title?: string;
  /** Back or Close action on the left */
  leftAction?: { type: 'back' | 'close'; label?: string; onClick?: () => void };
  /** Optional right-side action (e.g., Done / Save) */
  rightAction?: { label: string; onClick: () => void; ariaLabel?: string };
}

export interface PageLayoutProps {
  pageName: string;
  panes?: PaneContent[];
  children?: React.ReactNode;
  verticalCenter?: boolean;
  navMode?: 'launchpad' | 'admin';
  toolbars?: React.ReactNode[];
  sidebar?: React.ReactNode;

  gridMode?: GridModeFn<StackedColumnsParams>;
  gridParams?: StackedColumnsParams;
  fillRowIndex?: number;

  /** Pass a pre-assembled custom grid fragment, bypassing the pane assembly logic */
  customContent?: React.ReactNode;

  layoutMode?: LayoutMode;
  utilityHeader?: UtilityHeaderControls;
  showFooter?: boolean;
}

const mq = (tokens: any) => ({
  base: '@media (min-width: 0px)',
  md: `@media (min-width: ${tokens.breakpoints.md || '768px'})`,
  lg: `@media (min-width: ${tokens.breakpoints.lg || '1200px'})`,
});

function responsive<T>(value: Responsive<T> | undefined, toCss: (v: T) => any, tokens: any) {
  if (value == null) return undefined;
  const { base, md, lg } =
    typeof value === 'object' && 'base' in value
      ? value
      : { base: value as T, md: undefined, lg: undefined };

  const cssObj: any = {};
  const bps = mq(tokens);

  if (base !== undefined) cssObj[bps.base] = toCss(base as T);
  if (md !== undefined) cssObj[bps.md] = toCss(md as T);
  if (lg !== undefined) cssObj[bps.lg] = toCss(lg as T);

  return cssObj;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  pageName,
  panes,
  children,
  verticalCenter = false,
  navMode = 'launchpad',
  toolbars,
  sidebar,

  gridMode = stackedColumns,
  gridParams,
  fillRowIndex = 0,

  customContent,

  layoutMode = 'default',
  utilityHeader,
  showFooter,
}) => {
  const { tokens } = useTheme();

  const shouldShowGlobalHeader = layoutMode === 'default';

  const shouldShowUtilityHeader = layoutMode === 'utility';

  // Footer defaults by layout mode:
  const defaultFooterByMode =
    layoutMode === 'default' ? true :
    layoutMode === 'auth' ? true :      // your "auth with only footer" request
    layoutMode === 'activity' ? false :
    /* utility */ false;

  const shouldShowFooter =
    typeof showFooter === 'boolean' ? showFooter : defaultFooterByMode;

  const resolvedGridParams: StackedColumnsParams = useMemo(
    () => ({
      cols: [{ id: 'a', width: `minmax(0, ${paneWidths.xl})` }],
      center: true,
      stackAt: { base: false },
      rowHeights: 'content',
      ...(gridParams ?? {}),
    }),
    [gridParams]
  );

  // 1) Give each pane a unique area suffix: a1, a2, ...
const { normalizedPanes, countsByCol, spanCols } = useMemo(() => {
  if (!panes) return { normalizedPanes: [], countsByCol: {}, spanCols: new Set<string>() };
  const counters: Record<string, number> = {};
  const span = new Set<string>();

  const list = panes.map(p => {
    const col = (p as any).column ?? 'a';
    const idx = (counters[col] = (counters[col] ?? 0) + 1);
    if ((p as any).spanRows) span.add(col);
    return { ...p, area: `${col}${idx}` } as PaneContent & { column?: string };
  });

  return { normalizedPanes: list, countsByCol: counters, spanCols: span };
}, [panes]);

  // 2) Ask stackedColumns for columns/gap/align (unchanged)
  const baseSpec = useMemo(
    () => gridMode(resolvedGridParams, tokens),
    [gridMode, resolvedGridParams, tokens]
  );

  const gridSpec = useMemo(() => {
  const sa = { base: false, md: false, lg: false, ...(resolvedGridParams.stackAt ?? {}) };
  const colIds = resolvedGridParams.cols.map(c => c.id);

  const maxRows = Math.max(1, ...colIds.map(id => countsByCol[id] ?? 0));
  const totalRowsCollapsed = colIds.reduce((s, id) => s + (countsByCol[id] ?? 0), 0);

  const rowTracks = (rowCount: number) =>
    Array.from({ length: rowCount }, (_, i) =>
      i === (fillRowIndex ?? -1) ? '1fr' : 'min-content'
    ).join(' ');

  const areasNotCollapsed = (): string[] => {
    const rows: string[] = [];
    for (let i = 0; i < maxRows; i++) {
      rows.push(
        colIds.map(id => {
          const count = countsByCol[id] ?? 0;
          if (count === 0) return '.';
          // if column is marked to span, always use its first area name on every row
          if (spanCols.has(id)) return `${id}1`;
          // otherwise only show area when that row exists
          return i < count ? `${id}${i + 1}` : '.';
        }).join(' ')
      );
    }
    return rows;
  };

  const areasCollapsed = (): string[] => {
    // one column; stack all panes by column then by order
    const lines: string[] = [];
    for (const id of colIds) {
      const n = countsByCol[id] ?? 0;
      for (let i = 0; i < n; i++) lines.push(`${id}${i + 1}`);
    }
    return lines.length ? lines : colIds; // fallback
  };


  return {
    ...baseSpec,
    rows:  { base: rowTracks(sa.base ? totalRowsCollapsed : maxRows) },
    areas: { base: sa.base ? areasCollapsed() : areasNotCollapsed() },
    // keep md/lg if you use them; omitted here for brevity
  };
}, [baseSpec, countsByCol, fillRowIndex, resolvedGridParams.stackAt, resolvedGridParams.cols, spanCols]);

  const renderGrid = () => {
    // If customContent is provided, use it directly
    if (customContent) return customContent;

    if (!panes) return children;

    const gridCss: any = {
      display: 'grid',
      minWidth: 0,
      minHeight: 0,
      width: '100%',
      height: verticalCenter ? 'auto' : '100%',
      gridAutoRows: resolvedGridParams.rowHeights === 'fill' ? 'auto' : 'min-content',
    };

    const set = (v: string) => v;
    const merge = (...objs: any[]) => {
      const res: any = {};
      objs.forEach(o => {
        if (!o) return;
        Object.keys(o).forEach(bp => {
          res[bp] = { ...res[bp], ...o[bp] };
        });
      });
      return res;
    };

    Object.assign(
      gridCss,
      merge(
        responsive(gridSpec.columns, v => ({ gridTemplateColumns: set(v) }), tokens),
        responsive(gridSpec.rows, v => ({ gridTemplateRows: set(v) }), tokens),
        responsive(
          gridSpec.areas,
          (lines) => ({ gridTemplateAreas: lines.map(l => `"${l}"`).join(' ') }),
          tokens
        ),
        responsive(gridSpec.gap ?? tokens.spacing[5], v => ({ gap: set(v) }), tokens),
        responsive(gridSpec.alignItems, v => ({ alignItems: v }), tokens),
        responsive(gridSpec.justifyItems, v => ({ justifyItems: v }), tokens),
        responsive(gridSpec.justifyContent, v => ({ justifyContent: v }), tokens),
      )
    );

    return (
      <div css={gridCss}>
        {normalizedPanes.map((pane, i) => (
          <Pane
            key={i}
            invisible={pane.invisible}
            css={{
              gridArea: pane.area,   // 'a' | 'b' etc. (template uses these)
              minWidth: 0,
              minHeight: 0,
              height: verticalCenter ? 'auto' : '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              ...pane.css,
            }}
          >
            {pane.content}
          </Pane>
        ))}
      </div>
    );
  };

  const content = renderGrid();

  return (
    <PageBackground
      css={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateRows:
          (shouldShowGlobalHeader || shouldShowUtilityHeader) ? 'auto 1fr auto' : '1fr auto',
      }}
      data-testid="page-layout"
    >
      {(shouldShowGlobalHeader || shouldShowUtilityHeader) && (
        <div css={{ flexShrink: 0 }}>
          <Header
            pageName={shouldShowGlobalHeader ? pageName : utilityHeader?.title ?? pageName}
            navMode={navMode}
            variant={shouldShowUtilityHeader ? 'utility' : 'global'}
            leftAction={shouldShowUtilityHeader ? utilityHeader?.leftAction : undefined}
            rightAction={shouldShowUtilityHeader ? utilityHeader?.rightAction : undefined}
            showNav={shouldShowGlobalHeader}
          />
          {shouldShowGlobalHeader && toolbars?.map((tb, i) => <div key={i}>{tb}</div>)}
        </div>
      )}

      <div
        css={{
          display: 'grid',
          gridTemplateColumns: sidebar ? 'auto 1fr' : '1fr',
          gap: tokens.spacing[6],
          alignItems: verticalCenter ? 'center' : 'stretch',
          padding: tokens.spacing[6],
          minHeight: 0,
          '@media (max-width: 768px)': {
            padding: tokens.spacing[3],
            gap: tokens.spacing[3],
          },
        }}
      >
        {sidebar && (
          <div
            css={{
              position: 'sticky',
              top: 0,
              alignSelf: 'start',
              maxHeight: '100dvh',
              overflow: 'auto',
            }}
          >
            {sidebar}
          </div>
        )}

        <ContentArea
          verticalCenter={verticalCenter}
          css={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}
        >
          {content}
        </ContentArea>
      </div>

      {shouldShowFooter && <AppFooter />}
    </PageBackground>
  );
};