create table if not exists accolade
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    description varchar
(
    255
) null,
    doctor_id bigint null,
    name int null,
    year bigint null
    );

create table if not exists calendar
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    all_day bit null,
    availability_status bit null,
    color varchar
(
    255
) null,
    description varchar
(
    255
) null,
    doctor_id bigint null,
    end datetime
(
    6
) null,
    patient_appointment bit null,
    start datetime
(
    6
) null,
    title varchar
(
    255
) null,
    url varchar
(
    255
) null
    );

create table if not exists child
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    allergies varchar
(
    255
) null,
    blood_type varchar
(
    255
) null,
    date_of_birth datetime
(
    6
) null,
    disabilities varchar
(
    255
) null,
    first_name varchar
(
    255
) null,
    gender varchar
(
    255
) null,
    height_cm double not null,
    national_id_number varchar
(
    255
) null,
    sur_name varchar
(
    255
) null,
    user_id bigint null,
    weight double not null
    );

create table if not exists consultation_sbar
(
    id
    bigint
    auto_increment
    primary
    key,
    assessment
    varchar
(
    1500
) null,
    background varchar
(
    1500
) null,
    diagnosis varchar
(
    1500
) null,
    notes varchar
(
    1500
) null,
    recommendation varchar
(
    1500
) null,
    situation varchar
(
    1500
) null
    );

create table if not exists doctor
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    account_status varchar
(
    255
) null,
    account_type varchar
(
    255
) null,
    avatar varchar
(
    5000
) null,
    avatar_file_name varchar
(
    255
) null,
    avatar_url_expiry_date bigint null,
    city                   varchar(255)  null,
    country                varchar(255)  null,
    date_of_birth          datetime(6)   null,
    first_name             varchar(255)  null,
    gender                 varchar(255)  null,
    graduation_date        datetime(6)   null,
    hospital               varchar(255)  null,
    last_name              varchar(255)  null,
    certificate_number     varchar(255)  null,
    expiration_date        datetime(6)   null,
    issued_date            datetime(6)   null,
    national_id_number     bigint        null,
    provider_id            bigint        null,
    provider_name          varchar(255)  null,
    state                  varchar(255)  null,
    street                 varchar(255)  null,
    street_number          bigint        null,
    student_id_number      varchar(255)  null,
    system_status          varchar(255)  null,
    university             varchar(255)  null,
    user_id                bigint        null,
    work_address           varchar(255)  null,
    work_email             varchar(255)  null,
    work_mobile            varchar(255)  null,
    zip_code               bigint        null,
    constraint UK_4fopttygr2ek2sjn8dtn1w3hp
        unique (certificate_number),
    constraint UK_mpqwfnc79xoayxsuhlgg87ces
        unique (national_id_number),
    constraint UK_tmlnrg6ydhvvhpkingupi5mbp
        unique (student_id_number)
);

create table if not exists follow_up
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    consultation_id bigint null,
    doctor_id bigint null,
    follow_up_date datetime
(
    6
) null,
    location varchar
(
    255
) null,
    patient_id bigint null,
    price double null,
    purpose varchar
(
    255
) null,
    status varchar
(
    255
) null
    );

create table if not exists consultation
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    amount_paid varchar
(
    255
) null,
    audio_detailed_description longblob null,
    consultation_url varchar
(
    255
) null,
    doctor_full_name varchar
(
    255
) null,
    doctor_id bigint null,
    duration                   double       null,
    language                   varchar(255) null,
    patient_full_name          varchar(255) null,
    patient_id                 bigint       null,
    patient_mobile             varchar(255) null,
    price_list_name            varchar(255) null,
    rating                     int          null,
    room_name                  varchar(255) null,
    status                     varchar(255) null,
    text_detailed_description  longtext     null,
    time_accepted              datetime(6)  null,
    time_booked datetime
(
    6
) null,
    time_finished datetime
(
    6
) null,
    time_started datetime
(
    6
) null,
    transaction_reference varchar
(
    255
) null,
    transaction_url varchar
(
    255
) null,
    follow_up_id bigint null,
    sbar_id bigint null,
    constraint FK3a1utnvrj05njvmdc644nxl8c
    foreign key
