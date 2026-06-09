from contextlib import contextmanager
import os
from pathlib import Path

from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

INIT_SQL_PATH = Path(__file__).resolve().parent.parent / "database" / "init.sql"
POSTGRES_MAINTENANCE_DB = "postgres"

# Opens a connection to the SmartInApp database.
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

# Provides a database cursor and closes the connection safely.
@contextmanager
def get_db_cursor(commit=False):
    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            yield cur

        if commit:
            conn.commit()
    finally:
        conn.close()

# Creates the configured database if it does not already exist.
def create_database_if_missing():
    admin_conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=POSTGRES_MAINTENANCE_DB,
        user=DB_USER,
        password=DB_PASSWORD
    )
    admin_conn.autocommit = True

    try:
        with admin_conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))

            if cur.fetchone() is None:
                cur.execute(
                    sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME))
                )
    finally:
        admin_conn.close()

# Runs the init.sql script to create required tables.
def run_database_init_script():
    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(INIT_SQL_PATH.read_text(encoding="utf-8"))

        conn.commit()
    finally:
        conn.close()

# Makes sure the database exists and has the required schema.
def initialize_database():
    create_database_if_missing()
    run_database_init_script()
