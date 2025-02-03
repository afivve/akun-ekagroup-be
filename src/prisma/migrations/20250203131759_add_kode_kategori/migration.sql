/*
  Warnings:

  - Added the required column `kode_kategori` to the `kategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kategories` ADD COLUMN `kode_kategori` VARCHAR(191) NOT NULL;
