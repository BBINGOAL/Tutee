const pool = require('../config/db');

// สร้างตาราง tutors ถ้ายังไม่มี
const createTutorTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS tutors (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            subjects TEXT[],
            skill_level TEXT,
            price_per_hour FLOAT,
            rating FLOAT DEFAULT 0,
            experience_years INTEGER,
            availability TEXT[],
            bio TEXT,
            teaching_style TEXT,
            reviews TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Tutors table initialized");
    } catch (err) {
        console.error("Error creating tutors table", err);
    }
};

const getAllTutors = async () => {
    const query = 'SELECT * FROM tutors ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
};

const createTutor = async (tutorData) => {
    const { name, subjects, skill_level, price_per_hour, experience_years, availability, bio, teaching_style } = tutorData;
    const query = `
        INSERT INTO tutors (name, subjects, skill_level, price_per_hour, experience_years, availability, bio, teaching_style)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [name, subjects, skill_level, price_per_hour, experience_years, availability, bio, teaching_style];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateTutor = async (id, tutorData) => {
    const { name, subjects, skill_level, price_per_hour, experience_years, availability, bio, teaching_style } = tutorData;
    const query = `
        UPDATE tutors 
        SET name = $1, subjects = $2, skill_level = $3, price_per_hour = $4, experience_years = $5, availability = $6, bio = $7, teaching_style = $8
        WHERE id = $9
        RETURNING *;
    `;
    const values = [name, subjects, skill_level, price_per_hour, experience_years, availability, bio, teaching_style, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteTutor = async (id) => {
    const query = 'DELETE FROM tutors WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    createTutorTable,
    getAllTutors,
    createTutor,
    updateTutor,
    deleteTutor
};
