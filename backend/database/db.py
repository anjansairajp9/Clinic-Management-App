from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import RealDictCursor

from backend.core.config import DB_URL

pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    dsn=DB_URL
)

class DBSession:
    def __init__(self, connection):
        self.connection = connection

    def cursor(self):
        return self.connection.cursor(cursor_factory=RealDictCursor)
    
    def commit(self):
        return self.connection.commit()
    
    def rollback(self):
        return self.connection.rollback()
    

def get_db():
    connection = pool.getconn()
    db = DBSession(connection)

    try:
        yield db
    finally:
        pool.putconn(connection)
