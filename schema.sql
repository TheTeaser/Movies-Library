DROP TABLE IF EXISTS movieTable;

CREATE TABLE IF NOT EXISTS movieTable(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    overview VARCHAR(10000)
);