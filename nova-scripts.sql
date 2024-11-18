-- Agregar usuarios
INSERT INTO users (username, email, password_hash, has_membership)
VALUES 
    ('user1', 'user1@example.com', 'hash1', TRUE),
    ('user2', 'user2@example.com', 'hash2', FALSE),
    ('user3', 'user3@example.com', 'hash3', TRUE);

-- Verificar los usuarios agregados
SELECT * FROM users;


-- Agregar membresías (suponiendo que la membresía dura un mes)
INSERT INTO memberships (user_id, amount, expires_at)
VALUES 
    (1, 5.00, CURRENT_TIMESTAMP + INTERVAL '1 month'),
    (4, 5.00, CURRENT_TIMESTAMP + INTERVAL '1 month');

-- Verificar las membresías agregadas
SELECT * FROM memberships;



-- Crear salas públicas y privadas
INSERT INTO rooms (room_name, is_private, created_by)
VALUES 
    ('Sala Pública 1', FALSE, 1),
    ('Sala Privada', TRUE, 2),
    ('Sala Pública 2', FALSE, 3);

-- Verificar las salas creadas
SELECT * FROM rooms;
DELETE FROM rooms where room_id = 5;

-- Agregar estaciones de radio
INSERT INTO radio_stations (station_name, created_by)
VALUES 
    ('Estación Rock', 1),
    ('Estación Jazz', 2);

-- Verificar las estaciones de radio agregadas
SELECT * FROM radio_stations;



-- Agregar usuarios a las salas
INSERT INTO room_users (room_id, user_id)
VALUES 
    (1, 1),
    (1, 2),
    (2, 2),
    (3, 3);

-- Verificar usuarios en las salas
SELECT * FROM room_users;



-- Agregar usuarios a estaciones de radio
INSERT INTO station_users (station_id, user_id)
VALUES 
    (1, 1),
    (1, 3),
    (2, 2);

-- Verificar usuarios en las estaciones
SELECT * FROM station_users;


-- Agregar una reproducción de canción
INSERT INTO current_playback (room_id, station_id, track_url)
VALUES 
    (1, NULL, 'https://soundcloud.com/track1'),
    (NULL, 1, 'https://soundcloud.com/track2');

-- Verificar las reproducciones actuales
SELECT * FROM current_playback;



-- Agregar mensajes en una sala y en una estación
INSERT INTO messages (room_id, station_id, user_id, content)
VALUES 
    (1, NULL, 1, 'Hola a todos en la sala!'),
    (NULL, 1, 2, 'Disfruten la música de la estación!');

-- Verificar los mensajes
SELECT * FROM messages;

-- Usuarios con membresía activa
SELECT username, email 
FROM users 
WHERE has_membership = TRUE;


-- Salas públicas y sus creadores
SELECT room_name, username AS created_by 
FROM rooms 
JOIN users ON rooms.created_by = users.user_id 
WHERE is_private = FALSE;


-- Canciones en reproducción por sala y estación
SELECT room_name, station_name, track_url 
FROM current_playback 
LEFT JOIN rooms ON current_playback.room_id = rooms.room_id 
LEFT JOIN radio_stations ON current_playback.station_id = radio_stations.station_id;
