# Login Testing Guide

## Overview
The login system uses Supabase Magic Link authentication - no passwords required.

## How it Works

1. **User enters email** on [/login](/login)
2. **Supabase sends magic link** to email
3. **User clicks link** in email
4. **Redirects to** [/projects](/projects) with authenticated session

## Testing Checklist

### Prerequisites
- [ ] Supabase project configured
- [ ] `.env.local` has correct values:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Email authentication enabled in Supabase dashboard

### Manual Testing Steps

1. **Navigate to login page**
   - Go to http://localhost:3000/login
   - Should see centered card with email input

2. **Submit email**
   - Enter valid email address
   - Click "Send magic link" button
   - Should see success message: "Check your email for the login link!"

3. **Check email**
   - Open email client
   - Should receive email from Supabase
   - Subject: "Confirm your signup" or "Magic Link"

4. **Click magic link**
   - Click link in email
   - Should redirect to http://localhost:3000/projects
   - Should be authenticated

5. **Verify authentication**
   - Should see "Logged in as: your@email.com"
   - Should see projects list (or empty state)
   - Header should show "My Projects"

### Common Issues

**No email received:**
- Check Supabase email configuration
- Check spam folder
- Verify email is valid
- Check Supabase logs in dashboard

**404 on login page:**
- ✅ FIXED - Consolidated app directory structure

**Redirect not working:**
- Check `emailRedirectTo` in login page
- Verify Supabase redirect URLs configured
- Check browser console for errors

**Not authenticated after clicking link:**
- Check cookies are enabled
- Verify `createServerClient` in server.ts
- Check middleware (if any)

## Current Status

✅ Login page styled with Tailwind UI
✅ App directory consolidated (no duplicates)
✅ Build passes successfully
✅ All routes working:
- `/` - Landing page
- `/login` - Login page  
- `/projects` - Projects list
- `/projects/[id]/wizards` - Wizards list
- `/projects/[id]/wizards/[instanceId]` - Wizard instance

## Next Steps

1. Test with real Supabase credentials
2. Verify email delivery
3. Test full authentication flow
4. Add middleware for protected routes (if needed)
