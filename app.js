import  'dotenv/config';
import express from 'express';
import pessoaRoutes from './routes/pessoaRoutes.js';
import livroRoutes from './routes/livroRoutes.js';
import emprestimoRoutes from './routes/emprestimoRoutes.js';
import autorRoutes from './routes/autorRoutes.js';
import livroAutorRoutes from './routes/livroAutorRoutes.js'

const app = express();

app.use(express.json());
app.use(pessoaRoutes);
app.use(livroRoutes);
app.use(emprestimoRoutes);
app.use(autorRoutes);
app.use(livroAutorRoutes);

export default app;