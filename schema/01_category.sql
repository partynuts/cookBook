CREATE TABLE IF NOT EXISTS categories
(
    id                  uuid DEFAULT gen_random_uuid() unique,
    categoryTitle       VARCHAR(250),
    categoryDescription VARCHAR(250)
);

