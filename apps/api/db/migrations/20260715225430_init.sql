-- migrate:up
CREATE TYPE account_category AS ENUM (
    'customer',
    'system'
);

CREATE TYPE currency AS ENUM (
    'gbp'
);

CREATE TABLE customers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    address text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category account_category NOT NULL
);

CREATE TABLE account_holder (
    account_id bigint REFERENCES accounts(id) NOT NULL,
    customer_id bigint REFERENCES customers(id) NOT NULL,
    PRIMARY KEY (account_id, customer_id)
);

CREATE TABLE transfers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

CREATE TABLE ledger (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transfer_id bigint REFERENCES transfers(id) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    amount numeric NOT NULL,
    account_id bigint REFERENCES accounts(id) NOT NULL,
    currency currency NOT NULL
);

CREATE OR REPLACE FUNCTION check_transfer_balance() RETURNS TRIGGER AS $$
DECLARE
    total numeric;
BEGIN
    SELECT SUM(amount) into total FROM ledger WHERE transfer_id = NEW.transfer_id;
    if total <> 0 then
        RAISE EXCEPTION 'Transfer is not balanced';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Currently assumes a single currency - if another currency is introduced, this needs revisiting to avoid balancing different currencies
CREATE CONSTRAINT TRIGGER check_transfer_balance
    AFTER INSERT 
    ON ledger
    INITIALLY DEFERRED
    FOR EACH ROW
    EXECUTE FUNCTION check_transfer_balance();

CREATE OR REPLACE FUNCTION check_ledger_operation() RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries cannot be modified or deleted';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- row-level: blocks UPDATE / DELETE
CREATE TRIGGER ledger_block_modify
    BEFORE UPDATE OR DELETE ON ledger
    FOR EACH ROW
    EXECUTE FUNCTION check_ledger_operation();

-- statement-level: blocks TRUNCATE
CREATE TRIGGER ledger_block_truncate
    BEFORE TRUNCATE ON ledger
    FOR EACH STATEMENT
    EXECUTE FUNCTION check_ledger_operation();

-- migrate:down
DROP TRIGGER IF EXISTS ledger_block_truncate ON ledger;
DROP TRIGGER IF EXISTS ledger_block_modify ON ledger;
DROP TRIGGER IF EXISTS check_transfer_balance ON ledger;

DROP FUNCTION IF EXISTS check_ledger_operation();
DROP FUNCTION IF EXISTS check_transfer_balance();

DROP TABLE IF EXISTS ledger;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS account_holder;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

DROP TYPE IF EXISTS currency;
DROP TYPE IF EXISTS account_category;
