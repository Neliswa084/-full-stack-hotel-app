CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 phone_number VARCHAR(20),
 profile_picture TEXT,
 password_hash VARCHAR(255),
 google_id VARCHAR(255) UNIQUE,
 role VARCHAR(20) NOT NULL DEFAULT 'guest'
 CHECK (role IN ('guest', 'admin')),
 account_status VARCHAR(20) NOT NULL DEFAULT 'active'
 CHECK (account_status IN ('active', 'blocked')),
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 CHECK (password_hash IS NOT NULL OR google_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(9, 6),                   
  longitude DECIMAL(9, 6),
  star_rating INTEGER NOT NULL DEFAULT 3
    CHECK (star_rating BETWEEN 1 AND 5),
  check_in_time TIME NOT NULL DEFAULT '14:00',
  check_out_time TIME NOT NULL DEFAULT '10:00',
  cancellation_policy TEXT,
  children_policy TEXT,
  pet_policy TEXT,
  smoking_policy TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS hotel_images (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main_image BOOLEAN NOT NULL DEFAULT FALSE,   
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS amenities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS hotel_amenities (
  hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  amenity_id INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (hotel_id, amenity_id)
);


CREATE TABLE IF NOT EXISTS room_types (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),           
  price_per_night DECIMAL(10, 2) NOT NULL CHECK (price_per_night >= 0),
  total_rooms INTEGER NOT NULL CHECK (total_rooms >= 0),     -- how many exist
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (hotel_id, name)                     -- no two "Standard Room" in one hotel
);


CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_reference VARCHAR(20) UNIQUE NOT NULL,              
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,     -- empty for walk-ins
  room_type_id INTEGER NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
  guest_first_name VARCHAR(100) NOT NULL,     -- who is actually staying
  guest_last_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(150) NOT NULL,
  guest_phone VARCHAR(20),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_rooms INTEGER NOT NULL DEFAULT 1 CHECK (number_of_rooms > 0),
  number_of_adults INTEGER NOT NULL DEFAULT 1 CHECK (number_of_adults > 0),
  number_of_children INTEGER NOT NULL DEFAULT 0 CHECK (number_of_children >= 0),
  arrival_time VARCHAR(30),
  special_requests TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,    -- price at the time of booking
  total_amount DECIMAL(10, 2) NOT NULL,       -- incl. VAT
  payment_method VARCHAR(20) NOT NULL DEFAULT 'online'
    CHECK (payment_method IN ('online', 'cash_at_hotel', 'card_at_hotel', 'eft')),
  status VARCHAR(20) NOT NULL DEFAULT 'awaiting_payment'
    CHECK (status IN ('awaiting_payment', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (check_out_date > check_in_date)      -- at least 1 night
);



CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  payment_provider VARCHAR(30) NOT NULL,      
  provider_reference VARCHAR(255),            
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, hotel_id)
);


CREATE TABLE IF NOT EXISTS favourites (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, hotel_id)
);



CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL
    CHECK (type IN ('booking_confirmation', 'booking_update', 'promotion')),
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_room_types_hotel ON room_types(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates ON bookings(room_type_id, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel ON reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);



INSERT INTO amenities (name) VALUES
  ('Free Wi-Fi'), ('Pool'), ('Free parking'), ('Breakfast'),
  ('Pet friendly'), ('Air conditioning'), ('Fitness centre'),
  ('Restaurant & bar'), ('24-hour front desk')
ON CONFLICT (name) DO NOTHING;

