CREATE TABLE "acitivity-project_phones" (
	"id" text PRIMARY KEY NOT NULL,
	"key_id" text NOT NULL,
	"brand" varchar(100) NOT NULL,
	"storage" varchar(50) NOT NULL,
	"cpu" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_phones" ADD CONSTRAINT "acitivity-project_phones_key_id_acitivity-project_api_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."acitivity-project_api_keys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "storage";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "cpu";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "image_url";