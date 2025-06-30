# Configuración de Seguridad para Producción

## Variables de Entorno Recomendadas
```bash
NODE_ENV=production
FORCE_HTTPS=true
```

## Configuración Nginx (si aplica)
```nginx
# Ocultar versión del servidor
server_tokens off;

# Configurar cabeceras de seguridad adicionales
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin";

# Ocultar cabeceras que revelan información del servidor
more_clear_headers Server;
```

## Configuraciones de Firewall
- Bloquear acceso directo a archivos sensibles
- Limitar rate de requests por IP
- Configurar fail2ban para intentos de login maliciosos

## Monitoreo de Seguridad
- Configurar logs de seguridad
- Monitorear intentos de acceso no autorizados
- Alertas para actividad sospechosa
