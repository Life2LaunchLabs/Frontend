/** @jsxImportSource @emotion/react */
import { AppFooter, PageBackground } from '@shared/components';
import {
  GetStartedSection,
} from '../components';

export const LandingPage = () => {
  return (
    <PageBackground>
      <div css={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <GetStartedSection />
        <AppFooter />
      </div>
    </PageBackground>
  );
};
