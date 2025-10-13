import React, { useState } from 'react';
import { useTheme } from '../../../../styles';
import type { QuestItem } from '../../api/types';

export interface MilestoneCalendarProps {
  milestones: QuestItem[];
}

export const MilestoneCalendar: React.FC<MilestoneCalendarProps> = ({ milestones }) => {
  const { colors, tokens } = useTheme();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Create milestone lookup by date
  const milestonesByDate = new Map<string, QuestItem[]>();
  milestones.forEach(milestone => {
    const date = new Date(milestone.finish_date);
    if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
      const day = date.getDate().toString();
      const existing = milestonesByDate.get(day) || [];
      milestonesByDate.set(day, [...existing, milestone]);
    }
  });

  // Navigation handlers
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleMonthYearClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setShowDatePicker(false);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setShowDatePicker(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStyles = () => ({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      minWidth: '280px',
      maxWidth: '320px',
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      height: 'fit-content',
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing[4],
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: colors.onSurface,
      cursor: 'pointer',
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: colors.surfaceContainerHighest,
      },
    },
    monthYearButton: {
      ...tokens.typography.title.medium,
      color: colors.onSurface,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: `${tokens.spacing[2]}px ${tokens.spacing[3]}px`,
      borderRadius: tokens.borderRadius.small,
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: colors.surfaceContainerHighest,
      },
    },
    datePicker: {
      position: 'absolute' as const,
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: colors.surface,
      border: `1px solid ${colors.outline}`,
      borderRadius: tokens.borderRadius.medium,
      padding: tokens.spacing[4],
      boxShadow: tokens.shadows.large,
      zIndex: 10,
      display: 'flex',
      gap: tokens.spacing[4],
    },
    pickerSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[2],
    },
    pickerLabel: {
      ...tokens.typography.label.medium,
      color: colors.onSurface,
      fontWeight: 600,
    },
    pickerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: tokens.spacing[1],
    },
    pickerItem: {
      ...tokens.typography.body.small,
      background: 'none',
      border: 'none',
      color: colors.onSurface,
      cursor: 'pointer',
      padding: tokens.spacing[2],
      borderRadius: tokens.borderRadius.small,
      textAlign: 'center' as const,
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: colors.primaryContainer,
      },
    },
    selectedPickerItem: {
      backgroundColor: colors.primary,
      color: colors.onPrimary,
    },
    dayHeaders: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      marginBottom: '1px',
      backgroundColor: colors.outline,
    },
    dayHeader: {
      ...tokens.typography.label.small,
      color: colors.onSurfaceVariant,
      textAlign: 'center' as const,
      padding: tokens.spacing[2],
      fontWeight: 500,
      backgroundColor: colors.surfaceContainer,
    },
    calendar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      backgroundColor: colors.outline,
    },
    day: {
      position: 'relative' as const,
      minHeight: '40px',
      maxHeight: '40px',
      backgroundColor: colors.surface,
      padding: tokens.spacing[1],
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'background-color 0.2s ease',
      overflow: 'visible',
    },
    dayNumber: {
      ...tokens.typography.body.small,
      color: colors.onSurface,
      alignSelf: 'flex-start',
      marginBottom: 'auto',
      fontWeight: 500,
    },
    todayDay: {
      backgroundColor: colors.primaryContainer,
    },
    todayDayNumber: {
      color: colors.onPrimaryContainer,
      fontWeight: 600,
    },
    emptyDay: {
      opacity: 0,
      pointerEvents: 'none' as const,
    },
    milestoneBadges: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '1px',
      marginTop: 'auto',
      alignSelf: 'flex-end',
      maxWidth: '100%',
    },
    milestoneBadge: {
      width: '8px',
      height: '8px',
      borderRadius: '2px',
      cursor: 'pointer',
      position: 'relative' as const,
      flexShrink: 0,
    },
    badgeTooltip: {
      position: 'fixed' as const,
      backgroundColor: colors.inverseOnSurface,
      color: colors.inverseSurface,
      padding: `${tokens.spacing[1]}px ${tokens.spacing[2]}px`,
      borderRadius: tokens.borderRadius.small,
      ...tokens.typography.body.small,
      whiteSpace: 'nowrap' as const,
      zIndex: 1000,
      pointerEvents: 'none' as const,
      boxShadow: tokens.shadows.large,
      fontSize: '12px',
    },
  });

  const styles = getStyles();

  const MilestoneBadge: React.FC<{ milestone: QuestItem }> = ({ milestone }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (event: React.MouseEvent) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setShowTooltip(true);
    };

    return (
      <div
        style={{
          ...styles.milestoneBadge,
          backgroundColor: milestone.quest_color,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div
            style={{
              ...styles.badgeTooltip,
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {milestone.item_definition.title}
          </div>
        )}
      </div>
    );
  };

  const renderDay = (day: number) => {
    const dayStr = day.toString();
    const milestonesForDay = milestonesByDate.get(dayStr) || [];
    const isToday = day === today && selectedMonth === currentMonth && selectedYear === currentYear;

    return (
      <div
        key={day}
        style={{
          ...styles.day,
          ...(isToday ? styles.todayDay : {}),
        }}
      >
        <span
          style={{
            ...styles.dayNumber,
            ...(isToday ? styles.todayDayNumber : {}),
          }}
        >
          {day}
        </span>
        {milestonesForDay.length > 0 && (
          <div style={styles.milestoneBadges}>
            {milestonesForDay.map((milestone, index) => (
              <MilestoneBadge key={`${milestone.id}-${index}`} milestone={milestone} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{ ...styles.day, ...styles.emptyDay }} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderDay(day));
    }

    return days;
  };

  const renderDatePicker = () => {
    const currentYearRange = selectedYear;
    const years = Array.from({ length: 5 }, (_, i) => currentYearRange - 2 + i);

    return (
      <div style={styles.datePicker}>
        <div style={styles.pickerSection}>
          <div style={styles.pickerLabel}>Month</div>
          <div style={styles.pickerGrid}>
            {monthNames.map((month, index) => (
              <button
                key={month}
                style={{
                  ...styles.pickerItem,
                  ...(index === selectedMonth ? styles.selectedPickerItem : {}),
                }}
                onClick={() => handleMonthChange(index)}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.pickerSection}>
          <div style={styles.pickerLabel}>Year</div>
          <div style={styles.pickerGrid}>
            {years.map(year => (
              <button
                key={year}
                style={{
                  ...styles.pickerItem,
                  ...(year === selectedYear ? styles.selectedPickerItem : {}),
                }}
                onClick={() => handleYearChange(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <button style={styles.navButton} onClick={goToPreviousMonth}>
          ◀
        </button>
        <button style={styles.monthYearButton} onClick={handleMonthYearClick}>
          {monthNames[selectedMonth]} {selectedYear}
        </button>
        <button style={styles.navButton} onClick={goToNextMonth}>
          ▶
        </button>
      </div>

      {showDatePicker && renderDatePicker()}

      <div style={styles.dayHeaders}>
        {dayNames.map(day => (
          <div key={day} style={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      <div style={styles.calendar}>
        {renderCalendarDays()}
      </div>
    </div>
  );
};