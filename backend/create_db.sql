CREATE USER imagomundi WITH createdb PASSWORD 'imagomundi';
CREATE DATABASE imagomundi;
GRANT all ON DATABASE imagomundi TO imagomundi;

ALTER DATABASE imagomundi OWNER TO imagomundi;
