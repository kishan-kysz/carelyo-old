alter table menstruation drop column end_of_cycle;
alter table menstruation add column end_of_cycle_date datetime(6) null;
alter table menstruation add column start_of_cycle_date datetime(6) null;