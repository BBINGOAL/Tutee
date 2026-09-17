const tutorModel = require('../models/tutorModel');

const getAllTutors = async (req, res) => {
    try {
        const tutors = await tutorModel.getAllTutors();
        res.json(tutors);
    } catch (error) {
        console.error('Error fetching tutors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createTutor = async (req, res) => {
    try {
        const newTutor = await tutorModel.createTutor(req.body);
        res.status(201).json(newTutor);
    } catch (error) {
        console.error('Error creating tutor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTutor = async (req, res) => {
    try {
        const updatedTutor = await tutorModel.updateTutor(req.params.id, req.body);
        if (!updatedTutor) return res.status(404).json({ error: 'Tutor not found' });
        res.json(updatedTutor);
    } catch (error) {
        console.error('Error updating tutor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteTutor = async (req, res) => {
    try {
        const deletedTutor = await tutorModel.deleteTutor(req.params.id);
        if (!deletedTutor) return res.status(404).json({ error: 'Tutor not found' });
        res.json({ message: 'Tutor deleted successfully' });
    } catch (error) {
        console.error('Error deleting tutor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// สั่งให้ AI Service อัปเดต Vector Database
const syncTutors = async (req, res) => {
    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${aiServiceUrl}/api/v1/admin/sync_vectors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`AI Service returned ${response.status}`);
        }

        const data = await response.json();
        res.json({ message: 'Sync successful', details: data });
    } catch (error) {
        console.error('Error syncing vectors:', error);
        res.status(500).json({ error: 'Failed to sync with AI Service' });
    }
};

module.exports = {
    getAllTutors,
    createTutor,
    updateTutor,
    deleteTutor,
    syncTutors
};
