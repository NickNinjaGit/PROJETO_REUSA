import jwt from "jsonwebtoken";

const getToken = (req) => {
    const tokens = {
        accessToken: req.cookies.accessToken,
        refreshToken: req.cookies.refreshToken
    };
    if (tokens.accessToken) {
        return tokens.accessToken;
    }
    else
    {
        return tokens.refreshToken;
    }
}


export {getToken};