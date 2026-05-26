'use strict';

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
  var getLang = function() { return localStorage.getItem('study_lang') || 'he'; };
}
if (typeof t === 'undefined') {
  var t = function(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const l = getLang();
    return obj[l] || obj.he || obj.en || '';
  };
}

const TOPICS = [
  {
    key: 'definitions',
    icon: '📖',
    title: 'הגדרות',
    subtitle: 'טיסן · גדול · זעיר · רישיון מטיסן · רישיון מטיס · כטב"מ',
    content: `
      <div class="acc">
        <div class="acc-h" onclick="tog(this)"><span>🔹 הגדרות בסיסיות</span><span class="acc-arrow">▼</span></div>
        <div class="acc-b">
          <table class="data-table">
            <tr><th>מונח</th><th>הגדרה</th></tr>
            <tr><td><strong>טיסן</strong></td><td>כלי רחיפה לספורט ופנאי בלבד, מסה < 150 ק"ג (רחפן, כנף קבועה, מסוק וכד')</td></tr>
            <tr><td><strong>טיסן גדול</strong></td><td>מסה > 25 ק"ג בהמראה</td></tr>
            <tr><td><strong>טיסן זעיר</strong></td><td>מסה ≤ 250 גרם בהמראה</td></tr>
            <tr><td><strong>כטב"מ</strong></td><td>כלי טיס בלתי מאויש — הפעלה מסחרית/כללית</td></tr>
            <tr><td><strong>כטב"מ קטן</strong></td><td>מסה < 25 ק"ג — הפעלה מסחרית</td></tr>
            <tr><td><strong>רישיון מטיסן</strong></td><td>הרשאה להטיס טיסן לספורט ופנאי בלבד (גיל מינימלי: 12)</td></tr>
            <tr><td><strong>רישיון מטיס</strong></td><td>הרשאה להטיס כטב"מ — הפעלה מסחרית (גיל מינימלי: 16)</td></tr>
          </table>
          <div class="hbox blue">💡 ההבדל העיקרי: טיסן = ספורט ופנאי בלבד. כטב"מ = מסחרי/כללי.</div>
        </div>
      </div>
      <div class="acc">
        <div class="acc-h" onclick="tog(this)"><span>🗺️ הגדרות מרחב אווירי</span><span class="acc-arrow">▼</span></div>
        <div class="acc-b">
          <table class="data-table">
            <tr><th>מונח</th><th>הגדרה</th></tr>
            <tr><td><strong>אזור אסור לטיסה</strong></td><td>מרחב אוויר בו טיסה אסורה לחלוטין (לפי פמ"ת)</td></tr>
            <tr><td><strong>אזור מוגבל לטיסה</strong></td><td>טיסה מותרת בתנאים מסוימים בלבד (לפי פמ"ת)</td></tr>
            <tr><td><strong>אזור מסוכן לטיסה</strong></td><td>פעילויות מסוכנות בפרקי זמן מוגדרים (לפי פמ"ת/נוטאם)</td></tr>
            <tr><td><strong>אזור מאוכלס</strong></td><td>מגורים, תעשייה, מסחר, פנאי בשטח יישוב</td></tr>
            <tr><td><strong>תשתית</strong></td><td>אזור מאוכלס + כל אתר שפגיעת טיסן עלולה לסכן חיים/רכוש</td></tr>
            <tr><td><strong>פמ"ת</strong></td><td>פרסום מידע תעופתי — אתר רשות התעופה האזרחית</td></tr>
            <tr><td><strong>NOTAM</strong></td><td>פרסום מידע תעופתי זמני — אתר רשות שדות התעופה</td></tr>
          </table>
        </div>
      </div>
      <div class="acc">
        <div class="acc-h" onclick="tog(this)"><span>👁️ קשר עין ישיר וראות טיסה</span><span class="acc-arrow">▼</span></div>
        <div class="acc-b">
          <p><strong>קשר עין ישיר:</strong> המטיסן רואה את הטיסן בעצמו (עם/בלי עדשות מתקנות), באופן רציף, כל ההפעלה, ויכול לקבוע:</p>
          <ul>
            <li>מיקום במרחב (Location)</li>
            <li>מצב ביחס לאופק (Attitude)</li>
            <li>גובה טיסה (Altitude)</li>
            <li>כיוון טיסה (Direction of flight)</li>
          </ul>
          <p style="margin-top:12px"><strong>ראות טיסה:</strong> מרחק אופקי ממנו ניתן לראות ולזהות:</p>
          <ul>
            <li>ביום: עצם בולט לעין (לא חייב מואר)</li>
            <li>בלילה: עצם בולט לעין מואר</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    key: 'license_rules',
    icon: '📋',
    title: 'תקנות הרישיון',
    subtitle: 'תנאים לקבלת רישיון · רישום · סימון · בדיקת כשירות',
    content: `
      <div class="acc">
        <div class="acc-h" onclick="tog(this)"><span>✅ תנאים לקבלת רישיון מטיסן</span><span class="acc-arrow">▼</span></div>
        <div class="acc-b">
          <ul>
            <li>גיל מינימלי: <strong>12 שנים</strong></li>
            <li>קורא, מדבר ומבין עברית או אנגלית (+ אנגלית טכנית תעופתית)</li>
            <li>עבר מבחן ידע מקצועי תעופתי באתר רת"א</li>
          </ul>
          <div class="hbox yellow">⚠️ המנהל רשאי לסרב לרישיון עד שנה אם: מסר מידע כוזב / עלול לסכן אחרים</div>
          <p style="margin-top:12px"><strong>הפעלת טיסן על ידי מי שטרם מלאו לו 12:</strong></p>
          <ul>
            <li>המפקח: גיל 16+ ובעל רישיון מטיסן</li>
            <li>נמצא במרחק ≤ 2 מטר מהמושגח</li>
            <li>יכול לקחת שליטה מידית</li>
            <li>שומר קשר עין ישיר לאורך כל ההפעלה</li>
          </ul>
        </div>
      </div>
      <div class="acc">
        <div class="acc-h" onclick="tog(this)"><span>📝 חובת רישום וסימון</span><span class="acc-arrow">▼</span></div>
        <div class="acc-b">
          <ul>
            <li>חובת רישום: <strong>כל טיסן למעט טיסן זעיר</strong> (≤250 גרם)</li>
            <li>חובת סימון: מספר הרישום על גוף הטיסן — גלוי וקריא</li>
            <li>תוקף רישום: <strong>4 שנים</strong> (ניתן לחידוש)</li>
            <li>חובת הודעה לרת"א תוך <strong>14 יום</strong>: הרס / גנבה / מכירה / פטירת בעלים</li>
            <li>פרטי רישום: יצרן, דגם, מספר מזהה יצרן (אם קיים) / מספר סידורי בקר טיסה</li>
          </ul>
        </div>
      </div>
      <div class="acc">
    