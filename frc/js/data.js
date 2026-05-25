'use strict';
/* ============================================================
   frc/js/data.js — Single source of truth for FRC #5135 study content.
   Robot: Black Unicorns #5135, 2025 season.
   ============================================================ */

const LANG_LABELS = { he: 'עב', en: 'EN', mix: 'MIX' };

const LANG = {
  'mode.flip':  { he: '🔄 הפוך',        en: '🔄 Flip',        mix: '🔄 Flip' },
  'mode.learn': { he: '📖 למד',          en: '📖 Learn',       mix: '📖 Learn' },
  'mode.match': { he: '🎯 התאם',         en: '🎯 Match',       mix: '🎯 Match' },
  'mode.tf':    { he: '✅ נכון/שגוי',    en: '✅ True/False',  mix: '✅ T/F' },
  'mode.write': { he: '✍️ כתיבה',        en: '✍️ Write',       mix: '✍️ Write' },
  'fc.flip-hint':  { he: 'לחץ להפוך',    en: 'Click to flip',  mix: 'Click to flip' },
  'fc.swipe-hint': {
    he: '← החלק ימינה לכרטיס הבא | שמאלה לקודם →',
    en: '← Swipe right for next | left for prev →',
    mix: '← Swipe right for next | שמאלה לקודם →'
  },
  'btn.mark-seen': { he: '✓ סמן כנראה',  en: '✓ Mark seen',    mix: '✓ Mark seen' },
  'btn.seen':      { he: '✓ נראה',        en: '✓ Seen',         mix: '✓ Seen' },
  'btn.reset-seen':{ he: '🔄 אפס',        en: '🔄 Reset',       mix: '🔄 Reset' },
  'btn.show-ans':  { he: '👁️ הצג תשובה', en: '👁️ Show answer', mix: '👁️ Show answer' },
  'btn.knew-it':   { he: '✅ ידעתי',      en: '✅ Got it',      mix: '✅ Got it' },
  'btn.again':     { he: '🔁 עוד פעם',   en: '🔁 Again',       mix: '🔁 Again' },
  'fc.prev':       { he: '→ הקודם',       en: '← Prev',         mix: '← Prev' },
  'fc.next':       { he: 'הבא ←',         en: 'Next →',         mix: 'Next →' },
  'write.placeholder': { he: 'כתוב את התשובה...', en: 'Type the answer...', mix: 'Type the answer...' },
  'write.check':       { he: '✓ בדוק',   en: '✓ Check',        mix: '✓ Check' },
  'tf.true-btn':  { he: '✅ נכון',        en: '✅ True',         mix: '✅ True' },
  'tf.false-btn': { he: '❌ שגוי',        en: '❌ False',        mix: '❌ False' },
};

if (typeof getLang === 'undefined') {
  var getLang = function() { return localStorage.getItem('frc_lang') || 'he'; };
}
if (typeof t === 'undefined') {
  var t = function(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const l = getLang();
    return obj[l] || obj.he || obj.en || '';
  };
}

