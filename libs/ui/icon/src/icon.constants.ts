import { IconSize } from './icon.types';

export const ICON_SIZE_MAP: Record<IconSize, { size: string; opsz: number }> = {
  xs: { size: '1.25rem', opsz: 20 },
  sm: { size: '1.5rem', opsz: 24 },
  md: { size: '2rem', opsz: 32 },
  lg: { size: '2.5rem', opsz: 40 },
  xl: { size: '3rem', opsz: 48 },
};
