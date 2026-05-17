# VoteSecure API Documentation

## Overview

VoteSecure uses Supabase as its backend, which provides a PostgreSQL database with automatic REST and Real-time APIs. This document describes the main API services used throughout the application.

## Architecture

```
Client (React/Vite)
    ↓
Context & Hooks (AuthContext, useAuth, useFetch)
    ↓
Services (authService, electionService, votingService, adminService)
    ↓
Supabase SDK
    ↓
Supabase REST API
    ↓
PostgreSQL Database
```

## Services

### 1. Auth Service (`src/services/authService.js`)

Handles authentication and user profile management.

#### Methods

```javascript
// Sign up new user
authService.signup(email, password, fullName)
→ { data, error }

// Sign in user
authService.signin(email, password)
→ { data, error }

// Sign out
authService.signout()
→ { error }

// Get current user
authService.getCurrentUser()
→ user object or null

// Get user profile
authService.getUserProfile(userId)
→ profile object

// Reset password
authService.resetPassword(email)
→ { error }

// Update password
authService.updatePassword(newPassword)
→ { error }

// Listen to auth changes
authService.onAuthStateChange(callback)
→ subscription
```

### 2. Election Service (`src/services/electionService.js`)

Manages elections and candidates.

#### Methods

```javascript
// Create election
electionService.createElection(electionData)
→ { data, error }

// Get elections (with optional filters)
electionService.getElections(filters)
→ { data, error }

// Get single election
electionService.getElectionById(id)
→ { data, error }

// Update election
electionService.updateElection(id, updates)
→ { data, error }

// Delete election
electionService.deleteElection(id)
→ { error }

// Get candidates for election
electionService.getCandidates(electionId)
→ { data, error }

// Add candidate
electionService.addCandidate(candidateData)
→ { data, error }

// Update candidate
electionService.updateCandidate(id, updates)
→ { data, error }

// Delete candidate
electionService.deleteCandidate(id)
→ { error }
```

### 3. Voting Service (`src/services/votingService.js`)

Handles voting and voter registration.

#### Methods

```javascript
// Register voter for election
votingService.registerVoter(voterId, electionId)
→ { data, error }

// Generate secret ID (called internally)
votingService.generateSecretId(electionId, voterId)
→ secret object or null

// Cast vote
votingService.castVote(electionId, candidateId, secretId)
→ { data, error }

// Get voter registrations
votingService.getVoterRegistrations(voterId)
→ { data, error }

// Get election results
votingService.getElectionResults(electionId)
→ { data, error }

// Check if voter can vote
votingService.canVote(voterId, electionId)
→ { canVote, reason }
```

### 4. Admin Service (`src/services/adminService.js`)

Administrative operations.

#### Methods

```javascript
// Get election requests
adminService.getElectionRequests(status)
→ { data, error }

// Approve request
adminService.approveRequest(requestId, userId)
→ { error }

// Reject request
adminService.rejectRequest(requestId, userId, reason)
→ { error }

// Get audit logs
adminService.getAuditLogs(limit)
→ { data, error }

// Log audit event
adminService.logAudit(userId, action, details)
→ (no return)

// Get analytics
adminService.getAnalytics()
→ { data, error }

// Get all users
adminService.getUsers()
→ { data, error }

// Update user role
adminService.updateUserRole(userId, role)
→ { error }
```

## Database Schema

