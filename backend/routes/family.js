import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import FamilyMember from '../models/FamilyMember.js';
import FamilyConnection from '../models/FamilyConnection.js';
import FamilyInvitation from '../models/FamilyInvitation.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/family — List all family members, connections, and pending invitations
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isDbConnected()) {
      return res.json([]);
    }

    // 1. Manual / Unlinked family members
    const manualMembers = await FamilyMember.find({ userId }).sort({ createdAt: -1 });

    // 2. Connected family members (accepted)
    const connections = await FamilyConnection.find({
      $or: [
        { requesterId: userId, status: 'accepted' },
        { recipientId: userId, status: 'accepted' }
      ]
    }).populate('requesterId', 'name email').populate('recipientId', 'name email');

    // 3. Pending outgoing invitations & requests
    const outgoingRequests = await FamilyConnection.find({ requesterId: userId, status: 'pending' }).populate('recipientId', 'name email');
    const outgoingInvites = await FamilyInvitation.find({ inviterId: userId, status: 'pending' });

    // 4. Pending incoming connection requests
    const incomingRequests = await FamilyConnection.find({ recipientId: userId, status: 'pending' }).populate('requesterId', 'name email');

    // Format response
    const connectedList = await Promise.all(connections.map(async (c) => {
      const isRequester = String(c.requesterId._id) === String(userId);
      const otherUser = isRequester ? c.recipientId : c.requesterId;
      const relationship = isRequester ? c.relationshipFromRequester : (c.relationshipFromRecipient || c.relationshipFromRequester);

      // Count documents shared by otherUser with current user
      const sharedCount = await Document.countDocuments({
        userId: otherUser._id,
        visibility: 'shared',
        'sharedWith.userId': userId
      });

      return {
        _id: c._id,
        connectionId: c._id,
        userId: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        relationship: relationship,
        status: 'Connected',
        type: 'connected_user',
        sharedDocumentsCount: sharedCount,
      };
    }));

    const pendingList = [
      ...outgoingRequests.map(r => ({
        _id: r._id,
        email: r.recipientId?.email,
        name: r.recipientId?.name || r.recipientId?.email,
        relationship: r.relationshipFromRequester,
        status: 'Invitation Pending',
        type: 'pending_connection',
        createdAt: r.createdAt
      })),
      ...outgoingInvites.map(i => ({
        _id: i._id,
        email: i.recipientEmail,
        name: i.recipientEmail || 'Invited User',
        relationship: i.relationship,
        token: i.plainToken,
        status: 'Invitation Pending',
        type: 'pending_invitation',
        createdAt: i.createdAt
      }))
    ];

    const incomingList = incomingRequests.map(r => ({
      _id: r._id,
      connectionId: r._id,
      requesterId: r.requesterId._id,
      name: r.requesterId.name,
      email: r.requesterId.email,
      relationship: r.relationshipFromRequester,
      status: 'Action Required',
      type: 'incoming_request',
      createdAt: r.createdAt
    }));

    res.json({
      manualMembers,
      connectedMembers: connectedList,
      pendingOutbound: pendingList,
      incomingRequests: incomingList,
    });
  } catch (error) {
    console.error('Fetch family error:', error);
    res.status(500).json({ message: 'Error fetching family members' });
  }
});

// POST /api/family/connect — Connect existing LifeFlow user by email
router.post('/connect', protect, async (req, res) => {
  try {
    const { email, relationship } = req.body;
    if (!email || !relationship) {
      return res.status(400).json({ message: 'Email and relationship are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({ message: 'You cannot connect with your own email address' });
    }

    const targetUser = await User.findOne({ email: normalizedEmail });
    if (!targetUser) {
      return res.status(404).json({ isUser: false, message: 'This person is not on LifeFlow yet.' });
    }

    // Check if connection already exists
    const existing = await FamilyConnection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId: targetUser._id },
        { requesterId: targetUser._id, recipientId: req.user._id }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: `${targetUser.name} is already connected as your family member.` });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ message: `Connection request to ${targetUser.name} is already pending.` });
      }
    }

    // Create pending connection
    const connection = await FamilyConnection.create({
      requesterId: req.user._id,
      recipientId: targetUser._id,
      relationshipFromRequester: relationship,
      status: 'pending'
    });

    // Create in-app notification for recipient with interactive actions
    await Notification.create({
      userId: targetUser._id,
      title: 'Family Connection Request',
      message: `${req.user.name} wants to connect with you as ${relationship}.`,
      type: 'info',
      relatedEntity: 'family_request',
      actionPayload: {
        connectionId: connection._id,
        requesterName: req.user.name,
        relationship: relationship
      }
    });

    res.status(201).json({
      isUser: true,
      status: 'pending',
      message: `Connection request sent to ${targetUser.name}`,
      connection
    });
  } catch (error) {
    console.error('Connect family error:', error);
    res.status(500).json({ message: 'Error sending family connection request' });
  }
});

