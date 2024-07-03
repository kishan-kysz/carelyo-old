ALTER TABLE consultation
    ADD COLUMN child_id bigint null,
    ADD COLUMN is_child bit not null;


