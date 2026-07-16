import User from "../models/User.js";
import Role from "../models/Role.js";

// ============ Users ============
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles", "name permissions").select("-passwordHash");
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUser = async (req, res) => {
  try {
    const { roles, isActive, fullName } = req.body;
    const update = {};
    if (roles !== undefined) update.roles = roles;
    if (isActive !== undefined) update.isActive = isActive;
    if (fullName) update.fullName = fullName;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).populate("roles", "name");
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ============ Roles ============
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.create({ name, description, permissions });
    res.status(201).json(role);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { name, description, permissions }, { new: true });
    res.json(role);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ============ Settings toggle ============
let forceEmailVerification = false;
export const getSettings = (req, res) => {
  res.json({ forceEmailVerification });
};
export const updateSettings = (req, res) => {
  forceEmailVerification = req.body.forceEmailVerification ?? forceEmailVerification;
  res.json({ forceEmailVerification });
};
