export interface KategoriIncludeAkunResponse {
  kategori: {
    namaKategori: string;

    idKategori: number;

    kodeKategori: string;

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

    idDivisi: number;

    namaDivisi: string;

    kodeDivisi: string;

    createdAt: Date;

    updatedAt: Date;
  }[];
}
