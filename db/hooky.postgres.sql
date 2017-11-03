
CREATE TABLE "public"."hook" (
  "id" serial,
  "headers" text,
  "payload" text,
  "creationStamp" timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);
