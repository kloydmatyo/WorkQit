# Cloudinary Resume Upload Integration

## Overview
This integration allows job seekers to upload their resumes securely to Cloudinary, with automatic file validation, size limits, and seamless integration with the job application process.

## Features Implemented

### ✅ Resume Upload System
- **Secure file upload** to Cloudinary cloud storage
- **File type validation** (PDF, DOC, DOCX only)
- **File size limits** (5MB maximum)
- **Drag and drop interface** for easy uploading
- **Replace/delete functionality** for existing resumes
- **Automatic integration** with job applications

### ✅ User Experience
- **Visual upload component** with progress indicators
- **Error handling** with clear user feedback
- **Success notifications** for completed uploads
- **Resume preview** with download links
- **File information display** (size, type, upload date)

### ✅ Security & Validation
- **Server-side validation** for file types and sizes
- **Authentication required** for all upload operations
- **User-specific file organization** in Cloudinary
- **Automatic cleanup** when replacing resumes

## Setup Instructions

### 1. Create Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Navigate to your Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Cloudinary Settings (Optional)
In your Cloudinary dashboard, you can configure:
- **Upload presets** for additional security
- **Folder organization** (currently set to `workqit/resumes`)
- **File transformation** settings
- **Access control** policies

## File Structure

### New Files Created
```
lib/cloudinary.ts              # Cloudinary configuration and utilities
components/ResumeUpload.tsx    # React component for resume uploads
app/api/upload/resume/route.ts # API endpoints for resume operations
```

### Modified Files
```
models/User.ts                 # Added resume field to user schema
models/Application.ts          # Added resume field to application schema
app/profile/page.tsx          # Added resume upload section
app/api/jobs/[id]/apply/route.ts # Include resume in job applications
.env.local                    # Added Cloudinary environment variables
```

## API Endpoints

### POST /api/upload/resume
Upload a new resume file
- **Authentication**: Required (job seekers only)
- **File types**: PDF, DOC, DOCX
- **Max size**: 5MB
- **Response**: Resume metadata and Cloudinary URL

### GET /api/upload/resume
Get current user's resume information
- **Authentication**: Required
- **Response**: Resume metadata or null if no resume

### DELETE /api/upload/resume
Delete current user's resume
- **Authentication**: Required
- **Action**: Removes from both database and Cloudinary

## Database Schema Updates

### User Model
```typescript
resume?: {
  filename: string
  originalName: string
  cloudinaryPublicId: string
  cloudinaryUrl: string
  fileSize: number
  fileType: string
  uploadedAt: Date
}
```

### Application Model
```typescript
resume?: {
  filename: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  uploadedAt: Date
}
```

## Usage Flow

### For Job Seekers
1. **Upload Resume**: Go to Profile page → Resume section
2. **Drag & Drop or Click**: Upload PDF, DOC, or DOCX file
3. **Automatic Validation**: System checks file type and size
4. **Secure Storage**: File uploaded to Cloudinary
5. **Apply to Jobs**: Resume automatically included in applications

### For Employers
1. **View Applications**: Access job applicants page
2. **Download Resumes**: Click download links for applicant resumes
3. **Secure Access**: All resume URLs are secure and time-limited

## Security Features

### File Validation
- **Client-side**: Immediate feedback for invalid files
- **Server-side**: Double validation before upload
- **Type checking**: Only document formats allowed
- **Size limits**: Prevents large file uploads

### Access Control
- **Authentication required**: Only logged-in users can upload
- **User isolation**: Users can only manage their own resumes
- **Secure URLs**: Cloudinary provides secure, time-limited URLs

### Data Protection
- **Automatic cleanup**: Old resumes deleted when replaced
- **Error handling**: Graceful failure with user feedback
- **Privacy**: Resume URLs not exposed in client-side code

## Configuration Options

### File Restrictions
```typescript
// In lib/cloudinary.ts
const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const maxSize = 5 * 1024 * 1024 // 5MB
```

### Cloudinary Settings
```typescript
// In lib/cloudinary.ts
folder: 'workqit/resumes'        // Organization folder
resource_type: 'auto'           // Automatic type detection
use_filename: true              // Preserve original filename
unique_filename: true           // Prevent conflicts
```

## Testing

### Manual Testing
1. **Upload Test**: Try uploading various file types
2. **Size Test**: Test with files over 5MB limit
3. **Replace Test**: Upload new resume to replace existing
4. **Delete Test**: Remove resume and verify cleanup
5. **Application Test**: Apply to job and verify resume inclusion

### Error Scenarios
- Invalid file types (images, videos, etc.)
- Files exceeding size limit
- Network interruptions during upload
- Missing Cloudinary credentials
- Authentication failures

## Troubleshooting

### Common Issues

#### "Upload failed" Error
- Check Cloudinary credentials in `.env.local`
- Verify file type is PDF, DOC, or DOCX
- Ensure file size is under 5MB
- Check network connection

#### "Authentication required" Error
- Ensure user is logged in
- Verify JWT token is valid
- Check user role (must be job_seeker for uploads)

#### Resume not showing in applications
- Verify resume was uploaded successfully
- Check application creation process
- Ensure database schema is updated

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify server logs for API errors
3. Test Cloudinary credentials with their API
4. Confirm database schema updates applied

## Future Enhancements

### Potential Improvements
- **Multiple file formats**: Support for additional document types
- **File preview**: In-browser document preview
- **Version history**: Keep track of resume versions
- **Bulk operations**: Upload multiple documents
- **Advanced validation**: Content analysis and formatting checks

### Integration Opportunities
- **AI resume parsing**: Extract skills and experience automatically
- **Resume templates**: Provide formatting suggestions
- **Analytics**: Track resume download rates
- **Notifications**: Alert when resume is viewed by employers

## Cost Considerations

### Cloudinary Free Tier
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Requests**: 1,000,000/month

### Estimated Usage
- **Average resume size**: 500KB - 2MB
- **Storage per 1000 users**: ~1GB
- **Monthly bandwidth**: Depends on download frequency
- **Well within free tier** for most applications

## Conclusion

The Cloudinary integration provides a robust, secure, and user-friendly solution for resume uploads in the WorkQit platform. It enhances the job application process while maintaining security and providing excellent user experience.

The system is production-ready and includes comprehensive error handling, validation, and security measures. Users can now seamlessly upload and manage their resumes, making the job application process more efficient for both job seekers and employers.