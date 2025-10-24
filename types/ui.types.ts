// Comprehensive type definitions for UI components

import { ReactNode } from "react";

// ScrollAnimations types
export interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export interface SlideInOnScrollProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export interface ParallaxContainerProps {
  children: ReactNode;
  offset?: number;
}

export interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export interface FloatingElementProps {
  children: ReactNode;
  intensity?: number;
  duration?: number;
}

export interface MagneticElementProps {
  children: ReactNode;
  strength?: number;
}

export interface EnhancedRevealTextProps {
  text: string;
  className?: string;
}

// StatusAnimations types
export interface StatusIndicatorProps {
  status: "loading" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export interface ProgressBarProps {
  progress: number;
  status?: "active" | "success" | "error" | "warning";
  animated?: boolean;
  className?: string;
}

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export interface SuccessCheckmarkProps {
  size?: number;
  color?: string;
}

export interface ErrorCrossProps {
  size?: number;
  color?: string;
}

export interface WarningIconProps {
  size?: number;
  color?: string;
}

export interface FormFieldAnimationProps {
  children: ReactNode;
  delay?: number;
}

export interface StatusCardProps {
  children: ReactNode;
  status: "idle" | "loading" | "success" | "error";
  className?: string;
}

// MobileGestures types
export interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

export interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => void | Promise<void>;
  threshold?: number;
  className?: string;
}

export interface LongPressButtonProps {
  children: ReactNode;
  onLongPress?: () => void;
  duration?: number;
  className?: string;
}

export interface PinchZoomProps {
  children: ReactNode;
  className?: string;
}

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: "bottom" | "top" | "left" | "right";
  className?: string;
}

// AddressManager types
export interface Address {
  id: number;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
}

export interface AddressFormProps {
  address?: Address | null;
  onSave: (address: Address) => void;
  onCancel: () => void;
}

// ReviewSection types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface ReviewSectionProps {
  productId: string;
  reviews?: Review[];
}
