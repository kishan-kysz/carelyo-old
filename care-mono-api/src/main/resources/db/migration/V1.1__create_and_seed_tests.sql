create table if not exists test
(
    id         bigint auto_increment not null,
    created_at datetime              null,
    updated_at datetime              null,
    category   varchar(255)          null,
    constraint pk_test primary key (id),
    constraint uc_test_category unique (category)
);

create table if not exists test_procedures
(
    test_id    bigint       not null,
    procedures varchar(255) null,
    constraint fk_test_procedures_on_test foreign key (test_id) REFERENCES test (id)
);


insert into test (category, created_at, updated_at)
values ('HEMATOLOGICAL TESTS', current_date(), current_date()),
       ('CHEMISTRY INVESTIGATIONS', current_date(), current_date()),
       ('MICROBIOLOGY AND PARASITOLOGY', current_date(), current_date()),
       ('ADVANCED LABORATORY INVESTIGATIONS/PATHOLOGY', current_date(), current_date());
-- HEMATOLOGICAL TESTS
insert into test_procedures (procedures, test_id)
values ('Blood Film', 1),
       ('Blood group (on request by clinician)', 1),
       ('Blood Pregnancy (Beta HCG) Test', 1),
       ('Erythrocyte Sedimentation Rate (ESR)', 1),
       ('Full Blood Count and differentials (FBC)', 1),
       (' Genotype (on request by clinician)', 1),
       ('Grouping and Cross Matching', 1),
       ('Hemoglobin (HB), HCT, RBC', 1),
       ('MCH', 1),
       ('MCHC', 1),
       ('MCV', 1),
       ('Packed Cell Volume (PCV)', 1),
       ('Platelet count', 1),
       ('Red Blood Cell/Reticulocyte count', 1),
       ('White Blood Cell count', 1),
       ('White cell count (Total and Differential)', 1);

-- ...

-- CHEMISTRY INVESTIGATIONS
insert into test_procedures (procedures, test_id)
values ('Hours Post-prandial Blood Sugar', 2),
       ('Electrolytes, Urea and Creatinine', 2),
       ('Fasting Blood Sugar', 2),
       ('Glucose Challenge Test', 2),
       ('Lipid Profile (Fasting) (Cholesterol, HDL, LDL, Triglyceride Profile)', 2),
       ('Liver Function Test (LFT)', 2),
       ('Oral Glucose Tolerance Test (OGTT)', 2),
       ('Prothrombin Time (PT/INR)', 2),
       ('Random Blood Sugar', 2),
       ('Serum Acid Phosphate', 2),
       ('Serum Albumin', 2),
       ('Serum Alkaline Phosphate', 2),
       ('Serum Bicarbonate', 2),
       ('Serum Bilirubin (Total and Direct)', 2),
       ('Serum Calcium', 2),
       ('Serum Chloride', 2),
       ('Serum Gamma Glutamyl Transferase', 2),
       ('Serum Inorganic Phosphate', 2),
       ('Serum Lactate Dehydrogenase', 2),
       ('Serum Lithium', 2),
       ('Serum Magnesium', 2),
       ('Serum potassium', 2),
       ('Serum Sodium', 2),
       ('Urine Pregnancy Test', 2);

-- ...

-- MICROBIOLOGY AND PARASITOLOGY
insert into test_procedures (procedures, test_id)
values ('Aspirates M/C/S', 3),
       ('Blood Culture', 3),
       ('Cholera Ag', 3),
       ('Ear Swab M/C/S', 3),
       ('Endocervical Swab (ECS) M/C/S', 3),
       ('Eye Swab M/C/S', 3),
       ('H.Pylori', 3),
       ('High Vaginal Swab (HVS) M/C/S', 3),
       ('Leishmania Screening', 3),
       ('Malaria Parasite (MP)', 3),
       ('Mantoux/Heaf\'s Test', 3),
       ('Skin Scraping for Fungi', 3),
       ('Skin Snip for Microfilaria', 3),
       ('Sputum M/C/S, AFB', 3),
       ('Stool M/C/S', 3),
       ('Stool Occult Blood', 3),
       ('Throat Swab M/C/S', 3),
       ('Toxoplasma Screening', 3),
       ('Trypanosomes Screening', 3),
       ('Urethral Swab M/C/S', 3),
       ('Urine M/C/S', 3),
       ('VDRL (Veneral Disease Research Laboratory) Test', 3),
       ('Wound Swab M/C/S', 3);


-- ...

-- ADVANCED LABORATORY INVESTIGATIONS/PATHOLOGY
insert into test_procedures (procedures, test_id)
values ('Alpha-1 Antitrypsin', 4),
       ('HBA1C', 4),
       ('24 Hour Creatinine Clearance', 4),
       ('Bleeding Time', 4),
       ('Blood urea Nitrogen', 4),
       ('Chlamydia Screening', 4),
       ('Clotting Time', 4),
       ('Coomb\'s Test (Direct)', 4),
       ('Coomb\'s Test (Indirect)', 4),
       ('Creatinine phosphokinase', 4),
       ('CSF M/C/S (CSF Analysis)', 4),
       ('D-Dimer', 4),
       ('G-6PD Screening', 4),
       ('Hepatitis B Screening', 4),
       ('Hepatitis B Surface Antigen (HBSAg)', 4),
       ('Hepatitis C Screening', 4),
       ('HIV Confirmatory Test', 4);


-- ...