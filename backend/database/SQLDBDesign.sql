CREATE TABLE clinics (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	address TEXT,
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE patients (
	id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	gender VARCHAR(20),
	dob DATE,
	notes TEXT,
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_patients_clinic
		FOREIGN KEY(clinic_id) 
		REFERENCES clinics(id)
		ON DELETE CASCADE,

	CONSTRAINT unique_patient_phone_per_clinic
		UNIQUE(clinic_id, phone)
);


CREATE TABLE patient_medical_history (
	id SERIAL PRIMARY KEY,
	patient_id INTEGER NOT NULL UNIQUE,
	data JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_medical_history_patient
		FOREIGN KEY(patient_id)
		REFERENCES patients(id)
		ON DELETE CASCADE
);


CREATE TABLE doctors (
	id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	specialization VARCHAR(255) NOT NULL,
	notes TEXT,
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_doctors_clinic
		FOREIGN KEY(clinic_id)
		REFERENCES clinics(id)
		ON DELETE CASCADE,

	CONSTRAINT unique_doctor_phone_per_clinic
		UNIQUE(clinic_id, phone)
);


CREATE TABLE appointments (
	id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
	patient_id INTEGER NOT NULL,
	doctor_id INTEGER NOT NULL,
	appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
	status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN('scheduled', 'completed', 'cancelled', 'no_show')),
	complaint TEXT,
	notes TEXT,
	total_amount NUMERIC(10, 2) DEFAULT 0 CHECK (total_amount >= 0),
	reminder_sent BOOLEAN DEFAULT FALSE,
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_appointments_clinic
		FOREIGN KEY(clinic_id)
		REFERENCES clinics(id)
		ON DELETE CASCADE,

	CONSTRAINT fk_appointments_patient
		FOREIGN KEY(patient_id)
		REFERENCES patients(id)
		ON DELETE CASCADE,

	CONSTRAINT fk_appointments_doctor
		FOREIGN KEY(doctor_id)
		REFERENCES doctors(id)
		ON DELETE CASCADE
);


CREATE TABLE payments (
	id SERIAL PRIMARY KEY,
	appointment_id INTEGER NOT NULL,
	amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
	payment_method VARCHAR(100),
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_payments_appointment
		FOREIGN KEY(appointment_id)
		REFERENCES appointments(id)
		ON DELETE CASCADE
);


CREATE TABLE refresh_tokens (
	id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
	token TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL,

	CONSTRAINT fk_refresh_tokens_clinic
		FOREIGN KEY(clinic_id)
		REFERENCES clinics(id)
		ON DELETE CASCADE
);


CREATE TABLE password_reset_tokens (
	id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
	token TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL,
	used BOOLEAN DEFAULT FALSE,

	CONSTRAINT fk_password_reset_clinic
		FOREIGN KEY(clinic_id)
		REFERENCES clinics(id)
		ON DELETE CASCADE
);



CREATE INDEX idx_patients_clinic_id
ON patients(clinic_id);

CREATE INDEX idx_patients_phone
ON patients(phone);

CREATE INDEX idx_patients_name
ON patients(name);

CREATE INDEX idx_doctors_clinic_id
ON doctors(clinic_id);

CREATE INDEX idx_doctors_phone
ON doctors(phone);

CREATE INDEX idx_doctors_name
ON doctors(name);

CREATE INDEX idx_appointments_clinic_id
ON appointments(clinic_id);

CREATE INDEX idx_appointments_patient_id
ON appointments(patient_id);

CREATE INDEX idx_appointments_doctor_id
ON appointments(doctor_id);

CREATE INDEX idx_appointments_time
ON appointments(appointment_time);

CREATE INDEX idx_appointments_status
ON appointments(status);

CREATE INDEX idx_payments_appointment_id
ON payments(appointment_id);

CREATE INDEX idx_refresh_tokens_clinic_id
ON refresh_tokens(clinic_id);

CREATE INDEX idx_password_reset_clinic_id
ON password_reset_tokens(clinic_id);


SELECT * FROM clinics;

SELECT * FROM patients;

SELECT * FROM patient_medical_history;

SELECT * FROM doctors;

SELECT * FROM appointments;

SELECT * FROM payments;

SELECT * FROM refresh_tokens;

SELECT * FROM password_reset_tokens;
