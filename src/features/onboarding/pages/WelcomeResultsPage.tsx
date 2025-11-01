/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingFlow } from '../hooks/useOnboardingFlow';
import { PageBackground } from '@shared/components';
import { useTheme } from '@/styles/providers/hooks';
import { apiClient } from '@/lib/api';
import { IconButton } from '@/shared/components/IconButton';
import { Modal } from '@/shared/components/Modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  insights: any[];
  recommendations: any[];
}

/**
 * Welcome Results Page - displayed after completing the onboarding flow
 * Shows pathway assessment results in a printable format
 */
export const WelcomeResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { flowState } = useOnboardingFlow();
  const { colors, tokens } = useTheme();
  const [resultsData, setResultsData] = useState<ProcessedResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // US Letter size: 8.5" x 11" at 96 DPI = 816px width
  const LETTER_WIDTH_PX = 816;

  useEffect(() => {
    const fetchPathwayResults = async () => {
      // Wait for flow state to be available
      if (!flowState) {
        console.log('Waiting for flow state...');
        return;
      }

      console.log('Flow state:', flowState);
      console.log('Attempt IDs:', flowState.attempt_ids);

      if (!flowState.attempt_ids?.pathways) {
        console.error('No pathways attempt ID found in flow state');
        console.error('Available attempt IDs:', Object.keys(flowState.attempt_ids || {}));
        setLoading(false);
        return;
      }

      try {
        const attemptId = flowState.attempt_ids.pathways;
        console.log('Fetching processed results for attempt:', attemptId);
        const response = await apiClient.get<ProcessedResultsResponse>(
          `/api/public/attempts/${attemptId}/results/`
        );
        console.log('Processed results:', response.data);
        setResultsData(response.data);
      } catch (error) {
        console.error('Failed to fetch pathway results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPathwayResults();
  }, [flowState]);

  const handleCreateAccount = () => {
    navigate('/register?flow_complete=true');
  };

  const handleExplore = () => {
    navigate('/');
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;

    try {
      // Capture the content as canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // US Letter dimensions in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });

      // Calculate dimensions to fit the content
      const imgWidth = 215.9; // Letter width in mm (8.5 inches)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = await generatePDF();
      if (pdf) {
        pdf.save('pathway-results.pdf');
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleEmailResults = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    // TODO: Implement email functionality
    console.log('Email results to:', email);
    console.log('Subscribe to updates:', subscribeToUpdates);
    alert('Email functionality will be implemented soon!');
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
      <div css={{
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
          css={{
            width: `${LETTER_WIDTH_PX}px`,
            maxWidth: '100%',
            background: '#ffffff',
            borderRadius: tokens.borderRadius.large,
            padding: tokens.spacing[8],
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Header */}
          <h1 css={{
            ...tokens.typography.headline.large,
            color: '#000000',
            marginBottom: tokens.spacing[2],
          }}>
            Your Pathway
          </h1>

          <p css={{
            ...tokens.typography.body.medium,
            color: '#000000',
            marginBottom: tokens.spacing[6],
          }}>
            Results from your Career Pathways Assessment
          </p>

          {/* Questions and Answers by Section */}
          {resultsData && resultsData.sections.length > 0 ? (
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[6],
            }}>
              {resultsData.sections.map((section, sectionIndex) => (
                <div key={section.section_id}>
                  {/* Section Title */}
                  {section.section_title && (
                    <h2 css={{
                      ...tokens.typography.title.large,
                      color: '#000000',
                      marginBottom: tokens.spacing[4],
                      paddingBottom: tokens.spacing[2],
                      borderBottom: '2px solid #e0e0e0',
                    }}>
                      {section.section_title}
                    </h2>
                  )}

                  {/* Section Items */}
                  <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing[5],
                  }}>
                    {section.items.map((item, itemIndex) => (
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
        </div>

        {/* Action Buttons */}
        <div css={{
          width: `${LETTER_WIDTH_PX}px`,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[3],
        }}>
          <button
            onClick={handleCreateAccount}
            css={{
              width: '100%',
              padding: tokens.spacing[4],
              ...tokens.typography.label.large,
              color: colors.onPrimary,
              background: colors.primary,
              border: 'none',
              borderRadius: tokens.borderRadius.medium,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            Create Your Account →
          </button>

          <button
            onClick={handleExplore}
            css={{
              width: '100%',
              padding: tokens.spacing[4],
              ...tokens.typography.label.large,
              color: colors.primary,
              background: colors.surface,
              border: `2px solid ${colors.primary}`,
              borderRadius: tokens.borderRadius.medium,
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': {
                background: colors.surfaceVariant,
              }
            }}
          >
            Continue Exploring
          </button>

          <p css={{
            ...tokens.typography.body.small,
            color: colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: tokens.spacing[2],
          }}>
            Create an account to save your progress and unlock personalized recommendations.
          </p>
        </div>

        {/* Floating Action Button */}
        <div css={{
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
            {/* Email Section */}
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[4],
            }}>
              <h3 css={{
                ...tokens.typography.title.medium,
                color: colors.onSurface,
                margin: 0,
              }}>
                Email Results
              </h3>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                css={{
                  padding: tokens.spacing[3],
                  borderRadius: tokens.borderRadius.medium,
                  border: `1px solid ${colors.outline}`,
                  ...tokens.typography.body.medium,
                  color: colors.onSurface,
                  backgroundColor: colors.surface,
                  '&:focus': {
                    outline: `2px solid ${colors.primary}`,
                    outlineOffset: '1px',
                  },
                }}
              />

              <label css={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing[2],
                cursor: 'pointer',
                ...tokens.typography.body.medium,
                color: colors.onSurface,
              }}>
                <input
                  type="checkbox"
                  checked={subscribeToUpdates}
                  onChange={(e) => setSubscribeToUpdates(e.target.checked)}
                  css={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                />
                Let me know about future updates to the launchpad! (We promise not to spam you)
              </label>

              <button
                onClick={handleEmailResults}
                css={{
                  padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
                  borderRadius: tokens.borderRadius.medium,
                  border: 'none',
                  backgroundColor: colors.primary,
                  color: colors.onPrimary,
                  ...tokens.typography.label.large,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: colors.primaryContainer,
                  },
                }}
              >
                Send
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
    </PageBackground>
  );
};
