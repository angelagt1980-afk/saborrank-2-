import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Configuracion de Vitest para SaborRank.
 *
 * Reproduce exactamente el flujo del Taller 6:
 *  - Localiza las pruebas en `test/**.test.ts`.
 *  - Habilita el path alias `@/*` -> `src/*` (igual que en Next.js).
 *  - Activa la coleccion de cobertura con `@vitest/coverage-v8`.
 *  - El metodo `calcularGlobal` tiene 100% de cobertura por las 18 pruebas T01-T18.
 *  - El metodo `calcularPorCriterio` esta documentado como DEUDA TECNICA (issue #43):
 *    no tiene pruebas todavia (0% de cobertura). Por eso los umbrales globales
 *    del archivo se mantienen por debajo del 90% ideal. Una vez saldada la deuda,
 *    los umbrales deben subir a 90% statements / 80% branches / 80% functions.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: ['src/domain/services/CalculadorRanking.ts'],
      // Umbrales actuales reflejan la deuda tecnica documentada en el issue #43.
      // Aumentar a 90/80/80 una vez escritas las pruebas de `calcularPorCriterio`.
      thresholds: {
        statements: 50,
        branches: 60,
        functions: 40,
        lines: 50,
      },
    },
  },
});
