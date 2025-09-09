import React, { useState } from 'react';
import { Button } from './Button';
import { PropSelector, type PropConfig } from '../../../demo/src/PropSelector';
import { useTheme } from '../../theme';

const ButtonDemo: React.FC = () => {
  const { theme } = useTheme();
  const [clickCount, setClickCount] = useState(0);
  
  const [propValues, setPropValues] = useState({
    variant: 'filled',
    icon: 'add',
    disabled: false,
    children: 'Button Text',
  });

  const propConfigs: PropConfig[] = [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'filled',
      description: 'Button visual style and emphasis level',
      options: [
        { label: 'Filled (Primary)', value: 'filled' },
        { label: 'Tonal (Secondary)', value: 'tonal' },
        { label: 'Outlined (Alternative)', value: 'outlined' },
        { label: 'Text (Low emphasis)', value: 'text' },
        { label: 'Elevated (Text with shadow)', value: 'elevated' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'add',
      description: 'Material Symbol icon (or false for no icon)',
      options: [
        { label: 'Add', value: 'add' },
        { label: 'Star', value: 'star' },
        { label: 'Favorite', value: 'favorite' },
        { label: 'Download', value: 'download' },
        { label: 'Settings', value: 'settings' },
        { label: 'Share', value: 'share' },
        { label: 'Delete', value: 'delete' },
        { label: 'Edit', value: 'edit' },
        { label: 'Search', value: 'search' },
        { label: 'No Icon', value: false },
      ],
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
      description: 'Disable button interaction',
    },
    {
      name: 'children',
      type: 'string',
      defaultValue: 'Button Text',
      description: 'Button label text',
    },
  ];

  const handlePropChange = (propName: string, value: any) => {
    setPropValues(prev => ({ ...prev, [propName]: value }));
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  const sectionStyle = {
    margin: '2rem',
    marginTop: '0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    background: theme.surfaceContainer,
    padding: '1.5rem',
    borderRadius: '12px',
    border: `1px solid ${theme.onSurfaceVariant}20`,
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
        title="Interactive Button Demo"
        description="Experiment with different button props to see how they affect appearance and behavior. The button maintains click count to demonstrate functionality."
        propConfigs={propConfigs}
        values={propValues}
        onChange={handlePropChange}
      >
        {(props) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant={props.variant}
              icon={props.icon}
              disabled={props.disabled}
              onClick={handleClick}
            >
              {props.children}
            </Button>
            <div style={{ 
              fontSize: '0.9rem', 
              color: theme.onSurfaceVariant,
              textAlign: 'center'
            }}>
              Clicked {clickCount} times
            </div>
          </div>
        )}
      </PropSelector>

      <div style={sectionStyle}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: theme.onSurface
        }}>
          Button Variants
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          The Button component provides 5 distinct variants, each serving different emphasis levels 
          in your interface hierarchy. Choose the right variant based on the action's importance.
        </p>
        
        <div style={gridStyle}>
          {[
            { 
              variant: 'filled' as const, 
              title: 'Filled Button',
              description: 'Highest emphasis for primary actions. Uses theme.primary background with theme.onPrimary text.',
              useCase: 'Call-to-action buttons, form submissions, primary navigation'
            },
            { 
              variant: 'tonal' as const, 
              title: 'Tonal Button',
              description: 'Medium-high emphasis for important secondary actions. Uses theme.secondaryContainer background.',
              useCase: 'Secondary actions, alternative choices, complementary features'
            },
            { 
              variant: 'outlined' as const, 
              title: 'Outlined Button',
              description: 'Medium emphasis with clear boundaries. Transparent background with border.',
              useCase: 'Secondary actions, dialog actions (Cancel), filter toggles'
            },
            { 
              variant: 'text' as const, 
              title: 'Text Button',
              description: 'Lowest emphasis for subtle actions. Minimal visual weight.',
              useCase: 'Tertiary actions, navigation links, dismissive actions'
            },
            { 
              variant: 'elevated' as const, 
              title: 'Elevated Button',
              description: 'Text button with subtle shadow for visual separation.',
              useCase: 'Actions on busy backgrounds, floating action alternatives'
            },
          ].map(({ variant, title, description, useCase }) => (
            <div key={variant} style={cardStyle}>
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <Button variant={variant} icon="star">
                  {title.replace(' Button', '')}
                </Button>
              </div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: theme.onSurface
              }}>
                {title}
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: theme.onSurfaceVariant,
                marginBottom: '1rem',
                lineHeight: '1.4'
              }}>
                {description}
              </p>
              <div style={{ 
                fontSize: '0.8rem', 
                color: theme.primary,
                fontWeight: '500'
              }}>
                Use cases: {useCase}
              </div>
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
          Interactive States
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Buttons respond to user interactions with subtle state changes. Hover, focus, and press 
          states use opacity-based state layers for consistent feedback across all variants.
        </p>
        
        <div style={{ 
          background: theme.surfaceContainer,
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <Button variant="filled" icon="touch_app">Hover me</Button>
            <Button variant="outlined" icon="mouse">Focus me</Button>
            <Button variant="text" icon="ads_click">Press me</Button>
            <Button variant="elevated" icon="pan_tool">Try me</Button>
            <Button variant="tonal" icon="gesture">Click me</Button>
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: theme.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            <strong>State Layers:</strong> Enabled (0%), Hover (10%), Focus (12%), Press (12%), Disabled (varies)
          </div>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: theme.onSurface, marginBottom: '1rem' }}>Enabled State</h3>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <Button variant="filled" icon="check_circle">Ready</Button>
            </div>
            <p style={{ color: theme.onSurfaceVariant, fontSize: '0.9rem', margin: 0 }}>
              Default interactive state with no opacity overlay
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: theme.onSurface, marginBottom: '1rem' }}>Disabled State</h3>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <Button variant="filled" icon="block" disabled>Disabled</Button>
            </div>
            <p style={{ color: theme.onSurfaceVariant, fontSize: '0.9rem', margin: 0 }}>
              Non-interactive state with reduced opacity and muted colors
            </p>
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
          Icon Integration
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Buttons seamlessly integrate Material Symbols with consistent spacing and sizing. 
          Icons enhance button meaning and improve usability.
        </p>
        
        <div style={{ 
          background: theme.surfaceContainer,
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Button icon="download">Download</Button>
            <Button variant="outlined" icon="share">Share</Button>
            <Button variant="text" icon="edit">Edit</Button>
            <Button variant="tonal" icon="delete">Delete</Button>
            <Button variant="elevated" icon="settings">Settings</Button>
            <Button icon={false}>No Icon</Button>
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
          Import and use the Button component with TypeScript support:
        </p>
        
        <pre style={codeStyle}>
{`import { Button } from 'l2l-design-system';

function MyComponent() {
  const handleSave = () => {
    // Save logic here
  };

  return (
    <div>
      {/* Primary action */}
      <Button variant="filled" icon="save" onClick={handleSave}>
        Save Changes
      </Button>
      
      {/* Secondary action */}
      <Button variant="outlined" icon="cancel">
        Cancel
      </Button>
      
      {/* Tertiary action */}
      <Button variant="text" icon="help">
        Need Help?
      </Button>
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
          Button Component Features
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>5 Variants</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Filled, Tonal, Outlined, Text, and Elevated for different emphasis levels
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>5 States</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Enabled, Hovered, Focused, Pressed, and Disabled with proper opacity layers
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Material Icons</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Optional Material Symbols with proper spacing (default: 'add')
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Theme Integration</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Automatically adapts to light/dark themes with proper contrast ratios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;