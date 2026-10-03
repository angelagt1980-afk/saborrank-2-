# Contribuir a SaborRank

Gracias por tu interes en contribuir a SaborRank. Este proyecto es un caso academico
del Taller 6 de Ingenieria de Software (Sesiones 1 a 6) y cualquier contribucion
que preserve la trazabilidad con los talleres anteriores es bienvenida.

## Flujo de trabajo

1. Abre un issue describiendo el cambio propuesto.
2. Crea una rama desde `main`: `git checkout -b feature/mi-cambio`.
3. Implementa el cambio siguiendo las convenciones del proyecto.
4. Agrega o actualiza pruebas en `test/`. El patron es AAA (Arrange-Act-Assert)
   agrupadas por tecnica (particion de equivalencia, valores limite, tabla de decision).
5. Verifica localmente:
   ```bash
   bun install --frozen-lockfile
   bun run lint
   bun run test:coverage
   bunx tsc --noEmit
   ```
6. Abre un Pull Request usando la plantilla `.github/PULL_REQUEST_TEMPLATE.md`.
7. Espera la revision por pares y el paso del Quality Gate en CI.

## Reglas del Taller 6 a preservar

- **Trazabilidad**: cualquier cambio a `CalculadorRanking` debe actualizer la
  cadena problema -> HU-03 -> UC-ConsultarRanking -> DCD con GRASP -> Diagrama
  de secuencia -> Implementacion TDD -> Evidencia de pruebas.
- **Cobertura**: `calcularGlobal` debe mantener el 100% en sentencias, ramas,
  funciones y lineas. Si agregas una rama nueva, agrega la prueba que la cubra.
- **Deuda tecnica explicita**: si dejas codigo sin pruebas, documentalo en un
  issue con la plantilla de deuda tecnica y hazlo visible en el reporte de cobertura.
- **Quality Gate**: el workflow de GitHub Actions debe pasar en verde antes de
  fusionar cualquier PR.

## Estilo de codigo

- TypeScript estricto en todo el codigo nuevo.
- Importaciones con el alias `@/` (configurado en `tsconfig.json`).
- shadcn/ui por defecto; si necesitas un componente nuevo, intenta reutilizar
  los existentes en `src/components/ui/`.
- Comentarios en espanol, alineados con la documentacion academica del taller.

## Compromiso con la honestidad en la evidencia

La calidad de software no se declara: se construye, se verifica y se sustenta con
evidencia. Si una metrica no se cumple, documentalo abiertamente en lugar de
ocultarlo. La transparencia sobre la deuda tecnica es una practica saludable.
