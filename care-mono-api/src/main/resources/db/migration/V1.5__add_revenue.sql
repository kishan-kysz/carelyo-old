create table if not exists revenue
(
    id             bigint auto_increment primary key,
    created_at     datetime(6)  null,
    updated_at     datetime(6)  null,
    account        varchar(255) null,
    amount         double       null,
    reference      varchar(255) null,
    text           varchar(255) null,
    type           varchar(255) null,
    consultationId bigint       not null,
    doctorId       bigint       not null
);

alter table wallet
    add column external_account varchar(255) null,
    add column virtual_account  varchar(255) null;