/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import { PageBackground } from '@shared/components';
import { useTheme } from '@/styles/providers/hooks';
import { apiClient } from '@/lib/api';
import { IconButton } from '@/shared/components/IconButton';
import { Modal } from '@/shared/components/Modal';
import launchpadBackgroundDark from '@/shared/assets/images/launchpad_background_dark.png';
import launchpadDomeLogo from '@/shared/assets/images/launchpad_dome_logo.png';

interface PathwayChartData {
  bars: Array<{
    label: string;
    value: number;
    color: string;
    color_secondary: string;
  }>;
  pathways: Array<{
    pathway: string;
    title: string;
    description: string;
    score: number;
    percentage: number;
    color: string;
  }>;
  primary_pathway: string;
}

interface ProcessedResultsResponse {
  attempt_id: string;
  activity_title: string;
  activity_description: string;
  completed_at: string;
  started_at: string;
  sections: Array<{
    section_id: string;
    section_title: string;
    items: Array<{
      question_id: string;
      question: string;
      answer: {
        type: 'single_choice' | 'multiple_choice' | 'text' | 'a_or_b' | 'unknown';
        text: string;
        value?: string;
        values?: string[];
        items?: Array<{
          id: string;
          text: string;
          icon_url?: string;
        }>;
        option_a?: string;
        option_b?: string;
      };
    }>;
  }>;
  scores: Record<string, number>;
  normalized_scores?: Record<string, number>;
  pathway_chart?: PathwayChartData;
  insights: any[];
  recommendations: any[];
}

/**
 * Welcome Results Page - displayed after completing the onboarding flow
 * Shows pathway assessment results in a printable format
 */
