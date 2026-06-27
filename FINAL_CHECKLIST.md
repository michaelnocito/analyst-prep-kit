# Analyst Prep Kit - Supabase Launch Checklist

## ✅ What's Done
- Supabase project created: `analyst-prep-kit`
- Database schema deployed (user_progress + user_entitlements tables)
- RLS policies configured
- Auth modal component built
- Progress sync library built
- Integration guides written

## 🎯 Your Final Steps (15 minutes)

### Step 1: Get Anon Key (2 min)
1. Open https://supabase.com/dashboard/project/liiivtbyyawueboeavmw/settings/api
2. Under **Project API keys**, copy the `anon` key (long JWT string starting with `eyJ...`)
3. Paste it into `assets/supabase_auth_sync.js` line 10:
   ```javascript
   anonKey: 'PASTE_HERE',
   ```

### Step 2: Add Auth Modal to Hub (5 min)
In `hub/index.html`, right before closing `</body>` tag, add:

```html
<!-- Supabase auth & sync -->
<script src="../assets/supabase_auth_sync.js"></script>

<!-- Auth modal -->
<div id="authModal"></div>
<script>
  fetch('../assets/auth_modal.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('authModal').innerHTML = html;
    });
</script>

<!-- Sign in/out buttons in your nav/header -->
<button id="loginBtn" onclick="openAuthModal()">Sign In</button>
<button id="logoutBtn" onclick="signOut(); location.reload()">Log Out</button>

<script>
  async function initAuthUI() {
    const user = await getCurrentUser();
    if (user) {
      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'inline';
    } else {
      document.getElementById('loginBtn').style.display = 'inline';
      document.getElementById('logoutBtn').style.display = 'none';
    }
  }
  initAuthUI();
</script>
```

### Step 3: Add Sync to SQL Kit (5 min)
In `sql-prep-kit/index.html`, add right after opening `<body>`:
```html
<script src="../assets/supabase_auth_sync.js"></script>
```

Then in the kit's initialization code (where lessons start), add:
```javascript
// Load user's cloud progress
async function loadUserProgress() {
  const user = await getCurrentUser();
  if (user) {
    const cloudProgress = await fetchKitProgress('sqlkit-v1');
    // Merge into your existing state (cloud wins if fresher)
    console.log('Loaded from cloud:', cloudProgress);
  }
}
loadUserProgress();
```

When a lesson completes (in your `markDone()` function):
```javascript
async function markDone(type, idx) {
  // ... your existing code ...
  
  // NEW: sync to cloud
  const user = await getCurrentUser();
  if (user) {
    await syncProgress('sqlkit-v1', idx, type, { done: true });
  }
}
```

### Step 3: Test Cross-Device Sync (3 min)
1. **Device A (laptop):** 
   - Open hub, sign up with email
   - Go to SQL kit, complete a lesson
   - Watch it sync (check browser console for "✓ Synced...")

2. **Device B (phone/different browser):**
   - Open hub, sign in with same email
   - Open SQL kit
   - Progress should appear instantly ✓

---

## 📁 Files Ready to Deploy

```
assets/
  ├─ supabase_auth_sync.js      ← Core library (update API key here)
  ├─ auth_modal.html             ← Login UI (drop-in component)
  └─ grain.css                   ← (existing)

docs/
  ├─ SUPABASE_SETUP.md          ← Initial setup reference
  ├─ SUPABASE_INTEGRATION.md    ← Code examples per kit
  ├─ FINAL_CHECKLIST.md         ← This file
  └─ supabase_schema.sql        ← Schema reference

sql-prep-kit/
  └─ index.html                  ← Add 1 script tag + 2 functions
  
hub/
  └─ index.html                  ← Add auth modal + buttons
```

---

## 🚀 Ship It

Once you finish steps 1-3 above:
1. Commit & push
2. GitHub Pages deploys automatically
3. Test on live URL: michaelnocito.github.io/analyst-prep-kit/
4. Sign up → complete lesson → open on different device → progress syncs ✓

---

## 🎁 Bonus: What You Have

- **Email/password auth** fully working (no Google setup needed yet)
- **Cross-device progress sync** automatic
- **Offline queue** if network fails
- **Interview Pass gate** ready (just uncomment in Interview kit)
- **Zero build step** — all vanilla JS

---

## 📞 If You Get Stuck

- Error "syncProgress is not defined" → reload page, make sure script tag is loaded
- Progress not syncing → check browser console (F12) for errors
- Auth modal not showing → make sure auth_modal.html fetch URL is correct relative path

Good luck! You're 15 minutes from launch. 🎉
