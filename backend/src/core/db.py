import psycopg2
from psycopg2 import pool
from contextlib import contextmanager
from src.core.settings import settings

# Connection pool - will be initialized lazily
_connection_pool = None


def get_connection_pool():
    """Get or create the connection pool."""
    global _connection_pool
    if _connection_pool is None:
        DB_CONFIG = {
            "host": settings.DB_HOST,
            "database": settings.DB_NAME,
            "user": settings.DB_USER,
            "password": settings.DB_PASS,
            "port": settings.DB_PORT
        }
        _connection_pool = pool.SimpleConnectionPool(1, 20, **DB_CONFIG)
    return _connection_pool


@contextmanager
def get_db():
    """Get a database cursor from the connection pool."""
    connection_pool = get_connection_pool()
    conn = connection_pool.getconn()
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        connection_pool.putconn(conn)