(
    follow_up_id
) references follow_up
(
    id
),
    constraint FKp5box13p47tl172n89vielwo1
    foreign key
(
    sbar_id
) references consultation_sbar
(
    id
)
    );

create table if not exists consultation_body_area
(
    consultation_id
    bigint
    not
    null,
    body_area
    varchar
(
    255
) not null,
    primary key
(
    consultation_id,
    body_area
),
    constraint FKexcuvfdfgo2d4qijt0gw4b2kd
    foreign key
(
    consultation_id
) references consultation
(
    id
)
    );

create table if not exists consultation_related_symptoms
(
    consultation_id
    bigint
    not
    null,
    related_symptoms
    varchar
(
    255
) not null,
    primary key
(
    consultation_id,
    related_symptoms
),
    constraint FKef36ay4idwf01q78hqaqgbxkm
    foreign key
(
    consultation_id
) references consultation
(
    id
)
    );

create table if not exists consultation_symptoms
(
    consultation_id
    bigint
    not
    null,
    symptoms
    varchar
(
    255
) not null,
    primary key
(
    consultation_id,
    symptoms
),
    constraint FKbt3oqag0iv36t15dbxkb7xpp0
    foreign key
(
    consultation_id
) references consultation
(
    id
)
    );

create table if not exists forgot_password_token
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    email varchar
(
    255
) null,
    expires_at datetime
(
    6
) null,
    status varchar
(
    255
) null,
    token varchar
(
    255
) null,
    tries int not null
    );

create table if not exists invitation
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    email varchar
(
    255
) null,
    invited_by_id bigint null,
    invited_by_name varchar
(
    255
) null,
    name varchar
(
    255
) null,
    registration_date datetime
(
    6
) null,
    status varchar
(
    255
) null
    );

create table if not exists labrequest
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    consultation_id bigint null,
    doctor_id bigint null,
    doctor_name varchar
(
    255
) null,
    patient_id bigint null,
    patient_name varchar
(
    255
) null,
    reason varchar
(
    255
) null,
    test varchar
(
    255
) null
    );

create table if not exists message
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    has_been_read bit not null,
    is_welcome_message bit not null,
    message longtext null,
    sender varchar
(
    255
) null,
    subject varchar
(
    255
) null,
    user_id bigint null
    );

create table if not exists patient
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    date_of_birth datetime
(
    6
) null,
    first_name varchar
(
    255
) null,
    has_children bit not null,
    closest_hospital varchar
(
    255
) null,
    preferred_language varchar
(
    255
) null,
    address            varchar(255) null,
    city               varchar(255) null,
    community          varchar(255) null,
    country            varchar(255) null,
    state              varchar(255) null,
    zip_code           bigint       null,
    marital_status     varchar(255) null,
    national_id_number varchar
(
    255
) null,
    num_of_children int not null,
    blood_type varchar
(
    255
) null,
    gender varchar
(
    255
) null,
    height_cm bigint null,
    weight_kg bigint null,
    provider_id bigint null,
    sur_name varchar
(
    255
) null,
    title varchar
(
    255
) null,
    user_id bigint null
    );

create table if not exists patient_allergies
(
    patient_id
    bigint
    not
    null,
    allergies
    varchar
(
    255
) null,
    constraint FKjbh6hvm7cye07kuh83u1chl7v
    foreign key
(
    patient_id
) references patient
(
    id
)
    );

create table if not exists patient_children
(
    patient_id
    bigint
    not
    null,
    children_id
    bigint
    not
    null,
    constraint
    UK_phtw6ru63fl4j73447yerg7ep
    unique
(
    children_id
),
    constraint FK3jgilmamllfwtbapl5ntyoya1
    foreign key
(
    patient_id
) references patient
(
    id
),
    constraint FKssli8ko8j6tl9yxpvjwpkhsjp
    foreign key
(
    children_id
) references child
(
    id
)
    );

create table if not exists patient_disabilities
(
    patient_id
    bigint
    not
    null,
    disabilities
    varchar
(
    255
) null,
    constraint FKhbs9pghxw5sau26tiolcsx184
    foreign key
(
    patient_id
) references patient
(
    id
)
    );

