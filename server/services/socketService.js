/**
 * WebSocket Real-Time Service (Socket.io)
 * Strictly conforms to Section 8 of the Master Engineering Blueprint.
 */
let ioInstance = null;

module.exports = {
  init: (io) => {
    ioInstance = io;

    io.on('connection', (socket) => {
      // Join role-based channels
      socket.on('JOIN_CHANNEL', ({ role, userId }) => {
        if (role) socket.join(role); // e.g. 'receptionist', 'housekeeping', 'manager', 'admin'
        if (userId) socket.join(`user_${userId}`);
      });

      // 1. Room Status Sync Event
      socket.on('UPDATE_ROOM_STATUS', async ({ roomId, newStatus, staffName }) => {
        io.emit('ROOM_STATUS_CHANGED', {
          roomId,
          newStatus,
          updatedBy: staffName,
          timestamp: new Date(),
        });
      });

      // 2. Urgent Maintenance Alert
      socket.on('NEW_MAINTENANCE_INCIDENT', (incidentData) => {
        io.to('housekeeping').to('manager').emit('MAINTENANCE_DISPATCH', incidentData);
      });

      // 3. Guest Service Call
      socket.on('GUEST_SERVICE_ORDER', (serviceData) => {
        io.to('receptionist').emit('NEW_SERVICE_REQUEST', serviceData);
      });
    });

    return ioInstance;
  },

  getIO: () => ioInstance,

  emitRoomStatus: (roomId, newStatus, staffName = 'Staff') => {
    if (ioInstance) {
      ioInstance.emit('ROOM_STATUS_CHANGED', {
        roomId,
        newStatus,
        updatedBy: staffName,
        timestamp: new Date(),
      });
    }
  },

  emitMaintenanceAlert: (incidentData) => {
    if (ioInstance) {
      ioInstance.to('housekeeping').to('manager').emit('MAINTENANCE_DISPATCH', incidentData);
    }
  },

  emitServiceOrder: (serviceData) => {
    if (ioInstance) {
      ioInstance.to('receptionist').emit('NEW_SERVICE_REQUEST', serviceData);
    }
  },
};
