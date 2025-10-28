// Surface components (new design system)
export * from './surfaces';

// Layout components (new design system)
export * from './layout';

// Feedback components
export { ProgressBar } from './feedback/ProgressBar';

// Legacy components (to be refactored)
export { Button, NavButton } from './Button';
export {Carousel, CarouselCard} from './Carousel';
export { Icon } from './Icon';
export { IconButton } from './IconButton';
export { Chip } from './Chip';
export { BottomNavigation } from './BottomNav';
export { ConnectionStatus } from './ConnectionStatus';
export { Toast, ToastProvider, useToast } from './Toast';
export { FolderCard } from './FolderCard';
export { FolderTab } from './FolderTab';
export { FolderTabNav } from './FolderTabNav';
export { FolderLayout } from './FolderLayout';
export { DailyUpdate } from './DailyUpdate';
export { Modal } from './Modal';

// Export types
export type { ProgressBarProps } from './feedback/ProgressBar';
export type { ButtonProps, NavButtonProps } from './Button';
export type {CarouselProps, CarouselHandle, CarouselCardProps} from './Carousel';
export type { IconProps, MappedIconName } from './Icon';
export type { IconButtonProps } from './IconButton';
export type { ChipProps } from './Chip';
export type { ToastProps } from './Toast';
export type { FolderCardProps } from './FolderCard';
export type { FolderTabProps } from './FolderTab';
export type { FolderTabNavProps, TabItem } from './FolderTabNav';
export type { FolderLayoutProps } from './FolderLayout';
export type { DailyUpdateProps } from './DailyUpdate';
export type { ModalProps, ModalAction } from './Modal';