export const WelcomeResultsPage: React.FC = () => {
  const { colors, tokens } = useTheme();
  const [resultsData, setResultsData] = useState<ProcessedResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // US Letter size: 8.5" x 11" at 96 DPI = 816px width
  const LETTER_WIDTH_PX = 816;

  useEffect(() => {
    const fetchPathwayResults = async () => {
      // Get attempt ID from sessionStorage
      const attemptId = sessionStorage.getItem('pathways_attempt_id');

      if (!attemptId) {
        console.error('No pathways attempt ID found in sessionStorage');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching processed results for attempt:', attemptId);
        const response = await apiClient.get<ProcessedResultsResponse>(
          `/api/public/attempts/${attemptId}/results/`
        );
        console.log('Processed results:', response.data);
        console.log('Has pathway_chart?', !!response.data.pathway_chart);
        console.log('Pathway chart data:', response.data.pathway_chart);
        console.log('Section titles:', response.data.sections.map(s => s.section_title));
        setResultsData(response.data);
      } catch (error) {
        console.error('Failed to fetch pathway results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPathwayResults();
  }, []);

  const handleDownloadPDF = () => {
    // Use browser's native print dialog which properly handles page breaks
    window.print();
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmittingEmail(true);

    try {
      await apiClient.post('/api/auth/guest-leads/', {
        email,
        subscribed_to_updates: true,
        flow_id: 'user-onboarding-v1',
      });

      setEmailSubmitted(true);
      alert('Thank you! We\'ll keep you updated on the LaunchPad.');

      // Close modal after brief delay
      setTimeout(() => {
        setIsPrintModalOpen(false);
        setEmailSubmitted(false);
        setEmail('');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit email:', error);
      alert('Failed to sign up. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  if (loading) {
    return (
      <PageBackground>
        <div css={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div css={{
            ...tokens.typography.body.large,
            color: colors.onSurfaceVariant,
          }}>
            Loading your results...
          </div>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Set page margins to none - let content padding handle spacing */
          @page {
            margin: 0;
            size: letter;
          }

          /* Remove all margins and padding from body */
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide background and make container full width */
          body, #root {
            background: white !important;
          }

          /* Remove background colors and shadows for print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Ensure sections don't break across pages */
          .print-no-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Add page break before sections if needed */
          .print-section {
            page-break-before: auto;
            page-break-after: auto;
          }

          /* Hide elements that shouldn't print */
          .no-print {
            display: none !important;
          }

          /* Show elements only when printing */
          .print-only {
            display: block !important;
          }

          /* Hide the page background wrapper */
          .print-hide-bg {
            background: transparent !important;
            padding: 0 !important;
            min-height: auto !important;
          }

          /* Make content pane take full width and remove styling */
          .print-content {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <div
        className="print-hide-bg"
        css={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: tokens.spacing[6],
          gap: tokens.spacing[6],
        }}>
        {/* Print Preview Card - Letter Size */}
        <div
          ref={contentRef}
          className="print-content"
          css={{
            width: `${LETTER_WIDTH_PX}px`,
            maxWidth: '100%',
            background: '#ffffff',
            borderRadius: tokens.borderRadius.large,
            padding: tokens.spacing[8],
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Print-only Banner */}
          <div
            className="print-only"
            css={{
              display: 'none',
              marginLeft: `-${tokens.spacing[8]}`,
              marginRight: `-${tokens.spacing[8]}`,
              marginTop: `-${tokens.spacing[8]}`,
              marginBottom: tokens.spacing[6],
              height: '120px',
              backgroundImage: `url(${launchpadBackgroundDark})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              '@media print': {
                display: 'block !important',
              },
            }}
          >
            <img
              src={launchpadDomeLogo}
              alt="LaunchPad Logo"
              css={{
                position: 'absolute',
                right: tokens.spacing[6],
                top: '50%',
                transform: 'translateY(-50%)',
                height: '80px',
                width: 'auto',
              }}
            />
          </div>

          {/* Header */}
          <h1 css={{
            ...tokens.typography.headline.large,
            color: '#000000',
            marginBottom: tokens.spacing[3],
          }}>
            Life & Career Pathways Profile Builder
          </h1>

          {/* Date */}
          <p css={{
            ...tokens.typography.body.medium,
            color: '#666666',
            marginBottom: tokens.spacing[3],
          }}>
            {resultsData?.completed_at ? new Date(resultsData.completed_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* Intro paragraph */}
          <p css={{
            ...tokens.typography.body.large,
            color: '#000000',
            marginBottom: tokens.spacing[8],
            lineHeight: 1.6,
          }}>
            Here's your personalized Life2Launch Pathways Snapshot based on what excites you, your natural strengths, and the global issues you care about. This is your starting point to design a life and career path with purpose and confidence.
          </p>

          {/* Pathway Bar Chart - show at top if available */}
          {resultsData && resultsData.pathway_chart && (
            <div
              className="print-no-break print-section"
              css={{
                marginBottom: tokens.spacing[8],
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}>
              <h2 css={{
                ...tokens.typography.title.large,
                color: '#000000',
                marginBottom: tokens.spacing[3],
              }}>
                What Activities Excite You Most
              </h2>

              <p css={{
                ...tokens.typography.body.medium,
                color: '#000000',
                marginBottom: tokens.spacing[5],
                lineHeight: 1.6,
              }}>
                These reflect how you're naturally motivated to spend your time, energy, and talents. Lean into your top 1–2 pathways—they're powerful clues about what will build confidence, agency, and flow. Use them to guide what skills to build, what opportunities to say yes to, and how to stay inspired.
              </p>

              {/* Bar Chart */}
              <div css={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing[3],
                maxWidth: '400px',
              }}>
                {resultsData.pathway_chart.bars.map((bar) => (
                  <div key={bar.label} css={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: tokens.spacing[3],
                    alignItems: 'center',
                  }}>
                    {/* Label */}
                    <div css={{
                      ...tokens.typography.body.medium,
                      color: '#000000',
                      textAlign: 'right',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                    }}>
                      {bar.label}
                    </div>

                    {/* Bar */}
                    <div css={{
                      borderLeft: '2px solid #e0e0e0',
                      paddingLeft: tokens.spacing[3],
                    }}>
                      <div css={{
                        height: '16px',
                        background: `linear-gradient(to bottom, ${bar.color}, ${bar.color_secondary})`,
                        borderRadius: '4px',
                        width: `${bar.value}%`,
                        minWidth: '2%',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pathway Descriptions */}
              <div css={{
                marginTop: tokens.spacing[5],
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing[2],
              }}>
                {resultsData.pathway_chart.pathways.map((pathway) => (
                  <div key={pathway.pathway}>
                    <h3 css={{
                      ...tokens.typography.title.medium,
                      color: pathway.color,
                      marginBottom: tokens.spacing[1],
                      fontWeight: 700,
                    }}>
                      {pathway.title}
                    </h3>
                    <p css={{
                      ...tokens.typography.body.medium,
                      color: '#000000',
                      lineHeight: 1.5,
                      marginBottom: tokens.spacing[1],
                    }}>
                      {pathway.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions and Answers by Section */}
          {resultsData && resultsData.sections.length > 0 ? (
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[6],
            }}>
              {resultsData.sections
                .filter(section => {
                  const title = section.section_title.toLowerCase();
                  return !title.includes('get to know you') &&
                         !title.includes('what is stressful') &&
                         !title.includes('what activites excite');
                })
                .map((section) => (
                <div
                  key={section.section_id}
                  className="print-no-break print-section"
                  css={{
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}>
                  {/* Section Title */}
                  {section.section_title && (
                    <>
                      <h2 css={{
                        ...tokens.typography.title.large,
                        color: '#000000',
                        marginBottom: tokens.spacing[3],
                        paddingBottom: tokens.spacing[2],
                        borderBottom: '2px solid #e0e0e0',
                      }}>
                        {section.section_title}
                      </h2>

                      {/* Section description based on title */}
                      {section.section_title.toLowerCase().includes('naturally good at') && (
                        <p css={{
                          ...tokens.typography.body.medium,
                          color: '#000000',
                          marginBottom: tokens.spacing[4],
                          lineHeight: 1.6,
                        }}>
                          These capacities aren't always measured in school, but they're central to how you learn, grow, and lead. Knowing your strengths helps you build confidence, make better choices, and launch with purpose.
                        </p>
                      )}

                      {section.section_title.toLowerCase().includes('global issues') && (
                        <p css={{
                          ...tokens.typography.body.medium,
                          color: '#000000',
                          marginBottom: tokens.spacing[4],
                          lineHeight: 1.6,
                        }}>
                          Aligning your work, volunteering, or study with the world's greatest needs creates the conditions for meaningful impact. Let this guide the kind of change you want to be part of.
                        </p>
                      )}
                    </>
                  )}

                  {/* Section Items */}
                  <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing[5],
                  }}>
                    {section.items.map((item) => (
                      <div key={item.question_id}>
                        <h3 css={{
                          ...tokens.typography.title.medium,
                          color: '#000000',
                          marginBottom: tokens.spacing[2],
                        }}>
                          {item.question}
                        </h3>

                        {/* Render answer based on type */}
                        {(item.answer.type === 'multiple_choice' || item.answer.type === 'a_or_b') && item.answer.items && item.answer.items.length > 0 ? (
                          <ul css={{
                            listStyle: 'disc',
                            paddingLeft: tokens.spacing[5],
                            margin: 0,
                          }}>
                            {item.answer.items.map((answerItem) => (
                              <li key={answerItem.id} css={{
                                ...tokens.typography.body.large,
                                color: '#000000',
                                lineHeight: 1.6,
                                marginBottom: tokens.spacing[1],
                              }}>
                                {answerItem.text}
                              </li>
                            ))}
                          </ul>
                        ) : item.answer.text ? (
                          <p css={{
                            ...tokens.typography.body.large,
                            color: '#000000',
                            lineHeight: 1.6,
                          }}>
                            {item.answer.text}
                          </p>
                        ) : (
                          <p css={{
                            ...tokens.typography.body.medium,
                            color: '#666666',
                            fontStyle: 'italic',
                          }}>
                            No response
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p css={{
              ...tokens.typography.body.medium,
              color: '#000000',
              textAlign: 'center',
              padding: tokens.spacing[8],
            }}>
              No responses found
            </p>
          )}

          {/* Next Steps Section */}
          <div
            className="print-no-break print-section"
            css={{
              marginTop: tokens.spacing[8],
              paddingTop: tokens.spacing[6],
              borderTop: '3px solid #e0e0e0',
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            <h2 css={{
              ...tokens.typography.title.large,
              color: '#000000',
              marginBottom: tokens.spacing[4],
            }}>
              Next Steps
            </h2>

            <p css={{
              ...tokens.typography.body.large,
              color: '#000000',
              lineHeight: 1.6,
            }}>
              Your pathway isn't a one-time choice—it's a navigation journey. Explore, test, reflect, and grow. You've just taken the first step toward designing a life driven by purpose, powered by your strengths, and aligned with what you care most about.
            </p>
          </div>
        </div>


        {/* Floating Action Button */}
        <div
          className="no-print"
          css={{
            position: 'fixed',
            bottom: tokens.spacing[6],
            right: tokens.spacing[6],
            zIndex: 100,
          }}>
          <IconButton
            icon="print"
            variant="filled"
            onClick={() => setIsPrintModalOpen(true)}
            title="Print or email results"
            css={{
              width: '56px',
              height: '56px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>

        {/* Print Options Modal */}
        <div className="no-print">
          <Modal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            title="Save Your Results"
            size="medium"
          >
          <div css={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing[6],
          }}>
            {/* Email Signup Section */}
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[4],
            }}>
              <p css={{
                ...tokens.typography.body.large,
                color: colors.onSurface,
                margin: 0,
                lineHeight: 1.5,
              }}>
                The LaunchPad can help you launch with confidence and direction. Sign up to be notified how to access the LaunchPad for free.
              </p>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailSubmitted}
                css={{
                  padding: tokens.spacing[3],
                  borderRadius: tokens.borderRadius.medium,
                  border: `1px solid ${colors.outline}`,
                  ...tokens.typography.body.medium,
                  color: colors.onSurface,
                  backgroundColor: emailSubmitted ? colors.surfaceVariant : colors.surface,
                  '&:focus': {
                    outline: `2px solid ${colors.primary}`,
                    outlineOffset: '1px',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                    opacity: 0.6,
                  },
                }}
              />

              <button
                onClick={handleEmailSubmit}
                disabled={isSubmittingEmail || emailSubmitted}
                css={{
                  padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
                  borderRadius: tokens.borderRadius.medium,
                  border: 'none',
                  backgroundColor: emailSubmitted ? colors.surfaceVariant : colors.primary,
                  color: emailSubmitted ? colors.onSurfaceVariant : colors.onPrimary,
                  ...tokens.typography.label.large,
                  cursor: isSubmittingEmail || emailSubmitted ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: isSubmittingEmail ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: emailSubmitted ? colors.surfaceVariant : colors.primaryContainer,
                  },
                }}
              >
                {isSubmittingEmail ? 'Submitting...' : emailSubmitted ? 'Submitted!' : 'Submit'}
              </button>
            </div>

            {/* Divider */}
            <div css={{
              height: '1px',
              backgroundColor: colors.outline,
            }} />

            {/* Download PDF Section */}
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[3],
            }}>
              <button
                onClick={handleDownloadPDF}
                css={{
                  padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
                  borderRadius: tokens.borderRadius.medium,
                  border: `2px solid ${colors.primary}`,
                  backgroundColor: 'transparent',
                  color: colors.primary,
                  ...tokens.typography.label.large,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: colors.surfaceVariant,
                  },
                }}
              >
                Download as PDF
              </button>
            </div>
          </div>
          </Modal>
        </div>
      </div>
    </PageBackground>
  );
};
