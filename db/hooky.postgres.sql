
CREATE TYPE hookType AS ENUM ('text', 'json', 'xml');
CREATE TABLE "public"."hook" (
  "id" serial,
  "headers" text,
  "body" text,
  "creationStamp" timestamp DEFAULT CURRENT_TIMESTAMP,
  "type" hookType,
  PRIMARY KEY ("id")
);
