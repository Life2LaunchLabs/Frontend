import { useTheme } from '../../../theme/ThemeContext';
import { CoreLayout } from '../../../layouts';

function DiscoverPage() {
  const { theme, tokens } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: theme.surface,
      color: theme.onSurface,
      padding: tokens.spacing[8],
      paddingBottom: '100px',
      fontFamily: tokens.typography.fontFamily.default.join(', '),
    },
    heading: {
      ...tokens.typography.headline.large,
      color: theme.primary,
      marginBottom: tokens.spacing[8],
    },
    content: {
      ...tokens.typography.body.large,
      color: theme.onSurfaceVariant,
      textAlign: 'center' as const,
    }
  };

  return (
    <CoreLayout>
      <div style={styles.container}>
      <h1 style={styles.heading}>Discover</h1>
        <p style={styles.content}>
          Explore and discover new content!
        </p>
      </div>
    </CoreLayout>
  );
}

export default DiscoverPage;