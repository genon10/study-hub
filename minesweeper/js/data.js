'use strict';
/* ============================================================
   data.js — Single source of truth for all study content.
   Based on real MineMaster Android project source code.
   ============================================================ */

// ----------------------------------------------------------------
// LANGUAGE STRINGS — used by flashcards + study modes
// getLang / setLang / t() are provided by shared/utils.js (loaded first).
// Define fallbacks here only if utils.js is absent (e.g. standalone load).
// ----------------------------------------------------------------
const LANG_LABELS = { he: 'עב', en: 'EN', mix: 'MIX' };

// ----------------------------------------------------------------
// LANG — UI string translations (keyed by data-i18n attribute)
// ----------------------------------------------------------------
const LANG = {
  // Flashcard mode tabs
  'mode.flip':  { he: '🔄 הפוך',        en: '🔄 Flip',        mix: '🔄 Flip' },
  'mode.learn': { he: '📖 למד',          en: '📖 Learn',       mix: '📖 Learn' },
  'mode.match': { he: '🎯 התאם',         en: '🎯 Match',       mix: '🎯 Match' },
  'mode.tf':    { he: '✅ נכון/שגוי',    en: '✅ True/False',  mix: '✅ T/F' },
  'mode.write': { he: '✍️ כתיבה',        en: '✍️ Write',       mix: '✍️ Write' },
  // Flashcard UI hints
  'fc.flip-hint':  { he: 'לחץ להפוך',    en: 'Click to flip',  mix: 'Click to flip' },
  'fc.swipe-hint': {
    he: '← החלק ימינה לכרטיס הבא | שמאלה לקודם →',
    en: '← Swipe right for next | left for prev →',
    mix: '← Swipe right for next | שמאלה לקודם →'
  },
  // Flashcard action buttons
  'btn.mark-seen': { he: '✓ סמן כנראה',  en: '✓ Mark seen',    mix: '✓ Mark seen' },
  'btn.seen':      { he: '✓ נראה',        en: '✓ Seen',         mix: '✓ Seen' },
  'btn.reset-seen':{ he: '🔄 אפס',        en: '🔄 Reset',       mix: '🔄 Reset' },
  'btn.show-ans':  { he: '👁️ הצג תשובה', en: '👁️ Show answer', mix: '👁️ Show answer' },
  'btn.knew-it':   { he: '✅ ידעתי',      en: '✅ Got it',      mix: '✅ Got it' },
  'btn.again':     { he: '🔁 עוד פעם',   en: '🔁 Again',       mix: '🔁 Again' },
  'fc.prev':       { he: '→ הקודם',       en: '← Prev',         mix: '← Prev' },
  'fc.next':       { he: 'הבא ←',         en: 'Next →',         mix: 'Next →' },
  // Write mode
  'write.placeholder': { he: 'כתוב את התשובה...', en: 'Type the answer...', mix: 'Type the answer...' },
  'write.check':       { he: '✓ בדוק',   en: '✓ Check',        mix: '✓ Check' },
  // TF mode
  'tf.true-btn':  { he: '✅ נכון',        en: '✅ True',         mix: '✅ True' },
  'tf.false-btn': { he: '❌ שגוי',        en: '❌ False',        mix: '❌ False' },
};

if (typeof getLang === 'undefined') {
  // eslint-disable-next-line no-global-assign
  var getLang = function() { return localStorage.getItem('study_lang') || 'he'; };
}
if (typeof t === 'undefined') {
  // eslint-disable-next-line no-global-assign
  var t = function(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const l = getLang();
    return obj[l] || obj.he || obj.en || '';
  };
}
// setLang intentionally NOT redefined — utils.js version handles DOM + callbacks

// ----------------------------------------------------------------
// DESIGN DECISIONS (12 key decisions, CHOSEN / REJECTED / WHY)
// ----------------------------------------------------------------
const DESIGN_DECISIONS = [
  {
    topic: 'floodReveal Algorithm',
    chosen: 'DFS — Recursion',
    rejected: 'BFS — Queue (LinkedList)',
    why: {
      he: 'קוד פשוט יותר — פונקציה קוראת לעצמה. isCovered() שמשמש כ-visited guard. סיכון: StackOverflow בלוח Expert גדול מאוד, אך בגדלים הנוכחיים (עד 30×16) זה בטוח.',
      en: 'Simpler code — function calls itself. isCovered() acts as visited guard. Risk: StackOverflow on very large boards, but safe for current sizes (up to 30×16).',
      mix: 'DFS recursion — פשוטה יותר ל-implement. Risk: StackOverflow בלוחות גדולים מאוד.'
    },
    code: `private void floodReveal(int x, int y) {
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                Cell c = board[ny][nx];
                if (c.isCovered() && !c.isMine()) {
                    c.setState(CellState.REVEALED);
                    game.incrementTilesRevealed();
                    // Recursively reveal if no adjacent mines (DFS)
                    if (c.getAdjacentMines() == 0) {
                        floodReveal(nx, ny);
                    }
                }
            }
        }
    }
}`
  },
  {
    topic: 'Local Database',
    chosen: 'Room DB (ORM)',
    rejected: 'Raw SQLite (DatabaseHelper)',
    why: {
      he: 'Room מספק type-safety, אימות SQL בזמן קומפילציה, ו-LiveData תמיכה מובנית. SQLite גולמי דורש כתיבה ידנית של Cursors ו-ContentValues — קוד מועד לשגיאות.',
      en: 'Room provides type-safety, compile-time SQL validation, and built-in LiveData support. Raw SQLite requires manual Cursor/ContentValues boilerplate — error-prone.',
      mix: 'Room = type-safe, compile-time validation. SQLite גולמי = boilerplate מרובה, runtime errors.'
    }
  },
  {
    topic: 'Background Sync',
    chosen: 'WorkManager (PeriodicWorkRequest)',
    rejected: 'Service / AsyncTask / Thread',
    why: {
      he: 'WorkManager שורד: reboot, process death, כיבוי. AsyncTask (deprecated) מת עם סגירת ה-Activity. Service צורך ניהול ידני של lifecycle. WorkManager = ה-API המומלץ ל-background tasks.',
      en: 'WorkManager survives: reboot, process death, app close. AsyncTask (deprecated) dies with Activity. Service requires manual lifecycle management.',
      mix: 'WorkManager שורד הכל — reboot, process death. AsyncTask deprecated ומת עם ה-Activity.'
    }
  },
  {
    topic: 'Multiplayer Real-time',
    chosen: 'Firebase Realtime Database (rooms/)',
    rejected: 'Firestore for multiplayer',
    why: {
      he: 'RTDB מיועד ל-real-time: latency נמוך, JSON tree פשוט, ValueEventListener מגיע מיידי. Firestore מצוין לשאילתות מורכבות (ציונים, פרופילים) אבל RTDB מהיר יותר ל-live updates.',
      en: 'RTDB is designed for real-time: low latency, simple JSON tree, ValueEventListener fires instantly. Firestore is better for complex queries but slower for live updates.',
      mix: 'RTDB = fast real-time sync. Firestore = complex queries. Multiplayer needs instant updates → RTDB.'
    }
  },
  {
    topic: 'ViewModel Creation',
    chosen: 'VMFactory (ViewModelProvider.Factory)',
    rejected: 'Hilt / Dagger Dependency Injection',
    why: {
      he: 'VMFactory פשוט יותר — אין annotation processor, אין build time overhead. Hilt מצוין לפרויקטים גדולים אך מוסיף מורכבות. בפרויקט בגרות — VMFactory מספיק ומדגים ידע ב-Factory Pattern.',
      en: 'VMFactory is simpler — no annotation processor, no build time overhead. Hilt is great for large projects but adds complexity. For exam project, VMFactory is sufficient and demonstrates Factory Pattern.',
      mix: 'VMFactory = פשוט, no annotation processing. Hilt = powerful but complex. VMFactory מתאים לפרויקט.'
    }
  },
  {
    topic: 'Game Board Rendering',
    chosen: 'Custom View (Canvas + onDraw)',
    rejected: 'RecyclerView with Adapters',
    why: {
      he: 'Canvas נותן שליטה מלאה על ציור — touchEvent מחשב row/col ב-O(1) מ-pixel coordinates. RecyclerView מתאים לרשימות, לא לגריד אינטראקטיבי עם תאים קטנים. invalidate() = ציור מחדש פשוט.',
      en: 'Canvas gives full drawing control — touchEvent computes row/col in O(1) from pixel coordinates. RecyclerView fits lists, not interactive grids with small cells.',
      mix: 'Canvas = שליטה מלאה + O(1) cell detection. RecyclerView = טוב לרשימות, לא למשחק boards.'
    }
  },
  {
    topic: 'NFC Availability',
    chosen: 'required="false" in Manifest',
    rejected: 'required="true"',
    why: {
      he: 'required="true" חוסם את האפליקציה לכל מכשיר ללא NFC (חלק גדול מהשוק). required="false" → האפליקציה זמינה לכולם. checkNfcStatus() בודק בזמן ריצה ומציג הודעה מתאימה.',
      en: 'required="true" blocks the app from all devices without NFC (large market share). required="false" → app available to all. checkNfcStatus() checks at runtime.',
      mix: 'required=false → wider market reach. checkNfcStatus() בודק availability בזמן ריצה.'
    }
  },
  {
    topic: 'Board State Persistence',
    chosen: 'Manual JSON (StringBuilder)',
    rejected: 'Gson library',
    why: {
      he: 'GameEngine הוא Pure Java (domain layer) — אסור לו להכיר את Gson (Android/library dependency). StringBuilder ממיר Cell[][] ל-JSON ללא כל import חיצוני. Domain layer = testable, framework-free.',
      en: 'GameEngine is Pure Java (domain layer) — must not depend on Gson (Android/library). StringBuilder converts Cell[][] to JSON without any external import. Domain layer = testable, framework-free.',
      mix: 'Domain layer = Pure Java, no Android deps. Gson = library dependency. Manual JSON = zero dependencies.'
    }
  },
  {
    topic: 'Auth Methods',
    chosen: 'Email + Google + Anonymous (3 methods)',
    rejected: 'Email only',
    why: {
      he: 'Anonymous = שחקן יכול לשחק מיד ללא הרשמה. Google = כניסה בקליק אחד. Email = גיבוי מלא. שלושתם יחד = UX טוב ביותר. LinkWithCredential() מאפשר שדרוג anonymous → registered.',
      en: 'Anonymous = player can play immediately without signup. Google = one-click signin. Email = full backup. Together = best UX. LinkWithCredential() allows anonymous → registered upgrade.',
      mix: 'Anonymous = play immediately. Google = easy signin. Email = full account. שלושתם = best UX.'
    }
  },
  {
    topic: 'Offline First Strategy',
    chosen: 'Local first (Room → Firebase)',
    rejected: 'Cloud first (Firebase → Room cache)',
    why: {
      he: 'שמירה ל-Room מיידית (syncedToFirebase=0), WorkManager מסנכרן כשיש רשת. Cloud first = המשחק תלוי ברשת — UX גרוע ללא אינטרנט. Offline First = חווית משתמש חלקה בכל מצב.',
      en: 'Save to Room immediately (syncedToFirebase=0), WorkManager syncs when network available. Cloud first = game depends on network — poor UX offline. Offline First = smooth UX always.',
      mix: 'Room תמיד זמין. Firebase = כשיש רשת. syncedToFirebase = flag ל-pending sync.'
    }
  },
  {
    topic: 'Timer Implementation',
  
    chosen: 'java.util.Timer (or Handler + postDelayed)',
    rejected: 'new Thread() with sleep(1000)',
    why: {
      he: 'new Thread sleep() = uninterruptible, memory leaks, מסובך לנקות. Timer/Handler = lifecycle-aware, ViewModel.onCleared() מבטל אותם. postValue() מעדכן UI thread בבטחה.',
      en: 'new Thread sleep() = uninterruptible, memory leaks, hard to clean up. Timer/Handler = lifecycle-aware, ViewModel.onCleared() cancels them. postValue() safely updates UI thread.',
      mix: 'Thread.sleep() = memory leaks. Timer/Handler = lifecycle-safe, מנקים ב-onCleared().'
    }
  },
  {
    topic: 'First Click Safety',
    chosen: 'Place mines AFTER first click (reject sampling)',
    rejected: 'Place mines before game starts',
    why: {
      he: 'מכניות מוקשים בתחילת המשחק = הלחיצה הראשונה יכולה להיות מוקש → חוויה גרועה. מיקום לאחר לחיצה ראשונה = מבטיח שהתא הנלחץ בטוח. placeMines(excludeX, excludeY) מדלג על הקואורדינטה הנלחצה.',
      en: 'Placing mines before start = first click could be a mine → bad UX. Placing after first click ensures the clicked cell is always safe. placeMines(excludeX, excludeY) skips the clicked coordinate.',
      mix: 'Mines placed AFTER first click — מבטיח first click תמיד בטוח. placeMines(excludeX, excludeY).'
    }
  }
];

// ----------------------------------------------------------------
// FLASHCARDS (20 cards, multilanguage)
// ----------------------------------------------------------------
const FLASHCARDS = [
  {
    q: {
      he: "מה ההבדל בין setValue() ל-postValue() ב-LiveData?",
      en: "What is the difference between LiveData.setValue() and postValue()?",
      mix: "מה ההבדל בין LiveData.setValue() ל-postValue()?"
    },
    a: {
      he: "setValue() — רק מ-main (UI) thread. postValue() — מכל thread (background). שגיאה שכיחה: קריאה ל-setValue() מ-background thread → IllegalStateException. בפרויקט: StatisticsViewModel.loadStatistics() רץ ב-new Thread ולכן חייב postValue().",
      en: "setValue() — main (UI) thread only. postValue() — any thread (background-safe). Common mistake: calling setValue() from a background thread → IllegalStateException. In project: StatisticsViewModel uses postValue() since it runs in a new Thread.",
      mix: "setValue() = main thread בלבד. postValue() = כל thread. StatisticsViewModel ב-new Thread → חייב postValue()."
    }
  },
  {
    q: {
      he: "מה אלגוריתם floodReveal בפרויקט ולמה נבחר?",
      en: "What algorithm does floodReveal use and why was it chosen?",
      mix: "איזה אלגוריתם floodReveal משתמש ולמה?"
    },
    a: {
      he: "DFS — Recursion. הפונקציה קוראת לעצמה עבור כל תא ריק שכן (adjacentMines==0). Guard: isCovered() — תא שכבר REVEALED לא מעובד שוב. קוד פשוט, עובד בגדלי לוח הנוכחיים. StackOverflow אפשרי בלוחות ענקיים — לא רלוונטי כאן.",
      en: "DFS — Recursion. The function calls itself for each empty neighboring cell (adjacentMines==0). Guard: isCovered() — already REVEALED cells are skipped. Simple code, works for current board sizes. StackOverflow possible on massive boards — irrelevant here.",
      mix: "DFS recursion — floodReveal(nx, ny) קוראת לעצמה. Guard: isCovered(). Simple code, StackOverflow risk on huge boards."
    }
  },
  {
    q: {
      he: "מה VMFactory ומה הבעיה שהוא פותר?",
      en: "What is VMFactory and what problem does it solve?",
      mix: "מה VMFactory ולמה הוא נחוץ?"
    },
    a: {
      he: "Android מאפשר ViewModel רק עם no-arg constructor. VMFactory מממש ViewModelProvider.Factory.create() ויוצר ViewModels עם parameters: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context). ללא VMFactory — אי אפשר להעביר Context.",
      en: "Android only allows ViewModels with no-arg constructors. VMFactory implements ViewModelProvider.Factory.create() and creates ViewModels with parameters: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context). Without it — cannot pass Context.",
      mix: "VMFactory = ViewModelProvider.Factory. מאפשר ViewModel עם Context parameter. Creates: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context)."
    }
  },
  {
    q: {
      he: "מה 'Offline First' ואיך מיושם בפרויקט?",
      en: "What is 'Offline First' and how is it implemented?",
      mix: "מה Offline First strategy ואיך מיושם?"
    },
    a: {
      he: "שמירה תחילה ב-Room (מקומי, מהיר, עובד ללא רשת) → סנכרון ל-Firebase ברקע. שדה syncedToFirebase=0 מסמן unsync. FirebaseSyncWorker (PeriodicWorkRequest כל 15 דק' עם NetworkType.CONNECTED) מעלה נתונים כשיש חיבור, ומסמן syncedToFirebase=1.",
      en: "Save first to Room (local, fast, works offline) → sync to Firebase in background. Field syncedToFirebase=0 marks unsynced records. FirebaseSyncWorker (PeriodicWorkRequest every 15 min, NetworkType.CONNECTED) uploads when connected, then sets syncedToFirebase=1.",
      mix: "Room תחילה → Firebase ברקע. syncedToFirebase=0 = pending. WorkManager syncs כשיש network."
    }
  },
  {
    q: {
      he: "מה ההבדל בין Firebase Firestore ל-Firebase Realtime Database בפרויקט?",
      en: "What is the difference between Firestore and Firebase RTDB in this project?",
      mix: "Firestore vs Realtime Database — שימושים בפרויקט?"
    },
    a: {
      he: "Firestore: NoSQL documents/collections, שאילתות מורכבות, offline cache — scores/, users/, daily_challenges/. RTDB: JSON tree, real-time sync מהיר מאוד — rooms/ (Multiplayer בלבד). RTDB מתאים ל-live data כי latency נמוך יותר.",
      en: "Firestore: NoSQL documents/collections, complex queries, offline cache — scores/, users/, daily_challenges/. RTDB: JSON tree, very fast real-time sync — rooms/ (Multiplayer only). RTDB suits live data due to lower latency.",
      mix: "Firestore = scores/users/daily_challenges (queries+offline). RTDB = rooms/ (multiplayer real-time)."
    }
  },
  {
    q: {
      he: "מה BaseFirebaseModel ולמה הוא קיים?",
      en: "What is BaseFirebaseModel and why does it exist?",
      mix: "מה BaseFirebaseModel? מי יורש ממנו?"
    },
    a: {
      he: "מחלקת בסיס לכל model שנשמר ב-Firebase. שדות: documentId, createdAt, updatedAt. UserRecord ו-LeaderboardEntry יורשים ממנה ומקבלים שדות אלה חינם. עיקרון DRY — לא כותבים שדות משותפים שוב ושוב.",
      en: "Base class for all Firebase-stored models. Fields: documentId, createdAt, updatedAt. UserRecord and LeaderboardEntry inherit from it. DRY principle — shared fields written once.",
      mix: "BaseFirebaseModel: documentId, createdAt, updatedAt. UserRecord + LeaderboardEntry יורשים. DRY principle."
    }
  },
  {
    q: {
      he: "Trace מלא: מה קורה כשלוחצים על תא בלוח?",
      en: "Full trace: what happens when a cell is tapped?",
      mix: "Cell click — full trace מ-touch עד ציור?"
    },
    a: {
      he: "GameBoardView.onTouchEvent() → col=(int)(x/cellPx), row=(int)(y/cellPx) → listener.onCellClick(row,col) → GameActivity → GameViewModel.revealCell(x,y) → GameEngine.revealCell() (pure logic, DFS אם תא ריק) → game.postValue() → GameBoardView.invalidate() מצייר מחדש. אם מוקש: gameStatus=LOST → Activity מציגה Game Over.",
      en: "GameBoardView.onTouchEvent() → col=(int)(x/cellPx), row=(int)(y/cellPx) → listener.onCellClick(row,col) → GameActivity → GameViewModel.revealCell(x,y) → GameEngine.revealCell() (DFS if empty) → game.postValue() → GameBoardView.invalidate() redraws. If mine: gameStatus=LOST → Game Over.",
      mix: "onTouchEvent → row/col calculation → ViewModel.revealCell → GameEngine (DFS) → postValue → invalidate."
    }
  },
  {
    q: {
      he: "מה ה-Constraint של FirebaseSyncWorker ולמה הוא קריטי?",
      en: "What is FirebaseSyncWorker's Constraint and why is it critical?",
      mix: "FirebaseSyncWorker — Constraint ותדירות?"
    },
    a: {
      he: "NetworkType.CONNECTED — Worker רץ רק עם חיבור אינטרנט. PeriodicWorkRequest כל 15 דקות. WorkManager שורד: reboot, process death, כיבוי. ללא constraint — Worker ינסה לסנכרן גם ללא רשת, יכשל, ויבזבז סוללה.",
      en: "NetworkType.CONNECTED — Worker runs only with internet. PeriodicWorkRequest every 15 minutes. WorkManager survives: reboot, process death, device off. Without constraint — Worker tries sync without network, fails, wastes battery.",
      mix: "NetworkType.CONNECTED + PeriodicWorkRequest (15 min). WorkManager שורד reboot/process death."
    }
  },
  {
    q: {
      he: "מה isCovered() ותפקידו ב-floodReveal?",
      en: "What is isCovered() and its role in floodReveal?",
      mix: "מה תפקיד isCovered() ב-floodReveal?"
    },
    a: {
      he: "isCovered() מחזיר true אם CellState == COVERED. ב-floodReveal זהו ה-visited guard: לאחר setState(REVEALED), התא כבר לא isCovered() ולכן לא יעובד שוב בקריאה רקורסיבית. ללא זה — recursion אינסופית (infinite loop/StackOverflow).",
      en: "isCovered() returns true if CellState == COVERED. In floodReveal it's the visited guard: after setState(REVEALED), the cell is no longer isCovered() so it won't be processed again in recursive calls. Without it — infinite recursion/StackOverflow.",
      mix: "isCovered() = visited guard ב-DFS. אחרי REVEALED → לא יעובד שוב. מונע infinite recursion."
    }
  },
  {
    q: {
      he: "מה Daily Challenge ואיך seed מבטיח לוח זהה לכולם?",
      en: "What is Daily Challenge and how does the seed ensure everyone gets the same board?",
      mix: "Daily Challenge — איך seed מייצר אותו לוח?"
    },
    a: {
      he: "seed = year*10000L + month*100 + day. initializeBoard(w, h, mines, seed) → new Random(seed) → בדיוק אותה סדרה 'אקראית'. כל שחקן בעולם ביום X מקבל אותו לוח. ציונים: daily_challenges/{date}/scores/{userId} ב-Firestore.",
      en: "seed = year*10000L + month*100 + day. initializeBoard(w, h, mines, seed) → new Random(seed) → exact same 'random' sequence. Every player on day X gets the same board. Scores stored at: daily_challenges/{date}/scores/{userId} in Firestore.",
      mix: "seed = date number → new Random(seed) = deterministic board. כולם ביום X = אותו לוח."
    }
  },
  {
    q: {
      he: "למה NFC מוגדר required=false ב-Manifest?",
      en: "Why is NFC set to required=false in the Manifest?",
      mix: "NFC required=false — למה לא required=true?"
    },
    a: {
      he: "required=true → האפליקציה נחסמת לכל מכשיר ללא NFC (חלק גדול מהשוק). required=false → האפליקציה זמינה לכולם; checkNfcStatus() בודק זמינות בזמן ריצה. simulate_nfc=true ב-Intent מאפשר בדיקה ללא חומרה.",
      en: "required=true → app blocked from all devices without NFC (large market share). required=false → app available to everyone; checkNfcStatus() checks at runtime. simulate_nfc=true in Intent enables testing without hardware.",
      mix: "required=false = wider market. checkNfcStatus() בודק runtime. simulate_nfc=true לבדיקה."
    }
  },
  {
    q: {
      he: "מה Singleton Pattern בפרויקט ואיפה משתמשים בו?",
      en: "What is the Singleton Pattern in this project and where is it used?",
      mix: "App Singleton — מה מכיל ומה getInstance() מחזיר?"
    },
    a: {
      he: "App extends Application: private static App instance; public static App getInstance() { return instance; }. מחזיר: FirebaseManager, DatabaseHelper, SyncManager, SettingsManager, ThemeManager, SoundManager, TutorialManager. מופע אחד לכל חיי האפליקציה.",
      en: "App extends Application: private static App instance; public static App getInstance() { return instance; }. Returns: FirebaseManager, DatabaseHelper, SyncManager, SettingsManager, ThemeManager, SoundManager, TutorialManager. One instance for app lifetime.",
      mix: "App.getInstance() = Singleton. מחזיר FirebaseManager, SettingsManager, ThemeManager וכו'. מופע יחיד."
    }
  },
  {
    q: {
      he: "מה Score Calculation Algorithm?",
      en: "What is the Score Calculation Algorithm?",
      mix: "Score formula — כיצד מחושב הניקוד?"
    },
    a: {
      he: "timeBonus = max(1000-seconds, 0); moveBonus = max(500-moves, 0); difficultyBonus = minesCount*10; flagAccuracyBonus = (flagsPlaced==totalMines) ? 200 : (double)totalMines/flagsPlaced*100. Total = סכום. מתגמל מהירות, מינימום מהלכים, רמת קושי, דיוק דגלים.",
      en: "timeBonus = max(1000-seconds, 0); moveBonus = max(500-moves, 0); difficultyBonus = minesCount*10; flagAccuracyBonus = (flagsPlaced==totalMines) ? 200 : (double)totalMines/flagsPlaced*100. Total = sum. Rewards speed, efficiency, difficulty, flag accuracy.",
      mix: "Score = timeBonus + moveBonus + difficultyBonus + flagAccuracyBonus. Perfect flags → 200 bonus."
    }
  },
  {
    q: {
      he: "מה Firestore Security Rules ומה הן מגנות?",
      en: "What are Firestore Security Rules and what do they protect?",
      mix: "Security Rules — users vs scores — מה מותר?"
    },
    a: {
      he: "users/{userId}: allow read=true (ציבורי), allow write: request.auth.uid==userId (רק בעלים). scores/{scoreId}: allow read=true (לוח מובילים ציבורי), allow create: request.auth!=null (מחוברים בלבד). מגן מפני: שכתוב נתוני אחרים, ציונים מזויפים.",
      en: "users/{userId}: allow read=true (public), allow write: request.auth.uid==userId (owner only). scores/{scoreId}: allow read=true (public leaderboard), allow create: request.auth!=null (authenticated only). Protects against: overwriting others' data, fake scores.",
      mix: "users: write = owner only. scores: create = authenticated. מגן מפני fake scores ו-data tampering."
    }
  },
  {
    q: {
      he: "מה BaseNavigationActivity ואיזה Activities יורשים ממנו?",
      en: "What is BaseNavigationActivity and which Activities extend it?",
      mix: "BaseNavigationActivity — מה מכיל ומי יורש?"
    },
    a: {
      he: "Abstract Activity עם: Bottom Navigation Bar, Toolbar, Window insets (status bar padding), Theme application. GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity יורשים. עיקרון DRY — לא כותבים אותו קוד ב-5 Activities.",
      en: "Abstract Activity with: Bottom Navigation Bar, Toolbar, Window insets (status bar padding), Theme application. GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity extend it. DRY — no repeated code in 5 Activities.",
      mix: "BaseNavigationActivity = abstract base. BottomNav + Toolbar + WindowInsets. 5 Activities יורשים."
    }
  },
  {
    q: {
      he: "מה serializeBoardState() עושה ולמה לא משתמשים ב-Gson?",
      en: "What does serializeBoardState() do and why not use Gson?",
      mix: "serializeBoardState — למה manual JSON ולא Gson?"
    },
    a: {
      he: "ממיר Cell[][] ל-JSON string עם StringBuilder ידנית. GameEngine הוא Pure Java (domain layer) — חייב להיות ללא dependencies חיצוניות (Gson = Android/library). Domain layer = testable ב-JUnit ללא אמולטור. Format: {\"cells\":[{\"x\":0,\"y\":0,\"isMine\":false,\"state\":\"COVERED\"},...]}",
      en: "Converts Cell[][] to JSON string manually using StringBuilder. GameEngine is Pure Java (domain layer) — must have zero external dependencies (Gson = Android/library). Domain layer = testable in JUnit without emulator. Format: {\"cells\":[{\"x\":0,\"y\":0,...}]}",
      mix: "GameEngine = Pure Java. Gson = library dependency. אסור! Manual StringBuilder = zero dependencies."
    }
  },
  {
    q: {
      he: "מה toggleFlag עושה ומה מצבי CellState?",
      en: "What does toggleFlag do and what are the CellState values?",
      mix: "toggleFlag — מה מצבי CellState שניתן להחליף?"
    },
    a: {
      he: "toggleFlag מחליף בין COVERED ↔ FLAGGED. אם isFlagged() → setState(COVERED), decrementFlags(). אחרת → setState(FLAGGED), incrementFlags(). לא ניתן לסמן תא REVEALED. CellState values: COVERED, REVEALED, FLAGGED (ועוד EXPLODED בחלק מהגרסאות).",
      en: "toggleFlag switches between COVERED ↔ FLAGGED. If isFlagged() → setState(COVERED), decrementFlags(). Else → setState(FLAGGED), incrementFlags(). Cannot flag a REVEALED cell. CellState values: COVERED, REVEALED, FLAGGED (and EXPLODED in some versions).",
      mix: "toggleFlag: COVERED ↔ FLAGGED. Cannot flag REVEALED cells. CellState: COVERED, REVEALED, FLAGGED."
    }
  },
  {
    q: {
      he: "מה ViewModel.onCleared() ולמה הוא חשוב?",
      en: "What is ViewModel.onCleared() and why is it important?",
      mix: "onCleared() — מה מנקים ולמה?"
    },
    a: {
      he: "נקרא כשה-ViewModel נהרס לצמיתות (Activity סגורה, לא rotate). GameViewModel מנקה: timer.cancel() (java.util.Timer) או handler.removeCallbacks(). ללא ניקוי — memory leak: Timer/Handler ממשיכים לרוץ ברקע גם אחרי שה-Activity נסגרה.",
      en: "Called when ViewModel is permanently destroyed (Activity closed, not rotated). GameViewModel cleans up: timer.cancel() or handler.removeCallbacks(). Without cleanup — memory leak: Timer/Handler continue running after Activity is closed.",
      mix: "onCleared() = cleanup. Timer.cancel() / handler.removeCallbacks(). ללא זה → memory leak."
    }
  },
  {
    q: {
      he: "מה AES הצפנה בפרויקט ואיך עובדת?",
      en: "What is AES encryption in the project and how does it work?",
      mix: "AES encryption — Encrypt → Base64 → Decrypt?"
    },
    a: {
      he: "AES = הצפנה סימטרית (אותו מפתח להצפנה ולפענוח). SecretKeySpec(keyBytes, \"AES\") → Cipher.getInstance(\"AES\") → Cipher.ENCRYPT_MODE → doFinal(data) → Base64.encodeToString לשמירה ב-Firestore. פענוח: DECRYPT_MODE + Base64.decode.",
      en: "AES = symmetric encryption (same key for encrypt/decrypt). SecretKeySpec(keyBytes, \"AES\") → Cipher.getInstance(\"AES\") → Cipher.ENCRYPT_MODE → doFinal(data) → Base64.encodeToString for Firestore storage. Decrypt: DECRYPT_MODE + Base64.decode.",
      mix: "AES symmetric. Encrypt: SecretKeySpec → Cipher.ENCRYPT_MODE → Base64. Decrypt: DECRYPT_MODE → Base64.decode."
    }
  },
  {
    q: {
      he: "מה Room DB גרסה ואיזה entities קיימים?",
      en: "What is the Room DB version and what entities exist?",
      mix: "Room DB — כמה טבלאות, איזו גרסה?"
    },
    a: {
      he: "@Database(version=6): 5 entities: games (היסטוריה + syncedToFirebase), best_scores (שיאים), achievements (הישגים + progress), custom_maps (מפות), custom_presets (הגדרות). Migration 5→6: ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0.",
      en: "@Database(version=6): 5 entities: games (history + syncedToFirebase), best_scores (records), achievements (with progress), custom_maps (maps), custom_presets (settings). Migration 5→6: ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0.",
      mix: "Room v6, 5 entities. Migration 5→6: הוספת syncedToFirebase ל-games. Critical for Offline First."
    }
  }
];

