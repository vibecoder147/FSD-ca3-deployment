--
-- PostgreSQL database dump
--

\restrict e3wLK2Jvz8hrG6hGXBVpIdqNn9u4OPyphSWY1ACONxGtXu5w3hVYayEo0Kt5wN3

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_alumni_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_alumni_status AS ENUM (
    'active',
    'inactive',
    'pending'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alumni; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni (
    id integer NOT NULL,
    "fullName" character varying(120) NOT NULL,
    email character varying(255) NOT NULL,
    "gradYear" integer NOT NULL,
    status public.enum_alumni_status DEFAULT 'active'::public.enum_alumni_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: alumni_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alumni_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alumni_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alumni_id_seq OWNED BY public.alumni.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(60) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alumni id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni ALTER COLUMN id SET DEFAULT nextval('public.alumni_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: alumni alumni_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_email_key UNIQUE (email);


--
-- Name: alumni alumni_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict e3wLK2Jvz8hrG6hGXBVpIdqNn9u4OPyphSWY1ACONxGtXu5w3hVYayEo0Kt5wN3

