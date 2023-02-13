/* Replace with your SQL commands */


    -- Table: public.user_role

-- DROP TABLE IF EXISTS public.user_role;

CREATE TABLE IF NOT EXISTS public.user_role
(
    role_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_type_name character varying(30) COLLATE pg_catalog."default" NOT NULL,
   
    CONSTRAINT user_type_pkey PRIMARY KEY (role_id)
   
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_type
    OWNER to postgres;


-- Table: public.attribute_pkg

-- DROP TABLE IF EXISTS public.attribute_pkg;

CREATE TABLE IF NOT EXISTS public.attribute_pkg
(
    attribute_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    attribute_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT attribute_pkg_pkey PRIMARY KEY (attribute_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.attribute_pkg
    OWNER to postgres;


-- Table: public.package_detail

-- DROP TABLE IF EXISTS public.package_detail;

CREATE TABLE IF NOT EXISTS public.package_detail
(
    pack_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    pack_title text COLLATE pg_catalog."default" NOT NULL,
    pack_description text COLLATE pg_catalog."default" NOT NULL,
    price character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT package_detail_pkey PRIMARY KEY (pack_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.package_detail
    OWNER to postgres;



-- Table: public.usersdata

-- DROP TABLE IF EXISTS public.usersdata;

CREATE TABLE IF NOT EXISTS public.usersdata
(
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_name text COLLATE pg_catalog."default" NOT NULL,
    user_email text COLLATE pg_catalog."default" NOT NULL,
    user_password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_data_pkey PRIMARY KEY (user_id),
    role_id uuid,
    CONSTRAINT users_data_user_email_key UNIQUE (user_email),
     CONSTRAINT usersdata_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.user_role (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usersdata
    OWNER to postgres;





-- Table: public.serivice_user_profile

-- DROP TABLE IF EXISTS public.serivice_user_profile;

CREATE TABLE IF NOT EXISTS public.service_user_profile
(
    user_profile_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    first_name character varying(100) COLLATE pg_catalog."default" ,
    last_name character varying(100) COLLATE pg_catalog."default",
    phone_no bigint ,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    user_id uuid,
    CONSTRAINT serivice_user_profile_pkey PRIMARY KEY ( user_profile_id),
    CONSTRAINT serivice_user_profile_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.usersdata (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.serivice_user_profile
    OWNER to postgres;




-- Table: public.service_provider_profile

-- DROP TABLE IF EXISTS public.service_provider_profile;

CREATE TABLE IF NOT EXISTS public.service_provider_profile
(
    provider_profile_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    first_name character varying(30) COLLATE pg_catalog."default",
    last_name character varying(30) COLLATE pg_catalog."default",
    email character varying(60) COLLATE pg_catalog."default" NOT NULL,
    phone_no character varying(20) COLLATE pg_catalog."default" ,
    company character varying(50) COLLATE pg_catalog."default",
    address character varying(50) COLLATE pg_catalog."default" ,
    city character varying(40) COLLATE pg_catalog."default",
    zip_code smallint,
    user_id uuid,
    CONSTRAINT service_provider_detail_pkey PRIMARY KEY ( provider_profile_id),
       
    CONSTRAINT serivice_provider_profile_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.usersdata (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.service_provider_profile
    OWNER to postgres;

    


-- Table: public.package_attribute

-- DROP TABLE IF EXISTS public.package_attribute;

CREATE TABLE IF NOT EXISTS public.package_attribute
(
    attribute_id uuid,
    pack_id uuid,
    attribute_value character varying(255) COLLATE pg_catalog."default",
    pack_attribute_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    CONSTRAINT package_attribute_pkey PRIMARY KEY (pack_attribute_id),
    CONSTRAINT package_attribute_attribute_id_fkey FOREIGN KEY (attribute_id)
        REFERENCES public.attribute_pkg (attribute_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT package_attribute_pack_id_fkey FOREIGN KEY (pack_id)
        REFERENCES public.package_detail (pack_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)