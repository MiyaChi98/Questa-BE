import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(
    // <NestExpressApplication>
    AppModule,
  );

  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("")
    .addBearerAuth()
    .setVersion("1.0")
    .addTag("")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  // app.useStaticAssets(join(__dirname, "..", "uploads"), {
  //   prefix: "/uploads/",
  // });
  await app.listen(8000);
}
bootstrap();
