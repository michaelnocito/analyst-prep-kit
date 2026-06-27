# Supabase Integration Guide - Analyst Prep Kit

## Architecture Overview

```
User Browser
    ↓
Hub (Login/Signup) ← supabase_auth_sync.js
    ↓
Kit (SQL, Excel, etc) ← supabase_auth_sync.js
    ↓
Supabase Backend
    ├─ Auth (email + Google OAuth)
    ├─ user_progress table (progress sync)
    └─ user_entitlements table (paid features)
```

## Setup Steps

### Phase 1: Configure Supabase (Already Done ✓)

1. **Project created:** analyst-prep-kit
2. **Run SQL schema** (from SUPABASE_SETUP.md)
3. **Configure Auth** with Google OAuth
4. **Get API credentials**

### Phase 2: Add Auth Modal to Hub

In your `hub/index.html`, right before the closing `</body>` tag, add:

```html
<!-- Load Supabase auth & sync library -->
<script src="../assets/supabase_auth_sync.js"></script>

<!-- Load auth modal -->
<div id="authModalContainer"></div>
<script>
  fetch('../assets/auth_modal.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('authModalContainer').innerHTML = html;
    });
</script>

<!-- Add login button to your header/nav -->
<button id="loginBtn" onclick="openAuthModal()" style="display:none;">Sign In</button>
<button id="logoutBtn" onclick="handleLogout()" style="display:none;">Log Out</button>

<script>
  // Show/hide auth buttons based on login state
  async function initAuthUI() {
    const user = await getCurrentUser();
    if (user) {
      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'block';
      console.log('Logged in as:', user.email);
    } else {
      document.getElementById('loginBtn').style.display = 'block';
      document.getElementById('logoutBtn').style.display = 'none';
    }
  }

  async function handleLogout() {
    await signOut();
    location.reload();
  }

  initAuthUI();
</script>
```

### Phase 3: Add Sync to Kits (e.g., SQL Kit)

In `sql-prep-kit/index.html`, add **right after opening `<body>`**:

```html
<script src="../assets/supabase_auth_sync.js"></script>
```

Then, update the kit to:

#### A) Load user progress on kit start

Add this to the kit's initialization (where `openLesson` or `navigateLesson` is called):

```javascript
// At kit startup, fetch user's cloud progress
async function initKitWithSync() {
  const kitId = 'sqlkit-v1'; // Match your kit's localStorage key prefix
  const user = await getCurrentUser();

  if (user) {
    // Load from cloud
    const cloudProgress = await fetchKitProgress(kitId);
    console.log('Loaded cloud progress:', cloudProgress);
    // Merge with local state (cloud wins if fresher)
    mergeProgressStates(cloudProgress);
  } else {
    // Load from localStorage as usual
    console.log('No user, using local state');
  }
}

initKitWithSync();
```

#### B) Sync progress when a lesson/drill completes

In your `markDone()` or lesson completion function, add a sync call:

```javascript
async function markDone(type, idx) {
  // ... existing code ...

  // NEW: Sync to cloud
  const user = await getCurrentUser();
  if (user) {
    await syncProgress(
      'sqlkit-v1',           // kit_id
      idx,                    // lesson_id
      type,                   // drill_id (e.g., 'bugsDone', 'reviewDone')
      {                       // state (JSON of everything to persist)
        done: true,
        timestamp: new Date().toISOString(),
      }
    );
  }
}
```

#### C) Gate paid features (Interview kit)

In `interview/index.html`, before rendering the paid content:

```javascript
async function checkInterviewAccess() {
  const user = await getCurrentUser();

  if (!user) {
    // Not logged in - show "sign in to access"
    document.getElementById('interviewContainer').innerHTML = 
      '<button onclick="openAuthModal()">Sign In to Access Interview Prep</button>';
    return false;
  }

  const hasPass = await hasInterviewPass();
  if (!hasPass) {
    // Logged in but no pass - show "purchase pass"
    document.getElementById('interviewContainer').innerHTML = 
      '<button onclick="purchasePass()">Unlock Interview Prep ($15)</button>';
    return false;
  }

  // Has pass - show interview kit
  return true;
}

// Call on load
checkInterviewAccess();
```

---

## Configuration

### Update `supabase_auth_sync.js`

Replace `YOUR_ANON_KEY_HERE` with your actual Supabase anon key:

1. Go to Supabase dashboard → Settings → API
2. Copy the `anon` key (public key, safe to use in browser)
3. Paste into `assets/supabase_auth_sync.js` line 10:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://liiivtbyyawueboeavmw.supabase.co',
  anonKey: 'YOUR_ANON_KEY_HERE', // ← Paste here
};
```

---

## Testing Cross-Device Sync

1. **Sign up** at hub (creates account)
2. **Complete a lesson** in SQL kit (saves locally + syncs to cloud)
3. **Open different browser/device**
4. **Sign in** with same email
5. **Open SQL kit** → progress should appear instantly

---

## Offline Behavior

- If sync fails (no internet), progress is **queued locally**
- When user signs back in, queue automatically **flushes to cloud**
- Uses `localStorage['apk-sync-queue']` to persist the queue

---

## Rollout Order

1. ✓ Supabase project setup
2. ✓ Database schema + RLS policies
3. ✓ Auth configuration
4. **[NEXT]** Add auth modal to hub
5. **[NEXT]** Integrate sync into SQL kit (test bed)
6. **[NEXT]** Roll out to other kits (Excel, Python, PBI)
7. **[NEXT]** Gate Interview Pass behind paid entitlement
8. **[NEXT]** Full freemium launch

---

## Troubleshooting

### "syncProgress is not defined"
→ Make sure `<script src="../assets/supabase_auth_sync.js"></script>` is loaded before kit code

### "Cannot read property 'url' of undefined"
→ Check `SUPABASE_CONFIG` is set correctly with your project URL and anon key

### Progress not syncing
→ Open browser console (F12) and check for errors
→ Make sure user is signed in (`getCurrentUser()` returns a user)

### Google OAuth not working
→ Check Google provider is enabled in Supabase Auth settings
→ Verify redirect URLs are correct

---

## API Reference

### Auth Functions
- `signUpWithEmail(email, password)` → `{ success, user, error }`
- `signInWithEmail(email, password)` → `{ success, user, error }`
- `signInWithGoogle()` → `{ success, error }`
- `signOut()` → `true`
- `getCurrentUser()` → `user | null`
- `isAuthenticated()` → `boolean`

### Sync Functions
- `fetchKitProgress(kitId)` → `{ lessonId: { drillId: state } }`
- `syncProgress(kitId, lessonId, drillId, state)` → `boolean`
- `hasInterviewPass()` → `boolean`
- `unlockInterviewPass(userId)` → `boolean` (backend-only)

### UI Functions
- `openAuthModal()` → opens login/signup modal
- `closeAuthModal()` → closes modal
- `toggleAuthForm()` → switches between sign in/up

---

## Questions?

File structure:
- `SUPABASE_SETUP.md` ← initial setup
- `SUPABASE_INTEGRATION.md` ← this file
- `assets/supabase_auth_sync.js` ← core library
- `assets/auth_modal.html` ← UI component
- `supabase_schema.sql` ← database schema (reference)