create table if not exists patient_languages
(
    patient_id
    bigint
    not
    null,
    languages
    varchar
(
    255
) null,
    constraint FK1bsf62rrsrj6dag44ba2kn47r
    foreign key
(
    patient_id
) references patient
(
    id
)
    );

create table if not exists patient_medical_problems
(
    patient_id
    bigint
    not
    null,
    medical_problems
    varchar
(
    255
) null,
    constraint FKl7igv2i3ijpwnmoulasgbpsos
    foreign key
(
    patient_id
) references patient
(
    id
)
    );

create table if not exists pay_out
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    commission double not null,
    date_on_pay_roll datetime
(
    6
) null,
    date_on_pay_slip datetime
(
    6
) null,
    date_paid_out datetime
(
    6
) null,
    on_pay_roll bit not null,
    on_pay_slip      bit          not null,
    paid_by_user_id  bigint       null,
    paid_out bit not null,
    pay_stack_ref varchar
(
    255
) null,
    payout_reference varchar
(
    255
) null,
    price double not null,
    price_list_name varchar
(
    255
) null,
    service_id bigint null,
    to_be_paid_out double not null,
    user_id bigint not null,
    vat double not null,
    constraint UK_8lg2thcoaqcq0hw5ke4a5y5bd
    unique
(
    pay_stack_ref
),
    constraint UK_lirjvolrud5i02nqbfe2ua6ya
    unique
(
    service_id
)
    );

create table if not exists pay_stack_data
(
    reference varchar
(
    255
) not null
    primary key,
    amount double null,
    domain varchar
(
    255
) null,
    paid_at datetime
(
    6
) null,
    status varchar
(
    255
) null
    );

create table if not exists prescription
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    amount_per_withdrawal varchar
(
    255
) null,
    consultation_id bigint null,
    doctor_id bigint null,
    dosage varchar
(
    255
) null,
    frequency varchar
(
    255
) null,
    fulfilled_date        datetime(6)  null,
    illness               varchar(255) null,
    issue_date            datetime(6)  null,
    issuer_name varchar
(
    255
) null,
    medication_name varchar
(
    255
) null,
    medication_strength varchar
(
    255
) null,
    medication_type varchar
(
    255
) null,
    patient_id bigint null,
    quantity varchar
(
    255
) null,
    recipient_name varchar
(
    255
) null,
    status varchar
(
    255
) null,
    treatment_duration varchar
(
    255
) null,
    withdrawals varchar
(
    255
) null
    );

create table if not exists price_list
(
    name varchar
(
    255
) not null
    primary key
    );

create table if not exists price_list_prices
(
    price_list_name varchar
(
    255
) not null,
    prices double null,
    prices_key varchar
(
    255
) not null,
    primary key
(
    price_list_name,
    prices_key
),
    constraint FKm2q9aouqpdg0gg2qj93hxhgw1
    foreign key
(
    price_list_name
) references price_list
(
    name
)
    );

create table if not exists provider
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    address varchar
(
    255
) null,
    bucket_name varchar
(
    255
) null,
    email varchar
(
    255
) null,
    logo_file_path varchar
(
    255
) null,
    logourl varchar
(
    512
) null,
    phone_number varchar
(
    255
) null,
    practice_number varchar
(
    255
) null,
    provider_name varchar
(
    255
) null,
    secondary_email varchar
(
    255
) null,
    web_page_url varchar
(
    255
) null
    );

create table if not exists role
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    name varchar
(
    20
) null,
    constraint UK_8sewwnpamngi6b1dwaa88askk
    unique
(
    name
)
    );

create table if not exists message_roles
(
    message_id
    bigint
    not
    null,
    roles_id
    bigint
    not
    null,
    primary
    key
(
    message_id,
    roles_id
),
    constraint FKou84d1tojrmakpcov8acytka5
    foreign key
(
    message_id
) references message
(
    id
),
    constraint FKrc4f4wk8ihqmvrte9w9nosfmk
    foreign key
(
    roles_id
) references role
(
    id
)
    );

create table if not exists system_admin
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    first_name varchar
(
    255
) null,
    last_name varchar
