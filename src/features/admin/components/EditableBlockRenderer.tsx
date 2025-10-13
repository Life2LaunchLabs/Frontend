import React from 'react';
import { useTheme } from '../../../styles';
import { Block, MediaAsset } from '../../activities/types';
import { EditableTextBlock } from './EditableTextBlock';
import { EditableMediaBlock } from './EditableMediaBlock';
import { EditableTextInputBlock } from './EditableTextInputBlock';
import { EditableMultipleChoiceBlock } from './EditableMultipleChoiceBlock';

export interface EditableBlockRendererProps {
  block: Block;
  media: MediaAsset[];
  onChange: (updatedBlock: Block) => void;
}

export const EditableBlockRenderer: React.FC<EditableBlockRendererProps> = ({
  block,
  media,
  onChange
}) => {
  const { colors, tokens } = useTheme();

  const getContainerStyle = () => ({
    marginBottom: tokens.spacing[4],
  });

  const handleConfigChange = (newConfig: any) => {
    const updatedBlock = {
      ...block,
      config: newConfig
    };
    onChange(updatedBlock);
  };

  const renderBlock = () => {
    switch (block.block_type) {
      case 'text':
        return (
          <EditableTextBlock
            config={block.config as any}
            onChange={handleConfigChange}
          />
        );

      case 'media':
        // Use editable media block for upload/select functionality
        return (
          <EditableMediaBlock
            config={block.config as any}
            onChange={handleConfigChange}
          />
        );

      case 'text_input':
        return (
          <EditableTextInputBlock
            config={block.config as any}
            onChange={handleConfigChange}
          />
        );

      case 'multiple_choice':
        return (
          <EditableMultipleChoiceBlock
            config={block.config as any}
            onChange={handleConfigChange}
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
            backgroundColor: colors.errorContainer,
            color: colors.onErrorContainer,
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