-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "briefly_summary" (
	"id" serial NOT NULL,
	"summary_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"article_id" integer NOT NULL,
	"score" integer NOT NULL,
	"post" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"create_time" timestamp DEFAULT now(),
	"feedback" jsonb NOT NULL,
	"article_date" date,
	CONSTRAINT "briefly_summary_summary_id" UNIQUE("summary_id")
);
--> statement-breakpoint
CREATE TABLE "briefly_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "briefly_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "briefly_article" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"create_time" timestamp with time zone DEFAULT now(),
	"date" date NOT NULL,
	"poster" varchar(255) NOT NULL,
	"article_id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "briefly_article_article_id" UNIQUE("article_id")
);
--> statement-breakpoint
CREATE TABLE "briefly_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "briefly_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "briefly_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "briefly_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
ALTER TABLE "briefly_session" ADD CONSTRAINT "briefly_session_user_id_briefly_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."briefly_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "briefly_account" ADD CONSTRAINT "briefly_account_user_id_briefly_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."briefly_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "briefly_session" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "briefly_account" USING btree ("user_id" text_ops);
*/