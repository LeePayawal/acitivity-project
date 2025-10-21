CREATE TABLE "phones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_id" uuid NOT NULL,
	"brand" text NOT NULL,
	"storage" text NOT NULL,
	"cpu" text NOT NULL,
	"price" integer NOT NULL,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "acitivity-project_phones" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "acitivity-project_phones" CASCADE;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" RENAME TO "api_keys";--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "last4" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "revoked" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_key_id_api_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."api_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "createdAt";