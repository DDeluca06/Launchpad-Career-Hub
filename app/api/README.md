# API Documentation

## Overview
This API provides endpoints for managing applicants, applications, and jobs. All endpoints use standard routing with query parameters instead of dynamic routing.

## Applicants API

### List All Applicants
- **URL**: `/api/applicants`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: Filter by applicant status
  - `program`: Filter by program (comma-separated, e.g., "101,ALUMNI")
  - `date`: Filter by date range ("last7days", "last30days", "last90days")
  - `search`: Search term for name/username
  - `sort`: Field to sort by ("name", "newest", "applications")
  - `sortDir`: Sort direction ("asc" or "desc")
  - `minApplications`: Minimum number of applications
  - `keywords`: Additional search keywords
  - `showInactive`: Whether to show inactive applicants ("true" or "false")
  - `showArchived`: Whether to show archived applicants ("true" or "false")
- **Success Response**: 
  ```json
  {
    "applicants": [...],
    "stats": {
      "total": 100,
      "unapplied": 45,
      "interview": 30,
      "placed": 15,
      "archived": 10
    }
  }
  ```

### Get Single Applicant
- **URL**: `/api/applicants`
- **Method**: `GET`
- **Query Parameters**:
  - `id`: Applicant ID (required)
- **Success Response**: 
  ```json
  {
    "applicant": {
      "id": 123,
      "userId": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john_doe@example.com",
      "role": "applicant",
      "applications": 5,
      "status": "interview",
      "createdAt": "2023-01-15T12:00:00Z",
      "program": "101",
      "isArchived": false
    },
    "jobApplications": [...]
  }
  ```

### Create New Applicant
- **URL**: `/api/applicants`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "jane_smith",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "securepassword",
    "program": "101",
    "isAdmin": false
  }
  ```
- **Success Response**: 
  ```json
  {
    "applicant": {
      "id": 124,
      "userId": "jane_smith",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane_smith@example.com",
      "role": "applicant",
      "applications": 0,
      "status": "unapplied",
      "createdAt": "2023-06-15T12:00:00Z",
      "program": "101",
      "isArchived": false
    }
  }
  ```

### Update Applicant
- **URL**: `/api/applicants`
- **Method**: `PUT`
- **Query Parameters**:
  - `id`: Applicant ID (required)
- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Johnson",
    "program": "ALUMNI",
    "isActive": true
  }
  ```
- **Success Response**: 
  ```json
  {
    "id": 124,
    "userId": "jane_smith",
    "firstName": "Jane",
    "lastName": "Johnson",
    "isActive": true,
    "program": "ALUMNI",
    "message": "Applicant updated successfully"
  }
  ```

### Archive/Unarchive Applicant
- **URL**: `/api/applicants`
- **Method**: `PUT`
- **Query Parameters**:
  - `id`: Applicant ID (required)
  - `archive`: Set to "true" for archive operations
- **Request Body**:
  ```json
  {
    "isArchived": true
  }
  ```
- **Success Response**: 
  ```json
  {
    "id": 124,
    "userId": "jane_smith",
    "firstName": "Jane",
    "lastName": "Johnson",
    "isArchived": true,
    "message": "Applicant archived successfully"
  }
  ```

## Applications API

### List All Applications
- **URL**: `/api/applications`
- **Method**: `GET`
- **Query Parameters**:
  - `userId`: Filter by user ID
  - `jobId`: Filter by job ID
  - `status`: Filter by status
- **Success Response**: 
  ```json
  {
    "success": true,
    "applications": [...]
  }
  ```

### Get Single Application
- **URL**: `/api/applications`
- **Method**: `GET`
- **Query Parameters**:
  - `id`: Application ID (required)
- **Success Response**: 
  ```json
  {
    "success": true,
    "application": {
      "application_id": 123,
      "user_id": 45,
      "job_id": 67,
      "status": "INTERVIEW_STAGE",
      "applied_at": "2023-04-15T12:00:00Z",
      "users": {...},
      "jobs": {...},
      "resumes": {...},
      "app_status_history": [...]
    }
  }
  ```

