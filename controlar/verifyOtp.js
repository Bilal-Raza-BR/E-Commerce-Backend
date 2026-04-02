const { modal } = require('../Modal/modal');
const OtpModel = require('../Modal/OtpModal');
const bcrypt = require('bcryptjs');

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ message: 'Email and OTP are required', success: false });
    }

    // Find the OTP in the store
    const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).send({ message: 'No OTP was sent to this email', success: false });
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.expiry) {
      await OtpModel.deleteMany({ email });
      return res.status(400).send({ message: 'OTP has expired. Please request a new one', success: false });
    }

    // Verify OTP
    if (otpRecord.otp.toString() !== otp.toString()) {
      return res.status(400).send({ message: 'Invalid OTP', success: false });
    }

    // If newPassword is provided, update the user's password
    if (newPassword) {
      const user = await modal.findOne({ email });
      
      if (!user) {
        return res.status(404).send({ message: 'User not found', success: false });
      }

      // Hash the new password
      const hash = await bcrypt.hash(newPassword, 10);
      
      // Update user's password
      await modal.updateOne({ email }, { password: hash });
    }

    // Remove the OTP from store after successful verification
    await OtpModel.deleteMany({ email });

    return res.status(200).send({ 
      message: newPassword ? 'Password updated successfully' : 'OTP verified successfully', 
      success: true 
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

module.exports = verifyOtp;