// ----------------------------------------------------------------
// MATCH PAIRS (for Match study mode — 6 pairs shown per round)
// ----------------------------------------------------------------
const MATCH_PAIRS = [
  { term: 'floodReveal', def: 'DFS recursion — מגלה תאים ריקים שכנים' },
  { term: 'isCovered()', def: 'Visited guard ב-DFS — מונע ביקור כפול' },
  { term: 'VMFactory', def: 'ViewModelProvider.Factory — מאפשר ViewModel עם parameters' },
  { term: 'postValue()', def: 'LiveData update מ-background thread' },
  { term: 'setValue()', def: 'LiveData update מ-main thread בלבד' },
  { term: 'syncedToFirebase', def: 'Field ב-Room לסימון pending Firebase sync' },
  { term: 'FirebaseSyncWorker', def: 'PeriodicWorkRequest כל 15 דק\', NetworkType.CONNECTED' },
  { term: 'onCleared()', def: 'ViewModel lifecycle — ניקוי Timer/Handler' },
  { term: 'serializeBoardState()', def: 'Cell[][] → JSON string ידנית (ללא Gson)' },
  { term: 'App.getInstance()', def: 'Singleton — מחזיר FirebaseManager, SettingsManager...' },
  { term: 'BaseNavigationActivity', def: 'Abstract base עם BottomNav + Toolbar' },
  { term: 'daily_challenges/{date}', def: 'Firestore path לציוני Daily Challenge' },
  { term: 'rooms/', def: 'Firebase RTDB path ל-Multiplayer' },
  { term: 'required=false', def: 'NFC Manifest — זמין לכל המכשירים' },
  { term: 'NetworkType.CONNECTED', def: 'WorkManager Constraint — רק עם אינטרנט' },
  { term: 'initializeBoard(w,h,mines,seed)', def: 'new Random(seed) → לוח זהה לכולם' },
  { term: 'flagAccuracyBonus', def: '200 points אם flags==mines, חלקי אחרת' },
  { term: 'difficultyBonus', def: 'minesCount × 10 בחישוב הניקוד' }
];

// ----------------------------------------------------------------
// TRUE/FALSE QUESTIONS (15 questions for T/F study mode)
// ----------------------------------------------------------------
const TRUEFALSE_QUESTIONS = [
  {
    statement: { he: "floodReveal מממש BFS עם Queue<int[]>.", en: "floodReveal implements BFS with Queue<int[]>.", mix: "floodReveal משתמש ב-BFS Queue." },
    correct: false,
    explanation: { he: "שגוי. floodReveal משתמש ב-DFS — recursion. הפונקציה קוראת לעצמה.", en: "False. floodReveal uses DFS — recursion. The function calls itself.", mix: "False! DFS recursion, לא BFS Queue." }
  },
  {
    statement: { he: "setValue() ניתן לקריאה מכל thread.", en: "setValue() can be called from any thread.", mix: "setValue() עובד מכל thread." },
    correct: false,
    explanation: { he: "שגוי. setValue() חייב main thread בלבד. postValue() עובד מכל thread.", en: "False. setValue() requires main thread only. postValue() works from any thread.", mix: "False! setValue() = main thread בלבד. postValue() = כל thread." }
  },
  {
    statement: { he: "Room DB בפרויקט הוא גרסה 6 עם 5 entities.", en: "Room DB in this project is version 6 with 5 entities.", mix: "Room DB = version 6, 5 entities." },
    correct: true,
    explanation: { he: "נכון. @Database(version=6, entities={GameEntity, BestScoreEntity, AchievementEntity, CustomMapEntity, CustomPresetEntity}).", en: "True. @Database(version=6) with those 5 entities.", mix: "True! Room v6, 5 entities." }
  },
  {
    statement: { he: "NFC מוגדר required=true בפרויקט.", en: "NFC is set to required=true in the Manifest.", mix: "NFC: required=true ב-Manifest." },
    correct: false,
    explanation: { he: "שגוי. required=false — האפליקציה זמינה לכולם. required=true היה חוסם מכשירים ללא NFC.", en: "False. required=false — app available to all. required=true would block non-NFC devices.", mix: "False! required=false. זמין לכל מכשיר." }
  },
  {
    statement: { he: "WorkManager שורד reboot של המכשיר.", en: "WorkManager survives a device reboot.", mix: "WorkManager שורד reboot." },
    correct: true,
    explanation: { he: "נכון. זו אחת היתרות המרכזיות של WorkManager על AsyncTask/Thread.", en: "True. This is one of WorkManager's key advantages over AsyncTask/Thread.", mix: "True! WorkManager שורד reboot, process death, app close." }
  },
  {
    statement: { he: "GameEngine.java מייבא Android SDK classes.", en: "GameEngine.java imports Android SDK classes.", mix: "GameEngine imports Android classes." },
    correct: false,
    explanation: { he: "שגוי. GameEngine הוא Pure Java — domain/usecase layer. ללא imports של Android. ניתן לבדוק ב-JUnit ללא אמולטור.", en: "False. GameEngine is Pure Java — domain/usecase layer. No Android imports. Testable in JUnit without emulator.", mix: "False! GameEngine = Pure Java, zero Android imports." }
  },
  {
    statement: { he: "Multiplayer משתמש ב-Firestore.", en: "Multiplayer uses Firestore.", mix: "Multiplayer = Firestore." },
    correct: false,
    explanation: { he: "שגוי. Multiplayer משתמש ב-Firebase Realtime Database (rooms/). Firestore משמש לציונים, פרופילים, daily_challenges.", en: "False. Multiplayer uses Firebase RTDB (rooms/). Firestore is used for scores, profiles, daily_challenges.", mix: "False! Multiplayer = RTDB rooms/. Firestore = scores/users/daily_challenges." }
  },
  {
    statement: { he: "isCovered() משמש כ-visited guard ב-floodReveal.", en: "isCovered() serves as the visited guard in floodReveal.", mix: "isCovered() = visited guard ב-DFS." },
    correct: true,
    explanation: { he: "נכון. לאחר setState(REVEALED), התא כבר לא isCovered() ולכן לא יעובד שוב.", en: "True. After setState(REVEALED), the cell is no longer isCovered() so it won't be processed again.", mix: "True! isCovered() מונע ביקור כפול ב-DFS." }
  },
  {
    statement: { he: "Firebase Auth תומך ב-Anonymous login בפרויקט.", en: "Firebase Auth supports Anonymous login in this project.", mix: "Anonymous login נתמך בפרויקט." },
    correct: true,
    explanation: { he: "נכון. שלוש שיטות: Email+Password, Google Sign-In, Anonymous. Anonymous מאפשר שחקן לשחק מיד ללא הרשמה.", en: "True. Three methods: Email+Password, Google Sign-In, Anonymous. Anonymous lets players start immediately without registering.", mix: "True! 3 auth methods: Email, Google, Anonymous." }
  },
  {
    statement: { he: "serializeBoardState() משתמש ב-Gson לסדרת JSON.", en: "serializeBoardState() uses Gson for JSON serialization.", mix: "serializeBoardState() = Gson library." },
    correct: false,
    explanation: { he: "שגוי. GameEngine הוא Pure Java — משתמש ב-StringBuilder ידנית. Gson הוא library חיצוני שאסור ב-domain layer.", en: "False. GameEngine is Pure Java — uses StringBuilder manually. Gson is an external library forbidden in the domain layer.", mix: "False! Manual StringBuilder. Gson = library dependency אסורה ב-domain layer." }
  },
  {
    statement: { he: "placeMines() מניח מוקשים לפני הלחיצה הראשונה.", en: "placeMines() places mines before the first click.", mix: "מוקשים מונחים לפני הלחיצה הראשונה." },
    correct: false,
    explanation: { he: "שגוי. מוקשים מונחים אחרי הלחיצה הראשונה — ב-firstClick==true ב-revealCell(). placeMines(excludeX, excludeY) לא מניח מוקש על הנקודה הנלחצת.", en: "False. Mines are placed AFTER the first click — when firstClick==true in revealCell(). placeMines(excludeX, excludeY) skips the clicked cell.", mix: "False! Mines placed AFTER first click. First click תמיד בטוח." }
  },
  {
    statement: { he: "BaseNavigationActivity היא abstract class.", en: "BaseNavigationActivity is an abstract class.", mix: "BaseNavigationActivity = abstract." },
    correct: true,
    explanation: { he: "נכון. abstract class עם methods כמו getLayoutResourceId(), getNavigationMenuItemId(), initializeContent(Bundle) שכל Activity יורשת חייבת לממש.", en: "True. Abstract class with methods like getLayoutResourceId(), getNavigationMenuItemId(), initializeContent(Bundle) that each inheriting Activity must implement.", mix: "True! Abstract class. Subclasses implement layout/nav/content methods." }
  },
  {
    statement: { he: "Daily Challenge seed מחושב על פי התאריך הנוכחי.", en: "Daily Challenge seed is calculated from the current date.", mix: "seed = date-based calculation." },
    correct: true,
    explanation: { he: "נכון. seed = year*10000L + month*100 + day → new Random(seed) → אותו לוח לכולם ביום זה.", en: "True. seed = year*10000L + month*100 + day → new Random(seed) → same board for everyone on that day.", mix: "True! seed = year*10000L + month*100 + day. Same board worldwide." }
  },
  {
    statement: { he: "VMFactory יוצר GameViewModel עם Context parameter.", en: "VMFactory creates GameViewModel with a Context parameter.", mix: "VMFactory: GameViewModel(context)." },
    correct: false,
    explanation: { he: "שגוי. GameViewModel נוצר ללא parameters: new GameViewModel(). Context ניתן ל-LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context).", en: "False. GameViewModel is created without parameters: new GameViewModel(). Context is passed to LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context).", mix: "False! GameViewModel() = no-arg. Context ל-Leaderboard/Statistics/Achievements VM." }
  },
  {
    statement: { he: "Migration 5→6 הוסיף את שדה syncedToFirebase לטבלת games.", en: "Migration 5→6 added the syncedToFirebase field to the games table.", mix: "Migration 5→6: syncedToFirebase לטבלת games." },
    correct: true,
    explanation: { he: "נכון. ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0. שדה קריטי ל-Offline First strategy.", en: "True. ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0. Critical field for Offline First strategy.", mix: "True! Migration 5→6: syncedToFirebase. בלי זה → אין Offline First." }
  }
];

// ----------------------------------------------------------------
// WRITE MODE CARDS (see definition, type the term)
// ----------------------------------------------------------------
const WRITE_CARDS = [
  { prompt: { he: "אלגוריתם חשיפת תאים ריקים שכנים — DFS recursion, guard: isCovered()", en: "Algorithm to reveal adjacent empty cells — DFS recursion, guard: isCovered()", mix: "DFS recursion לחשיפת תאים ריקים — guard: isCovered()" }, answer: "floodReveal" },
  { prompt: { he: "LiveData update מ-background thread — thread-safe", en: "LiveData update from background thread — thread-safe", mix: "LiveData update מ-background thread" }, answer: "postValue()" },
  { prompt: { he: "ViewModelProvider.Factory — מאפשר ViewModel עם constructor parameters", en: "ViewModelProvider.Factory — enables ViewModel with constructor parameters", mix: "Factory ל-ViewModel עם parameters" }, answer: "VMFactory" },
  { prompt: { he: "שדה ב-Room games table לסימון נתונים שטרם עלו ל-Firebase", en: "Room games table field marking data not yet uploaded to Firebase", mix: "Flag ב-Room לנתונים שטרם סונכרנו" }, answer: "syncedToFirebase" },
  { prompt: { he: "ViewModel lifecycle method — ניקוי Timer/Handler למניעת memory leak", en: "ViewModel lifecycle method — clean up Timer/Handler to prevent memory leak", mix: "ViewModel cleanup — Timer/Handler" }, answer: "onCleared()" },
  { prompt: { he: "Abstract Activity עם Bottom Navigation + Toolbar + Window Insets", en: "Abstract Activity with Bottom Navigation + Toolbar + Window Insets", mix: "Base class ל-Activities עם BottomNav" }, answer: "BaseNavigationActivity" },
  { prompt: { he: "WorkManager Constraint — Worker רץ רק עם חיבור אינטרנט", en: "WorkManager Constraint — Worker runs only with internet connection", mix: "WorkManager Constraint לאינטרנט" }, answer: "NetworkType.CONNECTED" },
  { prompt: { he: "ממיר Cell[][] ל-JSON string ידנית ללא Gson", en: "Converts Cell[][] to JSON string manually without Gson", mix: "Cell[][] → JSON, ללא Gson" }, answer: "serializeBoardState()" },
  { prompt: { he: "Visited guard ב-floodReveal — CellState == COVERED", en: "Visited guard in floodReveal — CellState == COVERED", mix: "Visited guard ב-DFS = CellState.COVERED" }, answer: "isCovered()" },
  { prompt: { he: "PeriodicWorkRequest כל 15 דקות לסנכרון ל-Firebase", en: "PeriodicWorkRequest every 15 minutes for Firebase sync", mix: "Worker שמסנכרן ל-Firebase כל 15 דקות" }, answer: "FirebaseSyncWorker" },
  { prompt: { he: "Firebase service המשמש ל-Multiplayer real-time — rooms/ path", en: "Firebase service used for Multiplayer real-time — rooms/ path", mix: "Firebase real-time ל-Multiplayer, rooms/ path" }, answer: "Firebase Realtime Database" },
  { prompt: { he: "Singleton מרכזי — מחזיר FirebaseManager, SettingsManager, ThemeManager", en: "Central Singleton — returns FirebaseManager, SettingsManager, ThemeManager", mix: "App Singleton — returns managers" }, answer: "App.getInstance()" },
  { prompt: { he: "הצפנה סימטרית — אותו מפתח להצפנה ולפענוח", en: "Symmetric encryption — same key for encrypt and decrypt", mix: "Symmetric encryption algorithm" }, answer: "AES" },
  { prompt: { he: "Pure Java domain class — לוגיקת משחק ללא Android imports", en: "Pure Java domain class — game logic without Android imports", mix: "Pure Java game logic class" }, answer: "GameEngine" },
  { prompt: { he: "seed = year*10000L + month*100 + day → same board worldwide", en: "seed = year*10000L + month*100 + day → same board worldwide", mix: "אותו לוח לכולם ביום X" }, answer: "Daily Challenge" }
];

// ----------------------------------------------------------------
// QUIZ QUESTIONS (10 — standard practice quiz)
// ----------------------------------------------------------------
const QUIZ_QUESTIONS = [
  {
    q: "איזה thread מאפשר שימוש ב-setValue() של LiveData?",
    o: ["רק main (UI) thread", "רק background thread", "כל thread", "WorkManager thread בלבד"],
    c: 0,
    e: "setValue() חייב להיקרא מה-main thread בלבד. קריאה מ-background thread → IllegalStateException. StatisticsViewModel משתמש ב-postValue() אחרי חישוב ב-new Thread."
  },
  {
    q: "מה אלגוריתם floodReveal בפרויקט?",
    o: ["BFS עם Queue<int[]>", "DFS — Recursion (הפונקציה קוראת לעצמה)", "Binary Search", "Dijkstra's algorithm"],
    c: 1,
    e: "DFS recursion: floodReveal(nx, ny) קוראת לעצמה עבור כל תא ריק שכן. Guard: isCovered() — תא REVEALED לא יעובד שוב. קוד פשוט, עובד בגדלי הלוח הנוכחיים."
  },
  {
    q: "מה מספר גרסת Room DB בפרויקט?",
    o: ["3", "4", "5", "6"],
    c: 3,
    e: "Room DB v6 עם migrations מ-1 עד 6. Migration 5→6 הוסיף עמודת syncedToFirebase לטבלת games — שדה קריטי ל-Offline First."
  },
  {
    q: "מה ה-Constraint שמוגדר ל-FirebaseSyncWorker?",
    o: ["BatteryNotLow", "NetworkType.CONNECTED", "StorageNotLow", "DeviceIdle"],
    c: 1,
    e: "NetworkType.CONNECTED — Worker רץ רק עם חיבור אינטרנט. PeriodicWorkRequest כל 15 דקות. WorkManager שורד reboot ו-process death."
  },
  {
    q: "מה VMFactory יוצר עבור GameViewModel?",
    o: ["new GameViewModel(context)", "new GameViewModel(repository)", "new GameViewModel()", "new GameViewModel(firebaseManager)"],
    c: 2,
    e: "GameViewModel() ללא parameters! רק Leaderboard/Statistics/AchievementsViewModel מקבלים context. VMFactory.create() בודק modelClass ומחזיר האינסטנס הנכון."
  },
  {
    q: "מה isCovered() תפקידו ב-floodReveal?",
    o: ["בודק אם תא הוא מוקש", "Visited guard — מונע עיבוד כפול של תאים", "בודק אם תא גובל במוקש", "בודק אם המשחק הסתיים"],
    c: 1,
    e: "isCovered() מחזיר true אם CellState==COVERED. לאחר setState(REVEALED) התא כבר לא covered → לא יעובד שוב ב-recursion. ללא זה — infinite recursion."
  },
  {
    q: "מה Firebase שירות משמש ל-Multiplayer בזמן אמת?",
    o: ["Firestore", "Firebase Auth", "Firebase Realtime Database", "Firebase Storage"],
    c: 2,
    e: "Firebase RTDB — JSON tree שמתעדכן real-time לכל הלקוחות. rooms/ path. ValueEventListener מקבל עדכון מיידי. Firestore משמש לציונים, פרופילים, daily_challenges."
  },
  {
    q: "מה הפתרון ל-ViewModel עם constructor parameters ב-Android?",
    o: ["ViewModelProvider.Factory (VMFactory)", "Singleton Pattern", "SharedPreferences", "Application class"],
    c: 0,
    e: "VMFactory מממש ViewModelProvider.Factory ויוצר כל ViewModel עם ה-dependencies הנכונות. GameViewModel(), StatisticsViewModel(context), AchievementsViewModel(context)."
  },
  {
    q: "מה הערך של required ב-Manifest עבור NFC ולמה?",
    o: ["required=true", "required=false", "required=auto", "אין צורך להגדיר"],
    c: 1,
    e: "required=false — האפליקציה זמינה לכולם, גם ללא חומרת NFC. checkNfcStatus() בודק בזמן ריצה. required=true יחסום את האפליקציה לרוב המכשירים."
  },
  {
    q: "מה Migration 5→6 ב-Room DB עשה?",
    o: [
      "הוסיף טבלת custom_maps",
      "שינה גרסת Room ל-6",
      "הוסיף עמודת syncedToFirebase לטבלת games",
      "יצר indexes על הטבלאות"
    ],
    c: 2,
    e: "ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0. שדה זה קריטי ל-Offline First — מסמן אילו records טרם עלו ל-Firebase."
  }
];

