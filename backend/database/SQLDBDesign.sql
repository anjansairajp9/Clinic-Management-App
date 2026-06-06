CREATE TABLE clinics (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	address TEXT,
	is_super_admin BOOLEAN DEFAULT FALSE,
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
	appointment_type VARCHAR(20) DEFAULT 'scheduled' CHECK (appointment_type IN('scheduled', 'walk_in')), 
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


CREATE TABLE treatments (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL UNIQUE,
    diagnosis TEXT NOT NULL,
    treatment_performed TEXT NOT NULL,
    medicines_prescribed TEXT,
    procedure_notes TEXT,
    follow_up_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_treatment_clinic
        FOREIGN KEY (clinic_id)
        REFERENCES clinics(id)
		ON DELETE CASCADE,

    CONSTRAINT fk_treatment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
		ON DELETE CASCADE,

    CONSTRAINT fk_treatment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
		ON DELETE CASCADE,

    CONSTRAINT fk_treatment_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(id)
		ON DELETE CASCADE
);


CREATE TABLE treatment_files (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER NOT NULL,
    treatment_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_treatment_file_clinic
        FOREIGN KEY (clinic_id)
        REFERENCES clinics(id)
		ON DELETE CASCADE,

    CONSTRAINT fk_treatment_file_treatment
        FOREIGN KEY (treatment_id)
        REFERENCES treatments(id)
		ON DELETE CASCADE
);


CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
	clinic_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL UNIQUE,
    total_amount NUMERIC(10,2) CHECK (total_amount >= 0),
    amount_paid NUMERIC(10,2) DEFAULT 0 CHECK (amount_paid >= 0),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'upi', 'card', 'bank_transfer')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    notes TEXT,
	is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_appointment
        FOREIGN KEY (appointment_id)
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


CREATE INDEX idx_treatments_clinic_id
ON treatments(clinic_id);

CREATE INDEX idx_treatments_patient_id
ON treatments(patient_id);

CREATE INDEX idx_treatments_doctor_id
ON treatments(doctor_id);

CREATE INDEX idx_treatments_appointment_id
ON treatments(appointment_id);


CREATE INDEX idx_treatment_files_treatment_id
ON treatment_files(treatment_id);

CREATE INDEX idx_treatment_files_clinic_id
ON treatment_files(clinic_id);


CREATE INDEX idx_payments_clinic_id
ON payments(clinic_id);

CREATE INDEX idx_payments_payment_status
ON payments(payment_status);


CREATE INDEX idx_refresh_tokens_clinic_id
ON refresh_tokens(clinic_id);


CREATE INDEX idx_password_reset_clinic_id
ON password_reset_tokens(clinic_id);


SELECT * FROM clinics;

SELECT * FROM patients;

SELECT * FROM patient_medical_history;

SELECT * FROM doctors;

SELECT * FROM appointments;

SELECT * FROM treatments;

SELECT * FROM treatment_files;

SELECT * FROM payments;

SELECT * FROM refresh_tokens;

SELECT * FROM password_reset_tokens;
