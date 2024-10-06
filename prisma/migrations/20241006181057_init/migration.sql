-- CreateTable
CREATE TABLE "YappinComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "yappin_id" INTEGER NOT NULL,

    CONSTRAINT "YappinComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_notifications" (
    "id" SERIAL NOT NULL,
    "detail" TEXT NOT NULL,
    "redirect" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "yappin_comment_id" INTEGER NOT NULL,
    "by_id" INTEGER NOT NULL,

    CONSTRAINT "comment_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YappinComment" ADD CONSTRAINT "YappinComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YappinComment" ADD CONSTRAINT "YappinComment_yappin_id_fkey" FOREIGN KEY ("yappin_id") REFERENCES "yappins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_by_id_fkey" FOREIGN KEY ("by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_yappin_comment_id_fkey" FOREIGN KEY ("yappin_comment_id") REFERENCES "YappinComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
