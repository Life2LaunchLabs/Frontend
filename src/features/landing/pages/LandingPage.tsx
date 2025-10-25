/** @jsxImportSource @emotion/react */
import { AppFooter } from '@shared/components';
import {
  GetStartedSection,
  AboutLaunchpadSection,
  AboutLife2LaunchSection,
  StartJourneySection,
} from '../components';

export const LandingPage = () => {
  return (
    <div css={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GetStartedSection />
      <AboutLaunchpadSection />
      <AboutLife2LaunchSection />
      <StartJourneySection />
      <AppFooter />
    </div>
  );
};
