import { Response } from "express"

// Use this function to handle errors everytime there is an upload to the Supabase DB
// Check is the error exists: if yes log the error, and return a 500 status
export const handleSupabaseUploadError = function (
    logMessage: string,
    error : Error | null, 
    res: Response
){
    if(error){
        console.log(logMessage, error);
        
        return res.status(500).json({message: 'Something bad happened. Please try again'});
    }
}