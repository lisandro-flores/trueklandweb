#!/usr/bin/env node

/**
 * Script de verificación pre-producción para TruekLand
 * Ejecuta todas las verificaciones necesarias antes del despliegue
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando verificación pre-producción de TruekLand...\n');

const checks = [
  {
    name: 'Verificación de variables de entorno',
    run: () => {
      const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ];

      const envFile = path.join(process.cwd(), '.env.local');
      if (!fs.existsSync(envFile)) {
        throw new Error('Archivo .env.local no encontrado');
      }

      const envContent = fs.readFileSync(envFile, 'utf8');
      const missingVars = requiredEnvVars.filter(varName => !envContent.includes(varName));
      
      if (missingVars.length > 0) {
        throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
      }
      
      console.log('✅ Variables de entorno configuradas correctamente');
    }
  },
  {
    name: 'Verificación de tipos TypeScript',
    run: () => {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ Verificación de tipos completada');
    }
  },
  {
    name: 'Verificación de linting',
    run: () => {
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting completado sin errores');
    }
  },
  {
    name: 'Build de producción',
    run: () => {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build de producción completado exitosamente');
    }
  },
  {
    name: 'Verificación de archivos críticos',
    run: () => {
      const criticalFiles = [
        'package.json',
        'next.config.js',
        'middleware.ts',
        'firestore.rules',
        'public/manifest.json',
        'lib/firebase.ts'
      ];

      const missingFiles = criticalFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));
      
      if (missingFiles.length > 0) {
        throw new Error(`Archivos críticos faltantes: ${missingFiles.join(', ')}`);
      }
      
      console.log('✅ Todos los archivos críticos están presentes');
    }
  },
  {
    name: 'Verificación de configuración de seguridad',
    run: () => {
      const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.js'), 'utf8');
      
      if (!nextConfig.includes('Content-Security-Policy')) {
        throw new Error('Content Security Policy no configurada');
      }
      
      if (!nextConfig.includes('X-Frame-Options')) {
        throw new Error('X-Frame-Options no configurado');
      }
      
      console.log('✅ Configuración de seguridad verificada');
    }
  },
  {
    name: 'Verificación de PWA',
    run: () => {
      const manifestPath = path.join(process.cwd(), 'public/manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error('Manifest.json no encontrado');
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      if (!manifest.name || !manifest.short_name || !manifest.icons) {
        throw new Error('Manifest.json incompleto');
      }
      
      console.log('✅ Configuración PWA verificada');
    }
  }
];

let successCount = 0;
let totalChecks = checks.length;

for (const check of checks) {
  try {
    console.log(`🔍 ${check.name}...`);
    check.run();
    successCount++;
    console.log('');
  } catch (error) {
    console.error(`❌ ${check.name} falló:`);
    console.error(error.message);
    console.log('');
    process.exit(1);
  }
}

console.log(`🎉 ¡Verificación completada! ${successCount}/${totalChecks} verificaciones exitosas`);
console.log('');
console.log('✨ Tu aplicación TruekLand está lista para producción!');
console.log('');
console.log('📋 Checklist final:');
console.log('  • Asegúrate de tener configuradas las reglas de Firestore');
console.log('  • Verifica que el dominio esté autorizado en Firebase Console');
console.log('  • Configura las variables de entorno en tu plataforma de hosting');
console.log('  • Habilita HTTPS en producción');
console.log('  • Configura monitoring y analytics');