// ----------------------------------------------------------------
// EXAM QUESTIONS (25 — bagrut style, mix of MCQ + code snippets)
// ----------------------------------------------------------------
const EXAM_QUESTIONS = [
  {
    q: "מה עקרון הפרדת הלוגיקה ב-MVVM? כיצד מתבטא בפרויקט?",
    o: [
      "ViewModel ו-View יכולים לשתף לוגיקה עסקית",
      "GameEngine מכיל לוגיקה טהורה, GameViewModel מנהל state, GameBoardView רק מצייר",
      "Activity מנהלת את כל הלוגיקה כדי לפשט את הקוד",
      "Repository ו-ViewModel ממוזגים לפשטות"
    ],
    c: 1,
    e: "MVVM: View (GameBoardView/Activity) = ציור בלבד. ViewModel = state + עסקי. GameEngine (Domain) = Pure Java ללא Android. Repository = גישה לנתונים. כל שכבה לא יודעת על השכבה שמעליה."
  },
  {
    q: "מה הבדל בין LiveData.setValue() ל-LiveData.postValue()?",
    o: [
      "אין הבדל — שניהם עובדים מכל thread",
      "setValue() מהיר יותר, postValue() בטוח יותר",
      "setValue() רק מ-main thread, postValue() מכל thread",
      "postValue() עדיף תמיד, setValue() deprecated"
    ],
    c: 2,
    e: "setValue() חייב מ-main thread בלבד. postValue() thread-safe — מכל thread. StatisticsViewModel.loadStatistics() רץ ב-new Thread ולכן חייב postValue(). טעות זו גורמת IllegalStateException."
  },
  {
    q: "מה אלגוריתם floodReveal ואיך הוא עובד?",
    o: [
      "BFS עם Queue — מניע כל שכנים בתור",
      "DFS — recursion, הפונקציה קוראת לעצמה לכל שכן ריק; isCovered() = visited guard",
      "Dijkstra — חיפוש מינימלי",
      "Binary search על ה-board"
    ],
    c: 1,
    e: "floodReveal(x,y) בודק 8 שכנים. לכל שכן isCovered() ולא mine: setState(REVEALED). אם adjacentMines==0 → floodReveal(nx,ny) רקורסיה. isCovered() = visited guard — מונע ביקור כפול."
  },
  {
    q: "קטע קוד: מה הפלט הנכון?\n`if (cell.isCovered() && !cell.isMine()) { cell.setState(REVEALED); if (cell.getAdjacentMines() == 0) { floodReveal(nx, ny); } }`",
    o: [
      "BFS — מוסיף ל-Queue ומעבד",
      "DFS — recursion, חושף שכנים ריקים",
      "מגלה רק תאים עם מוקשים שכנים",
      "כלום — הקוד לא חוקי"
    ],
    c: 1,
    e: "זהו לב ה-DFS: בדיקת isCovered() כ-guard → חשיפה → אם ריק (0 שכנים) → recursion. זו הגישה ב-GameEngine.java."
  },
  {
    q: "כמה טבלאות יש ב-Room DB של הפרויקט ומה הגרסה הנוכחית?",
    o: [
      "3 טבלאות, גרסה 4",
      "5 טבלאות, גרסה 6",
      "4 טבלאות, גרסה 5",
      "6 טבלאות, גרסה 7"
    ],
    c: 1,
    e: "5 entities: games, best_scores, achievements, custom_maps, custom_presets. גרסה 6 עם 5 migrations. Migration 5→6 הוסיף syncedToFirebase לטבלת games."
  },
  {
    q: "מה מטרת שדה syncedToFirebase בטבלת games?",
    o: [
      "מסמן אם המשחק הסתיים",
      "מסמן אם המשחק נשמר ב-Room",
      "מסמן אם התוצאה עלתה ל-Firebase — לסנכרון Offline First",
      "מסמן אם המשחק הוא multiplayer"
    ],
    c: 2,
    e: "Offline First: שמירה מיידית ב-Room (syncedToFirebase=0). FirebaseSyncWorker מוצא getUnsynced() ומעלה ל-Firebase, ואז syncedToFirebase=1. מבטיח שאין אובדן נתונים ללא אינטרנט."
  },
  {
    q: "מה ה-Interface INetworkService ומה הוא מגדיר?",
    o: [
      "ממשק Java רגיל עם 4 פעולות CRUD א-סינכרוניות + NetworkCallback",
      "Abstract class עם implementation חלקי",
      "Retrofit interface ל-REST API",
      "Firebase listener interface"
    ],
    c: 0,
    e: "INetworkService: fetchLeaderboard (Read), uploadScore (Create), updateProgress (Update), deleteAccount (Delete). כולן עם NetworkCallback<T>. FirebaseManager implements INetworkService. DI — ViewModel תלוי ב-Interface."
  },
  {
    q: "מה VMFactory ומה הבעיה שהוא פותר?",
    o: [
      "Factory Pattern ליצירת Activities",
      "ViewModelProvider.Factory — מאפשר ViewModel עם constructor parameters",
      "Singleton ל-ViewModel אחד ב-App",
      "Dependency Injection framework"
    ],
    c: 1,
    e: "Android יוצר ViewModel רק עם no-arg constructor. VMFactory.create() מחזיר: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context). ללא VMFactory — אי אפשר להזריק Context."
  },
  {
    q: "מה ה-Constraint של FirebaseSyncWorker ומה WorkManager מבטיח?",
    o: [
      "BatteryNotLow — רץ רק עם סוללה מלאה",
      "NetworkType.CONNECTED — רץ רק עם אינטרנט; WorkManager שורד reboot/process-death",
      "StorageNotLow — רץ רק עם מקום בדיסק",
      "DeviceCharging — רץ רק בטעינה"
    ],
    c: 1,
    e: "NetworkType.CONNECTED מבטיח שלא מנסים לסנכרן ללא חיבור. WorkManager: אם המכשיר כובה ומופעל, הבקשה נשמרת ותרוץ כשהתנאים מתקיימים. AsyncTask היה מתבטל עם סגירת האפליקציה."
  },
  {
    q: "מה GameBoardView ומה השיטות הקריטיות שעליו לממש?",
    o: [
      "Fragment שמציג את הלוח",
      "RecyclerView Adapter ל-cells",
      "Custom View (extends View) עם onDraw(Canvas) ו-onTouchEvent(MotionEvent)",
      "Activity שמנהלת את הלוח"
    ],
    c: 2,
    e: "GameBoardView extends View: setGame(game) → invalidate() → onDraw(Canvas) מצייר כל תא. onTouchEvent(MotionEvent): col=(int)(x/cellPx), row=(int)(y/cellPx) → listener.onCellClick(r,c). invalidate() = ציור מחדש — חובה אחרי כל שינוי."
  },
  {
    q: "מה Daily Challenge ואיך seed מבטיח לוח זהה לכולם?",
    o: [
      "לוח אקראי שנשמר ב-Firestore ומוריד לכולם",
      "seed = year*10000L + month*100 + day → new Random(seed) → אותה סדרה לכולם",
      "לוח קבוע שנכתב ידנית בקוד",
      "Multiplayer לוח שמחלק server מרכזי"
    ],
    c: 1,
    e: "seed = year*10000L + month*100 + day. initializeBoard(w,h,mines,seed) → new Random(seed). כולם מקבלים אותו רצף 'אקראי'. ציונים: daily_challenges/{date}/scores/{userId} ב-Firestore."
  },
  {
    q: "מה ה-Repository Pattern ומדוע הוא חשוב ב-MVVM?",
    o: [
      "Pattern ליצירת objects חוזרת",
      "שכבת תיווך — ViewModel לא יודע אם מידע מ-Room או Firebase",
      "Design pattern לניהול threads",
      "Interface ל-Remote API"
    ],
    c: 1,
    e: "GameRepository: ViewModel קורא saveGame(result) — Repository מחליט: שמירה ב-Room (תמיד), העלאה ל-Firebase (אם online). ViewModel לא יודע מאיפה המידע — ניתן להחליף מקור נתונים ללא שינוי ViewModel."
  },
  {
    q: "מה BaseFirebaseModel ומי יורש ממנו?",
    o: [
      "Abstract class ל-Room Entities",
      "Interface ל-Firebase operations",
      "מחלקת בסיס עם documentId/createdAt/updatedAt — UserRecord ו-LeaderboardEntry יורשים",
      "Singleton ל-Firebase connection"
    ],
    c: 2,
    e: "BaseFirebaseModel: שדות documentId, createdAt, updatedAt. UserRecord extends BaseFirebaseModel (userId, gamesWon). LeaderboardEntry extends BaseFirebaseModel (score, playerName). DRY — לא כותבים שדות משותפים שוב ושוב."
  },
  {
    q: "מה Multiplayer מממש ב-Firebase ואיך נבנה החדר?",
    o: [
      "Firestore עם polling כל שניה",
      "Firebase RTDB — rooms/{roomId} עם ValueEventListener לעדכון real-time",
      "WebSocket server נפרד",
      "Firebase Cloud Messaging לשליחת מסרים"
    ],
    c: 1,
    e: "Firebase RTDB: rooms/{roomId}/{playerId}/moves. ValueEventListener מקבל callback מיידי כשמשתמש אחד לוחץ. MultiplayerLobbyActivity יוצר חדר → שני שחקנים מצטרפים → כל לחיצה כתובה ל-RTDB מיד."
  },
  {
    q: "מה BaseNavigationActivity ואיזה Activities יורשים ממנו?",
    o: [
      "Abstract class ל-Firebase operations",
      "Activity בסיס עם Bottom Navigation + Toolbar; GameActivity, StatisticsActivity, ProfileActivity יורשים",
      "Service ברקע לניווט",
      "Fragment Manager לניהול מסכים"
    ],
    c: 1,
    e: "BaseNavigationActivity: Bottom Navigation Bar, Toolbar, Window insets, Theme application. GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity יורשים. DRY — לא כותבים אותו קוד ב-5 Activities."
  },
  {
    q: "למה GameEngine הוא Pure Java ללא Android imports?",
    o: [
      "כי Android מאט את הקוד",
      "כי domain layer חייב להיות testable ב-JUnit ללא אמולטור — Clean Architecture",
      "כי Firebase לא תומך ב-Android classes",
      "אין סיבה — זו שגיאה בקוד"
    ],
    c: 1,
    e: "Clean Architecture: domain layer (GameEngine) = Pure Java. ניתן לבדוק לוגיקת משחק ב-JUnit ללא אמולטור Android. אם GameEngine היה תלוי ב-Android SDK — בדיקות היו דורשות אמולטור איטי."
  },
  {
    q: "מה serializeBoardState() עושה ולמה לא משתמשים ב-Gson?",
    o: [
      "משתמש ב-Gson לנוחות",
      "משתמש ב-StringBuilder ידנית — GameEngine הוא Pure Java ללא dependencies חיצוניות",
      "שומר ב-SharedPreferences",
      "שומר ב-Room DB ישירות"
    ],
    c: 1,
    e: "GameEngine = Pure Java domain class. Gson = library חיצוני → dependency אסורה ב-domain layer. StringBuilder בונה: {\"cells\":[{\"x\":0,\"y\":0,\"isMine\":false,\"state\":\"COVERED\"},...]}. restoreBoardState() מפענח בחזרה."
  },
  {
    q: "מה ה-Score Calculation Algorithm בפרויקט?",
    o: [
      "ניקוד קבוע לכל רמה (Easy:100, Medium:200, Hard:300)",
      "timeBonus + moveBonus + difficultyBonus + flagAccuracyBonus",
      "ניקוד = 1000 / זמן_בשניות",
      "ניקוד בינארי: ניצחון=1, הפסד=0"
    ],
    c: 1,
    e: "GameEngine: timeBonus=max(1000-seconds,0); moveBonus=max(500-moves,0); difficultyBonus=minesCount*10; flagAccuracyBonus=(flagsPlaced==totalMines)?200:accuracy*100. מתגמל מהירות, יעילות, רמה, דיוק דגלים."
  },
  {
    q: "מה NFC מיממש ומה onNewIntent() עושה?",
    o: [
      "Near-Field Communication לשיתוף קוד QR",
      "NfcHandler כותב NDEF Message עם פרטי CustomMap; onNewIntent() מפענח כשמכשיר נגע",
      "Bluetooth alternative לשיתוף נתונים",
      "Wi-Fi Direct לחיבור מכשירים"
    ],
    c: 1,
    e: "NfcActivity: NfcHandler.write() → NDEF Message. onNewIntent(Intent) מופעל כשמכשיר ב' נגע → handleIntent() → מפענח NdefMessage → לחצן Accept מאפשר משחק על אותה מפה. simulate_nfc=true לבדיקה."
  },
  {
    q: "מה ה-Singleton Pattern בפרויקט ואיפה משתמשים בו?",
    o: [
      "FirebaseManager הוא Singleton",
      "App extends Application הוא Singleton — getInstance() מחזיר FirebaseManager, SettingsManager, ThemeManager ועוד",
      "GameEngine הוא Singleton",
      "Room DB הוא Singleton"
    ],
    c: 1,
    e: "App extends Application: private static App instance; public static App getInstance(). מכיל: FirebaseManager, DatabaseHelper, SyncManager, SettingsManager, ThemeManager, SoundManager, TutorialManager. כל Activity שולף: App.getInstance().getFirebaseManager()."
  },
  {
    q: "מה Image Upload מיממש ואיזה ספרייה טוענת תמונות?",
    o: [
      "Picasso לטעינה, AWS S3 לאחסון",
      "Coil לטעינה, Cloudinary לאחסון",
      "Glide לטעינה, Firebase Storage לאחסון; URL נשמר ב-Firestore",
      "Fresco לטעינה, Google Drive לאחסון"
    ],
    c: 2,
    e: "ProfileActivity: גלריה → דחיסה → Firebase Storage upload → URL → Firestore users/{uid}/photoUrl. Glide.with(context).load(url).placeholder(R.drawable.default_avatar).into(imageView). Glide מטפל ב-caching אוטומטי."
  },
  {
    q: "מה ה-Firestore Security Rules ומה הן מגנות?",
    o: [
      "rules_version='2'; כל כתיבה מותרת למחוברים",
      "users/{userId}: write רק ל-owner; scores/: create רק למחוברים",
      "כל המסמכים פתוחים לקריאה וכתיבה",
      "כל הנתונים סגורים לכתיבה חיצונית"
    ],
    c: 1,
    e: "users/{uid}: allow read: if true; allow write: if request.auth.uid == userId. scores/: allow read: if true; allow create: if request.auth != null. מגן מפני: שכתוב נתוני אחרים, ציונים מזויפים."
  },
  {
    q: "קטע קוד: `if (firstClick) { placeMines(x, y); firstClick = false; }` מה מבטיח?",
    o: [
      "מוקשים לא מונחים על שורה ראשונה",
      "הלחיצה הראשונה תמיד בטוחה — מוקשים מונחים אחרי ולא על התא שנלחץ",
      "מגביל ל-מוקש אחד בלחיצה ראשונה",
      "מונע לחיצה כפולה על אותו תא"
    ],
    c: 1,
    e: "First Click Safe: מוקשים מונחים אחרי הלחיצה הראשונה. placeMines(excludeX=x, excludeY=y) מדלג על הקואורדינטה הנלחצת. מבטיח שהלחיצה הראשונה אף פעם אינה מוקש."
  },
  {
    q: "מה toggleFlag עושה ב-GameEngine?",
    o: [
      "מחליף בין 3 מצבים: COVERED → FLAGGED → QUESTION → COVERED",
      "מחליף בין COVERED ↔ FLAGGED בלבד; לא ניתן לסמן REVEALED",
      "מגלה את התא אחרי סימון",
      "מסמן את כל השכנים בדגל"
    ],
    c: 1,
    e: "if (cell.isFlagged()) { setState(COVERED); decrementFlags(); } else { setState(FLAGGED); incrementFlags(); }. לא ניתן לסמן REVEALED cell (return false). שני מצבים בלבד."
  },
  {
    q: "מה ViewModel.onCleared() ולמה חשוב לנקות Timer?",
    o: [
      "נקרא בכל rotation — צריך לאפס timer",
      "נקרא רק כשה-Activity נהרסת לצמיתות — timer.cancel() מונע memory leak",
      "נקרא כל שניה לעדכון timer",
      "אין צורך לנקות timer — Java GC מטפל"
    ],
    c: 1,
    e: "onCleared() נקרא כשה-ViewModel נהרס לצמיתות (Activity סגורה). ViewModel שורד rotation ולא קורא onCleared() אז. timer.cancel() (ב-java.util.Timer) או handler.removeCallbacks() מונעים memory leak — Timer ממשיך בלי ניקוי."
  }
];

// Maps each EXAM_QUESTION index to its topic (same order as the array above)
const EXAM_TOPICS = [
  'MVVM',        // 0  — separation of logic
  'LiveData',    // 1  — setValue vs postValue
  'GameEngine',  // 2  — floodReveal algorithm
  'GameEngine',  // 3  — floodReveal code snippet
  'Room DB',     // 4  — tables & version
  'Offline First', // 5 — syncedToFirebase
  'Firebase',    // 6  — INetworkService
  'MVVM',        // 7  — VMFactory
  'WorkManager', // 8  — FirebaseSyncWorker
  'UI',          // 9  — GameBoardView
  'Firebase',    // 10 — Daily Challenge seed
  'MVVM',        // 11 — Repository Pattern
  'Firebase',    // 12 — BaseFirebaseModel
  'Firebase',    // 13 — Multiplayer RTDB
  'UI',          // 14 — BaseNavigationActivity
  'GameEngine',  // 15 — Pure Java domain
  'GameEngine',  // 16 — serializeBoardState
  'GameEngine',  // 17 — Score Calculation
  'NFC',         // 18 — NfcHandler
  'Architecture',// 19 — Singleton / App class
  'Firebase',    // 20 — Glide + Firebase Storage
  'Firebase',    // 21 — Firestore Security Rules
  'GameEngine',  // 22 — First Click Safe
  'GameEngine',  // 23 — toggleFlag
  'MVVM',        // 24 — onCleared / Timer leak
];

// ----------------------------------------------------------------
// TOPICS (deep-dive content for topics.html)
// ----------------------------------------------------------------
const TOPICS = [
  {
    key: 'async',
    icon: '⚡',
    title: 'א-סינכרוני',
    desc: 'ExecutorService, WorkManager, postValue vs setValue',
    content: `
<div class="highlight orange"><strong>למה חשוב?</strong> Android לא מאפשר פעולות רשת/DB ב-UI Thread — גורם ל-ANR (App Not Responding).</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>שכבה 1: ExecutorService (Room writes)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cm">// ב-Repository — שמירה ל-Room ברקע</span>
<span class="cn">AppDatabase</span>.databaseWriteExecutor.<span class="fn">execute</span>(() -&gt; {
    gameDao.<span class="fn">insertGame</span>(entity);
});</pre>
<code>Executors.newFixedThreadPool(4)</code> נוצר ב-build של AppDatabase.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>שכבה 2: new Thread (StatisticsViewModel)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">new</span> <span class="cn">Thread</span>(() -&gt; {
    <span class="cn">List</span>&lt;<span class="cn">Game</span>&gt; games = gameRepository.<span class="fn">getAllGames</span>();
    <span class="cn">StatisticsData</span> stats = <span class="fn">calculateStatistics</span>(games);
    statisticsData.<span class="fn">postValue</span>(stats); <span class="cm">// postValue — לא setValue!</span>
}).<span class="fn">start</span>();</pre>
<strong>חוק:</strong> setValue() = main thread בלבד. postValue() = מכל thread.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>שכבה 3: WorkManager (Background Service)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cn">PeriodicWorkRequest</span> syncWork = <span class="kw">new</span> <span class="cn">PeriodicWorkRequest.Builder</span>(
    <span class="cn">FirebaseSyncWorker</span>.<span class="kw">class</span>, 15, <span class="cn">TimeUnit</span>.<span class="nm">MINUTES</span>)
    .<span class="fn">setConstraints</span>(<span class="kw">new</span> <span class="cn">Constraints.Builder</span>()
        .<span class="fn">setRequiredNetworkType</span>(<span class="cn">NetworkType</span>.<span class="nm">CONNECTED</span>).<span class="fn">build</span>())
    .<span class="fn">build</span>();</pre>
WorkManager שורד: reboot, process death, כיבוי. AsyncTask (deprecated) לא שורד.
</div></div>`
  },
  {
    key: 'db',
    icon: '🗄️',
    title: 'מסד נתונים',
    desc: 'DSD, 5 טבלאות, קישור, migrations',
    content: `
<div class="highlight"><strong>5 טבלאות ב-Room v6:</strong></div>
<table class="cmp-table">
<tr><th>טבלה</th><th>שדות עיקריים</th><th>תפקיד</th></tr>
<tr><td><code>games</code></td><td>id, userId, difficultyId, status, secondsElapsed, boardState(JSON), syncedToFirebase</td><td>היסטוריית משחקים</td></tr>
<tr><td><code>best_scores</code></td><td>id, userId, firebaseUid, playerName, difficultyId, seconds, syncedToFirebase</td><td>שיאים אישיים</td></tr>
<tr><td><code>achievements</code></td><td>id, name, category, requirement, progress, unlocked, unlockedAt</td><td>הישגים</td></tr>
<tr><td><code>custom_maps</code></td><td>id, name, rows, cols, bombPositions(JSON), source, userId</td><td>מפות מותאמות</td></tr>
<tr><td><code>custom_presets</code></td><td>id, name, width, height, mines, createdAt</td><td>הגדרות מהירות</td></tr>
</table>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Migrations – למה 6 גרסאות?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cm">// Migration 5→6 — הוסיף Offline First support</span>
<span class="cn">Migration</span> MIGRATION_5_6 = <span class="kw">new</span> <span class="cn">Migration</span>(5, 6) {
    <span class="an">@Override</span>
    <span class="kw">public void</span> <span class="fn">migrate</span>(<span class="cn">SupportSQLiteDatabase</span> db) {
        db.<span class="fn">execSQL</span>(<span class="st">"ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0"</span>);
    }
};</pre>
בלי Migration — האפליקציה קורסת למשתמשים עם גרסה ישנה (IllegalStateException).
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>boardState כ-JSON – למה?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
Cell[][] לא ניתן לשמירה ישירה. GameEngine.serializeBoardState() בונה JSON עם StringBuilder (ללא Gson — Pure Java domain). שמירה בעמודה אחת. restoreBoardState() טוען חזרה.
</div></div>`
  },
  {
    key: 'gameengine',
    icon: '🎮',
    title: 'GameEngine',
    desc: 'DFS flood fill, mine placement, score, serialization',
    content: `
<div class="highlight green"><code>GameEngine.java</code> ב-domain/usecase — Pure Java, ללא Android dependency.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>floodReveal DFS — קוד מלא (מהפרויקט)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">private void</span> <span class="fn">floodReveal</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) {
    <span class="kw">for</span> (<span class="kw">int</span> dy = -1; dy &lt;= 1; dy++) {
        <span class="kw">for</span> (<span class="kw">int</span> dx = -1; dx &lt;= 1; dx++) {
            <span class="kw">if</span> (dx == 0 && dy == 0) <span class="kw">continue</span>;
            <span class="kw">int</span> nx = x + dx, ny = y + dy;
            <span class="kw">if</span> (nx &gt;= 0 && nx &lt; width && ny &gt;= 0 && ny &lt; height) {
                <span class="cn">Cell</span> c = board[ny][nx];
                <span class="kw">if</span> (c.<span class="fn">isCovered</span>() && !c.<span class="fn">isMine</span>()) {
                    c.<span class="fn">setState</span>(<span class="cn">CellState</span>.<span class="nm">REVEALED</span>);
                    game.<span class="fn">incrementTilesRevealed</span>();
                    <span class="cm">// Recursively reveal if no adjacent mines (DFS)</span>
                    <span class="kw">if</span> (c.<span class="fn">getAdjacentMines</span>() == 0) {
                        <span class="fn">floodReveal</span>(nx, ny);
                    }
                }
            }
        }
    }
}</pre>
Guard: <code>isCovered()</code> — לאחר REVEALED, תא לא יעובד שוב.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Score Calculation — קוד מלא</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">int</span> timeBonus = <span class="cn">Math</span>.<span class="fn">max</span>(1000 - seconds, 0);
<span class="kw">int</span> moveBonus = <span class="cn">Math</span>.<span class="fn">max</span>(500 - moves, 0);
<span class="kw">int</span> difficultyBonus = difficulty * 10; <span class="cm">// difficulty = minesCount</span>
<span class="kw">int</span> flagAccuracyBonus = 0;
<span class="kw">if</span> (flagsPlaced == totalMines) {
    flagAccuracyBonus = 200; <span class="cm">// Perfect placement</span>
} <span class="kw">else if</span> (flagsPlaced &gt; 0) {
    <span class="kw">double</span> accuracy = <span class="cn">Math</span>.<span class="fn">min</span>(1.0, (<span class="kw">double</span>) totalMines / flagsPlaced);
    flagAccuracyBonus = (<span class="kw">int</span>) (accuracy * 100);
}
<span class="kw">return</span> timeBonus + moveBonus + difficultyBonus + flagAccuracyBonus;</pre>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>serializeBoardState — ללא Gson</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cn">StringBuilder</span> json = <span class="kw">new</span> <span class="cn">StringBuilder</span>();
json.<span class="fn">append</span>(<span class="st">"{\"cells\":["</span>);
<span class="kw">for</span> (<span class="kw">int</span> y = 0; y &lt; height; y++) {
    <span class="kw">for</span> (<span class="kw">int</span> x = 0; x &lt; width; x++) {
        <span class="cn">Cell</span> cell = board[y][x];
        json.<span class="fn">append</span>(<span class="st">"{\"x\":"</span>).<span class="fn">append</span>(x)
            .<span class="fn">append</span>(<span class="st">",\"isMine\":"</span>).<span class="fn">append</span>(cell.<span class="fn">isMine</span>())
            .<span class="fn">append</span>(<span class="st">",\"state\":\""</span>).<span class="fn">append</span>(cell.<span class="fn">getState</span>().<span class="fn">name</span>())
            .<span class="fn">append</span>(<span class="st">"\"}"</span>);
    }
}
json.<span class="fn">append</span>(<span class="st">"]}"</span>);</pre>
Pure Java — ללא Gson, ללא Android dependency.
</div></div>`
  },
  {
    key: 'firebase_deep',
    icon: '🔥',
    title: 'Firebase עמוק',
    desc: 'Firestore vs RTDB, Auth, Security Rules',
    content: `
<table class="cmp-table">
<tr><th>נושא</th><th>Firestore</th><th>Realtime Database</th></tr>
<tr><td>מבנה</td><td>Collections/Documents (NoSQL)</td><td>JSON tree</td></tr>
<tr><td>שאילתות</td><td>מורכבות, filtering, ordering</td><td>פשוטות, בעיקר לפי path</td></tr>
<tr><td>Real-time</td><td>כן, Listeners</td><td>כן, מהיר יותר</td></tr>
<tr><td>שימוש בפרויקט</td><td>scores/, users/, daily_challenges/</td><td>rooms/ (Multiplayer)</td></tr>
<tr><td>Offline cache</td><td>מובנה, מצוין</td><td>חלקי</td></tr>
</table>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Firebase Auth – 3 דרכי כניסה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">1. Email + Password<br>2. Google Sign-In<br>3. Anonymous (אורח — משחק ללא גיבוי)<br><br>
AuthViewModel מנהל מצב. כתיבה לFirestore: <code>FirebaseAuth.getInstance().getCurrentUser().getUid()</code>.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Security Rules — שורה אחר שורה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre style="direction:ltr;text-align:left">rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;   // פרופילים ציבוריים
      allow write: if request.auth.uid == userId; // רק בעלים
    }
    match /scores/{scoreId} {
      allow read: if true;            // לוח מובילים ציבורי
      allow create: if request.auth != null; // מחוברים בלבד
    }
  }
}</pre>
</div></div>`
  },
  {
    key: 'oop_deep',
    icon: '🧩',
    title: 'OOP עמוק',
    desc: 'ירושה, Singleton, Interface, DI, Repository',
    content: `
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>ירושה — 5 דוגמאות מהפרויקט</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
1. <code>BaseNavigationActivity</code> ← GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity<br>
2. <code>View</code> ← <code>GameBoardView</code> (Canvas + touch)<br>
3. <code>Worker</code> ← <code>FirebaseSyncWorker</code>, <code>AchievementSyncWorker</code><br>
4. <code>ViewModel</code> ← GameViewModel, StatisticsViewModel, AchievementsViewModel, AuthViewModel<br>
5. <code>BaseFirebaseModel</code> ← UserRecord, LeaderboardEntry
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Singleton Pattern — App.getInstance()</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">public class</span> <span class="cn">App</span> <span class="kw">extends</span> <span class="cn">Application</span> {
    <span class="kw">private static</span> <span class="cn">App</span> instance;
    <span class="an">@Override</span>
    <span class="kw">public void</span> <span class="fn">onCreate</span>() {
        <span class="kw">super</span>.<span class="fn">onCreate</span>();
        instance = <span class="kw">this</span>;
        <span class="cm">// Initialize: FirebaseManager, DatabaseHelper, SettingsManager...</span>
    }
    <span class="kw">public static</span> <span class="cn">App</span> <span class="fn">getInstance</span>() { <span class="kw">return</span> instance; }
}</pre>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Repository Pattern — Single Source of Truth</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">public class</span> <span class="cn">GameRepository</span> {
    <span class="kw">private final</span> <span class="cn">GameDao</span> gameDao;
    <span class="kw">private final</span> <span class="cn">FirebaseManager</span> firebase;

    <span class="kw">public void</span> <span class="fn">saveGameResult</span>(<span class="cn">GameResult</span> r) {
        executor.<span class="fn">execute</span>(() -&gt; gameDao.<span class="fn">insertGame</span>(r.<span class="fn">toEntity</span>())); <span class="cm">// LOCAL FIRST</span>
        <span class="kw">if</span> (firebase.<span class="fn">isOnline</span>()) firebase.<span class="fn">uploadGame</span>(r);          <span class="cm">// REMOTE async</span>
    }
}</pre>
ViewModel לא יודע מאיפה המידע — ניתן להחליף מקור ללא שינוי ViewModel.
</div></div>`
  },
  {
    key: 'network',
    icon: '📡',
    title: 'שירותי רשת',
    desc: 'Interface, CRUD, הצפנה, תמונות',
    content: `
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>INetworkService – CRUD מלא</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="kw">public interface</span> <span class="cn">INetworkService</span> {
    <span class="kw">void</span> <span class="fn">fetchLeaderboard</span>(<span class="cn">String</span> difficulty, <span class="cn">NetworkCallback</span>&lt;<span class="cn">List</span>&lt;<span class="cn">LeaderboardEntry</span>&gt;&gt; cb);
    <span class="kw">void</span> <span class="fn">uploadScore</span>(<span class="cn">LeaderboardEntry</span> entry, <span class="cn">NetworkCallback</span>&lt;<span class="cn">Boolean</span>&gt; cb);
    <span class="kw">void</span> <span class="fn">updateProgress</span>(<span class="cn">String</span> uid, <span class="cn">PlayerProgress</span> p, <span class="cn">NetworkCallback</span>&lt;<span class="cn">Boolean</span>&gt; cb);
    <span class="kw">void</span> <span class="fn">deleteAccount</span>(<span class="cn">String</span> uid, <span class="cn">NetworkCallback</span>&lt;<span class="cn">Boolean</span>&gt; cb);
}</pre>
DI: ViewModel תלוי ב-Interface לא ב-Firebase — ניתן להחליף ל-REST בלי לגעת ב-ViewModel.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>הרחבה 1 – Image Upload</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
ProfileActivity: גלריה → דחיסה → Firebase Storage (async) → URL → Firestore users/{uid}/photoUrl. <br>
<code>Glide.with(ctx).load(url).placeholder(defaultAvatar).into(imageView)</code> — caching אוטומטי.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>הרחבה 2 – AES Encryption</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cn">SecretKeySpec</span> key = <span class="kw">new</span> <span class="cn">SecretKeySpec</span>(keyBytes, <span class="st">"AES"</span>);
<span class="cn">Cipher</span> cipher = <span class="cn">Cipher</span>.<span class="fn">getInstance</span>(<span class="st">"AES"</span>);
cipher.<span class="fn">init</span>(<span class="cn">Cipher</span>.<span class="nm">ENCRYPT_MODE</span>, key);
<span class="cn">String</span> encrypted = <span class="cn">Base64</span>.<span class="fn">encodeToString</span>(
    cipher.<span class="fn">doFinal</span>(data.<span class="fn">getBytes</span>()), <span class="cn">Base64</span>.<span class="nm">DEFAULT</span>);</pre>
AES = סימטרי. לפענוח: Cipher.DECRYPT_MODE + Base64.decode.
</div></div>`
  },
  {
    key: 'android_lifecycle',
    icon: '📱',
    title: 'Android Lifecycle',
    desc: 'Activity/ViewModel lifecycle, rotation survival',
    content: `
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Activity Lifecycle — הסדר המלא</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
onCreate → onStart → onResume [ACTIVE] → onPause → onStop → onDestroy<br><br>
StatisticsActivity.onResume() → viewModel.loadStatistics() (טוען נתונים עדכניים כשחוזרים מ-GameActivity).
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>ViewModel שורד סיבוב מסך</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
Activity נהרסת ונוצרת מחדש בסיבוב מסך. ViewModel שורד — board[][], timerSeconds, score, gameStatus נשמרים. onCleared() נקרא רק כשה-Activity סגורה לצמיתות.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>VMFactory — הצהרה ושימוש</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<pre><span class="cm">// ב-Activity:</span>
<span class="cn">VMFactory</span> factory = <span class="kw">new</span> <span class="cn">VMFactory</span>(<span class="kw">this</span>);
gameViewModel = <span class="kw">new</span> <span class="cn">ViewModelProvider</span>(<span class="kw">this</span>, factory)
    .<span class="fn">get</span>(<span class="cn">GameViewModel</span>.<span class="kw">class</span>);
statsViewModel = <span class="kw">new</span> <span class="cn">ViewModelProvider</span>(<span class="kw">this</span>, factory)
    .<span class="fn">get</span>(<span class="cn">StatisticsViewModel</span>.<span class="kw">class</span>);</pre>
</div></div>`
  },
  {
    key: 'advanced',
    icon: '🚀',
    title: 'נושאים מתקדמים',
    desc: 'NFC, Custom View, Multiplayer, DailyChallenge',
    content: `
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>NFC – תרחיש שיתוף שלם</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
1. שחקן א' → NfcActivity → "שתף מפה" → NfcHandler.write(mapData)<br>
2. NDEF Message עם: rows, cols, bombPositions<br>
3. שחקן ב' קרב טלפון → onNewIntent(intent) מופעל (launchMode=singleTop)<br>
4. handleIntent() → NdefMessage.getRecords()[0].getPayload() → deserialize<br>
5. btnAcceptChallenge → startGame(customMap)<br><br>
<code>simulate_nfc=true</code> ב-Intent → simulateNfc() לבדיקה ללא חומרה.
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>GameBoardView – Canvas ב-3 שלבים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
1. <code>setGame(game)</code> → שמור reference → <code>invalidate()</code> = ציור מחדש<br>
2. <code>onDraw(Canvas)</code> → לולאה board[r][c] → drawCell(canvas, r, c, cellPx)<br>
3. <code>onTouchEvent(MotionEvent)</code> → col=(int)(x/cellPx), row=(int)(y/cellPx) → listener.onCellClick(row,col)
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Multiplayer – RTDB flow מלא</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
1. MultiplayerLobbyActivity → <code>rooms.push()</code> → roomId<br>
2. שחקן ב' → <code>rooms/{roomId}/players.push(uid)</code><br>
3. שניהם → ValueEventListener על <code>rooms/{roomId}</code><br>
4. כל לחיצה → כתיבה ל-RTDB → callback מיידי לשני המכשירים<br>
5. Disconnect → <code>onDisconnect().removeValue()</code> → חדר נמחק אוטומטית
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>Design Decisions – למה DFS ולא BFS?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
✓ <strong>CHOSEN: DFS recursion</strong> — פשוטה יותר לכתוב, קוד קצר.<br>
✗ <strong>REJECTED: BFS Queue</strong> — דורש Queue ידנית, קוד ארוך יותר.<br>
💡 <strong>WHY:</strong> גדלי הלוח הנוכחיים (עד 30×16) בטוחים מ-StackOverflow. BFS = פתרון אם לוחות גדולים מאוד דרושים.
</div></div>`
  }
];

