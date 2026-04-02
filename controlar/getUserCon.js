let {modal} = require('../Modal/modal');

const getUserCon = async (req, res) => {
    try {
        // Get email from query parameter
        const { email } = req.query;

        if (!email) {
            return res.status(400).send({ message: 'Email is required', success: false });
        }

        // User data is already verified by verifyToken middleware
        const tokenEmail = req.user.email;

        // Check if the token email matches the requested email
        if (tokenEmail !== email) {
            return res.status(403).send({ message: 'Unauthorized access', success: false });
        }

        // Find user by email
        const user = await modal.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }

        // Return user data without password
        const userData = {
            name: user.name,
            email: user.email,
            contact: user.contact,
            age: user.age,
            role: user.role
        };

        res.status(200).send(userData);

    } catch (error) {
        console.error('Error in getUserCon:', error);
        res.status(500).send({ message: 'Server error', success: false });
    }
};

module.exports = getUserCon;
