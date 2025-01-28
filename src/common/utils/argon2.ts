import argon2 from "argon2";

export const hashData = async (data: string): Promise<string> => {
  return await argon2.hash(data);
};

export const verifyHashData = async (hash: string, data: string): Promise<boolean> => {
  try {
    return await argon2.verify(hash, data);
  } catch (ex) {
    return false;
  }
};
