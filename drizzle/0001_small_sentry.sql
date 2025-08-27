ALTER TABLE "acitivity-project_post" RENAME TO "acitivity-project_api_keys";--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "hashed_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "last4" varchar(4) NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" ADD COLUMN "revoked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "acitivity-project_api_keys" DROP COLUMN "updatedAt";