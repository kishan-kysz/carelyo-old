CREATE TABLE IF NOT EXISTS child (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME(6) DEFAULT NULL,
  updated_at DATETIME(6) DEFAULT NULL,
  nincard LONGBLOB,
  birth_certificate LONGBLOB,
  date_of_birth DATETIME(6) DEFAULT NULL,
  gender VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  notes VARCHAR(255) DEFAULT NULL,
  status INT DEFAULT NULL,
  partner_id BIGINT DEFAULT NULL,
  partner_patient_id BIGINT DEFAULT NULL,
  patient_id BIGINT DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_child_partner FOREIGN KEY (partner_id) REFERENCES partner (id),
  CONSTRAINT fk_child_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
  CONSTRAINT fk_child_partner_patient FOREIGN KEY (partner_patient_id) REFERENCES patient (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
