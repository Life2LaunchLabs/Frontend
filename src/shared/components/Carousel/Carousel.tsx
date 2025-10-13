/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTheme, withOpacity } from '../../../styles';
import { Button } from '../Button';

export interface CarouselProps<T = unknown> {
  title?: string;
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => React.Key;
  gapPx?: number;
  ariaLabel?: string;
  initialIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

/** ✅ Use a generic function declaration, not an arrow with `<T,>` */
export function Carousel<T>({
  title,
  items,
  renderCard,
  getKey,
  gapPx,
  ariaLabel = 'carousel',
  initialIndex = 0,
  onActiveIndexChange,
}: CarouselProps<T>) {
  const { colors, tokens } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(Math.min(initialIndex, Math.max(items.length - 1, 0)));
  const [scrolling, setScrolling] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  const gap = (gapPx ?? parseInt(tokens.spacing[4], 10)) || 8;

  // keep refs array length in sync
  cardRefs.current = useMemo(
    () => new Array(items.length).fill(null) as Array<HTMLDivElement | null>,
    [items.length]
  );

  const updateEdgeButtons = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const sl = Math.round(el.scrollLeft);
    setCanPrev(sl > 1);
    setCanNext(sl < maxScrollLeft - 1);
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const el = containerRef.current;
    const card = cardRefs.current[index];
    if (!el || !card) return;
    const left = card.offsetLeft;
    setScrolling(true);
    el.scrollTo({ left, behavior: 'smooth' });
  }, []);

  const findNearestCardIndex = useCallback(() => {
    const el = containerRef.current;
    if (!el) return 0;
    const scrollLeft = el.scrollLeft;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      const d = Math.abs(card.offsetLeft - scrollLeft);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    return nearest;
  }, []);

  const goPrev = useCallback(() => {
    const current = findNearestCardIndex();
    const target = Math.max(current - 1, 0);
    scrollToCard(target);
  }, [findNearestCardIndex, scrollToCard]);

  const goNext = useCallback(() => {
    const current = findNearestCardIndex();
    const target = Math.min(current + 1, items.length - 1);
    scrollToCard(target);
  }, [findNearestCardIndex, scrollToCard, items.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updateEdgeButtons();
        const nearest = findNearestCardIndex();
        if (nearest !== activeIndex) {
          setActiveIndex(nearest);
          onActiveIndexChange?.(nearest);
        }
      });
    };

    // scrollend isn’t in all TS lib doms; guard + fallback
    const handleScrollEnd = () => setScrolling(false);

    el.addEventListener('scroll', handleScroll, { passive: true });
    // @ts-expect-error: scrollend not in older TS DOM types; browsers will ignore if unsupported
    el.addEventListener('scrollend', handleScrollEnd);

    
    updateEdgeButtons();
    if (initialIndex > 0) {
      const left = cardRefs.current[initialIndex]?.offsetLeft ?? 0;
      // instant jump without specifying behavior avoids typing issues
      el.scrollTo({ left });
    }

    const resizeObserver = new ResizeObserver(() => {
      const idx = findNearestCardIndex();
      const left = cardRefs.current[idx]?.offsetLeft ?? 0;
      el.scrollTo({ left });
      updateEdgeButtons();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      // @ts-expect-error see above
      el.removeEventListener('scrollend', handleScrollEnd);
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault(); goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); goPrev();
    } else if (e.key === 'Home') {
      e.preventDefault(); scrollToCard(0);
    } else if (e.key === 'End') {
      e.preventDefault(); scrollToCard(items.length - 1);
    }
  };

  // --- drag to scroll ---
    const [dragging, setDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);
    const moved = useRef(false);

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (e.button !== 0) return; // primary only
      const el = containerRef.current;
      if (!el) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      dragStartX.current = e.clientX;
      dragStartScrollLeft.current = el.scrollLeft;
      moved.current = false;
      setDragging(true);
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
      if (!dragging) return;
      const el = containerRef.current;
      if (!el) return;
      const dx = e.clientX - dragStartX.current;
      // invert dx to scroll horizontally
      el.scrollLeft = dragStartScrollLeft.current - dx;
      if (Math.abs(dx) > 3) moved.current = true; // small threshold to suppress clicks
      setScrolling(true); // reuse existing flag to pause nav spam
    };

    const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      e?.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragging(false);
      // let the native scroll event settle; our existing 'scroll' listener updates buttons/active
      requestAnimationFrame(() => setScrolling(false));
    };

    // Prevent click-through on cards if user dragged
    const onClickCapture: React.MouseEventHandler<HTMLDivElement> = (e) => {
      if (moved.current) {
        e.stopPropagation();
        e.preventDefault();
        moved.current = false;
      }
    };

  return (
    <section
      aria-label={title ?? ariaLabel}
      css={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${tokens.spacing[1]} 0`,
          minHeight: `calc(${tokens.spacing[8]})`,
        }}
      >
        <div
          css={{
            ...tokens.typography.title.medium,
            color: colors.onSurface,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={title}
        >
          {title}
        </div>

        <div css={{ display: 'flex', gap: tokens.spacing[1] }}>
          <Button variant="text" icon="chevron_left" onClick={goPrev} disabled={!canPrev || scrolling} aria-label="Previous">
            Prev
          </Button>
          <Button variant="text" icon="chevron_right" onClick={goNext} disabled={!canNext || scrolling} aria-label="Next">
            Next
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        css={{
          borderLeft: `1px solid ${withOpacity(colors.onSurface, 0.12)}`,
          borderRight: `1px solid ${withOpacity(colors.onSurface, 0.12)}`,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          display: 'flex',
          gap: `${gap}px`,
          padding: `${tokens.spacing[1]} 0`,
          scrollSnapType: 'x proximity',
          // Enable touch pan, show grab cursor, and avoid text-selection while dragging
          touchAction: 'pan-x',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: dragging ? 'none' : 'auto',
        }}
      >

        {items.map((item, i) => (
          <div
            key={getKey ? getKey(item, i) : i}
            ref={(el) => { cardRefs.current[i] = el; }}
            css={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
          >
            {renderCard(item, i)}
          </div>
        ))}
      </div>

      <div
        role="tablist"
        aria-label={`${title ?? ariaLabel} pagination`}
        css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: tokens.spacing[1], paddingTop: tokens.spacing[1] }}
      >
        {items.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to item ${i + 1}`}
              onClick={() => scrollToCard(i)}
              css={{
                appearance: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                width: isActive ? 14 : 6,
                height: 6,
                borderRadius: isActive ? 999 : '50%',
                backgroundColor: isActive ? colors.primary : withOpacity(colors.onSurface, 0.38),
                transition: tokens.transitions.fast,
                cursor: 'pointer',
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
