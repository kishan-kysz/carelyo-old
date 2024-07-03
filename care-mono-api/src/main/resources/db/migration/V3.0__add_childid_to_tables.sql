ALTER TABLE consultation
    ADD COLUMN child_id BIGINT NULL;

ALTER TABLE labrequest
    ADD COLUMN child_id BIGINT NULL;

ALTER TABLE prescription
    ADD COLUMN child_id BIGINT NULL;

ALTER TABLE child
    ADD COLUMN birth_cert_file_name VARCHAR(255) NULL,
    ADD COLUMN nin_card_file_name VARCHAR(255) NULL;

ALTER TABLE calendar
    ADD COLUMN child_id BIGINT NULL;
