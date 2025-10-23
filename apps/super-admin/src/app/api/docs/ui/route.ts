import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { absolutePath as swaggerUiAbsolutePath } from "swagger-ui-dist";

export async function GET() {
  // Ensure correct file resolution regardless of monorepo root
  const swaggerUiPath = swaggerUiAbsolutePath();
  const indexPath = join(swaggerUiPath, "index.html");

  console.log("Resolved Swagger UI path:", indexPath);

  const swaggerHtml = readFileSync(indexPath, "utf8");

  const customHtml = swaggerHtml
    .replace("https://petstore.swagger.io/v2/swagger.json", "/api/docs")
    .replace("<title>Swagger UI</title>", "<title>ShipCaptain API Docs</title>");

  return new NextResponse(customHtml, {
    headers: { "Content-Type": "text/html" },
  });
}
