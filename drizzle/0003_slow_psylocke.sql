ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "brand" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "storage" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "cpu" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "name";