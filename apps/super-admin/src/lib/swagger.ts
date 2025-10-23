import { createSwaggerSpec } from "next-swagger-doc";

export const swaggerSpec = createSwaggerSpec({
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipCaptain API",
      version: "1.0.0",
      description: "API documentation for ShipCaptain AuthFlow",
    },
  },
});
