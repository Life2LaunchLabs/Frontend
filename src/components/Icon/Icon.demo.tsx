import React, { useState } from 'react';
import { Icon } from './Icon';
import { PropSelector, type PropConfig } from '../../../demo/src/PropSelector';
import { useTheme } from '../../theme';

const IconDemo: React.FC = () => {
  const { theme } = useTheme();
  
  const [propValues, setPropValues] = useState({
    name: 'star',
    typography: 'headline-large',
    active: false,
    color: 'primary',
  });

  const propConfigs: PropConfig[] = [
    {
      name: 'name',
      type: 'select',
      defaultValue: 'star',
      description: 'Material Symbol icon name',
      options: [
        { label: 'Star', value: 'star' },
        { label: 'Favorite', value: 'favorite' },
        { label: 'Home', value: 'home' },
        { label: 'Settings', value: 'settings' },
        { label: 'Search', value: 'search' },
        { label: 'Person', value: 'person' },
        { label: 'Notifications', value: 'notifications' },
        { label: 'Mail', value: 'mail' },
        { label: 'Delete', value: 'delete' },
        { label: 'Edit', value: 'edit' },
        { label: 'Add', value: 'add' },
        { label: 'Remove', value: 'remove' },
        { label: 'Check', value: 'check' },
        { label: 'Close', value: 'close' },
        { label: 'Arrow Back', value: 'arrow_back' },
        { label: 'Arrow Forward', value: 'arrow_forward' },
        { label: 'Download', value: 'download' },
        { label: 'Upload', value: 'upload' },
        { label: 'Share', value: 'share' },
        { label: 'Info', value: 'info' },
      ],
    },
    {
      name: 'typography',
      type: 'select',
      defaultValue: 'headline-large',
      description: 'Typography scale that determines icon size and weight',
      options: [
        { label: 'Display Large (48dp/500)', value: 'display-large' },
        { label: 'Display Medium (48dp/500)', value: 'display-medium' },
        { label: 'Display Small (40dp/400)', value: 'display-small' },
        { label: 'Headline Large (48dp/400)', value: 'headline-large' },
        { label: 'Headline Medium (40dp/400)', value: 'headline-medium' },
        { label: 'Headline Small (40dp/300)', value: 'headline-small' },
        { label: 'Title Large (24dp/400)', value: 'title-large' },
        { label: 'Title Medium (24dp/400)', value: 'title-medium' },
        { label: 'Title Small (20dp/400)', value: 'title-small' },
        { label: 'Label Large (24dp/300)', value: 'label-large' },
        { label: 'Label Medium (20dp/300)', value: 'label-medium' },
        { label: 'Label Small (20dp/300)', value: 'label-small' },
        { label: 'Body Large (24dp/300)', value: 'body-large' },
        { label: 'Body Medium (20dp/300)', value: 'body-medium' },
        { label: 'Body Small (20dp/300)', value: 'body-small' },
      ],
    },
    {
      name: 'active',
      type: 'boolean',
      defaultValue: false,
      description: 'Toggle between outlined and filled icon variants',
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'primary',
      description: 'Theme color to apply to the icon',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Tertiary', value: 'tertiary' },
        { label: 'Surface', value: 'surface' },
        { label: 'Inherit', value: 'inherit' },
      ],
    },
  ];

  const handlePropChange = (propName: string, value: any) => {
    setPropValues(prev => ({ ...prev, [propName]: value }));
  };

  const sectionStyle = {
    margin: '2rem',
    marginTop: '0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    background: theme.surfaceContainer,
    padding: '1.5rem',
    borderRadius: '12px',
    border: `1px solid ${theme.onSurfaceVariant}20`,
    textAlign: 'center' as const,
  };

  const codeStyle = {
    background: theme.surfaceContainerHigh,
    padding: '1rem',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    color: theme.onSurface,
    border: `1px solid ${theme.onSurfaceVariant}20`,
    overflow: 'auto',
  };

  return (
    <div>
      <PropSelector
        title="Interactive Icon Demo"
        description="Experiment with different icon props to see how typography scales, colors, and active states affect the appearance. Icons use Material Symbols with variable font settings."
        propConfigs={propConfigs}
        values={propValues}
        onChange={handlePropChange}
      >
        {(props) => (
          <Icon
            name={props.name}
            typography={props.typography}
            active={props.active}
            color={props.color}
          />
        )}
      </PropSelector>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Typography Scale Integration
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Icons follow the same typography scale as text, ensuring visual harmony and consistent 
          optical sizing. Each typography class maps to specific icon sizes and font weights.
        </p>
        
        <div style={gridStyle}>
          {[
            { scale: 'display-large', size: '48dp', weight: '500', description: 'Largest icons for major visual elements' },
            { scale: 'headline-medium', size: '40dp', weight: '400', description: 'Large icons for section headers' },
            { scale: 'title-large', size: '24dp', weight: '400', description: 'Medium icons for UI elements' },
            { scale: 'label-medium', size: '20dp', weight: '300', description: 'Small icons for labels and compact UI' },
          ].map(({ scale, size, weight, description }) => (
            <div key={scale} style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <Icon 
                  name="star" 
                  typography={scale as any}
                  color="primary"
                />
              </div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: theme.onSurface,
                textTransform: 'capitalize'
              }}>
                {scale.replace('-', ' ')}
              </h3>
              <div style={{ 
                fontSize: '0.8rem', 
                color: theme.onSurfaceVariant,
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                {size} / {weight}
              </div>
              <p style={{ 
                fontSize: '0.85rem', 
                color: theme.onSurfaceVariant,
                margin: 0,
                lineHeight: '1.4'
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Active States
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Icons support both outlined (default) and filled (active) variants using Material Symbols' 
          variable font capabilities. This creates consistent icon states for interactive elements.
        </p>
        
        <div style={{ 
          background: theme.surfaceContainer,
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.onSurface
              }}>
                Outlined (Default)
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <Icon name="favorite" typography="headline-large" active={false} color="primary" />
                <Icon name="star" typography="title-large" active={false} color="secondary" />
                <Icon name="home" typography="label-large" active={false} color="tertiary" />
              </div>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.onSurface
              }}>
                Filled (Active)
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <Icon name="favorite" typography="headline-large" active={true} color="primary" />
                <Icon name="star" typography="title-large" active={true} color="secondary" />
                <Icon name="home" typography="label-large" active={true} color="tertiary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Theme Color Integration
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Icons automatically adapt to the current theme and can use semantic color roles 
          for consistent theming across light and dark modes.
        </p>
        
        <div style={gridStyle}>
          {[
            { color: 'primary' as const, description: 'Main brand color for important icons' },
            { color: 'secondary' as const, description: 'Secondary brand color for supporting icons' },
            { color: 'tertiary' as const, description: 'Accent color for decorative icons' },
            { color: 'surface' as const, description: 'Surface color for text-related icons' },
          ].map(({ color, description }) => (
            <div key={color} style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <Icon 
                  name="palette" 
                  typography="headline-medium"
                  color={color}
                />
              </div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: theme.onSurface,
                textTransform: 'capitalize'
              }}>
                {color}
              </h3>
              <p style={{ 
                fontSize: '0.85rem', 
                color: theme.onSurfaceVariant,
                margin: 0,
                lineHeight: '1.4'
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Popular Material Symbols
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          A selection of commonly used Material Symbols that work well across different contexts 
          and interface patterns.
        </p>
        
        <div style={{ 
          background: theme.surfaceContainer,
          padding: '2rem',
          borderRadius: '12px'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            {[
              'home', 'star', 'favorite', 'settings', 'search', 'person',
              'notifications', 'mail', 'add', 'remove', 'edit', 'delete',
              'check', 'close', 'info', 'warning', 'error', 'help',
              'download', 'upload', 'share', 'copy', 'save', 'print'
            ].map((iconName) => (
              <div key={iconName} style={{ 
                padding: '1rem',
                borderRadius: '8px',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surfaceContainerHigh;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}>
                <Icon 
                  name={iconName} 
                  typography="title-large"
                  color="primary"
                />
                <div style={{ 
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  color: theme.onSurfaceVariant,
                  fontFamily: 'monospace'
                }}>
                  {iconName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Usage Example
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '1rem',
          lineHeight: '1.6'
        }}>
          Import and use the Icon component with TypeScript support:
        </p>
        
        <pre style={codeStyle}>
{`import { Icon } from 'l2l-design-system';

function MyComponent() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div>
      {/* Basic icon */}
      <Icon name="home" typography="title-large" />
      
      {/* Colored icon */}
      <Icon 
        name="star" 
        typography="headline-medium" 
        color="primary" 
      />
      
      {/* Interactive icon with state */}
      <Icon 
        name="favorite" 
        typography="title-medium"
        active={isFavorite}
        color="secondary"
        onClick={() => setIsFavorite(!isFavorite)}
      />
      
      {/* Small label icon */}
      <Icon 
        name="info" 
        typography="label-small" 
        color="surface" 
      />
    </div>
  );
}`}
        </pre>
      </div>

      <div style={{ 
        ...sectionStyle,
        background: theme.surfaceContainerLow,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${theme.onSurfaceVariant}10`
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600',
          marginBottom: '1rem',
          color: theme.onSurface
        }}>
          Icon Component Features
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Typography Integration</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              15 typography scales with matching icon sizes and optical weights
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Material Symbols</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Variable font technology with filled/outlined variants
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Theme Colors</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Semantic color roles that adapt to light/dark themes
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Active States</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Toggle between outlined and filled variants for interactive feedback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconDemo;