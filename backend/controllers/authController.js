
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Institution = require("../models/Institution");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("A secure JWT_SECRET must be configured");
  }

  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      algorithm: "HS256"
    }
  );
};

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "RECRUITER",
      institutionName,
      institutionCode,
      address
    } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address"
      });
    }

    if (password.length < 12 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 12 and 72 characters"
      });
    }

    if (!["RECRUITER", "INSTITUTION", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account role"
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Recruiter and Admin accounts do not belong to an institution.
    if (role !== "INSTITUTION") {
      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role,
        institutionId: null
      });

      const token = createToken(user._id);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: null
        }
      });
    }

    // Institution registration requires institution details.
    if (
      typeof institutionName !== "string" ||
      institutionName.trim().length < 2 ||
      typeof institutionCode !== "string" ||
      institutionCode.trim().length < 2 ||
      institutionCode.trim().length > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "Institution name and a valid institution code are required"
      });
    }

    const cleanInstitutionCode = institutionCode.trim().toUpperCase();

    const existingInstitution = await Institution.findOne({
      code: cleanInstitutionCode
    });

    if (existingInstitution) {
      return res.status(409).json({
        success: false,
        message: "Institution code already exists"
      });
    }

    // Create the institution first, then link its ID to the user.
    // If user creation fails, remove the institution to avoid an orphan.
    const institution = await Institution.create({
      name: institutionName.trim(),
      code: cleanInstitutionCode,
      email: cleanEmail,
      address: typeof address === "string" ? address.trim() : "",
      isVerified: false
    });

    try {
      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: "INSTITUTION",
        institutionId: institution._id
      });

      const token = createToken(user._id);

      return res.status(201).json({
        success: true,
        message: "Institution registered successfully. Awaiting admin verification.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId
        },
        institution: {
          id: institution._id,
          name: institution.name,
          code: institution.code,
          isVerified: institution.isVerified
        }
      });
    } catch (userError) {
      await Institution.findByIdAndDelete(institution._id);
      throw userError;
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or institution code already exists"
      });
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId || null
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      institutionId: req.user.institutionId || null
    }
  });
};

module.exports = {
  register,
  login,
  getMe
};
