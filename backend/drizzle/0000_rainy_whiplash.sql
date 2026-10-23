CREATE TYPE "public"."account_category" AS ENUM('sultan', 'collector', 'skin-rich', 'mythic-glory', 'rare-limited', 'top-global-ready', 'tournament-ready', 'starlight-collection', 'budget-friendly');--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('available', 'sold', 'reserved');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('owner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."admin_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('active', 'paid', 'expired');--> statement-breakpoint
CREATE TYPE "public"."delivery_method" AS ENUM('email', 'phone', 'both');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('awaiting_payment', 'payment_confirmed', 'preparing_account', 'credentials_ready', 'unlocked', 'completed');--> statement-breakpoint
CREATE TYPE "public"."note_visibility" AS ENUM('shared', 'private');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_payment', 'paid', 'processing', 'delivered', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."soldout_delivery_status" AS ENUM('sent', 'confirmed');--> statement-breakpoint
CREATE TABLE "account_credentials" (
	"account_id" text PRIMARY KEY NOT NULL,
	"game_id" text DEFAULT '' NOT NULL,
	"server_id" text DEFAULT '' NOT NULL,
	"login_email" text DEFAULT '' NOT NULL,
	"login_password_encrypted" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" text NOT NULL,
	"category" "account_category" NOT NULL,
	"rank" text NOT NULL,
	"highest_rank" text NOT NULL,
	"total_skins" integer DEFAULT 0 NOT NULL,
	"total_heroes" integer DEFAULT 0 NOT NULL,
	"rare_skins" integer DEFAULT 0 NOT NULL,
	"emblems" integer DEFAULT 0 NOT NULL,
	"server" text NOT NULL,
	"price" bigint NOT NULL,
	"original_price" bigint,
	"status" "account_status" DEFAULT 'available' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"images" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"video_preview" text,
	"skin_collection" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_collection" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid,
	"action" text NOT NULL,
	"entity" text DEFAULT '' NOT NULL,
	"entity_id" text DEFAULT '' NOT NULL,
	"ip" "inet",
	"user_agent" text DEFAULT '' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"visibility" "note_visibility" DEFAULT 'shared' NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"admin_id" uuid PRIMARY KEY NOT NULL,
	"position" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "admin_role" DEFAULT 'owner' NOT NULL,
	"status" "admin_status" DEFAULT 'active' NOT NULL,
	"mfa_required" boolean DEFAULT true NOT NULL,
	"credentials_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" text NOT NULL,
	"account_id" text,
	"account_title" text NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_contact" text DEFAULT '' NOT NULL,
	"booked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'active' NOT NULL,
	"amount" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" text NOT NULL,
	"account_id" text,
	"buyer_name" text NOT NULL,
	"buyer_email" text DEFAULT '' NOT NULL,
	"buyer_phone" text DEFAULT '' NOT NULL,
	"account_title" text NOT NULL,
	"account_image" text DEFAULT '' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"payment_method" text DEFAULT '' NOT NULL,
	"payment_gateway" text,
	"transaction_fee" bigint DEFAULT 0 NOT NULL,
	"status" "order_status" DEFAULT 'pending_payment' NOT NULL,
	"delivery_status" "delivery_status" DEFAULT 'awaiting_payment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "soldout_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" text NOT NULL,
	"account_id" text,
	"account_title" text NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_email" text DEFAULT '' NOT NULL,
	"buyer_phone" text DEFAULT '' NOT NULL,
	"sold_at" timestamp with time zone DEFAULT now() NOT NULL,
	"amount" bigint NOT NULL,
	"delivered_via" "delivery_method" DEFAULT 'email' NOT NULL,
	"delivery_status" "soldout_delivery_status" DEFAULT 'sent' NOT NULL,
	"delivered_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account_credentials" ADD CONSTRAINT "account_credentials_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "soldout_items" ADD CONSTRAINT "soldout_items_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_status_category_idx" ON "accounts" USING btree ("status","category");--> statement-breakpoint
CREATE INDEX "accounts_featured_idx" ON "accounts" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "accounts_price_idx" ON "accounts" USING btree ("price");--> statement-breakpoint
CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_audit_logs_admin_id_idx" ON "admin_audit_logs" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "admin_notes_visibility_admin_idx" ON "admin_notes" USING btree ("visibility","admin_id");--> statement-breakpoint
CREATE INDEX "admin_notes_pinned_created_idx" ON "admin_notes" USING btree ("pinned","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_auth_user_id_key" ON "admin_users" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_status_idx" ON "admin_users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_invoice_id_key" ON "bookings" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "bookings_status_expires_idx" ON "bookings" USING btree ("status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_invoice_id_key" ON "orders" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_account_id_idx" ON "orders" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "soldout_items_invoice_id_key" ON "soldout_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "soldout_items_sold_at_idx" ON "soldout_items" USING btree ("sold_at");--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;--> statement-breakpoint
CREATE TRIGGER accounts_set_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER admin_users_set_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER admin_profiles_set_updated_at BEFORE UPDATE ON public.admin_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER admin_notes_set_updated_at BEFORE UPDATE ON public.admin_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.notify_monitoring_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_notify('monitoring_changed', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP)::text); RETURN NULL; END; $$;--> statement-breakpoint
CREATE TRIGGER accounts_notify_monitoring AFTER INSERT OR UPDATE OR DELETE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.notify_monitoring_change();--> statement-breakpoint
CREATE TRIGGER orders_notify_monitoring AFTER INSERT OR UPDATE OR DELETE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.notify_monitoring_change();--> statement-breakpoint
CREATE TRIGGER bookings_notify_monitoring AFTER INSERT OR UPDATE OR DELETE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.notify_monitoring_change();--> statement-breakpoint
CREATE TRIGGER soldout_items_notify_monitoring AFTER INSERT OR UPDATE OR DELETE ON public.soldout_items FOR EACH ROW EXECUTE FUNCTION public.notify_monitoring_change();--> statement-breakpoint
CREATE TRIGGER admin_notes_notify_monitoring AFTER INSERT OR UPDATE OR DELETE ON public.admin_notes FOR EACH ROW EXECUTE FUNCTION public.notify_monitoring_change();--> statement-breakpoint
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.account_credentials ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.soldout_items ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO lumina_api;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lumina_api;--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO lumina_api;