const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    originalName: String,
    storageKey: String,
    version: { 
        type: Number, 
        default: 1 
    },
    fileGroupId: String,
    folderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Folder', 
        default: null 
    },
    uploadedAt: { type: Date, default: Date.now },
    sharedToken: { type: String, default: null },
    isShared: { type: Boolean, default: false },
})

const File = mongoose.model('file', fileSchema);

module.exports = File;