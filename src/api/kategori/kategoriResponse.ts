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

    idHeader: string | null;

    isProject: boolean;

    createdAt: Date;

    updatedAt: Date;
  }[];
}
