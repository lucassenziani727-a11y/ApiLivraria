if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido');
}


export default {
  secret: process.env.JWT_SECRET,
  accessExpiresIn: '15m',
  refreshExpiresInDays: 7
}