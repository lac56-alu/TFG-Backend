module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "luis",
    PASSWORD: process.env.DB_PASSWORD || "root",
    DB: process.env.DB_NAME || "element_gym",
    dialect: "mysql",
    options: {
        retry: {
        max: 5,
        },
    },
};