### profiles
```sql
{
  id: UUID (primary key),
  email: TEXT (unique),
  name: TEXT,
  phone: TEXT,
  role: TEXT ('voter'|'creator'|'admin'),
  avatar_url: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### elections
```sql
{
  id: UUID (primary key),
  creator_id: UUID (foreign key),
  title: TEXT,
  description: TEXT,
  category: TEXT,
  start_time: TIMESTAMP,
  end_time: TIMESTAMP,
  registration_deadline: TIMESTAMP,
  max_voters: INTEGER,
  status: TEXT ('draft'|'scheduled'|'active'|'paused'|'completed'),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### candidates
```sql
{
  id: UUID (primary key),
  election_id: UUID (foreign key),
  name: TEXT,
  designation: TEXT,
  manifesto: TEXT,
  photo_url: TEXT,
  created_at: TIMESTAMP
}
```

### voter_registrations
```sql
{
  id: UUID (primary key),
  election_id: UUID (foreign key),
  voter_id: UUID (foreign key),
  status: TEXT ('registered'|'waitlisted'),
  created_at: TIMESTAMP,
  unique(election_id, voter_id)
}
```

### secret_ids
```sql
{
  id: UUID (primary key),
  election_id: UUID (foreign key),
  voter_id: UUID (foreign key),
  secret_code: TEXT (unique),
  has_voted: BOOLEAN,
  created_at: TIMESTAMP,
  unique(election_id, voter_id)
}
```

### votes
```sql
{
  id: UUID (primary key),
  election_id: UUID (foreign key),
  candidate_id: UUID (foreign key),
  created_at: TIMESTAMP
}
```

### audit_logs
```sql
{
  id: UUID (primary key),
  user_id: UUID (foreign key),
  action: TEXT,
  details: JSONB,
  timestamp: TIMESTAMP
}
```

### election_requests
```sql
{
  id: UUID (primary key),
  creator_id: UUID (foreign key),
  purpose: TEXT,
  organization: TEXT,
  status: TEXT ('pending'|'approved'|'rejected'),
  rejection_reason: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

## Authentication Flow

1. User signs up with email/password
2. Supabase Auth creates user account
3. Profile created in `profiles` table with role='voter'
4. User receives verification email
5. After email verification, user can sign in

## Authorization (Row-Level Security)

All tables have RLS policies:

- **profiles**: Users can view/update their own profile
- **elections**: Anyone can view active/completed elections; creators can manage their own
- **candidates**: Anyone can view; only election creator can manage
- **voter_registrations**: Users can view their own; creators can view their election's
- **secret_ids**: Only the voter can view
- **votes**: Only election creator/admin can view
- **audit_logs**: Only admins can view
- **election_requests**: Users can view their own; admins can view all

## Error Handling

All services return a consistent response format:

```javascript
// Success
{ data: {...}, error: null }

// Error
{ data: null, error: "Error message" }
```

## Usage Examples

### Sign Up and Create Profile
```javascript
const { data, error } = await authService.signup(
  'user@example.com',
  'SecurePassword123',
  'John Doe'
)

if (error) {
  console.error('Signup failed:', error)
} else {
  console.log('User created:', data.user.id)
}
```

### Create Election
```javascript
const { data, error } = await electionService.createElection({
  creator_id: currentUserId,
  title: 'Presidential Election 2026',
  description: 'Select your presidential candidate',
  start_time: new Date('2026-06-01'),
  end_time: new Date('2026-06-02'),
  max_voters: 1000,
  status: 'draft'
})
```

### Vote in Election
```javascript
// First register
const { data: regData, error: regError } = 
  await votingService.registerVoter(voterId, electionId)

// Then vote
const { data: voteData, error: voteError } = 
  await votingService.castVote(
    electionId, 
    candidateId, 
    secretId
  )
```

### Get Results
```javascript
const { data: results, error } = 
  await votingService.getElectionResults(electionId)

console.log(results.candidates)
console.log(results.totalVotes)
console.log(results.winner)
```

## Rate Limiting

Supabase imposes rate limits based on your plan:
- Free: 1,000 requests/hour
- Pro: 10,000 requests/hour
- Enterprise: Custom limits

## Best Practices

1. **Error Handling**: Always check for errors in responses
2. **Caching**: Use React Query or SWR for optimal caching
3. **Offline Support**: Consider implementing service workers
4. **Security**: Never expose sensitive data in logs
5. **Validation**: Validate input on client before sending
6. **Pagination**: Use limit/offset for large datasets
7. **Indexes**: Database queries use indexes for performance

## Troubleshooting

### Common Issues

**CORS Errors**
- Add domain to Supabase CORS settings
- Check browser console for exact error

**Authentication Issues**
- Verify email verification is complete
- Check Supabase Auth settings
- Ensure credentials match

**Query Errors**
- Check table/column names match schema
- Verify RLS policies allow operation
- Check database connection

## Performance Tips

1. Use pagination for large datasets
2. Create indexes on frequently queried columns
3. Cache query results when appropriate
4. Use real-time subscriptions sparingly
5. Batch multiple operations when possible

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [REST API Docs](https://supabase.com/docs/reference/api)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)
