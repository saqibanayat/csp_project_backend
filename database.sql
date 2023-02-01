CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE ;

CREATE TABLE usersdata(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL
);

CREATE TABLE package_Detail(
  pack_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_title TEXT NOT NULL,
  pack_description TEXT NOT NULL,
  price VARCHAR(20) NOT NULL
 
);
create table serivice_user_profile(
id uuid PRIMARY KEY DEFAULT uuid_generate_v4() ,
first_name varchar(100) not null,
last_name varchar(100) not null,
phone_no bigint not null,
email varchar(100) not null,
user_id uuid REFERENCES usersdata(user_id)
)




CREATE TABLE service_provider_personal_detail(
first_name varchar(30) not null,
last_name varchar(30) not null,
email varchar(60) not null,
company varchar(50) not null,
Addres varchar(50) not null,
city varchar(40) not null,
state char(2) not null,
zip_code smallint not null,
	phone varchar(20) not null,
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  );


  
CREATE TABLE service_user_personal_detail(
first_name varchar(30) not null,
last_name varchar(30) not null,
email varchar(60) not null,
phone varchar(20) not null,
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  );


create table Attribute_pkg(
attribute_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() ,
attribute_name varchar(100) not null

);


create table package_attribute(
attribute_id uuid references attribute_pkg(attribute_id),
pack_id uuid references package_Detail(pack_id),
attruibute_value varchar(255),
	pack_attribute_id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
);


INSERT INTO users (user_name,user_email,user_password) VALUES ('Bob','bob@email.com','bob');


--psql -U postgres
--\c rojertodo
--\dt
--heroku pg:psql