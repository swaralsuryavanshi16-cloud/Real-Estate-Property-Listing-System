const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');
const { analyzeDocument } = require('../utils/documentAnalyzer');

// ─── @route  POST /api/properties ────────────────────────────────────────────
// ─── @access Private (admin, agent)
exports.createProperty = async (req, res) => {
  try {
    const {
      title, description, type, status, price, area, areaUnit,
      bedrooms, bathrooms, floors, parking, furnished,
      address, city, state, pincode, lat, lng,
      amenities,
    } = req.body;

    const images = [];
    const documents = [];

    if (req.files) {
      if (req.files.images) {
        req.files.images.forEach((file) => {
          images.push({
            filename: file.filename,
            path: `/uploads/properties/${file.filename}`,
            originalName: file.originalname,
          });
        });
      }
      if (req.files.documents) {
        req.files.documents.forEach((file) => {
          documents.push({
            filename: file.filename,
            path: `/uploads/documents/${file.filename}`,
            originalName: file.originalname,
          });
        });
      }
    }

    const property = await Property.create({
      title, description, type, status, price,
      area, areaUnit, bedrooms, bathrooms, floors,
      parking: parking === 'true' || parking === true,
      furnished,
      location: { address, city, state, pincode, lat, lng },
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
      images,
      documents,
      agent: req.user.id,
      isApproved: req.user.role === 'admin', // Auto-approve if admin
    });

    res.status(201).json({ success: true, message: 'Property created successfully', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/properties ─────────────────────────────────────────────
// ─── @access Private (all roles)
exports.getAllProperties = async (req, res) => {
  try {
    const {
      type, status, city, minPrice, maxPrice, minArea, maxArea,
      bedrooms, furnished, parking, search,
      page = 1, limit = 10, sortBy = 'createdAt', order = 'desc',
    } = req.query;

    const query = { isActive: true };

    // Role-based filter: buyers only see approved listings
    if (req.user.role === 'buyer') {
      query.isApproved = true;
    } else if (req.user.role === 'agent') {
      // Agents see only their own listings (approved or not)
      query.agent = req.user.id;
    }
    // Admin sees all

    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (furnished) query.furnished = furnished;
    if (parking !== undefined) query.parking = parking === 'true';

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('agent', 'name email phone')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/properties/:id ─────────────────────────────────────────
// ─── @access Private (all roles)
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone');

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Buyers can only see approved properties
    if (req.user.role === 'buyer' && !property.isApproved) {
      return res.status(403).json({ success: false, message: 'Property not available.' });
    }

    // Agents can only see their own
    if (req.user.role === 'agent' && property.agent._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PUT /api/properties/:id ─────────────────────────────────────────
// ─── @access Private (admin, agent-owner)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Only admin or the owning agent can update
    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property.' });
    }

    const {
      title, description, type, status, price, area, areaUnit,
      bedrooms, bathrooms, floors, parking, furnished,
      address, city, state, pincode, lat, lng, amenities,
    } = req.body;

    const updateData = {
      title, description, type, status, price,
      area, areaUnit, bedrooms, bathrooms, floors,
      parking: parking === 'true' || parking === true,
      furnished,
      'location.address': address,
      'location.city': city,
      'location.state': state,
      'location.pincode': pincode,
      'location.lat': lat,
      'location.lng': lng,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : property.amenities,
    };

    // Add new images if uploaded
    if (req.files && req.files.images) {
      const newImages = req.files.images.map((file) => ({
        filename: file.filename,
        path: `/uploads/properties/${file.filename}`,
        originalName: file.originalname,
      }));
      updateData.$push = { images: { $each: newImages } };
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Property updated', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/properties/:id ──────────────────────────────────────
// ─── @access Private (admin, agent-owner)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property.' });
    }

    // Soft delete
    await Property.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PATCH /api/properties/:id/approve ───────────────────────────────
// ─── @access Private (admin only)
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    res.status(200).json({ success: true, message: 'Property approved', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/properties/:id/images/:filename ─────────────────────
// ─── @access Private (admin, agent-owner)
exports.deletePropertyImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/properties', filename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Property.findByIdAndUpdate(req.params.id, {
      $pull: { images: { filename } },
    });

    res.status(200).json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PATCH /api/properties/:id/images/:filename ──────────────────────
// ─── @access Private (admin, agent-owner) — edit photo details/captions
exports.updateImageDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const { caption, room, isCover } = req.body;
    const image = property.images.find((img) => img.filename === req.params.filename);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' });

    if (caption !== undefined) image.caption = caption;
    if (room !== undefined) image.room = room;
    if (isCover !== undefined) {
      if (isCover === true || isCover === 'true') {
        property.images.forEach((img) => { img.isCover = img.filename === req.params.filename; });
      } else {
        image.isCover = false;
      }
    }

    await property.save();
    res.status(200).json({ success: true, message: 'Photo details updated.', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/properties/:id/documents/verify ───────────────────────
// ─── @access Private (admin, agent-owner) — run AI document testing system
exports.verifyDocuments = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (!property.documents || property.documents.length === 0) {
      return res.status(400).json({ success: false, message: 'No documents attached to this property.' });
    }

    const backendRoot = path.join(__dirname, '..');

    property.documents.forEach((doc) => {
      const result = analyzeDocument(doc, backendRoot);
      doc.verificationStatus = result.status;
      doc.verificationScore = result.score;
      doc.verificationNotes = result.notes;
      doc.verifiedAt = new Date();
    });

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Document testing complete.',
      data: property.documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
