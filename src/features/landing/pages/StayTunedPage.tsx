/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { PageBackground } from '@shared/components';
import { useTheme } from '@/styles/providers/hooks';
import { apiClient } from '@/lib/api';
import launchpadDomeLogo from '@shared/assets/images/launchpad_dome_logo.png';

export const StayTunedPage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/api/auth/guest-leads/', {
        email,
        subscribed_to_updates: true,
        flow_id: 'stay-tuned',
      });

      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to submit email:', error);
      alert('Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground>
      <div
        css={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top bar with logo */}
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
          }}
        >
          <img
            src={launchpadDomeLogo}
            alt="Launchpad"
            css={{
              height: '40px',
              width: 'auto',
            }}
          />
        </div>

        {/* Main content - centered */}
        <div
          css={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: tokens.spacing[6],
            gap: tokens.spacing[6],
          }}
        >
          <div
            css={{
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: tokens.spacing[6],
              textAlign: 'center',
            }}
          >
            <h1
              css={{
                ...tokens.typography.display.large,
                color: colors.onSurface,
              }}
            >
              Would you like to know when the LaunchPad is ready?
            </h1>

            <p
              css={{
                ...tokens.typography.body.large,
                color: colors.onSurfaceVariant,
              }}
            >
              We're preparing something special. Give us your email and we'll let you know when we're ready to launch!
            </p>

            {submitted ? (
              <div
                css={{
                  padding: tokens.spacing[4],
                  borderRadius: tokens.borderRadius.medium,
                  backgroundColor: colors.primaryContainer,
                  color: colors.onPrimaryContainer,
                  ...tokens.typography.body.large,
                }}
              >
                Thank you! We'll keep you updated on the LaunchPad.
              </div>
            ) : (
              <form
                onSubmit={handleEmailSubmit}
                css={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing[4],
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  css={{
                    padding: tokens.spacing[4],
                    borderRadius: tokens.borderRadius.medium,
                    border: `2px solid ${colors.outline}`,
                    ...tokens.typography.body.large,
                    color: colors.onSurface,
                    backgroundColor: colors.surface,
                    textAlign: 'center',
                    '&:focus': {
                      outline: 'none',
                      borderColor: colors.primary,
                    },
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  css={{
                    padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
                    borderRadius: tokens.borderRadius.medium,
                    border: 'none',
                    backgroundColor: colors.primary,
                    color: colors.onPrimary,
                    ...tokens.typography.label.large,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: isSubmitting ? 0.7 : 1,
                    '&:hover': {
                      backgroundColor: isSubmitting ? colors.primary : colors.primaryContainer,
                    },
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageBackground>
  );
};
