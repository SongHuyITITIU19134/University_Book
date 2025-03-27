-- Ensure ENUM types exist before creating tables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'borrow_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN 
        CREATE TYPE "public"."borrow_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'BORROWED'); 
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN 
        CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN'); 
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN 
        CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED'); 
    END IF;
END $$;

-- Correct CREATE TABLE statements
CREATE TABLE IF NOT EXISTS "books" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "title" varchar(255) NOT NULL,
    "author" varchar(255) NOT NULL,
    "genre" text NOT NULL,
    "rating" integer NOT NULL,
    "cover_url" text NOT NULL,
    "cover_color" varchar(7) NOT NULL,
    "description" text NOT NULL,
    "total_copies" integer DEFAULT 1 NOT NULL,
    "available_copies" integer DEFAULT 0 NOT NULL,
    "video_url" text NOT NULL,
    "summary" varchar NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "books_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "borrow_records" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "book_id" uuid NOT NULL,
    "borrow_date" timestamp with time zone DEFAULT now() NOT NULL,
    "due_date" date NOT NULL,
    "return_date" date,
    "status" "borrow_status" DEFAULT 'PENDING' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "borrow_records_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "users_table" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "full_name" varchar(255) NOT NULL,
    "email" text NOT NULL,
    "university_id" integer NOT NULL,
    "password" text NOT NULL,
    "university_card" text NOT NULL,
    "status" "status" DEFAULT 'PENDING',
    "role" "role" DEFAULT 'USER',
    "last_activity_date" date DEFAULT now(),
    "create_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "users_table_id_unique" UNIQUE("id"),
    CONSTRAINT "users_table_email_unique" UNIQUE("email"),
    CONSTRAINT "users_table_university_id_unique" UNIQUE("university_id")
);

-- Add Foreign Keys
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_user_id_users_table_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "users_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_book_id_books_id_fk" 
FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
