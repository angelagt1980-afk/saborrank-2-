# SaborRank

> Ranking gastronómico basado en reseñas verificadas — caso académico del **Taller 6 de Ingeniería de Software**.

[![Quality Gate](https://github.com/equipo-saborrank/saborrank/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/equipo-saborrank/saborrank/actions/workflows/quality-gate.yml)
[![Tests](https://img.shields.io/badge/tests-18%2F18%20passing-success)](test/calculador-ranking.test.ts)
[![Coverage](https://img.shields.io/badge/cobertura%20calcularGlobal-100%25-success)](vitest.config.ts)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Tabla de contenidos

- [Resumen](#resumen)
- [Cadena de trazabilidad](#cadena-de-trazabilidad)
- [Arquitectura (DDD)](#arquitectura-ddd)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Pruebas automatizadas](#pruebas-automatizadas)
- [Cobertura y deuda técnica](#cobertura-y-deuda-técnica)
- [Quality Gate (CI/CD)](#quality-gate-cicd)
- [Reglas de negocio cubiertas](#reglas-de-negocio-cubiertas)
- [API HTTP](#api-http)
- [Equipo y licencia](#equipo-y-licencia)

---

## Resumen

**SaborRank** calcula el ranking global de un restaurante como el promedio de las
calificaciones globales de sus reseñas verificadas y publicadas. Solo las reseñas
en estado **Publicada** entran en el cálculo; las reseñas en disputa o retiradas
se excluyen.

El Taller 6 somete el método `CalculadorRanking.calcularGlobal(reseñas)` (implementado
en el Taller 5 con TDD) a evidencia de calidad mediante:

- **Partición de equivalencia** (6 clases: CE1–CE6)
- **Análisis de valores límite** (9 casos: VL1–VL9)
- **Tabla de decisión** (3 reglas: D1, D2, D3)
- **18 pruebas automatizadas** (T01–T18) con Vitest
- **100% de cobertura** en sentencias, ramas, funciones y líneas de `calcularGlobal`
- **Análisis estático** con ESLint sin errores
- **Deuda técnica documentada** para `calcularPorCriterio` (issue #43)

## Cadena de trazabilidad

El Taller 6 completa la transición de la construcción a la evidencia de calidad.
La cadena de trazabilidad explícita es:

| Taller | Artefacto | Pregunta |
|---|---|---|
| 1 | Problema + Historia de usuario (HU-03) | ¿Quién necesita qué? |
| 2 | Caso de uso estructurado + Modelo de dominio | ¿Qué hace el sistema? |
| 3 | DCD con GRASP (Information Expert, Low Coupling, High Cohesion) | ¿Quién es responsable de qué? |
| 4 | Diagrama de secuencia + Máquina de estados | ¿Cómo colaboran los objetos? |
| 5 | Implementación con TDD (Red-Green-Refactor) + Pull Request | ¿Cómo implementamos el diseño? |
| **6** | **Clases de equivalencia + valores límite + tabla de decisión + cobertura** | **¿Cómo sabemos que funciona?** |

## Arquitectura (DDD)

El proyecto sigue **Domain-Driven Design** con cuatro capas:

```
┌─────────────────────────────────────────────────────────────┐
│  Presentación (src/app, src/components)                      │
│  Next.js App Router, React 19, shadcn/ui, Tailwind 4         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  Aplicación (src/application)                                │
│  Casos de uso: ConsultarRanking, ListarRanking,              │
│  PublicarResena, RegistrarRestaurante                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  Dominio (src/domain)                                        │
│  Entidades: Resena, Restaurante                              │
│  Value Objects: Calificacion                                 │
│  Enumeraciones: EstadoResena, CriterioCalificacion          │
│  Servicios: CalculadorRanking (calcularGlobal,               │
│             calcularPorCriterio)                              │
│  Reglas de negocio R1-R4, errores de dominio                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│  Infraestructura (src/infrastructure)                        │
│  Repositorios en memoria (MemoriaRepositorioResenas,         │
│  MemoriaRepositorioRestaurantes) + Contenedor DI             │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Inversion Principle**: las interfaces de repositorio viven en el dominio
(`src/domain/repositories/`); las implementaciones concretas en infraestructura.

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.x |
| UI | shadcn/ui + Radix UI | - |
| Formularios | react-hook-form + zod | - |
| Pruebas | Vitest + @vitest/coverage-v8 | 5.x |
| Calidad | ESLint + tsc | 9 / 5 |
| Runtime | Bun | 1.x |
| Base de datos | Prisma ORM (disponible; el proyecto usa repositorios en memoria) | 6.x |
| CI/CD | GitHub Actions | - |

## Estructura del proyecto

```
saborrank/
├── src/
│   ├── domain/                          # Capa de dominio (DDD)
│   │   ├── entities/
│   │   │   ├── Resena.ts                # Entidad Resena (reseña verificada)
│   │   │   └── Restaurante.ts           # Entidad Restaurante
│   │   ├── valueobjects/
│   │   │   └── Calificacion.ts          # Value Object Calificacion
│   │   ├── enums/
│   │   │   ├── EstadoResena.ts          # Publicada | EnDisputa | Retirada
│   │   │   └── CriterioCalificacion.ts # Precio | Calidad | Atencion | Distancia
│   │   ├── services/
│   │   │   └── CalculadorRanking.ts     # Servicio de dominio (Taller 5+6)
│   │   ├── repositories/                # Interfaces (DIP)
│   │   │   ├── RepositorioResenas.ts
│   │   │   └── RepositorioRestaurantes.ts
│   │   ├── errors/
│   │   │   └── ErroresDominio.ts        # ErrorCalificacionFueraDeRango, etc.
│   │   └── index.ts                     # Barrel export
│   │
│   ├── application/                     # Capa de aplicación
│   │   └── usecases/
│   │       ├── ConsultarRankingUseCase.ts
│   │       ├── ListarRankingUseCase.ts
│   │       ├── RegistrarRestauranteUseCase.ts
│   │       └── PublicarResenaUseCase.ts
│   │
│   ├── infrastructure/                  # Capa de infraestructura
│   │   ├── repositories/
│   │   │   ├── MemoriaRepositorioResenas.ts
│   │   │   └── MemoriaRepositorioRestaurantes.ts
│   │   └── container.ts                 # Contenedor DI + datos de ejemplo
│   │
│   ├── app/                             # Next.js App Router
│   │   ├── api/
│   │   │   └── restaurantes/
│   │   │       ├── route.ts             # GET (listar), POST (registrar)
│   │   │       └── [id]/
│   │   │           ├── route.ts          # GET (detalle + ranking)
│   │   │           └── resenas/route.ts # POST (publicar reseña)
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Página principal con ranking
│   │   └── globals.css
│   │
│   └── components/                      # UI
│       ├── ui/                          # shadcn/ui (componentes base)
│       ├── Estrellas.tsx
│       ├── TarjetaRestaurante.tsx
│       ├── DetalleRestaurante.tsx
│       └── FormularioResena.tsx
│
├── test/
│   └── calculador-ranking.test.ts       # 18 pruebas T01-T18
│
├── .github/
│   ├── workflows/
│   │   └── quality-gate.yml              # CI: lint + types + tests + coverage
│   └── ISSUE_TEMPLATE/
│       ├── deuda-tecnica.yml
│       └── issue-43-calcular-por-criterio.md  # Deuda técnica documentada
│
├── prisma/
│   └── schema.prisma                   # (Disponible para futuras iteraciones)
├── vitest.config.ts                    # Configuración de Vitest + cobertura
├── eslint.config.mjs
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── LICENSE                             # MIT
├── CONTRIBUTING.md
└── README.md
```

## Instalación y ejecución

### Requisitos

- **Bun** 1.x (recomendado) o Node.js 20+ con npm
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/equipo-saborrank/saborrank.git
cd saborrank

# 2. Instalar dependencias
bun install

# 3. Ejecutar en modo desarrollo
bun run dev
# La aplicación queda disponible en http://localhost:3000

# 4. (Opcional) Compilar para producción
bun run build && bun run start
```

### Datos de ejemplo

Al arrancar, el `ContenedorDI` siembra automáticamente:
- 3 restaurantes: **La Parrilla Argentina** (Parrilla), **Sushi Zen** (Japonesa), **Tizón** (Mexicana).
- 6 reseñas verificadas distribuidas entre los restaurantes.
- 1 reseña en estado **EnDisputa** (no entra en el cálculo por R4).

## Scripts disponibles

| Script | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo en http://localhost:3000 |
| `bun run build` | Compila para producción |
| `bun run start` | Levanta el servidor de producción |
| `bun run lint` | ESLint con reglas de Next.js |
| `bun run test` | Ejecuta Vitest una vez |
| `bun run test:watch` | Vitest en modo watch |
| `bun run test:coverage` | Vitest + reporte de cobertura |
| `bun run quality-gate` | lint + tests + coverage (lo que ejecuta CI) |
| `bun run db:push` | Prisma: sincroniza el schema a la base de datos |
| `bun run db:generate` | Prisma: genera el cliente |

## Pruebas automatizadas

El archivo `test/calculador-ranking.test.ts` contiene **18 pruebas T01-T18**
organizadas en 3 bloques por técnica de diseño de caja negra. Cada prueba sigue
el patrón **AAA** (Arrange-Act-Assert) y declara el resultado esperado de forma
explícita con `toBe()` o `toThrow()`.

### Resumen de los 18 casos

| ID | Técnica | Origen | Descripción | Assert |
|----|---------|--------|-------------|--------|
| T01 | Partición de equivalencia | CE1 | Lista vacía retorna 0 | `toBe(0)` |
| T02 | Partición de equivalencia | CE2 | Una reseña cg=3 retorna 3 | `toBe(3)` |
| T03 | Partición de equivalencia | CE3 | Tres reseñas (4,5,3) retornan 4 | `toBe(4)` |
| T04 | Partición de equivalencia | CE4 | Calificación 0 lanza error | `toThrow(ErrorCalificacionFueraDeRango)` |
| T05 | Partición de equivalencia | CE5 | Calificación 6 lanza error | `toThrow(ErrorCalificacionFueraDeRango)` |
| T06 | Partición de equivalencia | CE6 | Lista mixta (4,0,5) lanza error | `toThrow(ErrorCalificacionFueraDeRango)` |
| T07 | Valores límite | VL1 | cg=0 lanza error | `toThrow()` |
| T08 | Valores límite | VL2 | cg=1 retorna 1 | `toBe(1)` |
| T09 | Valores límite | VL3 | cg=2 retorna 2 | `toBe(2)` |
| T10 | Valores límite | VL4 | cg=3 retorna 3 | `toBe(3)` |
| T11 | Valores límite | VL5 | cg=4 retorna 4 | `toBe(4)` |
| T12 | Valores límite | VL6 | cg=5 retorna 5 | `toBe(5)` |
| T13 | Valores límite | VL7 | cg=6 lanza error | `toThrow()` |
| T14 | Valores límite | VL8 | Lista vacía retorna 0 | `toBe(0)` |
| T15 | Valores límite | VL9 | Lista con un elemento retorna esa calificación | `toBe(4)` |
| T16 | Tabla de decisión | D1 | Promedio de (4,5) retorna 4.5 | `toBe(4.5)` |
| T17 | Tabla de decisión | D2 | (4,0) lanza error | `toThrow()` |
| T18 | Tabla de decisión | D3 | Lista vacía retorna 0 | `toBe(0)` |

### Ejecución

```bash
$ bun run test
 ✓  test/calculador-ranking.test.ts (18)
   CalculadorRanking.calcularGlobal > Partición de equivalencia (6) ✓
   CalculadorRanking.calcularGlobal > Análisis de valores límite (9) ✓
   CalculadorRanking.calcularGlobal > Tabla de decisión (3) ✓

 Test Files  1 passed (1)
 Tests       18 passed (18)
```

## Cobertura y deuda técnica

### Cobertura actual

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
CalculadorRanking  |  56.25  |   75.00  |  50.00  |  54.54  | 68-72 (deuda técnica)
  calcularGlobal   | 100.00  |  100.00  | 100.00  | 100.00  | (cobertura completa)
  calcularPorCriterio|  0.00 |   0.00   |   0.00  |   0.00  | (deuda técnica issue #43)
  promedio         | 100.00  |  100.00  | 100.00  | 100.00  | (cubierto indirectamente)
-------------------|---------|----------|---------|---------|-------------------
```

### Métricas orientadas a objetos (Chidamber & Kemerer)

| Métrica | Valor | Interpretación |
|---|---|---|
| WMC | 3 | CalculadorRanking tiene 3 métodos. Bajo → clase cohesiva. |
| CBO | 2 | Depende de Resena y CriterioCalificacion. Bajo → Low Coupling. |
| DIT | 0 | No hereda de ninguna clase. |
| NOC | 0 | No tiene subclases. |
| LCOM | Bajo | Los métodos comparten `promedio` privado → alta cohesión. |

### Complejidad ciclomática (McCabe)

| Método | V(G) | Caminos |
|---|---|---|
| `calcularGlobal` | 3 | vacía / todos válidos / al menos un inválido |
| `calcularPorCriterio` | 2 | vacía / no vacía |
| `promedio` | 1 | un solo camino |

### Deuda técnica identificada

- **Issue #43**: el método `calcularPorCriterio` fue preparado en la refactorización
  del Taller 5 para futuras iteraciones del cálculo multicriterio pero no tiene
  pruebas automatizadas. Su cobertura es del **0%** y está documentado abiertamente
  en `.github/ISSUE_TEMPLATE/issue-43-calcular-por-criterio.md`. Se programa para
  la próxima iteración del ciclo TDD con un conjunto de pruebas equivalente al de
  `calcularGlobal` (reglas de negocio, clases de equivalencia, valores límite y
  tabla de decisión).

> La transparencia sobre la deuda técnica es una práctica saludable. Ocultarla
> generaría una falsa sensación de calidad completada.

## Quality Gate (CI/CD)

El workflow `.github/workflows/quality-gate.yml` ejecuta en cada Pull Request:

1. **ESLint**: 0 errores.
2. **TypeScript**: compilación sin errores (`tsc --noEmit`).
3. **Vitest**: 18/18 pruebas pasan.
4. **Cobertura**: respeta los umbrales definidos en `vitest.config.ts`
   (50% sentencias / 60% ramas / 40% funciones / 50% líneas — reflejan la
   deuda técnica documentada; subir a 90/80/80 al saldar el issue #43).
5. **Comentario automático** en el PR con el resultado.

Si cualquiera falla, el PR se bloquea hasta resolverse.

## Reglas de negocio cubiertas

| # | Regla | Comportamiento esperado | Condición |
|---|---|---|---|
| R1 | El ranking global es el promedio de las calificaciones globales de las reseñas verificadas y publicadas. | `sum(calificacionesGlobales) / n` | Lista no vacía y todas en [1,5] |
| R2 | Si la lista está vacía, el ranking debe ser 0 (no NaN ni excepción). | `return 0` inmediatamente | `reseñas.length === 0` |
| R3 | Cada calificación global debe estar en el rango cerrado [1, 5]. | Lanzar `ErrorCalificacionFueraDeRango` | Por cada reseña: `1 <= cg <= 5` |
| R4 | Las reseñas en estado EnDisputa o Retirada no se consideran. | El método asume que las reseñas recibidas ya están filtradas; no re-filtra. | Precondición: todas en estado Publicada |

## API HTTP

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/restaurantes` | Lista el ranking completo (opcional `?categoria=Japonesa`) |
| POST | `/api/restaurantes` | Registra un nuevo restaurante |
| GET | `/api/restaurantes/[id]` | Devuelve el detalle del ranking de un restaurante (con sus reseñas verificadas) |
| POST | `/api/restaurantes/[id]/resenas` | Publica una nueva reseña verificada para el restaurante |

### Ejemplo: crear un restaurante

```bash
curl -X POST http://localhost:3000/api/restaurantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Trattoria Bella Italia",
    "direccion": "Calle Roma 12, Polanco",
    "categoria": "Italiana",
    "telefono": "+52 55 9999 8888",
    "descripcion": "Pasta fresca hecha en casa."
  }'
```

### Ejemplo: publicar una reseña

```bash
curl -X POST http://localhost:3000/api/restaurantes/{RESTAURANTE_ID}/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "c-100",
    "calificacionGlobal": 5,
    "comentario": "La pasta estaba al dente perfecta y el tiramisú es caso de estudio.",
    "transaccionId": "tx-100"
  }'
```

## Equipo y licencia

- **Equipo**: Equipo SaborRank — Taller 6 de Ingeniería de Software para Sistemas Computacionales.
- **Materia**: Ingeniería de Software para Sistemas Computacionales (7º cuatrimestre).
- **Caso de estudio**: SaborRank (aplicación funcional).
- **Sesión**: 6 — Pruebas y calidad de software.
- **Fecha**: Octubre 2026.
- **Licencia**: [MIT](LICENSE).

---

> La calidad de software no se declara: se construye, se verifica y se sustenta con
> evidencia. Cada métrica responde una pregunta concreta; ninguna, por sí sola,
> describe toda la calidad del software.
