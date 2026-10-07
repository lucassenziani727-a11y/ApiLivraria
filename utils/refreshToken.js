import { randomBytes, createHash } from 'crypto';

export function gerarRefreshToken(){
 const token = randomBytes(40).toString('hex');

 const tokenHash = hashToken(token);

 const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

 return {token, tokenHash, expiresAt};
}

export function hashToken(token){
   const resultado = createHash('sha256').update(token).digest('hex')
   
   return resultado 
}