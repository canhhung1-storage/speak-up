-- ==============================================================================
-- 🐘 SpeakUp PostgreSQL Initialization Script
-- Tự động chạy khi container khởi tạo database lần đầu
-- ==============================================================================

-- Bật các extensions mạnh mẽ cho UUID và mã hóa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tạo bảng kiểm tra health check đơn giản
CREATE TABLE IF NOT EXISTS system_health (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    initialized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_health (service_name, status)
VALUES ('speakup_db', 'HEALTHY')
ON CONFLICT DO NOTHING;
