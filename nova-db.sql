-- Creación de la base de datos (opcional)
CREATE DATABASE music_service;

-- Selecciona la base de datos
\c music_service;

-- Tabla de Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    has_membership BOOLEAN DEFAULT FALSE,  -- Indica si el usuario tiene una membresía activa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Membresías
CREATE TABLE memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha de pago
    amount NUMERIC(5, 2) NOT NULL CHECK (amount = 5.00),  -- Pago fijo de 5 dólares
    expires_at TIMESTAMP NOT NULL,  -- Fecha de expiración de la membresía
    is_active BOOLEAN DEFAULT TRUE  -- Estado de la membresía
);

-- Tabla de Salas
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,  -- Define si la sala es privada
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,  -- Creador de la sala
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Estaciones de Radio
CREATE TABLE radio_stations (
    station_id SERIAL PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,  -- Creador de la estación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios en Salas
CREATE TABLE room_users (
    room_user_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios en Estaciones de Radio
CREATE TABLE station_users (
    station_user_id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES radio_stations(station_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reproducción Actual
CREATE TABLE current_playback (
    playback_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE SET NULL,
    station_id INTEGER REFERENCES radio_stations(station_id) ON DELETE SET NULL,
    track_url VARCHAR(255) NOT NULL,  -- URL de la canción en SoundCloud
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mensajes (Opcional)
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(room_id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES radio_stations(station_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
