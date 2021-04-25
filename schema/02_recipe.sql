CREATE TABLE IF NOT EXISTS recipes
(
    id          uuid DEFAULT gen_random_uuid() unique,
    title       VARCHAR(250),
    description VARCHAR(250),
    ingredients VARCHAR(250) ARRAY,
    duration    VARCHAR(250),
    category    uuid,
    CONSTRAINT fk_category
        FOREIGN KEY (category)
            REFERENCES categories (id)
);


-- INSERT into recipes (title, description, ingredients, category) Values ('Bulgur Salat', 'Leckerer Bulgur Salat', '{"Bulgur", "Tomaten"}', '0fcf5a03-09c0-4474-9cdc-ec1a6e99043c');
