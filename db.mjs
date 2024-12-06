import { Sequelize } from 'sequelize';

// Создание экземпляра Sequelize
const sequelize = new Sequelize('science', 'postgres', 'postgres', {
    host: 'postgres',
    dialect: 'postgres',
    logging: false,
    port: 5432
  });


export default sequelize