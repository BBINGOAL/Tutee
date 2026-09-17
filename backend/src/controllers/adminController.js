const userModel = require('../models/userModel');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers
};
