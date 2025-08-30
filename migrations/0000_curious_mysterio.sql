CREATE TABLE "workshop_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_number" text NOT NULL,
	"date_of_manufacture" text NOT NULL,
	"incoming_part_number" text NOT NULL,
	"incoming_serial_number" text NOT NULL,
	"outgoing_part_number" text NOT NULL,
	"outgoing_serial_number" text NOT NULL,
	"modification_status" text NOT NULL,
	"reason_for_shop_visit" text NOT NULL,
	"shop_exit_reason" text NOT NULL,
	"findings" text NOT NULL,
	"actions_taken" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "workshop_reports_report_number_unique" UNIQUE("report_number")
);