// ----------------------------------------------------------------
// FLASHCARDS (55 cards — covers all accordion sections + quiz Qs)
// ----------------------------------------------------------------
const FLASHCARDS = [
  // ---- מרכב / Drivetrain ----
  {
    q: { he: 'מה Swerve Drive ומה היתרון שלו?', en: 'What is Swerve Drive and its advantage?', mix: 'Swerve Drive — מה היתרון?' },
    a: { he: '4 מודולות עצמאיות, כל אחת עם 2 מנועים (כיוון + הנעה). הרובוט נע לכל כיוון ללא סיבוב הגוף — holonomic motion.', en: '4 independent modules, each with 2 motors (steer + drive). Robot moves in any direction without rotating — holonomic motion.', mix: '4 modules: steer + drive each. Holonomic motion — כל כיוון ללא סיבוב.' }
  },
  {
    q: { he: 'מה יחס ההעברה של המרכב ומה המשמעות?', en: 'What is the drivetrain gear ratio and what does it mean?', mix: 'Drivetrain gear ratio — מה המשמעות?' },
    a: { he: '1:5.9 — מנוע Talon FX (Falcon) 6380 RPM → פלט ~1080 RPM. מהיר מספיק לחצות המגרש ולקצר זמני ביצוע.', en: '1:5.9 — Talon FX (Falcon) at 6380 RPM → ~1080 RPM output. Fast enough to cross the field quickly.', mix: '1:5.9, Falcon 6380 RPM → ~1080 RPM output. מהיר לחצות שדה.' }
  },
  {
    q: { he: 'מה Field-Oriented Control (FOC)?', en: 'What is Field-Oriented Control (FOC)?', mix: 'FOC — Field Oriented Control?' },
    a: { he: '"קדימה" תמיד לכיוון המגרש ללא קשר לסיבוב הרובוט. מממשים ע"י חיסור זווית הג\'יירו מוקטור המהירות.', en: '"Forward" always toward the field regardless of robot rotation. Implemented by subtracting gyro angle from velocity vector.', mix: 'Forward = field direction, לא כיוון הרובוט. Gyro subtraction.' }
  },
  {
    q: { he: 'מה Odometry ב-FRC ומה חיסרונה?', en: 'What is FRC Odometry and its drawback?', mix: 'Odometry — מה חיסרון?' },
    a: { he: 'מעקב מיקום הרובוט (x, y, heading) ע"י אינטגרציה של מהירות גלגלים + gyro. חיסרון: drift מצטבר לאורך זמן — מטעה לאחר 30+ שניות.', en: 'Tracks robot position (x, y, heading) by integrating wheel speeds + gyro. Drawback: cumulative drift over time — unreliable after 30+ seconds.', mix: 'אינטגרציה של encoders + gyro. Drift מצטבר = חיסרון.' }
  },
  {
    q: { he: 'מה Kalman Filter עושה במערכת הניווט?', en: 'What does Kalman Filter do in navigation?', mix: 'Kalman Filter — מה עושה?' },
    a: { he: 'ממזג אודומטריה + Vision לאומדן מדויק יותר משניהם לחוד. אודומטריה: ±5 ס"מ, Vision: ±2 ס"מ, Kalman: ±1.5 ס"מ.', en: 'Merges odometry + vision for a more accurate estimate than either alone. Odometry: ±5 cm, Vision: ±2 cm, Kalman: ±1.5 cm.', mix: 'Kalman = ממוצע משוכלל (Odometry ±5cm + Vision ±2cm) → ±1.5cm.' }
  },
  {
    q: { he: 'מה מגבלות תאוצה ב-Swerve ולמה חשובות?', en: 'What are Swerve acceleration limits and why important?', mix: 'Acceleration limits — למה חשוב?' },
    a: { he: 'מונעות החלקת גלגלים (wheel slip). יתרונות: נסיעה חלקה יותר, אודומטריה מדויקת יותר, שליטת נהג טובה יותר.', en: 'Prevent wheel slip. Benefits: smoother driving, more accurate odometry, better driver control.', mix: 'Prevent wheel slip → smoother + better odometry.' }
  },
  // ---- מגלול / Intake ----
  {
    q: { he: 'מה מנגנון Four-bar ולמה בחרנו בו לאינטייק?', en: 'What is the Four-bar mechanism and why use it for intake?', mix: 'Four-bar — למה לאינטייק?' },
    a: { he: 'מבוסס ציר סיבוב, לא תנועה ליניארית קשיחה. בעת התנגשות "בורח" כלפי מעלה ולא נשבר, וחוזר מיד לפעולה.', en: 'Pivot-based, not rigid linear motion. On collision it "escapes" upward without breaking, then returns immediately.', mix: 'Pivot-based — בעת פגיעה "בורח" ולא נשבר. חוזר מיד.' }
  },
  {
    q: { he: 'למה דפנות האינטייק עשויות פוליקרבונט ולא אלומיניום?', en: 'Why polycarbonate intake walls instead of aluminum?', mix: 'Polycarbonate vs aluminum — למה?' },
    a: { he: 'פוליקרבונט מתגמש בספיגת מכה וחוזר לצורתו — לא מתכופף לצמיתות. גם קל יותר מאלומיניום → תנועה מהירה + מרכז כובד נמוך.', en: 'Polycarbonate flexes on impact and returns to shape — unlike aluminum which bends permanently. Also lighter → faster movement + lower CoG.', mix: 'מתגמש + חוזר (≠ אלומיניום). קל יותר → CoG נמוך.' }
  },
  {
    q: { he: 'מה "ציר חורו" ומה תפקיד המיסבים הפנימיים?', en: 'What is the "churro" axle and role of internal bearings?', mix: 'Churro axle + internal bearings — מה תפקיד?' },
    a: { he: 'צינור אלומיניום משושה (churro) — קל וחזק. מיסבים פנימיים נכנסים לפעולה רק תחת לחץ → סיבוב חלק גם תחת עומס מלא.', en: 'Hexagonal aluminum tube (churro) — light and strong. Internal bearings engage only under load → smooth rotation even under full load.', mix: 'Churro = hexagonal Al tube. Bearings engage under load → smooth always.' }
  },
  // ---- הופר / Hopper ----
  {
    q: { he: 'מה 4 שלבי פעולת ההופר?', en: 'What are the 4 hopper operation stages?', mix: '4 שלבי ההופר?' },
    a: { he: '① איסוף מהאינטייק → ② מסוע שיפוע → ③ גלגלי מקאנום למירכוז → ④ הזנה מדויקת לקלע.', en: '① Collect from intake → ② inclined conveyor → ③ mecanum wheels to center → ④ precise feed to shooter.', mix: 'Intake → Conveyor → Mecanum center → Shooter feed.' }
  },
  {
    q: { he: 'איך גלגלי מקאנום מרכזים את הכדור?', en: 'How do mecanum wheels center the ball?', mix: 'Mecanum wheels — איך מרכזים?' },
    a: { he: 'רולים בזווית 45° יוצרים מרכיב כוח צדי. שתי שורות משני צידי ההופר מושכות הכדור לאמצע — מגיע מיושר לקלע.', en: '45° rollers create lateral force component. Two rows on each side pull ball to center — arrives aligned to shooter.', mix: '45° rollers → lateral force. Two rows → מרכזים כדור.' }
  },
  {
    q: { he: 'מה מנגנון ההרחבה בהופר?', en: 'What is the hopper expansion mechanism?', mix: 'Hopper expansion — מה זה?' },
    a: { he: 'הקיר הקדמי של ההופר נפתח כלפי חוץ, מגדיל הנפח לאחסון כדורים נוספים בבת אחת. שימושי לאיסוף מהיר.', en: 'The front wall opens outward, increasing volume for more balls at once. Useful for fast collection.', mix: 'Front wall opens out → more storage volume. For fast collection.' }
  },
  // ---- קלע / Shooter ----
  {
    q: { he: 'מה תפקיד ה-Hood בקלע?', en: 'What is the Hood\'s role in the shooter?', mix: 'Hood — מה תפקיד?' },
    a: { he: 'מסלול עליון מתכוונן שקובע את זווית יציאת הכדור. שינוי זווית Hood → ירי מכל מרחק ללא שינוי מהירות גלגלים.', en: 'Adjustable upper guide that controls ball exit angle. Changing Hood angle → shoot from any distance without changing wheel speed.', mix: 'Hood = adjustable upper guide. שולט בזווית היציאה.' }
  },
  {
    q: { he: 'אילו כוחות הסימולציה הפיזיקלית מתחשבת בהם?', en: 'What forces does the physics simulation account for?', mix: 'Physics simulation — אילו כוחות?' },
    a: { he: 'כוח כבידה (g), חיכוך אוויר, כוח מגנוס — כדור מסתובב יוצר הפרש לחץ שמשנה את מסלולו.', en: 'Gravity (g), air friction, Magnus force — spinning ball creates pressure difference that curves its path.', mix: 'Gravity + air friction + Magnus force (ball spin = path curve).' }
  },
  {
    q: { he: 'איך "ירי בתנועה" עובד אלגוריתמית?', en: 'How does "shoot on the move" work algorithmically?', mix: 'Shoot on the move — האלגוריתם?' },
    a: { he: 'מפרקים מהירות הרובוט → מחשבים זמן תעופה → סטייה צדדית מהמהירות הצדית → מוסיפים לנקודת הירי. חוזרים עד התכנסות.', en: 'Decompose robot velocity → calculate flight time → lateral drift from side velocity → add to aim point. Iterate until convergence.', mix: 'Velocity decompose → flight time → drift → aim correction. Iterate.' }
  },
  {
    q: { he: 'מה "הפתרון האופטימלי" בסימולציה?', en: 'What is the "optimal solution" in the simulation?', mix: 'Optimal solution בסימולציה?' },
    a: { he: 'הפתרון שהכדור עמיד לשגיאות — גם אם זווית מחטיאה ב-1° הכדור עדיין נכנס. נשמר בקוד, אינטרפולציה כפולה לפי מרחק + מהירות.', en: 'Solution where ball tolerates errors — even if angle is off by 1° ball still enters. Stored in code, double interpolation by distance + speed.', mix: 'Error-tolerant: 1° off = עדיין נכנס. Double interpolation.' }
  },
  // ---- טיפוס / Climber ----
  {
    q: { he: 'מהו יחס התמסורת הכולל של הטיפוס?', en: 'What is the total gear ratio of the climber?', mix: 'Climber gear ratio?' },
    a: { he: '1:64 = ראצ\'ט 1:32 × שרשרת #35 (9:18) 1:2 × שרשרת (10:10) 1:1. מגביר טורק פי 64 להרמת ~50 ק"ג.', en: '1:64 = ratchet 1:32 × chain #35 (9:18) 1:2 × chain (10:10) 1:1. Multiplies torque ×64 to lift ~50 kg.', mix: '1:64 = 1:32 × 1:2 × 1:1. Torque ×64, הרמת 50 ק"ג.' }
  },
  {
    q: { he: 'מה תפקיד הראצ\'ט במעלית?', en: 'What is the ratchet\'s role in the climber?', mix: 'Ratchet — מה תפקיד?' },
    a: { he: 'מנגנון מכני שמונע ירידת המעלית ללא כוח מנוע. לא צריך להחזיק בכוח מנוע את משקל הרובוט כל הזמן.', en: 'Mechanical mechanism preventing climber descent without motor power. No need to hold robot weight with motor force continuously.', mix: 'Ratchet = mechanical lock. Motor לא צריך להחזיק משקל.' }
  },
  {
    q: { he: 'למה עברנו ממעלית כפולה לפרופיל יחיד?', en: 'Why switch from double to single climber profile?', mix: 'Double → single profile — למה?' },
    a: { he: 'כדי להוריד 3.5 ק"ג ממשקל הרובוט. פרופיל אחד 40×40 מ"מ מספיק לתמוך בטיפוס.', en: 'To remove 3.5 kg from robot weight. A single 40×40 mm profile is sufficient for climbing.', mix: 'Saved 3.5 kg. Single 40×40 mm profile מספיק.' }
  },
  {
    q: { he: 'מה מנגנון "Wear-In" במעלית?', en: 'What is the "Wear-In" mechanism in the climber?', mix: 'Wear-In — מה זה?' },
    a: { he: 'מיסבים שוחקים הפרופיל ±0.005 מ"מ עד שיתאים מושלם. בניגוד ל-"Wear-Out" — המעלית רק משתפרת עם השימוש.', en: 'Bearings wear the profile ±0.005 mm to perfect fit. Unlike "wear-out" — the climber only improves with use.', mix: '±0.005 mm wear → perfect fit. Gets better ≠ worse.' }
  },
  // ---- תוכנה / Software ----
  {
    q: { he: 'מה FSM (Finite State Machine)?', en: 'What is an FSM (Finite State Machine)?', mix: 'FSM — מה זה?' },
    a: { he: 'מערכת שמגדירה מצבים מוגדרים ומעברים ביניהם לפי תנאים. הרובוט תמיד נמצא במצב אחד ידוע. מונע "מצב לא ידוע".', en: 'System defining specific states and transitions between them based on conditions. Robot always in one known state. Prevents "unknown state".', mix: 'מצבים מוגדרים + מעברים. תמיד מצב ידוע אחד.' }
  },
  {
    q: { he: 'מה הבדל PID לבין PID + Feedforward?', en: 'What is the difference: PID vs PID + Feedforward?', mix: 'PID vs PID + Feedforward?' },
    a: { he: 'PID מתקן שגיאות (P=שגיאה, I=מצבר, D=שיעור שינוי). Feedforward = חישוב כוח לפי פיזיקה מראש. ביחד = שליטה מהירה ומדויקת.', en: 'PID corrects errors (P=error, I=accumulator, D=rate of change). Feedforward = proactive force from physics. Together = fast and accurate control.', mix: 'PID = תיקון שגיאה. FF = ניחוש פיזיקלי. ביחד = מהיר + מדויק.' }
  },
  {
    q: { he: 'מה SolvePnP ואיך הוא מספק Pose?', en: 'What is SolvePnP and how does it provide Pose?', mix: 'SolvePnP — מה עושה?' },
    a: { he: 'אלגוריתם שמחשב מיקום המצלמה ב-3D מתוך מיקום AprilTag בתמונה. מספק Pose מוחלט (ללא drift מצטבר).', en: 'Algorithm computing camera position in 3D from AprilTag position in image. Provides absolute Pose (no cumulative drift).', mix: 'AprilTag position in image → 3D Pose מוחלט. ללא drift.' }
  },
  {
    q: { he: 'מה IO Separation Pattern בתוכנה?', en: 'What is the IO Separation Pattern in software?', mix: 'IO Pattern — מה זה?' },
    a: { he: 'הפרדת ממשק (IO) מהלוגיקה. אותו קוד עובד לסימולציה ולרובוט אמיתי. מאפשר לבדוק ולתקן לוגיקה לפני שנוגעים ברובוט.', en: 'Separating IO interface from logic. Same code works for simulation and real robot. Allows testing logic before touching the robot.', mix: 'IO interface פרוד מ-logic. Simulation + real robot = same code.' }
  },
  {
    q: { he: 'מה "שידור חוזר" ב-AdvantageKit?', en: 'What is "replay" in AdvantageKit?', mix: 'AdvantageKit replay — מה זה?' },
    a: { he: 'הקלטת כל ערכי IO מהמשחק → ניתוח בעיות לאחר מכן. ניתן לשחזר תנאי המשחק בסימולציה ולאתר באגים.', en: 'Records all IO values from the match → analyze issues afterward. Can replay match conditions in simulation to find bugs.', mix: 'הקלטת IO → replay בסימולציה. Debug after match.' }
  },
  // ---- תיאוריה / Theory ----
  {
    q: { he: 'איך עובד מנוע DC Brushed?', en: 'How does a Brushed DC motor work?', mix: 'Brushed DC motor — איך עובד?' },
    a: { he: 'קומוטטור + מברשות פחם מחליפים כיוון הזרם כל חצי סיבוב. בעיה: מברשות מתבלות, ניצוצות, יעילות ~75–80%.', en: 'Commutator + carbon brushes switch current direction every half rotation. Drawback: brushes wear, sparks, efficiency ~75–80%.', mix: 'Commutator + brushes → switch current. יעיל 75–80%.' }
  },
  {
    q: { he: 'מה היתרון של מנוע Brushless?', en: 'What is the advantage of a Brushless motor?', mix: 'Brushless advantage?' },
    a: { he: 'קומוטציה אלקטרונית (בקר + Hall Effect). ללא מברשות → יעיל ~90–95%, תחזוקה מינימלית, כוח/משקל גבוה.', en: 'Electronic commutation (controller + Hall Effect). No brushes → ~90–95% efficiency, minimal maintenance, high power/weight.', mix: 'Electronic commutation. 90–95% efficient, minimal maintenance.' }
  },
  {
    q: { he: 'מה PWM Duty Cycle?', en: 'What is PWM Duty Cycle?', mix: 'PWM Duty Cycle?' },
    a: { he: 'אחוז זמן שהאות במצב ON. 75% = האות גבוה 3/4 מהזמן. חוסך אנרגיה לעומת רזיסטור (שיבזבז אנרגיה כחום).', en: 'Percentage of time signal is ON. 75% = signal high for 3/4 of time. Saves energy vs resistor (which wastes energy as heat).', mix: 'Duty Cycle = זמן ON / זמן כולל × 100%. 75% = 3/4 time ON.' }
  },
  {
    q: { he: 'מה H-Bridge ואיך שולט בכיוון המנוע?', en: 'What is an H-Bridge and how does it control motor direction?', mix: 'H-Bridge — איך עובד?' },
    a: { he: '4 מפסקים: S1+S4 סגורים → זרם קדימה. S2+S3 סגורים → זרם אחורה. PWM + H-Bridge = שליטה מלאה על מהירות וכיוון.', en: '4 switches: S1+S4 closed → forward current. S2+S3 closed → reverse current. PWM + H-Bridge = full speed + direction control.', mix: 'S1+S4 = forward, S2+S3 = reverse. PWM + H-Bridge = full control.' }
  },
  {
    q: { he: 'מה תמסורת N:1 עושה?', en: 'What does an N:1 gear reduction do?', mix: 'Gear ratio N:1 — מה עושה?' },
    a: { he: 'מגביר טורק פי N, מפחית מהירות פי N. מרכב 1:5.9 (מהיר), טיפוס 1:64 (טורק עצום להרמה).', en: 'Multiplies torque ×N, reduces speed ÷N. Drivetrain 1:5.9 (fast), climber 1:64 (huge torque for lifting).', mix: 'טורק ×N, מהירות ÷N. Drive 1:5.9 (מהיר), Climb 1:64 (חזק).' }
  },
  {
    q: { he: 'מה CANbus ולמה עדיף על PWM?', en: 'What is CANbus and why is it better than PWM?', mix: 'CANbus vs PWM — למה עדיף?' },
    a: { he: 'רשת 2 חוטים לכל בקרי המנוע. תקשורת דו-כיוונית: ניטור זרם/מתח/טמפ\' + אבחון. PWM = חוט נפרד לכל רכיב, ללא ניטור.', en: '2-wire network for all motor controllers. Bidirectional: monitor current/voltage/temp + diagnostics. PWM = separate wire per device, no feedback.', mix: '2 wires, bidirectional. Monitoring + diagnostics. PWM = חד-כיווני, no feedback.' }
  },
  // ---- מהמבחן / From Quiz Qs ----
  {
    q: { he: 'מה פרופילי השלדה של הרובוט?', en: 'What are the robot frame profiles?', mix: 'Frame profiles?' },
    a: { he: 'פרופילי אלומיניום 50×25 מ"מ בתצורה מלבנית. עמידות להתנגשויות + משקל נמוך. מודולות קדמיות סובבו 90° לפנות מקום לאינטייק.', en: '50×25 mm aluminum profiles in rectangular configuration. Collision-resistant + low weight. Front modules rotated 90° to make room for intake.', mix: '50×25 mm Al profiles, מלבן. Front modules סובבו 90°.' }
  },
  {
    q: { he: 'מה AprilTags ב-FRC ואיך עוזרים לניווט?', en: 'What are AprilTags in FRC and how do they help navigation?', mix: 'AprilTags — מה תפקיד?' },
    a: { he: 'מדבקות 2D fiducial markers על השדה, כל אחת עם ID ייחודי + מיקום ידוע. SolvePnP מחשב Pose 6DOF → מיקום מוחלט ברחבי השדה.', en: '2D fiducial marker stickers on field, each with unique ID + known position. SolvePnP computes 6DOF Pose → absolute position across the field.', mix: 'Fiducial markers, ID + known position → SolvePnP → 6DOF Pose.' }
  },
  {
    q: { he: 'מה אמינות Vision נמדדת לפי?', en: 'What factors measure Vision reliability?', mix: 'Vision reliability — נמדדת לפי?' },
    a: { he: 'מרחק מה-AprilTag, כמות AprilTags בתמונה, מרחק מהשוליים (שוליים = יותר עיוות). Kalman מתחשב בציון האמינות.', en: 'Distance from AprilTag, number of tags in view, distance from image edges (edges = more distortion). Kalman weights by reliability score.', mix: 'מרחק מטאג + כמות טאגים + מרחק משוליים → reliability score.' }
  },
  {
    q: { he: 'כמה שחקנים בקבוצה — Driver ו-Operator — ומה כל אחד שולט?', en: 'Driver vs Operator — what does each control?', mix: 'Driver vs Operator roles?' },
    a: { he: 'Driver (QX7 FrSky — שלט רחפן): נסיעה, FOC, מהירות מקס. Operator (Xbox): אינטייק, ירי, עמדות קלע, טיפוס.', en: 'Driver (FrSky QX7 — drone controller): driving, FOC, max speed. Operator (Xbox): intake, shooting, shooter positions, climbing.', mix: 'Driver = QX7 (נסיעה + FOC). Operator = Xbox (ירי, אינטייק, טיפוס).' }
  },
  // ---- מרכז כובד / CoG ----
  {
    q: { he: 'מה מרכז כובד ולמה כדאי להנמיך אותו?', en: 'What is center of gravity and why lower it?', mix: 'CoG — למה להנמיך?' },
    a: { he: 'נקודה שבה כל מסת הרובוט "מרוכזת" תיאורטית. CoG גבוה = מומנט גדול יותר → קל יותר להפיל. CoG נמוך = יציבות גבוהה.', en: 'Point where all robot mass is theoretically concentrated. Higher CoG = larger moment → easier to tip. Lower CoG = more stability.', mix: 'CoG = מרכז מסה. גבוה = מומנט גדול = קל להפיל. נמוך = יציב.' }
  },
  {
    q: { he: 'מה מומנט כוח וקשרו לרובוט?', en: 'What is moment of force and its relation to the robot?', mix: 'Moment of force — קשר לרובוט?' },
    a: { he: 'מומנט = מרחק מציר × כוח. CoG גבוה → מרחק גדול יותר → מומנט גדול יותר = הפלה קלה. לכן משקל כבד בתחתית + קל בחלק העליון.', en: 'Moment = distance from pivot × force. High CoG → larger distance → larger moment = easy tip. Heavy at base, light at top.', mix: 'Moment = distance × force. CoG גבוה → מומנט גדול → יציבות נמוכה.' }
  },
  // ---- גלגלים ומרכב / Drivetrain theory ----
  {
    q: { he: 'מה ההבדל בין בסיס גלגלים רחב לצר?', en: 'Wide vs narrow wheelbase — what is the trade-off?', mix: 'Wheelbase: רחב vs צר?' },
    a: { he: 'רחב → יציב יותר, פחות זריז. צר → זריז יותר, פחות יציב. לא ניתן לקבל שניהם — trade-off בין יציבות לתמרון.', en: 'Wide → more stable, less maneuverable. Narrow → more maneuverable, less stable. Cannot have both — stability vs maneuverability trade-off.', mix: 'Wider = stable, Narrower = maneuverable. Trade-off — cannot have both.' }
  },
  // ---- בקרה / Control theory ----
  {
    q: { he: 'מה הבדל Open-Loop ל-Closed-Loop?', en: 'Open-loop vs Closed-loop control — what is the difference?', mix: 'Open-loop vs Closed-loop?' },
    a: { he: 'Open-loop: פקודה ← אין משוב, לא יודע מה קרה. Closed-loop: פקודה + חיישן → משווה מצב נוכחי למטרה → מתקן. PID = closed-loop.', en: 'Open-loop: command with no feedback, does not know what happened. Closed-loop: command + sensor → compare current to target → correct. PID = closed-loop.', mix: 'Open = no feedback. Closed = sensor + correction. PID = closed-loop.' }
  },
  // ---- אלקטרוניקה / Electronics ----
  {
    q: { he: 'מה PDH ומה תפקידו?', en: 'What is the PDH and its role?', mix: 'PDH — מה תפקיד?' },
    a: { he: 'Power Distribution Hub — 18 ערוצים עם פיוזים (15A/30A/40A). מחלק חשמל לכל רכיבי הרובוט, ניטור זרם בזמן אמת דרך CAN.', en: 'Power Distribution Hub — 18 channels with fuses (15A/30A/40A). Distributes power to all robot components, real-time current monitoring via CAN.', mix: 'PDH: 18 channels, fuses 15/30/40A, real-time CAN monitoring.' }
  },
  {
    q: { he: 'מה סוג הסוללה בFRC ומה הנתונים שלה?', en: 'What battery type is used in FRC and what are its specs?', mix: 'FRC battery specs?' },
    a: { he: 'SLA (Sealed Lead Acid) — 12V, 18Ah. 6 תאים × ~2.1V. לא ניתן לשנות — לפי תקנות FRC. יש לטעון לפני כל משחק.', en: 'SLA (Sealed Lead Acid) — 12V, 18Ah. 6 cells × ~2.1V. Cannot be changed — FRC rules. Must charge before each match.', mix: 'SLA 12V 18Ah, 6 cells × 2.1V. FRC mandatory.' }
  },
  // ---- REBUILT — שדה, מפרט, מנועים ----
  {
    q: { he: 'מה ה-BUMP ואיזה אילוץ הוא מטיל על עיצוב הרובוט?', en: 'What is the BUMP and what design constraint does it impose?', mix: 'BUMP — אילוץ עיצובי?' },
    a: { he: 'רמפה 1854 ס"מ רוחב, 16.54 ס"מ גובה, זווית 15° בכל צד. הרובוט חייב CoG נמוך ושלד יציב כדי לעבור ללא היפוך.', en: 'Ramp 1854 cm wide, 16.54 cm high, 15° on each side. Robot needs low CoG and stable frame to cross without tipping.', mix: 'BUMP: 16.54 ס"מ גובה, 15°. Low CoG = חובה.' }
  },
  {
    q: { he: 'מה יחס זרוע פריסת האינטייק ולמה דווקא 1:96?', en: 'What is the intake deploy arm gear ratio and why 1:96?', mix: 'Intake deploy ratio — למה 1:96?' },
    a: { he: '1:96 — נותן טורק גבוה לשמירה על הזרוע פרוסה ללא בלימה חשמלית מתמדת, מונע התחממות המנוע.', en: '1:96 — gives high torque to hold the arm extended without constant electrical braking, preventing motor overheating.', mix: '1:96: hold arm without braking → no overheating.' }
  },
  {
    q: { he: 'למה החלפנו לוחות הוד מפלדה לאלומיניום?', en: 'Why did we switch hood plates from steel to aluminum?', mix: 'Hood plates: steel → aluminum — למה?' },
    a: { he: 'הוד נמצא בחלק עליון. פלדה כבדה גבוה → CoG גבוה. אלומיניום קל → CoG יורד → יציבות משתפרת בתנועה מהירה.', en: 'Hood is high up. Heavy steel = high CoG. Aluminum is lighter → lower CoG → better stability at speed.', mix: 'Hood = גבוה. פלדה = CoG גבוה → אלומיניום = CoG נמוך.' }
  },
  {
    q: { he: 'מה החולשה התרמית של NEO 550?', en: 'What is the thermal weakness of NEO 550?', mix: 'NEO 550 thermal weakness?' },
    a: { he: 'מסה תרמית נמוכה מאוד. בעת stall כוח הופך לחום ואין מספיק מסה לספיגה → שריפה מהירה. להימנע מ-stall ממושך.', en: 'Very low thermal mass. During stall power becomes heat with no mass to absorb it → burns fast. Avoid prolonged stall.', mix: 'Low thermal mass → stall = שריפה מהירה.' }
  },
  {
    q: { he: 'מה גובה מרכז הכובד שהשגנו ומה הייתה האסטרטגיה העיקרית?', en: 'What CoM height did we achieve and what was the main strategy?', mix: 'CoM height + main strategy?' },
    a: { he: '~16.4 ס"מ מהרצפה. אסטרטגיה עיקרית: שקיעת הסוללה (הרכיב הכבד ביותר) לתוך מרכז השלד בגובה הנמוך ביותר.', en: '~16.4 cm from ground. Main strategy: sinking the battery (heaviest component) into the center of the frame at the lowest possible height.', mix: '~16.4 ס"מ. Battery sunk into frame center = main strategy.' }
  },
  {
    q: { he: 'מה ההבדל העיקרי ביעילות בין מנוע Brushed ל-Brushless?', en: 'What is the main efficiency difference between brushed and brushless motors?', mix: 'Brushed vs Brushless — יעילות?' },
    a: { he: 'Brushed: 75–80% (אנרגיה אבודה בחיכוך פחמים + ניצוצות). Brushless: 90–95% — קומוטציה אלקטרונית, ללא בלאי מכני.', en: 'Brushed: 75–80% efficient (energy lost to brush friction + sparks). Brushless: 90–95% — electronic commutation, no mechanical wear.', mix: 'Brushed: 75–80%. Brushless: 90–95%. No friction = higher efficiency.' }
  },
  // ---- מפרט רובוט / Robot Specs ----
  {
    q: { he: 'מה ממדי הרובוט ומשקלו, ומה מגבלות FRC?', en: 'What are the robot dimensions and weight, and what are the FRC limits?', mix: 'Robot dimensions + FRC limits?' },
    a: { he: '67.5×72×74 ס"מ, 51.85 ק"ג. מגבלות FRC: היקף ≤279.4 ס"מ, גובה ≤76.2 ס"מ, משקל ≤56.2 ק"ג.', en: '67.5×72×74 cm, 51.85 kg. FRC limits: perimeter ≤279.4 cm, height ≤76.2 cm, weight ≤56.2 kg.', mix: '67.5×72×74cm, 51.85kg. FRC: perimeter ≤279.4cm, height ≤76.2cm, weight ≤56.2kg.' }
  },
  // ---- שדה REBUILD / Game Field ----
  {
    q: { he: 'מה ממדי שדה REBUILD, ה-HUB וה-TOWER?', en: 'What are REBUILD field dimensions, HUB, and TOWER?', mix: 'REBUILD field + HUB + TOWER?' },
    a: { he: 'שדה: 807×1645 ס"מ. HUB: 119×119 ס"מ, פתח משושה 183 ס"מ, 1 נק\' לכל FUEL. TOWER: L1=68.55 ס"מ (10/15 נק\'), L2=114.3 ס"מ (20 נק\'), L3=160 ס"מ (30 נק\'). TRENCH פינוי 56.52 ס"מ.', en: 'Field: 807×1645 cm. HUB: 119×119 cm, hex opening 183 cm, 1 pt per FUEL. TOWER: L1=68.55 cm (10/15 pts), L2=114.3 cm (20 pts), L3=160 cm (30 pts). TRENCH clearance 56.52 cm.', mix: 'Field 807×1645cm. HUB 119×119cm, hex 183cm, 1pt/FUEL. Tower L1/L2/L3=10/20/30pts. TRENCH 56.52cm.' }
  },
  {
    q: { he: 'מה FUEL ב-REBUILD ומה 5 תפקידי צוות הנהגים?', en: 'What is FUEL in REBUILD and what are the 5 drive team roles?', mix: 'FUEL + drive team roles?' },
    a: { he: 'FUEL: כדור קצף 15 ס"מ, 203–227 גרם. צוות: Driver, Operator, Coach, Human Player, Technician. הפרות: Minor=5 נק\', Major=15 נק\'.', en: 'FUEL: foam ball 15 cm, 203–227 g. Team: Driver, Operator, Coach, Human Player, Technician. Violations: Minor=5 pts, Major=15 pts.', mix: 'FUEL: foam 15cm, 203-227g. Team: Driver/Operator/Coach/Human Player/Technician. Minor=5, Major=15pts.' }
  },
  // ---- מפרט מנועים / Motor Specs ----
  {
    q: { he: 'מה המפרט של NEO, NEO 550 ו-Falcon 500?', en: 'What are the specs of NEO, NEO 550, and Falcon 500?', mix: 'NEO / NEO550 / Falcon specs?' },
    a: { he: 'NEO: 5676 RPM, 2.6 Nm, 105A שיא. NEO 550: 11000 RPM, 0.97 Nm, 100A שיא — מסה תרמית נמוכה, stall = שריפה. Falcon 500: 6380 RPM, 4.69 Nm, 257A שיא.', en: 'NEO: 5676 RPM, 2.6 Nm, 105A stall. NEO 550: 11000 RPM, 0.97 Nm, 100A stall — low thermal mass, stall = burns. Falcon 500: 6380 RPM, 4.69 Nm, 257A stall.', mix: 'NEO: 5676RPM/2.6Nm/105A. NEO550: 11000RPM/0.97Nm/100A (burns on stall). Falcon: 6380RPM/4.69Nm/257A.' }
  },
  // ---- פרופילי תנועה / Motion Profiles ----
  {
    q: { he: 'מה הבדל Trapezoidal לבין S-Curve motion profile?', en: 'What is the difference between Trapezoidal and S-Curve motion profiles?', mix: 'Trapezoidal vs S-Curve?' },
    a: { he: 'Trapezoidal: תאוצה קבועה — קפיצה מיידית = jerk. S-Curve: תאוצה מתגברת בהדרגה = חלקה ללא jerk, פחות wheel slip. S-Curve עדיף לכוונון עדין ב-FRC.', en: 'Trapezoidal: constant acceleration — instant jump = jerk. S-Curve: smoothly increasing acceleration = no jerk, less wheel slip. S-Curve preferred for fine FRC tuning.', mix: 'Trapezoidal = constant accel = jerk. S-Curve = smooth accel, no jerk, less slip. S-Curve עדיף.' }
  },
  // ---- SuperStructure FSM ----
  {
    q: { he: 'מה מצבי ה-SuperStructure FSM וה-CLIMB guard?', en: 'What are the SuperStructure FSM states and the CLIMB guard?', mix: 'SuperStructure FSM states + CLIMB guard?' },
    a: { he: 'מצבים: TRAVEL, SHOOT, SHOOT_CLOSE, SHOOT_ON_THE_MOVE, FETCH, CLIMB_OPEN, CLIMB, AUTO. CLIMB נגיש רק מ-CLIMB_OPEN — guard מפני טיפוס בטעות.', en: 'States: TRAVEL, SHOOT, SHOOT_CLOSE, SHOOT_ON_THE_MOVE, FETCH, CLIMB_OPEN, CLIMB, AUTO. CLIMB accessible only from CLIMB_OPEN — guard against accidental climbing.', mix: 'States: TRAVEL/SHOOT/SHOOT_CLOSE/SHOOT_ON_THE_MOVE/FETCH/CLIMB_OPEN/CLIMB/AUTO. CLIMB = only from CLIMB_OPEN.' }
  },
  // ---- קלע מתקדם + RobotState ----
  {
    q: { he: 'מה backspin דיפרנציאלי בקלע ומה RobotState Singleton?', en: 'What is differential backspin in the shooter and what is RobotState Singleton?', mix: 'Differential backspin + RobotState?' },
    a: { he: 'גלגל ראשי + גלגל Hood מסתובבים בכיוונים מנוגדים → backspin מבוקר → יציבות תעופה (Magnus). RobotState Singleton: מאגר pose היסטורי + טבלת ירי (מרחק→זווית/מהירות).', en: 'Main wheel + Hood wheel spin opposite → controlled backspin → stable flight (Magnus). RobotState Singleton: historical pose buffer + shooting table (distance→angle/speed).', mix: 'Main+Hood opposite = backspin = stable flight (Magnus). RobotState: pose buffer + shooting table.' }
  },
  // ---- כימיה / Battery ----
  {
    q: { he: 'מה הכימיה של סוללת ה-FRC?', en: 'What is the chemistry of the FRC battery?', mix: 'FRC battery chemistry?' },
    a: { he: 'SLA = Sealed Lead Acid. אנודה: Pb. קתודה: PbO₂. אלקטרוליט: H₂SO₄ (חומצה גופרתית). 6 תאים × 2.1V = 12.6V. FRC חייב SLA — לפי תקנות.', en: 'SLA = Sealed Lead Acid. Anode: Pb. Cathode: PbO₂. Electrolyte: H₂SO₄ (sulfuric acid). 6 cells × 2.1V = 12.6V. FRC mandates SLA — rules.', mix: 'Pb + PbO₂ + H₂SO₄. 6 cells × 2.1V = 12.6V. FRC = SLA mandatory.' }
  },
  // ---- תיאוריה כללית לבגרות ----
  {
    q: { he: 'מה 3 רמות שאלות הבוחן?', en: 'What are the 3 exam question levels?', mix: '3 רמות בוחן?' },
    a: { he: 'רמה 1 ידע: "מה זה?" — הגדרה. רמה 2 הבנה: "מה עושה / איך עובד?" — הסבר. רמה 3 ניתוח: "למה? מה יקרה אם X?" — חשיבה ביקורתית.', en: 'Level 1 Knowledge: "What is it?" — define. Level 2 Understanding: "What does it do?" — explain. Level 3 Analysis: "Why? What if X?" — critical thinking.', mix: 'L1=הגדרה, L2=הסבר, L3=ניתוח סיבתי.' }
  },
  {
    q: { he: 'מה Duty Cycle ב-PWM?', en: 'What is Duty Cycle in PWM?', mix: 'PWM Duty Cycle — מה זה?' },
    a: { he: 'זמן ON / זמן כולל × 100%. מתח ממוצע = מתח סוללה × DC. 75% DC על 12V = 9V ממוצע.', en: 'Time ON / total time × 100%. Average voltage = battery × DC. 75% DC on 12V = 9V average.', mix: 'DC = זמן ON / כולל × 100%. 75% × 12V = 9V.' }
  },
  {
    q: { he: 'מה H-Bridge וכיצד הופך כיוון המנוע?', en: 'What is H-Bridge and how does it reverse the motor?', mix: 'H-Bridge — איך הופך כיוון?' },
    a: { he: '4 מפסקים: S1+S4 = קדימה, S2+S3 = אחורה, כולם פתוחים = עצירה. שליטה בכיוון הזרם = שליטה בכיוון הסיבוב.', en: '4 switches: S1+S4 = forward, S2+S3 = reverse, all open = stop. Current direction = rotation direction.', mix: 'S1+S4=קדימה, S2+S3=אחורה. 4 מפסקים = שליטה מלאה.' }
  },
  {
    q: { he: 'מה ההבדל בין חוג פתוח לחוג סגור?', en: 'Open-loop vs closed-loop control?', mix: 'Open vs closed loop?' },
    a: { he: 'חוג פתוח: פקודה → פעולה, ללא משוב. חוג סגור: פקודה → פעולה → מדידה → תיקון. PID = חוג סגור.', en: 'Open loop: command → action, no feedback. Closed loop: command → action → measure → correct. PID = closed loop.', mix: 'Open = no feedback. Closed = מדד + תקן. PID = closed.' }
  },
  {
    q: { he: 'מה מומנט כוח וקשרו ליציבות הרובוט?', en: 'What is moment of force and robot stability?', mix: 'מומנט — קשר ליציבות?' },
    a: { he: 'מומנט = מרחק × כוח. CoG גבוה → מרחק גדול מציר → מומנט גדול → קל להפיל. CoG נמוך = יציב.', en: 'Moment = distance × force. High CoG → large moment → easy to tip. Low CoG = stable.', mix: 'Moment = distance × force. CoG גבוה → מומנט גדול → קל להפיל.' }
  },
  {
    q: { he: 'מה ההבדל בין גלגל רגיל, אומני ומקאנום?', en: 'Regular vs omni vs mecanum wheels?', mix: 'Regular / Omni / Mecanum?' },
    a: { he: 'רגיל: קדימה/אחורה בלבד. אומני: רולים ציר אנכי = תנועה צדית. מקאנום: רולים 45° = holonomic (כל כיוון).', en: 'Regular: forward/back only. Omni: perpendicular rollers = lateral motion. Mecanum: 45° rollers = holonomic.', mix: 'Regular=קדימה/אחורה. Omni=צדי. Mecanum=45°=holonomic.' }
  },
  {
    q: { he: 'מה US אולטרסוני ואיך מחשב מרחק?', en: 'Ultrasonic sensor — how does it measure distance?', mix: 'US sensor — איך מודד?' },
    a: { he: 'שולח גלי קול 40kHz, מודד זמן t עד חזרה. S = V × t = 330 m/s × t. טווח: 3–300 ס"מ.', en: 'Sends 40kHz sound, measures return time t. S = V × t = 330 m/s × t. Range 3–300 cm.', mix: 'S = 330 × t. 40kHz, טווח 3–300 ס"מ.' }
  },
  {
    q: { he: 'למה חיישן IR שגוי מתחת ל-10 ס"מ?', en: 'Why is IR sensor wrong under 10 cm?', mix: 'IR error < 10 cm — למה?' },
    a: { he: 'שיטת הטריאנגולציה דורשת מרחק מינימלי. מתחת ל-10 ס"מ הזווית קטנה מדי לזיהוי — קריאת שגיאה.', en: 'Triangulation needs minimum distance. Under 10 cm angle too small to detect — erroneous reading.', mix: 'Triangulation needs min distance. < 10 cm = angle too small = error.' }
  },
  // ---- מסקנות מהמתכונת ----
  {
    q: { he: 'מה זה mAh בסוללה? מה ההבדל בין V ל-mAh?', en: 'What is mAh in a battery? V vs mAh?', mix: 'V vs mAh בסוללה?' },
    a: { he: 'V (וולט) = לחץ חשמלי — כוח האלקטרונים. mAh = קיבולת: 18Ah = 18A במשך שעה. הספק P = V × I (וואט). אנרגיה = P × זמן (Wh). סוללה 12V×18Ah = 216Wh.', en: 'V = electrical pressure. mAh = capacity: 18Ah = 18A for 1h. Power P = V × I (Watts). Energy = P × time (Wh). 12V×18Ah = 216Wh.', mix: 'V=לחץ. mAh=קיבולת. P=V×I. 12V×18Ah=216Wh.' }
  },
  {
    q: { he: 'הבקר דיגיטלי אבל המנוע אנלוגי — כיצד PWM מגשר?', en: 'Digital controller but analog motor — how does PWM bridge?', mix: 'דיגיטלי → PWM → אנלוגי?' },
    a: { he: 'הבקר מוציא 0V/5V בלבד. המנוע צריך מתח רציף. PWM ממתג ON/OFF מהר — הממוצע מדמה ערך אנלוגי. DC 25%=3V, 75%=9V. המנוע "מרגיש" רק את הממוצע.', en: 'Controller outputs 0V/5V only. Motor needs continuous voltage. PWM switches ON/OFF fast — average = analog value. DC 25%=3V, 75%=9V.', mix: 'בקר: 0/5V. PWM: ממוצע מדמה אנלוגי. DC 75%=9V.' }
  },
  {
    q: { he: 'מבנה מנוע Brushless — סטטור, רוטור, קומוטציה?', en: 'Brushless motor structure — stator, rotor, commutation?', mix: 'Brushless: סטטור+רוטור+קומוטציה?' },
    a: { he: 'סטטור: 3 סלילים חשמליים קבועים (120° ביניהם) → שדה מגנטי. רוטור: מגנטים קבועים מסתובבים. קומוטציה אלקטרונית: בקר קורא Hall/encoder → מחליף זרם בסלילים → שדה "רץ" → רוטור רודף.', en: 'Stator: 3 fixed coils (120° apart) → magnetic field. Rotor: permanent magnets rotate. Electronic commutation: controller reads Hall/encoder → switches coil current → field "runs" → rotor follows.', mix: 'סטטור=3 סלילים. רוטור=מגנטים. Hall+encoder=קומוטציה אלקטרונית.' }
  },
  {
    q: { he: 'מה הגדרת בקרה? מנהל, מבוקר, שגיאה — הגדר. חוג פתוח vs סגור?', en: 'Define control: controller, plant, error. Open vs closed loop?', mix: 'בקרה: מנהל, מבוקר, שגיאה?' },
    a: { he: 'מנהל=מחשב פקודה. מבוקר=מערכת נשלטת. חיישן=מודד מצב. שגיאה=Xr−Xir. חוג פתוח: פקודה→פעולה, ללא משוב. חוג סגור: מדידה→השוואה→תיקון→לולאה. PID=חוג סגור.', en: 'Controller=computes command. Plant=controlled system. Sensor=measures. Error=Xr−Xir. Open: command→action, no feedback. Closed: measure→compare→correct→loop. PID=closed.', mix: 'מנהל=פקודה. מבוקר=מערכת. שגיאה=Xr−Xir. סגור=מדוד+תקן.' }
  },
  {
    q: { he: 'הנעה דיפרנציאלית — מה ההבדל בין הנעה להיגוי?', en: 'Differential drive — drive vs steering difference?', mix: 'הנעה vs היגוי — דיפרנציאלי?' },
    a: { he: 'הנעה: כוח קדימה/אחורה — מנועים מסובבים גלגלים. היגוי: כיוון — שמאל מהיר מימין = פנייה ימינה. רדיוס פנייה = פונקציה של הפרש המהירות. בסוורב: הנעה+היגוי נפרדים לחלוטין (2 מנועים/מודולה).', en: 'Drive: forward/backward force. Steering: direction via speed difference — left faster = right turn. Turn radius = function of speed difference. Swerve: drive+steer fully separate.', mix: 'הנעה=כוח קדימה. היגוי=הפרש מהירויות. בסוורב=נפרדים לחלוטין.' }
  },
  {
    q: { he: 'ברייקרים, פיוזים, Mini PDB ומפצל — תפקיד כל אחד?', en: 'Breakers, fuses, Mini PDB, hub — role of each?', mix: 'פיוז vs ברייקר vs Mini PDB?' },
    a: { he: 'פיוז: חד-פעמי, נשרף בעומס יתר → חייב להחליף. ברייקר: ניתן לאיפוס ידני. Main Breaker: מנתק הכל. Mini PDB: מחלק מתח ממקור לכמה מוצאים. מפצל (Hub): חיבור פיזי בלבד, לא מגן.', en: 'Fuse: one-time, burns on overload → must replace. Breaker: manually resettable. Main Breaker: cuts all power. Mini PDB: distributes voltage to multiple outputs. Hub: physical only, no protection.', mix: 'פיוז=חד-פעמי. ברייקר=ניתן לאיפוס. Main=מנתק הכל. Mini PDB=מחלק. Hub=פיזי.' }
  }
];

