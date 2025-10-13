/** @jsxImportSource @emotion/react */
import React from 'react';
import { PageLayout } from '@shared/components';
import { Experience, ExperienceSection, ProfileHeader, SkillBadge, SkillBadgesGrid } from '../components';

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
      name: "OES: Adaptability Badge",
      color: "#123456",
      earned: "Sept 5, 2025"
    },
    {
      name: "Life2Launch: Advanced Launcher",
      color: "#654321",
      earned: "April 3, 2025"
    },
    {
      name: "OES: Digital Literacy Badge",
      color: "#125634",
      earned: "Sept 9, 2025"
    },
  ]

  return (
    <PageLayout
      pageName="Profile"
      gridParams={{
        cols: [
          { id: 'left', width: 'auto' }, // left column
          { id: 'right', width: 'minmax(420px, 1fr)' }, // right column
        ],
        stackAt: { base: false },
        alignItems: 'stretch',
        justifyItems: 'stretch',
      }}
      panes={[
        {
          column: 'left',
          content: <ProfileHeader asFragment />,
        },
        {
          column: 'left',
          content: <SkillBadgesGrid badges={demo_badges} asFragment />,
        },
        {
          column: 'right',
          content: <ExperienceSection experiences={demo_experiences} asFragment />,
          spanRows: true,
          css: { minHeight: 0, overflow: 'hidden' },
        },
      ]}
    />
  );
};