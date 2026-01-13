# Registration Form Setup

This registration form has been created using:

- **NextAuth** for authentication
- **shadcn/ui** form components
- **Zod** for validation
- **tRPC** for API calls
- **React Hook Form** for form management

## Features

✅ Client-side form validation with Zod
✅ Password strength requirements (min 8 chars, uppercase, lowercase, number)
✅ Password confirmation matching
✅ tRPC mutation for registration
✅ Loading states during submission
✅ Error and success message display
✅ Automatic redirect to login after successful registration
✅ **Google OAuth registration** - One-click sign up with Google
✅ Beautiful, responsive UI with gradient background
✅ Dark mode support

## Components Created

1. **RegisterForm.tsx** - Main registration form component
2. **Input.tsx** - shadcn Input component
3. **Card.tsx** - shadcn Card component for form container
4. **auth.ts** - tRPC router for authentication

## Database Integration (TODO)

The registration form is ready to use, but you need to integrate it with your database:

### 1. In `trpc/routers/auth.ts`:

Uncomment and implement the database logic in the `register` mutation:

```typescript
// Check if user already exists
const existingUser = await db.user.findUnique({ where: { email } });
if (existingUser) {
  throw new Error("User already exists");
}

// Create user in database
const user = await db.user.create({
  data: {
    name,
    email,
    password: hashedPassword, // Already hashed with bcrypt
  },
});
```

### 2. In `app/api/auth/[...nextauth]/route.ts`:

Uncomment and implement the database logic in the `CredentialsProvider`:

```typescript
// Fetch user from database
const user = await db.user.findUnique({
  where: { email: credentials.email },
});

if (!user || !user.password) {
  throw new Error("Invalid credentials");
}

// Verify password
const isPasswordValid = await bcrypt.compare(
  credentials.password,
  user.password
);

if (!isPasswordValid) {
  throw new Error("Invalid credentials");
}

return {
  id: user.id,
  email: user.email,
  name: user.name,
};
```

### 3. Uncomment bcrypt import:

In `app/api/auth/[...nextauth]/route.ts`, uncomment:

```typescript
import bcrypt from "bcryptjs";
```

## Google OAuth Setup

The registration form includes a "Continue with Google" button that's already configured. To enable it:

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. For "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### 2. Add Credentials to .env

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

Generate a random secret for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. How It Works

- Users can click "Continue with Google" to register/sign in
- Google handles the authentication
- User data (name, email, profile picture) is automatically retrieved
- No password needed for Google OAuth users
- Users registered via Google can only sign in with Google

## Usage

Navigate to `/auth/register` to see the registration form in action.

## Dependencies Installed

- `bcryptjs` - For password hashing
- `@types/bcryptjs` - TypeScript types for bcryptjs

All other dependencies were already present in your project.
