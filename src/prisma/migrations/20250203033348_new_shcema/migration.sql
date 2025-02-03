-- CreateTable
CREATE TABLE `divisies` (
    `id_divisi` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_divisi` VARCHAR(191) NOT NULL,
    `kode_divisi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `divisies_kode_divisi_key`(`kode_divisi`),
    PRIMARY KEY (`id_divisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategories` (
    `id_kategori` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `head_number` INTEGER NOT NULL,
    `post_is_debet` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kategori`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `akuns` (
    `id_akun` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_akun` VARCHAR(191) NOT NULL,
    `nama_akun` VARCHAR(191) NOT NULL,
    `nomor_akun` VARCHAR(191) NOT NULL,
    `saldo_akun` DOUBLE NOT NULL,
    `is_header` BOOLEAN NULL,
    `is_project` BOOLEAN NOT NULL,
    `id_divisi` INTEGER NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `id_header` INTEGER NULL,
    `deskripsi` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_akun`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jurnal_umums` (
    `id_jurnal` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_jurnal` VARCHAR(191) NOT NULL,
    `tanggal_transaksi` DATETIME(3) NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `is_balance` BOOLEAN NOT NULL,
    `jumlah` DOUBLE NOT NULL,
    `id_divisi` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `jurnal_umums_kode_jurnal_key`(`kode_jurnal`),
    PRIMARY KEY (`id_jurnal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi_jurnals` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_transaksi` VARCHAR(191) NOT NULL,
    `debet` VARCHAR(191) NOT NULL,
    `kredit` BOOLEAN NOT NULL,
    `saldo` DOUBLE NOT NULL,
    `jumlah` DOUBLE NOT NULL,
    `id_jurnal` INTEGER NOT NULL,
    `id_akun` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaksi_jurnals_kode_transaksi_key`(`kode_transaksi`),
    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id_tag` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_tag` VARCHAR(191) NOT NULL,
    `nama_tag` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tags_kode_tag_key`(`kode_tag`),
    PRIMARY KEY (`id_tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regulator_tags` (
    `id_regulator_tag` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jurnal` INTEGER NOT NULL,
    `id_tag` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_regulator_tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `akuns` ADD CONSTRAINT `akuns_id_divisi_fkey` FOREIGN KEY (`id_divisi`) REFERENCES `divisies`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `akuns` ADD CONSTRAINT `akuns_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategories`(`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jurnal_umums` ADD CONSTRAINT `jurnal_umums_id_divisi_fkey` FOREIGN KEY (`id_divisi`) REFERENCES `divisies`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_jurnals` ADD CONSTRAINT `transaksi_jurnals_id_jurnal_fkey` FOREIGN KEY (`id_jurnal`) REFERENCES `jurnal_umums`(`id_jurnal`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_jurnals` ADD CONSTRAINT `transaksi_jurnals_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akuns`(`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `regulator_tags` ADD CONSTRAINT `regulator_tags_id_tag_fkey` FOREIGN KEY (`id_tag`) REFERENCES `tags`(`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `regulator_tags` ADD CONSTRAINT `regulator_tags_id_jurnal_fkey` FOREIGN KEY (`id_jurnal`) REFERENCES `transaksi_jurnals`(`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;
