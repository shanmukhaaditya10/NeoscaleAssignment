
# **Splitwise Prototype: Aditya’s Assignment Submission**

**Splitwise Prototype**,
A user logs in with Google, sees their pre-seeded transactions, and splits them with friends—all in a lightweight app built with React Native, Supabase, Prisma, and Google Sign-In.
---

## **Features**

### **Core Functionality**
- **Google Sign-In**: Authenticate using Google OAuth via Supabase.
- **User Profiles**: Automatically creates a user profile on first login with name and email synced from Google.
- **Transaction Splitting**: Split unsplit transactions with selected friends via a modal interface.
- **Offline Support**: Queue splits locally when offline, syncing when connectivity returns (using MMKV for storage).
- **Background Sync**: Sync friends list in the background with debounced API calls for smooth performance.

### **UI/UX Highlights**
- **Login Screen**: A sleek gradient background.
- **Custom Modal**: Intuitive friend selection with checkboxes for splitting transactions & info modal for already split transactions.
- **Loading States**: Shows users when syncing data from the database upon returning online.

### **Technical Details**
- **Tech Stack**: React Native, Supabase (Auth + Database), Prisma (ORM), Next.js (API routes), Lodash (debouncing), MMKV (offline storage).
- **Database**: PostgreSQL via Supabase with tables for `User`, `Friend`, `Transaction`, and `Split`.
- **API**: Custom endpoints like `/api/profile` for user creation and `/api/transactions` for fetching data.

---

## **Setup Guide**

### **Prerequisites**
- **Node.js**: v18 or higher
- **npm** or **yarn**
- **Supabase Account**: For auth and database
- **Google Cloud Console**: For OAuth credentials
- **React Native Environment**: Set up for Android
- **Git**: To clone the repo

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shanmukhaaditya10/NeoscaleAssignment.git
   cd NeoscaleAssignment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Supabase**
   - Create a Supabase project at [app.supabase.com](https://app.supabase.com).
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API.
   - Set up PostgreSQL tables using Prisma (see `schema.prisma` in code).
   - Configure Google OAuth in Supabase Auth:
     - Go to Auth > Providers > Google.
     - Add your Google Client ID and Secret (see next step).

4. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com).
   - Create a project and set up OAuth 2.0 credentials.
   - Add `webClientId` to `GoogleSignInButton.tsx`:
     ```tsx
     const webClientId = 'your-google-client-id';
     ```

5. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your-db-url
   SUPABASE_URL=https://your-supabase-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

6. **Set Up Prisma**
   - Run migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

7. **Seed Initial Data**
   - Run the seed script to populate dummy users:
     ```bash
     npm run seed
     ```

8. **Run the Backend (Next.js API)**
   ```bash
   npm run dev
   # Ensure API runs on http://192.168.29.41:3000 or your local IP
   ```

9. **Run the React Native App**
   - For Android:
     ```bash
     npx expo run:android
     ```

---

## **Submitted By**
**K S Aditya**

