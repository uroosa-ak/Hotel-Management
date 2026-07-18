const { Schema, default: mongoose } = require("mongoose");

const roleSchema = new Schema({
    roleName: { type: String, required: true, unique: true },
    permissions: [{ type: String }] // Example: ["create-room", "delete-booking"]
});

module.exports = mongoose.model("Role", roleSchema);