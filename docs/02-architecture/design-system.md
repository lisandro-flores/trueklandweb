# 🎨 Sistema de Diseño

## Paleta de Colores

### Tema Oscuro (Principal)

```css
/* Fondos - Navy Blue Gradient */
--bg-primary: #0A1628      /* Background principal */
--bg-secondary: #112240    /* Cards y contenedores */
--bg-tertiary: #1A2F4F     /* Botones secundarios */
--bg-borders: #233554      /* Bordes */

/* Textos - High Contrast */
--text-primary: #E6F1FF    /* Texto principal (21:1 contrast) */
--text-secondary: rgba(230, 241, 255, 0.7)  /* Texto secundario */
--text-tertiary: rgba(230, 241, 255, 0.5)   /* Texto terciario */

/* Brand Colors */
--brand-green: #91f2b3     /* Verde menta */
--brand-yellow: #fcf326    /* Amarillo lima */
--brand-gradient: linear-gradient(to right, #91f2b3, #fcf326)

/* Estados */
--success: #91f2b3         /* Éxito/Aceptado */
--warning: #fcf326         /* Pendiente/Advertencia */
--error: #EF4444           /* Error/Rechazado */
--info: #3B82F6            /* Información */
```

## Componentes Base

### Botones

#### Primario (Gradient)
```tsx
<Button className="bg-gradient-to-r from-[#91f2b3] to-[#fcf326] hover:from-[#7fd89f] hover:to-[#e8e01f] text-[#0A1628] font-semibold shadow-lg shadow-[#91f2b3]/20">
  Acción Principal
</Button>
```

#### Secundario (Outline)
```tsx
<Button className="bg-[#1A2F4F] border-2 border-[#233554] text-[#E6F1FF] hover:bg-[#233554] hover:border-[#91f2b3] hover:text-[#91f2b3] transition-all">
  Acción Secundaria
</Button>
```

#### Destructivo
```tsx
<Button className="bg-[#EF4444]/90 border-2 border-[#EF4444] text-white hover:bg-[#EF4444]">
  Eliminar
</Button>
```

### Cards

```tsx
<Card className="bg-[#112240]/95 backdrop-blur-md border-2 border-[#233554]">
  <CardHeader>
    <CardTitle className="bg-gradient-to-r from-[#91f2b3] via-[#fcf326] to-[#91f2b3] bg-clip-text text-transparent">
      Título
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

### Inputs

```tsx
<Input
  className="h-12 bg-[#0A1628] border-2 border-[#233554] text-[#E6F1FF] placeholder:text-[#E6F1FF]/50 focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20"
  placeholder="Escribe aquí..."
/>
```

### Badges

```tsx
{/* Estado Pendiente */}
<Badge className="bg-[#fcf326]/20 text-[#fcf326] border-2 border-[#fcf326]/30">
  Pendiente
</Badge>

{/* Estado Exitoso */}
<Badge className="bg-[#91f2b3]/20 text-[#91f2b3] border-2 border-[#91f2b3]/30">
  Aceptado
</Badge>

{/* Estado Error */}
<Badge className="bg-[#EF4444]/20 text-[#EF4444] border-2 border-[#EF4444]/30">
  Rechazado
</Badge>
```

## Tipografía

### Fuentes

- **Sans-serif System Font Stack**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  ```

### Escalas

```css
/* Headings */
.text-4xl { font-size: 2.25rem; }  /* H1 */
.text-3xl { font-size: 1.875rem; } /* H2 */
.text-2xl { font-size: 1.5rem; }   /* H3 */
.text-xl { font-size: 1.25rem; }   /* H4 */
.text-lg { font-size: 1.125rem; }  /* H5 */

/* Body */
.text-base { font-size: 1rem; }     /* Body normal */
.text-sm { font-size: 0.875rem; }   /* Body pequeño */
.text-xs { font-size: 0.75rem; }    /* Caption */
```

### Pesos

```css
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## Espaciado

### Sistema de 4px

```css
/* Base: 4px */
.p-1 = 4px
.p-2 = 8px
.p-3 = 12px
.p-4 = 16px
.p-6 = 24px
.p-8 = 32px
.p-12 = 48px
```

### Recomendaciones

- **Padding de cards**: `p-6` (24px)
- **Margin entre secciones**: `mb-6` o `mb-8`
- **Gap entre elementos**: `gap-4` (16px)

## Sombras

```css
/* Elevaciones */
.shadow-sm    /* Sutil - Cards en reposo */
.shadow-md    /* Media - Cards hover */
.shadow-lg    /* Grande - Modals, Dropdowns */
.shadow-xl    /* Muy grande - Elementos flotantes */

/* Sombras de color (Brand) */
.shadow-[#91f2b3]/20  /* Verde con opacidad */
.shadow-[#fcf326]/20  /* Amarillo con opacidad */
```

## Bordes

```css
/* Radios */
.rounded-lg = 8px      /* Cards, Buttons */
.rounded-xl = 12px     /* Cards grandes */
.rounded-2xl = 16px    /* Containers principales */
.rounded-full = 9999px /* Badges, Pills, Avatars */

/* Anchos */
.border    = 1px
.border-2  = 2px   /* Recomendado para botones y cards */
.border-4  = 4px   /* Avatares, imágenes destacadas */
```

## Animaciones

```css
/* Transiciones */
.transition-all { transition: all 150ms ease-in-out; }

/* Hover Effects */
.hover:scale-105      /* Zoom sutil en botones */
.hover:shadow-xl      /* Elevación en hover */
.hover:border-[color] /* Cambio de color de borde */

/* Animaciones predefinidas */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Iconos

### Biblioteca: Lucide React

```tsx
import { User, Package, MessageCircle, ArrowLeftRight } from 'lucide-react'

// Tamaños recomendados
<User className="h-4 w-4" />   // Pequeño (16px)
<User className="h-5 w-5" />   // Medio (20px)
<User className="h-6 w-6" />   // Grande (24px)
<User className="h-8 w-8" />   // Muy grande (32px)
```

## Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop muy grande */
```

### Patrones

```tsx
{/* Mobile: Column, Desktop: Row */}
<div className="flex flex-col md:flex-row gap-4">
  {/* Contenido */}
</div>

{/* Hide on mobile */}
<div className="hidden md:block">
  {/* Solo desktop */}
</div>

{/* Show only on mobile */}
<div className="block md:hidden">
  {/* Solo móvil */}
</div>
```

## Accesibilidad

### Contraste

- **Texto principal**: 21:1 con fondo (`#E6F1FF` sobre `#0A1628`)
- **Texto secundario**: Mínimo 7:1
- **Botones primarios**: Texto oscuro sobre gradiente claro

### Focus States

```tsx
<Input className="focus:border-[#91f2b3] focus:ring-2 focus:ring-[#91f2b3]/20" />
```

### ARIA Labels

```tsx
<Button aria-label="Cerrar modal">
  <X className="h-4 w-4" />
</Button>
```

## Siguiente Paso

Continúa con [Tecnologías Utilizadas](./tech-stack.md) para conocer las herramientas del proyecto.