// POST /api/family/invite — Generate invitation link for non-LifeFlow user
router.post('/invite', protect, async (req, res) => {
  try {
    const { recipientEmail, relationship } = req.body;
    if (!relationship) {
      return res.status(400).json({ message: 'Relationship is required' });
    }

    const plainToken = crypto.randomBytes(24).toString('hex');
    const secureTokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await FamilyInvitation.create({
      inviterId: req.user._id,
      recipientEmail: recipientEmail ? recipientEmail.toLowerCase().trim() : null,
      relationship,
      secureTokenHash,
      plainToken,
      expiresAt,
      status: 'pending'
    });

    const inviteLink = `${process.env.APP_URL || 'http://localhost:5173'}/invite/${plainToken}`;

    res.status(201).json({
      message: 'Invitation link generated successfully',
      inviteLink,
      invitation
    });
  } catch (error) {
    console.error('Invite family error:', error);
    res.status(500).json({ message: 'Error creating invitation' });
  }
});

// PUT /api/family/requests/:id/accept — Recipient accepts connection request
router.put('/requests/:id/accept', protect, async (req, res) => {
  try {
    const connection = await FamilyConnection.findOne({
      _id: req.params.id,
      recipientId: req.user._id
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Send notification to requester
    await Notification.create({
      userId: connection.requesterId,
      title: 'Family Request Accepted',
      message: `${req.user.name} accepted your family connection request!`,
      type: 'success',
      relatedEntity: 'family_accepted'
    });

    res.json({ message: 'Connection accepted', connection });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ message: 'Error accepting connection' });
  }
});

// PUT /api/family/requests/:id/decline — Recipient declines connection request
router.put('/requests/:id/decline', protect, async (req, res) => {
  try {
    const connection = await FamilyConnection.findOne({
      _id: req.params.id,
      recipientId: req.user._id
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connection.status = 'declined';
    await connection.save();

    res.json({ message: 'Connection request declined', connection });
  } catch (error) {
    console.error('Decline connection error:', error);
    res.status(500).json({ message: 'Error declining connection' });
  }
});

// DELETE /api/family/connections/:id — Remove connection & revoke document sharing
router.delete('/connections/:id', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const connection = await FamilyConnection.findOne({
      _id: req.params.id,
      $or: [{ requesterId: userId }, { recipientId: userId }]
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const otherUserId = String(connection.requesterId) === String(userId) ? connection.recipientId : connection.requesterId;

    await FamilyConnection.findByIdAndDelete(req.params.id);

    // Revoke document permissions shared between these users
    await Document.updateMany(
      { userId: userId },
      { $pull: { sharedWith: { userId: otherUserId } } }
    );

    res.json({ message: 'Family connection removed and shared document access revoked.' });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({ message: 'Error removing family connection' });
  }
});

// GET /api/family/:memberId/shared-documents — Strict Backend Authorization Document Viewing
router.get('/:memberId/shared-documents', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const memberId = req.params.memberId;

    // Verify accepted family connection
    const connection = await FamilyConnection.findOne({
      $or: [
        { requesterId: userId, recipientId: memberId, status: 'accepted' },
        { requesterId: memberId, recipientId: userId, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ message: 'Access denied. You are not connected with this user.' });
    }

    // Return ONLY explicitly shared documents for memberId where sharedWith contains current user
    const sharedDocs = await Document.find({
      userId: memberId,
      visibility: 'shared',
      'sharedWith.userId': userId
    }).select('-extractedData');

    res.json(sharedDocs);
  } catch (error) {
    console.error('Fetch shared documents error:', error);
    res.status(500).json({ message: 'Error fetching shared documents' });
  }
});

// Standard manual unlinked family member endpoints
router.post('/manual', protect, async (req, res) => {
  try {
    const { name, relationship, dateOfBirth, notes } = req.body;
    if (!name || !relationship) {
      return res.status(400).json({ message: 'Name and relationship are required' });
    }
    const member = await FamilyMember.create({
      userId: req.user._id,
      name,
      relationship,
      dateOfBirth,
      notes
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error creating manual family member' });
  }
});

export default router;
