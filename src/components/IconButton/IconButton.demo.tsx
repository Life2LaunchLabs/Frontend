import React, { useState } from 'react';
import { IconButton } from './IconButton';
import { PropSelector, type PropConfig } from '../../../demo/src/PropSelector';
import { useTheme } from '../../theme';

const IconButtonDemo: React.FC = () => {
  const { theme } = useTheme();
  
  const [propValues, setPropValues] = useState({
    variant: 'filled',
    icon: 'add',
    disabled: false,
    toggle: false,
    toggled: false,
  });

  const propConfigs: PropConfig[] = [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'filled',
      description: 'Visual style variant of the icon button',
      options: [
        { label: 'Filled (Primary)', value: 'filled' },
        { label: 'Outlined (Border)', value: 'outlined' },
        { label: 'Standard (Minimal)', value: 'standard' },
        { label: 'Elevated (Shadow)', value: 'elevated' },
        { label: 'Tonal (Secondary)', value: 'tonal' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'add',
      description: 'Material Symbol icon to display',
      options: [
        { label: 'Add', value: 'add' },
        { label: 'Star', value: 'star' },
        { label: 'Favorite', value: 'favorite' },
        { label: 'Delete', value: 'delete' },
        { label: 'Edit', value: 'edit' },
        { label: 'Settings', value: 'settings' },
        { label: 'Share', value: 'share' },
        { label: 'Download', value: 'download' },
        { label: 'Search', value: 'search' },
        { label: 'Home', value: 'home' },
        { label: 'Menu', value: 'menu' },
        { label: 'Close', value: 'close' },
      ],
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
      description: 'Disable button interaction',
    },
    {
      name: 'toggle',
      type: 'boolean',
      defaultValue: false,
      description: 'Enable toggle mode for on/off states',
    },
    {
      name: 'toggled',
      type: 'boolean',
      defaultValue: false,
      description: 'Toggle state (only applies when toggle=true)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
        title="Interactive IconButton Demo"
        description="Experiment with different IconButton props to see how they affect appearance and behavior. IconButtons are perfect for actions without text labels."
        propConfigs={propConfigs}
        values={propValues}
        onChange={handlePropChange}
      >
        {(props) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <IconButton
              variant={props.variant}
              icon={props.icon}
              disabled={props.disabled}
              toggle={props.toggle}
              toggled={props.toggled}
              aria-label={`${props.icon} button`}
            />
            <div style={{ 
              fontSize: '0.9rem', 
              color: theme.onSurfaceVariant,
              textAlign: 'center'
            }}>
              {props.toggle ? (props.toggled ? 'On State' : 'Off State') : 'Standard Button'}
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
          IconButton Variants
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          IconButtons provide 5 distinct variants for different emphasis levels. Unlike regular buttons, 
          they're compact, square, and perfect for toolbar actions and floating action buttons.
        </p>
        
        <div style={gridStyle}>
          {[
            { 
              variant: 'filled' as const, 
              title: 'Filled IconButton',
              description: 'Highest emphasis with solid background. Perfect for primary actions.',
              useCase: 'Primary floating action buttons, main toolbar actions'
            },
            { 
              variant: 'tonal' as const, 
              title: 'Tonal IconButton',
              description: 'Medium-high emphasis with tinted background for secondary actions.',
              useCase: 'Secondary actions, complementary features, related controls'
            },
            { 
              variant: 'outlined' as const, 
              title: 'Outlined IconButton',
              description: 'Medium emphasis with clear boundaries and transparent background.',
              useCase: 'Toggle buttons, selection controls, filter actions'
            },
            { 
              variant: 'standard' as const, 
              title: 'Standard IconButton',
              description: 'Low emphasis with minimal visual weight, transparent background.',
              useCase: 'Toolbar actions, menu items, dismissive actions'
            },
            { 
              variant: 'elevated' as const, 
              title: 'Elevated IconButton',
              description: 'Standard button with subtle shadow for visual separation.',
              useCase: 'Actions on busy backgrounds, floating controls'
            },
          ].map(({ variant, title, description, useCase }) => (
            <div key={variant} style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <IconButton variant={variant} icon="star" aria-label={`${variant} button`} />
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
          Toggle Mode
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          IconButtons support toggle mode for on/off states. Perfect for favorite buttons, bookmark toggles, 
          and other binary state controls.
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
            gap: '2rem',
            justifyContent: 'center'
          }}>
            {[
              { variant: 'filled' as const, icon: 'favorite', label: 'Favorite' },
              { variant: 'outlined' as const, icon: 'bookmark', label: 'Bookmark' },
              { variant: 'standard' as const, icon: 'thumb_up', label: 'Like' },
              { variant: 'tonal' as const, icon: 'star', label: 'Star' },
              { variant: 'elevated' as const, icon: 'notifications', label: 'Notify' },
            ].map(({ variant, icon, label }) => {
              const toggleKey = `toggle-${variant}`;
              const [isToggled, setIsToggled] = useState(false);
              
              return (
                <div key={toggleKey} style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <IconButton 
                      variant={variant} 
                      icon={icon}
                      toggle
                      toggled={isToggled}
                      onToggle={setIsToggled}
                      aria-label={`${label} toggle`}
                    />
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: theme.onSurfaceVariant,
                    fontWeight: '500'
                  }}>
                    {label}
                  </div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: isToggled ? theme.primary : theme.onSurfaceVariant,
                    marginTop: '0.25rem'
                  }}>
                    {isToggled ? 'On' : 'Off'}
                  </div>
                </div>
              );
            })}
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
          Interactive States
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          IconButtons respond to user interactions with consistent state layers across all variants.
        </p>
        
        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: theme.onSurface, marginBottom: '1rem' }}>Enabled States</h3>
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              justifyContent: 'center',
              marginBottom: '1rem' 
            }}>
              <IconButton variant="filled" icon="touch_app" aria-label="Hover me" />
              <IconButton variant="outlined" icon="mouse" aria-label="Focus me" />
              <IconButton variant="standard" icon="ads_click" aria-label="Press me" />
            </div>
            <p style={{ color: theme.onSurfaceVariant, fontSize: '0.9rem', margin: 0 }}>
              Interactive states with hover, focus, and press feedback
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: theme.onSurface, marginBottom: '1rem' }}>Disabled States</h3>
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              justifyContent: 'center',
              marginBottom: '1rem' 
            }}>
              <IconButton variant="filled" icon="block" disabled aria-label="Disabled filled" />
              <IconButton variant="outlined" icon="block" disabled aria-label="Disabled outlined" />
              <IconButton variant="standard" icon="block" disabled aria-label="Disabled standard" />
            </div>
            <p style={{ color: theme.onSurfaceVariant, fontSize: '0.9rem', margin: 0 }}>
              Non-interactive state with reduced opacity
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
          Icon Gallery
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: theme.onSurfaceVariant,
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Common icons used in IconButtons. All icons use Material Symbols for consistency.
        </p>
        
        <div style={{ 
          background: theme.surfaceContainer,
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '1rem',
            justifyItems: 'center'
          }}>
            {[
              { icon: 'add', label: 'Add' },
              { icon: 'edit', label: 'Edit' },
              { icon: 'delete', label: 'Delete' },
              { icon: 'share', label: 'Share' },
              { icon: 'download', label: 'Download' },
              { icon: 'settings', label: 'Settings' },
              { icon: 'search', label: 'Search' },
              { icon: 'menu', label: 'Menu' },
              { icon: 'close', label: 'Close' },
              { icon: 'home', label: 'Home' },
              { icon: 'star', label: 'Star' },
              { icon: 'favorite', label: 'Favorite' },
            ].map(({ icon, label }) => (
              <div key={icon} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <IconButton variant="outlined" icon={icon} aria-label={label} />
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: theme.onSurfaceVariant 
                }}>
                  {label}
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
          Import and use the IconButton component with TypeScript support:
        </p>
        
        <pre style={codeStyle}>
{`import { IconButton } from 'l2l-design-system';

function Toolbar() {
  const [isFavorited, setIsFavorited] = useState(false);
  
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {/* Primary action */}
      <IconButton 
        variant="filled" 
        icon="add" 
        aria-label="Add new item"
      />
      
      {/* Toggle action */}
      <IconButton 
        variant="outlined"
        icon="favorite"
        toggle
        toggled={isFavorited}
        onToggle={setIsFavorited}
        aria-label="Add to favorites"
      />
      
      {/* Secondary actions */}
      <IconButton variant="standard" icon="edit" aria-label="Edit" />
      <IconButton variant="standard" icon="share" aria-label="Share" />
      <IconButton variant="standard" icon="delete" aria-label="Delete" />
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
          IconButton Component Features
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>5 Variants</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Filled, Tonal, Outlined, Standard, and Elevated for different emphasis levels
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Compact Design</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              40x40px square buttons with fully rounded corners and 8px padding
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Toggle Mode</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Built-in toggle functionality for on/off states with visual feedback
            </p>
          </div>
          <div>
            <h4 style={{ color: theme.primary, margin: '0 0 0.5rem 0' }}>Accessibility</h4>
            <p style={{ color: theme.onSurfaceVariant, margin: 0, fontSize: '0.9rem' }}>
              Full keyboard navigation, ARIA labels, and screen reader support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconButtonDemo;