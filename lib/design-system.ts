// lib/design-system.ts - Sistema de diseño centralizado TruekLand
export const colors = {
  // Colores principales de la marca
  amarillo: '#FFF833',        // Promociones, íconos de "nuevo"
  turquesa: '#00D8E8',        // Botones primarios
  grisClaro: '#F6F7F9',       // Fondo principal
  azulClaro: '#E1F5F8',       // Tarjetas de objetos/intercambios
  verdeMenta: '#B2DFDB',      // Fondos de éxito, estado "intercambiado"
  grisOscuro: '#333333',      // Texto principal
  azulOscuro: '#005C5C',      // Texto secundario, íconos
  naranjaCorel: '#FF7A59',    // Botones secundarios
  rojoSuave: '#FF3B30',       // Alertas, errores
  
  // Variaciones y transparencias
  amarilloLight: '#FFF833CC',
  turquesaLight: '#00D8E8CC',
  verdeMentaLight: '#B2DFDBCC',
  
  // Estados
  success: '#B2DFDB',
  warning: '#FFF833',
  error: '#FF3B30',
  info: '#00D8E8',
  
  // Grises adicionales
  gris100: '#F8F9FA',
  gris200: '#E9ECEF',
  gris300: '#DEE2E6',
  gris400: '#CED4DA',
  gris500: '#6C757D',
  gris600: '#495057',
  
  // Blancos y negros
  white: '#FFFFFF',
  black: '#000000',
} as const

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.turquesa} 0%, ${colors.azulOscuro} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.amarillo} 0%, ${colors.naranjaCorel} 100%)`,
  success: `linear-gradient(135deg, ${colors.verdeMenta} 0%, ${colors.turquesa} 100%)`,
  card: `linear-gradient(135deg, ${colors.white} 0%, ${colors.azulClaro} 100%)`,
  hero: `linear-gradient(135deg, ${colors.grisClaro} 0%, ${colors.azulClaro} 50%, ${colors.verdeMenta} 100%)`,
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
  
  // Sombras específicas por color
  turquesa: `0 4px 14px 0 ${colors.turquesa}40`,
  amarillo: `0 4px 14px 0 ${colors.amarillo}40`,
  naranja: `0 4px 14px 0 ${colors.naranjaCorel}40`,
} as const

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const

// Utilidades para clases CSS
export const getColorClass = (color: keyof typeof colors, type: 'bg' | 'text' | 'border' = 'bg') => {
  const colorValue = colors[color]
  switch (type) {
    case 'bg': return `bg-[${colorValue}]`
    case 'text': return `text-[${colorValue}]`
    case 'border': return `border-[${colorValue}]`
    default: return `bg-[${colorValue}]`
  }
}

export const getGradientClass = (_gradient: keyof typeof gradients) => {
  return `bg-gradient-to-br from-transparent to-transparent` // Placeholder for Tailwind
}

// Tema para componentes específicos
export const componentThemes = {
  button: {
    primary: {
      bg: colors.turquesa,
      hover: colors.azulOscuro,
      text: colors.white,
      shadow: shadows.turquesa,
    },
    secondary: {
      bg: colors.naranjaCorel,
      hover: '#E6694A',
      text: colors.white,
      shadow: shadows.naranja,
    },
    warning: {
      bg: colors.amarillo,
      hover: '#E6E02E',
      text: colors.grisOscuro,
      shadow: shadows.amarillo,
    },
    success: {
      bg: colors.verdeMenta,
      hover: '#9FD3CE',
      text: colors.azulOscuro,
      shadow: shadows.md,
    },
    danger: {
      bg: colors.rojoSuave,
      hover: '#E6342A',
      text: colors.white,
      shadow: shadows.md,
    },
  },
  card: {
    default: {
      bg: colors.white,
      border: colors.gris200,
      shadow: shadows.md,
    },
    highlighted: {
      bg: colors.azulClaro,
      border: colors.turquesa,
      shadow: shadows.lg,
    },
    success: {
      bg: colors.verdeMenta,
      border: colors.turquesa,
      shadow: shadows.lg,
    },
  },
  input: {
    default: {
      bg: colors.white,
      border: colors.gris300,
      focus: colors.turquesa,
      text: colors.grisOscuro,
    },
    error: {
      bg: colors.white,
      border: colors.rojoSuave,
      focus: colors.rojoSuave,
      text: colors.grisOscuro,
    },
  },
  badge: {
    new: {
      bg: colors.amarillo,
      text: colors.grisOscuro,
    },
    exchanged: {
      bg: colors.verdeMenta,
      text: colors.azulOscuro,
    },
    pending: {
      bg: colors.azulClaro,
      text: colors.azulOscuro,
    },
    error: {
      bg: colors.rojoSuave,
      text: colors.white,
    },
  },
} as const

const designSystem = {
  colors,
  gradients,
  shadows,
  spacing,
  borderRadius,
  typography,
  componentThemes,
  getColorClass,
  getGradientClass,
}

export default designSystem
