"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSupabaseUploadError = void 0;
// Use this function to handle errors everytime there is an upload to the Supabase DB
// Check is the error exists: if yes log the error, and return a 500 status
const handleSupabaseUploadError = function (logMessage, error, res) {
    if (error) {
        console.log(logMessage, error);
        return res.status(500).json({ message: 'Something bad happened. Please try again' });
    }
};
exports.handleSupabaseUploadError = handleSupabaseUploadError;
