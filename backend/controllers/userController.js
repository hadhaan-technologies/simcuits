import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    const users = await User.find().skip(skip).limit(limit).select("-password");

    res.status(200).json({
      users,
      total,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, location, github, website } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username !== undefined) {
      user.username = username.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (github !== undefined) {
      user.github = github.trim();
    }

    if (website !== undefined) {
      user.website = website.trim();
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

export const getActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("activity");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      activity: user.activity || [],
    });
  } catch (error) {
    console.error("Get activity error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
