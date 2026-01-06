#!/usr/bin/env tsx

/**
 * E2E Coverage Checker
 *
 * Script para verificar quais endpoints e fluxos estão cobertos por testes E2E.
 * Compara os endpoints existentes na API com os testes disponíveis.
 *
 * O Playwright não tem funcionalidade nativa para isso, então este script:
 * 1. Escaneia os arquivos de rota para encontrar endpoints
 * 2. Analisa os arquivos de teste para ver quais endpoints são testados
 * 3. Opcionalmente, pode analisar traces do Playwright para ver endpoints chamados
 *
 * Uso:
 *   pnpm test:e2e:coverage
 *
 * Para análise mais precisa, execute os testes primeiro:
 *   pnpm test:e2e
 *   pnpm test:e2e:coverage
 */

import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

interface EndpointInfo {
  path: string;
  methods: string[];
  routeFile: string;
}

interface TestInfo {
  file: string;
  endpoints: string[];
  flows: string[];
}

interface CoverageReport {
  endpoints: EndpointInfo[];
  tests: TestInfo[];
  testedEndpoints: Set<string>;
  untestedEndpoints: EndpointInfo[];
  partiallyTested: EndpointInfo[];
}

/**
 * Encontra todos os endpoints da API
 */
async function findApiEndpoints(): Promise<EndpointInfo[]> {
  const apiDir = join(process.cwd(), "src/app/api");
  const endpoints: EndpointInfo[] = [];

  async function scanDirectory(
    dir: string,
    basePath: string = ""
  ): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const routePath = basePath ? `${basePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          // Se é um diretório, continua escaneando
          await scanDirectory(fullPath, routePath);
        } else if (entry.name === "route.ts") {
          // Encontrou um arquivo de rota
          const content = await readFile(fullPath, "utf-8");
          const methods: string[] = [];

          // Detecta métodos HTTP exportados
          if (content.includes("export async function GET"))
            methods.push("GET");
          if (content.includes("export async function POST"))
            methods.push("POST");
          if (content.includes("export async function PUT"))
            methods.push("PUT");
          if (content.includes("export async function PATCH"))
            methods.push("PATCH");
          if (content.includes("export async function DELETE"))
            methods.push("DELETE");
          if (content.includes("export const { GET, POST }")) {
            methods.push("GET", "POST");
          }
          if (content.includes("export const { GET }")) {
            methods.push("GET");
          }
          if (content.includes("export const { POST }")) {
            methods.push("POST");
          }

          // Remove 'route' do path e ajusta para formato de API
          const apiPath = routePath
            .replace(/\/route\.ts$/, "")
            .replace(/\[\.\.\.all\]/, "[...all]");

          endpoints.push({
            path: `/api/${apiPath}`,
            methods: methods.length > 0 ? methods : ["UNKNOWN"],
            routeFile: fullPath,
          });
        }
      }
    } catch (error) {
      // Ignora erros de diretório não encontrado
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  await scanDirectory(apiDir);
  return endpoints;
}

/**
 * Analisa os arquivos de teste E2E
 */
async function analyzeE2ETests(): Promise<TestInfo[]> {
  const e2eDir = join(process.cwd(), "e2e");
  const testFiles: TestInfo[] = [];

  try {
    const files = await readdir(e2eDir);
    const specFiles = files.filter((f) => f.endsWith(".spec.ts"));

    for (const file of specFiles) {
      const filePath = join(e2eDir, file);
      const content = await readFile(filePath, "utf-8");

      const endpoints: string[] = [];
      const flows: string[] = [];

      // Detecta referências a endpoints da API
      const apiMatches = content.matchAll(/["']\/api\/[^"']+["']/g);
      for (const match of apiMatches) {
        const endpoint = match[0].replace(/["']/g, "");
        if (!endpoints.includes(endpoint)) {
          endpoints.push(endpoint);
        }
      }

      // Se encontrou endpoints do Better Auth, considera que /api/auth/[...all] está testado
      const betterAuthEndpoints = endpoints.filter((ep) =>
        ep.startsWith("/api/auth/")
      );
      if (
        betterAuthEndpoints.length > 0 &&
        !endpoints.includes("/api/auth/[...all]")
      ) {
        endpoints.push("/api/auth/[...all]");
      }

      // Detecta test.describe para identificar fluxos
      const describeMatches = content.matchAll(
        /test\.describe\(["']([^"']+)["']/g
      );
      for (const match of describeMatches) {
        flows.push(match[1]);
      }

      testFiles.push({
        file,
        endpoints,
        flows,
      });
    }
  } catch (error) {
    console.warn("⚠️  Não foi possível ler diretório e2e:", error);
  }

  return testFiles;
}

/**
 * Tenta analisar traces do Playwright (se disponíveis)
 * Nota: Playwright traces são binários, então apenas verificamos se existem
 */
async function checkPlaywrightTraces(): Promise<boolean> {
  const testResultsDir = join(process.cwd(), "test-results");
  try {
    const stats = await stat(testResultsDir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Gera relatório de cobertura
 */
function generateReport(report: CoverageReport, hasTraces: boolean): void {
  console.log("\n📊 Relatório de Cobertura E2E\n");
  console.log("=".repeat(60));

  console.log("\n📡 Endpoints da API\n");
  console.log(`Total: ${report.endpoints.length}`);
  console.log(
    `✅ Testados: ${report.endpoints.length - report.untestedEndpoints.length}`
  );
  console.log(`⚠️  Parcialmente testados: ${report.partiallyTested.length}`);
  console.log(`❌ Não testados: ${report.untestedEndpoints.length}`);

  const coveragePercentage = Math.round(
    ((report.endpoints.length - report.untestedEndpoints.length) /
      report.endpoints.length) *
      100
  );
  console.log(`\n📈 Cobertura: ${coveragePercentage}%`);

  if (report.untestedEndpoints.length > 0) {
    console.log("\n❌ Endpoints não testados:\n");
    report.untestedEndpoints.forEach((ep) => {
      console.log(`   ${ep.path} [${ep.methods.join(", ")}]`);
    });
  }

  if (report.partiallyTested.length > 0) {
    console.log("\n⚠️  Endpoints parcialmente testados:\n");
    report.partiallyTested.forEach((ep) => {
      console.log(`   ${ep.path} [${ep.methods.join(", ")}]`);
    });
  }

  console.log("\n📝 Arquivos de Teste\n");
  report.tests.forEach((test) => {
    console.log(`   ${test.file}`);
    if (test.endpoints.length > 0) {
      console.log(`      Endpoints: ${test.endpoints.join(", ")}`);
    }
    if (test.flows.length > 0) {
      console.log(`      Fluxos: ${test.flows.join(", ")}`);
    }
  });

  if (hasTraces) {
    console.log(
      "\n💡 Dica: Execute 'pnpm test:e2e:report' para ver traces detalhados"
    );
    console.log(
      "     Os traces mostram todas as requisições de rede durante os testes"
    );
  } else {
    console.log(
      "\n💡 Dica: Execute 'pnpm test:e2e' primeiro para gerar traces"
    );
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Atualize docs/e2e-coverage.md com os resultados\n");
  console.log(
    "📚 Nota: O Playwright não tem cobertura nativa de endpoints.\n" +
      "     Este script faz análise estática dos arquivos.\n" +
      "     Para análise dinâmica, use o Trace Viewer: pnpm test:e2e:report"
  );
}

/**
 * Função principal
 */
async function main() {
  try {
    console.log("🔍 Verificando cobertura de testes E2E...\n");
    console.log(
      "ℹ️  Nota: Playwright não tem cobertura nativa de endpoints.\n" +
        "    Este script faz análise estática dos arquivos.\n"
    );

    const endpoints = await findApiEndpoints();
    const tests = await analyzeE2ETests();
    const hasTraces = await checkPlaywrightTraces();

    // Calcula cobertura
    const testedEndpoints = new Set<string>();
    tests.forEach((test) => {
      test.endpoints.forEach((ep) => testedEndpoints.add(ep));
    });

    const untestedEndpoints = endpoints.filter(
      (ep) => !testedEndpoints.has(ep.path)
    );

    // Endpoints parcialmente testados (têm alguns métodos testados mas não todos)
    const partiallyTested = endpoints.filter((ep) => {
      const isTested = testedEndpoints.has(ep.path);
      // Simplificado: se tem múltiplos métodos, considera parcial
      return isTested && ep.methods.length > 1;
    });

    const report: CoverageReport = {
      endpoints,
      tests,
      testedEndpoints,
      untestedEndpoints,
      partiallyTested,
    };

    generateReport(report, hasTraces);
  } catch (error) {
    console.error("❌ Erro ao verificar cobertura:", error);
    process.exit(1);
  }
}

main();
