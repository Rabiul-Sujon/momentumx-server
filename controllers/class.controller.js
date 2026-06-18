import Class from '../models/Class.js';

// Create class (Trainer)
export const createClass = async (req, res) => {
  try {
    const { name, image, category, difficultyLevel, duration, schedule, price, description } = req.body;

    const newClass = await Class.create({
      name,
      image,
      category,
      difficultyLevel,
      duration,
      schedule,
      price,
      description,
      trainerEmail: req.user.email,
      trainerName: req.user.name,
      status: 'pending',
      bookingCount: 0,
    });

    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved classes (Public) with search, filter, pagination
export const getAllClasses = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;

    const query = { status: 'approved' };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }

    const total = await Class.countDocuments(query);
    const classes = await Class.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      classes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured classes (Public)
export const getFeaturedClasses = async (req, res) => {
  try {
    const classes = await Class.find({ status: 'approved' })
      .sort({ bookingCount: -1 })
      .limit(6);

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single class (Public)
export const getSingleClass = async (req, res) => {
  try {
    const { id } = req.params;
    const singleClass = await Class.findById(id);

    if (!singleClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(singleClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trainer's own classes
export const getTrainerClasses = async (req, res) => {
  try {
    const classes = await Class.find({ trainerEmail: req.user.email })
      .sort({ createdAt: -1 });

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update class (Trainer)
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { ...req.body, status: 'pending' },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete class (Trainer/Admin)
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all classes (Admin)
export const getAllClassesAdmin = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject class (Admin)
export const updateClassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: `Class ${status} successfully`, class: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};