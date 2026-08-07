-- migrate:up
ALTER TABLE customers ADD user_id text REFERENCES "user"(id);

-- migrate:down
ALTER TABLE customers DROP COLUMN user_id;