// ----------------------------------------------------------------
// SEARCH INDEX
// ----------------------------------------------------------------
const SEARCH_INDEX = [
  ...FLASHCARDS.map((fc, i) => ({
    type: 'כרטיסייה',
    title: (typeof fc.q === 'string' ? fc.q : fc.q.he).substring(0, 60),
    snippet: (typeof fc.a === 'string' ? fc.a : fc.a.he).substring(0, 100),
    url: `flashcards.html#fc${i}`,
    navIdx: i
  })),
  ...QUIZ_QUESTIONS.map((q, i) => ({
    type: 'חידון',
    title: q.q.substring(0, 60),
    snippet: q.e.substring(0, 100),
    url: 'quiz.html',
    navIdx: i
  })),
  ...TOPICS.map(t => ({
    type: 'נושא',
    title: t.title + ' — ' + t.desc,
    snippet: '',
    url: `topics.html#${t.key}`,
    navIdx: null
  })),
  ...DESIGN_DECISIONS.map(d => ({
    type: 'החלטה',
    title: d.topic + ' — ✓' + d.chosen,
    snippet: (typeof d.why === 'string' ? d.why : d.why.he).substring(0, 100),
    url: 'architecture.html#decisions',
    navIdx: null
  })),
  { type: 'ארכיטקטורה', title: 'MVVM — View / ViewModel / Repository', snippet: 'GameActivity, GameViewModel, GameRepository, GameEngine', url: 'architecture.html', navIdx: null },
  { type: 'ארכיטקטורה', title: 'VMFactory — ViewModelProvider.Factory', snippet: 'GameViewModel, StatisticsViewModel, AchievementsViewModel, LeaderboardViewModel', url: 'architecture.html', navIdx: null },
  { type: 'ארכיטקטורה', title: 'Offline First — Room → Firebase', snippet: 'syncedToFirebase, WorkManager, FirebaseSyncWorker', url: 'architecture.html', navIdx: null },
  { type: 'קוד', title: 'GameEngine — floodReveal DFS Recursion', snippet: 'isCovered() guard, adjacentMines, CellState.REVEALED', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'serializeBoardState — ללא Gson, Pure Java StringBuilder', snippet: 'domain layer, Pure Java, JSON, Cell[][]', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'INetworkService — CRUD Interface', snippet: 'fetchLeaderboard, uploadScore, updateProgress, deleteAccount', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'Room DB — Migration 5→6', snippet: 'ALTER TABLE games ADD COLUMN syncedToFirebase', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'WorkManager — FirebaseSyncWorker', snippet: 'PeriodicWorkRequest, NetworkType.CONNECTED, doWork()', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'NFC — NfcActivity + onNewIntent + NDEF', snippet: 'NfcHandler, NDEF, handleIntent, simulate_nfc, required=false', url: 'code.html', navIdx: null },
  { type: 'מבחן', title: 'Exam Mode — מבחן בגרות 25 שאלות', snippet: '45 דקות, ציון 55-100, כולל קטעי קוד', url: 'exam.html', navIdx: null },
  // Classes and layouts indexed dynamically below (appended after CLASSES/XML_LAYOUTS defined)
];

