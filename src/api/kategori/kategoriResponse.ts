export interface KategoriIncludeAkunResponse {
  kategori: {
    namaKategori: string;

    idKategori: number;

    saranNomorAkunBaru: string;
  };

  akuns: {
    idAkun: number;

    nomorAkun: string;

    namaAkun: string;

    kodeAkun: string;

    isHeader: boolean | null;

    idHeader: number | null;

    createdAt: Date;

    updatedAt: Date;
  }[];
}
