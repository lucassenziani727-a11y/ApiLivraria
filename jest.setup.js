import db from './models/index.cjs';

beforeAll(async () => {
    await db.sequelize.sync();
});