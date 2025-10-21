ALTER TABLE "phones" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "phones" CASCADE;--> statement-breakpoint
ALTER TABLE "api_keys" RENAME TO "acitivity-project_api_keys";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" RENAME COLUMN "name" TO "brand";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" RENAME COLUMN "created_at" TO "storage";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "last4" SET DATA TYPE varchar(4);--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "revoked" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "cpu" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;