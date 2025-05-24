CREATE TABLE "takvim_events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "takvim_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"desc" varchar
);
