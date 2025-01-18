require('dotenv').config()
import jwt from 'jsonwebtoken'

//Função de gerar tokens de autenticação
export async function genAuthToken(userID: string | jwt.JwtPayload){
    try {
        const secret = String(process.env.SECRET_KEY);
        const token = jwt.sign({userID}, secret, {
          expiresIn: "24h",
        });
        return token
    } catch (err){
        return new Error("Failed genToken.")
    }
}
//Função para gerar refresh tokens
export async function genRefreshToken(userID: string | jwt.JwtPayload){
    try {
        const secret = String(process.env.SECRET_KEY)
        const token = jwt.sign({userID}, secret, {
            expiresIn: "7d"
        })
        return token
    } catch (err){
        return new Error("Failed genRefreshToken")
    }
}