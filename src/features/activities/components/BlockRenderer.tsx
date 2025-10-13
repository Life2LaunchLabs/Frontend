import React from 'react';
import { useTheme } from '../../../styles';
import { Block, MediaAsset } from '../types';
import { TextBlock, MediaBlock, QuestionBlock } from './blocks';

export interface BlockRendererProps {
  block: Block;
  media: MediaAsset[];
  onResponseChange?: (questionId: string, value: any) => void;
  responses?: Record<string, any>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  media,
  onResponseChange,
  responses = {}
}) => {
  const { colors, tokens } = useTheme();

  const getContainerStyle = () => ({
    marginBottom: tokens.spacing[4],
  });

  const renderBlock = () => {
    switch (block.block_type) {
      case 'text':
  return <TextBlock config={block.config as any} />;

case 'media':
  return <MediaBlock config={block.config as any} media={media} />;

case 'question':
case 'text_input':
case 'multiple_choice':
case 'dropdown_input':
case 'a_or_b_input':
  return (
    <QuestionBlock
      config={block.config as any}
      onResponseChange={onResponseChange}
      initialValue={responses?.[(block.config as any)?.question_id]}
    />
  );

  case 'divider':
    return (
      <hr style={{
        border: 'none',
        height: '1px',
        backgroundColor: colors.outline,
        margin: `${tokens.spacing[6]}px 0`,
      }} />
    );

  default:
    return (
      <div style={{
        padding: tokens.spacing[4],
        backgroundColor: colors.error || '#ffebee',
        color: colors.onError || '#c62828',
        borderRadius: tokens.borderRadius.medium,
        textAlign: 'center',
        ...tokens.typography.body.medium
      }}>
        Unsupported block type: {block.block_type}
      </div>
    );
    }
  };

  return (
    <div style={getContainerStyle()}>
      {renderBlock()}
    </div>
  );
};