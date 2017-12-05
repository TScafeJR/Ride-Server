/* Replace with your SQL commands */

create table users (
  id serial primary key,
  username varchar not null,
  password varchar not null,
  "createdAt" timestamp,
  "updatedAt" timestamp
);