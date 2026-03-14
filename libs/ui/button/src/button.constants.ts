import { ButtonSize } from './button.types';

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center flex-nowrap gap-2 cursor-pointer bg-primary-500 rounded-xs';

export const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: 'text-xs py-1 px-2',
  sm: 'text-sm py-1.5 px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-5',
};