// ----------------------------------------------------------------
// CLASSES — every Java class in the project
// ----------------------------------------------------------------
const CLASSES = [

  // ══════════════ DOMAIN LAYER ══════════════
  {
    name: 'GameEngine.java',
    package: 'domain/usecase',
    layer: 'domain',
    purpose: {
      he: 'לוגיקת משחק טהורה — Pure Java, ללא Android. אתחול לוח, מיקום מוקשים, חשיפת תאים, ניצחון/הפסד, חישוב ניקוד, סדרת board state.',
      en: 'Pure game logic — Pure Java, no Android. Board init, mine placement, cell revealing, win/loss, score calculation, board serialization.',
      mix: 'Pure Java game logic. Domain layer — zero Android imports. testable ב-JUnit ללא emulator.'
    },
    whyThisWay: {
      he: 'Clean Architecture: domain layer חייב להיות framework-free. GameEngine ניתן לבדיקה ב-JUnit ללא אמולטור. אם היה תלוי ב-Android SDK — בדיקות היו איטיות.',
      en: 'Clean Architecture: domain layer must be framework-free. GameEngine is testable in JUnit without emulator. Android SDK dependency would slow tests.',
      mix: 'Clean Architecture — Pure Java = fast JUnit tests, no emulator needed.'
    },
    alternatives: { rejected: 'Logic in GameActivity or GameViewModel', chosen: 'Separate Pure Java domain class', why: 'Separation of concerns — domain logic independent of Android lifecycle' },
    keyMethods: [
      { name: 'initializeBoard(w, h, mines, seed)', explanation: { he: 'מאתחל לוח. seed=-1 → random, אחרת → new Random(seed) לDailyChallenge.', en: 'Initializes board. seed=-1 → random, else → new Random(seed) for DailyChallenge.', mix: 'Init board. seed for Daily Challenge → same board for everyone.' }, code: 'if (seed != -1) { this.random = new Random(seed); }' },
      { name: 'floodReveal(x, y)', explanation: { he: 'DFS recursion. בודק 8 שכנים. Guard: isCovered(). אם adjacentMines==0 → קריאה רקורסיבית.', en: 'DFS recursion. Checks 8 neighbors. Guard: isCovered(). If adjacentMines==0 → recursive call.', mix: 'DFS recursion. isCovered() = visited guard. אם ריק → floodReveal(nx, ny).' }, code: 'if (c.isCovered() && !c.isMine()) { c.setState(REVEALED); if (c.getAdjacentMines() == 0) floodReveal(nx, ny); }' },
      { name: 'placeMines(excludeX, excludeY)', explanation: { he: 'Rejection sampling — מדלג על הקואורדינטה הנלחצת. מבטיח First Click Safe.', en: 'Rejection sampling — skips the clicked coordinate. Ensures First Click Safe.', mix: 'Rejection sampling. First click = always safe.' }, code: 'if ((x == excludeX && y == excludeY) || board[y][x].isMine()) continue;' },
      { name: 'calculateScore()', explanation: { he: 'timeBonus + moveBonus + difficultyBonus + flagAccuracyBonus.', en: 'timeBonus + moveBonus + difficultyBonus + flagAccuracyBonus.', mix: 'Score = 4 components. Perfect flags → 200 bonus.' }, code: 'int timeBonus = Math.max(1000 - seconds, 0);\nint moveBonus = Math.max(500 - moves, 0);\nint difficultyBonus = difficulty * 10;\nint flagAccuracyBonus = (flagsPlaced == totalMines) ? 200 : (int)(accuracy * 100);' },
      { name: 'serializeBoardState()', explanation: { he: 'Cell[][] → JSON string עם StringBuilder. ללא Gson — Pure Java.', en: 'Cell[][] → JSON string using StringBuilder. No Gson — Pure Java.', mix: 'Manual JSON build. No Gson. Pure Java domain constraint.' }, code: 'StringBuilder json = new StringBuilder();\njson.append("{\\\"cells\\\":[");\nfor each cell: json.append("{\\\"x\\\":").append(x)...' },
      { name: 'quickReveal(x, y)', explanation: { he: 'Chord reveal: אם flags==adjacentMines → מגלה כל שכנים ללא דגל.', en: 'Chord reveal: if flags==adjacentMines → reveals all unflagged neighbors.', mix: 'Chord reveal — flags match mines count → auto-reveal neighbors.' }, code: 'if (countAdjacentFlags(x,y) == cell.getAdjacentMines()) { reveal all unflagged neighbors }' }
    ],
    connectsTo: ['Cell', 'Game', 'GameStatus', 'CellState', 'GameViewModel'],
    examQuestions: [
      'למה GameEngine הוא Pure Java ללא Android imports?',
      'מה אלגוריתם floodReveal וכיצד isCovered() משמש כ-visited guard?',
      'מה הנוסחה לחישוב ניקוד ב-calculateScore()?',
      'למה serializeBoardState() משתמש ב-StringBuilder ולא ב-Gson?'
    ],
    deepExplanation: [
      "GameEngine פותר את בעיית עירוב לוגיקה עסקית עם קוד Android. לפני MVVM, לוגיקת המשחק הייתה מפוזרת ב-Activities, מה שגרם לקוד לא-ניתן-לבדיקה שנשבר בכל rotation של מסך.",
      "ב-Clean Architecture, GameEngine מהווה את ה-domain layer — השכבה הפנימית ביותר שלא יודעת כלום על Android, Firebase, או Room. היא מממשת אלגוריתמי משחק בלבד: אתחול לוח, מיקום מוקשים, DFS flood reveal, בדיקת ניצחון, וחישוב ניקוד.",
      "בלי GameEngine: לוגיקת floodReveal הייתה ב-GameViewModel או GameActivity. בדיקות JUnit היו בלתי אפשריות ללא אמולטור. כל bug בלוגיקה היה דורש debug על מכשיר. ה-Daily Challenge seed mechanism היה צמוד ל-Android Date API.",
      "הנקודה הכי מאתגרת: serializeBoardState() חייבת להמיר Cell[][] ל-JSON ללא Gson, כי Gson הוא library חיצוני שאסור ב-domain layer. הפתרון: StringBuilder ידנית — מורכבת יותר לכתוב אך שומרת על Pure Java ללא dependencies."
    ],
    codeWalkthrough: {
      methodName: "floodReveal(int x, int y)",
      code: `private void floodReveal(int x, int y) {
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                Cell c = board[ny][nx];
                if (c.isCovered() && !c.isMine()) {
                    c.setState(CellState.REVEALED);
                    game.incrementTilesRevealed();
                    if (c.getAdjacentMines() == 0) {
                        floodReveal(nx, ny);
                    }
                }
            }
        }
    }
}`,
      lineExplanations: [
        { line: 1, explanation: "dy ו-dx עוברים על 9 תאים שכנים (כולל אלכסונים) — ה-3×3 grid סביב (x,y)" },
        { line: 2, explanation: "dx=0,dy=0 = התא עצמו — מדלגים כי לא רוצים לבדוק את עצמנו" },
        { line: 3, explanation: "נחשב קואורדינטות של שכן: nx=x+dx, ny=y+dy" },
        { line: 4, explanation: "Boundary check — מוודאים שהשכן בתוך הלוח ולא מחוצה לו" },
        { line: 5, explanation: "שולפים את ה-Cell מהמטריצה — board[ny][nx] כי ny=שורה, nx=עמודה" },
        { line: 6, explanation: "isCovered() = ה-VISITED GUARD: תא שכבר REVEALED לא ייכנס לrecursion שוב" },
        { line: 7, explanation: "!isMine() — לא מגלים מוקש (אפילו אם covered), רק תאים בטוחים" },
        { line: 8, explanation: "מחליפים state מ-COVERED ל-REVEALED — עכשיו isCovered() יחזיר false" },
        { line: 9, explanation: "מעדכנים מונה tilesRevealed — נבדק נגד totalSafeCells לגילוי ניצחון" },
        { line: 10, explanation: "adjacentMines==0 = 'תא ריק' — אין מוקשים שכנים, מגלים גם את שכניו" },
        { line: 11, explanation: "הקריאה הרקורסיבית — DFS! מעמיק לתוך הלוח. isCovered() מבטיח אין loops" }
      ]
    },
    commonMistakes: [
      { wrong: "GameEngine משתמש ב-Context כדי לגשת ל-Room DB", correct: "GameEngine הוא Pure Java — אין לו גישה ל-Context, Room, SharedPreferences, או כל Android class. הוא מקבל רק primitive data ו-Cell[][]" },
      { wrong: "floodReveal משתמש ב-BFS עם Queue", correct: "floodReveal משתמש ב-DFS — הפונקציה קוראת לעצמה (recursion). BFS נדחה כי DFS קצרה ופשוטה יותר לממש" },
      { wrong: "serializeBoardState() משתמש ב-Gson לנוחות", correct: "GameEngine אסור לו להכיר Gson (library חיצוני). משתמש ב-StringBuilder ידנית — ה-domain layer חייב להיות zero-dependency" }
    ],
    examTips: {
      mention: ["'GameEngine הוא Pure Java — ניתן לבדיקה ב-JUnit ללא אמולטור'", "'isCovered() משמש כ-visited guard במניעת infinite recursion'", "'floodReveal היא DFS recursion — הפונקציה קוראת לעצמה'"],
      keywords: ["Pure Java", "domain layer", "DFS", "recursion", "isCovered()", "visited guard", "Clean Architecture", "framework-free"],
      avoid: ["אל תגיד ש-GameEngine uses Android SDK", "אל תבלבל DFS עם BFS", "אל תגיד שmines מונחים לפני הלחיצה הראשונה"]
    },
    connectionsMap: {
      from: ["מקבל פרמטרים מ-GameViewModel.revealCell(x,y)", "מקבל seed מ-DailyChallengeActivity", "מקבל boardSeed מ-MultiplayerRoom"],
      to: ["שולח Game object ל-GameViewModel דרך postValue()", "מחזיר JSON string ל-GameRepository.saveGameResult()"],
      createdBy: "נוצר ע\"י GameViewModel (new GameEngine()) בעת אתחול"
    }
  },

  {
    name: 'Cell.java',
    package: 'data/model',
    layer: 'domain',
    purpose: {
      he: 'מודל לתא בודד בלוח. מכיל: קואורדינטות (x,y), isMine, adjacentMines, CellState, timestamps.',
      en: 'Model for a single board cell. Contains: coordinates (x,y), isMine, adjacentMines, CellState, timestamps.',
      mix: 'Single cell model. State: COVERED/REVEALED/FLAGGED. isMine + adjacentMines.'
    },
    whyThisWay: { rejected: 'Primitive int[][] for board state', chosen: 'Cell objects with full state', why: 'Encapsulates state + behavior — isCovered(), isFlagged(), setState() with timestamp' },
    keyMethods: [
      { name: 'isCovered() / isRevealed() / isFlagged()', explanation: { he: 'State helpers. isCovered() = visited guard ב-floodReveal.', en: 'State helpers. isCovered() = visited guard in floodReveal.', mix: 'State checks. isCovered() critical for DFS guard.' }, code: 'public boolean isCovered() { return state == CellState.COVERED; }' },
      { name: 'setState(CellState state)', explanation: { he: 'מחליף state ורושם timestamp.', en: 'Sets state and records timestamp.', mix: 'Set state + record revealedAt/flaggedAt timestamps.' }, code: 'this.state = state;\nif (state == CellState.REVEALED) this.revealedAt = System.currentTimeMillis();' }
    ],
    connectsTo: ['CellState', 'GameEngine', 'GameBoardView'],
    examQuestions: ['מה תפקיד isCovered() ב-floodReveal?', 'אילו fields מכיל Cell?']
  },

  {
    name: 'CellState.java',
    package: 'data/model',
    layer: 'domain',
    purpose: {
      he: 'Enum למצבי תא: COVERED (מוסתר), REVEALED (גלוי), FLAGGED (מסומן).',
      en: 'Enum for cell states: COVERED (hidden), REVEALED (shown), FLAGGED (marked).',
      mix: 'Enum: COVERED / REVEALED / FLAGGED.'
    },
    whyThisWay: { rejected: 'int constants (0, 1, 2)', chosen: 'Enum', why: 'Type safety — compiler catches invalid state assignments' },
    keyMethods: [],
    connectsTo: ['Cell', 'GameEngine'],
    examQuestions: ['אילו ערכים יש ל-CellState?', 'למה Enum עדיף על int constants?']
  },

  {
    name: 'Game.java',
    package: 'data/model',
    layer: 'domain',
    purpose: {
      he: 'מודל session של משחק. מכיל: מימדי לוח, GameStatus, stats (moves, flags, tilesRevealed), seed, timestamps.',
      en: 'Game session model. Contains: board dimensions, GameStatus, stats (moves, flags, tilesRevealed), seed, timestamps.',
      mix: 'Game session model. Tracks all game stats + status. Passed between GameEngine ↔ ViewModel.'
    },
    whyThisWay: { rejected: 'Multiple separate LiveData for each stat', chosen: 'Single Game object', why: 'Atomic updates — all stats change together, ViewModel posts single Game object' },
    keyMethods: [
      { name: 'incrementMoves() / incrementFlags() / incrementTilesRevealed()', explanation: { he: 'עדכון stats — נקרא מ-GameEngine.', en: 'Stats update — called from GameEngine.', mix: 'Stats mutators. Called by GameEngine.' }, code: 'public void incrementMoves() { this.movesCount++; }' },
      { name: 'isActive() / isCompleted()', explanation: { he: 'status helpers.', en: 'Status helpers.', mix: 'Quick status checks.' }, code: 'public boolean isActive() { return status == GameStatus.ACTIVE; }' },
      { name: 'getDurationMs()', explanation: { he: 'endedAt - startedAt בms.', en: 'endedAt - startedAt in ms.', mix: 'Game duration in ms.' }, code: 'return endedAt - startedAt;' }
    ],
    connectsTo: ['GameStatus', 'GameEngine', 'GameViewModel', 'GameRepository'],
    examQuestions: ['מה מכיל Game.java?', 'למה Game הוא מודל אחד ולא LiveData נפרדים?']
  },

  {
    name: 'GameStatus.java',
    package: 'data/model',
    layer: 'domain',
    purpose: {
      he: 'Enum למצבי משחק: ACTIVE, WON, LOST, PAUSED.',
      en: 'Enum for game status: ACTIVE, WON, LOST, PAUSED.',
      mix: 'Enum: ACTIVE / WON / LOST / PAUSED.'
    },
    whyThisWay: { rejected: 'boolean isWon + boolean isLost', chosen: 'Enum GameStatus', why: 'Mutually exclusive states expressed cleanly; PAUSED state impossible with booleans' },
    keyMethods: [],
    connectsTo: ['Game', 'GameEngine', 'GameViewModel'],
    examQuestions: ['אילו ערכים יש ל-GameStatus?']
  },

  // ══════════════ APPLICATION ══════════════
  {
    name: 'App.java',
    package: 'root',
    layer: 'application',
    purpose: {
      he: 'Application Singleton. נוצר ראשון בהפעלת האפליקציה. מאתחל ומחזיק את כל ה-managers: FirebaseManager, DatabaseHelper, SyncManager, SettingsManager, ThemeManager, SoundManager, TutorialManager.',
      en: 'Application Singleton. Created first on app launch. Initializes and holds all managers: FirebaseManager, DatabaseHelper, SyncManager, SettingsManager, ThemeManager, SoundManager, TutorialManager.',
      mix: 'App Singleton. getInstance() מחזיר כל ה-managers. נוצר לפני כל Activity.'
    },
    whyThisWay: { rejected: 'Static globals or pass-by-constructor', chosen: 'Application subclass Singleton', why: 'Android-idiomatic way for app-scoped objects; survives Activity rotation' },
    keyMethods: [
      { name: 'getInstance()', explanation: { he: 'מחזיר את המופע היחיד. נקרא מכל מקום.', en: 'Returns the single instance. Called from anywhere.', mix: 'Global access to Singleton instance.' }, code: 'public static App getInstance() { return instance; }' },
      { name: 'onCreate()', explanation: { he: 'מאתחל כל ה-managers ומחיל theme.', en: 'Initializes all managers and applies saved theme.', mix: 'Init all managers + apply theme on startup.' }, code: 'instance = this;\nfirebaseManager = new FirebaseManager(this);\nthemeManager.applyTheme();' }
    ],
    connectsTo: ['FirebaseManager', 'DatabaseHelper', 'SyncManager', 'SettingsManager', 'ThemeManager', 'SoundManager', 'TutorialManager'],
    examQuestions: ['מה Singleton Pattern ב-App.java?', 'מה מאתחל onCreate() ב-App?']
  },

  // ══════════════ DATA REMOTE ══════════════
  {
    name: 'FirebaseManager.java',
    package: 'data/remote',
    layer: 'data',
    purpose: {
      he: 'מנהל את כל Firebase operations: Auth (Email/Google/Anonymous), Firestore (scores/, users/, daily_challenges/), RTDB (rooms/ multiplayer), Storage (profile photos). מממש INetworkService.',
      en: 'Manages all Firebase operations: Auth (Email/Google/Anonymous), Firestore (scores/, users/, daily_challenges/), RTDB (rooms/ multiplayer), Storage (profile photos). Implements INetworkService.',
      mix: 'Central Firebase hub. Auth + Firestore + RTDB + Storage. Implements INetworkService.'
    },
    whyThisWay: { rejected: 'Firebase calls scattered across Activities', chosen: 'Centralized FirebaseManager', why: 'Single place for Firebase logic — easy to swap implementation, unit testable via INetworkService' },
    keyMethods: [
      { name: 'signInWithEmail / signInWithGoogle / signInAnonymously', explanation: { he: '3 שיטות Auth. Anonymous = שחקן ללא הרשמה.', en: '3 Auth methods. Anonymous = play without registration.', mix: '3 auth methods. Anonymous for immediate play.' }, code: 'FirebaseAuth.getInstance().signInAnonymously()' },
      { name: 'uploadScore(entry, callback)', explanation: { he: 'כתיבה ל-scores/{scoreId} ב-Firestore. callback = INetworkService.NetworkCallback.', en: 'Writes to scores/{scoreId} in Firestore. callback = INetworkService.NetworkCallback.', mix: 'Firestore scores write. Async with NetworkCallback.' }, code: 'firestore.collection("scores").add(entry).addOnSuccessListener(...)' },
      { name: 'createRoom / joinRoom / listenToRoom', explanation: { he: 'RTDB rooms/ operations. ValueEventListener לעדכון real-time.', en: 'RTDB rooms/ operations. ValueEventListener for real-time updates.', mix: 'RTDB rooms/ CRUD + real-time listener.' }, code: 'rtdb.getReference("rooms").push().setValue(room)' }
    ],
    connectsTo: ['INetworkService', 'GameRepository', 'AuthActivity', 'LeaderboardActivity', 'App'],
    examQuestions: ['מה INetworkService ומי מממש אותו?', 'מה ההבדל בין Firestore ל-RTDB בשימוש בפרויקט?'],
    deepExplanation: [
      "FirebaseManager פותר את בעיית הפיזור של Firebase logic. בלי FirebaseManager, כל Activity הייתה מבצעת Firebase calls ישירות — שכפול קוד, auth state management מפוזר, ואי אפשר לבדוק Firebase logic בנפרד.",
      "FirebaseManager מממש את INetworkService interface, מה שיוצר abstraction חשובה: ViewModel תלוי ב-interface, לא בFirebase SDK. ניתן להחליף Firebase ב-REST API ללא שינוי ב-ViewModel. זהו Dependency Injection הפשוט ביותר.",
      "בלי FirebaseManager: auth logic, Firestore reads/writes, RTDB listeners, ו-Storage uploads היו מפוזרים ב-10 Activities. כל Activity הייתה צריכה לנהל auth state בנפרד. קשה מאוד לבצע logout גלובלי. INetworkService לא היה ניתן לrealization.",
      "הנקודה הכי מאתגרת: שניים שימושים שונים לFirebase. Firestore (scores/, users/, daily_challenges/) = NoSQL documents, מתאים לdata structured ועם offline cache. RTDB (rooms/) = JSON tree, מתאים ל-real-time multiplayer עם latency נמוך. שתי SDKs בApp אחד."
    ],
    codeWalkthrough: {
      methodName: "fetchLeaderboard(String difficulty, NetworkCallback<List<LeaderboardEntry>> callback)",
      code: `@Override
public void fetchLeaderboard(String difficulty,
        NetworkCallback<List<LeaderboardEntry>> callback) {
    firestore.collection("scores")
        .whereEqualTo("difficulty", difficulty)
        .orderBy("score", Query.Direction.DESCENDING)
        .limit(50)
        .get()
        .addOnSuccessListener(querySnapshot -> {
            List<LeaderboardEntry> entries = new ArrayList<>();
            for (DocumentSnapshot doc : querySnapshot) {
                LeaderboardEntry entry = doc.toObject(LeaderboardEntry.class);
                if (entry != null) entries.add(entry);
            }
            callback.onSuccess(entries);
        })
        .addOnFailureListener(e -> callback.onFailure(e));
}`,
      lineExplanations: [
        { line: 1, explanation: "@Override — מממש את INetworkService. ViewModel קורא לinterface, לא לFirebase ישירות" },
        { line: 2, explanation: "firestore.collection('scores') — Firestore collection path. scores/{documentId} = כל ציון" },
        { line: 3, explanation: ".whereEqualTo('difficulty', difficulty) — Query filter. Firestore SQL equivalent: WHERE difficulty=?" },
        { line: 4, explanation: ".orderBy('score', DESCENDING) — מיון יורד לפי ניקוד — top scores ראשונים" },
        { line: 5, explanation: ".limit(50) — מגביל 50 תוצאות — Performance + ממשק סביר" },
        { line: 6, explanation: ".get() — async query — לא חוסם. מחזיר Task<QuerySnapshot>" },
        { line: 7, explanation: "addOnSuccessListener — callback ב-main thread כשהQuery מוחזרת" },
        { line: 8, explanation: "doc.toObject(LeaderboardEntry.class) — Firestore auto-deserialization לJava object" },
        { line: 9, explanation: "callback.onSuccess(entries) — INetworkService callback pattern — ViewModel מקבל result" },
        { line: 10, explanation: "addOnFailureListener — error handling — callback.onFailure() מעביר exception ל-ViewModel" }
      ]
    },
    commonMistakes: [
      { wrong: "Multiplayer משתמש ב-Firestore", correct: "Multiplayer משתמש ב-Firebase Realtime Database (rooms/). Firestore = scores/users/daily_challenges. RTDB = rooms/ בלבד, כי latency נמוך יותר" },
      { wrong: "FirebaseManager.fetchLeaderboard() חוסם את ה-thread עד לתשובה", correct: "כל Firebase calls א-סינכרוניות. fetchLeaderboard() מחזיר מיד — NetworkCallback.onSuccess() נקרא מאוחר יותר ב-main thread" },
      { wrong: "כל Activity קוראת ל-Firebase SDK ישירות", correct: "FirebaseManager מרכז הכל. Activities קוראות ל-FirebaseManager דרך Repository — ViewModel לא מכיר Firebase ישירות" }
    ],
    examTips: {
      mention: ["'FirebaseManager מממש INetworkService — ניתן להחליף Firebase ב-REST ללא שינוי ViewModel'", "'Firestore לdata structured (scores/users), RTDB ל-real-time (rooms/)'", "'3 auth methods: Email, Google, Anonymous'"],
      keywords: ["INetworkService", "NetworkCallback", "Firestore", "RTDB", "Anonymous auth", "async callbacks"],
      avoid: ["אל תבלבל Firestore עם RTDB", "אל תגיד שFirebase calls synchronous", "אל תגיד שActivity קוראת ל-Firebase ישירות"]
    },
    connectionsMap: {
      from: ["מקבל upload requests מ-GameRepository.saveGameResult()", "מקבל fetch requests מ-LeaderboardActivity", "מקבל auth requests מ-AuthActivity"],
      to: ["שולח data ל-Firestore (scores/, users/, daily_challenges/)", "שולח data ל-Firebase RTDB (rooms/)", "שולח/מקבל files מ-Firebase Storage"],
      createdBy: "נוצר ע\"י App.onCreate() — מאותחל כ-singleton דרך App.getInstance().getFirebaseManager()"
    }
  },

  {
    name: 'SyncManager.java',
    package: 'data/remote',
    layer: 'data',
    purpose: {
      he: 'מתאם את הסנכרון בין Room DB ל-Firebase. עובד עם WorkManager לתזמון sync ב-background.',
      en: 'Coordinates sync between Room DB and Firebase. Works with WorkManager to schedule background sync.',
      mix: 'Sync coordinator. Room → Firebase via WorkManager.'
    },
    whyThisWay: { rejected: 'Sync directly from Repository', chosen: 'Dedicated SyncManager', why: 'Single responsibility — sync logic isolated, testable' },
    keyMethods: [
      { name: 'scheduleSync()', explanation: { he: 'מתזמן FirebaseSyncWorker ב-WorkManager.', en: 'Schedules FirebaseSyncWorker in WorkManager.', mix: 'Enqueues WorkManager periodic sync.' }, code: 'WorkManager.getInstance().enqueueUniquePeriodicWork("sync", KEEP, syncWork)' }
    ],
    connectsTo: ['FirebaseManager', 'GameRepository', 'App', 'FirebaseSyncWorker'],
    examQuestions: ['מה תפקיד SyncManager?']
  },

  {
    name: 'FirebaseSyncWorker.java',
    package: 'worker',
    layer: 'data',
    purpose: {
      he: 'WorkManager Worker שמסנכרן games לא-מסונכרנות ל-Firebase. PeriodicWorkRequest כל 15 דקות עם Constraint: NetworkType.CONNECTED. שולף getUnsynced() מ-GameDao, מעלה ל-Firebase, מסמן syncedToFirebase=1.',
      en: 'WorkManager Worker that syncs unsynced games to Firebase. PeriodicWorkRequest every 15 minutes with NetworkType.CONNECTED constraint.',
      mix: 'WorkManager Worker. 15-min periodic sync. NetworkType.CONNECTED. getUnsynced() → Firebase → markSynced().'
    },
    whyThisWay: { rejected: 'AsyncTask or Service for background sync', chosen: 'WorkManager PeriodicWorkRequest', why: 'WorkManager survives reboot, process death, app close — AsyncTask and Service do not' },
    keyMethods: [
      { name: 'doWork()', explanation: { he: 'Entry point של Worker. מחזיר Result.success() או Result.retry().', en: 'Worker entry point. Returns Result.success() or Result.retry().', mix: 'doWork(): fetch unsynced → upload → mark synced → Result.success().' }, code: '@Override\npublic Result doWork() {\n  List<GameEntity> unsynced = gameDao.getUnsynced();\n  for (GameEntity entity : unsynced) {\n    boolean success = firebaseManager.uploadGameSync(entity);\n    if (success) gameDao.markSynced(entity.getId());\n    else return Result.retry();\n  }\n  return Result.success();\n}' }
    ],
    connectsTo: ['GameDao', 'FirebaseManager', 'SyncManager', 'AppDatabase'],
    examQuestions: ['מה WorkManager Constraint של FirebaseSyncWorker?', 'מה קורה אם Firebase upload נכשל?', 'למה WorkManager ולא AsyncTask?'],
    deepExplanation: [
      "FirebaseSyncWorker פותר את בעיית הסנכרון הרקע. ללא WorkManager, אם המשחק הסתיים ב-offline, הנתונים לא היו מגיעים ל-Firebase. Service רגיל היה מת עם סגירת האפליקציה. AsyncTask (deprecated) לא שורד process death.",
      "WorkManager הוא ה-recommended API לbackground tasks ב-Android. PeriodicWorkRequest כל 15 דקות עם Constraint NetworkType.CONNECTED — Worker לא ירוץ אם אין רשת, חוסך סוללה ומונע failed attempts.",
      "בלי FirebaseSyncWorker: אם אפליקציה נסגרת בmiddle of upload, הdata נאבד ל-Firebase (אבל נשמר ב-Room). כשהuser פותח שוב, אין מנגנון לretry. syncedToFirebase=0 יישאר לנצח.",
      "הנקודה הכי מאתגרת: idempotency. Worker צריך להיות בטוח לrun כמה פעמים — אם upload הצליח אבל markSynced() נכשל, Worker יעלה שוב. Firestore handles duplicate documents gracefully."
    ],
    codeWalkthrough: {
      methodName: "doWork()",
      code: `@NonNull
@Override
public Result doWork() {
    List<GameEntity> unsynced = gameDao.getUnsynced();
    if (unsynced.isEmpty()) {
        return Result.success();
    }
    for (GameEntity entity : unsynced) {
        try {
            firebaseManager.uploadGameSync(entity);
            gameDao.markSynced(entity.getId());
        } catch (Exception e) {
            return Result.retry();
        }
    }
    return Result.success();
}`,
      lineExplanations: [
        { line: 1, explanation: "doWork() = entry point של Worker. נקרא ב-background thread (לא main thread)" },
        { line: 2, explanation: "getUnsynced() = @Query('SELECT * FROM games WHERE syncedToFirebase = 0')" },
        { line: 3, explanation: "isEmpty() early return — אם אין מה לסנכרן, Result.success() מיד" },
        { line: 4, explanation: "לולאה על כל game שממתין לסנכרון" },
        { line: 5, explanation: "uploadGameSync() = synchronous Firebase upload (Worker כבר ב-background thread)" },
        { line: 6, explanation: "markSynced() = UPDATE games SET syncedToFirebase=1 WHERE id=? — מסמן כסונכרן" },
        { line: 7, explanation: "catch Exception: אם upload נכשל → Result.retry() → WorkManager ינסה שוב" },
        { line: 8, explanation: "Result.success() = כל הgames סונכרנו. WorkManager יתזמן הריצה הבאה (15 דק')" }
      ]
    },
    commonMistakes: [
      { wrong: "FirebaseSyncWorker רץ כל שניה לreal-time sync", correct: "PeriodicWorkRequest כל 15 דקות — המינימום של WorkManager. Real-time sync = Firebase RTDB Listeners, לא Worker" },
      { wrong: "Worker רץ גם ללא אינטרנט", correct: "NetworkType.CONNECTED Constraint — Worker מחכה עד שיש רשת. WorkManager מנהל את ה-scheduling אוטומטית" },
      { wrong: "אם Worker נכשל, הdata אבד", correct: "Result.retry() → WorkManager ינסה שוב. syncedToFirebase=0 נשמר ב-Room עד שסנכרון מצליח" }
    ],
    examTips: {
      mention: ["'NetworkType.CONNECTED Constraint — Worker מחכה לרשת'", "'PeriodicWorkRequest 15 דקות'", "'WorkManager שורד reboot, process death, app close'"],
      keywords: ["PeriodicWorkRequest", "NetworkType.CONNECTED", "doWork()", "Result.success()", "Result.retry()", "getUnsynced()"],
      avoid: ["אל תגיד שWorker רץ כל שניה", "אל תגיד שWorker = real-time", "אל תגיד שdata אבד בנכשל"]
    },
    connectionsMap: {
      from: ["מקבל unsynced games מ-GameDao.getUnsynced()", "מקבל firebase reference מ-FirebaseManager"],
      to: ["שולח games ל-FirebaseManager.uploadGameSync()", "מסמן synced ב-GameDao.markSynced()"],
      createdBy: "נוצר ע\"י SyncManager.scheduleSync() דרך WorkManager.enqueueUniquePeriodicWork()"
    }
  },

  // ══════════════ REPOSITORY ══════════════
  {
    name: 'GameRepository.java',
    package: 'data/repository',
    layer: 'data',
    purpose: {
      he: 'שכבת תיווך בין ViewModel לבין Room DB ו-Firebase. ViewModel לא יודע אם מידע מקומי או מרוחק. Offline First: שמירה ל-Room תמיד, Firebase אם online.',
      en: 'Abstraction layer between ViewModel and Room DB / Firebase. ViewModel does not know if data is local or remote. Offline First: always save to Room, Firebase only if online.',
      mix: 'Repository Pattern. ViewModel → Repository → (Room + Firebase). Offline First built in.'
    },
    whyThisWay: { rejected: 'ViewModel accesses DB/Firebase directly', chosen: 'Repository Pattern', why: 'ViewModel independence — can swap data source without changing ViewModel' },
    keyMethods: [
      { name: 'saveGameResult(result)', explanation: { he: 'שמירה מיידית ל-Room (Executor), upload ל-Firebase אם online.', en: 'Immediate save to Room (Executor), upload to Firebase if online.', mix: 'Room תחילה (immediate), Firebase אחר-כך (async).' }, code: 'executor.execute(() -> gameDao.insert(result.toEntity()));\nif (firebase.isOnline()) firebase.uploadGame(result);' },
      { name: 'getAllGames()', explanation: { he: 'מחזיר כל המשחקים מ-Room. נקרא מ-StatisticsActivity.', en: 'Returns all games from Room. Called from StatisticsActivity.', mix: 'Room query. Used by Statistics + Achievements.' }, code: 'return databaseHelper.getAllGames();' }
    ],
    connectsTo: ['GameViewModel', 'StatisticsActivity', 'AchievementManager', 'DatabaseHelper', 'FirebaseManager'],
    examQuestions: ['מה Repository Pattern ומדוע הוא חשוב ב-MVVM?', 'מה Offline First strategy ב-Repository?'],
    deepExplanation: [
      "GameRepository פותר את בעיית ה-coupling בין logic לdata sources. בלי Repository, GameViewModel היה קורא ישירות ל-GameDao ול-FirebaseManager — coupling צמוד שמקשה על החלפת מקור נתונים ועל בדיקות.",
      "Repository Pattern מהווה Single Source of Truth: ViewModel מבקש data מRepository, ו-Repository מחליט מאיפה לשלוף — Room (תמיד זמין, offline) או Firebase (כשיש רשת). ViewModel לא מכיר ולא אכפת לו מהחלטה זו.",
      "בלי Repository: ViewModel היה צריך לדעת על Room ועל Firebase ישירות. החלפת Firebase ב-REST API הייתה דורשת שינוי ב-ViewModel. בדיקות ViewModel היו דורשות mock של Firebase. לוגיקת Offline First הייתה מפוזרת.",
      "הנקודה הכי מאתגרת: Offline First. saveGameResult() חייב לשמור ב-Room מיידית (executor thread) ולנסות Firebase רק אם יש רשת. אם אין רשת, syncedToFirebase=0 נשאר, ו-WorkManager יסנכרן מאוחר יותר. זה דורש תיאום בין executor, FirebaseManager, ו-GameDao."
    ],
    codeWalkthrough: {
      methodName: "saveGameResult(GameResult result)",
      code: `public void saveGameResult(GameResult result) {
    AppDatabase.databaseWriteExecutor.execute(() -> {
        GameEntity entity = GameMapper.toEntity(result);
        entity.setSyncedToFirebase(0);
        gameDao.insertGame(entity);
    });
    if (firebaseManager.isOnline()) {
        firebaseManager.uploadScore(
            result.toLeaderboardEntry(),
            new NetworkCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean success) {
                    AppDatabase.databaseWriteExecutor.execute(() ->
                        gameDao.markSynced(result.getId()));
                }
                @Override
                public void onFailure(Exception e) {
                    // syncedToFirebase=0 stays, WorkManager will retry
                }
            }
        );
    }
}`,
      lineExplanations: [
        { line: 1, explanation: "שמירה ב-background thread (ExecutorService) — לעולם לא כותבים ל-Room מה-main thread" },
        { line: 2, explanation: "GameMapper.toEntity() ממיר domain GameResult ל-Room GameEntity — Mapper Pattern" },
        { line: 3, explanation: "syncedToFirebase=0 מסמן pending sync — זהו הלב של Offline First strategy" },
        { line: 4, explanation: "gameDao.insertGame() — Room CRUD. ExecutorService מבטיח background thread" },
        { line: 5, explanation: "isOnline() בודק קישוריות לפני ניסיון upload — לא מנסים Firebase ללא רשת" },
        { line: 6, explanation: "uploadScore() א-סינכרוני עם NetworkCallback — לא חוסם את ה-thread" },
        { line: 7, explanation: "onSuccess: markSynced() מעדכן syncedToFirebase=1 ב-Room — הועלה בהצלחה" },
        { line: 8, explanation: "onFailure: לא עושים כלום — syncedToFirebase=0 נשאר, WorkManager יסנכרן כשיש רשת" }
      ]
    },
    commonMistakes: [
      { wrong: "GameViewModel מתקשר ישירות ל-GameDao ול-Firebase", correct: "GameViewModel מכיר רק את GameRepository. Repository הוא האבסטרקציה — ViewModel לא יודע אם data מגיע מRoom או Firebase" },
      { wrong: "אם אין רשת, הנתונים לא נשמרים", correct: "Room נשמר תמיד (offline-capable). Firebase הוא secondary — syncedToFirebase=0 מסמן pending. WorkManager יעלה כשיחזור חיבור" },
      { wrong: "saveGameResult() כותב ל-Room ב-main thread", correct: "כתיבה ל-Room חייבת ב-background thread. Repository משתמש ב-AppDatabase.databaseWriteExecutor (ExecutorService) לכל DB writes" }
    ],
    examTips: {
      mention: ["'Repository Pattern — ViewModel לא יודע אם data מ-Room או Firebase'", "'Offline First: Room תחילה (syncedToFirebase=0), Firebase כשיש רשת'", "'Single Source of Truth — Repository מחליט מאיפה data'"],
      keywords: ["Repository Pattern", "Single Source of Truth", "Offline First", "syncedToFirebase", "ExecutorService", "NetworkCallback"],
      avoid: ["אל תגיד ש-ViewModel גישה ישירה ל-DB", "אל תגיד ש-data אבד ללא רשת", "אל תגיד שכתיבה ל-Room ב-main thread"]
    },
    connectionsMap: {
      from: ["מקבל save requests מ-GameViewModel.saveGameResult()", "מקבל queries מ-StatisticsActivity, AchievementManager"],
      to: ["שולח entities ל-GameDao (Room) ב-ExecutorService", "שולח scores ל-FirebaseManager.uploadScore()"],
      createdBy: "נוצר ע\"י GameViewModel (new GameRepository(context)) — מוזרק דרך constructor"
    }
  },

  // ══════════════ LOCAL DATA ══════════════
  {
    name: 'DatabaseHelper.java',
    package: 'data/local',
    layer: 'data',
    purpose: {
      he: 'SQLite helper. 9 טבלאות: users, difficulties, games, cells, moves, best_scores, settings, custom_presets, achievements. CRUD operations. Foreign keys.',
      en: 'SQLite helper. 9 tables: users, difficulties, games, cells, moves, best_scores, settings, custom_presets, achievements. CRUD operations. Foreign keys.',
      mix: 'SQLite database. 9 tables. PRAGMA foreign_keys=ON. Version 1.'
    },
    whyThisWay: { rejected: 'Room DB (newer version uses Room)', chosen: 'Raw SQLite (older version of project)', why: 'This is the legacy version; newer minesweeper-master uses Room DB v6' },
    keyMethods: [
      { name: 'insertGame / updateGame / getAllGames', explanation: { he: 'CRUD על טבלת games. מחזיר List<Game>.', en: 'CRUD on games table. Returns List<Game>.', mix: 'Game CRUD. ContentValues → db.insert().' }, code: 'ContentValues cv = new ContentValues();\ncv.put("status", game.getStatus());\ndb.insert("games", null, cv);' }
    ],
    connectsTo: ['GameRepository', 'AchievementManager', 'App'],
    examQuestions: ['כמה טבלאות ב-DatabaseHelper ומה הן?']
  },

  // ══════════════ DATA MODELS ══════════════
  {
    name: 'Achievement.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל הישג. שדות: name, category, requirement, progress, unlocked, unlockedAt.',
      en: 'Achievement model. Fields: name, category, requirement, progress, unlocked, unlockedAt.',
      mix: 'Achievement data model. progress counter + unlocked flag.'
    },
    whyThisWay: { rejected: 'Hardcoded achievement list', chosen: 'DB-backed Achievement model', why: 'Progress persisted across sessions; unlocked state stored in Room' },
    keyMethods: [],
    connectsTo: ['AchievementManager', 'AchievementsActivity', 'AchievementAdapter'],
    examQuestions: ['מה שדות Achievement?']
  },

  {
    name: 'CustomPreset.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל preset מותאם אישית: name, width, height, mines, createdAt.',
      en: 'Custom difficulty preset model: name, width, height, mines, createdAt.',
      mix: 'Custom preset — user-defined difficulty settings.'
    },
    whyThisWay: { rejected: 'Hardcode Easy/Medium/Hard only', chosen: 'User-created presets stored in DB', why: 'Flexibility — users create/save their own difficulty settings' },
    keyMethods: [],
    connectsTo: ['CustomPresetsAdapter', 'GameActivity', 'DatabaseHelper'],
    examQuestions: []
  },

  {
    name: 'DailyChallenge.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל Daily Challenge: date, seed, width, height, minesCount, targetTime, creatorId.',
      en: 'Daily Challenge model: date, seed, width, height, minesCount, targetTime, creatorId.',
      mix: 'Daily Challenge model. seed = date-derived. Firestore: daily_challenges/{date}.'
    },
    whyThisWay: { rejected: 'Fetch board from server', chosen: 'Seed-based deterministic board', why: 'No server needed to generate board — same seed = same Random = same board globally' },
    keyMethods: [],
    connectsTo: ['DailyChallengeActivity', 'GameEngine', 'FirebaseManager'],
    examQuestions: ['מה Daily Challenge seed ואיך עובד?']
  },

  {
    name: 'MultiplayerRoom.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל חדר Multiplayer: roomId, hostId, guestId, status, boardSeed, createdAt.',
      en: 'Multiplayer room model: roomId, hostId, guestId, status, boardSeed, createdAt.',
      mix: 'RTDB room model. rooms/{roomId} in Firebase RTDB.'
    },
    whyThisWay: { rejected: 'Custom server/WebSocket', chosen: 'Firebase RTDB', why: 'Real-time sync without managing server infrastructure; onDisconnect() auto-cleanup' },
    keyMethods: [],
    connectsTo: ['MultiplayerLobbyActivity', 'FirebaseManager'],
    examQuestions: ['מה RTDB path לחדר Multiplayer?']
  },

  {
    name: 'PlayerProgress.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל התקדמות שחקן: userId, gamesWon, gamesLost, totalScore, bestTimes, achievementCount.',
      en: 'Player progress model: userId, gamesWon, gamesLost, totalScore, bestTimes, achievementCount.',
      mix: 'Player progress snapshot. Uploaded to Firestore users/{uid}.'
    },
    whyThisWay: { rejected: 'Recalculate from game history each time', chosen: 'Cached progress model', why: 'Performance — progress already aggregated, no need to scan all games on leaderboard load' },
    keyMethods: [],
    connectsTo: ['INetworkService', 'FirebaseManager', 'StatisticsActivity'],
    examQuestions: []
  },

  {
    name: 'Statistics.java',
    package: 'data/model',
    layer: 'data',
    purpose: {
      he: 'מודל סטטיסטיקות: totalGames, wins, losses, winRate, currentStreak, bestStreak, totalPlayTime, perDifficultyStats.',
      en: 'Statistics model: totalGames, wins, losses, winRate, currentStreak, bestStreak, totalPlayTime, perDifficultyStats.',
      mix: 'Aggregated stats model. Calculated from game history in StatisticsActivity.'
    },
    whyThisWay: { rejected: 'Raw queries per stat', chosen: 'Aggregate model', why: 'StatisticsActivity calculates once, passes single object to display methods' },
    keyMethods: [],
    connectsTo: ['StatisticsActivity', 'GameRepository'],
    examQuestions: []
  },

  // ══════════════ ROOM ENTITIES / DAOs ══════════════
  {
    name: 'AchievementEntity.java',
    package: 'data/db/entity',
    layer: 'data',
    purpose: {
      he: '@Entity Room — מיפוי מחלקת Achievement לטבלת achievements ב-Room DB.',
      en: '@Entity Room — maps Achievement class to achievements table in Room DB.',
      mix: '@Entity Room. achievements table. Room v6.'
    },
    whyThisWay: { rejected: 'Manual Cursor mapping', chosen: 'Room @Entity + @Dao', why: 'Room generates SQL at compile time; type-safe; LiveData integration' },
    keyMethods: [],
    connectsTo: ['AchievementDao', 'AchievementMapper', 'AppDatabase'],
    examQuestions: ['מה @Entity ב-Room?']
  },

  {
    name: 'GameDao.java (Room)',
    package: 'data/db/dao',
    layer: 'data',
    purpose: {
      he: '@Dao Room — CRUD על טבלת games. @Query, @Insert, @Update. getUnsynced() מחזיר rows עם syncedToFirebase=0.',
      en: '@Dao Room — CRUD on games table. @Query, @Insert, @Update. getUnsynced() returns rows where syncedToFirebase=0.',
      mix: '@Dao. getUnsynced() = core Offline First query. Returns games pending Firebase upload.'
    },
    whyThisWay: { rejected: 'Manual SQL strings everywhere', chosen: 'Room @Dao with @Query', why: 'Compile-time SQL validation — typos caught at build, not at runtime' },
    keyMethods: [
      { name: 'getUnsynced()', explanation: { he: 'מחזיר כל games עם syncedToFirebase=0 ל-WorkManager.', en: 'Returns all games with syncedToFirebase=0 for WorkManager.', mix: 'Offline First query. WorkManager uses this to find pending uploads.' }, code: '@Query("SELECT * FROM games WHERE syncedToFirebase = 0")\nList<GameEntity> getUnsynced();' }
    ],
    connectsTo: ['GameEntity', 'AppDatabase', 'FirebaseSyncWorker', 'GameRepository'],
    examQuestions: ['מה @Dao ו-@Query ב-Room?', 'מה getUnsynced() עושה?']
  },

  {
    name: 'AchievementMapper.java',
    package: 'data/db/mapper',
    layer: 'data',
    purpose: {
      he: 'ממיר בין AchievementEntity (Room) ל-Achievement (domain model). מבודד domain מ-Room annotations.',
      en: 'Converts between AchievementEntity (Room) and Achievement (domain model). Isolates domain from Room annotations.',
      mix: 'Mapper pattern. AchievementEntity ↔ Achievement domain model.'
    },
    whyThisWay: { rejected: 'Use Room entity directly in domain', chosen: 'Separate mapper', why: 'Domain model stays framework-free; Room entity contains Android annotations' },
    keyMethods: [],
    connectsTo: ['AchievementEntity', 'Achievement', 'AchievementDao'],
    examQuestions: []
  },

  {
    name: 'AppDatabase.java',
    package: 'data/db',
    layer: 'data',
    purpose: {
      he: 'Room @Database — נקודת גישה יחידה ל-SQLite. version=6, 5 entities: GameEntity, BestScoreEntity, AchievementEntity, CustomMapEntity, CustomPresetEntity. Migrations 1→6.',
      en: 'Room @Database — single access point to SQLite. version=6, 5 entities. Migrations 1 through 6.',
      mix: 'Room @Database singleton. version=6, 5 entities. databaseWriteExecutor = ExecutorService for background writes.'
    },
    whyThisWay: { rejected: 'Multiple database helper classes', chosen: 'Single @Database with all entities', why: 'Room requires single @Database class per SQLite file; DAOs accessed from one place' },
    keyMethods: [
      { name: 'getInstance(Context)', explanation: { he: 'Double-check singleton. Thread-safe instantiation.', en: 'Double-check singleton. Thread-safe instantiation.', mix: 'Singleton pattern with synchronized block.' }, code: 'if (instance == null) {\n  synchronized (AppDatabase.class) {\n    if (instance == null)\n      instance = Room.databaseBuilder(context, AppDatabase.class, "minesweeper.db")\n        .addMigrations(MIGRATION_1_2, MIGRATION_2_3, MIGRATION_3_4, MIGRATION_4_5, MIGRATION_5_6)\n        .build();\n  }\n}\nreturn instance;' },
      { name: 'MIGRATION_5_6', explanation: { he: 'הוסיף syncedToFirebase ל-games. ללא זה — crash עם DestructiveMigration.', en: 'Added syncedToFirebase to games table.', mix: 'ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0' }, code: 'static final Migration MIGRATION_5_6 = new Migration(5, 6) {\n  @Override\n  public void migrate(SupportSQLiteDatabase db) {\n    db.execSQL("ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0 NOT NULL");\n  }\n};' }
    ],
    connectsTo: ['GameDao', 'BestScoreDao', 'AchievementDao', 'CustomMapDao', 'CustomPresetDao', 'GameRepository', 'App'],
    examQuestions: ['מה גרסת Room DB ומה ה-5 entities?', 'מה Migration 5→6 עשה?', 'למה migration ולא destructiveMigration?'],
    deepExplanation: [
      "AppDatabase פותר את בעיית הגישה ל-SQLite database. Room ORM מחייב class אחד עם @Database annotation שמכיל את כל ה-entities וה-DAOs. כל גישה לDB עוברת דרך AppDatabase.getInstance().",
      "AppDatabase מכיל גם את databaseWriteExecutor — ExecutorService עם 4 threads לכתיבות background. כל Repository משתמש ב-executor זה לwrite operations. קריאות (queries עם LiveData) Room מטפל בהן אוטומטית ב-background.",
      "בלי AppDatabase ו-Migrations: כל שדרוג גרסה היה קורס את האפליקציה למשתמשים קיימים. Migration 5→6 הוסיף syncedToFirebase לטבלת games — ללא זה, Offline First לא אפשרי. destructiveMigration מוחק data — בלתי קביל.",
      "הנקודה הכי מאתגרת: thread-safety של Singleton. getInstance() משתמש ב-double-check locking (synchronized block עם בדיקה כפולה) כדי למנוע יצירת שתי instances בmultithreaded environment."
    ],
    codeWalkthrough: {
      methodName: "MIGRATION_5_6",
      code: `static final Migration MIGRATION_5_6 = new Migration(5, 6) {
    @Override
    public void migrate(SupportSQLiteDatabase db) {
        db.execSQL(
            "ALTER TABLE games " +
            "ADD COLUMN syncedToFirebase INTEGER DEFAULT 0 NOT NULL"
        );
    }
};`,
      lineExplanations: [
        { line: 1, explanation: "new Migration(5, 6) — מגדיר שה-migration עובר מversion 5 לversion 6" },
        { line: 2, explanation: "migrate() נקרא אוטומטית ע\"י Room כשה-DB version ישן מ-6" },
        { line: 3, explanation: "ALTER TABLE games — SQL command להוספת עמודה לטבלה קיימת" },
        { line: 4, explanation: "ADD COLUMN syncedToFirebase INTEGER — Room stores boolean as INTEGER (0=false, 1=true)" },
        { line: 5, explanation: "DEFAULT 0 NOT NULL — כל rows קיימים יקבלו 0 (לא סונכרן). NOT NULL = data integrity" }
      ]
    },
    commonMistakes: [
      { wrong: "Room DB גרסה 5 עם 4 entities", correct: "Room DB גרסה 6 עם 5 entities: GameEntity, BestScoreEntity, AchievementEntity, CustomMapEntity, CustomPresetEntity. Migration 5→6 הוסיף syncedToFirebase" },
      { wrong: "fallbackToDestructiveMigration() פשוט ומקובל", correct: "fallbackToDestructiveMigration() מוחק את כל הdata של המשתמש. Migration 5→6 = ALTER TABLE בלבד — שומר על data קיים" },
      { wrong: "AppDatabase נוצר כל פעם ב-new AppDatabase()", correct: "AppDatabase הוא Singleton — getInstance() מחזיר תמיד את אותו instance. Room.databaseBuilder() נקרא רק פעם אחת" }
    ],
    examTips: {
      mention: ["'version=6, 5 entities'", "'Migration 5→6: ALTER TABLE games ADD COLUMN syncedToFirebase INTEGER DEFAULT 0'", "'databaseWriteExecutor = ExecutorService לכתיבות background'"],
      keywords: ["@Database", "Migration", "ALTER TABLE", "Singleton", "ExecutorService", "entities"],
      avoid: ["אל תגיד version=5 או 4 entities", "אל תגיד fallbackToDestructiveMigration בסדר", "אל תגיד שRoom מאפשר main thread writes"]
    },
    connectionsMap: {
      from: ["מקבל Context מ-GameRepository ו-App.onCreate()"],
      to: ["מחזיר GameDao, BestScoreDao, AchievementDao וכו' לRepositories"],
      createdBy: "נוצר ע\"י App.onCreate() — Singleton"
    }
  },

  // ══════════════ UI — ACTIVITIES ══════════════
  {
    name: 'GameActivity.java',
    package: 'ui/game',
    layer: 'ui',
    purpose: {
      he: 'מסך המשחק הראשי. מאזין ל-LiveData מ-GameViewModel. מפעיל GameBoardView. מטפל ב-pause/restart/game-over dialogs. מפעיל HapticsManager.',
      en: 'Main game screen. Observes LiveData from GameViewModel. Drives GameBoardView. Handles pause/restart/game-over dialogs. Triggers HapticsManager.',
      mix: 'Main game UI. ViewModel observer. GameBoardView controller. Haptics + dialogs.'
    },
    whyThisWay: { rejected: 'Logic in Activity', chosen: 'Activity = thin UI layer, logic in ViewModel/Engine', why: 'MVVM — Activity observes, never calculates; survives rotation via ViewModel' },
    keyMethods: [
      { name: 'onCreate()', explanation: { he: 'מאתחל ViewBinding, VMFactory, GameViewModel observers, GameBoardView listener.', en: 'Initializes ViewBinding, VMFactory, GameViewModel observers, GameBoardView listener.', mix: 'Setup: binding, factory, observers, board listener.' }, code: 'VMFactory factory = new VMFactory(this);\ngameViewModel = new ViewModelProvider(this, factory).get(GameViewModel.class);\ngameViewModel.currentGame.observe(this, game -> boardView.setGame(game));' },
      { name: 'onCellClick(row, col)', explanation: { he: 'מפעיל gameViewModel.revealCell(). GameEngine עושה הלוגיקה.', en: 'Calls gameViewModel.revealCell(). GameEngine handles logic.', mix: 'Touch event → ViewModel → Engine. Activity just passes coords.' }, code: 'gameViewModel.revealCell(col, row);' }
    ],
    connectsTo: ['GameViewModel', 'GameBoardView', 'VMFactory', 'HapticsManager', 'SettingsManager'],
    examQuestions: ['Trace מלא: מה קורה כשלוחצים על תא?', 'מה תפקיד GameActivity ב-MVVM?']
  },

  {
    name: 'BaseNavigationActivity.java',
    package: 'ui',
    layer: 'ui',
    purpose: {
      he: 'Abstract AppCompatActivity שמספק: Bottom Navigation Bar, Toolbar, Window Insets, Theme application. 5 Activities יורשות: GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity.',
      en: 'Abstract AppCompatActivity providing: Bottom Navigation Bar, Toolbar, Window Insets, Theme application. 5 Activities extend it.',
      mix: 'Abstract base for 5 Activities. DRY: Bottom Nav + Toolbar + WindowInsets written once. Subclasses implement getLayoutResourceId() and initializeContent().'
    },
    whyThisWay: { rejected: 'Duplicate nav code in each Activity', chosen: 'Abstract base Activity', why: 'DRY principle — shared navigation code written once, 5 Activities get it for free via inheritance' },
    keyMethods: [
      { name: 'onCreate() [BaseNavigationActivity]', explanation: { he: 'מאתחל BottomNav, Toolbar, WindowInsets, ומפעיל initializeContent(savedInstanceState).', en: 'Initializes BottomNav, Toolbar, WindowInsets, then calls initializeContent().', mix: 'Setup shared UI. Calls abstract initializeContent() for subclass-specific setup.' }, code: '@Override\nprotected void onCreate(Bundle savedInstanceState) {\n  super.onCreate(savedInstanceState);\n  setContentView(getLayoutResourceId());\n  setupToolbar();\n  setupBottomNavigation();\n  applyWindowInsets();\n  initializeContent(savedInstanceState);\n}' },
      { name: 'getLayoutResourceId() [abstract]', explanation: { he: 'Abstract — כל subclass מספקת את layout XML שלה.', en: 'Abstract — each subclass provides its own layout XML.', mix: 'Abstract method. GameActivity returns R.layout.activity_game.' }, code: 'protected abstract int getLayoutResourceId();' },
      { name: 'initializeContent(Bundle) [abstract]', explanation: { he: 'Abstract — כל subclass מאתחלת ViewModels וviews.', en: 'Abstract — each subclass initializes its own ViewModels and views.', mix: 'Abstract. GameActivity sets up GameViewModel here.' }, code: 'protected abstract void initializeContent(Bundle savedInstanceState);' }
    ],
    connectsTo: ['GameActivity', 'StatisticsActivity', 'LeaderboardActivity', 'ProfileActivity', 'AchievementsActivity', 'VMFactory', 'ThemeManager'],
    examQuestions: ['מה BaseNavigationActivity ואיזה Activities יורשים ממנו?', 'מה abstract methods הן מחייבות לממש?', 'מה Template Method Pattern?'],
    deepExplanation: [
      "BaseNavigationActivity פותרת את בעיית הכפילות בקוד. ב-5 Activities שונות, Bottom Navigation Bar, Toolbar, ו-Window Insets היו כתובים 5 פעמים — כל change היה דורש update ב-5 מקומות. Abstract base class מרכז קוד משותף.",
      "Template Method Pattern: onCreate() ב-BaseNavigationActivity מגדיר את ה-skeleton — setupToolbar(), setupBottomNavigation(), applyWindowInsets(), ואז קורא ל-initializeContent() שכל subclass מממשת. הbase מחליט את הסדר, הsubclass ממלאת תוכן.",
      "בלי BaseNavigationActivity: כל שינוי בBottomNav (הוספת tab, change color) היה דורש update ב-5 Activities. Bug ב-WindowInsets היה קשה לאתר. Inconsistent behavior בין Activities שונות. DRY principle מתבקש.",
      "הנקודה הכי מאתגרת: Window Insets. Android 10+ הגדיר edge-to-edge display — תוכן מאחורי status bar. applyWindowInsets() מוסיף padding לbase layout כדי שהtoolbar לא יחפוף עם status bar. כל Activity מקבלת זאת חינם."
    ],
    codeWalkthrough: {
      methodName: "onCreate(Bundle savedInstanceState)",
      code: `@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(getLayoutResourceId());
    setupToolbar();
    setupBottomNavigation();
    applyWindowInsets();
    initializeContent(savedInstanceState);
}`,
      lineExplanations: [
        { line: 1, explanation: "super.onCreate() — חובה. Android מאתחל Activity internals (window, state restore)" },
        { line: 2, explanation: "getLayoutResourceId() — קורא לabstract method. GameActivity מחזירה R.layout.activity_game" },
        { line: 3, explanation: "setupToolbar() — מוצא toolbar ב-layout, מגדיר כ-ActionBar" },
        { line: 4, explanation: "setupBottomNavigation() — מוצא BottomNavigationView, מגדיר listeners לניווט" },
        { line: 5, explanation: "applyWindowInsets() — Edge-to-edge: מוסיף padding לstatus bar height" },
        { line: 6, explanation: "initializeContent() — קורא לabstract method. GameActivity מאתחלת GameViewModel כאן" }
      ]
    },
    commonMistakes: [
      { wrong: "BaseNavigationActivity היא interface", correct: "BaseNavigationActivity היא abstract class — יש לה implementation חלקית (setupBottomNavigation, setupToolbar) ו-abstract methods. Interface לא יכול להכיל implementation" },
      { wrong: "כל 7 Activities יורשות מBaseNavigationActivity", correct: "רק 5 Activities יורשות: GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity. NfcActivity, DailyChallengeActivity, MultiplayerLobbyActivity יורשות ישירות מAppCompatActivity" },
      { wrong: "BaseNavigationActivity מנהלת את הVMFactory", correct: "BaseNavigationActivity מנהלת רק navigation UI (BottomNav, Toolbar, Insets). VMFactory נוצר ב-initializeContent() של כל Activity בנפרד" }
    ],
    examTips: {
      mention: ["'5 Activities יורשות: GameActivity, StatisticsActivity, LeaderboardActivity, ProfileActivity, AchievementsActivity'", "'Template Method Pattern: base defines skeleton, subclass fills content'", "'DRY: Bottom Nav + Toolbar כתובים פעם אחת'"],
      keywords: ["abstract class", "Template Method Pattern", "DRY", "BottomNavigationView", "WindowInsets", "getLayoutResourceId", "initializeContent"],
      avoid: ["אל תגיד שBaseNavigationActivity = interface", "אל תגיד שכל Activities יורשות ממנה", "אל תגיד שמנהלת VMFactory"]
    },
    connectionsMap: {
      from: ["מקבל theme settings מ-ThemeManager", "מקבל navigation events מ-BottomNavigationView"],
      to: ["מגדירה navigation ל-GameActivity, StatisticsActivity, etc.", "קוראת ל-initializeContent() ב-subclass"],
      createdBy: "Abstract — לא נוצרת ישירות. Subclasses: GameActivity, StatisticsActivity, etc."
    }
  },

  {
    name: 'GameViewModel.java',
    package: 'ui/game',
    layer: 'ui',
    purpose: {
      he: 'מנהל state של המשחק. LiveData: currentGame, board, timer, gameStatus, remainingMines, message. Timer עם java.util.Timer. שורד rotation. onCleared() מנקה timer.',
      en: 'Manages game state. LiveData: currentGame, board, timer, gameStatus, remainingMines, message. Timer with java.util.Timer. Survives rotation. onCleared() cancels timer.',
      mix: 'Game state manager. LiveData observables. Timer. Rotation survivor.'
    },
    whyThisWay: { rejected: 'State in Activity fields', chosen: 'ViewModel LiveData', why: 'Survives rotation — Activity recreated but ViewModel persists with all game state intact' },
    keyMethods: [
      { name: 'revealCell(x, y)', explanation: { he: 'מעביר ל-GameEngine. מעדכן LiveData.', en: 'Delegates to GameEngine. Updates LiveData.', mix: 'Delegate to GameEngine → postValue() LiveData.' }, code: 'engine.revealCell(x, y);\ncurrentGame.postValue(engine.getGame());\ngameStatus.postValue(engine.getGame().getStatus());' },
      { name: 'startNewGameWithSeed(seed)', explanation: { he: 'Daily Challenge — מאתחל GameEngine עם seed ספציפי.', en: 'Daily Challenge — initializes GameEngine with specific seed.', mix: 'Daily Challenge entry point. seed → deterministic board.' }, code: 'engine.initializeBoard(width, height, mines, seed);\ncurrentGame.postValue(engine.getGame());' },
      { name: 'onCleared()', explanation: { he: 'מנקה timer כדי למנוע memory leak.', en: 'Cancels timer to prevent memory leak.', mix: 'Cleanup on destroy. timer.cancel() prevents memory leak.' }, code: '@Override protected void onCleared() { if (timer != null) timer.cancel(); }' }
    ],
    connectsTo: ['GameEngine', 'GameActivity', 'VMFactory', 'GameRepository'],
    examQuestions: ['מה ViewModel.onCleared() ולמה חשוב?', 'למה ViewModel שורד rotation אבל Activity לא?'],
    deepExplanation: [
      "GameViewModel פותר את בעיית אובדן state בסיבוב מסך. לפני ViewModel, כל rotation גרם ל-Activity להיהרס ולהיווצר מחדש — לוח המשחק, הטיימר, הניקוד — הכל אפס. ViewModel שורד את ה-rotation כי Android מנהל את lifecycle שלו בנפרד מ-Activity.",
      "ב-MVVM, GameViewModel הוא השכבה האמצעית. הוא מחזיק LiveData observables (currentGame, timer, gameStatus, remainingMines) שהActivity מאזינה להם. כשstate משתנה, UI מתעדכן אוטומטית ללא polling. GameViewModel מעביר פקודות לGameEngine ומעדכן LiveData בתוצאה.",
      "בלי GameViewModel: GameActivity הייתה מחזיקה את GameEngine ישירות. כל rotation היה הורס את הmatch — timer היה מתאפס, לוח היה נאבד. onSaveInstanceState() לא מספיק לdata מורכב. GameEngine לא היה יכול להיות Pure Java.",
      "הנקודה הכי מאתגרת: ניהול הטיימר. java.util.Timer רץ ב-background thread, לכן postValue() (לא setValue()) חייב לעדכן את TimerLiveData. בonCleared(), חייבים timer.cancel() — אחרת הטיימר ממשיך לרוץ גם אחרי שהActivity נסגרה, גורם ל-memory leak."
    ],
    codeWalkthrough: {
      methodName: "onCleared()",
      code: `@Override
protected void onCleared() {
    super.onCleared();
    if (timer != null) {
        timer.cancel();
        timer = null;
    }
    if (timerHandler != null) {
        timerHandler.removeCallbacksAndMessages(null);
    }
}`,
      lineExplanations: [
        { line: 1, explanation: "onCleared() נקרא כשה-ViewModel נהרס לצמיתות — Activity סגורה, לא rotation" },
        { line: 2, explanation: "super.onCleared() — חובה לקרוא לversion של class האב" },
        { line: 3, explanation: "בדיקת null לפני cancel() — Timer עשוי לא להיות מאותחל אם המשחק לא התחיל" },
        { line: 4, explanation: "timer.cancel() עוצר את ה-TimerTask ברקע — בלי זה הטיימר ממשיך לרוץ אינסוף" },
        { line: 5, explanation: "timer = null — מאפשר GC לשחרר את ה-Timer object מהזיכרון" },
        { line: 6, explanation: "timerHandler.removeCallbacksAndMessages(null) עוצר כל pending callbacks" }
      ]
    },
    commonMistakes: [
      { wrong: "onCleared() נקרא בכל rotation של מסך", correct: "onCleared() נקרא רק כשה-Activity נהרסת לצמיתות (back button, finish()). ViewModel שורד rotation — לכן board נשמר בסיבוב" },
      { wrong: "postValue() ו-setValue() זהים — ניתן לקרוא לשניהם מכל thread", correct: "setValue() חייב להיקרא מה-main thread בלבד. postValue() thread-safe לכל thread. Timer רץ ב-background → חייב postValue() לעדכון timerLiveData" },
      { wrong: "GameViewModel צריך Context כדי לגשת ל-GameEngine", correct: "GameViewModel() נוצר ללא Context — GameEngine הוא Pure Java. רק StatisticsViewModel/LeaderboardViewModel/AchievementsViewModel מקבלים Context" }
    ],
    examTips: {
      mention: ["'ViewModel שורד rotation — Activity נהרסת ונוצרת מחדש אבל ViewModel נשאר'", "'postValue() לעדכון מ-background thread של הטיימר'", "'onCleared() מנקה timer.cancel() למניעת memory leak'"],
      keywords: ["LiveData", "postValue", "onCleared", "rotation survival", "memory leak", "background thread"],
      avoid: ["אל תגיד ש-onCleared() נקרא ב-rotation", "אל תגיד ש-setValue() עובד מכל thread", "אל תגיד שGameViewModel צריך Context"]
    },
    connectionsMap: {
      from: ["מקבל לחיצות תא מ-GameActivity.onCellClick()", "מקבל seed מ-DailyChallengeActivity.startNewGameWithSeed()"],
      to: ["שולח game state ל-GameActivity דרך LiveData observers", "שולח save request ל-GameRepository.saveGameResult()"],
      createdBy: "נוצר ע\"י VMFactory.create(GameViewModel.class) שנקרא מ-GameActivity.onCreate()"
    }
  },

  {
    name: 'GameBoardView.java',
    package: 'ui/game',
    layer: 'ui',
    purpose: {
      he: 'Custom View (extends View). מצייר לוח מוקשים עם Canvas. 80x80px לתא. Gesture detector: tap, long-press, double-tap. onTouchEvent מחשב row/col מ-pixels.',
      en: 'Custom View (extends View). Draws minesweeper board with Canvas. 80x80px per cell. Gesture detector: tap, long-press, double-tap. onTouchEvent computes row/col from pixels.',
      mix: 'Canvas-based custom View. onDraw draws all cells. onTouchEvent → row/col calculation → listener.'
    },
    whyThisWay: { rejected: 'RecyclerView with cell items', chosen: 'Custom Canvas View', why: 'O(1) touch-to-cell mapping, full drawing control, no view recycling artifacts on small cells' },
    keyMethods: [
      { name: 'onDraw(Canvas)', explanation: { he: 'לולאה על board[r][c] → drawCell(). drawMine, drawFlag, drawNumber.', en: 'Loops over board[r][c] → drawCell(). drawMine, drawFlag, drawNumber.', mix: 'Double loop → drawCell() per cell. invalidate() triggers this.' }, code: 'for (int r = 0; r < rows; r++)\n  for (int c = 0; c < cols; c++)\n    drawCell(canvas, r, c, CELL_SIZE);' },
      { name: 'onTouchEvent(MotionEvent)', explanation: { he: 'col=(int)(x/cellSize), row=(int)(y/cellSize) → listener.onCellClick(row,col).', en: 'col=(int)(x/cellSize), row=(int)(y/cellSize) → listener.onCellClick(row,col).', mix: 'Pixel → cell coordinate. O(1) calculation.' }, code: 'int col = (int)(event.getX() / CELL_SIZE);\nint row = (int)(event.getY() / CELL_SIZE);\nlistener.onCellClick(row, col);' },
      { name: 'setGame(Game game)', explanation: { he: 'עדכון reference ל-board → invalidate() → onDraw().', en: 'Updates board reference → invalidate() → onDraw().', mix: 'setGame → invalidate → redraw. Called when LiveData changes.' }, code: 'this.game = game;\nthis.board = game.getBoard();\ninvalidate();' }
    ],
    connectsTo: ['GameActivity', 'Cell', 'CellState', 'Game'],
    examQuestions: ['מה GameBoardView ואיך onTouchEvent מחשב row/col?', 'למה Canvas ולא RecyclerView?'],
    deepExplanation: [
      "GameBoardView פותר את בעיית ייצוג interactive grid עם תאים קטנים. RecyclerView מתאים לרשימות אנכיות — גריד של 30×16=480 תאים עם touch detection מדויקת דורש Canvas rendering ישיר.",
      "GameBoardView extends View — ה-Android custom view mechanism. onDraw(Canvas) נקרא כשAndroid צריך לצייר. onTouchEvent(MotionEvent) נקרא כשמשתמש מגע. invalidate() מסמן 'צריך לצייר מחדש' — לא מצייר מיד. החישוב O(1) של תא מpixel coordinates הוא היתרון הגדול.",
      "בלי GameBoardView: RecyclerView עם 480 items = memory intensive. scroll artifacts. touch detection מורכב (GridLayoutManager לא מחזיר row/col ישירות). אי אפשר לצייר custom graphics (mines, flags, numbers עם styles). invalidate() pattern הרבה יותר פשוט מ-DiffUtil.",
      "הנקודה הכי מאתגרת: Gesture detection — tap, long-press, double-tap. GestureDetector מבדיל בין tap (reveal) ל-long-press (flag) ל-double-tap (quickReveal/chord). כל gesture צריך response שונה."
    ],
    codeWalkthrough: {
      methodName: "onTouchEvent(MotionEvent event)",
      code: `@Override
public boolean onTouchEvent(MotionEvent event) {
    if (event.getAction() == MotionEvent.ACTION_UP) {
        float x = event.getX();
        float y = event.getY();
        int col = (int)(x / CELL_SIZE);
        int row = (int)(y / CELL_SIZE);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            if (listener != null) {
                listener.onCellClick(row, col);
            }
        }
        return true;
    }
    return gestureDetector.onTouchEvent(event);
}`,
      lineExplanations: [
        { line: 1, explanation: "ACTION_UP = משתמש הרים את האצבע — tap מלא. ACTION_DOWN = לחיצה עדיין בביצוע" },
        { line: 2, explanation: "event.getX() / getY() = קואורדינטות pixel של touch בתוך ה-View" },
        { line: 3, explanation: "col = (int)(x / CELL_SIZE) — חלוקה פשוטה O(1) ממיר pixel ל-column index" },
        { line: 4, explanation: "row = (int)(y / CELL_SIZE) — אותו חישוב לשורה. y=0 = top of board" },
        { line: 5, explanation: "Boundary check — מוודא שהtouch בתוך גבולות הלוח" },
        { line: 6, explanation: "listener.onCellClick(row, col) — Interface callback ל-GameActivity. Decoupling: View לא מכיר Activity" },
        { line: 7, explanation: "return true = event handled — מונע ביצוע event handlers נוספים" },
        { line: 8, explanation: "gestureDetector.onTouchEvent() לlong-press (flag) ו-double-tap (quickReveal) gestures" }
      ]
    },
    commonMistakes: [
      { wrong: "GameBoardView הוא Fragment או RecyclerView", correct: "GameBoardView extends View — Custom View. onDraw(Canvas) מצייר ישירות. RecyclerView נדחה כי O(1) cell detection ו-full drawing control לא אפשריים בRecyclerView" },
      { wrong: "כל שינוי במשחק מצייר מחדש את כל ה-View", correct: "Android לא מצייר כל frame — רק כשקוראים invalidate(). setGame(game) קורא invalidate() שמסמן 'צייר שוב'. onDraw() יקרא בframe הבא" },
      { wrong: "onTouchEvent מחשב row/col עם חיפוש O(n)", correct: "חישוב O(1) ישיר: col=(int)(x/cellSize), row=(int)(y/cellSize). זו יתרון גדול של Canvas על RecyclerView" }
    ],
    examTips: {
      mention: ["'onTouchEvent: col=(int)(x/cellSize) — O(1) חישוב ישיר'", "'invalidate() → onDraw(Canvas) — ה-cycle של Android custom view'", "'setGame(game) → invalidate() כשLiveData משתנה'"],
      keywords: ["Canvas", "onDraw", "onTouchEvent", "invalidate", "O(1)", "Custom View", "GestureDetector", "listener interface"],
      avoid: ["אל תגיד שGameBoardView הוא RecyclerView", "אל תגיד שonDraw נקרא כל frame", "אל תבלבל ACTION_UP עם ACTION_DOWN"]
    },
    connectionsMap: {
      from: ["מקבל Game object מ-GameViewModel דרך LiveData observer ב-GameActivity"],
      to: ["שולח onCellClick(row, col) ל-GameActivity דרך OnCellClickListener interface"],
      createdBy: "נוצר ב-XML (activity_game.xml) ו-referenced ע\"י ViewBinding ב-GameActivity"
    }
  },

  {
    name: 'VMFactory.java',
    package: 'ui',
    layer: 'ui',
    purpose: {
      he: 'ViewModelProvider.Factory. פותר את הבעיה של ViewModel עם constructor parameters. create() יוצר: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context).',
      en: 'ViewModelProvider.Factory. Solves ViewModel with constructor parameters. create() creates: GameViewModel(), LeaderboardViewModel(context), StatisticsViewModel(context), AchievementsViewModel(context).',
      mix: 'Factory for ViewModels with params. 4 ViewModels. modelClass.isAssignableFrom() pattern.'
    },
    whyThisWay: { rejected: 'Hilt / Dagger DI', chosen: 'Manual VMFactory', why: 'No annotation processor overhead; demonstrates Factory Pattern for exam; sufficient for project scope' },
    keyMethods: [
      { name: 'create(Class<T> modelClass)', explanation: { he: 'בודק modelClass ומחזיר ViewModel מתאים.', en: 'Checks modelClass and returns appropriate ViewModel.', mix: 'create() switches on modelClass → returns ViewModel.' }, code: 'if (modelClass.isAssignableFrom(GameViewModel.class)) return (T) new GameViewModel();\nif (modelClass.isAssignableFrom(StatisticsViewModel.class)) return (T) new StatisticsViewModel(context);\n// ... etc' },
      { name: 'createFactory(Context)', explanation: { he: 'Static helper — VMFactory.createFactory(this) במקום new VMFactory(this).', en: 'Static helper — VMFactory.createFactory(this) instead of new VMFactory(this).', mix: 'Static factory method convenience.' }, code: 'public static VMFactory createFactory(Context context) { return new VMFactory(context); }' }
    ],
    connectsTo: ['GameViewModel', 'LeaderboardViewModel', 'StatisticsViewModel', 'AchievementsViewModel', 'GameActivity'],
    examQuestions: ['מה VMFactory ומה הבעיה שהוא פותר?', 'מה pattern השימוש ב-create()? (isAssignableFrom)'],
    deepExplanation: [
      "VMFactory פותר constraint מוזר של Android: ViewModel יכול להיווצר רק עם no-arg constructor ע\"י ViewModelProvider. אבל StatisticsViewModel, LeaderboardViewModel, ו-AchievementsViewModel צריכים Context כדי לגשת ל-Room DB. ללא Factory — compile error.",
      "VMFactory מממש ViewModelProvider.Factory — interface עם method אחת: create(Class<T>). כשActivity קוראת ViewModelProvider(this, factory).get(StatisticsViewModel.class), Android קורא factory.create(StatisticsViewModel.class) — ו-Factory מחזירה new StatisticsViewModel(context).",
      "בלי VMFactory: אי אפשר לצור ViewModels עם parameters. האלטרנטיבה היא Hilt (Dependency Injection framework) — עובד אבל מוסיף annotation processing, Gradle plugins, ו-200+ שורות configuration. VMFactory = same result, 20 שורות קוד.",
      "הנקודה הכי מאתגרת: isAssignableFrom() pattern. במקום instanceof (שלא עובד עם Class objects), משתמשים ב-modelClass.isAssignableFrom(GameViewModel.class). זה בודק אם modelClass הוא GameViewModel או subclass שלו."
    ],
    codeWalkthrough: {
      methodName: "create(Class<T> modelClass)",
      code: `@NonNull
@Override
public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
    if (modelClass.isAssignableFrom(GameViewModel.class)) {
        return (T) new GameViewModel();
    }
    if (modelClass.isAssignableFrom(LeaderboardViewModel.class)) {
        return (T) new LeaderboardViewModel(context);
    }
    if (modelClass.isAssignableFrom(StatisticsViewModel.class)) {
        return (T) new StatisticsViewModel(context);
    }
    if (modelClass.isAssignableFrom(AchievementsViewModel.class)) {
        return (T) new AchievementsViewModel(context);
    }
    throw new IllegalArgumentException(
        "Unknown ViewModel class: " + modelClass.getName());
}`,
      lineExplanations: [
        { line: 1, explanation: "@NonNull annotation — חוזה: create() לא יחזיר null (Lint warning prevention)" },
        { line: 2, explanation: "Generic method: <T extends ViewModel> מבטיח שמחזירים רק ViewModels" },
        { line: 3, explanation: "isAssignableFrom(GameViewModel.class) — בודק אם modelClass IS-A GameViewModel" },
        { line: 4, explanation: "new GameViewModel() — ללא Context! GameEngine הוא Pure Java ולא צריך Context" },
        { line: 5, explanation: "(T) = unchecked cast — בטוח כי isAssignableFrom() ודא שהtype נכון" },
        { line: 6, explanation: "new LeaderboardViewModel(context) — Context נחוץ לגישה ל-Room" },
        { line: 7, explanation: "new StatisticsViewModel(context) — Context לגישה ל-GameRepository ו-Room" },
        { line: 8, explanation: "throw IllegalArgumentException — ViewModel לא מוכר → crash בdevelopment = bug גלוי" }
      ]
    },
    commonMistakes: [
      { wrong: "VMFactory מוציא GameViewModel(context) כי context תמיד נחוץ", correct: "GameViewModel() נוצר ללא Context — Pure Java GameEngine לא צריך Context. רק ה-3 ViewModels עם DB access צריכים Context" },
      { wrong: "Hilt עדיף על VMFactory תמיד", correct: "Hilt מצוין לפרויקטים גדולים, אבל מוסיף complexity. VMFactory מדגים Factory Pattern בצורה ברורה ומספיק לפרויקט. בגרות = Factory Pattern, לא Hilt" },
      { wrong: "VMFactory נוצר ב-onCreate() ונמחק ב-onDestroy()", correct: "VMFactory הוא temporary — נוצר ב-onCreate() רק להקמת ViewModels. לאחר שViewModels נוצרו, Factory לא נדרשת. ה-ViewModels עצמם שורדים rotation" }
    ],
    examTips: {
      mention: ["'Android מאפשר ViewModel רק עם no-arg — VMFactory מאפשר parameters'", "'isAssignableFrom() במקום instanceof לClass objects'", "'GameViewModel() בלי Context — Pure Java. שאר ה-VMs עם context'"],
      keywords: ["ViewModelProvider.Factory", "isAssignableFrom", "Factory Pattern", "Context injection", "no-arg constructor"],
      avoid: ["אל תגיד שVMFactory = Hilt", "אל תגיד שGameViewModel מקבל Context", "אל תגיד שVMFactory שורד rotation"]
    },
    connectionsMap: {
      from: ["מקבל Context מ-GameActivity (this)"],
      to: ["מחזיר GameViewModel, LeaderboardViewModel, StatisticsViewModel, AchievementsViewModel ל-ViewModelProvider"],
      createdBy: "נוצר ע\"י כל Activity שצריכה ViewModel: new VMFactory(this) ב-onCreate()"
    }
  },

  {
    name: 'StatisticsActivity.java',
    package: 'ui/statistics',
    layer: 'ui',
    purpose: {
      he: 'מציג סטטיסטיקות מקיפות: wins, losses, winRate, streaks, totalPlayTime, per-difficulty stats. מחשב מ-GameRepository.getAllGames(). getDifficultyName() מוצא רמה לפי מימדים.',
      en: 'Displays comprehensive stats: wins, losses, winRate, streaks, totalPlayTime, per-difficulty stats. Calculates from GameRepository.getAllGames(). getDifficultyName() maps dimensions to difficulty.',
      mix: 'Stats screen. calculateStatistics() scans all games. 19 TextViews. getDifficultyName() maps (9x9x10=Easy etc).'
    },
    whyThisWay: { rejected: 'Fetch stats from Firebase', chosen: 'Calculate locally from Room', why: 'Offline available; faster; Room is the source of truth' },
    keyMethods: [
      { name: 'calculateStatistics()', explanation: { he: 'סורק כל games, מחשב streaks, per-difficulty, win rates, best times.', en: 'Scans all games, calculates streaks, per-difficulty stats, win rates, best times.', mix: 'O(n) scan of all games. Calculates all stats in one pass.' }, code: 'for (Game g : games) {\n  if (g.getStatus() == WON) { wins++; currentStreak++; }\n  else if (g.getStatus() == LOST) { losses++; currentStreak = 0; }\n}' },
      { name: 'getDifficultyName(w, h, mines)', explanation: { he: '9×9×10=Easy, 16×16×40=Medium, 30×16×99=Hard.', en: '9×9×10=Easy, 16×16×40=Medium, 30×16×99=Hard.', mix: 'Maps board dims to difficulty name string.' }, code: 'if (w==9 && h==9 && m==10) return "Easy";\nif (w==16 && h==16 && m==40) return "Medium";\nif (w==30 && h==16 && m==99) return "Hard";' }
    ],
    connectsTo: ['GameRepository', 'Statistics', 'BaseNavigationActivity'],
    examQuestions: ['מה getDifficultyName() ואיך מזהה רמת קושי?']
  },

  {
    name: 'LeaderboardActivity.java',
    package: 'ui/leaderboard',
    layer: 'ui',
    purpose: {
      he: 'מציג לוח מובילים. TabLayout לפי קושי (Beginner/Intermediate/Expert). SwipeRefreshLayout. RecyclerView עם LeaderboardAdapter. שולף מ-FirebaseManager.fetchLeaderboard().',
      en: 'Displays leaderboard. TabLayout by difficulty (Beginner/Intermediate/Expert). SwipeRefreshLayout. RecyclerView with LeaderboardAdapter. Fetches from FirebaseManager.fetchLeaderboard().',
      mix: 'Leaderboard screen. Tabs per difficulty. FirebaseManager fetches scores/. SwipeRefresh.'
    },
    whyThisWay: { rejected: 'Show all difficulties at once', chosen: 'TabLayout with difficulty filter', why: 'UX — focused view per difficulty; Firebase query filtered by difficulty field' },
    keyMethods: [],
    connectsTo: ['FirebaseManager', 'LeaderboardAdapter', 'LeaderboardEntry', 'BaseNavigationActivity'],
    examQuestions: ['מה Firestore path לציונים?', 'מה Security Rule לקריאת scores/?']
  },

  {
    name: 'AuthActivity.java',
    package: 'ui/auth',
    layer: 'ui',
    purpose: {
      he: 'מסך כניסה/הרשמה. 3 שיטות: Email+Password, Google Sign-In, Anonymous. מנהל AuthViewModel.',
      en: 'Login/register screen. 3 methods: Email+Password, Google Sign-In, Anonymous. Manages AuthViewModel.',
      mix: '3 auth methods. Anonymous = immediate play. AuthViewModel manages state.'
    },
    whyThisWay: { rejected: 'Auth logic in Activity', chosen: 'AuthViewModel + FirebaseManager', why: 'MVVM — auth state persists across rotation; Activity just observes' },
    keyMethods: [],
    connectsTo: ['FirebaseManager', 'App'],
    examQuestions: ['מה 3 שיטות Auth בפרויקט?']
  },

  {
    name: 'ProfileActivity.java',
    package: 'ui/profile',
    layer: 'ui',
    purpose: {
      he: 'פרופיל משתמש. Image upload: גלריה → דחיסה → Firebase Storage → URL ב-Firestore. Glide לטעינת תמונות. dialog_edit_profile.xml לעריכה.',
      en: 'User profile. Image upload: gallery → compress → Firebase Storage → URL in Firestore. Glide for image loading. dialog_edit_profile.xml for editing.',
      mix: 'Profile screen. Glide.load(url). Firebase Storage for photos. Firestore for URL.'
    },
    whyThisWay: { rejected: 'Store image as Base64 in Firestore', chosen: 'Firebase Storage + URL in Firestore', why: 'Images too large for Firestore documents (1MB limit); Storage designed for binary files' },
    keyMethods: [],
    connectsTo: ['FirebaseManager', 'BaseNavigationActivity'],
    examQuestions: ['מה Glide ולמה Firebase Storage ולא Base64?']
  },

  {
    name: 'NfcActivity.java',
    package: 'ui/nfc',
    layer: 'ui',
    purpose: {
      he: 'NFC sharing screen. כותב NDEF Message עם NfcHandler. onNewIntent() מפענח כשמכשיר ב\' נגע. launchMode=singleTop. simulate_nfc=true לבדיקה.',
      en: 'NFC sharing screen. Writes NDEF Message with NfcHandler. onNewIntent() decodes when device B touches. launchMode=singleTop. simulate_nfc=true for testing.',
      mix: 'NFC write + read. onNewIntent() = singleTop trigger. simulate_nfc for testing.'
    },
    whyThisWay: { rejected: 'QR code or Bluetooth', chosen: 'NFC NDEF', why: 'Physical proximity requirement adds game design element; NFC faster for small data than BT pairing' },
    keyMethods: [
      { name: 'onNewIntent(Intent intent)', explanation: { he: 'נקרא כש-singleTop Activity מקבלת NFC intent. מפענח NDEF → CustomMap.', en: 'Called when singleTop Activity receives NFC intent. Decodes NDEF → CustomMap.', mix: 'singleTop NFC trigger → decode → show accept button.' }, code: '@Override protected void onNewIntent(Intent intent) {\n  super.onNewIntent(intent);\n  handleIntent(intent);\n}' }
    ],
    connectsTo: ['NfcHandler', 'GameActivity'],
    examQuestions: ['מה required=false ב-Manifest?', 'מה onNewIntent() ו-singleTop?']
  },

  {
    name: 'DailyChallengeActivity.java',
    package: 'ui/daily',
    layer: 'ui',
    purpose: {
      he: 'מסך Daily Challenge. מחשב seed מתאריך. מפעיל GameEngine עם seed. מעלה ציון ל-Firestore daily_challenges/{date}/scores/{uid}.',
      en: 'Daily Challenge screen. Calculates seed from date. Starts GameEngine with seed. Uploads score to Firestore daily_challenges/{date}/scores/{uid}.',
      mix: 'Daily Challenge UI. seed from date. Firestore daily_challenges/{date}/scores/{uid}.'
    },
    whyThisWay: { rejected: 'Download board from server', chosen: 'Date-derived seed', why: 'Zero server cost; deterministic; works offline (just no leaderboard upload)' },
    keyMethods: [],
    connectsTo: ['GameViewModel', 'FirebaseManager', 'DailyChallenge'],
    examQuestions: ['מה Firestore path ל-Daily Challenge scores?']
  },

  {
    name: 'MultiplayerLobbyActivity.java',
    package: 'ui/multiplayer',
    layer: 'ui',
    purpose: {
      he: 'לובי Multiplayer. יצירת/הצטרפות לחדרים ב-Firebase RTDB. RoomListAdapter מציג חדרים פתוחים.',
      en: 'Multiplayer lobby. Create/join rooms in Firebase RTDB. RoomListAdapter shows open rooms.',
      mix: 'Multiplayer lobby. RTDB rooms/ CRUD. List open rooms with RoomListAdapter.'
    },
    whyThisWay: { rejected: 'Matchmaking server', chosen: 'Firebase RTDB room list', why: 'No server to maintain; RTDB real-time updates show new rooms instantly' },
    keyMethods: [],
    connectsTo: ['FirebaseManager', 'RoomListAdapter', 'MultiplayerWaitingRoomActivity'],
    examQuestions: ['מה Firebase RTDB path ל-Multiplayer?']
  },

  {
    name: 'SettingsActivity.java',
    package: 'ui/settings',
    layer: 'ui',
    purpose: {
      he: 'הגדרות: theme, haptics, sound, firstClickSafe, animationSpeed, autoSync. קורא/כותב דרך SettingsManager.',
      en: 'Settings: theme, haptics, sound, firstClickSafe, animationSpeed, autoSync. Reads/writes through SettingsManager.',
      mix: 'Settings UI. All prefs via SettingsManager. No direct SharedPreferences access.'
    },
    whyThisWay: { rejected: 'Direct SharedPreferences in Activity', chosen: 'SettingsManager abstraction', why: 'Centralized preference keys; easy to add new settings without hunting Activity code' },
    keyMethods: [],
    connectsTo: ['SettingsManager', 'ThemeManager'],
    examQuestions: []
  },

  {
    name: 'TutorialActivity.java',
    package: 'ui/tutorial',
    layer: 'ui',
    purpose: {
      he: 'Tutorial ViewPager. TutorialPagerAdapter מנהל TutorialStepFragment-s. InteractiveTutorialFragment לתרגול אמיתי.',
      en: 'Tutorial ViewPager. TutorialPagerAdapter manages TutorialStepFragment-s. InteractiveTutorialFragment for hands-on practice.',
      mix: 'Tutorial with ViewPager. Steps + interactive practice fragment.'
    },
    whyThisWay: { rejected: 'Single scrolling page', chosen: 'ViewPager with fragments', why: 'Step-by-step UX; swipe navigation; each step isolated in its own Fragment' },
    keyMethods: [],
    connectsTo: ['TutorialPagerAdapter', 'TutorialStepFragment', 'InteractiveTutorialFragment', 'TutorialManager'],
    examQuestions: []
  },

  {
    name: 'GameHistoryActivity.java',
    package: 'ui/history',
    layer: 'ui',
    purpose: {
      he: 'מציג היסטוריית משחקים מ-Room DB. RecyclerView עם GameHistoryAdapter. שולף מ-GameRepository.',
      en: 'Displays game history from Room DB. RecyclerView with GameHistoryAdapter. Fetches from GameRepository.',
      mix: 'Game history list. Room → Repository → Adapter → RecyclerView.'
    },
    whyThisWay: { rejected: 'Fetch history from Firebase', chosen: 'Room local history', why: 'Offline available; Room is single source of truth for game history' },
    keyMethods: [],
    connectsTo: ['GameRepository', 'GameHistoryAdapter', 'BaseNavigationActivity'],
    examQuestions: []
  },

  {
    name: 'AchievementsActivity.java',
    package: 'ui/achievements',
    layer: 'ui',
    purpose: {
      he: 'מציג הישגים. RecyclerView עם AchievementAdapter. נתוני הישגים מ-AchievementsViewModel.',
      en: 'Displays achievements. RecyclerView with AchievementAdapter. Achievement data from AchievementsViewModel.',
      mix: 'Achievements list. AchievementsViewModel (context) → AchievementAdapter.'
    },
    whyThisWay: { rejected: 'Hardcoded list in layout', chosen: 'Dynamic list from DB', why: 'Progress-based achievements require DB state; unlocked status persisted' },
    keyMethods: [],
    connectsTo: ['AchievementsViewModel', 'AchievementAdapter', 'Achievement'],
    examQuestions: ['מה AchievementsViewModel(context) ולמה צריך VMFactory?']
  },

  {
    name: 'MainActivity.java',
    package: 'ui',
    layer: 'ui',
    purpose: {
      he: 'מסך בית / launcher. BottomNavigationView לניווט בין game, stats, leaderboard, profile. ירש מ-BaseNavigationActivity.',
      en: 'Home / launcher screen. BottomNavigationView for navigation between game, stats, leaderboard, profile. Inherits from BaseNavigationActivity.',
      mix: 'Home screen + BottomNav. BaseNavigationActivity subclass.'
    },
    whyThisWay: { rejected: 'Navigation Drawer', chosen: 'BottomNavigationView', why: 'Material Design guideline for 3-5 top-level destinations; thumb-friendly on mobile' },
    keyMethods: [],
    connectsTo: ['BaseNavigationActivity', 'GameActivity', 'StatisticsActivity', 'LeaderboardActivity', 'ProfileActivity'],
    examQuestions: []
  },

  // ══════════════ UTILS ══════════════
  {
    name: 'AchievementManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'בודק הישגים אחרי כל משחק: First Victory, Speed Demon (<60s), Perfect Game, Streak Master, Century Club, No Mistakes, Expert Champion, Speed Runner (<120s). מודיע דרך AchievementListener.',
      en: 'Checks achievements after each game: First Victory, Speed Demon (<60s), Perfect Game, Streak Master, Century Club, No Mistakes, Expert Champion, Speed Runner (<120s). Notifies via AchievementListener.',
      mix: '8 achievements. checkAchievements(game) after each win. Listener pattern for notifications.'
    },
    whyThisWay: { rejected: 'Check achievements in GameEngine', chosen: 'Separate AchievementManager utility', why: 'GameEngine is Pure Java and must not know about achievements/DB; separation of concerns' },
    keyMethods: [
      { name: 'checkAchievements(Game game)', explanation: { he: 'נקרא אחרי כל ניצחון. בודק כל 8 הישגים.', en: 'Called after every win. Checks all 8 achievements.', mix: 'Main entry point. Checks all achievements sequentially.' }, code: 'public void checkAchievements(Game game) {\n  checkFirstVictory();\n  if (game.getSecondsElapsed() < 60) checkSpeedDemon();\n  checkPerfectGame(game);\n  // ... etc\n}' }
    ],
    connectsTo: ['GameRepository', 'DatabaseHelper', 'Achievement', 'AchievementsActivity'],
    examQuestions: ['מה 8 ההישגים בפרויקט?', 'מה Speed Demon requirement?']
  },

  {
    name: 'NfcHandler.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'קורא וכותב NDEF Messages עם NFC. ChallengeData inner class: width, height, mines, difficulty, creator, targetTime. Validation: max 50×50, mines < total cells.',
      en: 'Reads and writes NDEF Messages with NFC. ChallengeData inner class: width, height, mines, difficulty, creator, targetTime. Validation: max 50×50, mines < total cells.',
      mix: 'NFC NDEF read/write. ChallengeData serialized as JSON. Validation built in.'
    },
    whyThisWay: { rejected: 'Bluetooth file transfer', chosen: 'NFC NDEF', why: 'Instant tap-to-share; no pairing needed; NDEF standard for cross-device compatibility' },
    keyMethods: [
      { name: 'write(NfcAdapter, ChallengeData)', explanation: { he: 'ממיר ChallengeData ל-JSON → NDEF Message.', en: 'Converts ChallengeData to JSON → NDEF Message.', mix: 'ChallengeData → JSON → NDEF. NfcAdapter.setNdefPushMessage().' }, code: 'NdefRecord record = NdefRecord.createMime("application/minesweeper", data.toJson().getBytes());\nndefMessage = new NdefMessage(record);' },
      { name: 'read(Intent)', explanation: { he: 'מפענח NDEF מ-Intent → ChallengeData.', en: 'Decodes NDEF from Intent → ChallengeData.', mix: 'Intent → Parcelable[] → NdefMessage → parse JSON.' }, code: 'Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);\nNdefMessage msg = (NdefMessage) rawMsgs[0];\nreturn ChallengeData.fromJson(new String(msg.getRecords()[0].getPayload()));' }
    ],
    connectsTo: ['NfcActivity'],
    examQuestions: ['מה MIME type של NDEF ב-NfcHandler?', 'מה NfcActivity.onNewIntent() עושה?'],
    deepExplanation: [
      "NfcHandler פותר את בעיית שיתוף custom maps בין מכשירים. ללא NFC, שיתוף map היה דורש שרת מרכזי, QR codes, או Bluetooth pairing — כולם מורכבים יותר. NFC = פשוט כמו לגעת בטלפונים.",
      "NfcHandler אורז את ה-ChallengeData (width, height, mines, difficulty, creator, targetTime) כ-NDEF Message עם MIME type מותאם אישית. NDEF (NFC Data Exchange Format) הוא תקן cross-device.",
      "בלי NfcHandler: לא ניתן לשתף custom maps. NfcActivity הייתה צריכה לממש NDEF logic ישירות — coupling גבוה. Validation של boardSize (max 50×50, mines < totalCells) היה מפוזר. simulate_nfc=true לא היה ניתן לישום בצורה נקייה.",
      "הנקודה הכי מאתגרת: onNewIntent() ו-singleTop launchMode. כדי שNFC intent יגיע ל-Activity שכבר פתוחה (ולא Activity חדשה), Activity חייבת להיות מוגדרת כ-singleTop ב-Manifest. Android מעביר את ה-Intent לonNewIntent() במקום ליצור instance חדש."
    ],
    codeWalkthrough: {
      methodName: "read(Intent intent)",
      code: `public static ChallengeData read(Intent intent) {
    Parcelable[] rawMsgs = intent.getParcelableArrayExtra(
        NfcAdapter.EXTRA_NDEF_MESSAGES);
    if (rawMsgs == null || rawMsgs.length == 0) {
        return null;
    }
    NdefMessage msg = (NdefMessage) rawMsgs[0];
    NdefRecord record = msg.getRecords()[0];
    String payload = new String(record.getPayload(), StandardCharsets.UTF_8);
    return ChallengeData.fromJson(payload);
}`,
      lineExplanations: [
        { line: 1, explanation: "EXTRA_NDEF_MESSAGES = המפתח ל-NFC data ב-Intent שנשלח ע\"י Android" },
        { line: 2, explanation: "rawMsgs הוא Parcelable[] כי NDEF Message הוא Parcelable object" },
        { line: 3, explanation: "null check — אם Intent לא מכיל NDEF (למשל simulate_nfc=false), מחזיר null" },
        { line: 4, explanation: "rawMsgs[0] — הmessage הראשון. cast ל-NdefMessage" },
        { line: 5, explanation: "getRecords()[0] — NdefMessage מכיל NdefRecord[]. כתבנו רק record אחד" },
        { line: 6, explanation: "getPayload() = ה-bytes שכתבנו ב-write(). ממיר ל-String UTF-8" },
        { line: 7, explanation: "ChallengeData.fromJson(payload) — parse JSON → Java object עם width/height/mines" }
      ]
    },
    commonMistakes: [
      { wrong: "NFC required=true ב-Manifest כי האפליקציה לא תעבוד בלי NFC", correct: "required=false — App זמין לכולם. checkNfcStatus() בודק בruntime. מכשיר ללא NFC: כל הפיצ'רים זמינים, רק שיתוף map לא" },
      { wrong: "onNewIntent() נקרא כשפותחים Activity חדשה", correct: "onNewIntent() נקרא כש-Activity כבר פתוחה ומקבלת intent חדש — בזכות launchMode=singleTop. ללא singleTop, NFC היה יוצר Activity instance חדשה" },
      { wrong: "NfcHandler כותב ל-Bluetooth או Wi-Fi", correct: "NfcHandler כותב NDEF Message ל-NFC adapter. NFC = physical proximity (tap), לא wireless networking" }
    ],
    examTips: {
      mention: ["'required=false ב-Manifest — App זמין לכולם, NFC נבדק בruntime'", "'singleTop launchMode — onNewIntent() נקרא כשActivity כבר פתוחה'", "'simulate_nfc=true Intent extra לבדיקה ללא חומרה'"],
      keywords: ["NDEF", "NfcAdapter", "onNewIntent", "singleTop", "required=false", "Parcelable", "ChallengeData"],
      avoid: ["אל תגיד שNFC required=true", "אל תבלבל NFC עם Bluetooth", "אל תגיד שonNewIntent יוצר Activity חדשה"]
    },
    connectionsMap: {
      from: ["מקבל ChallengeData מ-NfcActivity.shareMap()", "מקבל Intent מ-NfcActivity.onNewIntent()"],
      to: ["שולח ChallengeData ל-NfcActivity לאחר parse", "שולח NDEF Message ל-NfcAdapter"],
      createdBy: "נוצר ע\"י NfcActivity (new NfcHandler()) — utility class"
    }
  },

  {
    name: 'SettingsManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'SharedPreferences wrapper. Settings: themeMode, hapticsEnabled, soundEnabled, soundVolume, firstClickSafe, vibrationDuration, animationSpeed, tutorialCompleted, username, autoSyncEnabled.',
      en: 'SharedPreferences wrapper. Settings: themeMode, hapticsEnabled, soundEnabled, soundVolume, firstClickSafe, vibrationDuration, animationSpeed, tutorialCompleted, username, autoSyncEnabled.',
      mix: 'SharedPreferences abstraction. Constants for keys. resetToDefaults() available.'
    },
    whyThisWay: { rejected: 'Raw SharedPreferences everywhere', chosen: 'SettingsManager singleton', why: 'Centralized key constants; prevents typos in key strings; easy mocking for tests' },
    keyMethods: [],
    connectsTo: ['App', 'GameActivity', 'SettingsActivity', 'ThemeManager'],
    examQuestions: ['מה SettingsManager ולמה לא SharedPreferences ישיר?']
  },

  {
    name: 'HapticsManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'מנהל רטט. vibrate(duration) אם hapticsEnabled ב-SettingsManager. VibrationEffect ב-API 26+.',
      en: 'Manages vibration. vibrate(duration) if hapticsEnabled in SettingsManager. VibrationEffect on API 26+.',
      mix: 'Haptic feedback. Checks SettingsManager.isHapticsEnabled(). API 26+ VibrationEffect.'
    },
    whyThisWay: { rejected: 'Direct Vibrator calls in Activity', chosen: 'HapticsManager util', why: 'Single responsibility; respects user setting; API version handling in one place' },
    keyMethods: [],
    connectsTo: ['SettingsManager', 'GameActivity'],
    examQuestions: []
  },

  {
    name: 'SoundManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'מנהל סאונד עם SoundPool. Sounds: reveal, flag, win, lose, explosion. בודק isSoundEnabled() לפני כל playSound().',
      en: 'Manages sounds with SoundPool. Sounds: reveal, flag, win, lose, explosion. Checks isSoundEnabled() before every playSound().',
      mix: 'SoundPool for game sounds. Checks setting before play. 5 sound effects.'
    },
    whyThisWay: { rejected: 'MediaPlayer for short sounds', chosen: 'SoundPool', why: 'SoundPool designed for short simultaneous sounds; MediaPlayer adds latency for game sounds' },
    keyMethods: [],
    connectsTo: ['SettingsManager', 'App', 'GameActivity'],
    examQuestions: []
  },

  {
    name: 'ThemeManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'מנהל theme: THEME_AUTO (System), THEME_LIGHT, THEME_DARK. applyTheme() קורא AppCompatDelegate.setDefaultNightMode().',
      en: 'Manages theme: THEME_AUTO (System), THEME_LIGHT, THEME_DARK. applyTheme() calls AppCompatDelegate.setDefaultNightMode().',
      mix: 'Theme manager. 3 modes. AppCompatDelegate.setDefaultNightMode().'
    },
    whyThisWay: { rejected: 'Recreate activity on theme change', chosen: 'AppCompatDelegate night mode', why: 'System-level API handles theme switch without Activity recreate hack' },
    keyMethods: [],
    connectsTo: ['SettingsManager', 'App'],
    examQuestions: []
  },

  {
    name: 'TutorialManager.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'מנהל מצב tutorial. isTutorialCompleted() → מחליט אם להציג tutorial בפתיחה.',
      en: 'Manages tutorial state. isTutorialCompleted() → decides whether to show tutorial on launch.',
      mix: 'Tutorial state. SharedPreferences flag. First-launch tutorial auto-show.'
    },
    whyThisWay: { rejected: 'Always show tutorial', chosen: 'One-time show via SharedPreferences flag', why: 'UX — experienced users should not see tutorial every launch' },
    keyMethods: [],
    connectsTo: ['SettingsManager', 'TutorialActivity', 'App'],
    examQuestions: []
  },

  {
    name: 'ValidationUtil.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'Validation static methods: isValidEmail(), isValidPassword(), isValidBoardSize(w, h, mines). Guard clause pattern.',
      en: 'Validation static methods: isValidEmail(), isValidPassword(), isValidBoardSize(w, h, mines). Guard clause pattern.',
      mix: 'Static validators. Email regex, password length, board size/mines bounds.'
    },
    whyThisWay: { rejected: 'Validate inline in Activity', chosen: 'Separate ValidationUtil', why: 'DRY — same validation reused in AuthActivity, DifficultySelectionDialog, NfcHandler' },
    keyMethods: [],
    connectsTo: ['AuthActivity', 'DifficultySelectionDialog', 'NfcHandler'],
    examQuestions: []
  },

  {
    name: 'PatternTipsHelper.java',
    package: 'util',
    layer: 'util',
    purpose: {
      he: 'מספק tips לדפוסי Minesweeper: 1-2-1 pattern, 1-1 pattern, corner patterns. משמש PatternsTutorialActivity.',
      en: 'Provides Minesweeper pattern tips: 1-2-1 pattern, 1-1 pattern, corner patterns. Used by PatternsTutorialActivity.',
      mix: 'Pattern recognition tips. 1-2-1, 1-1, corners. Tutorial helper.'
    },
    whyThisWay: { rejected: 'Hardcode tips in XML strings', chosen: 'Helper class with structured tips', why: 'Tips need code examples and interactive demonstrations — not just text' },
    keyMethods: [],
    connectsTo: ['PatternsTutorialActivity'],
    examQuestions: []
  },

  // ══════════════ ADAPTERS ══════════════
  {
    name: 'LeaderboardAdapter.java',
    package: 'ui/leaderboard',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter ל-LeaderboardEntry items. Binds: rank, playerName, score, time. ViewHolder pattern.',
      en: 'RecyclerView.Adapter for LeaderboardEntry items. Binds: rank, playerName, score, time. ViewHolder pattern.',
      mix: 'RecyclerView Adapter. LeaderboardEntry → item_leaderboard_entry.xml.'
    },
    whyThisWay: { rejected: 'ListView', chosen: 'RecyclerView + ViewHolder', why: 'RecyclerView recycles views efficiently; ViewHolder avoids repeated findViewById calls' },
    keyMethods: [],
    connectsTo: ['LeaderboardActivity', 'LeaderboardEntry'],
    examQuestions: []
  },

  {
    name: 'AchievementAdapter.java',
    package: 'ui/achievements',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter ל-Achievement items. מציג: icon, name, description, progress bar, unlocked status.',
      en: 'RecyclerView.Adapter for Achievement items. Shows: icon, name, description, progress bar, unlocked status.',
      mix: 'Achievement list adapter. Progress bar for partial achievements.'
    },
    whyThisWay: { rejected: 'ListView with custom adapter', chosen: 'RecyclerView.Adapter', why: 'Standard modern Android pattern; better performance, DiffUtil support' },
    keyMethods: [],
    connectsTo: ['AchievementsActivity', 'Achievement'],
    examQuestions: []
  },

  {
    name: 'GameHistoryAdapter.java',
    package: 'ui/history',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter להיסטוריית משחקים. מציג: date, difficulty, result (WIN/LOSS), time, score.',
      en: 'RecyclerView.Adapter for game history. Shows: date, difficulty, result (WIN/LOSS), time, score.',
      mix: 'History list adapter. Game → item_game_history.xml.'
    },
    whyThisWay: { rejected: 'Table layout', chosen: 'RecyclerView', why: 'Variable number of history items; RecyclerView handles scroll efficiently' },
    keyMethods: [],
    connectsTo: ['GameHistoryActivity', 'Game'],
    examQuestions: []
  },

  {
    name: 'DailyChallengeLeaderboardAdapter.java',
    package: 'ui/daily',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter לדירוג Daily Challenge. Firestore daily_challenges/{date}/scores → sorted list.',
      en: 'RecyclerView.Adapter for Daily Challenge rankings. Firestore daily_challenges/{date}/scores → sorted list.',
      mix: 'Daily leaderboard adapter. Daily Challenge scores from Firestore.'
    },
    whyThisWay: { rejected: 'Reuse LeaderboardAdapter', chosen: 'Separate adapter', why: 'Different data structure — Daily Challenge scores have additional fields (timeTaken, completionOrder)' },
    keyMethods: [],
    connectsTo: ['DailyChallengeActivity', 'FirebaseManager'],
    examQuestions: []
  },

  {
    name: 'RoomListAdapter.java',
    package: 'ui/multiplayer',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter לרשימת חדרי Multiplayer מ-RTDB. מציג: roomId, hostName, status (waiting/full).',
      en: 'RecyclerView.Adapter for Multiplayer room list from RTDB. Shows: roomId, hostName, status (waiting/full).',
      mix: 'Room list adapter. RTDB rooms/ → item_multiplayer_room.xml.'
    },
    whyThisWay: { rejected: 'Static room list', chosen: 'Dynamic RTDB-backed list', why: 'Rooms appear/disappear in real-time; ValueEventListener updates adapter' },
    keyMethods: [],
    connectsTo: ['MultiplayerLobbyActivity', 'MultiplayerRoom'],
    examQuestions: []
  },

  {
    name: 'CustomPresetsAdapter.java',
    package: 'ui/game',
    layer: 'ui',
    purpose: {
      he: 'RecyclerView.Adapter ל-CustomPreset items ב-DifficultySelectionDialog.',
      en: 'RecyclerView.Adapter for CustomPreset items in DifficultySelectionDialog.',
      mix: 'Custom presets list in difficulty dialog.'
    },
    whyThisWay: { rejected: 'Spinner/Dropdown', chosen: 'RecyclerView in Dialog', why: 'Allows delete/edit per item; richer UX for managing presets' },
    keyMethods: [],
    connectsTo: ['DifficultySelectionDialog', 'CustomPreset'],
    examQuestions: []
  },

  // ══════════════ FRAGMENTS ══════════════
  {
    name: 'TutorialStepFragment.java',
    package: 'ui/tutorial',
    layer: 'ui',
    purpose: {
      he: 'Fragment לצעד tutorial יחיד. TutorialStep model: title, description, imageRes. משמש TutorialPagerAdapter.',
      en: 'Fragment for a single tutorial step. TutorialStep model: title, description, imageRes. Used by TutorialPagerAdapter.',
      mix: 'One tutorial step fragment. TutorialPagerAdapter uses these.'
    },
    whyThisWay: { rejected: 'Each step as separate Activity', chosen: 'Fragments in ViewPager', why: 'Swipe navigation; share ViewPager scroll state; single Activity for tutorial flow' },
    keyMethods: [],
    connectsTo: ['TutorialActivity', 'TutorialPagerAdapter', 'TutorialStep'],
    examQuestions: []
  },

  {
    name: 'InteractiveTutorialFragment.java',
    package: 'ui/tutorial',
    layer: 'ui',
    purpose: {
      he: 'Fragment עם mini-board אמיתי לתרגול. GameEngine מופע מינימלי. מנחה משתמש עם hints.',
      en: 'Fragment with real mini-board for practice. Minimal GameEngine instance. Guides user with hints.',
      mix: 'Interactive tutorial with real mini GameEngine. Guided hints.'
    },
    whyThisWay: { rejected: 'Static screenshots for tutorial', chosen: 'Interactive fragment', why: 'Learning by doing — real interaction better than passive reading' },
    keyMethods: [],
    connectsTo: ['TutorialActivity', 'GameEngine', 'GameBoardView'],
    examQuestions: []
  },

  {
    name: 'TutorialPagerAdapter.java',
    package: 'ui/tutorial',
    layer: 'ui',
    purpose: {
      he: 'FragmentStatePagerAdapter ל-ViewPager. מנהל TutorialStepFragment-s ו-InteractiveTutorialFragment.',
      en: 'FragmentStatePagerAdapter for ViewPager. Manages TutorialStepFragment-s and InteractiveTutorialFragment.',
      mix: 'ViewPager adapter. Holds all tutorial fragments.'
    },
    whyThisWay: { rejected: 'FragmentPagerAdapter', chosen: 'FragmentStatePagerAdapter', why: 'StatePager destroys off-screen fragments to save memory; better for many tutorial steps' },
    keyMethods: [],
    connectsTo: ['TutorialActivity', 'TutorialStepFragment', 'InteractiveTutorialFragment'],
    examQuestions: []
  },

  // ══════════════ DIALOGS ══════════════
  {
    name: 'DifficultySelectionDialog.java',
    package: 'ui/game',
    layer: 'ui',
    purpose: {
      he: 'Dialog לבחירת קושי: Easy/Medium/Hard/Custom. CustomPresetsAdapter מציג presets שמורים. Validation ל-custom values.',
      en: 'Dialog for difficulty selection: Easy/Medium/Hard/Custom. CustomPresetsAdapter shows saved presets. Validation for custom values.',
      mix: 'Difficulty picker dialog. 4 modes. Custom = user inputs width/height/mines.'
    },
    whyThisWay: { rejected: 'Activity for difficulty selection', chosen: 'Dialog fragment', why: 'Modal UX — user must choose before continuing; lighter than full Activity' },
    keyMethods: [],
    connectsTo: ['GameActivity', 'CustomPresetsAdapter', 'ValidationUtil'],
    examQuestions: []
  },

  // ══════════════ DOMAIN MODELS ══════════════
  {
    name: 'TutorialStep.java',
    package: 'domain/model',
    layer: 'domain',
    purpose: {
      he: 'מודל צעד tutorial: title, description, imageRes, isInteractive.',
      en: 'Tutorial step model: title, description, imageRes, isInteractive.',
      mix: 'Tutorial step data. title + description + optional image.'
    },
    whyThisWay: { rejected: 'XML-defined steps', chosen: 'Java model', why: 'Dynamic steps can be conditional; model allows programmatic step generation' },
    keyMethods: [],
    connectsTo: ['TutorialStepFragment', 'TutorialPagerAdapter'],
    examQuestions: []
  },

  {
    name: 'LeaderboardEntry.java',
    package: 'ui/leaderboard',
    layer: 'ui',
    purpose: {
      he: 'מודל entry בלוח מובילים: playerName, score, timeTaken, difficulty, date. Firestore scores/ document.',
      en: 'Leaderboard entry model: playerName, score, timeTaken, difficulty, date. Firestore scores/ document.',
      mix: 'Leaderboard data model. Firestore document mapping.'
    },
    whyThisWay: { rejected: 'Map<String, Object> for Firestore', chosen: 'Typed model class', why: 'Type safety; Firestore can auto-serialize/deserialize with @DocumentId' },
    keyMethods: [],
    connectsTo: ['LeaderboardAdapter', 'FirebaseManager'],
    examQuestions: []
  }
];