// ----------------------------------------------------------------
// MATCH PAIRS (term ↔ definition)
// ----------------------------------------------------------------
const MATCH_PAIRS = [
  { term: 'Four-bar linkage', def: 'מנגנון ציר סיבוב — "בורח" ממכות, לא נשבר' },
  { term: 'Kalman Filter', def: 'ממוצע משוכלל: Odometry + Vision → ±1.5 ס"מ' },
  { term: 'Hood', def: 'מסלול עליון מתכוונן — שולט בזווית יציאת הכדור' },
  { term: 'Ratchet 1:32', def: 'שלב ראשון בתמסורת הטיפוס — מונע ירידה' },
  { term: 'PWM Duty Cycle', def: 'זמן_ON / זמן_כולל × 100% — עוצמת מנוע' },
  { term: 'H-Bridge', def: '4 מפסקים — S1+S4 קדימה, S2+S3 אחורה' },
  { term: 'SolvePnP', def: 'AprilTag בתמונה → Pose 6DOF מוחלט' },
  { term: 'FOC', def: '"קדימה" = כיוון מגרש, לא כיוון רובוט' },
  { term: 'Mecanum rollers', def: 'זווית 45° → כוח צדי → מרכז כדורים בהופר' },
  { term: 'Wear-In ±0.005mm', def: 'מיסבים שוחקים פרופיל → התאמה מושלמת' },
  { term: 'Feedforward', def: 'חישוב כוח לפי פיזיקה מראש — לא מחכה לשגיאה' },
  { term: 'IO Separation', def: 'אותו קוד לסימולציה + רובוט אמיתי' },
  { term: '1:64', def: 'יחס תמסורת טיפוס = 1:32 × 1:2 × 1:1' },
  { term: 'Magnus Force', def: 'כדור מסתובב = הפרש לחץ = עיקול מסלול' },
  { term: 'CANbus 2 wires', def: 'CAN-Hi + CAN-Lo — כל בקרי המנוע על רשת אחת' },
  { term: 'Polycarbonate', def: 'דפנות אינטייק — מתגמש ומתאושש, לא מתכופף' },
  { term: 'Odometry', def: 'אינטגרציה encoder + gyro → מיקום רובוט על שדה' },
  { term: 'AdvantageKit replay', def: 'הקלטת IO ממשחק → debug בסימולציה' },
];

// ----------------------------------------------------------------
// TRUE/FALSE QUESTIONS
// ----------------------------------------------------------------
const TRUEFALSE_QUESTIONS = [
  {
    statement: { he: 'Four-bar linkage מבוסס תנועה ליניארית קשיחה.', en: 'Four-bar linkage is based on rigid linear motion.', mix: 'Four-bar = linear rigid motion.' },
    correct: false,
    explanation: { he: 'שגוי. Four-bar מבוסס ציר סיבוב. בעת פגיעה מסתובב ולא נשבר, חוזר לצורתו.', en: 'False. Four-bar is pivot-based. On collision it rotates instead of breaking, then returns.', mix: 'False! Pivot-based ≠ linear. מסתובב, לא נשבר.' }
  },
  {
    statement: { he: 'יחס תמסורת הטיפוס הוא 1:64.', en: 'The climber gear ratio is 1:64.', mix: 'Climber ratio = 1:64.' },
    correct: true,
    explanation: { he: 'נכון. ראצ\'ט 1:32 × שרשרת 1:2 × שרשרת 1:1 = 1:64.', en: 'True. Ratchet 1:32 × chain 1:2 × chain 1:1 = 1:64.', mix: 'True! 1:32 × 1:2 × 1:1 = 1:64.' }
  },
  {
    statement: { he: 'Kalman Filter מסתמך רק על Odometry.', en: 'Kalman Filter relies only on Odometry.', mix: 'Kalman = only Odometry.' },
    correct: false,
    explanation: { he: 'שגוי. Kalman ממזג Odometry + Vision. ממוצע משוכלל לפי אמינות כל מקור.', en: 'False. Kalman merges Odometry + Vision. Weighted average by each source\'s reliability.', mix: 'False! Kalman = Odometry + Vision, weighted.' }
  },
  {
    statement: { he: 'PWM Duty Cycle של 100% = מנוע כבוי.', en: 'PWM Duty Cycle of 100% = motor off.', mix: 'PWM 100% = כבוי.' },
    correct: false,
    explanation: { he: 'שגוי. 100% Duty Cycle = כוח מלא. 0% = כבוי.', en: 'False. 100% duty cycle = full power. 0% = off.', mix: 'False! 100% = full power. 0% = off.' }
  },
  {
    statement: { he: 'מנוע Brushless יעיל יותר ממנוע Brushed.', en: 'A Brushless motor is more efficient than a Brushed motor.', mix: 'Brushless יעיל יותר?' },
    correct: true,
    explanation: { he: 'נכון. Brushless ~90–95% לעומת Brushed ~75–80%. קומוטציה אלקטרונית = פחות אנרגיה אבודה.', en: 'True. Brushless ~90–95% vs Brushed ~75–80%. Electronic commutation = less wasted energy.', mix: 'True! Brushless 90–95%, Brushed 75–80%.' }
  },
  {
    statement: { he: 'ה-Hood שולט במהירות הגלגלים בקלע.', en: 'The Hood controls the flywheel speed in the shooter.', mix: 'Hood שולט במהירות גלגלים?' },
    correct: false,
    explanation: { he: 'שגוי. Hood שולט בזווית היציאה. מהירות הגלגלים קובעת את כוח הירי.', en: 'False. Hood controls exit angle. Wheel speed determines shooting power.', mix: 'False! Hood = זווית. Wheel speed = כוח.' }
  },
  {
    statement: { he: 'CANbus מאפשר תקשורת דו-כיוונית עם בקרי המנוע.', en: 'CANbus enables bidirectional communication with motor controllers.', mix: 'CAN = bidirectional?' },
    correct: true,
    explanation: { he: 'נכון. בקרי CAN שולחים בחזרה: זרם, מתח, טמפרטורה, מיקום. PWM = חד-כיווני בלבד.', en: 'True. CAN controllers send back: current, voltage, temperature, position. PWM = one-way only.', mix: 'True! CAN שולח + מקבל. PWM = חד-כיווני.' }
  },
  {
    statement: { he: 'מנגנון Wear-In גורם לדעיכת איכות המעלית עם הזמן.', en: 'The Wear-In mechanism causes quality degradation of the climber over time.', mix: 'Wear-In = מחמיר עם הזמן?' },
    correct: false,
    explanation: { he: 'שגוי. Wear-In = המעלית משתפרת! המיסבים שוחקים הפרופיל ±0.005 מ"מ להתאמה מושלמת.', en: 'False. Wear-In = climber improves! Bearings wear profile to ±0.005 mm perfect fit.', mix: 'False! Wear-In = משתפר. ±0.005 mm = perfect fit.' }
  },
  {
    statement: { he: 'גלגלי מקאנום בהופר מאיצים את הכדורים קדימה בלבד.', en: 'Mecanum wheels in the hopper only accelerate balls forward.', mix: 'Mecanum = רק קדימה?' },
    correct: false,
    explanation: { he: 'שגוי. גלגלי מקאנום יוצרים גם מרכיב כוח צדי (רולים 45°) — מרכזים הכדור לאמצע.', en: 'False. Mecanum wheels also create lateral force component (45° rollers) — centers ball to middle.', mix: 'False! Mecanum = forward + lateral centering.' }
  },
  {
    statement: { he: 'FSM (Finite State Machine) מאפשר מצבים מקבילים בו-זמנית.', en: 'FSM allows multiple simultaneous parallel states.', mix: 'FSM = multiple states בו-זמנית?' },
    correct: false,
    explanation: { he: 'שגוי. FSM קלאסי = מצב אחד בלבד בכל רגע. הרובוט תמיד נמצא במצב מוגדר אחד.', en: 'False. Classic FSM = exactly one state at any moment. Robot always in one defined state.', mix: 'False! FSM = exactly one state. לא מקבילי.' }
  },
  {
    statement: { he: 'Trapezoidal motion profile מייצרת תאוצה חלקה ללא jerk.', en: 'Trapezoidal motion profile produces smooth acceleration without jerk.', mix: 'Trapezoidal = smooth, no jerk.' },
    correct: false,
    explanation: { he: 'שגוי. Trapezoidal = תאוצה קבועה עם קפיצה מיידית = jerk. S-Curve = תאוצה מתגברת בהדרגה = חלקה ללא jerk.', en: 'False. Trapezoidal = constant acceleration with instant jump = jerk. S-Curve = gradually increasing = smooth, no jerk.', mix: 'False! Trapezoidal = jerk. S-Curve = smooth. להפך!' }
  },
  {
    statement: { he: 'ניתן לעבור ל-CLIMB ישירות מכל מצב ב-SuperStructure FSM.', en: 'CLIMB state can be entered directly from any SuperStructure FSM state.', mix: 'CLIMB accessible from any FSM state.' },
    correct: false,
    explanation: { he: 'שגוי. CLIMB נגיש רק ממצב CLIMB_OPEN — guard מפני טיפוס בטעות במהלך משחק.', en: 'False. CLIMB is only accessible from CLIMB_OPEN — guard against accidental climbing during the match.', mix: 'False! CLIMB = only from CLIMB_OPEN. Guard prevents accidental activation.' }
  }
];

// ----------------------------------------------------------------
// WRITE MODE CARDS
// ----------------------------------------------------------------
const WRITE_CARDS = [
  { prompt: { he: 'מנגנון מבוסס ציר שמאפשר "בריחה" כלפי מעלה בעת פגיעה', en: 'Pivot-based mechanism that "escapes" upward on impact', mix: 'Pivot mechanism — בורח בעת פגיעה' }, answer: 'Four-bar linkage' },
  { prompt: { he: 'ממוצע משוכלל בין Odometry ל-Vision', en: 'Weighted average between Odometry and Vision', mix: 'Weighted merge: Odometry + Vision' }, answer: 'Kalman Filter' },
  { prompt: { he: 'מסלול עליון מתכוונן בקלע — שולט בזווית יציאת הכדור', en: 'Adjustable upper guide in shooter — controls exit angle', mix: 'Adjustable shooter guide, controls angle' }, answer: 'Hood' },
  { prompt: { he: 'רשת 2 חוטים דו-כיוונית לבקרי מנוע — ניטור זרם/מתח/טמפ\'', en: '2-wire bidirectional network for motor controllers — current/voltage/temp monitoring', mix: 'Bidirectional motor controller network' }, answer: 'CANbus' },
  { prompt: { he: 'ציר אלומיניום משושה קל וחזק לאינטייק', en: 'Light and strong hexagonal aluminum axle for intake', mix: 'Hexagonal aluminum intake axle' }, answer: 'Churro' },
  { prompt: { he: '4 מפסקים לשליטה בכיוון הזרם במנוע', en: '4 switches controlling current direction through motor', mix: '4 switches for motor direction control' }, answer: 'H-Bridge' },
  { prompt: { he: 'אחוז זמן שהאות PWM במצב ON', en: 'Percentage of time the PWM signal is ON', mix: 'PWM ON time percentage' }, answer: 'Duty Cycle' },
  { prompt: { he: 'האלגוריתם שמחשב Pose 6DOF מ-AprilTag בתמונה', en: 'Algorithm computing 6DOF Pose from AprilTag in image', mix: '6DOF Pose from AprilTag' }, answer: 'SolvePnP' },
  { prompt: { he: '"קדימה" תמיד לכיוון המגרש — ע"י חיסור זווית ג\'יירו', en: '"Forward" always field-relative — by subtracting gyro angle', mix: 'Forward = field direction, gyro subtraction' }, answer: 'FOC (Field-Oriented Control)' },
  { prompt: { he: 'מנגנון מכני שמונע ירידת המעלית ללא כוח מנוע', en: 'Mechanical mechanism preventing climber descent without motor power', mix: 'Mechanical lock — climber stays up' }, answer: 'Ratchet' },
  { prompt: { he: 'מצב FSM שממנו בלבד ניתן לעבור ל-CLIMB', en: 'The only FSM state from which CLIMB can be entered', mix: 'Only entry point to CLIMB state' }, answer: 'CLIMB_OPEN' },
  { prompt: { he: 'Singleton שמכיל מאגר pose היסטורי + טבלת ירי לפי מרחק', en: 'Singleton containing historical pose buffer and shooting table by distance', mix: 'Pose buffer + shooting table Singleton' }, answer: 'RobotState' },
];

// ----------------------------------------------------------------
// QUIZ QUESTIONS (12 — from original study guide Qs array)
// ----------------------------------------------------------------
const QUIZ_QUESTIONS = [
  {
    q: 'מה מאפשר מנגנון Four-bar באינטייק?',
    o: ['תנועה ליניארית מדויקת', '"בריחה" כלפי מעלה בעת התנגשות, ללא שבר', 'מהירות איסוף גבוהה יותר', 'שימוש בפחות מנועים'],
    c: 1,
    e: 'ה-Four-bar מבוסס ציר סיבוב — בעת פגיעה האינטייק מסתובב ולא נשבר, וחוזר מיד לפעולה.'
  },
  {
    q: 'למה דפנות האינטייק עשויות פוליקרבונט ולא אלומיניום?',
    o: ['כי פוליקרבונט זול יותר', 'כי הוא מתגמש ומתאושש ממכות, וגם קל יותר', 'כי אלומיניום לא עמיד', 'כי כך פועל כל רובוט FRC'],
    c: 1,
    e: 'פוליקרבונט לא מתכופף לצמיתות כמו אלומיניום, חוזר לצורתו, וגם קל — מוריד מרכז כובד.'
  },
  {
    q: 'מה תפקיד גלגלי המקאנום בהופר?',
    o: ['להאיץ את הכדורים לכיוון הסל', 'לאגור את הכדורים', 'למרכז את הכדור לפני כניסה לקלע', 'לשלוט על כמות הכדורים'],
    c: 2,
    e: 'הרולים בזווית 45° יוצרים רכיב תנועה צדי שממרכז את הכדור תוך כדי התקדמותו.'
  },
  {
    q: 'מה תפקיד ה-Hood בקלע?',
    o: ['שולט במהירות גלגלי הירי', 'שולט בזווית היציאה של הכדור', 'מונע מהכדור לחזור פנימה', 'מחבר את הקלע להופר'],
    c: 1,
    e: 'Hood הוא מסלול עליון מתכוונן. זווית ה-Hood קובעת באיזו זווית הכדור יוצא — מתאים לכל מרחק.'
  },
  {
    q: 'אילו כוחות הסימולציה הפיזיקלית מתחשבת בהם?',
    o: ['רק כוח הכבידה', 'כוח הכבידה + חיכוך אוויר + כוח מגנוס', 'כוח הכבידה + מהירות הרובוט', 'כל הכוחות הפיזיקליים הידועים'],
    c: 1,
    e: 'הסימולציה מתחשבת בכבידה, חיכוך עם האוויר, וכוח מגנוס (הנגרם מסיבוב הכדור באוויר).'
  },
  {
    q: 'מהו יחס התמסורת הכולל של מערכת הטיפוס?',
    o: ['1:32', '1:48', '1:64', '1:128'],
    c: 2,
    e: 'ראצ\'ט 1:32 × שרשרת 1:2 × שרשרת 1:1 = יחס כולל 1:64.'
  },
  {
    q: 'מה זה Finite State Machine (FSM) בתוכנה?',
    o: ['מחשב שפועל בתדר קבוע', 'מערכת שמגדירה מצבים ומעברים מוגדרים מראש', 'ספריית PID', 'שיטה לחיווט הרובוט'],
    c: 1,
    e: 'FSM = האוטומט הסופי. הרובוט תמיד נמצא במצב מוגדר אחד ועובר בין מצבים לפי תנאים.'
  },
  {
    q: 'מה Kalman Filter עושה במערכת הניווט?',
    o: ['מחשב מסלול אוטונומי', 'ממזג אודומטריה + Vision לאומדן מיקום מדויק יותר', 'שולט על מהירות הנסיעה', 'מגביל תאוצת הרובוט'],
    c: 1,
    e: 'Kalman Filter ממוצע משוכלל בין מקורות מידע שונים לפי אמינותם → תוצאה מדויקת יותר מכל מקור לחוד.'
  },
  {
    q: 'מה ה-Duty Cycle של 75% ב-PWM?',
    o: ['המנוע מקבל 9V מ-12V', 'האות פעיל 75% מהזמן', 'המנוע מסתובב ב-75% ממהירות מקס', 'המנוע פועל בהתפרצויות של 75 מ"ש'],
    c: 1,
    e: 'Duty Cycle = אחוז זמן שהאות במצב ON. 75% = האות גבוה 3/4 מהזמן.'
  },
  {
    q: 'מה ההבדל בין Brushed ל-Brushless?',
    o: ['Brushless מהיר תמיד', 'Brushless אין לו קומוטטור ומברשות — קומוטציה אלקטרונית', 'Brushed חזק יותר', 'אין הבדל משמעותי'],
    c: 1,
    e: 'ב-Brushless אין קומוטטור ומברשות. בקר אלקטרוני מחליף זרם בסלילים לפי מיקום הרוטור — יעיל ועמיד יותר.'
  },
  {
    q: 'מה יתרון CANbus על חיווט PWM רגיל?',
    o: ['CANbus מהיר יותר פי 10', 'פחות חוטים, ניטור בזמן אמת, אבחון בעיות', 'CANbus זול יותר', 'CANbus תומך ביותר מנועים'],
    c: 1,
    e: 'CAN = 2 חוטים לכל הרשת + ניטור זרם/מתח + אבחון. PWM = חוט נפרד לכל רכיב, ללא ניטור.'
  },
  {
    q: 'למה הורדנו ממעלית כפולה לפרופיל יחיד?',
    o: ['כי פרופיל כפול הוריד ביצועים', 'כי פרופיל כפול לא היה חזק מספיק', 'כדי להוריד 3.5 ק"ג ממשקל הרובוט', 'כי גרסה כפולה היתה יקרה מדי'],
    c: 2,
    e: 'פרופיל יחיד 40×40 מ"מ מספיק לתמוך בטיפוס, וחוסך 3.5 ק"ג — משמעותי מאוד בתחרות.'
  }
];

