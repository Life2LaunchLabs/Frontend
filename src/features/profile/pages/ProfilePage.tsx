/** @jsxImportSource @emotion/react */
import React from 'react';
import { PageLayout, Pane } from '@shared/components';
import { useTheme } from '@/styles';
import { Experience, ExperienceSection, ProfileHeader, SkillBadge, SkillBadgesGrid, SoftSkillsSection, CredentialsSection } from '../components';

export const ProfilePage: React.FC = () => {
  const demo_experiences: Experience[]  = [
    {
      id: 1,
      type: 'work',
      title: 'Design Internship',
      company: "ABC Design",
      location: 'Salem OR',
      duration: '6 months',
      description: 'helped the design team prep a new branding initiative',
      verified: true,
      responsibilities: ['design', 'communication']
    },
    {
      id: 2,
      type: 'volunteer',
      title: 'Website Design',
      company: "Hope Church",
      location: 'Salem OR',
      duration: '3 months',
      description: 'helped improve the church website',
      verified: false,
      responsibilities: ['design', 'community']
    },
    {
      id: 3,
      type: 'work',
      title: 'Cashier',
      company: "Target",
      location: 'Salem OR',
      duration: '12 months',
      description: 'Part time job working the register at target',
      verified: true,
      responsibilities: ['teamwork', 'communication']
    },
  ]
  const demo_badges: SkillBadge[]  = [
    {
      name: "Life2Launch: Outer World",
      color: "#fe6f2f",
      earned: "Sept 5, 2025",
      icon: "globe"
    },
    {
      name: "Life2Launch: Personal Drivers",
      color: "#1aa7ff",
      earned: "April 3, 2025",
      icon: "gears"
    },
    {
      name: "Life2Launch: Personal OS",
      color: "#0e1550",
      earned: "Sept 9, 2025",
      icon: "home"
    },
  ]

  const { tokens } = useTheme();

  const customGrid = (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr minmax(420px, 1fr)',
        gridTemplateRows: 'auto auto auto',
        gridTemplateAreas: `
          "a a b"
          "c c b"
          "d e b"
        `,
        gap: tokens.spacing[5],
        alignItems: 'stretch',
        justifyItems: 'stretch',
        width: '100%',
        height: '100%',
      }}
    >
      <Pane css={{ gridArea: 'a', height: '100%' }}>
        <ProfileHeader asFragment />
      </Pane>
      <Pane css={{ gridArea: 'b', height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <ExperienceSection experiences={demo_experiences} asFragment />
      </Pane>
      <Pane css={{ gridArea: 'c', height: '100%' }}>
        <SkillBadgesGrid badges={demo_badges} asFragment />
      </Pane>
      <Pane css={{ gridArea: 'd', height: '100%' }}>
        <SoftSkillsSection asFragment />
      </Pane>
      <Pane css={{ gridArea: 'e', height: '100%' }}>
        <CredentialsSection asFragment />
      </Pane>
    </div>
  );

  return (
    <PageLayout
      pageName="Profile"
      customContent={customGrid}
    />
  );
};