### Create New Application
- **URL**: `/api/applications`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "user_id": 123,
    "job_id": 456,
    "status": "APPLIED",
    "position": "Software Engineer",
    "resume_id": 789
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "application": {
      "application_id": 234,
      "user_id": 123,
      "job_id": 456,
      "status": "APPLIED",
      "applied_at": "2023-06-15T12:00:00Z",
      "position": "Software Engineer",
      "resume_id": 789
    }
  }
  ```

### Update Application
- **URL**: `/api/applications`
- **Method**: `PUT`
- **Query Parameters**:
  - `id`: Application ID (required)
- **Request Body**:
  ```json
  {
    "status": "INTERVIEW_STAGE",
    "resume_id": 123,
    "position": "Senior Developer"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "application": {
      "application_id": 234,
      "status": "INTERVIEW_STAGE",
      "status_updated": "2023-06-16T10:00:00Z",
      "position": "Senior Developer",
      "resume_id": 123
    }
  }
  ```

### Delete Application
- **URL**: `/api/applications`
- **Method**: `DELETE`
- **Query Parameters**:
  - `id`: Application ID (required)
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Application deleted successfully"
  }
  ```

## Jobs API

### List All Jobs
- **URL**: `/api/jobs`
- **Method**: `GET`
- **Query Parameters**:
  - `jobType`: Filter by job type
  - `location`: Filter by location
  - `tag`: Filter by job tag
  - `search`: Search term
  - `isRemote`: Filter for remote jobs ("true")
  - `includeApplications`: Include application details ("true")
  - `archived`: Include archived jobs ("true", "false", or omit for all)
- **Success Response**: 
  ```json
  {
    "success": true,
    "jobs": [...]
  }
  ```

### Get Single Job
- **URL**: `/api/jobs`
- **Method**: `GET`
- **Query Parameters**:
  - `id`: Job ID (required)
- **Success Response**: 
  ```json
  {
    "success": true,
    "job": {
      "job_id": 123,
      "job_type": "FULL_TIME",
      "title": "Software Engineer",
      "description": "Job description...",
      "company": "Example Corp",
      "website": "https://example.com",
      "location": "New York, NY",
      "partner_id": 456,
      "created_at": "2023-01-15T12:00:00Z",
      "tags": ["FULLY_REMOTE", "BACK_END"],
      "applications": [...],
      "applicationCount": 5,
      "partner": {...}
    }
  }
  ```

### Create New Job
- **URL**: `/api/jobs`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Software Engineer",
    "description": "Job description...",
    "job_type": "FULL_TIME",
    "company": "Example Corp",
    "website": "https://example.com",
    "location": "New York, NY",
    "partner_id": 123,
    "tags": ["FULLY_REMOTE", "BACK_END"]
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "job": {
      "job_id": 234,
      "title": "Software Engineer",
      "job_type": "FULL_TIME",
      "company": "Example Corp",
      "website": "https://example.com",
      "location": "New York, NY",
      "partner_id": 123,
      "created_at": "2023-06-15T12:00:00Z",
      "tags": ["FULLY_REMOTE", "BACK_END"],
      "archived": false,
      "_count": {
        "applications": 0
      }
    }
  }
  ```

### Update Job
- **URL**: `/api/jobs`
- **Method**: `PUT`
- **Query Parameters**:
  - `id`: Job ID (required)
- **Request Body**:
  ```json
  {
    "title": "Senior Software Engineer",
    "description": "Updated job description...",
    "job_type": "FULL_TIME",
    "company": "Example Corp",
    "website": "https://example.com",
    "location": "Remote",
    "tags": ["FULLY_REMOTE", "BACK_END"],
    "archived": false
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "job": {
      "job_id": 234,
      "title": "Senior Software Engineer",
      "job_type": "FULL_TIME",
      "company": "Example Corp",
      "website": "https://example.com",
      "location": "Remote",
      "partner_id": 123,
      "created_at": "2023-06-15T12:00:00Z",
      "tags": ["FULLY_REMOTE", "BACK_END"],
      "archived": false,
      "_count": {
        "applications": 0
      }
    }
  }
  ```

### Delete Job
- **URL**: `/api/jobs`
- **Method**: `DELETE`
- **Query Parameters**:
  - `id`: Job ID (required)
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Job deleted successfully"
  }
  ``` 