// ----------------------------------------------------------------
// EXAM QUESTIONS (25 — robot-focused, bagrut-style)
// ----------------------------------------------------------------
const EXAM_QUESTIONS = [
  // --- 12 from quiz ---
  {
    q: 'מה מאפשר מנגנון Four-bar באינטייק?',
    o: ['תנועה ליניארית מדויקת', '"בריחה" כלפי מעלה בעת התנגשות, ללא שבר', 'מהירות איסוף גבוהה יותר', 'שימוש בפחות מנועים'],
    c: 1,
    e: 'ה-Four-bar מבוסס ציר סיבוב — בעת פגיעה האינטייק מסתובב ולא נשבר, וחוזר מיד לפעולה.'
  },
  {
    q: 'למה דפנות האינטייק עשויות פוליקרבונט ולא אלומיניום?',
    o: ['כי פוליקרבונט זול יותר', 'כי הוא מתגמש ומתאושש ממכות, וגם קל יותר', 'כי אלומיניום לא עמיד', 'כי כך פועל כל רובוט FRC'],
    c: 1,
    e: 'פוליקרבונט לא מתכופף לצמיתות כמו אלומיניום, חוזר לצורתו, וגם קל — מוריד מרכז כובד.'
  },
  {
    q: 'מה תפקיד גלגלי המקאנום בהופר?',
    o: ['להאיץ הכדורים קדימה', 'לאגור כדורים', 'למרכז הכדור לפני כניסה לקלע', 'לשלוט על כמות הכדורים'],
    c: 2,
    e: 'הרולים בזווית 45° יוצרים רכיב תנועה צדי שממרכז את הכדור תוך כדי התקדמותו.'
  },
  {
    q: 'מה תפקיד ה-Hood בקלע?',
    o: ['שולט במהירות גלגלי הירי', 'שולט בזווית היציאה של הכדור', 'מונע מהכדור לחזור פנימה', 'מחבר קלע להופר'],
    c: 1,
    e: 'Hood הוא מסלול עליון מתכוונן. זווית ה-Hood קובעת באיזו זווית הכדור יוצא — מתאים לכל מרחק.'
  },
  {
    q: 'אילו כוחות הסימולציה הפיזיקלית מתחשבת בהם?',
    o: ['רק כוח הכבידה', 'כוח הכבידה + חיכוך אוויר + כוח מגנוס', 'כוח הכבידה + מהירות הרובוט', 'כל הכוחות הפיזיקליים'],
    c: 1,
    e: 'הסימולציה מתחשבת בכבידה, חיכוך אוויר, וכוח מגנוס (מסיבוב הכדור באוויר).'
  },
  {
    q: 'מהו יחס התמסורת הכולל של מערכת הטיפוס?',
    o: ['1:32', '1:48', '1:64', '1:128'],
    c: 2,
    e: 'ראצ\'ט 1:32 × שרשרת 1:2 × שרשרת 1:1 = יחס כולל 1:64.'
  },
  {
    q: 'מה זה Finite State Machine (FSM) בתוכנה?',
    o: ['מחשב בתדר קבוע', 'מערכת עם מצבים ומעברים מוגדרים מראש', 'ספריית PID', 'שיטת חיווט'],
    c: 1,
    e: 'FSM = הרובוט תמיד נמצא במצב מוגדר אחד ועובר בין מצבים לפי תנאים.'
  },
  {
    q: 'מה Kalman Filter עושה במערכת הניווט?',
    o: ['מחשב מסלול אוטונומי', 'ממזג Odometry + Vision לאומדן מדויק יותר', 'שולט על מהירות הנסיעה', 'מגביל תאוצת הרובוט'],
    c: 1,
    e: 'Kalman ממוצע משוכלל Odometry + Vision לפי אמינות → תוצאה מדויקת משני המקורות לחוד.'
  },
  {
    q: 'מה ה-Duty Cycle של 75% ב-PWM?',
    o: ['המנוע מקבל 9V מ-12V', 'האות פעיל 75% מהזמן', 'המנוע מסתובב 75% ממהירות מקס', 'המנוע פועל 75 מ"ש'],
    c: 1,
    e: 'Duty Cycle = זמן_ON / זמן_כולל × 100%. 75% = האות גבוה 3/4 מהזמן.'
  },
  {
    q: 'מה ההבדל בין Brushed ל-Brushless?',
    o: ['Brushless מהיר תמיד', 'Brushless — קומוטציה אלקטרונית, ללא מברשות', 'Brushed חזק יותר', 'אין הבדל משמעותי'],
    c: 1,
    e: 'Brushless: בקר אלקטרוני מחליף זרם בסלילים לפי מיקום הרוטור. יעיל ועמיד יותר.'
  },
  {
    q: 'מה יתרון CANbus על PWM?',
    o: ['CANbus מהיר פי 10', 'פחות חוטים, ניטור בזמן אמת, אבחון בעיות', 'CANbus זול יותר', 'CANbus תומך ביותר מנועים'],
    c: 1,
    e: 'CAN = 2 חוטים לכל הרשת + ניטור זרם/מתח/טמפ\'. PWM = חוט נפרד לכל רכיב, חד-כיווני.'
  },
  {
    q: 'למה עברנו ממעלית כפולה לפרופיל יחיד?',
    o: ['פרופיל כפול הוריד ביצועים', 'פרופיל כפול לא מספיק חזק', 'כדי לחסוך 3.5 ק"ג', 'גרסה כפולה יקרה מדי'],
    c: 2,
    e: 'פרופיל אחד 40×40 מ"מ מספיק לתמיכה, וחוסך 3.5 ק"ג — משמעותי בתחרות.'
  },
  // --- 5 theory questions ---
  {
    q: 'נתון מנוע DC ב-12V ו-PWM Duty Cycle 25%. מה המתח האפקטיבי למנוע?',
    o: ['3V', '9V', '6V', '2.5V'],
    c: 0,
    e: 'מתח אפקטיבי = Duty Cycle × מתח מקסימלי = 0.25 × 12V = 3V. PWM לא מוריד מתח ממש — ממוצע זמן = אותה השפעה.'
  },
  {
    q: 'ב-H-Bridge, אילו מפסקים סגורים להנעה "אחורה"?',
    o: ['S1 + S4', 'S2 + S3', 'S1 + S3', 'S2 + S4'],
    c: 1,
    e: 'H-Bridge: S1+S4 = זרם קדימה (A→B). S2+S3 = זרם אחורה (B→A). S1+S3 או S2+S4 = קצר חשמלי!'
  },
  {
    q: 'מה קומוטציה ב-Brushed DC ומה חסרונה?',
    o: ['שינוי כוון הסיבוב — גורם לחום', 'החלפת כיוון הזרם בסליל ע"י קומוטטור ומברשות — מברשות מתבלות', 'מדידת מהירות הרוטור', 'שמירת אנרגיה בקבל'],
    c: 1,
    e: 'קומוטציה = החלפת כיוון זרם בסליל כל חצי סיבוב. ב-Brushed: קומוטטור + מברשות פחם → שחיקה, ניצוצות, יעילות נמוכה.'
  },
  {
    q: 'מה יחס תמסורת N:1 עושה לטורק ולמהירות?',
    o: ['טורק ÷N, מהירות ×N', 'טורק ×N, מהירות ÷N', 'שניהם ×N', 'שניהם ÷N'],
    c: 1,
    e: 'תמסורת N:1 = שימור הספל. מה שמתווסף לטורק (×N) יורד מהמהירות (÷N). אנרגיה = קבועה.'
  },
  {
    q: 'כמה חוטים ב-CANbus ומה הם?',
    o: ['4 חוטים — +12V, GND, CAN-Hi, CAN-Lo', '2 חוטים — CAN-Hi ו-CAN-Lo', '3 חוטים — +5V, GND, DATA', '6 חוטים — חזרה מ-RJ45'],
    c: 1,
    e: 'CANbus = שני חוטים: CAN-Hi ו-CAN-Lo (differential signaling). כל המכשירים על אותה רשת — daisy-chain.'
  },
  // --- 4 mechanical questions ---
  {
    q: 'מה דיוק ה-CNC במיסבי המעלית?',
    o: ['±0.5 מ"מ', '±0.05 מ"מ', '±0.005 מ"מ', '±0.0005 מ"מ'],
    c: 2,
    e: 'בלוק המיסבים יוצר ב-CNC עם דיוק ±0.005 מ"מ — קריטי לחיכוך נמוך ותנועה חלקה של המעלית.'
  },
  {
    q: 'מה ממדי פרופילי אלומיניום שלדת הרובוט?',
    o: ['40×40 מ"מ', '50×25 מ"מ', '80×40 מ"מ', '30×30 מ"מ'],
    c: 1,
    e: 'פרופילי אלומיניום 50×25 מ"מ בתצורה מלבנית — מאזן בין עמידות להתנגשויות לבין משקל נמוך.'
  },
  {
    q: 'כמה ק"ג נחסכו במעבר מפרופיל כפול לפרופיל יחיד בטיפוס?',
    o: ['1 ק"ג', '2 ק"ג', '3.5 ק"ג', '5 ק"ג'],
    c: 2,
    e: 'המעבר לפרופיל יחיד 40×40 מ"מ חסך 3.5 ק"ג. המשקל הכולל של הרובוט ~50 ק"ג — 3.5 ק"ג הוא חיסכון משמעותי.'
  },
  {
    q: 'מה יחס ההעברה של מנגנון הנעת המרכב?',
    o: ['1:3.5', '1:5.9', '1:10', '1:16'],
    c: 1,
    e: 'יחס 1:5.9 — Talon FX (Falcon) 6380 RPM → פלט ~1080 RPM. מהיר מספיק לחצות המגרש.'
  },
  // --- 4 software questions ---
  {
    q: 'בFSM של הקלע, מה סדר המצבים הנכון?',
    o: ['IDLE → FIRING → SPINNING_UP → READY_TO_FIRE', 'IDLE → SPINNING_UP → READY_TO_FIRE → FIRING', 'SPINNING_UP → IDLE → READY_TO_FIRE → FIRING', 'READY_TO_FIRE → SPINNING_UP → FIRING → IDLE'],
    c: 1,
    e: 'IDLE (חינם) → SPINNING_UP (לחיצת כפתור) → READY_TO_FIRE (הגיע למהירות) → FIRING (כפתור ירי) → IDLE (כדור יצא).'
  },
  {
    q: 'מה Kalman Filter מקבל ל-Fusion ומה מחזיר?',
    o: ['מקבל: IMU בלבד → מחזיר: heading', 'מקבל: Odometry (x,y,heading) + Vision Pose → מחזיר: Pose משולב מדויק', 'מקבל: encoder → מחזיר: מהירות', 'מקבל: Vision → מחזיר: AprilTag ID'],
    c: 1,
    e: 'Kalman מקבל Odometry (±5 ס"מ, drift) + Vision Pose (±2 ס"מ, מוחלט) → Pose משולב ±1.5 ס"מ.'
  },
  {
    q: 'מה IO Separation מאפשר בפיתוח?',
    o: ['קוד מהיר יותר', 'אותו קוד לוגיקה עובד בסימולציה וברובוט אמיתי — ללא שינוי', 'חיסכון בזיכרון', 'ניפוי שגיאות אוטומטי'],
    c: 1,
    e: 'IO Separation = ממשק נפרד. SimIO ↔ RealIO — אותה לוגיקה. בודקים ב-Simulation לפני שנוגעים ברובוט.'
  },
  {
    q: 'מה AdvantageKit מאפשר שאחרת בלתי אפשרי?',
    o: ['תכנות מהיר יותר', 'שידור חוזר (replay) של משחק שלם בסימולציה לאיתור באגים', 'ניהול CAN IDs', 'אוטו-כיול PID'],
    c: 1,
    e: 'AdvantageKit מקליט את כל ערכי ה-IO. לאחר תחרות → replay בסימולציה → רואים מה קרה בדיוק ומאיינים באגים.'
  },
  // --- 10 new theory/bagrut questions ---
  {
    q: 'מה קורה ליציבות הרובוט אם מעלים את הסוללה מהתחתית לחלק העליון?',
    o: ['יציבות גדלה כי המסה גבוהה יותר', 'יציבות קטנה כי מרכז הכובד עולה ומומנט ההפלה גדל', 'אין שינוי — המסה זהה', 'תלוי בגודל הרובוט'],
    c: 1,
    e: 'מרכז כובד גבוה יותר → מומנט גדול יותר סביב ציר המגע עם הרצפה → ניתן להפיל את הרובוט בכוח קטן יותר. עיקרון: מומנט = מרחק × כוח.'
  },
  {
    q: 'מה קורה למהירות ולטורק אם מגדילים יחס תמסורת מ-1:32 ל-1:64?',
    o: ['מהירות × 2, טורק ÷ 2', 'מהירות ÷ 2, טורק × 2', 'שניהם גדלים', 'שניהם קטנים'],
    c: 1,
    e: 'כפל היחס ב-2 → מהירות מחולקת ב-2, טורק מוכפל ב-2. שימור הספל: P = τ × ω = const. לכן 1:64 מרים רובוט שלם, 1:32 מהיר יותר אך טורק נמוך.'
  },
  {
    q: 'למה Brushless עדיף על Brushed למרכב, למרות שיקר יותר?',
    o: ['כי Brushless קל יותר', 'כי יעילות 90–95% + ללא תחזוקה + כוח/משקל גבוה = חיוני לתחרות', 'כי WPILib תומך רק ב-Brushless', 'כי Brushed לא עמיד לחום'],
    c: 1,
    e: 'יעילות גבוהה → פחות חום → פחות throttling. ללא מברשות → ללא תקלות קומוטטור במהלך תחרות. כוח/משקל גבוה → רובוט קל ומהיר יותר.'
  },
  {
    q: 'מה קורה לרדיוס הפניה אם מגדילים המרחק בין הגלגלים?',
    o: ['רדיוס פניה קטן — זריז יותר', 'רדיוס פניה גדל — פחות זריז', 'אין שינוי', 'תלוי במהירות בלבד'],
    c: 1,
    e: 'בסיס גלגלים רחב יותר → רדיוס פניה גדול יותר (פחות זריז) אך יציבות גבוהה יותר. Trade-off: stability ↔ maneuverability.'
  },
  {
    q: 'מה ההבדל בין Open-Loop ל-Closed-Loop control?',
    o: ['Open = מהיר יותר, Closed = איטי', 'Open = ללא משוב מחיישן. Closed = מקבל משוב, משווה למטרה, מתקן', 'Closed = ידני, Open = אוטומטי', 'אין הבדל מעשי'],
    c: 1,
    e: 'Open-loop: שולח פקודה ולא יודע מה קרה. Closed-loop (PID): מודד מצב נוכחי, משווה לsetpoint, מחשב שגיאה → מתקן. הרבה יותר מדויק.'
  },
  {
    q: 'מה תפקיד ה-I (Integral) ב-PID ומה סכנתו?',
    o: ['מאיץ את ההגעה למטרה', 'מצבר שגיאות לאורך זמן — מתקן שגיאה קבועה (steady-state error). סכנה: Integral Windup', 'מגביל את מהירות ההתקרבות', 'מחליף את ה-P כשהשגיאה קטנה'],
    c: 1,
    e: 'I = Ki × ∫e dt. אם הרובוט "תקוע" ליד המטרה, I מצטבר ומדחף חזק יותר. Integral Windup = I גדל מאוד ויוצר overshoot חזק. פתרון: clamp לI.'
  },
  {
    q: 'איזה פיוז מתאים למנוע Falcon 500 בCAN?',
    o: ['15A', '30A', '40A', '60A'],
    c: 2,
    e: 'Falcon 500 = מנוע חזק. שיא זרם ~150A לזמן קצר, עובד עם פיוז 40A ב-PDH. פיוז 15A = יפוצץ מיד. פיוז 30A = אפשרי, 40A = סטנדרט.'
  },
  {
    q: 'מה Feedforward ב-ArmFeedforward ואיך מתחשב בכבידה?',
    o: ['חישוב קבוע ללא קשר לזווית', 'kG × cos(θ) — כוח הכבידה משתנה לפי cos הזווית', 'I × R (ספל חשמלי)', 'kV × velocity (פריקציה)'],
    c: 1,
    e: 'זרוע אופקית (θ=0°) → cos(0)=1 → כוח מקסימלי לנגד כבידה. אנכית (θ=90°) → cos(90°)=0 → אין כוח כבידה. ArmFeedforward: kG×cos(θ) + kV×v + kA×a.'
  },
  {
    q: 'מה PDH ומה יתרונו על PDP ישן?',
    o: ['PDH זול יותר', 'PDH: 18 ערוצים + ניטור CAN בזמן אמת + LED status. PDP: 16 ערוצים, פחות ניטור', 'PDP תומך יותר מנועים', 'אין הבדל משמעותי'],
    c: 1,
    e: 'PDH (Power Distribution Hub, REV): 18 ערוצים, ניטור זרם/מתח לכל ערוץ דרך CAN, LED לאבחון. פיוזים: 15A / 30A / 40A. עדכני יותר מ-PDP של CTRE.'
  },
  {
    q: 'אם נשנה גלגל מרכב מקוטר 4 אינץ\' ל-6 אינץ\' — מה ישתנה?',
    o: ['מהירות קטנה, טורק גדל', 'מהירות גדלה (היקף גדול יותר), טורק קטן. רדיוס גדול יותר = יותר מהירות קו', 'שניהם גדלים', 'אין שינוי — תלוי רק ביחס תמסורת'],
    c: 1,
    e: 'היקף גלגל = π × d. 4 אינץ\' → 12.6 ס"מ. 6 אינץ\' → 18.8 ס"מ. כל סיבוב = מרחק גדול יותר → מהירות גבוהה יותר, אך טורק קטן יותר (ידית ארוכה יותר).'
  },
  // ---- REBUILT — שאלות עומק רמות 2–3 ----
  {
    q: 'מה ה-BUMP וכיצד גובהו משפיע על עיצוב הרובוט?',
    o: ['מחסום שמונע כניסה לאזור היריב', 'רמפה ברוחב 1854 ס"מ, גובה 16.54 ס"מ עם זוויות 15° — דורש CoG נמוך ושלד יציב כדי לעבור ללא היפוך', 'מחסום קבוע שלא ניתן לעבור עליו', 'אזור ניטרלי בין הקבוצות'],
    c: 1,
    e: 'ה-BUMP גבוה 16.54 ס"מ עם רמפות 15°. CoG גבוה = מומנט הפיכה גדול בעת מעבר. לכן שקענו הסוללה לתחתית.'
  },
  {
    q: 'מה יחס ההעברה שבחרנו לזרוע פריסת האינטייק ולמה?',
    o: ['1:10 — לפריסה מהירה', '1:32 — כמו המטפס', '1:96 — טורק גבוה לשמירת זרוע פרוסה ומניעת התחממות', '1:5.9 — כמו המרכב'],
    c: 2,
    e: '1:96 נותן טורק גבוה כדי שהמנוע יחזיק את הזרוע פרוסה ללא בלימה חשמלית מתמדת — מונע התחממות יתר.'
  },
  {
    q: 'למה החלפנו את לוחות ההוד מפלדה לאלומיניום?',
    o: ['כי אלומיניום זול יותר מפלדה', 'כי פלדה אינה עמידה בתנאי תחרות', 'כדי להוריד מסה בחלק העליון ולהנמיך את מרכז הכובד', 'כדי לעמוד בתקנות FRC'],
    c: 2,
    e: 'לוחות ההוד נמצאים גבוה. פלדה כבדה גבוה = CoG גבוה. אלומיניום קל → CoG יורד → יציבות בתנועה מהירה.'
  },
  {
    q: 'מה החולשה התרמית של מנוע NEO 550?',
    o: ['הוא לא יכול לפעול מעל 12V', 'מסה תרמית נמוכה — חסימה (stall) ממושכת שורפת אותו מהר', 'אין לו בקר פנימי', 'הוא מייצר רעש אלקטרומגנטי רב'],
    c: 1,
    e: 'ל-NEO 550 מסה תרמית נמוכה מאוד. בעת stall כל האנרגיה הופכת לחום ואין מספיק מסה לספיגה → שריפה מהירה.'
  },
  {
    q: 'מה גובה מרכז הכובד שהשגנו ומה האסטרטגיה העיקרית?',
    o: ['25 ס"מ — שימוש בפרופילים קלים', '~16.4 ס"מ — שקיעת הסוללה (הרכיב הכבד ביותר) לתוך מרכז השלד', '10 ס"מ — הורדת כל המנועים לרצפה', '20 ס"מ — שימוש בחלקים מודפסים'],
    c: 1,
    e: 'CoG = ~16.4 ס"מ. הסוללה — הרכיב הכבד ביותר — שוקעת לתוך מרכז השלד בגובה נמוך ככל האפשר.'
  },
  {
    q: 'למה סובבנו את מודולות ה-Swerve הקדמיות ב-90°?',
    o: ['לשיפור יציבות בפניות', 'לפינוי מקום פיזי לאינטייק ולקלע בקדמת הרובוט', 'להורדת מרכז הכובד', 'כי כך עובד מנגנון MK4N'],
    c: 1,
    e: 'סיבוב 90° משנה כיוון תפרסות המודולה ומפנה מקום בקצה הקדמי לאינטייק ולקלע ללא חסימה.'
  },
  {
    q: 'מתי תבחר Mecanum ומתי Swerve?',
    o: ['Mecanum תמיד עדיף כי פשוט יותר', 'Swerve לתחרויות מהירות בלבד', 'Mecanum: תקציב נמוך, שדה ישר, אחיזה פחות קריטית. Swerve: ביצועים מקסימליים, תמרון מלא, אחיזה חזקה', 'שניהם זהים בביצועים'],
    c: 2,
    e: 'Mecanum זול ופשוט אך מאבד אחיזה בקלות. Swerve יקר ומורכב אך holonomic מלא עם אחיזה — מתאים לרמה גבוהה של FRC.'
  },
  {
    q: 'מה קורה אם מרכז הכובד גבוה מדי בתנועת Swerve מהירה?',
    o: ['הרובוט מאבד קשר WiFi', 'גלגלים מחליקים בפניות חדות → חוסר יציבות, אודומטריה שגויה ועד להיפוך', 'המנועים מתחממים יותר', 'הגיירו מדווח קריאות שגויות'],
    c: 1,
    e: 'CoG גבוה = מומנט עצום בפנייה. גלגלים מאבדים אחיזה → wheel slip → אודומטריה שגויה → בעיות שליטה ועד להיפוך.'
  },
  // --- תיאוריה כללית לבגרות ---
  {
    q: 'מה Duty Cycle ב-PWM?',
    o: ['אחוז זמן שהאות במצב ON', 'מספר הפולסים בשנייה', 'עוצמת הזרם במנוע', 'מתח הסוללה'],
    c: 0,
    e: 'Duty Cycle = זמן_ON / זמן_כולל × 100%. קובע את המתח הממוצע ולכן את מהירות המנוע.'
  },
  {
    q: 'מה ההבדל בין חוג פתוח לחוג סגור?',
    o: ['חוג פתוח מהיר יותר תמיד', 'חוג פתוח = ללא משוב; חוג סגור = מדידה + תיקון רציף', 'חוג סגור = PID בלבד', 'אין הבדל משמעותי'],
    c: 1,
    e: 'חוג פתוח שולח פקודה ולא יודע מה קרה. חוג סגור מודד, משווה ליעד ומתקן — מדויק יותר.'
  },
  {
    q: 'מה S1+S4 ב-H-Bridge?',
    o: ['עצירת המנוע', 'סיבוב אחורה', 'סיבוב קדימה', 'מעבר בין מצבים'],
    c: 2,
    e: 'S1+S4 סגורים: זרם זורם קדימה דרך המנוע → סיבוב קדימה. S2+S3 סגורים = אחורה.'
  },
  {
    q: 'אם Duty Cycle = 50% ומתח סוללה = 12V, מה המתח הממוצע?',
    o: ['12V', '3V', '6V', '9V'],
    c: 2,
    e: 'מתח ממוצע = מתח סוללה × Duty Cycle = 12 × 0.50 = 6V. עיקרון PWM.'
  },
  {
    q: 'מדוע חיישן IR מדויק רק מעל 10 ס"מ?',
    o: ['כי הגלים מתפזרים', 'כי שיטת הטריאנגולציה דורשת מרחק מינימלי לזיהוי הזווית', 'כי המתח יורד לאפס', 'כי הקרן חלשה מדי'],
    c: 1,
    e: 'IR מודד מרחק לפי זווית הקרן החוזרת (טריאנגולציה). מתחת ל-10 ס"מ הזווית קטנה מדי לזיהוי מדויק.'
  },
  {
    q: 'מה יקרה אם נגדיל את kc (קבוע התיקון) מעבר לאופטימלי?',
    o: ['הרובוט יגיע מהר יותר לדיוק', 'הרובוט יתנדנד (אוסצילציה) סביב היעד', 'תיקון איטי יותר', 'אין השפעה על הביצועים'],
    c: 1,
    e: 'kc גדול מדי → כל שגיאה קטנה מייצרת תיקון גדול → תנועות חריפות → אוסצילציה ואי-יציבות.'
  },
  // --- 8 שאלות מסקנות מהמתכונת ---
  {
    q: 'מה זה mAh בסוללה? סוללת 12V 18Ah — כמה אנרגיה יש בה בוואט-שעה?',
    o: ['12 × 18 = 216 Wh', '12 + 18 = 30 Wh', '18 Ah בלבד, ללא קשר למתח', '12V × 18Ah = 216A'],
    c: 0,
    e: 'אנרגיה (Wh) = מתח × קיבולת = 12V × 18Ah = 216 Wh. הספק P = V × I. אנרגיה = הספק × זמן.'
  },
  {
    q: 'מדוע הבקר הוא דיגיטלי אבל המנוע אנלוגי? כיצד PWM פותר את הפער?',
    o: ['הבקר מוציא +5V/−5V, המנוע צריך DC. PWM ממיר מתח.', 'הבקר מוציא 0V/5V בלבד. PWM ממתג מהר — הממוצע מדמה ערך אנלוגי.', 'הבקר ממיר AC ל-DC. PWM מסנן רעשים.', 'אין הבדל — PWM רק חוסך חיווט.'],
    c: 1,
    e: 'הבקר (RoboRIO) = דיגיטלי: 0V או 5V בלבד. המנוע צריך מתח רציף. PWM ממתג ON/OFF מהר → ממוצע = ערך אנלוגי.'
  },
  {
    q: 'מה ההבדל בין סטטור לרוטור במנוע Brushless?',
    o: ['סטטור=מסתובב, רוטור=קבוע', 'סטטור=סלילים חשמליים קבועים, רוטור=מגנטים קבועים מסתובבים', 'שניהם מסתובבים יחד', 'סטטור=מגנטים קבועים, רוטור=סלילים מסתובבים'],
    c: 1,
    e: 'סטטור (קבוע): 3 סלילים חשמליים (120° ביניהם) — יוצרים שדה מגנטי מתחלף. רוטור (מסתובב): מגנטים קבועים על הציר שרודפים אחרי השדה.'
  },
  {
    q: 'איך בקר Brushless יודע מתי להחליף זרם בסלילים?',
    o: ['לפי טמפרטורת המנוע', 'לפי חיישן Hall Effect / encoder המודד מיקום הרוטור', 'לפי מהירות הסיבוב בלבד', 'לפי זרם הצריכה'],
    c: 1,
    e: 'הבקר (TalonFX/SparkMax) קורא Hall Effect או encoder → יודע מיקום הרוטור → מחליף זרם בסלילים בזמן הנכון → שדה "רץ" → רוטור רודף.'
  },
  {
    q: 'הגדר: מנהל, מבוקר, שגיאה בהקשר של מערכת בקרה.',
    o: ['מנהל=מנוע, מבוקר=בקר, שגיאה=טמפרטורה', 'מנהל=מחשב הפקודה, מבוקר=המערכת הנשלטת, שגיאה=Xr−Xir', 'מנהל=PID, מבוקר=PWM, שגיאה=Duty Cycle', 'מנהל=חיישן, מבוקר=מנוע, שגיאה=מהירות'],
    c: 1,
    e: 'מנהל (Controller): מחשב את הפקודה. מבוקר (Plant): המערכת הנשלטת. שגיאה: Xr − Xir = הפרש בין המצב הרצוי לנמדד.'
  },
  {
    q: 'מה ההבדל בין הנעה להיגוי בהנעה דיפרנציאלית?',
    o: ['הנעה=ימין/שמאל, היגוי=קדימה/אחורה', 'הנעה=כוח קדימה/אחורה, היגוי=כיוון ע"י הפרש מהירויות בין הגלגלים', 'אין הבדל — אותו מנוע', 'הנעה=מנוע קדמי, היגוי=מנוע אחורי'],
    c: 1,
    e: 'הנעה: מנועים מסובבים גלגלים קדימה/אחורה. היגוי: הפרש מהירויות = פנייה. גלגל שמאל מהיר מימין → פנייה ימינה. רדיוס פנייה = פונקציה של ההפרש.'
  },
  {
    q: 'מה ההבדל בין פיוז לברייקר? מה תפקיד ה-Main Breaker?',
    o: ['פיוז=ניתן לאיפוס, ברייקר=חד-פעמי', 'פיוז=חד-פעמי (נשרף), ברייקר=ניתן לאיפוס ידני. Main Breaker=מנתק הכל.', 'שניהם זהים, רק גדלים שונים', 'פיוז=דיגיטלי, ברייקר=אנלוגי'],
    c: 1,
    e: 'פיוז: חד-פעמי — נשרף בעומס יתר → חייבים להחליף. ברייקר: ניתן לאיפוס — לוחצים שוב. Main Breaker: מנתק את כל חשמל הרובוט.'
  },
  {
    q: 'מנוע צורך 40A ב-12V. כמה זמן תחזיק סוללת 18Ah?',
    o: ['18/40 = 0.45 שעה ≈ 27 דקות', '40/18 ≈ 2.2 שעות', '12 × 40 = 480 דקות', '18 + 40 = 58 דקות'],
    c: 0,
    e: 'זמן = קיבולת / זרם = 18Ah ÷ 40A = 0.45h ≈ 27 דקות. הספק = 12 × 40 = 480W. אנרגיה = 480W × 0.45h = 216Wh = קיבולת הסוללה.'
  }
];

// Topic map for exam scoring
const EXAM_TOPICS_MAP = [
  'מגלול',      // 0
  'מגלול',      // 1
  'הופר',       // 2
  'קלע',        // 3
  'קלע',        // 4
  'טיפוס',      // 5
  'תוכנה',      // 6
  'תוכנה',      // 7
  'תיאוריה',    // 8
  'תיאוריה',    // 9
  'מרכב',       // 10
  'טיפוס',      // 11
  'תיאוריה',    // 12
  'תיאוריה',    // 13
  'תיאוריה',    // 14
  'תיאוריה',    // 15
  'תיאוריה',    // 16
  'מרכב',       // 17
  'מרכב',       // 18
  'טיפוס',      // 19
  'מרכב',       // 20
  'תוכנה',      // 21
  'תוכנה',      // 22
  'תוכנה',      // 23
  'תוכנה',      // 24
  'תיאוריה',    // 25 — CoG stability
  'תיאוריה',    // 26 — gear ratio change
  'תיאוריה',    // 27 — brushless advantage
  'מרכב',       // 28 — wheelbase maneuverability
  'תיאוריה',    // 29 — open vs closed loop
  'תיאוריה',    // 30 — PID integral windup
  'אלקטרוניקה', // 31 — PDH fuse
  'תיאוריה',    // 32 — ArmFeedforward
  'אלקטרוניקה', // 33 — PDH vs PDP
  'מרכב',       // 34 — wheel diameter effect
  'שדה',        // 35 — BUMP design constraint
  'מגלול',      // 36 — intake deploy ratio
  'קלע',        // 37 — hood plates steel→aluminum
  'מנועים',     // 38 — NEO 550 thermal weakness
  'מרכב',       // 39 — CoM height strategy
  'מרכב',       // 40 — swerve module 90° rotation
  'מרכב',       // 41 — mecanum vs swerve
  'מרכב',       // 42 — high CoM consequences
  'תיאוריה',    // 43 — PWM duty cycle definition
  'תיאוריה',    // 44 — open vs closed loop
  'תיאוריה',    // 45 — H-Bridge S1+S4
  'תיאוריה',    // 46 — PWM calculation 50%
  'תיאוריה',    // 47 — IR min distance
  'תיאוריה',    // 48 — kc too large → oscillation
  'אלקטרוניקה', // 49 — mAh ואנרגיה
  'תיאוריה',    // 50 — PWM דיגיטלי/אנלוגי
  'מנועים',     // 51 — Brushless סטטור/רוטור
  'מנועים',     // 52 — Brushless קומוטציה
  'תיאוריה',    // 53 — מערכת בקרה
  'מרכב',       // 54 — הנעה דיפרנציאלית
  'אלקטרוניקה', // 55 — פיוז vs ברייקר
  'אלקטרוניקה', // 56 — חישוב סוללה
];

