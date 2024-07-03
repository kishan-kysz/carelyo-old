ALTER TABLE blood_glucose
    ADD COLUMN child_id bigint NULL;

ALTER TABLE blood_oxygen
    ADD COLUMN child_id bigint NULL;

ALTER TABLE blood_pressure
    ADD COLUMN child_id bigint NULL;

ALTER TABLE body_temperature
    ADD COLUMN child_id bigint NULL;

ALTER TABLE heart_rate
    ADD COLUMN child_id bigint NULL;

ALTER TABLE menstruation
    ADD COLUMN child_id bigint NULL;

ALTER TABLE respiratory_rate
    ADD COLUMN child_id bigint NULL;
