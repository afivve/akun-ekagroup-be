export interface RegisterResponseObject {
  email: string;
  username: string;
  fullName: string;
}

export interface LoginResponseObject {
  token: string;
}

export interface MeResponseObject {
  email: string;
  username: string;
  fullName: string;
  photoProfile: string;
}