// ----------------------------------------------------------------
// TOPICS (for topics.html deep-dive content)
// ----------------------------------------------------------------
const TOPICS = [
  {
    key: 'bagrut_theory',
    icon: '📝',
    title: 'תיאוריה כללית — הכנה לבגרות',
    desc: 'חומר תיאורתי לפי רמות הבוחן: ידע · הבנה · ניתוח',
    content: `
<div class="highlight" style="background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.3)">
<strong>📝 תיאוריה כללית לבגרות</strong> — חומר זה חל על <em>כל הרובוטים</em>, לא FRC בלבד. שאלות הבוחן מסודרות לפי 3 רמות: <span class="lvl lvl-1">ידע</span> <span class="lvl lvl-2">הבנה</span> <span class="lvl lvl-3">ניתוח</span>
</div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📊 רמות שאלות הבוחן</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>רמה</th><th>שאלה אופיינית</th><th>מה נדרש</th></tr>
<tr><td><span class="lvl lvl-1">1 ידע</span></td><td>"מה זה?"</td><td>הגדרת מושג — עובדה ישירה</td></tr>
<tr><td><span class="lvl lvl-2">2 הבנה</span></td><td>"מה זה עושה / איך עובד?"</td><td>הסבר תפקיד, קשר בין מרכיבים</td></tr>
<tr><td><span class="lvl lvl-3">3 ניתוח</span></td><td>"למה? מה יקרה אם נשנה X?"</td><td>חשיבה ביקורתית, הסבר תוצאה</td></tr>
</table>
<p style="margin-top:10px;font-size:.82rem;color:var(--muted)">💡 ברמה 3 — הסבירו את השרשרת הסיבתית: X → Y → Z. אל תסתפקו ב"כן/לא".</p>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🤖 מבנה הרובוט ומערכת הנעה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>מידות ויציבות:</strong> נקודות משען רחוקות = יציבות↑ תמרון↓</p>
<p><span class="lvl lvl-1">ידע</span> <strong>סוגי גלגלים:</strong></p>
<ul style="margin:6px 0 10px 0;padding-right:18px">
<li><strong>רגיל:</strong> היקף הגלגל קובע מהירות (v = ω × r) — תנועה קדימה/אחורה בלבד</li>
<li><strong>אומני:</strong> רולים על ציר אנכי — תנועה צדית חופשית</li>
<li><strong>מקאנום:</strong> רולים בזווית 45° — כוח צדי + קדמי → holonomic</li>
</ul>
<p><span class="lvl lvl-2">הבנה</span> <strong>שיטות ניהוג:</strong></p>
<table class="tbl">
<tr><th>שיטה</th><th>עיקרון</th><th>יתרון</th></tr>
<tr><td>סינכרוני</td><td>כל הגלגלים אותו כיוון ומהירות</td><td>פשוט, תנועה ישרה מדויקת</td></tr>
<tr><td>דיפרנציאלי</td><td>הפרש מהירויות בין צדדים = סיבוב</td><td>פשוט, אמין, כוח דחיפה</td></tr>
<tr><td>סוורב (Swerve)</td><td>2 מנועים למודולה = כיוון + הנעה</td><td>חופש תנועה מלא (holonomic)</td></tr>
</table>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"מה יקרה אם נגדיל את רוחב הרובוט?"<br>
→ ציר המשען מתרחק → <strong>יציבות עולה</strong> → קשה יותר להפיל<br>
→ אך: רדיוס הפנייה גדל → <strong>תמרון יורד</strong><br>
→ trade-off: אי אפשר לקבל יציבות מקסימלית + תמרון מקסימלי בו-זמנית
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚖️ מרכז כובד</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>הגדרה:</strong> נקודה שבה מרוכזת כל מסת הגוף תיאורטית.</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>2 תנאים לרובוט יציב:</strong></p>
<ol style="padding-right:18px">
<li>מרכז הכובד נמוך ככל האפשר מהרצפה</li>
<li>מרכז הכובד קרוב לאמצע הסימטריה של נקודות המשען</li>
</ol>
<p><span class="lvl lvl-2">הבנה</span> <strong>מומנט = מרחק × כוח</strong></p>
<p>CoG גבוה → מרחק גדול מציר → מומנט גדול → קל יותר להפיל</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>שינוי מיקום מסות = שינוי מרכז כובד:</strong> מסה כבדה גבוה → CoG עולה. מסה כבדה נמוך → CoG יורד.</p>
<svg viewBox="0 0 400 220" style="max-width:100%;display:block;margin:10px 0" xmlns="http://www.w3.org/2000/svg">
  <!-- Left: High CoG -->
  <rect x="30" y="80" width="100" height="80" rx="6" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <circle cx="80" cy="50" r="10" fill="#ef4444" stroke="none"/>
  <text x="80" y="46" text-anchor="middle" fill="#f1f5f9" font-size="9" font-family="inherit">CoG</text>
  <line x1="80" y1="60" x2="80" y2="80" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="30" y1="165" x2="130" y2="165" stroke="#ef4444" stroke-width="2"/>
  <text x="80" y="180" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">ציר (pivot)</text>
  <line x1="80" y1="50" x2="30" y2="165" stroke="rgba(239,68,68,.3)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="40" y="108" fill="#ef4444" font-size="10" font-family="inherit" transform="rotate(-55,40,108)">מרחק</text>
  <text x="80" y="30" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600" font-family="inherit">CoG גבוה</text>
  <text x="80" y="200" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">מומנט גדול ← קל להפיל</text>
  <!-- Right: Low CoG -->
  <rect x="270" y="80" width="100" height="80" rx="6" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <circle cx="320" cy="120" r="10" fill="#22c55e" stroke="none"/>
  <text x="320" y="116" text-anchor="middle" fill="#16161f" font-size="9" font-weight="700" font-family="inherit">CoG</text>
  <line x1="270" y1="165" x2="370" y2="165" stroke="#22c55e" stroke-width="2"/>
  <text x="320" y="180" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">ציר (pivot)</text>
  <line x1="320" y1="120" x2="270" y2="165" stroke="rgba(34,197,94,.3)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="280" y="145" fill="#22c55e" font-size="10" font-family="inherit" transform="rotate(-50,280,145)">מרחק</text>
  <text x="320" y="30" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="600" font-family="inherit">CoG נמוך</text>
  <text x="320" y="200" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">מומנט קטן ← יציב</text>
  <!-- Center arrow -->
  <text x="200" y="115" text-anchor="middle" fill="#64748b" font-size="22" font-family="inherit">↔</text>
  <text x="200" y="135" text-anchor="middle" fill="#64748b" font-size="9" font-family="inherit">מומנט = מרחק × כוח</text>
</svg>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"אם נעביר סוללה מלמטה למעלה — מה יקרה?"<br>
→ מסת הסוללה (הרכיב הכבד ביותר) עוברת לגבוה<br>
→ מרכז הכובד עולה → מרחק מציר המשען גדל<br>
→ מומנט גדל → <strong>יציבות יורדת</strong> — קל יותר להפיל את הרובוט
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ מנועים חשמליים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>DC vs AC:</strong> DC = סוללה (ברובוט). AC = חשמל ביתי (אין ברובוט) → לא משתמשים.</p>
<p><span class="lvl lvl-1">ידע</span> <strong>מבנה מנוע DC:</strong></p>
<ul style="padding-right:18px">
<li><strong>סטטור:</strong> החלק הקבוע — מגנטים קבועים</li>
<li><strong>רוטור:</strong> החלק המסתובב — אלקטרומגנט שמופעל ע"י זרם</li>
</ul>
<p><span class="lvl lvl-2">הבנה</span> <strong>Brushed vs Brushless:</strong></p>
<table class="tbl">
<tr><th>סוג</th><th>קומוטציה</th><th>יעילות</th><th>תחזוקה</th><th>מחיר</th></tr>
<tr><td>Brushed</td><td>מכנית (קומוטטור + מברשות)</td><td class="con">75–80%</td><td class="con">מברשות מתבלות</td><td class="pro">זול</td></tr>
<tr><td>Brushless</td><td>אלקטרונית (Hall Effect)</td><td class="pro">90–95%</td><td class="pro">מינימלית</td><td class="con">יקר</td></tr>
<tr><td>Servo רגיל</td><td>אלקטרונית</td><td>80–85%</td><td>נמוכה</td><td>בינוני</td></tr>
</table>
<p><span class="lvl lvl-2">הבנה</span> <strong>סרוו:</strong></p>
<ul style="padding-right:18px">
<li><strong>Servo רגיל:</strong> זווית קבועה בלבד (0–180°) — לא מסתובב ברציפות</li>
<li><strong>Servo 360 (VEX):</strong> ללא הגבלת זווית — מסתובב ברציפות כמו מנוע</li>
</ul>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"למה לא משתמשים במנוע AC ברובוט?"<br>
→ הסוללה מייצרת DC בלבד<br>
→ מנוע AC דורש מתח AC (חשמל ביתי / אינוורטר)<br>
→ הוספת אינוורטר = משקל + מורכבות + הפסדי אנרגיה נוספים<br>
→ לכן: <strong>רק מנועי DC</strong> ברובוטים הפועלים על סוללה
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📡 PWM ו-H-Bridge</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>PWM (Pulse Width Modulation):</strong> ממתג ON-OFF בתדר גבוה. הממוצע = מתח יעיל = מהירות מנוע.</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>Duty Cycle = זמן ON / זמן כולל × 100%</strong></p>
<p>מתח ממוצע = מתח סוללה × Duty Cycle</p>
<svg viewBox="0 0 500 275" style="max-width:100%;display:block;margin:10px 0" xmlns="http://www.w3.org/2000/svg">
  <text x="308" y="31" fill="#64748b" font-size="11" font-family="inherit">0% — מתח ממוצע: 0.0V (כבוי)</text>
  <rect x="0" y="18" width="300" height="22" rx="3" fill="rgba(255,255,255,.05)"/>
  <text x="308" y="81" fill="#64748b" font-size="11" font-family="inherit">25% — מתח ממוצע: 3.0V</text>
  <rect x="0" y="68" width="75" height="22" rx="3" fill="#22c55e" opacity=".8"/>
  <rect x="75" y="68" width="225" height="22" rx="3" fill="rgba(255,255,255,.05)"/>
  <text x="308" y="131" fill="#64748b" font-size="11" font-family="inherit">50% — מתח ממוצע: 6.0V</text>
  <rect x="0" y="118" width="150" height="22" rx="3" fill="#22c55e" opacity=".8"/>
  <rect x="150" y="118" width="150" height="22" rx="3" fill="rgba(255,255,255,.05)"/>
  <text x="308" y="181" fill="#64748b" font-size="11" font-family="inherit">75% — מתח ממוצע: 9.0V</text>
  <rect x="0" y="168" width="225" height="22" rx="3" fill="#22c55e" opacity=".8"/>
  <rect x="225" y="168" width="75" height="22" rx="3" fill="rgba(255,255,255,.05)"/>
  <text x="308" y="231" fill="#64748b" font-size="11" font-family="inherit">100% — מתח ממוצע: 12.0V (כוח מלא)</text>
  <rect x="0" y="218" width="300" height="22" rx="3" fill="#22c55e" opacity=".8"/>
  <line x1="0" y1="252" x2="300" y2="252" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
  <text x="150" y="267" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">זמן (period) ←</text>
  <rect x="0" y="252" width="12" height="10" rx="1" fill="#22c55e" opacity=".8"/><text x="16" y="261" fill="#64748b" font-size="10" font-family="inherit">HIGH</text>
  <rect x="55" y="252" width="12" height="10" rx="1" fill="rgba(255,255,255,.07)"/><text x="71" y="261" fill="#64748b" font-size="10" font-family="inherit">LOW</text>
</svg>
<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin:8px 0">
  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span style="font-size:.78rem;color:var(--muted)">Duty Cycle:</span>
    <input type="range" min="0" max="100" value="50" id="pwmSlider" oninput="pwmUpdate(this.value)" style="flex:1;min-width:100px;accent-color:#22c55e">
    <span id="pwmPct" style="font-weight:700;color:#22c55e;font-size:.85rem;min-width:36px">50%</span>
  </div>
  <div id="pwmDisplay" style="font-size:.78rem;color:var(--muted);margin-top:4px">מתח ממוצע: 6.0V = 12V × 0.50</div>
  <svg id="pwmLive" viewBox="0 0 300 28" style="max-width:100%;display:block;margin-top:6px" xmlns="http://www.w3.org/2000/svg">
    <rect id="pwmHigh" x="0" y="2" width="150" height="22" rx="3" fill="#22c55e" opacity=".85"/>
    <rect id="pwmLow" x="150" y="2" width="150" height="22" rx="3" fill="rgba(255,255,255,.05)"/>
  </svg>
</div>
<p><span class="lvl lvl-2">הבנה</span> <strong>למה לא רזיסטור?</strong> רזיסטור מוריד מתח ע"י בזבוז אנרגיה כחום. PWM לא מאבד אנרגיה — יעיל.</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>H-Bridge — 4 מפסקים לשליטה בכיוון הזרם:</strong></p>
<div style="margin:12px 0">
<svg id="hbSvg" viewBox="0 0 400 290" style="max-width:100%;display:block" xmlns="http://www.w3.org/2000/svg">
  <text x="200" y="14" text-anchor="middle" fill="#f1f5f9" font-size="13" font-family="inherit">+12V</text>
  <text x="200" y="285" text-anchor="middle" fill="#64748b" font-size="13" font-family="inherit">GND</text>
  <line x1="85" y1="28" x2="315" y2="28" stroke="#64748b" stroke-width="1.5"/>
  <line x1="85" y1="258" x2="315" y2="258" stroke="#64748b" stroke-width="1.5"/>
  <line x1="85" y1="62" x2="85" y2="222" stroke="#64748b" stroke-width="1.5"/>
  <line x1="315" y1="62" x2="315" y2="222" stroke="#64748b" stroke-width="1.5"/>
  <line x1="200" y1="16" x2="200" y2="28" stroke="#64748b" stroke-width="1.5"/>
  <line x1="200" y1="258" x2="200" y2="272" stroke="#64748b" stroke-width="1.5"/>
  <line x1="85" y1="144" x2="158" y2="144" stroke="#64748b" stroke-width="1.5"/>
  <line x1="242" y1="144" x2="315" y2="144" stroke="#64748b" stroke-width="1.5"/>
  <rect id="hb-s1" x="55" y="28" width="60" height="34" rx="6" fill="rgba(255,255,255,.08)" style="cursor:pointer;transition:fill .3s ease"/>
  <text x="85" y="50" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="600" font-family="inherit" style="pointer-events:none">S1</text>
  <rect id="hb-s3" x="285" y="28" width="60" height="34" rx="6" fill="rgba(255,255,255,.08)" style="cursor:pointer;transition:fill .3s ease"/>
  <text x="315" y="50" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="600" font-family="inherit" style="pointer-events:none">S3</text>
  <rect id="hb-s2" x="55" y="222" width="60" height="34" rx="6" fill="rgba(255,255,255,.08)" style="cursor:pointer;transition:fill .3s ease"/>
  <text x="85" y="244" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="600" font-family="inherit" style="pointer-events:none">S2</text>
  <rect id="hb-s4" x="285" y="222" width="60" height="34" rx="6" fill="rgba(255,255,255,.08)" style="cursor:pointer;transition:fill .3s ease"/>
  <text x="315" y="244" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="600" font-family="inherit" style="pointer-events:none">S4</text>
  <circle cx="200" cy="144" r="40" fill="#16161f" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <text x="200" y="139" text-anchor="middle" fill="#f1f5f9" font-size="18" font-weight="700" font-family="inherit">M</text>
  <text x="200" y="157" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">מנוע</text>
  <g id="hb-fwd" style="display:none">
    <path d="M200,22 L200,28 L85,28 L85,144 L158,144" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-dasharray="8,5" stroke-linecap="round">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.2s" repeatCount="indefinite"/>
    </path>
    <path d="M242,144 L315,144 L315,258 L200,258 L200,272" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-dasharray="8,5" stroke-linecap="round">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.2s" repeatCount="indefinite"/>
    </path>
  </g>
  <g id="hb-rev" style="display:none">
    <path d="M200,272 L200,258 L85,258 L85,144 L158,144" stroke="#ffd166" stroke-width="2.5" fill="none" stroke-dasharray="8,5" stroke-linecap="round">
      <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1.2s" repeatCount="indefinite"/>
    </path>
    <path d="M242,144 L315,144 L315,28 L200,28 L200,18" stroke="#ffd166" stroke-width="2.5" fill="none" stroke-dasharray="8,5" stroke-linecap="round">
      <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1.2s" repeatCount="indefinite"/>
    </path>
  </g>
</svg>
<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:8px">
  <button onclick="hbridge('forward')" style="background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:#22c55e;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .3s">קדימה ▶</button>
  <button onclick="hbridge('reverse')" style="background:rgba(255,209,102,.1);border:1px solid rgba(255,209,102,.3);color:#ffd166;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .3s">◀ אחורה</button>
  <button onclick="hbridge('stop')" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#64748b;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .3s">עצירה ■</button>
</div>
<div id="hb-lbl" style="text-align:center;font-size:.78rem;color:#64748b;margin-top:6px">לחץ כפתור לראות זרם</div>
</div>
<p><span class="lvl lvl-1">ידע</span> <strong>Kill-Power (NC):</strong> מפסק חרום נורמלי-סגור — חיתוך מיידי. <strong>Start button (NO):</strong> מפעיל רובוט.</p>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"אם Duty Cycle = 75% ומתח סוללה = 12V, מה המתח הממוצע?"<br>
→ מתח ממוצע = 12 × 0.75 = <strong>9V</strong><br>
"מה יקרה אם נשתמש ב-Duty Cycle = 0% לעצירה?"<br>
→ מתח ממוצע = 0V → מנוע עוצר — אך ללא בלימה פעילה (STOP() מוסיף בלימה)
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>👁️ חיישנים ואותות</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>דיגיטלי:</strong> 2 ערכים בלבד — 0V (LOW) או 5V (HIGH). דוגמאות: UV sensor, לחצן, מיקרופון.</p>
<p><span class="lvl lvl-1">ידע</span> <strong>אנלוגי:</strong> ערכים רציפים בטווח (0–5V). דוגמאות: IR, עקיבת קו.</p>
<table class="tbl">
<tr><th>חיישן</th><th>סוג אות</th><th>טווח</th><th>עיקרון</th></tr>
<tr><td>US אולטרסוני</td><td>דיגיטלי/אנלוגי</td><td>3–300 ס"מ</td><td>S = V × t, V = 330 m/s, 40kHz</td></tr>
<tr><td>IR GP2D12</td><td>אנלוגי</td><td>10–80 ס"מ</td><td>טריאנגולציה — זווית קרן חוזרת</td></tr>
<tr><td>UV (אש)</td><td>דיגיטלי</td><td>185–260 nm</td><td>קרינת UV מלהבה</td></tr>
</table>
<svg viewBox="0 0 550 180" style="max-width:100%;display:block;margin:12px 0" xmlns="http://www.w3.org/2000/svg">
  <!-- Robot icon left -->
  <rect x="8" y="55" width="36" height="28" rx="4" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
  <circle cx="14" cy="88" r="5" fill="#16161f" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
  <circle cx="38" cy="88" r="5" fill="#16161f" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
  <text x="26" y="73" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">רובוט</text>
  <!-- Wall icon right -->
  <line x1="530" y1="45" x2="530" y2="140" stroke="rgba(255,255,255,.15)" stroke-width="3"/>
  <text x="535" y="100" fill="#64748b" font-size="8" font-family="inherit">קיר</text>
  <!-- Scale: x=50 → 0cm, x=530 → 300cm, scale=1.6px/cm -->
  <!-- X axis -->
  <line x1="50" y1="140" x2="530" y2="140" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
  <!-- Tick marks and labels at 0, 50, 100, 150, 200, 250, 300 cm -->
  <line x1="50" y1="140" x2="50" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="50" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">0</text>
  <line x1="130" y1="140" x2="130" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="130" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">50</text>
  <line x1="210" y1="140" x2="210" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="210" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">100</text>
  <line x1="290" y1="140" x2="290" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="290" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">150</text>
  <line x1="370" y1="140" x2="370" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="370" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">200</text>
  <line x1="450" y1="140" x2="450" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="450" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">250</text>
  <line x1="530" y1="140" x2="530" y2="147" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  <text x="530" y="157" text-anchor="middle" fill="#64748b" font-size="8" font-family="inherit">300 ס"מ</text>
  <!-- US bar: 3–300 cm = x=54.8 to x=530 -->
  <rect x="55" y="60" width="474" height="22" rx="3" fill="rgba(34,197,94,.65)" style="cursor:default">
    <title>US אולטרסוני — טווח 3–300 ס"מ</title>
  </rect>
  <text x="60" y="75" fill="#16161f" font-size="9" font-weight="600" font-family="inherit">US אולטרסוני — 3 עד 300 ס"מ</text>
  <!-- IR bar: 10–80 cm = x=66 to x=178 -->
  <rect x="66" y="88" width="112" height="22" rx="3" fill="rgba(255,209,102,.7)" style="cursor:default">
    <title>IR GP2D12 — טווח 10–80 ס"מ</title>
  </rect>
  <text x="70" y="103" fill="#16161f" font-size="9" font-weight="600" font-family="inherit">IR GP2D12 — 10–80 ס"מ</text>
  <!-- IR dead zone: 0–10 cm = x=50 to x=66 -->
  <rect x="50" y="88" width="16" height="22" rx="2" fill="rgba(239,68,68,.7)" style="cursor:default">
    <title>IR — טווח שגוי מתחת ל-10 ס"מ</title>
  </rect>
  <text x="50" y="127" fill="#ef4444" font-size="8" font-family="inherit">⚠ טווח שגוי</text>
  <line x1="58" y1="124" x2="58" y2="112" stroke="#ef4444" stroke-width="1"/>
</svg>
<p><span class="lvl lvl-2">הבנה</span> <strong>הערות חשובות:</strong></p>
<ul style="padding-right:18px">
<li><strong>US:</strong> S = V × t (t = זמן הלוך-חזור). V = 330 m/s, תדר 40kHz</li>
<li><strong>IR מתחת 10 ס"מ:</strong> קריאה שגויה — טריאנגולציה דורשת מרחק מינימלי</li>
<li><strong>IR:</strong> מרחק עולה → מתח יורד (קשר הפוך)</li>
</ul>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"מדוע חיישן IR שגוי מתחת ל-10 ס"מ?"<br>
→ שיטת הטריאנגולציה מחשבת מרחק לפי זווית הקרן החוזרת<br>
→ מתחת ל-10 ס"מ הזווית קטנה מדי לזיהוי מדויק<br>
→ הקרן החוזרת עלולה ליפול מחוץ לטווח החיישן → קריאת שגיאה
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 אלגוריתם ובקרה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>חוג פתוח (Open Loop):</strong> פקודה → פעולה, ללא משוב. לא יודע מה קרה → לא מדויק.</p>
<p><span class="lvl lvl-1">ידע</span> <strong>חוג סגור (Closed Loop):</strong> פקודה → פעולה → מדידה → תיקון → לולאה חוזרת.</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>משתני בקרה:</strong></p>
<table class="tbl">
<tr><th>משתנה</th><th>משמעות</th></tr>
<tr><td>Xr</td><td>מרחק רצוי (Reference)</td></tr>
<tr><td>Xir</td><td>מרחק נמדד (Measured)</td></tr>
<tr><td>error = Xr − Xir</td><td>הפרש: מה חסר לנו</td></tr>
<tr><td>mor / mol</td><td>מהירות בסיס ימין / שמאל</td></tr>
<tr><td>mr / ml</td><td>מהירות מתוקנת ימין / שמאל</td></tr>
<tr><td>kc</td><td>קבוע תיקון (gain)</td></tr>
</table>
<p><span class="lvl lvl-2">הבנה</span> <strong>אלגוריתם תיקון:</strong></p>
<div class="diagram">error = Xr - Xir
mr = mor + (kc × error)   // ימין: מוסיף תיקון
ml = mol - (kc × error)   // שמאל: מחסיר תיקון</div>
<p><span class="lvl lvl-2">הבנה</span> <strong>פקודות קוד אופייניות:</strong></p>
<div class="diagram">front = get analog input(4);       // קריאת IR
UV    = get digital input(2);       // קריאת UV
set motor(2, -80);                  // פורט 2, 80%, שמאל
set digital output(9, 1);          // LED פורט 9
STOP();                             // עצירה עם בלימה — מונע drift</div>
<p><span class="lvl lvl-2">הבנה</span> <strong>PID — 3 רכיבים:</strong></p>
<ul style="padding-right:18px">
<li><strong>P (Proportional):</strong> יחסי לשגיאה הנוכחית — תיקון מהיר</li>
<li><strong>I (Integral):</strong> מצטבר שגיאות — מתקן שגיאה קבועה (steady-state error)</li>
<li><strong>D (Derivative):</strong> נגזרת שינוי השגיאה — מונע overshoot</li>
</ul>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
"מה יקרה אם kc גדול מדי?"<br>
→ כל שגיאה קטנה מייצרת תיקון גדול<br>
→ תנועות חדות וחריפות<br>
→ <strong>אוסצילציה</strong> — הרובוט מתנדנד סביב היעד ולא מייצב
</div>
</div></div>

<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — הגדרת PWM, H-Bridge, מרכז כובד, חוג פתוח/סגור. רמה 2 — Duty Cycle שולט במהירות, H-Bridge הופך כיוון, PID מתקן שגיאה. רמה 3 — מה אם Duty Cycle = 75%? מה אם kc גדול? מה אם CoG גבוה?</div>`
  },
  {
    key: 'drivetrain',
    icon: '🏎️',
    title: 'מרכב',
    desc: 'Swerve Drive MK4N, FOC, Odometry, Vision Fusion',
    content: `
<div class="highlight green"><strong>למה Swerve?</strong> הרובוט נע לכל כיוון ללא סיבוב הגוף — מאפשר תמרון מהיר והגנה מפני יריבים.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔩 שלדה ובנייה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>פרופילי אלומיניום <strong>50×25 מ"מ</strong> בתצורה מלבנית. מודולות קדמיות סובבו <strong>90°</strong> לפנות מקום לאינטייק ולקלע.</p>
<p>מנועים: <strong>Talon FX (Falcon)</strong> — שליטה מדויקת + ניצול אנרגיה חכם. יחס <strong>1:5.9</strong>.</p>
<figure>
<img src="images/image58.png" loading="lazy" alt="שלדה">
<figcaption>שלדת הרובוט ומודולות הסווארב מלמעלה</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚙️ איך עובדת מודולת Swerve?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>כל מודולה = <strong>2 מנועים עצמאיים</strong>: מנוע כיוון (Steer) + מנוע הנעה (Drive).</p>
<p>4 מודולות → holonomic motion: נסיעה לצד, תמרון מהיר, סיבוב תוך כדי נסיעה.</p>
<figure>
<img src="images/image73.png" loading="lazy" alt="מודולות סווארב">
<figcaption>4 מודולות סווארב על שולחן העבודה</figcaption>
</figure>
<figure>
<img src="images/image20.png" loading="lazy" alt="קינמטיקה">
<figcaption>וקטורי תנועה בסווארב</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📍 Odometry + Vision Fusion</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Odometry:</strong> אינטגרציה של מהירות גלגלים + gyro → מיקום בסנטימטרים. חיסרון: drift מצטבר.</p>
<p><strong>Vision (SolvePnP + AprilTags):</strong> מיקום מוחלט ±2 ס"מ, ללא drift.</p>
<p><strong>Kalman Filter:</strong> ממוצע משוכלל → ±1.5 ס"מ — טוב יותר משניהם לחוד.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🎮 FOC + מגבלות תאוצה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>FOC:</strong> "קדימה" = כיוון המגרש, ללא קשר לסיבוב הרובוט. חיסור זווית gyro מוקטור המהירות.</p>
<p><strong>מגבלות תאוצה:</strong> מונעות wheel slip → נסיעה חלקה + אודומטריה מדויקת.</p>
<figure>
<img src="images/image8.png" loading="lazy" alt="FOC">
<figcaption>נהיגה מוכוונת שדה לעומת נהיגה מוכוונת רובוט</figcaption>
</figure>
</div></div>`
  },
  {
    key: 'intake',
    icon: '🤏',
    title: 'מגלול',
    desc: 'Four-bar linkage, פוליקרבונט, ציר חורו, מיסבים',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> מנגנון ציר סיבוב שלא נשבר בעת פגיעה — מפחית downtime בתחרות.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔗 מנגנון Four-Bar</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>מבוסס <strong>ציר סיבוב</strong>, לא תנועה ליניארית. בעת התנגשות — האינטייק "בורח" כלפי מעלה ולא נשבר, חוזר מיד לפעולה.</p>
<figure>
<img src="images/image10.png" loading="lazy" alt="מנגנון האיסוף">
<figcaption>מנגנון האיסוף – גלגלים ורולרים</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧱 פוליקרבונט + ציר חורו</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>פוליקרבונט:</strong> מתגמש בספיגת מכה וחוזר לצורתו (≠ אלומיניום). קל יותר → CoG נמוך.</p>
<p><strong>ציר חורו (Churro):</strong> צינור אלומיניום משושה. <strong>מיסבים פנימיים</strong> נכנסים לפעולה תחת לחץ → סיבוב חלק.</p>
<figure>
<img src="images/image17.png" loading="lazy" alt="מבט קדמי על האינטייק">
<figcaption>מבט קדמי על מערכת האיסוף</figcaption>
</figure>
</div></div>`
  },
  {
    key: 'hopper',
    icon: '📦',
    title: 'הופר',
    desc: 'מסוע שיפוע, גלגלי מקאנום, מנגנון הרחבה',
    content: `
<div class="highlight green"><strong>תפקיד:</strong> קבלת כדורים מהאינטייק → אחסון → הזנה מדויקת לקלע.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📋 4 שלבי ההופר</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>① <strong>איסוף</strong> מהאינטייק → ② <strong>מסוע שיפוע</strong> (קדימה) → ③ <strong>גלגלי מקאנום</strong> (מירכוז) → ④ <strong>הזנה</strong> לקלע.</p>
<figure>
<img src="images/image10.png" loading="lazy" alt="הופר">
<figcaption>מנגנון ההובלה בהופר</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>↔️ גלגלי מקאנום — כיצד מרכזים?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>רולים בזווית <strong>45°</strong> יוצרים מרכיב כוח צדי. שתי שורות משני צידים ← משכות הכדור לאמצע.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📐 מנגנון הרחבה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>הקיר הקדמי נפתח כלפי חוץ — מגדיל נפח לאחסון כדורים נוספים. שימושי לאיסוף מהיר.</p>
</div></div>`
  },
  {
    key: 'shooter',
    icon: '🎯',
    title: 'קלע',
    desc: 'גלגלי ירי, Hood, ירי בתנועה, סימולציה פיזיקלית',
    content: `
<div class="highlight green"><strong>אתגר:</strong> לירות מדויק מכל מרחק, גם בזמן תנועה מלאה.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚙️ מבנה הקלע</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>גלגלי ירי במהירות גבוהה + חגורות טימינג (העברה) + <strong>Hood</strong> (מסלול עליון מתכוונן).</p>
<p>Hood שולט בזווית יציאה → ירי מכל מרחק ללא שינוי מהירות גלגלים.</p>
<figure>
<img src="images/image50.png" loading="lazy" alt="מנגנון הקלע">
<figcaption>מנגנון הקלע – מידול תלת-מימדי</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 סימולציה פיזיקלית</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>מתחשבת ב: <strong>כבידה</strong>, <strong>חיכוך אוויר</strong>, <strong>כוח מגנוס</strong> (כדור מסתובב = הפרש לחץ = עיקול).</p>
<p>מוצא פתרון "אופטימלי" = עמיד לשגיאות ב-1°. נשמר בקוד, אינטרפולציה כפולה.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🚗 ירי בתנועה מלאה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>מפרקים מהירות הרובוט ← כיוון מטרה + מאונך. מחשבים זמן תעופה → סטייה צדדית → מוסיפים לנקודת ירי. חוזרים עד התכנסות.</p>
<figure>
<img src="images/image1.png" loading="lazy" alt="גרף ירי">
<figcaption>גרף זווית ומהירות ירי לפי מרחק</figcaption>
</figure>
</div></div>`
  },
  {
    key: 'climber',
    icon: '🧗',
    title: 'טיפוס',
    desc: 'מעלית 1:64, ראצ\'ט, פרופיל יחיד, Wear-In',
    content: `
<div class="highlight green"><strong>משימה:</strong> להרים ~50 ק"ג בשניות האחרונות — עם מינימום מאמץ מהנהג.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🏗️ מבנה המעלית</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>מחליקה על פרופיל <strong>40×40 מ"מ</strong> (פרופיל יחיד — חסכנו 3.5 ק"ג).</p>
<p><strong>Wear-In:</strong> מיסבי ±0.005 מ"מ שוחקים פרופיל → התאמה מושלמת. המעלית משתפרת עם שימוש!</p>
<figure>
<img src="images/image84.png" loading="lazy" alt="מערכת הטיפוס">
<figcaption>מערכת הטיפוס – וו ומעלית</figcaption>
</figure>
<figure>
<img src="images/image51.png" loading="lazy" alt="CNC">
<figcaption>בלוק מיסבים לאחר כרסום CNC – דיוק ±0.005 מ״מ</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚙️ תמסורת 1:64 + ראצ\'ט</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>ראצ\'ט 1:32 × שרשרת #35 (9:18) 1:2 × שרשרת (10:10) 1:1 = <strong>1:64</strong>. טורק ×64.</p>
<p><strong>ראצ\'ט:</strong> מנגנון מכני — מונע ירידה ללא כוח מנוע. המנוע לא מחזיק משקל כל הזמן.</p>
</div></div>`
  },
  {
    key: 'software',
    icon: '💻',
    title: 'תוכנה',
    desc: 'FSM, PID + Feedforward, Vision, IO Pattern, AdvantageKit',
    content: `
<div class="highlight green"><strong>גישה:</strong> בהשראת קבוצות Top World (254, 1690, 2910, 6328) — ספרייה מראש, סימולציה, IO separation.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🤖 FSM — Finite State Machine</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>הרובוט תמיד במצב אחד מוגדר. מעברים לפי תנאים. לדוגמה — קלע: IDLE → SPINNING_UP → READY_TO_FIRE → FIRING → IDLE.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🎯 PID + Feedforward</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>PID:</strong> P=שגיאה נוכחית, I=מצבר, D=שיעור שינוי. <strong>Feedforward:</strong> חישוב כוח לפי פיזיקה מראש.</p>
<p>ביחד = שליטה מהירה ומדויקת — FF מגיע קרוב, PID מדייק.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📷 Vision — SolvePnP + AprilTags</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>SolvePnP:</strong> AprilTag בתמונה → Pose 6DOF מוחלט. <strong>אמינות:</strong> מרחק מטאג, כמות טאגים, מרחק משוליים.</p>
<p><strong>Kalman:</strong> Odometry ±5 ס"מ + Vision ±2 ס"מ → ±1.5 ס"מ.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🕹️ IO Separation + AdvantageKit</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>IO Pattern:</strong> ממשק נפרד — אותה לוגיקה לסימולציה וברובוט אמיתי. בדיקה לפני מגע ברובוט.</p>
<p><strong>AdvantageKit:</strong> הקלטת כל IO → שידור חוזר בסימולציה → debug לאחר תחרות.</p>
</div></div>`
  },
  {
    key: 'theory',
    icon: '📐',
    title: 'תיאוריה',
    desc: 'מנועים, PWM, H-Bridge, תמסורות, CANbus',
    content: `
<div class="highlight green"><strong>בסיס:</strong> כל מה שהבגרות שואלת — מנועים, אלקטרוניקה, תקשורת.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔌 Brushed vs Brushless</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Brushed:</strong> קומוטטור + מברשות פחם מחליפים זרם. יעיל ~75–80%. מברשות מתבלות.</p>
<p><strong>Brushless:</strong> קומוטציה אלקטרונית (Hall Effect). יעיל ~90–95%. תחזוקה מינימלית. כוח/משקל גבוה.</p>
<figure>
<img src="images/image6.png" loading="lazy" alt="מנוע DC">
<figcaption>חתך רוחב של מנוע DC עם מברשות</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📡 PWM — Pulse Width Modulation</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>Duty Cycle = זמן_ON / זמן_כולל × 100%. 75% = האות גבוה 3/4 מהזמן.</p>
<p>מתח אפקטיבי = Duty Cycle × מתח מקס. 75% × 12V = 9V אפקטיבי.</p>
<p>חוסך אנרגיה לעומת רזיסטור (שיבזבז אנרגיה כחום).</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🌉 H-Bridge</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>4 מפסקים: <strong>S1+S4</strong> = זרם קדימה (A→B). <strong>S2+S3</strong> = זרם אחורה (B→A). שניהם פתוחים = עצירה.</p>
<p>PWM + H-Bridge = שליטה מלאה על מהירות וכיוון.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚙️ תמסורות</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>תמסורת N:1: טורק ×N, מהירות ÷N. <strong>שימור הספל</strong>.</p>
<p>מרכב 1:5.9 (מהיר) | זרוע 1:36 (חזק) | טיפוס 1:64 (עצום).</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📻 CANbus</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>2 חוטים: CAN-Hi + CAN-Lo. כל רכיב עם ID ייחודי. תקשורת <strong>דו-כיוונית</strong>: ניטור זרם/מתח/טמפ\'.</p>
<p>PWM = חד-כיווני + חוט נפרד לכל רכיב. CAN = רשת אחת לכולם.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔄 FOC — בקרה מכוונת שדה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>FOC (Field-Oriented Control)</strong> — "קדימה" = כיוון המגרש, ללא קשר לסיבוב הרובוט. חיסור זווית הג\'יירו מוקטור המהירות.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📐 PID — לולאת בקרה סגורה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>PID:</strong> P=שגיאה נוכחית, I=מצבר שגיאות לאורך זמן, D=שיעור שינוי. ביחד עם Feedforward — שליטה מהירה ומדויקת.</p>
<figure>
<img src="images/image4.png" loading="lazy" alt="PID">
<figcaption>דיאגרמת PID מלוח המורה</figcaption>
</figure>
<svg viewBox="0 0 600 200" style="max-width:100%;display:block;margin:14px 0" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="pid-arr" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#64748b"/>
    </marker>
    <marker id="pid-arr-g" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#22c55e"/>
    </marker>
  </defs>
  <!-- Boxes: קלט רצוי, ∑, PID, מנוע, פלט -->
  <!-- קלט רצוי x=10 -->
  <rect x="10" y="70" width="90" height="40" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <text x="55" y="88" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="inherit">קלט</text>
  <text x="55" y="102" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="inherit">רצוי</text>
  <title>הערך שאנחנו רוצים להגיע אליו</title>
  <!-- ∑ x=130 -->
  <circle cx="155" cy="90" r="20" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <text x="155" y="96" text-anchor="middle" fill="#f1f5f9" font-size="18" font-family="inherit">∑</text>
  <title>מחשב שגיאה: error = רצוי − נמדד</title>
  <!-- PID x=210 -->
  <rect x="210" y="66" width="100" height="48" rx="6" fill="rgba(34,197,94,.1)" stroke="#22c55e" stroke-width="1.5"/>
  <text x="260" y="85" text-anchor="middle" fill="#22c55e" font-size="13" font-weight="700" font-family="inherit">PID</text>
  <text x="260" y="101" text-anchor="middle" fill="#22c55e" font-size="9" font-family="inherit">P + I + D</text>
  <title>output = Kp×e + Ki×∫e + Kd×(de/dt)</title>
  <!-- מנוע x=340 -->
  <rect x="340" y="70" width="80" height="40" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <text x="380" y="95" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="inherit">מנוע</text>
  <title>מבצע את הפקודה</title>
  <!-- פלט x=450 -->
  <rect x="450" y="70" width="80" height="40" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <text x="490" y="95" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="inherit">פלט</text>
  <title>המצב האמיתי הנמדד</title>
  <!-- Arrows forward -->
  <line x1="100" y1="90" x2="133" y2="90" stroke="#64748b" stroke-width="1.5" marker-end="url(#pid-arr)"/>
  <line x1="175" y1="90" x2="208" y2="90" stroke="#64748b" stroke-width="1.5" marker-end="url(#pid-arr)"/>
  <line x1="310" y1="90" x2="338" y2="90" stroke="#64748b" stroke-width="1.5" marker-end="url(#pid-arr)"/>
  <line x1="420" y1="90" x2="448" y2="90" stroke="#64748b" stroke-width="1.5" marker-end="url(#pid-arr)"/>
  <!-- Feedback arrow: from פלט bottom → down → left → up → to ∑ bottom -->
  <path d="M490,110 L490,155 L155,155 L155,112" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-dasharray="5,3" marker-end="url(#pid-arr-g)"/>
  <text x="322" y="170" text-anchor="middle" fill="#22c55e" font-size="10" font-family="inherit">משוב (feedback)</text>
  <!-- Animated signal dot -->
  <circle r="5" fill="#22c55e" opacity=".85">
    <animateMotion dur="3s" repeatCount="indefinite" calcMode="linear">
      <mpath href="#pid-signal-path"/>
    </animateMotion>
  </circle>
  <path id="pid-signal-path" d="M55,90 L133,90 L175,90 L210,90 L310,90 L380,90 L450,90 L490,90 L490,155 L155,155 L155,110" fill="none" stroke="none"/>
</svg>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔋 סוללה — 12V SLA</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>SLA = Sealed Lead Acid</strong> — 12V, 18Ah. 6 תאים × 2.1V. מחויב לפי תקנות FRC. שיא זרם ~400A לרגע.</p>
<figure>
<img src="images/image9.png" loading="lazy" alt="סוללה">
<figcaption>סוללת המצבר SLA 12V 18Ah</figcaption>
</figure>
</div></div>`
  },
  // ================================================================
  // NEW THEORY TOPICS — BAGRUT LEVEL
  // ================================================================
  {
    key: 'cog',
    icon: '⚖️',
    title: 'מרכז כובד',
    desc: 'CoG, מומנט, יציבות, טכניקות הנמכה',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> מרכז כובד נמוך + במרכז בסיס הגלגלים = רובוט יציב שקשה להפיל.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📖 רמה 1 — הגדרה: מה זה מרכז כובד?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>מרכז כובד (CoG)</strong> = הנקודה שבה כל מסת הגוף "מרוכזת" תיאורטית. אם תלה את הרובוט מנקודה זו — הוא יהיה בשיווי משקל מושלם.</p>
<p>שני תנאים לרובוט יציב:</p>
<ul><li>CoG <strong>נמוך</strong> ככל האפשר</li><li>CoG <strong>במרכז</strong> נקודות מגע הגלגלים (סימטריה)</li></ul>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 רמה 2 — הבנה: למה CoG נמוך = יציב יותר?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>מומנט כוח = מרחק מציר × כוח.</strong></p>
<p>כשרובוט נוטה להתהפך, ציר הסיבוב = גלגל הקצה. CoG גבוה → מרחק גדול → מומנט גדול → כוח קטן מספיק להפיל.</p>
<p>CoG נמוך → מרחק קטן → מומנט קטן → צריך כוח גדול יותר להפיל.</p>
<div style="margin:12px 0">
<svg id="cogSvg" viewBox="0 0 400 350" style="max-width:100%;display:block" xmlns="http://www.w3.org/2000/svg">
  <!-- Robot body -->
  <rect id="cog-robot" x="100" y="80" width="200" height="150" rx="8" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" stroke-width="2" style="transition:stroke .3s"/>
  <!-- 4 wheels -->
  <circle cx="108" cy="88" r="12" fill="#16161f" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
  <circle cx="292" cy="88" r="12" fill="#16161f" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
  <circle cx="108" cy="222" r="12" fill="#16161f" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
  <circle cx="292" cy="222" r="12" fill="#16161f" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
  <!-- Stability zone -->
  <rect x="112" y="92" width="176" height="146" rx="4" fill="none" stroke="rgba(100,116,139,.4)" stroke-width="1.5" stroke-dasharray="6,4"/>
  <!-- Floor -->
  <line x1="60" y1="240" x2="340" y2="240" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
  <!-- Pivot markers -->
  <text x="108" y="258" text-anchor="middle" fill="#64748b" font-size="9" font-family="inherit">▲</text>
  <text x="292" y="258" text-anchor="middle" fill="#64748b" font-size="9" font-family="inherit">▲</text>
  <!-- Moment arrow (hidden when stable) -->
  <line id="cog-moment" x1="200" y1="155" x2="108" y2="230" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,3" style="display:none"/>
  <!-- CoG dot — starts at center height -->
  <circle id="cog-dot" cx="200" cy="155" r="11" fill="#22c55e" stroke="#16161f" stroke-width="2" style="cursor:grab;transition:cy .15s,fill .3s"/>
  <text x="200" y="151" text-anchor="middle" fill="#16161f" font-size="8" font-weight="700" font-family="inherit" id="cog-dot-lbl" style="pointer-events:none">CoG</text>
  <!-- Stable/unstable text -->
  <text id="cog-stable" x="200" y="290" text-anchor="middle" fill="#22c55e" font-size="14" font-weight="700" font-family="inherit">יציב ✓</text>
  <text x="200" y="310" text-anchor="middle" fill="#64748b" font-size="10" font-family="inherit">הזזת CoG מחוץ לאזור היציבות = הפלה</text>
  <!-- Axis label -->
  <text x="62" y="155" fill="#64748b" font-size="9" font-family="inherit">↑</text>
  <text x="55" y="165" fill="#64748b" font-size="9" font-family="inherit">גובה</text>
</svg>
<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-top:8px">
  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span style="font-size:.78rem;color:var(--muted)">גובה CoG:</span>
    <input type="range" min="0" max="200" value="75" id="cogSliderInput" oninput="cogSlider(this.value)" style="flex:1;min-width:100px;accent-color:#22c55e">
  </div>
  <div id="cog-lbl" style="font-size:.78rem;color:var(--muted);margin-top:4px">גובה מרכז כובד: 60 ס"מ</div>
</div>
</div>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 רמה 3 — ניתוח: מה קורה אם מעלים את הסוללה?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>סוללה SLA = ~6 ק"ג — מסה גדולה מאוד. העלאה מהתחתית לחלק העליון:</p>
<ul>
<li>מרכז הכובד הכולל עולה משמעותית</li>
<li>מומנט ההפלה גדל</li>
<li>רובוט נהיה <strong>הרבה</strong> יותר קל להפיל</li>
<li>בתחרות — רובוטים מתנגשים ← <strong>סכנה אמיתית</strong></li>
</ul>
<p>לכן הסוללה תמיד בתחתית הרובוט, לרוב על לוח הבסיס.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🏭 טכניקות הנמכת CoG ברובוט שלנו</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<ul>
<li>פרופילי <strong>50×25 מ"מ עם דופן 3 מ"מ</strong> (לא סטנדרט 1.5 מ"מ) → כבדים יותר בבסיס</li>
<li><strong>לוח בסיס אלומיניום מלא</strong> על פני כל הרובוט</li>
<li><strong>לוחות פלדה</strong> בתחתית לוח הבסיס</li>
<li><strong>פוליקרבונט באינטייק</strong> (בגובה הגבוה ביותר) — חומר קל</li>
<li>פרופיל <strong>80×80 מ"מ עם כרסום CNC</strong> — הסרת מסה מהחלק העליון</li>
<li>מילוי <strong>Honeycomb ב-3D print</strong> — מסיר חומר ללא פגיעה בחוזק</li>
</ul>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — הגדרת מרכז כובד. רמה 2 — הסבר מומנט כוח והשפעה על יציבות. רמה 3 — ניתוח: מה קורה כשמשנים מיקום מסה כבדה?
</div>`
  },
  {
    key: 'drivetrain_theory',
    icon: '🔩',
    title: 'מרכב — תיאוריה',
    desc: 'גלגלים, בסיס, סוגי הנעה, היגוי',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> כל בחירה בסוג ההנעה וממדי הגלגלים היא trade-off בין יציבות, זריזות וכוח.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📖 רמה 1 — גלגלים: קוטר ורוחב</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>היקף גלגל = π × קוטר.</strong> כל סיבוב = מרחק שווה להיקף.</p>
<ul>
<li>גלגל <strong>גדול</strong> (קוטר גדול): מהיר יותר, טורק נמוך יותר</li>
<li>גלגל <strong>קטן</strong>: איטי יותר, טורק גבוה יותר</li>
<li>גלגל <strong>רחב</strong>: יותר אחיזה, יותר חיכוך (התנגדות)</li>
<li>גלגל <strong>צר</strong>: פחות חיכוך, פחות אחיזה</li>
</ul>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 רמה 2 — בסיס גלגלים: יציבות ↔ תמרון</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>המרחק בין גלגלים = <strong>wheelbase</strong>.</p>
<table class="tbl"><tr><th>בסיס רחב</th><th>בסיס צר</th></tr>
<tr><td class="pro">יציב יותר</td><td class="con">פחות יציב</td></tr>
<tr><td class="con">רדיוס פניה גדול</td><td class="pro">רדיוס פניה קטן</td></tr>
<tr><td class="con">פחות זריז</td><td class="pro">זריז יותר</td></tr></table>
<p>לא ניתן לקבל שניהם — <strong>trade-off מובנה</strong>.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚙️ סוגי הנעה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>1. דיפרנציאלי:</strong> מנוע אחד (או יותר) לכל צד. פניה = הפרש מהירויות בין צדדים. פשוט, אמין, כוח דחיפה טוב.</p>
<p><strong>2. סינכרוני:</strong> כל הגלגלים מצביעים לאותו כיוון ונעים באותה מהירות. תנועה ישרה מדויקת.</p>
<p><strong>3. Swerve (שלנו):</strong> מנוע נפרד להנעה ומנוע נפרד להיגוי לכל גלגל. holonomic motion — כל כיוון ללא סיבוב גוף. מורכב ביותר, כי יכול ביותר.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 רמה 3 — ניתוח: מה קורה אם מגדילים מרחק גלגלים?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>הגדלת מרחק הגלגלים:</p>
<ul>
<li>יציבות <strong>גדלה</strong> — קשה יותר להפיל</li>
<li>רדיוס פניה <strong>גדל</strong> — פחות זריז</li>
<li>משקל <strong>גדל</strong> — שלדה ארוכה יותר</li>
<li>לכן: תמיד בוחרים wheelbase אופטימלי לפי אתגרי המשחק</li>
</ul>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — הגדרת wheelbase וסוגי הנעה. רמה 2 — מה trade-off בגודל הבסיס? רמה 3 — מה קורה לזריזות אם מרחיקים גלגלים?
</div>`
  },
  {
    key: 'motors_theory',
    icon: '⚡',
    title: 'מנועים',
    desc: 'Brushed, Brushless, קומוטציה, Hall Effect',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> מנוע ממיר אנרגיה חשמלית לתנועה סיבובית. הבדל Brushed/Brushless = שיטת הקומוטציה.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📖 רמה 1 — מנוע Brushed: מה קומוטטור?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>קומוטטור</strong> = חלק מכני על הציר, מחולק לפלחים. מברשות פחם קבועות נוגעות בו תוך כדי סיבוב.</p>
<p>תפקיד: לחלף כיוון הזרם בסליל בכל חצי סיבוב → הכוח תמיד באותו כיוון → סיבוב רציף.</p>
<div class="diagram">+V → [מברשת] → [קומוטטור] → [סליל] → [קומוטטור] → [מברשת] → GND
                    ↑ מסתובב עם הציר, מחליף זרם כל חצי סיבוב</div>
<p><strong>בעיות:</strong> מברשות מתבלות, ניצוצות, יעילות ~75–80%, תחזוקה תדירה.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 רמה 2 — Brushless: איך בלי מברשות?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>ב-Brushless: <strong>מגנטים על הרוטור</strong> (מסתובב), <strong>סלילים קבועים בסטטור</strong>.</p>
<p>בקר אלקטרוני (TalonFX / SparkMax) מחלף זרם בסלילים לפי מיקום הרוטור — נמדד ע"י <strong>Hall Effect sensor</strong> או encoder.</p>
<table class="tbl">
<tr><th>קריטריון</th><th>Brushed</th><th>Brushless</th></tr>
<tr><td>קומוטציה</td><td>מכנית (מברשות)</td><td class="pro">אלקטרונית (בקר)</td></tr>
<tr><td>יעילות</td><td class="con">~75–80%</td><td class="pro">~90–95%</td></tr>
<tr><td>תחזוקה</td><td class="con">מברשות שוחקות</td><td class="pro">כמעט אפס</td></tr>
<tr><td>מחיר</td><td class="pro">זול</td><td class="con">יקר</td></tr>
<tr><td>כוח/משקל</td><td class="con">בינוני</td><td class="pro">גבוה מאוד</td></tr>
</table>
<p><strong>מנועינו:</strong> Falcon 500 (TalonFX) = Brushless, 6380 RPM, 4.69 Nm stall.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 רמה 3 — למה Brushless למרות עלות גבוהה?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<ul>
<li>יעילות 90–95% → פחות חום → פחות throttling בתחרות</li>
<li>ללא תקלות קומוטטור/מברשות בזמן משחק</li>
<li>כוח/משקל גבוה → רובוט קל ומהיר יותר</li>
<li>TalonFX = closed-loop מובנה + CAN telemetry → אבחון בזמן אמת</li>
<li>לתחרות FRC: אמינות > עלות</li>
</ul>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — מה קומוטטור? רמה 2 — השוואת Brushed vs Brushless. רמה 3 — למה לבחור Brushless לתחרות?
</div>`
  },
  {
    key: 'transmission_theory',
    icon: '⚙️',
    title: 'תמסורות',
    desc: 'יחסי שיניים, שרשראות, טורק ↔ מהירות',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> תמסורת = trade-off בין טורק למהירות. לא ניתן להרוויח שניהם — שימור הספל.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📖 רמה 1 — מה יחס תמסורת N:1?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>יחס N:1 → המנוע מסתובב N פעמים לכל סיבוב אחד של הפלט.</p>
<p>תוצאה: <strong>טורק × N</strong>, <strong>מהירות ÷ N</strong>.</p>
<p>דוגמה — 1:64: מנוע 6380 RPM → פלט ~100 RPM, אך טורק גדל פי 64.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 רמה 2 — שרשראות ושיניים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>שרשרת מחברת שני גלגלי שיניים (sprockets). יחס = שיניים_מנוהל / שיניים_מניע.</p>
<p><strong>9:18 = 1:2</strong> — 9 שיניים מניע, 18 מנוהל → מהירות ÷2, טורק ×2.</p>
<table class="tbl">
<tr><th>יותר שיניים על מנוהל</th><th>יותר שיניים על מניע</th></tr>
<tr><td class="pro">טורק גדל</td><td class="pro">מהירות גדלה</td></tr>
<tr><td class="con">מהירות קטנה</td><td class="con">טורק קטן</td></tr></table>
<p><strong>סוגי שרשראות:</strong> שרשרת #35 (חזקה, בטיפוס), חגורת טימינג (ללא החלקה, בקלע).</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📊 תמסורות ברובוט שלנו</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>מערכת</th><th>יחס</th><th>מטרה</th></tr>
<tr><td>מרכב (Drive)</td><td>1:5.9</td><td class="pro">מהיר — חצייה מהירה</td></tr>
<tr><td>טיפוס</td><td>1:64</td><td class="pro">טורק עצום — הרמת 50 ק"ג</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 רמה 3 — מה קורה אם נשנה 1:64 → 1:32?</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>יחס 1:32 = מהירות ×2, טורק ÷2 לעומת 1:64.</p>
<ul>
<li>המעלית תעלה מהר פי 2</li>
<li>הטורק יחצה ב-2 — ייתכן <strong>לא יספיק</strong> להרים את הרובוט (50 ק"ג)</li>
<li>המנוע עלול לשרוף (stall current גבוה)</li>
</ul>
<p>לכן 1:64 — הרובוט עולה לאט, אך בטוח ועם שפע טורק.</p>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — מה יחס 1:32? רמה 2 — מה קורה לטורק ולמהירות? רמה 3 — אם משנים 1:64 ל-1:32 בטיפוס?
</div>`
  },
  {
    key: 'control_theory',
    icon: '📐',
    title: 'בקרה',
    desc: 'Open/Closed loop, PID, Feedforward, Motion Profiles',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> Closed-loop + Feedforward = שליטה מדויקת ומהירה. PID בלבד = איטי ויש לו מגבלות.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📖 רמה 1 — Open vs Closed Loop</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Open-loop:</strong> שולח פקודה — לא יודע מה קרה. כמו נהיגה בעיניים עצומות.</p>
<p><strong>Closed-loop:</strong> פקודה + חיישן → משווה מצב נוכחי לmטרה → מתקן. כמו נהיגה עם עיניים פקוחות.</p>
<div class="diagram">Open:   [Setpoint] → [Robot] → ?
Closed: [Setpoint] → [Controller] → [Robot] → [Sensor] → ↩ חזרה לController</div>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 רמה 2 — PID: כל מונח עם אנלוגיה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>output = Kp×e + Ki×∫e dt + Kd×(de/dt)</strong></p>
<table class="tbl">
<tr><th>מונח</th><th>שאלה</th><th>אנלוגיה</th><th>בעיה אם גדול מדי</th></tr>
<tr><td><strong>P</strong></td><td>"כמה רחוק?"</td><td>דחיפה יחסית לשגיאה</td><td>Overshoot + oscillation</td></tr>
<tr><td><strong>I</strong></td><td>"כמה זמן שגיאה?"</td><td>תיקון שגיאה קבועה</td><td>Integral Windup</td></tr>
<tr><td><strong>D</strong></td><td>"כמה מהר מתקרב?"</td><td>בלם לפני הגעה</td><td>רגיש לרעש</td></tr>
</table>
<p><strong>Integral Windup:</strong> כשI מצטבר מאוד → overshoot חזק. פתרון: clamp על ערך I.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ Feedforward — חישוב מראש</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>Feedforward = חישוב כוח לפי פיזיקה, לא מחכה לשגיאה.</p>
<p><strong>ArmFeedforward:</strong> <code>kG × cos(θ)</code> — מתחשב בכבידה לפי זווית.</p>
<ul>
<li>θ=0° (אופקי): cos(0)=1 → כוח מקסימלי לנגד כבידה</li>
<li>θ=90° (אנכי): cos(90°)=0 → אין כוח כבידה, אין צורך לנגד</li>
</ul>
<p><strong>ביחד:</strong> FF מגיע קרוב למטרה, PID מדייק. שליטה מהירה + מדויקת.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📈 Motion Profiles: Trapezoidal vs S-Curve</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Trapezoidal:</strong> תאוצה קבועה → מהירות קבועה → עצירה. שינוי חד בתאוצה → רעידות (jerk).</p>
<p><strong>S-Curve:</strong> תאוצה עולה בהדרגה → smooth. שימושי ל-Swerve לאודומטריה מדויקת.</p>
<div style="margin:14px 0">
<svg viewBox="0 0 500 300" style="max-width:100%;display:block" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid -->
  <line x1="50" y1="50" x2="50" y2="260" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
  <line x1="50" y1="260" x2="420" y2="260" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
  <line x1="50" y1="185" x2="420" y2="185" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="50" y1="122" x2="420" y2="122" stroke="rgba(255,255,255,.04)" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="50" y1="260" x2="420" y2="260" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
  <!-- Axes -->
  <text x="430" y="264" fill="#64748b" font-size="11" font-family="inherit">זמן →</text>
  <text x="44" y="46" text-anchor="end" fill="#64748b" font-size="11" font-family="inherit">↑</text>
  <text x="44" y="56" text-anchor="end" fill="#64748b" font-size="11" font-family="inherit" writing-mode="lr">מהירות</text>
  <!-- Y axis labels -->
  <text x="44" y="264" text-anchor="end" fill="#64748b" font-size="9" font-family="inherit">0</text>
  <text x="44" y="126" text-anchor="end" fill="#64748b" font-size="9" font-family="inherit">50%</text>
  <text x="44" y="89" text-anchor="end" fill="#64748b" font-size="9" font-family="inherit">100%</text>
  <!-- Trapezoidal group -->
  <g id="mp-trap">
    <polygon points="50,260 130,88 280,88 360,260" fill="rgba(34,197,94,.08)" stroke="none"/>
    <polyline points="50,260 130,88 280,88 360,260" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="205" y="80" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="600" font-family="inherit">Trapezoidal</text>
    <!-- Annotations -->
    <line x1="90" y1="172" x2="90" y2="145" stroke="#22c55e" stroke-width="1" marker-end="url(#arr)"/>
    <text x="94" y="169" fill="#22c55e" font-size="9" font-family="inherit">תאוצה קבועה</text>
    <line x1="205" y1="105" x2="205" y2="130" stroke="rgba(34,197,94,.6)" stroke-width="1"/>
    <text x="205" y="143" text-anchor="middle" fill="#64748b" font-size="9" font-family="inherit">מהירות קבועה</text>
    <line x1="315" y1="172" x2="325" y2="148" stroke="#22c55e" stroke-width="1"/>
    <text x="332" y="148" fill="#22c55e" font-size="9" font-family="inherit">עצירה</text>
  </g>
  <!-- S-Curve group -->
  <g id="mp-scurve" style="display:none">
    <path d="M50,260 C90,260 80,88 160,88 L250,88 C330,88 320,260 360,260" fill="rgba(255,209,102,.08)" stroke="none"/>
    <path d="M50,260 C90,260 80,88 160,88 L250,88 C330,88 320,260 360,260" stroke="#ffd166" stroke-width="2.5" fill="none"/>
    <text x="205" y="80" text-anchor="middle" fill="#ffd166" font-size="11" font-weight="600" font-family="inherit">S-Curve</text>
    <line x1="88" y1="200" x2="95" y2="172" stroke="#ffd166" stroke-width="1"/>
    <text x="98" y="200" fill="#ffd166" font-size="9" font-family="inherit">תאוצה משתנה</text>
    <text x="205" y="143" text-anchor="middle" fill="#64748b" font-size="9" font-family="inherit">smooth — ללא jerk</text>
  </g>
  <defs><marker id="arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e"/></marker></defs>
</svg>
<div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap">
  <button id="mp-btn-trap" onclick="toggleCurve('trap')" style="background:rgba(34,197,94,.12);border:1px solid #22c55e;color:#22c55e;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .3s">Trapezoidal</button>
  <button id="mp-btn-sc" onclick="toggleCurve('scurve')" style="background:rgba(255,209,102,.08);border:1px solid rgba(255,209,102,.3);color:#ffd166;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .3s">S-Curve</button>
</div>
</div>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — מה כל אות PID? רמה 2 — הסבר Integral Windup. רמה 3 — מה קורה אם Kp גדול מדי?
</div>`
  },
  {
    key: 'electronics_theory',
    icon: '🔋',
    title: 'אלקטרוניקה',
    desc: 'סוללה, PDH, CANbus, PWM, RoboRIO',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> כל רובוט FRC פועל על 12V SLA. PDH מחלק חשמל. CAN מקשר הכל.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔋 סוללה — 12V SLA</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>SLA = Sealed Lead Acid</strong> — 12V, 18Ah. 6 תאים × ~2.1V.</p>
<p>לא ניתן לשנות — תקנות FRC. יש לטעון לפני כל משחק. שיא זרם ~400A לרגע.</p>
<p>מיקום: <strong>תחתית הרובוט</strong> — CoG נמוך + בטיחות.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ PDH — Power Distribution Hub</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>PDH (REV):</strong> 18 ערוצים עם פיוזים (15A / 30A / 40A).</p>
<p>מחלק חשמל לכל רכיבי הרובוט. <strong>ניטור זרם בזמן אמת</strong> דרך CAN → רואים כל חריגה.</p>
<table class="tbl">
<tr><th>פיוז</th><th>שימוש</th></tr>
<tr><td>15A</td><td>חיישנים, Raspberry Pi, מצלמות</td></tr>
<tr><td>30A</td><td>מנועים קטנים</td></tr>
<tr><td>40A</td><td>Falcon 500, TalonFX</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📡 CANbus vs PWM — השוואה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>קריטריון</th><th>PWM</th><th>CAN</th></tr>
<tr><td>חוטים</td><td class="con">חוט נפרד לכל רכיב</td><td class="pro">2 חוטים לכולם</td></tr>
<tr><td>כיוון</td><td class="con">חד-כיווני</td><td class="pro">דו-כיווני</td></tr>
<tr><td>ניטור</td><td class="con">אין</td><td class="pro">זרם, מתח, טמפ\'</td></tr>
<tr><td>closed-loop</td><td class="con">ב-roboRIO בלבד</td><td class="pro">בתוך הבקר (מהיר)</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🤖 RoboRIO + RSL + VRM</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>RoboRIO:</strong> המוח — FPGA + ARM processor. מריץ את קוד Java. מחובר ל-Driver Station ב-Wi-Fi.</p>
<p><strong>RSL (Robot Signal Light):</strong> נורת מצב — מחוברת = OFF, enabled = בוהק, disabled = מהבהב.</p>
<p><strong>VRM (Voltage Regulator Module):</strong> מספק 5V / 12V מוסדרים לחיישנים ומצלמות.</p>
</div></div>
<div class="highlight" style="background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3);margin-top:14px">
<strong>💡 בגרות:</strong> רמה 1 — מה PDH? רמה 2 — מה יתרון CAN על PWM? רמה 3 — איזה פיוז מתאים לFalcon ולמה?
</div>`
  },
  {
    key: 'game',
    icon: '🎮',
    title: 'שדה ומשחק',
    desc: 'REBUILT 2025 — ממדי שדה, HUB, BUMP, TRENCH, TOWER, FUEL',
    content: `
<div class="highlight green"><strong>עונת REBUILT 2025:</strong> שדה סימטרי, שתי ברית (3 רובוטים כל אחת), אוסף ויריית FUEL לתוך HUB.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📐 ממדי שדה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>גודל שדה: <strong>807 × 1645 ס"מ</strong>. מחולק ע"י Neutral Zone.</p>
<table class="tbl">
<tr><th>מרכיב</th><th>ממדים / גובה</th><th>הערה</th></tr>
<tr><td>HUB</td><td>119×119 ס"מ, פתח hex 106 ס"מ בגובה 183 ס"מ</td><td>יעד ירייה</td></tr>
<tr><td>BUMP</td><td>1854 ס"מ רוחב, 16.54 ס"מ גובה, רמפות 15°</td><td>CoG נמוך = חובה</td></tr>
<tr><td>TRENCH</td><td>166.8 ס"מ רוחב, פינוי 56.52 ס"מ</td><td>רובוט חייב לעבור תחתיו</td></tr>
</table>
<figure>
<img src="images/image3.png" loading="lazy" alt="מגרש">
<figcaption>תרשים מגרש REBUILD</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🗼 TOWER — שלושה שלבי טיפוס</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>שלב</th><th>גובה</th><th>ניקוד</th></tr>
<tr><td>L1</td><td>68.55 ס"מ</td><td>10 נק' (15 אוטו)</td></tr>
<tr><td>L2</td><td>114.3 ס"מ</td><td>20 נק'</td></tr>
<tr><td>L3</td><td>160 ס"מ</td><td>30 נק'</td></tr>
</table>
<figure>
<img src="images/image70.png" loading="lazy" alt="עמדות נהגים">
<figcaption>עמדות נהגים ומגדל הטיפוס</figcaption>
</figure>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚽ FUEL + עונשים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>FUEL:</strong> כדור קצף, ∅15 ס"מ, 203–227 גרם.</p>
<p><strong>Minor Foul:</strong> 5 נק' ליריב | <strong>Major Foul:</strong> 15 נק' ליריב.</p>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — מה גובה BUMP? רמה 2 — איזה אילוץ מטיל ה-TRENCH על עיצוב הרובוט? רמה 3 — איך ה-BUMP משפיע על מיקום מרכז הכובד?</div>`
  },
  {
    key: 'specs',
    icon: '📏',
    title: 'מפרט הרובוט',
    desc: 'ממדים, משקל, שלד, מרכז כובד ו-6 אסטרטגיות',
    content: `
<div class="highlight green"><strong>הרובוט שלנו:</strong> 67.5×72×74 ס"מ, 51.85 ק"ג, CoG ~16.4 ס"מ מהרצפה.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📐 ממדים ומשקל</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>פרמטר</th><th>הרובוט שלנו</th><th>מגבלת FRC</th></tr>
<tr><td>גודל (א×ר×ג)</td><td>67.5 × 72 × 74 ס"מ</td><td>היקף ≤ 279.4 ס"מ</td></tr>
<tr><td>גובה</td><td>74 ס"מ</td><td>≤ 76.2 ס"מ</td></tr>
<tr><td>משקל</td><td>51.85 ק"ג</td><td>≤ 56.2 ק"ג</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🏗️ שלד ובנייה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>4 פרופילי אלומיניום <strong>50×25 מ"מ</strong> מלבניים. לוח תחתית אלומיניום עם חורי הקלת משקל.</p>
<p>מודולות Swerve קדמיות סובבו <strong>90°</strong> לפינוי מקום לאינטייק + קלע.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚖️ 6 אסטרטגיות להנמכת מרכז כובד</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<ol>
<li><strong>סוללה שקועה</strong> — הרכיב הכבד ביותר במרכז תחתית השלד</li>
<li><strong>PDH + 8 Talon FX</strong> — ברמת הרצפה</li>
<li><strong>דפנות אינטייק פוליקרבונט</strong> — קלות בנקודות הגבוהות ביותר</li>
<li><strong>לוחות הוד: פלדה → אלומיניום</strong> — הפחתת מסה בחלק עליון</li>
<li><strong>חלקים מודפסים עם תשתית משושית</strong> — חוזק גבוה, מסה נמוכה</li>
<li><strong>חורי הקלת משקל בלוח תחתית</strong></li>
</ol>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — מה CoG הרובוט? רמה 2 — מה האסטרטגיה העיקרית להנמכת CoG? רמה 3 — למה CoG נמוך קריטי בתנועת Swerve מהירה?</div>`
  },
  {
    key: 'drivetrain_theory',
    icon: '🔩',
    title: 'תיאוריית מרכב',
    desc: 'סוגי מרכב, יתרונות/חסרונות, Swerve vs אחרים',
    content: `
<div class="highlight green"><strong>עיקרון:</strong> בחירת מרכב = פשרה בין תמרון, אחיזה, מורכבות ועלות.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📊 השוואת 4 סוגי מרכב</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>מרכב</th><th>יתרונות</th><th>חסרונות</th></tr>
<tr><td>Tank (6 גלגלים)</td><td class="pro">זול, פשוט, עובר מכשולים</td><td class="con">ללא תנועה צדית</td></tr>
<tr><td>Rhino (זחלים)</td><td class="pro">אחיזה מעולה, דחיפה חזקה</td><td class="con">ללא תנועה צדית</td></tr>
<tr><td>Mecanum</td><td class="pro">תנועה לכל ציר, קומפקטי, FOC</td><td class="con">מאבד אחיזה בקלות</td></tr>
<tr><td><strong>Swerve ✓</strong></td><td class="pro">holonomic מלא, אחיזה חזקה, 5 שנות ניסיון</td><td class="con">מורכב, יקר</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔄 היגוי: סינכרוני vs דיפרנציאלי</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>סינכרוני:</strong> כל הגלגלים כיוון + מהירות זהים → תנועה ישרה מדויקת.</p>
<p><strong>דיפרנציאלי:</strong> הפרש מהירות בין צדדים → פנייה. Swerve משתמש בשניהם בו-זמנית.</p>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin:14px 0;justify-content:center">
  <div style="flex:1;min-width:180px;max-width:220px;text-align:center">
    <svg viewBox="0 0 200 220" style="max-width:100%;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">
      <!-- Robot body -->
      <rect x="50" y="50" width="100" height="100" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
      <!-- Left wheels (fast) -->
      <rect x="30" y="58" width="20" height="30" rx="3" fill="#22c55e" opacity=".7"/>
      <rect x="30" y="112" width="20" height="30" rx="3" fill="#22c55e" opacity=".7"/>
      <!-- Right wheels (slow) -->
      <rect x="150" y="62" width="20" height="22" rx="3" fill="rgba(34,197,94,.35)"/>
      <rect x="150" y="116" width="20" height="22" rx="3" fill="rgba(34,197,94,.35)"/>
      <!-- Left fast arrows -->
      <line x1="26" y1="73" x2="10" y2="53" stroke="#22c55e" stroke-width="1.5" marker-end="url(#steer-arr)"/>
      <line x1="26" y1="127" x2="10" y2="107" stroke="#22c55e" stroke-width="1.5" marker-end="url(#steer-arr)"/>
      <!-- Right slow arrows (shorter) -->
      <line x1="174" y1="73" x2="186" y2="63" stroke="rgba(34,197,94,.5)" stroke-width="1.5" marker-end="url(#steer-arr-d)"/>
      <line x1="174" y1="127" x2="186" y2="117" stroke="rgba(34,197,94,.5)" stroke-width="1.5" marker-end="url(#steer-arr-d)"/>
      <!-- Curved turn arrow -->
      <path d="M100,170 Q160,200 170,150" stroke="#22c55e" stroke-width="2" fill="none" stroke-dasharray="5,3" marker-end="url(#steer-arr)"/>
      <!-- Labels -->
      <text x="36" y="53" fill="#22c55e" font-size="9" font-family="inherit">מהיר</text>
      <text x="150" y="58" fill="#64748b" font-size="9" font-family="inherit">איטי</text>
      <defs>
        <marker id="steer-arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e"/></marker>
        <marker id="steer-arr-d" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(34,197,94,.5)"/></marker>
      </defs>
    </svg>
    <p style="font-size:.85rem;font-weight:600;color:#22c55e;margin:4px 0">דיפרנציאלי</p>
    <p style="font-size:.75rem;color:var(--muted)">הפרש מהירויות = פנייה</p>
  </div>
  <div style="flex:1;min-width:180px;max-width:220px;text-align:center">
    <svg viewBox="0 0 200 220" style="max-width:100%;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">
      <!-- Robot body -->
      <rect x="50" y="50" width="100" height="100" rx="6" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
      <!-- 4 wheels all angled 45° -->
      <g transform="rotate(45,40,73)"><rect x="30" y="62" width="20" height="28" rx="3" fill="#22c55e" opacity=".7"/></g>
      <g transform="rotate(45,160,73)"><rect x="150" y="62" width="20" height="28" rx="3" fill="#22c55e" opacity=".7"/></g>
      <g transform="rotate(45,40,127)"><rect x="30" y="116" width="20" height="28" rx="3" fill="#22c55e" opacity=".7"/></g>
      <g transform="rotate(45,160,127)"><rect x="150" y="116" width="20" height="28" rx="3" fill="#22c55e" opacity=".7"/></g>
      <!-- Straight diagonal movement arrow -->
      <line x1="100" y1="155" x2="155" y2="100" stroke="#22c55e" stroke-width="2.5" marker-end="url(#steer-arr2)"/>
      <defs>
        <marker id="steer-arr2" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e"/></marker>
      </defs>
    </svg>
    <p style="font-size:.85rem;font-weight:600;color:#22c55e;margin:4px 0">סינכרוני</p>
    <p style="font-size:.75rem;color:var(--muted)">כל הגלגלים — אותו כיוון</p>
  </div>
</div>
<p><strong>סימטרי:</strong> שני הצדדים זהים — הפרש מהירות = פנייה.</p>
<p><strong>א-סימטרי:</strong> סוגי גלגלים/עמדות שונות → תנועות ייחודיות.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚖️ CoM, יציבות ותמרון</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>בסיס רחב</strong> = יציב יותר, תמרון פחות זריז.</p>
<p><strong>בסיס צר</strong> = תמרוני יותר, פחות יציב.</p>
<p><strong>CoM גבוה</strong> → מומנט עצום בפנייה → wheel slip → אודומטריה שגויה → סכנת היפוך.</p>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — 2 יתרונות Swerve על Mecanum. רמה 2 — מה ההבדל בין היגוי סינכרוני לדיפרנציאלי? רמה 3 — למה Mecanum לא מתאים לשדות עם מכשולים?</div>`
  },
  {
    key: 'subsystems',
    icon: '🤖',
    title: 'תת-מערכות — עומק',
    desc: 'אינטייק, הופר, קלע, מטפס — פירוט מלא',
    content: `
<div class="highlight green"><strong>הרובוט = 4 תת-מערכות:</strong> אינטייק → הופר → קלע → מטפס. כל אחת עיצוב עצמאי עם אילוצים מכניים ואלקטרוניים.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🤏 אינטייק — עומק</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>מנגנון <strong>Four-Bar</strong>: סיבובי, לא ליניארי. בעת פגיעה — בורח אחורה, לא נשבר.</p>
<p>דפנות <strong>פוליקרבונט</strong>: זיכרון צורה, ספיגת הלם, קלות → CoG נמוך.</p>
<p>צירי <strong>Churro</strong> עם בלוקי מיסבים CNC מותאמים.</p>
<p>2 מנועי NEO (SparkMax): גלגלות (אינטייק) + זרוע פריסה.</p>
<p>יחס זרוע פריסה: <strong>1:96</strong> → טורק גבוה, זרוע מחזיקה עצמה, ללא התחממות.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📦 הופר + הנעת רצועה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>גלגלי <strong>מקאנום</strong> למירכוז הכדור לרוחב.</p>
<p>2 מנועי NEO 550 (30A): Belt Lower + Belt Upper — בקרה נפרדת לתחתון ועליון.</p>
<p>קיר קדמי דינמי — מתרחב לאחסון נפח גדול יותר.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🎯 קלע — עומק</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Main Wheel + Hood Wheel</strong> (2 × NEO, 40A). הפרש מהירות → backspin על הכדור → יציבות בטיסה.</p>
<p><strong>הוד:</strong> NEO 550, זווית יציאה משתנה. לוחות: פלדה → אלומיניום (CoG).</p>
<p><strong>אלגוריתם Interpolation:</strong> מחשב מהירות + זווית אופטימליים לפי מרחק.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧗 מטפס — עומק</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>פרופיל אלומיניום יחיד <strong>40×40 מ"מ</strong> — חסך 3.5 ק"ג לעומת כפול.</p>
<p>בלוקי מיסבים CNC: דיוק <strong>±0.005 מ"מ</strong>.</p>
<p>מנוע NEO + מנגנון <strong>ratchet</strong>: מונע נפילה בהפסקת חשמל.</p>
<p>יחס סה"כ: <strong>1:64</strong> = ratchet 1:32 × שרשרת 1:2.</p>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — למה ratchet במטפס? רמה 2 — מה יחס ההעברה לזרוע פריסה ולמה? רמה 3 — למה שינינו לוחות הוד מפלדה לאלומיניום?</div>`
  },
  {
    key: 'motors_deep',
    icon: '⚡',
    title: 'מנועים — עומק',
    desc: 'Falcon 500, NEO, NEO 550, Brushed vs Brushless',
    content: `
<div class="highlight green"><strong>3 מנועים, 3 שימושים:</strong> Falcon 500 (כוח מקסימלי), NEO (יחסים גבוהים), NEO 550 (מהירות, כוח נמוך).</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🦅 Falcon 500 (Talon FX)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>פרמטר</th><th>ערך</th></tr>
<tr><td>סוג</td><td>Brushless + בקר מובנה, CAN bus</td></tr>
<tr><td>מתח / RPM</td><td>12V | 6,380 RPM</td></tr>
<tr><td>טורק stall / זרם</td><td>4.69 Nm | 257A</td></tr>
</table>
<p><strong>שימוש:</strong> מרכב — דורש עוצמה מקסימלית + מהירות.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🌀 NEO (SparkMax)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>פרמטר</th><th>ערך</th></tr>
<tr><td>סוג</td><td>Brushless, בקר SparkMax חיצוני</td></tr>
<tr><td>מתח / RPM</td><td>12V | 5,676 RPM</td></tr>
<tr><td>טורק stall / זרם</td><td>2.6 Nm | 105A</td></tr>
</table>
<p><strong>שימוש:</strong> אינטייק, הופר, מטפס — עם יחסי הילוכים גבוהים.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ NEO 550 (SparkMax)</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>פרמטר</th><th>ערך</th></tr>
<tr><td>סוג</td><td>Brushless outrunner קומפקטי</td></tr>
<tr><td>מתח / RPM</td><td>12V | 11,000 RPM</td></tr>
<tr><td>טורק stall / זרם</td><td>0.97 Nm | 100A | 279W מקס</td></tr>
</table>
<p class="con"><strong>⚠️ אזהרה:</strong> מסה תרמית נמוכה — stall ממושך שורף מהר!</p>
<p><strong>שימוש:</strong> הוד, הנעת רצועה — מהירות גבוהה, כוח נמוך.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔬 Brushed vs Brushless — תיאוריה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>קריטריון</th><th>Brushed</th><th>Brushless</th></tr>
<tr><td>קומוטציה</td><td>מכנית (פחמים + commutator)</td><td>אלקטרונית (בקר + Hall/Encoder)</td></tr>
<tr><td>יעילות</td><td class="con">75–80%</td><td class="pro">90–95%</td></tr>
<tr><td>בלאי</td><td class="con">פחמים בולים, ניצוצות</td><td class="pro">ללא בלאי מכני</td></tr>
<tr><td>מורכבות</td><td class="pro">פשוט</td><td class="con">דורש בקר חכם</td></tr>
</table>
<p>רוטור Brushless = מגנטים. סלילים קבועים. בקר מחליף זרם לפי מיקום (Hall Effect).</p>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — מה יתרון Brushless? רמה 2 — למה NEO 550 מסוכן ב-stall? רמה 3 — מה תפקיד Hall Effect ב-Brushless?</div>`
  },
  {
    key: 'electronics_deep',
    icon: '🔌',
    title: 'אלקטרוניקה — עומק',
    desc: 'סוללה SLA, PWM, H-Bridge, CANbus, PDH',
    content: `
<div class="highlight green"><strong>עומק אלקטרוניקה:</strong> מעגלי שליטה מלאים — סוללה, PWM, H-Bridge, CAN, PDH.</div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔋 סוללה SLA — כימיה ומספרים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>SLA = Sealed Lead Acid:</strong> 12V, 18Ah. 6 תאים × 2.1V = 12.6V טעון מלא.</p>
<p><strong>אלקטרודות:</strong> Pb (עופרת) + PbO₂ (תחמוצת עופרת). <strong>אלקטרוליט:</strong> H₂SO₄ (חומצה גופרתית).</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📶 PWM — שליטה ב-Duty Cycle</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><strong>Duty Cycle</strong> = זמן ON / תקופה כוללת × 100%.</p>
<p><strong>מתח ממוצע</strong> = מתח אספקה × Duty Cycle.</p>
<p class="pro"><strong>למה לא נגד?</strong> נגד מבזבז אנרגיה כחום. PWM = 100% יעיל.</p>
<div class="diagram">PWM 75%: ████████░░░░ → ממוצע = 0.75 × 12V = 9V</div>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🌉 H-Bridge — שליטת כיוון מנוע</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>4 מתגים בצורת H. שולטים בכיוון הזרם דרך המנוע.</p>
<table class="tbl">
<tr><th>מצב</th><th>מתגים סגורים</th><th>תוצאה</th></tr>
<tr><td>קדימה</td><td>S1 + S4</td><td>סיבוב קדימה</td></tr>
<tr><td>אחורה</td><td>S2 + S3</td><td>סיבוב אחורה</td></tr>
<tr><td>בלימה</td><td>S1+S3 או S2+S4</td><td>שני הצדדים קוטב זהה → עצירה</td></tr>
</table>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📡 CANbus — רשת תקשורת</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p>2 חוטים בלבד: <strong>CAN-Hi + CAN-Lo</strong>. כל רכיבי הרובוט על אותה רשת.</p>
<p>כל רכיב = <strong>ID ייחודי</strong>. עדיפות = לפי מספר ID.</p>
<p>אצלנו: מחוברים ישירות למודולות Swerve בלחמה — ללא מחברים שיתנתקו.</p>
</div></div>
<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ PDH + רכיבים</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<table class="tbl">
<tr><th>רכיב</th><th>תפקיד</th></tr>
<tr><td>PDH</td><td>18 ערוצים, פיוזים 15A/30A/40A, ניטור CAN</td></tr>
<tr><td>VRM</td><td>5V/12V מוסדרים לחיישנים</td></tr>
<tr><td>RSL</td><td>נורת מצב: OFF=מנותק, בוהק=פעיל, מהבהב=מושבת</td></tr>
<tr><td>RoboRIO</td><td>מוח הרובוט: FPGA + ARM, מריץ Java</td></tr>
</table>
</div></div>
<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — מה Duty Cycle? רמה 2 — איך H-Bridge הופך כיוון מנוע? רמה 3 — מה יתרון CAN על PWM בניטור?</div>`
  },
  {
    key: 'mock_exam_lessons',
    icon: '💡',
    title: 'מסקנות מהמתכונת',
    desc: 'דברים שלא ידעתי — לחזור לפני הבגרות',
    content: `
<div class="highlight" style="background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.3)">
<strong>💡 מסקנות מהמתכונת</strong> — נושאים שעלו במתכונת ולא ידעתי להסביר. לחזור עליהם לפני הבגרות!
</div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔋 סוללה — mAh, V, הספק</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>מה זה Voltage (V):</strong> הלחץ החשמלי — כמה "כוח" יש לאלקטרונים לנוע</p>
<p><span class="lvl lvl-1">ידע</span> <strong>מה זה mAh (מיליאמפר לשעה):</strong> כמות האנרגיה האגורה בסוללה</p>
<ul style="padding-right:18px;margin:6px 0">
<li>סוללת 18Ah = יכולה לספק 18A במשך שעה אחת, או 1A במשך 18 שעות</li>
</ul>
<p><span class="lvl lvl-2">הבנה</span> <strong>מה זה הספק:</strong> P = V × I (וואט = וולט × אמפר)</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>הספק ≠ אנרגיה:</strong> אנרגיה = הספק × זמן (Wh)</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>דוגמה מהרובוט:</strong> סוללה 12V × 18Ah = 216Wh של אנרגיה זמינה</p>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
אם מנוע צורך 40A ב-12V — מה ההספק? מה יקרה לסוללה תוך 30 דקות?<br>
→ P = 12×40 = 480W. אנרגיה = 480W × 0.5h = 240Wh &gt; קיבולת הסוללה (216Wh) → יידלדל לפני 30 דקות
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>📡 PWM — בקר דיגיטלי, מנוע אנלוגי</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>הבקר (RoboRIO) הוא דיגיטלי:</strong> מוציא רק 0V או 5V — אין ערכים בינייים</p>
<p><span class="lvl lvl-1">ידע</span> <strong>המנוע הוא אנלוגי:</strong> צריך מתח רציף בין 0V ל-12V לשליטה במהירות</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>הפתרון — PWM:</strong> ממתג 0/1 מהר מאוד → הממוצע מדמה ערך אנלוגי</p>
<ul style="padding-right:18px;margin:6px 0">
<li>Duty Cycle 25% → ממוצע 3V → מנוע 25% מהירות</li>
<li>Duty Cycle 75% → ממוצע 9V → מנוע 75% מהירות</li>
</ul>
<p>המנוע לא "יודע" שקיבל אות דיגיטלי — הוא חש רק את הממוצע</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>הכלל:</strong> דיגיטלי → PWM → מדמה אנלוגי → מנוע מגיב כאנלוגי</p>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
למה לא פשוט להוריד מתח עם נגד?<br>
→ נגד מוריד מתח ע"י בזבוז אנרגיה כחום. PWM לא מאבד אנרגיה — יעיל בהרבה.
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🔌 מנוע Brushless — מבנה מלא</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>ב-Brushless אין קומוטטור ואין מברשות</strong></p>
<p><span class="lvl lvl-2">הבנה</span> <strong>סטטור (קבוע):</strong> 3 סלילים חשמליים בפנים הגוף — יוצרים שדה מגנטי מתחלף</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>רוטור (מסתובב):</strong> מגנטים קבועים על הציר — מגיבים לשדה ומסתובבים</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>קומוטציה אלקטרונית</strong> על ידי הבקר (TalonFX / SparkMax)</p>
<p>הבקר יודע מיקום הרוטור דרך חיישן Hall Effect או encoder</p>
<p>לפי המיקום — מחליף כיוון הזרם בסלילים → שדה מגנטי "רץ" → הרוטור רודף אחריו</p>
<p><span class="lvl lvl-1">ידע</span> <strong>יתרון:</strong> ללא שחיקה מכנית, 90–95% יעיל, ללא ניצוצות</p>
<div class="diagram">סטטור: [סליל A] [סליל B] [סליל C] (120° ביניהם)
רוטור:  [N] <--מגנט--> [S] מסתובב בתוך
בקר:    קורא encoder --> מחליף זרם בסלילים בזמן נכון</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🧠 מהי בקרה</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>הגדרה:</strong> שליטה בתהליך מסוים כדי להגיע למצב רצוי</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>רכיבי מערכת בקרה:</strong></p>
<table class="tbl">
<tr><th>רכיב</th><th>תפקיד</th></tr>
<tr><td>מנהל (Controller)</td><td>מחשב את הפקודה הדרושה</td></tr>
<tr><td>מבוקר (Plant)</td><td>המערכת שנשלטת (מנוע, רובוט)</td></tr>
<tr><td>חיישן (Sensor)</td><td>מודד את המצב הנוכחי</td></tr>
<tr><td>שגיאה (Error)</td><td>הפרש בין רצוי לנמדד = Xr − Xir</td></tr>
<tr><td>תיקון (Correction)</td><td>הפקודה שהמנהל שולח לסגירת הפער</td></tr>
</table>
<p style="margin-top:12px"><span class="lvl lvl-2">הבנה</span> <strong>חוג פתוח:</strong> פקודה → מבוקר. אין משוב. פשוט, לא מדויק.</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>חוג סגור:</strong> פקודה → מבוקר → חיישן → השוואה → תיקון → חזרה. מדויק.</p>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
מה יקרה אם החיישן שגוי בחוג סגור?<br>
→ התיקון יהיה שגוי — הרובוט "מתקן" לפי מדידה שגויה → מתנהג לא נכון
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>🚗 הנעה דיפרנציאלית — הבדל בין הנעה להיגוי</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>הנעה (Drive):</strong> כוח המניע את הרובוט קדימה/אחורה — המנועים מסובבים גלגלים</p>
<p><span class="lvl lvl-1">ידע</span> <strong>היגוי (Steering):</strong> כיוון התנועה — שליטה על לאן הרובוט פונה</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>דיפרנציאלי:</strong> לכל גלגל מהירות נפרדת. ההבדל בין הצדדים = פנייה.</p>
<ul style="padding-right:18px;margin:6px 0">
<li>שמאל מהיר מימין = פנייה ימינה</li>
<li>רדיוס הסיבוב תלוי בהפרש המהירות</li>
</ul>
<p><span class="lvl lvl-2">הבנה</span> <strong>בסוורב:</strong> הנעה והיגוי נפרדים לחלוטין לכל מודולה</p>
<ul style="padding-right:18px;margin:6px 0">
<li>מנוע 1: מניע (מהירות) | מנוע 2: מכוון (זווית)</li>
</ul>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
מה יקרה אם גלגל ימין מהר מאוד וגלגל שמאל עצר לגמרי?<br>
→ רדיוס סיבוב מינימלי — הרובוט יסתובב סביב הגלגל העצור
</div>
</div></div>

<div class="acc"><div class="acc-h" onclick="accToggle(this)"><span>⚡ ברייקרים, פיוזים, Mini PDB ומפצל</span><span class="acc-arrow">▼</span></div>
<div class="acc-b">
<p><span class="lvl lvl-1">ידע</span> <strong>פיוז (Fuse):</strong> רכיב חד-פעמי שנשרף כשהזרם עולה מדי → מנתק את המעגל</p>
<ul style="padding-right:18px;margin:4px 0 10px">
<li>ברובוט: PDH מכיל פיוזים 15A / 30A / 40A לכל ערוץ</li>
<li>אחרי שנשרף → חייבים להחליף</li>
</ul>
<p><span class="lvl lvl-1">ידע</span> <strong>ברייקר (Circuit Breaker):</strong> ניתן לאיפוס → מנתק בעומס יתר, ניתן ללחוץ שוב</p>
<ul style="padding-right:18px;margin:4px 0 10px">
<li>Main Breaker: הברייקר הראשי של הרובוט — מנתק הכל</li>
</ul>
<p><span class="lvl lvl-2">הבנה</span> <strong>Mini PDB (Power Distribution Board):</strong> לוח חלוקת חשמל קטן — מחלק מתח ממקור אחד לכמה מוצאים קטנים (5V, 12V logic)</p>
<p><span class="lvl lvl-2">הבנה</span> <strong>מפצל (Hub):</strong> חיבור מכני בלבד — מאפשר לחבר כמה כבלים לנקודה אחת. לא מגן, לא מווסת.</p>
<div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.3);border-radius:8px;padding:12px 14px;margin-top:14px;font-size:.83rem;line-height:1.7">
<strong>🔴 שאלת ניתוח — רמה 3</strong><br>
למה חשוב שלכל מנוע יהיה פיוז נפרד?<br>
→ אם מנוע אחד נתקע (stall) וצורך זרם גבוה → הפיוז שלו נשרף בלבד, לא כל הרובוט
</div>
</div></div>

<div class="bagrut-tip"><strong>💡 בגרות:</strong> רמה 1 — Voltage vs mAh, סטטור vs רוטור, פיוז vs ברייקר. רמה 2 — P=V×I, PWM ממוצע, Hall Effect בBrushless, error=Xr−Xir, דיפרנציאל הפרש. רמה 3 — חשב אנרגיה, למה PWM עדיף על נגד, מה קורה לחוג סגור אם חיישן שגוי.</div>`
  }
];

// ----------------------------------------------------------------
// INTERACTIVE SVG DIAGRAM FUNCTIONS
// Called by inline event handlers in TOPICS content (innerHTML strips <script> tags)
// ----------------------------------------------------------------

function hbridge(mode) {
  var s1 = document.getElementById('hb-s1');
  var s2 = document.getElementById('hb-s2');
  var s3 = document.getElementById('hb-s3');
  var s4 = document.getElementById('hb-s4');
  var ff = document.getElementById('hb-fwd');
  var fr = document.getElementById('hb-rev');
  var lbl = document.getElementById('hb-lbl');
  if (!s1) return;
  var act = '#22c55e', actR = '#ffd166', off = 'rgba(255,255,255,.08)';
  if (mode === 'forward') {
    s1.setAttribute('fill', act); s4.setAttribute('fill', act);
    s2.setAttribute('fill', off); s3.setAttribute('fill', off);
    ff.style.display = ''; fr.style.display = 'none';
    lbl.textContent = 'S1+S4 סגורים — זרם קדימה — מנוע סובב קדימה';
    lbl.style.color = '#22c55e';
  } else if (mode === 'reverse') {
    s2.setAttribute('fill', actR); s3.setAttribute('fill', actR);
    s1.setAttribute('fill', off); s4.setAttribute('fill', off);
    fr.style.display = ''; ff.style.display = 'none';
    lbl.textContent = 'S2+S3 סגורים — זרם אחורה — מנוע סובב אחורה';
    lbl.style.color = '#ffd166';
  } else {
    [s1, s2, s3, s4].forEach(function(s) { s.setAttribute('fill', off); });
    ff.style.display = 'none'; fr.style.display = 'none';
    lbl.textContent = 'כל המפסקים פתוחים — אין זרם — עצירה';
    lbl.style.color = '#64748b';
  }
}

function pwmUpdate(v) {
  v = parseInt(v);
  var hi = document.getElementById('pwmHigh');
  var lo = document.getElementById('pwmLow');
  var pct = document.getElementById('pwmPct');
  var disp = document.getElementById('pwmDisplay');
  if (!hi) return;
  var hw = Math.round(3 * v);
  hi.setAttribute('width', hw);
  lo.setAttribute('x', hw);
  lo.setAttribute('width', 300 - hw);
  pct.textContent = v + '%';
  disp.textContent = 'מתח ממוצע: ' + (12 * v / 100).toFixed(1) + 'V = 12V × ' + (v / 100).toFixed(2);
}

function toggleCurve(name) {
  var trap = document.getElementById('mp-trap');
  var sc = document.getElementById('mp-scurve');
  var btTrap = document.getElementById('mp-btn-trap');
  var btSc = document.getElementById('mp-btn-sc');
  if (!trap) return;
  if (name === 'trap') {
    trap.style.display = ''; sc.style.display = 'none';
    btTrap.style.borderColor = '#22c55e'; btTrap.style.color = '#22c55e';
    btSc.style.borderColor = 'rgba(255,209,102,.3)'; btSc.style.color = '#ffd166';
  } else {
    sc.style.display = ''; trap.style.display = 'none';
    btSc.style.borderColor = '#ffd166'; btSc.style.color = '#ffd166';
    btTrap.style.borderColor = 'rgba(34,197,94,.3)'; btTrap.style.color = '#22c55e';
  }
}

function cogSlider(v) {
  v = parseInt(v);
  var dot = document.getElementById('cog-dot');
  var lbl = document.getElementById('cog-lbl');
  var rb = document.getElementById('cog-robot');
  var stb = document.getElementById('cog-stable');
  var mom = document.getElementById('cog-moment');
  if (!dot) return;
  var baseY = 210, topY = 70;
  var cy = Math.round(baseY - (v / 200) * (baseY - topY));
  dot.setAttribute('cy', cy);
  document.getElementById('cog-dot-lbl').setAttribute('y', cy - 4);
  lbl.textContent = 'גובה מרכז כובד: ' + Math.round(v * 0.8) + ' סםמ';
  var stable = cy > 130;
  if (rb) rb.setAttribute('stroke', stable ? '#22c55e' : '#ef4444');
  if (stb) { stb.textContent = stable ? 'יציב ✓' : 'לא יציב! ✗'; stb.style.fill = stable ? '#22c55e' : '#ef4444'; }
  if (mom) {
    mom.setAttribute('x1', 200); mom.setAttribute('y1', cy);
    mom.setAttribute('x2', 108); mom.setAttribute('y2', 230);
    mom.style.display = stable ? 'none' : '';
  }
  if (dot) dot.setAttribute('fill', stable ? '#22c55e' : '#ef4444');
}

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
  { type: 'ארכיטקטורה', title: 'Swerve Drive — מודולות + FOC + Odometry', snippet: 'Talon FX, Falcon, holonomic motion, field-oriented', url: 'architecture.html', navIdx: null },
  { type: 'ארכיטקטורה', title: 'Vision — SolvePnP + AprilTags + Kalman', snippet: 'Pose 6DOF, reliability, fusion, ±1.5 cm', url: 'architecture.html', navIdx: null },
  { type: 'ארכיטקטורה', title: 'FSM — Finite State Machine', snippet: 'IDLE, SPINNING_UP, READY_TO_FIRE, FIRING', url: 'architecture.html', navIdx: null },
  { type: 'קוד', title: 'Robot.java — Command-Based WPILib', snippet: 'TimedRobot, CommandScheduler, SubsystemBase', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'Drive.java — Swerve kinematics + FOC', snippet: 'SwerveDriveKinematics, ChassisSpeeds, gyro', url: 'code.html', navIdx: null },
  { type: 'קוד', title: 'Shooter.java — PID + Feedforward + Hood', snippet: 'PIDController, SimpleMotorFeedforward, hood angle', url: 'code.html', navIdx: null },
];
