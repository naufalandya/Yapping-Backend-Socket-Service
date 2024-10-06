-- CreateEnum
CREATE TYPE "EXTENSION" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "YappinLike" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "yappin_id" INTEGER,

    CONSTRAINT "YappinLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_preference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "list_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like_notifications" (
    "id" SERIAL NOT NULL,
    "detail" TEXT NOT NULL,
    "redirect" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "yappin_like_id" INTEGER NOT NULL,
    "by_id" INTEGER NOT NULL,

    CONSTRAINT "like_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preference_yappin" (
    "id" SERIAL NOT NULL,
    "preference_tag_one" TEXT,
    "preference_tag_two" TEXT,
    "preference_tag_three" TEXT,
    "preference_tag_four" TEXT,
    "user_id" INTEGER NOT NULL,
    "total_engage_four" INTEGER,
    "total_engage_one" INTEGER,
    "total_engage_three" INTEGER,
    "total_engage_two" INTEGER,

    CONSTRAINT "preference_yappin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "started_date" TIMESTAMP(3) NOT NULL,
    "finished_date" TIMESTAMP(3),
    "deadline_date" TIMESTAMP(3) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "country" VARCHAR(50),
    "city" VARCHAR(50),
    "bio" VARCHAR(255),
    "avatar_link" TEXT,
    "googleId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yappin_image" (
    "id" SERIAL NOT NULL,
    "image_link" TEXT NOT NULL,
    "yappin_id" INTEGER,
    "type" "EXTENSION" NOT NULL,

    CONSTRAINT "yappin_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yappins" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "total_likes" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL,
    "tag_one_id" INTEGER,
    "tag_two_id" INTEGER,
    "tag_three_id" INTEGER,
    "tag_four_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "tag_four_name" TEXT,
    "tag_one_name" TEXT,
    "tag_three_name" TEXT,
    "tag_two_name" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "total_comments" INTEGER,
    "location" TEXT,

    CONSTRAINT "yappins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YappinLike_user_id_yappin_id_key" ON "YappinLike"("user_id", "yappin_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "preference_yappin_user_id_key" ON "preference_yappin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "YappinLike" ADD CONSTRAINT "YappinLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YappinLike" ADD CONSTRAINT "YappinLike_yappin_id_fkey" FOREIGN KEY ("yappin_id") REFERENCES "yappins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_notifications" ADD CONSTRAINT "like_notifications_by_id_fkey" FOREIGN KEY ("by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_notifications" ADD CONSTRAINT "like_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_notifications" ADD CONSTRAINT "like_notifications_yappin_like_id_fkey" FOREIGN KEY ("yappin_like_id") REFERENCES "YappinLike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preference_yappin" ADD CONSTRAINT "preference_yappin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yappin_image" ADD CONSTRAINT "yappin_image_yappin_id_fkey" FOREIGN KEY ("yappin_id") REFERENCES "yappins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yappins" ADD CONSTRAINT "yappins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
