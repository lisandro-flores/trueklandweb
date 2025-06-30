#!/usr/bin/env node

console.log('🚀 Verificación Pre-Producción para TruekLand\n');

const checks = [
  {
    name: 'Variables de entorno',
    check: () => {
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ];
      
      const missing = requiredVars.filter(varName => !process.env[varName]);
      
      if (missing.length > 0) {
        throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
      }
      
      return '✅ Todas las variables de entorno están configuradas';
    }
  },
  {
    name: 'Configuración de Firebase',
    check: () => {
      // Verificar que las URLs de Firebase sean válidas
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (authDomain && !authDomain.includes('.firebaseapp.com')) {
        throw new Error('AUTH_DOMAIN no parece ser una URL válida de Firebase');
      }
      
      if (projectId && (projectId.includes('your_') || projectId.includes('example'))) {
        throw new Error('PROJECT_ID parece ser un valor de ejemplo');
      }
      
      return '✅ Configuración de Firebase válida';
    }
  },
  {
    name: 'Archivos críticos',
    check: () => {
      const fs = require('fs');
      const path = require('path');
      
      const criticalFiles = [
        'package.json',
        'next.config.js',
        'firestore.rules',
        'middleware.ts',
        'lib/firebase.ts',
        'public/manifest.json'
      ];
      
      const missing = criticalFiles.filter(file => {
        return !fs.existsSync(path.join(process.cwd(), file));
      });
      
      if (missing.length > 0) {
        throw new Error(`Archivos críticos faltantes: ${missing.join(', ')}`);
      }
      
      return '✅ Todos los archivos críticos están presentes';
    }
  },
  {
    name: 'Configuración de seguridad',
    check: () => {
      const fs = require('fs');
      const nextConfig = fs.readFileSync('next.config.js', 'utf8');
      
      if (!nextConfig.includes('Content-Security-Policy')) {
        throw new Error('CSP no está configurado en next.config.js');
      }
      
      if (!nextConfig.includes('poweredByHeader: false')) {
        throw new Error('Header X-Powered-By no está deshabilitado');
      }
      
      return '✅ Configuración de seguridad correcta';
    }
  }
];

async function runChecks() {
  let passed = 0;
  let failed = 0;
  
  for (const { name, check } of checks) {
    try {
      const result = await check();
      console.log(`${result}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Resultado: ${passed} ✅ | ${failed} ❌`);
  
  if (failed > 0) {
    console.log('\n🚨 Hay problemas que deben resolverse antes del despliegue');
    process.exit(1);
  } else {
    console.log('\n🎉 ¡Todo listo para producción!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. npm run build - Construir para producción');
    console.log('2. npm run start - Probar localmente');
    console.log('3. Desplegar a tu plataforma favorita');
  }
}

runChecks().catch(console.error);
