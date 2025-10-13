/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, Carousel } from '@shared/components';
import { useTheme, withOpacity } from '../../../styles';
import { oesBadges } from '../data/oesBadges';
import { workforceOpportunities } from '../data/workforceOpportunities';
import { usePublishedQuests } from '../api/hooks';


export const ExplorePage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const navigate = useNavigate();
  const { data: publishedQuests } = usePublishedQuests();

  const sectionTitle = css({
    ...tokens.typography.headline.small,
    color: colors.onSurface,
    marginBottom: tokens.spacing[3],
  });

  // OES Work Ready badges
  const workReadyBadges = useMemo(() =>
    oesBadges.map(badge => ({
      id: badge.id,
      title: badge.name,
      subtitle: 'Work Ready Learner Badge',
      body: badge.description,
      imageSrc: badge.image,
      criteriaId: badge.criteriaId,
    }))
  , []);


  const opportunities = useMemo(() =>
    workforceOpportunities.map(opp => ({
      id: opp.id,
      title: opp.title,
      subtitle: opp.subtitle,
      body: opp.body,
      imageSrc: opp.image,
      criteriaId: opp.link,
    }))
  , []);

  const quests = useMemo(() =>
    publishedQuests?.map(quest => ({
      id: quest.id,
      title: quest.title,
      subtitle: quest.organization,
      body: quest.short_description || quest.description || 'No description available',
      imageSrc: quest.image_url,
    })) || []
  , [publishedQuests]);


  const paneSection = (args: {
  title: string;
  items: { id: string; title: string; subtitle: string; body: string; emoji?: string; imageSrc?: string; criteriaId?: string }[];
  idSuffix: string;
}) => {
  const { title, items, idSuffix } = args;

  return (
    <section id={`carousel-${idSuffix}`}>
      <h2 css={sectionTitle}>{title}</h2>

      <Carousel
        title={title}
        ariaLabel={`${title} carousel`}
        items={items}
        getKey={(it) => it.id}
        gapPx={16}
        renderCard={(it) => (
          <div
            css={{
              width: 320,
              height: 240,
              position: 'relative',
              borderRadius: tokens.borderRadius.medium,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: tokens.transitions.fast,
              outline: '2px solid transparent',
              '&:hover': {
                outline: `2px solid ${withOpacity(colors.primary, 0.4)}`,
              },
            }}
            onMouseDown={(e) => {
              // Track initial position to detect if this is a click or drag
              const startX = e.clientX;
              const startY = e.clientY;

              const handleMouseUp = (upEvent: MouseEvent) => {
                const deltaX = Math.abs(upEvent.clientX - startX);
                const deltaY = Math.abs(upEvent.clientY - startY);

                // Only trigger click if movement is minimal (< 5px)
                if (deltaX < 5 && deltaY < 5) {
                  if (it.criteriaId) {
                    // External link - open in new tab
                    window.open(it.criteriaId, '_blank', 'noopener,noreferrer');
                  } else {
                    // Internal navigation
                    navigate('/');
                  }
                }

                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mouseup', handleMouseUp);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (it.criteriaId) {
                  // External link - open in new tab
                  window.open(it.criteriaId, '_blank', 'noopener,noreferrer');
                } else {
                  // Internal navigation
                  navigate('/');
                }
              }
            }}
          >
            {/* Background Image/Emoji */}
            <div
              css={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: colors.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {it.imageSrc ? (
                <img
                  src={it.imageSrc}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  css={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : it.emoji ? (
                <span style={{ fontSize: 72, lineHeight: 1 }}>{it.emoji}</span>
              ) : null}
            </div>

            {/* Overlay Content */}
            <div
              css={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                padding: tokens.spacing[3],
                background: withOpacity(colors.surfaceContainer, 0.92),
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong style={{ margin: 0, color: colors.onSurface }}>{it.title}</strong>
                <p
                  style={{
                    margin: 0,
                    color: colors.onSurfaceVariant,
                    fontSize: '0.875rem',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {it.body}
                </p>
              </div>
            </div>
          </div>
        )}
      />
    </section>
  );
};

  const workReadyPane = {
  content: paneSection({
    title: 'OES: Work Ready',
    items: workReadyBadges,
    idSuffix: 'work-ready',
  }),
};

const oppsPane = {
  content: paneSection({
    title: 'Opportunities',
    items: opportunities,
    idSuffix: 'opportunities',
  }),
};

const questsPane = {
  content: paneSection({
    title: 'Quests',
    items: quests,
    idSuffix: 'quests',
  }),
};


  return (
    <PageLayout
      pageName="Explore"
      layoutMode="default"
      panes={[workReadyPane, oppsPane, questsPane]}
    />
  );
};
