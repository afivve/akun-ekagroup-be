export interface DivisiIncludeAkunResponse {
  divisi: {
    namaDivisi: string;

    kodeDivisi: string;

    idDivisi: number;
  };

  akuns: {
    idAkun: number;

    kodeAkun: string;

    namaAkun: string;

    idKategori: number | undefined;

    namaKategori: string | undefined;

    saldo: number;

    nomorAkun: string;

    isHeader: boolean | null;

    idHeader: string | null;

    isProject: boolean;

    idDivisi: number;

    createdAt: Date;

    updatedAt: Date;
  }[];
}
