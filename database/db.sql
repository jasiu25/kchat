--
-- PostgreSQL database dump
--

\restrict 2Tj8yURbiLvfu1iZ4baXTgRkoGUOlGEVaklzfa64aH0WaXUlyfHUWgjgX0JVGtL

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: messagetype; Type: TYPE; Schema: public; Owner: jan
--

CREATE TYPE public.messagetype AS ENUM (
    'image',
    'text'
);


ALTER TYPE public.messagetype OWNER TO jan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: jan
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    username character varying(20),
    content character varying(500),
    type public.messagetype
);


ALTER TABLE public.messages OWNER TO jan;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: jan
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO jan;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jan
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: jan
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: jan
--

COPY public.messages (id, username, content, type) FROM stdin;
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jan
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: jan
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2Tj8yURbiLvfu1iZ4baXTgRkoGUOlGEVaklzfa64aH0WaXUlyfHUWgjgX0JVGtL

