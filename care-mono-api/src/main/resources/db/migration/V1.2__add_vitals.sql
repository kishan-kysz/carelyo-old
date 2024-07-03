create table if not exists blood_glucose
(
    id                       bigint auto_increment
        primary key,
    created_at               datetime(6) null,
    updated_at               datetime(6) null,
    blood_glucose_mmol_per_l double      null,
    date                     datetime(6) null,
    meal_time                datetime(6) null,
    user_id                  bigint      null
);

create table if not exists blood_oxygen
(
    id                      bigint auto_increment
        primary key,
    created_at              datetime(6) null,
    updated_at              datetime(6) null,
    blood_oxygen_percentage double      null,
    date                    datetime(6) null,
    user_id                 bigint      null
);

create table if not exists blood_pressure
(
    id              bigint auto_increment
        primary key,
    created_at      datetime(6) null,
    updated_at      datetime(6) null,
    date            datetime(6) null,
    diastolic_mm_hg double      null,
    systolic_mm_hg  double      null,
    user_id         bigint      null
);

create table if not exists body_temperature
(
    id                       bigint auto_increment
        primary key,
    created_at               datetime(6) null,
    updated_at               datetime(6) null,
    body_temperature_celsius double      null,
    date                     datetime(6) null,
    user_id                  bigint      null
);

create table if not exists heart_rate
(
    id             bigint auto_increment
        primary key,
    created_at     datetime(6) null,
    updated_at     datetime(6) null,
    date           datetime(6) null,
    heart_rate_bpm double      null,
    user_id        bigint      null
);

create table if not exists menstruation
(
    id             bigint auto_increment
        primary key,
    created_at     datetime(6) null,
    updated_at     datetime(6) null,
    date           datetime(6) null,
    flow           int         null,
    start_of_cycle bit         null,
    user_id        bigint      null
);

create table if not exists respiratory_rate
(
    id                 bigint auto_increment
        primary key,
    created_at         datetime(6) null,
    updated_at         datetime(6) null,
    breaths_per_minute double      null,
    date               datetime(6) null,
    user_id            bigint      null
);