(
    255
) null,
    user_id bigint null
    );

create table if not exists template
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    html varchar
(
    5000
) null,
    sender varchar
(
    255
) null,
    subject varchar
(
    255
) null,
    template_type varchar
(
    255
) null
    );

create table if not exists transaction
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    account varchar
(
    255
) null,
    amount double null,
    reference varchar
(
    255
) null,
    text varchar
(
    255
) null,
    type varchar
(
    255
) null
    );

create table if not exists user
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    consent bit null,
    email varchar
(
    50
) null,
    mobile varchar
(
    20
) null,
    password varchar
(
    120
) null,
    profile_complete bit null,
    referral_code varchar
(
    255
) null,
    referral_count bigint null,
    constraint UK_cnjwxx5favk5ycqajjt17fwy1
    unique
(
    mobile
)
    );

create table if not exists support_inquiry
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    issuer_name varchar
(
    255
) null,
    message varchar
(
    255
) null,
    resolved_at datetime
(
    6
) null,
    status varchar
(
    255
) null,
    subject varchar
(
    255
) null,
    issuer_id bigint null,
    constraint FKa0x5ptwii9a951d2qcp7rmvyq
    foreign key
(
    issuer_id
) references user
(
    id
)
    );

create table if not exists support_ticket
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    category varchar
(
    255
) null,
    priority varchar
(
    255
) null,
    status varchar
(
    255
) null,
    type varchar
(
    255
) null,
    assignee_id bigint null,
    created_by_id bigint null,
    inquiry_id bigint null,
    constraint FKcj3gy2uhgx4u9pcdgcy3pd60b
    foreign key
(
    assignee_id
) references system_admin
(
    id
),
    constraint FKlxfhk4uno7i28rd44fttd9r6c
    foreign key
(
    created_by_id
) references system_admin
(
    id
),
    constraint FKsnkcf6iv4jlu1w6s09h23rl37
    foreign key
(
    inquiry_id
) references support_inquiry
(
    id
)
    );

create table if not exists support_actions
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    action varchar
(
    255
) null,
    message varchar
(
    255
) null,
    ticket_id bigint null,
    user_id bigint null,
    constraint FKtb3l1q1cos16ypxapngwl632m
    foreign key
(
    ticket_id
) references support_ticket
(
    id
)
    );

create table if not exists support_comments
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    hidden bit null,
    message varchar
(
    255
) null,
    ticket_id bigint null,
    user_id bigint null,
    constraint FKfl7hung2sw0smaa0glbct78s6
    foreign key
(
    ticket_id
) references support_ticket
(
    id
)
    );

create table if not exists support_ticket_tags
(
    support_ticket_id
    bigint
    not
    null,
    tags
    varchar
(
    255
) null,
    constraint FKjx9dkkeo0imah88jk1htf5onl
    foreign key
(
    support_ticket_id
) references support_ticket
(
    id
)
    );

create table if not exists user_roles
(
    role_name varchar
(
    20
) null,
    user_id bigint not null
    primary key,
    constraint FK40cm955hgg5oxf1oax8mqw0c4
    foreign key
(
    user_id
) references user
(
    id
),
    constraint FKsc25qhxqgte4tg9mp1n1as93f
    foreign key
(
    role_name
) references role
(
    name
)
    );

create table if not exists wallet
(
    id
    bigint
    auto_increment
    primary
    key,
    created_at
    datetime
(
    6
) null,
    updated_at datetime
(
    6
) null,
    balance double null,
    user_id bigint null,
    constraint UK_hgee4p1hiwadqinr0avxlq4eb
    unique
(
    user_id
)
    );

create table if not exists wallet_transactions
(
    wallet_id
    bigint
    not
    null,
    transactions_id
    bigint
    not
    null,
    constraint
    UK_ih1d10xdrgoibf7na9f3lcb1
    unique
(
    transactions_id
),
    constraint FKonlomrlex2xve70hclq5lv3hu
    foreign key
(
    wallet_id
) references wallet
(
    id
),
    constraint FKq69qt10ehfrpwl66wwxdh8h9
    foreign key
(
    transactions_id
) references transaction
(
    id
)
    );

