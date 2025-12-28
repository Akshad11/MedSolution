import { jwtDecode } from "jwt-decode";

type TokenPayload = {
    exp: number;
};

export const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};