// ----------------------------------------------------------------
// XML_LAYOUTS — every layout file in the project
// ----------------------------------------------------------------
const XML_LAYOUTS = [
  {
    filename: 'activity_main.xml',
    connectedTo: 'MainActivity.java',
    description: {
      he: 'מסך בית ראשי. BottomNavigationView תחתון עם 4 destinations. CoordinatorLayout עם AppBarLayout.',
      en: 'Main home screen. BottomNavigationView at bottom with 4 destinations. CoordinatorLayout with AppBarLayout.',
      mix: 'Home screen. BottomNavigationView (4 items) + AppBarLayout.'
    },
    views: [
      { type: 'CoordinatorLayout', why: 'Coordinates scrolling between AppBar and content' },
      { type: 'AppBarLayout + Toolbar', why: 'Material Design top app bar with title' },
      { type: 'BottomNavigationView', why: '4 main destinations: Game, Stats, Leaderboard, Profile' },
      { type: 'FrameLayout (content container)', why: 'Holds main content area above BottomNav' }
    ]
  },
  {
    filename: 'activity_game.xml',
    connectedTo: 'GameActivity.java',
    description: {
      he: 'מסך משחק. GameBoardView מרכזי, mine counter, timer, FAB לדגל/חשיפה, progress bar.',
      en: 'Game screen. Central GameBoardView, mine counter, timer, FAB for flag/reveal, progress bar.',
      mix: 'Game UI. Custom GameBoardView + controls (timer, mines, FAB).'
    },
    views: [
      { type: 'GameBoardView (Custom)', why: 'Canvas-based board — extends View, onDraw + onTouchEvent' },
      { type: 'TextView (mineCounter)', why: 'Shows remaining mines = total - flags placed' },
      { type: 'TextView (timerDisplay)', why: 'Shows elapsed time, updated by ViewModel LiveData' },
      { type: 'FloatingActionButton (flagMode)', why: 'Toggle between reveal/flag mode (Control Scheme C)' },
      { type: 'ProgressBar', why: 'Shows game completion progress' }
    ]
  },
  {
    filename: 'activity_auth.xml',
    connectedTo: 'AuthActivity.java',
    description: {
      he: 'מסך כניסה/הרשמה. EditText לEmail+Password. 3 כפתורים: Email login, Google Sign-In, Anonymous.',
      en: 'Login/register screen. EditText for Email+Password. 3 buttons: Email login, Google Sign-In, Anonymous.',
      mix: 'Auth screen. 3 login buttons. Email fields. Google + Anonymous options.'
    },
    views: [
      { type: 'EditText (email)', why: 'Email input with inputType="textEmailAddress"' },
      { type: 'EditText (password)', why: 'Password input with inputType="textPassword"' },
      { type: 'Button (emailLogin)', why: 'Firebase email/password auth' },
      { type: 'SignInButton (Google)', why: 'Google One-Tap Sign-In button' },
      { type: 'Button (anonymous)', why: 'Anonymous/guest play without registration' }
    ]
  },
  {
    filename: 'activity_statistics.xml',
    connectedTo: 'StatisticsActivity.java',
    description: {
      he: 'סטטיסטיקות. ScrollView עם כרטיסים: overall, streaks, per-difficulty, advanced. 19 TextViews.',
      en: 'Statistics. ScrollView with cards: overall, streaks, per-difficulty, advanced. 19 TextViews.',
      mix: 'Stats screen. NestedScrollView + CardViews. 19 TextViews for data.'
    },
    views: [
      { type: 'NestedScrollView', why: 'All stats cards scrollable; works with AppBarLayout' },
      { type: 'CardView (Overall)', why: 'total games, wins, losses, win%' },
      { type: 'CardView (Streaks)', why: 'current streak + best streak' },
      { type: 'CardView (per-Difficulty)', why: 'Easy/Medium/Hard breakdown' },
      { type: 'TextView × 19', why: 'Each stat has its own TextView reference in Java' }
    ]
  },
  {
    filename: 'activity_leaderboard.xml',
    connectedTo: 'LeaderboardActivity.java',
    description: {
      he: 'לוח מובילים. TabLayout (Beginner/Intermediate/Expert). SwipeRefreshLayout עם RecyclerView.',
      en: 'Leaderboard. TabLayout (Beginner/Intermediate/Expert). SwipeRefreshLayout with RecyclerView.',
      mix: 'Leaderboard. 3 tabs (difficulty). SwipeRefresh + RecyclerView.'
    },
    views: [
      { type: 'TabLayout', why: '3 difficulty tabs — filters Firebase query' },
      { type: 'SwipeRefreshLayout', why: 'Pull-to-refresh triggers FirebaseManager.fetchLeaderboard()' },
      { type: 'RecyclerView', why: 'Scrollable leaderboard list with LeaderboardAdapter' }
    ]
  },
  {
    filename: 'activity_achievements.xml',
    connectedTo: 'AchievementsActivity.java',
    description: {
      he: 'הישגים. RecyclerView עם AchievementAdapter. Progress summary בכותרת.',
      en: 'Achievements. RecyclerView with AchievementAdapter. Progress summary in header.',
      mix: 'Achievements list. RecyclerView + header with X/8 count.'
    },
    views: [
      { type: 'RecyclerView', why: 'Dynamic achievement list from DB' },
      { type: 'TextView (progressSummary)', why: 'Shows "X/8 achievements unlocked"' }
    ]
  },
  {
    filename: 'activity_profile.xml',
    connectedTo: 'ProfileActivity.java',
    description: {
      he: 'פרופיל. CircleImageView לתמונה (Glide). TextViews לשם, email, stats. Edit button.',
      en: 'Profile. CircleImageView for photo (Glide). TextViews for name, email, stats. Edit button.',
      mix: 'Profile screen. CircleImageView + Glide. Edit profile button → dialog_edit_profile.'
    },
    views: [
      { type: 'CircleImageView (avatar)', why: 'Circular crop for profile photo; Glide loads URL' },
      { type: 'TextView (username, email)', why: 'User info from Firebase Auth + Firestore' },
      { type: 'Button (editProfile)', why: 'Opens dialog_edit_profile.xml' }
    ]
  },
  {
    filename: 'activity_settings.xml',
    connectedTo: 'SettingsActivity.java',
    description: {
      he: 'הגדרות. Switch views: haptics, sound, firstClickSafe, autoSync. SeekBar לvolume. RadioGroup לtheme.',
      en: 'Settings. Switch views: haptics, sound, firstClickSafe, autoSync. SeekBar for volume. RadioGroup for theme.',
      mix: 'Settings screen. Switches + SeekBar + RadioGroup. All bound to SettingsManager.'
    },
    views: [
      { type: 'SwitchCompat (haptics)', why: 'Toggle haptic feedback on/off' },
      { type: 'SwitchCompat (sound)', why: 'Toggle sound effects on/off' },
      { type: 'SeekBar (volume)', why: 'Sound volume 0-100' },
      { type: 'RadioGroup (theme)', why: 'Auto/Light/Dark theme selection' },
      { type: 'SwitchCompat (firstClickSafe)', why: 'Toggle first-click safety' }
    ]
  },
  {
    filename: 'activity_nfc.xml',
    connectedTo: 'NfcActivity.java',
    description: {
      he: 'NFC sharing. NFC animation icon. "Hold devices together" instructions. Accept button (גלוי אחרי קריאה). Simulate button לבדיקה.',
      en: 'NFC sharing. NFC animation icon. "Hold devices together" instructions. Accept button (visible after read). Simulate button for testing.',
      mix: 'NFC UI. Animation + instructions. Accept button shown after successful NFC read.'
    },
    views: [
      { type: 'ImageView (nfcAnimation)', why: 'Animated NFC icon shown while waiting' },
      { type: 'TextView (instructions)', why: '"Hold devices together to share map"' },
      { type: 'Button (acceptChallenge)', why: 'Visible only after successful NFC decode; starts game' },
      { type: 'Button (simulateNfc)', why: 'DEBUG only — simulates NFC tap without hardware' }
    ]
  },
  {
    filename: 'activity_daily_challenge.xml',
    connectedTo: 'DailyChallengeActivity.java',
    description: {
      he: 'Daily Challenge. תאריך ב-header. GameBoardView. הספירה לאחור. לוח מובילים של היום.',
      en: 'Daily Challenge. Date in header. GameBoardView. Countdown. Today\'s leaderboard.',
      mix: 'Daily Challenge UI. Date header + board + daily leaderboard section.'
    },
    views: [
      { type: 'TextView (dateDisplay)', why: 'Shows today\'s date — same as seed date' },
      { type: 'GameBoardView', why: 'Same custom view as regular game' },
      { type: 'RecyclerView (dailyLeaderboard)', why: 'Today\'s top scores from Firestore' }
    ]
  },
  {
    filename: 'activity_multiplayer_lobby.xml',
    connectedTo: 'MultiplayerLobbyActivity.java',
    description: {
      he: 'לובי Multiplayer. RecyclerView לחדרים פתוחים. Create/Join כפתורים. Real-time עדכון.',
      en: 'Multiplayer lobby. RecyclerView for open rooms. Create/Join buttons. Real-time updates.',
      mix: 'Multiplayer lobby. Create room + join room. RTDB-powered room list.'
    },
    views: [
      { type: 'RecyclerView (roomList)', why: 'Live list of open rooms from RTDB; RoomListAdapter' },
      { type: 'Button (createRoom)', why: 'Creates new room in RTDB rooms/' },
      { type: 'EditText (roomCode)', why: 'Direct room code entry for joining' }
    ]
  },
  {
    filename: 'activity_multiplayer_waiting.xml',
    connectedTo: 'MultiplayerWaitingRoomActivity.java',
    description: {
      he: 'Waiting room. מציג host + guest status. Start button (host בלבד). Real-time RTDB listener.',
      en: 'Waiting room. Shows host + guest status. Start button (host only). Real-time RTDB listener.',
      mix: 'Waiting room UI. Player status + Start button (host). RTDB ValueEventListener.'
    },
    views: [
      { type: 'TextView (hostStatus, guestStatus)', why: 'Shows connected players from RTDB' },
      { type: 'Button (startGame)', why: 'Visible to host only; starts game for both players' },
      { type: 'ProgressBar', why: 'Shown while waiting for second player' }
    ]
  },
  {
    filename: 'activity_game_history.xml',
    connectedTo: 'GameHistoryActivity.java',
    description: {
      he: 'היסטוריית משחקים. RecyclerView עם GameHistoryAdapter. Filter: All/Won/Lost.',
      en: 'Game history. RecyclerView with GameHistoryAdapter. Filter: All/Won/Lost.',
      mix: 'History list. Filter chips + RecyclerView. Room DB data.'
    },
    views: [
      { type: 'RecyclerView', why: 'Scrollable history list; GameHistoryAdapter' },
      { type: 'ChipGroup (filter)', why: 'Filter by All/Win/Loss status' }
    ]
  },
  {
    filename: 'activity_tutorial.xml',
    connectedTo: 'TutorialActivity.java',
    description: {
      he: 'Tutorial ViewPager. Dot indicators לdots progress. Next/Previous כפתורים.',
      en: 'Tutorial ViewPager. Dot indicators for progress. Next/Previous buttons.',
      mix: 'Tutorial ViewPager + dots + nav buttons.'
    },
    views: [
      { type: 'ViewPager', why: 'Swipeable tutorial steps; TutorialPagerAdapter' },
      { type: 'LinearLayout (dotIndicators)', why: 'Shows current step progress' },
      { type: 'Button (next, previous)', why: 'Navigate between steps programmatically' }
    ]
  },
  {
    filename: 'activity_patterns_tutorial.xml',
    connectedTo: 'PatternsTutorialActivity.java',
    description: {
      he: 'Patterns tutorial. Mini-boards לדוגמאות 1-1, 1-2-1, corner patterns. ScrollView.',
      en: 'Patterns tutorial. Mini-boards for 1-1, 1-2-1, corner pattern examples. ScrollView.',
      mix: 'Pattern tutorial. Static mini-boards + explanations. ScrollView.'
    },
    views: [
      { type: 'ScrollView', why: 'Multiple pattern examples scrollable' },
      { type: 'GameBoardView (mini × 3)', why: 'Shows actual pattern examples on real board' }
    ]
  },
  {
    filename: 'dialog_difficulty_selection.xml',
    connectedTo: 'DifficultySelectionDialog.java',
    description: {
      he: 'Dialog בחירת קושי. RadioGroup: Easy/Medium/Hard/Custom. EditText למימדים מותאמים. RecyclerView ל-presets.',
      en: 'Difficulty selection dialog. RadioGroup: Easy/Medium/Hard/Custom. EditText for custom dims. RecyclerView for presets.',
      mix: 'Difficulty dialog. 4 options + custom inputs + saved presets list.'
    },
    views: [
      { type: 'RadioGroup', why: '4 difficulty options; triggers EditText visibility' },
      { type: 'EditText (width, height, mines)', why: 'Custom game dimensions; validated by ValidationUtil' },
      { type: 'RecyclerView (presets)', why: 'Saved custom presets; CustomPresetsAdapter' }
    ]
  },
  {
    filename: 'dialog_edit_profile.xml',
    connectedTo: 'ProfileActivity.java',
    description: {
      he: 'Edit profile dialog. EditText לusername. ImageView לתמונה עם "Change Photo" button.',
      en: 'Edit profile dialog. EditText for username. ImageView for photo with "Change Photo" button.',
      mix: 'Profile edit dialog. Username input + photo picker button.'
    },
    views: [
      { type: 'EditText (username)', why: 'New display name; saved to Firestore users/{uid}' },
      { type: 'Button (changePhoto)', why: 'Opens gallery picker; triggers Firebase Storage upload flow' }
    ]
  },
  {
    filename: 'fragment_tutorial_step.xml',
    connectedTo: 'TutorialStepFragment.java',
    description: {
      he: 'Layout לצעד tutorial אחד. ImageView לאיור, TextView לכותרת ותיאור.',
      en: 'Layout for one tutorial step. ImageView for illustration, TextViews for title and description.',
      mix: 'Tutorial step: image + title + description.'
    },
    views: [
      { type: 'ImageView (stepImage)', why: 'Step illustration or diagram' },
      { type: 'TextView (stepTitle)', why: 'Step title text' },
      { type: 'TextView (stepDescription)', why: 'Detailed step explanation' }
    ]
  },
  {
    filename: 'fragment_interactive_tutorial.xml',
    connectedTo: 'InteractiveTutorialFragment.java',
    description: {
      he: 'Interactive tutorial fragment. Mini GameBoardView לתרגול. Hint text overlay. Success animation.',
      en: 'Interactive tutorial fragment. Mini GameBoardView for practice. Hint text overlay. Success animation.',
      mix: 'Interactive tutorial. Real mini GameBoardView + hints + success feedback.'
    },
    views: [
      { type: 'GameBoardView (mini)', why: 'Real interactive board for hands-on practice' },
      { type: 'TextView (hintText)', why: 'Contextual hints: "Click a safe cell to reveal it"' },
      { type: 'LottieAnimationView', why: 'Celebration animation on step completion' }
    ]
  },
  {
    filename: 'item_achievement.xml',
    connectedTo: 'AchievementAdapter.java',
    description: {
      he: 'Item RecyclerView להישג אחד. Icon, name, description, ProgressBar, unlocked checkmark.',
      en: 'RecyclerView item for one achievement. Icon, name, description, ProgressBar, unlocked checkmark.',
      mix: 'Achievement item: icon + name + progress + checkmark.'
    },
    views: [
      { type: 'ImageView (achievementIcon)', why: 'Achievement category icon' },
      { type: 'ProgressBar', why: 'Progress toward achievement requirement' },
      { type: 'ImageView (checkmark)', why: 'Visible when achievement unlocked=true' }
    ]
  },
  {
    filename: 'item_game_history.xml',
    connectedTo: 'GameHistoryAdapter.java',
    description: {
      he: 'Item RecyclerView למשחק בהיסטוריה. תאריך, קושי, תוצאה (WIN/LOSS), זמן, ניקוד.',
      en: 'RecyclerView item for one game in history. Date, difficulty, result (WIN/LOSS), time, score.',
      mix: 'Game history item: date + difficulty + WIN/LOSS + time + score.'
    },
    views: [
      { type: 'TextView (date, difficulty)', why: 'Game metadata' },
      { type: 'TextView (result)', why: 'WIN in green / LOSS in red (text color binding)' },
      { type: 'TextView (time, score)', why: 'Game performance stats' }
    ]
  },
  {
    filename: 'item_leaderboard_entry.xml',
    connectedTo: 'LeaderboardAdapter.java',
    description: {
      he: 'Item RecyclerView לentry בלוח מובילים. rank, playerName, score, timeTaken.',
      en: 'RecyclerView item for leaderboard entry. rank, playerName, score, timeTaken.',
      mix: 'Leaderboard item: rank # + player name + score + time.'
    },
    views: [
      { type: 'TextView (rank)', why: '#1, #2... — calculated by adapter position' },
      { type: 'TextView (playerName)', why: 'Firebase Auth displayName' },
      { type: 'TextView (score, time)', why: 'Game score and time taken' }
    ]
  },
  {
    filename: 'item_multiplayer_room.xml',
    connectedTo: 'RoomListAdapter.java',
    description: {
      he: 'Item RecyclerView לחדר Multiplayer. roomId, host name, status (waiting/full), Join button.',
      en: 'RecyclerView item for Multiplayer room. roomId, host name, status (waiting/full), Join button.',
      mix: 'Room list item: host name + status + Join button.'
    },
    views: [
      { type: 'TextView (hostName)', why: 'Room creator display name from RTDB' },
      { type: 'TextView (status)', why: '"Waiting" or "Full" based on player count' },
      { type: 'Button (join)', why: 'Join this specific room; passes roomId to WaitingRoomActivity' }
    ]
  },
  {
    filename: 'activity_base_navigation.xml',
    connectedTo: 'BaseNavigationActivity.java',
    description: {
      he: 'Base layout שכל Activity ראשי יורש. BottomNavigationView, Toolbar, content container.',
      en: 'Base layout that all main Activities inherit. BottomNavigationView, Toolbar, content container.',
      mix: 'Shared base layout. BottomNav + Toolbar. All main Activities use this.'
    },
    views: [
      { type: 'Toolbar', why: 'Shared AppBar across all main screens' },
      { type: 'BottomNavigationView', why: 'Main navigation — same across all Activities' },
      { type: 'FrameLayout (content)', why: 'Each Activity fills this with its specific content' }
    ]
  },
  {
    filename: 'content_statistics.xml',
    connectedTo: 'StatisticsActivity.java',
    description: {
      he: 'תוכן נפרד לסטטיסטיקות (included in activity_statistics.xml). מפריד layout מורכב לקובץ נפרד.',
      en: 'Separate content for statistics (included in activity_statistics.xml). Separates complex layout into its own file.',
      mix: 'Statistics content layout. Included via <include> tag in activity_statistics.xml.'
    },
    views: [
      { type: 'Included via <include>', why: 'Modular layout — complex stats content separated from activity wrapper' }
    ]
  },
  {
    filename: 'activity_login_entry.xml',
    connectedTo: 'AuthActivity.java (entry screen)',
    description: {
      he: 'מסך כניסה ראשוני עם logo ו-"Continue" button לפני AuthActivity.',
      en: 'Initial entry screen with logo and "Continue" button before AuthActivity.',
      mix: 'Splash/entry screen before auth. Logo + CTA button.'
    },
    views: [
      { type: 'ImageView (logo)', why: 'App logo on entry screen' },
      { type: 'Button (getStarted)', why: 'Navigates to AuthActivity or main if already signed in' }
    ]
  }
];

// Append classes + layouts into SEARCH_INDEX after all arrays defined
SEARCH_INDEX.push(
  ...CLASSES.map(c => ({
    type: 'מחלקה',
    title: c.name + ' (' + c.package + ')',
    snippet: (typeof c.purpose === 'string' ? c.purpose : c.purpose.he).substring(0, 100),
    url: 'code.html#class-' + c.name.replace('.java','').toLowerCase(),
    navIdx: null
  })),
  ...XML_LAYOUTS.map(l => ({
    type: 'Layout',
    title: l.filename + ' → ' + l.connectedTo,
    snippet: (typeof l.description === 'string' ? l.description : l.description.he).substring(0, 100),
    url: 'architecture.html#layouts',
    navIdx: null
  }))
);
