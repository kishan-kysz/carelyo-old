drop table if exists patient_children;
drop table if exists child_languages;
drop table if exists child;
alter table consultation drop column child_id;
create table if not exists relationship
(
    id              bigint auto_increment
        primary key,
    created_at      datetime(6)  null,
    updated_at      datetime(6)  null,
    access          bit          null,
    can_login       bit          null,
    related_user_id bigint       null,
    relation        varchar(255) null,
    type            varchar(255) null
);
create table if not exists patient_relationships
(
    patient_id       bigint not null,
    relationships_id bigint not null,
    constraint UK_q1s7ncx6kjixh4iq1o0gxic71
        unique (relationships_id),
    constraint FKjddknha3str9hb7u5ytlbtygb
        foreign key (relationships_id) references relationship (id),
    constraint FKpgivybnx8bd7lt48y1jlvksar
        foreign key (patient_id) references patient (id)
);
create table if not exists relationship_access_options
(
    relationship_id bigint       not null,
    access_options  varchar(255) null,
    constraint FKah2wd9tpuwrloeqkihe6mbcos
        foreign key (relationship_id) references relationship (id)
);