// ============================================================================
// SUPABASE AUTH & PROGRESS SYNC LAYER
// Analyst Prep Kit - Cross-Device Progress Sync
// ============================================================================

// Configuration - REPLACE WITH YOUR PROJECT URL AND ANON KEY
const SUPABASE_CONFIG = {
  url: 'https://liiivtbyyawueboeavmw.supabase.co',
  anonKey: 'sb_publishable_O-6hDpC3l1KdDtHpcv6JVw_O5dSJQor', // Supabase publishable key — safe in the browser with RLS enabled
};

// Initialize Supabase client (requires supabase-js library loaded first)
let supabaseClient = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  // Dynamically load Supabase JS if not already loaded
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      supabaseClient = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
      );
    };
    document.head.appendChild(script);
    // Wait for library to load
    await new Promise(resolve => setTimeout(resolve, 2000));
  } else {
    supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  }

  return supabaseClient;
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

async function signUpWithEmail(email, password) {
  const sb = await initSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

async function signInWithEmail(email, password) {
  const sb = await initSupabase();
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error.message);
    return { success: false, error: error.message };
  }

  // Store session in localStorage
  localStorage['apk-session'] = JSON.stringify({
    user: data.user,
    session: data.session,
  });

  return { success: true, user: data.user };
}

async function signInWithGoogle() {
  const sb = await initSupabase();
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
    },
  });

  if (error) {
    console.error('Google sign in error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

async function signOut() {
  const sb = await initSupabase();
  await sb.auth.signOut();
  localStorage.removeItem('apk-session');
  return true;
}

async function getCurrentUser() {
  const sb = await initSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// ============================================================================
// PROGRESS SYNC FUNCTIONS
// ============================================================================

// Sync progress when lesson/drill is completed
async function syncProgress(kitId, lessonId, drillId, state) {
  const sb = await initSupabase();
  const user = await getCurrentUser();

  if (!user) {
    console.log('Not authenticated, saving locally only');
    return false;
  }

  try {
    const { error } = await sb
      .from('user_progress')
      .upsert({
        user_id: user.id,
        kit_id: kitId,
        lesson_id: lessonId,
        drill_id: drillId || null,
        state: state,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'user_id,kit_id,lesson_id,drill_id',
      });

    if (error) {
      console.error('Sync error:', error);
      return false;
    }

    console.log(`✓ Synced ${kitId} lesson ${lessonId}`);
    return true;
  } catch (err) {
    console.error('Sync exception:', err);
    return false;
  }
}

// Fetch user's progress for a kit on load
async function fetchKitProgress(kitId) {
  const sb = await initSupabase();
  const user = await getCurrentUser();

  if (!user) return {};

  try {
    const { data, error } = await sb
      .from('user_progress')
      .select('lesson_id,drill_id,state')
      .eq('user_id', user.id)
      .eq('kit_id', kitId);

    if (error) throw error;

    // Convert array to object: {lessonId: {drillId: state}}
    const progress = {};
    data.forEach(row => {
      if (!progress[row.lesson_id]) progress[row.lesson_id] = {};
      progress[row.lesson_id][row.drill_id || 'lesson'] = row.state;
    });

    console.log(`✓ Loaded ${kitId} progress for ${Object.keys(data).length} items`);
    return progress;
  } catch (err) {
    console.error('Fetch progress error:', err);
    return {};
  }
}

// ============================================================================
// PAID FEATURE GATE
// ============================================================================

async function hasInterviewPass() {
  const sb = await initSupabase();
  const user = await getCurrentUser();

  if (!user) return false;

  try {
    const { data, error } = await sb
      .from('user_entitlements')
      .select('has_interview_pass')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return false; // No row found
      throw error;
    }

    return data?.has_interview_pass || false;
  } catch (err) {
    console.error('Entitlements check error:', err);
    return false;
  }
}

async function unlockInterviewPass(userId) {
  const sb = await initSupabase();

  // This should only be called from your backend after payment
  try {
    const { error } = await sb
      .from('user_entitlements')
      .update({
        has_interview_pass: true,
        unlocked_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Unlock error:', err);
    return false;
  }
}

// ============================================================================
// AUTH STATE LISTENER
// ============================================================================

async function onAuthStateChange(callback) {
  const sb = await initSupabase();

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      callback('SIGNED_IN', session?.user);
    } else if (event === 'SIGNED_OUT') {
      callback('SIGNED_OUT', null);
    }
  });
}

// ============================================================================
// OFFLINE QUEUE (for when sync fails)
// ============================================================================

class SyncQueue {
  constructor() {
    this.queue = JSON.parse(localStorage['apk-sync-queue'] || '[]');
  }

  add(item) {
    this.queue.push(item);
    this.save();
  }

  save() {
    localStorage['apk-sync-queue'] = JSON.stringify(this.queue);
  }

  async flush() {
    const sb = await initSupabase();
    const user = await getCurrentUser();

    if (!user || this.queue.length === 0) return;

    for (const item of this.queue) {
      const { error } = await sb
        .from('user_progress')
        .upsert(item, { onConflict: 'user_id,kit_id,lesson_id,drill_id' });

      if (!error) {
        this.queue = this.queue.filter(q => q !== item);
      }
    }

    this.save();
  }
}

const syncQueue = new SyncQueue();

// ============================================================================
// PREPLOOP SHELL (SHELL-1)
// When a kit runs inside PrepLoop's iframe, PrepLoop owns the auth surface:
// hide the kit's sign-in/log-out/email controls and the "All Kits" back button.
// Progress still writes to the same localStorage keys either way — PrepLoop's
// auto-complete and miss list depend on those keys staying identical.
// ============================================================================
(function () {
  let framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (!framed) return;
  document.documentElement.classList.add('apk-framed');
  const st = document.createElement('style');
  st.textContent = '.apk-framed #loginBtn,.apk-framed #logoutBtn,.apk-framed #userEmail,.apk-framed [title="Back to all kits"]{display:none !important}';
  document.head.appendChild(st);
})();

// ============================================================================
// PREPLOOP HARD GATE (SHELL-1, Mike's call 2026-07-22)
// Direct top-level visits to a kit page get a full-screen hand-off to PrepLoop.
// Skipped when framed (inside PrepLoop) or when the URL carries ?via=loop —
// the flag PrepLoop puts on the links it opens in a new tab (miss list).
// ============================================================================
(function () {
  let framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (framed) return;
  if (!/\/(sql|excel|powerbi|tableau|python|stats)\/(index\.html)?$/.test(location.pathname)) return;
  if (/(^|[?&])via=loop(&|$)/.test(location.search.slice(1))) return;
  document.addEventListener('DOMContentLoaded', function () {
    const d = document.createElement('div');
    d.id = 'preploop-gate';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:var(--bg,#101418);color:var(--text,#e5e7eb);display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:inherit';
    d.innerHTML =
      '<div style="max-width:460px">' +
      '<div style="font-size:2rem;margin-bottom:10px">🔁</div>' +
      '<h2 style="margin:0 0 10px;font-size:1.3rem">The prep kits now live inside PrepLoop</h2>' +
      '<p style="margin:0 0 18px;line-height:1.6;color:var(--dim,#9aa4af)">Same lessons, plus a guided path, timed sittings, spaced review and badges — all in one place.</p>' +
      '<a href="https://michaelnocito.github.io/prep-loop/" style="display:inline-block;padding:11px 22px;border-radius:8px;background:var(--accent,#38bdf8);color:#fff;text-decoration:none;font-weight:700">Open PrepLoop →</a>' +
      '</div>';
    document.body.appendChild(d);
    document.body.style.overflow = 'hidden';
  });
})();

// Try to flush queued syncs on auth
onAuthStateChange(async (event) => {
  if (event === 'SIGNED_IN') {
    await syncQueue.flush();
  }
});
