import { ButtonSeverity, ButtonSize, ButtonVariant } from './button.types';

export const BUTTON_BASE =
  'inline-flex items-center justify-center flex-nowrap gap-2 rounded-xs transition-[color,background-color,border-color,box-shadow]';

export const BUTTON_DISABLED =
  'opacity-50 cursor-not-allowed pointer-events-none';

export const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: 'text-xs py-1 px-2 [--icon-size:0.875rem]',
  sm: 'text-sm py-1.5 px-3 [--icon-size:1rem]',
  md: 'text-base py-2 px-4 [--icon-size:1.25rem]',
  lg: 'text-lg py-2.5 px-5 [--icon-size:1.5rem]',
};

const OUTLINED_BASE = 'bg-transparent border';
const ELEVATED_BASE =
  'bg-surface-50 shadow-sm hover:shadow-md active:shadow-xs';
const TEXT_BASE = 'bg-transparent';

export const BUTTON_VARIANT_MAP: Record<
  ButtonSeverity,
  Record<ButtonVariant, string>
> = {
  primary: {
    filled:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
    outlined: `${OUTLINED_BASE} text-primary-600 border-primary-600 hover:bg-primary-50 active:bg-primary-100`,
    text: `${TEXT_BASE} text-primary-600 hover:bg-primary-50 active:bg-primary-100`,
    tonal:
      'bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300',
    elevated: `${ELEVATED_BASE} text-primary-600`,
  },
  secondary: {
    filled:
      'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
    outlined: `${OUTLINED_BASE} text-secondary-600 border-secondary-600 hover:bg-secondary-50 active:bg-secondary-100`,
    text: `${TEXT_BASE} text-secondary-600 hover:bg-secondary-50 active:bg-secondary-100`,
    tonal:
      'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300',
    elevated: `${ELEVATED_BASE} text-secondary-600`,
  },
  success: {
    filled:
      'bg-success-600 text-white hover:bg-success-700 active:bg-success-800',
    outlined: `${OUTLINED_BASE} text-success-600 border-success-600 hover:bg-success-50 active:bg-success-100`,
    text: `${TEXT_BASE} text-success-600 hover:bg-success-50 active:bg-success-100`,
    tonal:
      'bg-success-100 text-success-700 hover:bg-success-200 active:bg-success-300',
    elevated: `${ELEVATED_BASE} text-success-600`,
  },
  info: {
    filled: 'bg-info-600 text-white hover:bg-info-700 active:bg-info-800',
    outlined: `${OUTLINED_BASE} text-info-600 border-info-600 hover:bg-info-50 active:bg-info-100`,
    text: `${TEXT_BASE} text-info-600 hover:bg-info-50 active:bg-info-100`,
    tonal: 'bg-info-100 text-info-700 hover:bg-info-200 active:bg-info-300',
    elevated: `${ELEVATED_BASE} text-info-600`,
  },
  warn: {
    filled: 'bg-warn-600 text-white hover:bg-warn-700 active:bg-warn-800',
    outlined: `${OUTLINED_BASE} text-warn-600 border-warn-600 hover:bg-warn-50 active:bg-warn-100`,
    text: `${TEXT_BASE} text-warn-600 hover:bg-warn-50 active:bg-warn-100`,
    tonal: 'bg-warn-100 text-warn-700 hover:bg-warn-200 active:bg-warn-300',
    elevated: `${ELEVATED_BASE} text-warn-600`,
  },
  danger: {
    filled: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800',
    outlined: `${OUTLINED_BASE} text-danger-600 border-danger-600 hover:bg-danger-50 active:bg-danger-100`,
    text: `${TEXT_BASE} text-danger-600 hover:bg-danger-50 active:bg-danger-100`,
    tonal:
      'bg-danger-100 text-danger-700 hover:bg-danger-200 active:bg-danger-300',
    elevated: `${ELEVATED_BASE} text-danger-600`,
  },
};
