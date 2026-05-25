import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Circle, BookOpen, ShieldCheck, AlertTriangle, 
  Award, ArrowRight, ArrowLeft, Activity, UserCheck, FileSignature, 
  Zap, MessageCircle, AlertOctagon, Smile, Frown, ClipboardList,
  User, CheckSquare, Printer, Users, LogOut, ChevronDown, ChevronUp, Sparkles,
  LayoutDashboard, GraduationCap, HelpCircle, Play, Search, X, ChevronRight, Save, Lock, Clock,
  Settings, ArrowUpRight
} from 'lucide-react';

// --- FIREBASE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// Your real Firebase configuration for Vercel
const myFirebaseConfig = {
  apiKey: "AIzaSyC4tH66fqlSMDJ--WkzdKVVx8jt5G3wrw0",
  authDomain: "selfishly-lms.firebaseapp.com",
  projectId: "selfishly-lms",
  storageBucket: "selfishly-lms.firebasestorage.app",
  messagingSenderId: "48956098560",
  appId: "1:48956098560:web:6a1c70571d6c08da6670e5",
  measurementId: "G-D7JFHNZGZS"
};

let app, auth, db;

try {
  let configToUse;
  try {
    const injected = window.__firebase_config;
    configToUse = (injected && Object.keys(JSON.parse(injected)).length > 0)
      ? JSON.parse(injected)
      : myFirebaseConfig;
  } catch {
    configToUse = myFirebaseConfig;
  }

  app = initializeApp(configToUse);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase not initialized. Running in local mode.");
}

const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'selfishly-lms-v1';

// 🔒 CHANGE THIS TO YOUR CLINIC'S SECRET SUPERVISOR PIN 🔒
const SUPERVISOR_ACCESS_PIN = "2790";

// --- CUSTOM HELPER FUNCTIONS ---
const formatTime = (totalSeconds) => {
  if (!totalSeconds) return "0m 0s";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

const formatTimeAgo = (isoString) => {
  const seconds = Math.floor((new Date() - new Date(isoString)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

// --- LHR MODULES ---
const LHR_MODULES = [
  {
    id: 'lhr-1',
    title: "Foundations of Laser Hair Removal",
    icon: <Zap className="w-5 h-5" />,
    description: "Learn the core mechanism of selective photothermolysis and parameter interaction.",
    track: "Clinical Basics",
    duration: "45 min",
    content: `
      **What is Laser Hair Removal?**
      We use a focused light to eliminate the hair follicle. The light creates a mechanism we call selective photothermolysis *(aka using light to specifically cook a target)*. This generates heat—very high temperatures, roughly 40 to 60 °C—in the germinative matrix *(the baby hair factory at the root)* of the hair. The target structure is heated enough to trigger an inflammatory process, coagulate (cauterize) the follicle, and interrupt its vascular nourishment. The follicle then involutes and will not regenerate hair because mitotic activity is abolished.

      **Tissue Denaturation: The "Cooking Egg" Analogy**
      Here is denaturation in practice. Think of it like cooking: proteins change structure when exposed to heat, which is exactly what happens when you fry an egg. You watch the white change from translucent to opaque. That’s denaturation. Some areas cook faster than others, similar to what we see in skin. 
      When cooking eggs, we often flip them to ensure both sides reach sufficient temperature. The same principle applies here: temperature and time (thermal dose) *both* determine whether you achieve effective denaturation. A given temperature might not be enough unless maintained long enough to denature the target cells. Furthermore, treatments only work during the *anagen* (active growth) phase. Because you cannot reliably tell which hairs are in anagen, multiple sessions are required to catch all follicles during their susceptible phase.

      **Mechanism: Selective Photothermolysis**
      Why is it “selective”? Because the light seeks a specific target (chromophore *(the color molecule the laser is obsessed with)*). In hair removal, the target is melanin. Wherever melanin exists, the light penetrates and “hunts” that target, degrading the melanin and generating heat. That is why you often smell burned hair or see the hair tip carbonized.

      **Melanin in Hair and Skin**
      Melanin is present not only in hair but also in skin. Even very fair skin contains melanin. Since the laser targets melanin, skin also absorbs energy. This is why we use parameters and mechanisms to protect the skin while sparing surrounding epidermis and dermis. To deliver effective heat to the germinative matrix, we must combine several parameters; no single parameter is sufficient. Conversely, gray or white hair lacks melanin, making it a poor target for laser energy.

      **Energy Units and Fluence: Joules vs. J/cm²**
      An important unit in laser dosimetry is energy density, also known as fluence. It is measured in Joules per square centimeter (J/cm²) and corresponds to the amount of energy deposited over a given area. The calculation of fluence is energy divided by area: (Power × Time) / Area.
      
      *Example:* Imagine a laser with 40 milliwatts (0.04 W) of power applied for 10 seconds, and the beam area is 2 cm².
      Fluence = (0.04 W × 10 s) / 2 cm² = 0.2 J/cm².
      If you use the same power and time but a smaller beam area of 0.1 cm², the fluence becomes 4 J/cm². **A smaller beam area delivers a higher fluence for the same power and time.**

      **Why Joules (Energy) Matter More**
      Although fluence (J/cm²) is a useful specification, the most important dosimetric unit for therapeutic effect is the total energy delivered in Joules (J). That is the quantity that actually produces the biological effects in human tissue.
      • Energy (J) = Power (W) × Time (s)
      
      *Common Confusion:* Joules (J) is the total energy delivered, whereas J/cm² is energy per unit area. If your device only provides fluence (J/cm²), you can compute the actual energy delivered by multiplying: **Energy (J) = Fluence (J/cm²) × Area (cm²)**.

      **Key Parameters:**
      • **Wavelength:** Determines specificity and depth of penetration. Lasers operating between 700 and 1,000 nm selectively target melanin in the hair shaft while minimizing absorption by competing chromophores like water and blood. (e.g., Ruby 694nm, Alexandrite 755nm, Diode 810nm, Nd:YAG 1064nm).
      • **Fluence:** Energy density (measured in J/cm²).
      • **Pulse Duration (Width):** Affects thermal relaxation *(how fast the target cools down)* and selectivity.
      • **Spot Size:** Affects depth and coverage. Larger spot sizes are more effective because they increase the depth of light penetration (typically > 5-10mm is required to reach the deep dermis).
      • **Cooling:** Essential for epidermal protection. Dynamic cooling or cold airflow is highly effective at reducing epidermal damage.

      **Wavelength Penetration: Lasers vs. IPL**
      Some claim lasers are vastly superior to IPL or vice versa. The reality is rooted in physics. A laser emits a single wavelength, while IPL emits a broad spectrum. Wavelength determines how deep light penetrates:
      • **Blue Light:** Absorbed mostly in the epidermis (≈0.1 mm thick).
      • **Green/Yellow Light:** Penetrates slightly deeper for superficial vascular lesions.
      • **Red/Near-Infrared (IR):** Penetrates deepest into the mid-to-deep dermis.
      Because hair follicles are deep targets, you MUST use red or near-IR wavelengths (e.g., 755 nm Alexandrite, 810 nm Diode, 1064 nm Nd:YAG) to deposit energy at follicular depth. Blue or green wavelengths simply cannot carry enough energy down to denature germ cells reliably.
    `,
    questions: [
      {
        id: '1-1',
        text: "Using only wavelength, without adjusting fluence, pulse duration, spot size, or cooling, is sufficient to achieve safe and effective laser hair removal for every patient.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "The lesson clearly states multiple interacting parameters and operator technique are required for safe, effective results."
      },
      {
        id: '1-2',
        text: "Which statement best summarizes how wavelength fits into selecting parameters for laser hair removal?",
        options: [
          "Wavelength choice is irrelevant when using cooling and high fluence.",
          "Wavelength determines depth and target specificity but must be combined with fluence, pulse duration, spot size, and cooling.",
          "Wavelength alone is sufficient to ensure safe and effective hair removal."
        ],
        correctIndex: 1,
        explanation: "Wavelength sets penetration and specificity but explicitly requires combining with other parameters and cooling."
      }
    ]
  },
  {
    id: 'lhr-2',
    title: "SplendorX: Device Operation & BLEND X",
    icon: <Activity className="w-5 h-5" />,
    description: "Mastering the SplendorX interface, pulse duration, and safe handpiece operation.",
    track: "Clinical Basics",
    duration: "50 min",
    content: `
      **BLEND X Technology & Wavelength Customization**
      The SplendorX features proprietary BLEND X technology, which allows for the synchronized, simultaneous emission of both Alexandrite (755nm) and Nd:YAG (1064nm) from a single handpiece. 
      Using the Blend Mode, you must adjust the ratios based on the patient's Fitzpatrick skin type:
      • **Skin Types I-II (Fair):** You will rely heavily on Alexandrite (e.g., 75% Alex / 25% Nd:YAG).
      • **Skin Types III-IV (Medium/Olive):** Often utilize a balanced 50/50 mix.
      • **Skin Types V-VI (Dark):** You must protect the epidermis by dropping the Alex significantly. You will use mostly or entirely Nd:YAG (e.g., 75% to 100% Nd:YAG) to safely target the deep root without burning the surface skin.

      **CRITICAL SAFETY WARNING: Spot Size Selection**
      **The SplendorX does NOT have automatic spot size recognition.** Before firing, the operator *must manually ensure* that the spot size and shape selected on the screen perfectly matches the physical tip inserted into the handpiece. Failing to double-check this can lead to severe patient injuries and irreversible damage to the laser. 

      **Operating the Handpiece: Square vs. Round Spots**
      • **Round Spots:** Because circles cannot fit perfectly side-by-side without leaving gaps, treating with a round spot requires you to overlap your pulses by 10-15%.
      • **Square Spots:** The unique square footprint allows you to "hop" the handpiece edge-to-edge in a perfect grid. **With square spots, there is NO need to overlap.** Overlapping square spots will double the heat in that area and cause burns.
    `,
    questions: [
      {
        id: '2-1',
        text: "You are treating a patient with Fitzpatrick Type V (dark) skin. Based on the principles of wavelength absorption, how should you adjust your BLEND X ratios?",
        options: [
          "Use 100% Alexandrite (755nm) to ensure the hair is destroyed.",
          "Use a 50/50 mix of Alexandrite and Nd:YAG.",
          "Rely mostly or entirely on Nd:YAG (1064nm) to bypass epidermal melanin and prevent burns."
        ],
        correctIndex: 2,
        explanation: "Correct! Nd:YAG (1064nm) is much safer for Skin Types V and VI because it has lower melanin absorption and penetrates deeper."
      },
      {
        id: '2-2',
        text: "When changing the physical tip on the SplendorX handpiece to a different size, what MUST the operator do to prevent patient injury?",
        options: [
          "Nothing, the machine automatically detects the new spot size.",
          "Manually update the screen to perfectly match the new spot size and shape."
        ],
        correctIndex: 1,
        explanation: "Absolutely critical! The SplendorX does not know what tip is attached. You must manually verify that the screen settings match."
      },
      {
        id: '2-3',
        text: "When using the Square Spot tip on the SplendorX, how much should you overlap your pulses?",
        options: [
          "10% to 15% overlap.",
          "50% overlap.",
          "0% overlap (No overlapping)."
        ],
        correctIndex: 2,
        explanation: "Correct! The major advantage of the square spot is that it can be stacked edge-to-edge in a grid. Overlapping square spots will double the delivered energy and cause burns."
      }
    ]
  },
  {
    id: 'lhr-3',
    title: "Skin Anatomy, Fitzpatrick Types & Conditions",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Deep dive into skin anatomy, ethnic skin typing, and treating over skin conditions.",
    track: "Clinical Basics",
    duration: "40 min",
    content: `
      **Mastering the Fitzpatrick Scale & Ethnic Skin**
      Properly classifying a patient's skin type is the most critical safety step. Do not just look at their current skin color; consider their ethnic background (the Lancer Ethnicity Scale) and how they react to the sun.
      • **Type I & II:** Fair/light skin, light eyes. Highly sun-sensitive, always burns, never or rarely tans. (Generally safe for 755nm Alexandrite).
      • **Type III:** Olive skin, dark hair, Mediterranean background. Sometimes burns but tans evenly. (Safe for Alexandrite or a Blend).
      • **Type IV (Olive / Hispanic / Asian):** Medium brown skin. *Provider Trap!* Many patients of East Asian descent appear very fair and might classify themselves as a Type II. However, Asian skin has highly reactive melanocytes. Even if they look pale, you MUST treat them cautiously (often as a Type IV) because they are highly prone to Post-Inflammatory Hyperpigmentation (PIH) from laser heat.
      • **Type V & VI (Brown to Black):** Deep brown to black skin, Afro-Caribbean or African background (e.g., Will Smith). Sun-insensitive, never burns. Abundant epidermal melanin. **You must rely heavily or entirely on Nd:YAG (1064nm)** to bypass the epidermis and prevent severe burns or permanent hypopigmentation. The 1064 nm Nd:YAG laser is the preferred and safest choice for darker skin tones.

      **Common Skin Conditions in the Laser Room**
      • **"Strawberry Skin" (Keratosis Pilaris):** Patients often complain of tiny dark dots or rough bumps on their legs or arms. This is caused by excess keratin trapping dead skin and hair inside the follicle. *Good news:* Laser hair removal is one of the best treatments for this! By destroying the hair follicle, you eliminate the pocket where the keratin gets trapped, smoothing the skin over time.
      • **Melasma:** Patches of hyperpigmentation, often on the upper lip or cheeks, triggered by hormones and heat. *Warning:* Do NOT treat directly over active melasma with high heat, as the thermal energy from the laser can stimulate the melanocytes and make the melasma much darker.
    `,
    questions: [
      {
        id: '3-1',
        text: "A patient of East Asian descent comes in for treatment. Her skin appears very fair and she says she burns easily in the sun. Why should you still exercise extreme caution and likely treat her as a Fitzpatrick Type IV?",
        options: [
          "Because fair skin absorbs more heat than dark skin.",
          "Because Asian skin types have highly reactive melanocytes and are extremely prone to Post-Inflammatory Hyperpigmentation (PIH) from heat.",
          "Because Alexandrite lasers do not work on fair skin."
        ],
        correctIndex: 1,
        explanation: "This is a classic provider trap. Despite appearing pale, Asian skin behaves like a Type IV under laser heat. The melanocytes are highly reactive and will trigger PIH if treated too aggressively."
      },
      {
        id: '3-2',
        text: "The 1064 nm Nd:YAG laser is the preferred and safest choice for darker skin tones (Fitzpatrick Types V and VI).",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "True. The Nd:YAG 1064nm wavelength penetrates deeply and has the lowest epidermal melanin absorption, bypassing the surface skin to safely target the deep hair bulb on darker skin tones."
      }
    ]
  },
  {
    id: 'lhr-4',
    title: "Lumenis Safety & Contraindications",
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "Critical safety measures including Dual Cooling and dual-wavelength eyewear.",
    track: "Clinical Safety",
    duration: "30 min",
    content: `
      Safety is our highest priority. Because the SplendorX emits two distinct wavelengths (755nm and 1064nm) simultaneously, both the operator and the patient MUST wear specialized protective eyewear rated for BOTH wavelengths. 
      
      **Comprehensive Contraindications & Special Care:**
      • **Absolute Contraindications:** Pregnancy, breastfeeding, recent sun exposure, intense tan, or use of self-tanning products (within 2-4 weeks). Active infections or Herpes Simplex in the treatment area (requires antiviral prophylaxis). Cancer or pre-cancerous lesions in the treatment area. Epilepsy (due to risk of light-induced seizures). Diseases causing photosensitivity. Anticoagulant therapy. Mechanical or chemical hair removal (waxing/plucking) within 6 weeks prior.
      • **Photosensitizing Medications:** You must screen for medications that make the skin sensitive to light, which can cause severe burns or pigmentation changes. Contraindicated medications include:
        - **Antibiotics:** Tetracyclines (Doxycycline, Minocycline), Fluoroquinolones (Cipro), Sulfonamides (Bactrim).
        - **Acne medications:** Oral isotretinoin (Accutane) requires a strict 6-month waiting period.
        - **NSAIDs:** Ibuprofen (Advil, Motrin), Naproxen (Aleve), Celecoxib (Celebrex), Diclofenac.
      • **Tattoos & Permanent Makeup:** NEVER treat directly over tattoos or permanent makeup (e.g., lip liner, microblading). The laser will aggressively target the ink pigment, causing severe burns and destroying the tattoo. Always maintain a minimum 2mm safety margin. White eyeliner or white stickers can be used to block the pigment.
    `,
    questions: [
      {
        id: '4-1',
        text: "A patient requests laser hair removal on their lower leg, but they have a large, dark tattoo on their calf. How should you proceed?",
        options: [
          "Treat directly over the tattoo, but use the Nd:YAG wavelength since it's safer for dark pigment.",
          "Cover the tattoo with white paper or white eyeliner and maintain at least a 2mm safety border around it.",
          "You cannot treat any part of the leg if there is a tattoo present anywhere on the limb."
        ],
        correctIndex: 1,
        explanation: "Never treat directly over tattoos or permanent makeup! The laser cannot differentiate between melanin and ink pigment. Firing over a tattoo will cause severe burns and ruin the tattoo."
      },
      {
        id: '4-2',
        text: "A patient arrives for their laser hair removal appointment and mentions they just started a course of Doxycycline (an antibiotic) for a sinus infection. How should you proceed?",
        options: [
          "Proceed with the treatment normally, as antibiotics only affect bacteria.",
          "Lower the laser fluence by 50% and proceed with the treatment.",
          "Postpone the treatment until they have finished the course and the medication is out of their system."
        ],
        correctIndex: 2,
        explanation: "Many antibiotics, especially Tetracyclines like Doxycycline, are highly photosensitizing. Firing a laser on a patient taking these medications can result in severe burns or hyperpigmentation."
      }
    ]
  },
  {
    id: 'lhr-5',
    title: "Patient FAQs & Consultation",
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Common patient questions and how to answer them professionally.",
    track: "Guest Experience",
    duration: "25 min",
    content: `
      **Common Patient FAQs**
      As a laser provider, setting realistic expectations during the consultation is just as important as the treatment itself.

      **1. "How many sessions will I need?"**
      **Provider Answer:** "We usually advise that it takes somewhere close to 10-12 sessions. This is because laser hair removal only destroys hair follicles that are in the active growth phase (Anagen). Because your hair grows in cycles, we need multiple sessions spaced 4 to 8 weeks apart to catch all the follicles in their active phase. The total hair growth cycle varies by body part: the upper lip cycle is short (4-6 months), while the back or thighs can take 6-12 months to complete a full cycle."

      **2. "Can I shave between treatments?"**
      **Provider Answer:** "Yes! In fact, you MUST shave 24 hours before your session. However, you absolutely cannot wax, pluck, tweeze, or thread between sessions. Those methods remove the hair root entirely, leaving the laser with no 'target' (melanin) to hunt."

      **3. "Is it 100% permanent and does it work on gray hair?"**
      **Provider Answer:** "The FDA classifies this as 'permanent hair reduction.' You can expect an 80-90% reduction in hair growth. However, laser relies on melanin (pigment) to work. Gray, white, or light blonde hair will NOT respond to laser."
    `,
    questions: [
      {
        id: '5-1',
        text: "Why are multiple sessions required for laser hair removal?",
        options: [
          "Because the laser only destroys hair in the active (Anagen) growth phase",
          "Because the machine needs time to recharge",
          "To make sure the skin has time to tan between sessions"
        ],
        correctIndex: 0,
        explanation: "Laser light can only destroy the germinative matrix when the hair is attached during the Anagen (active) phase. Hairs in Catagen or Telogen phases will need to be caught in future sessions."
      },
      {
        id: '5-2',
        text: "A patient asks if they can wax their upper lip a week before their laser appointment. What is the correct response?",
        options: [
          "Yes, waxing makes the laser more effective.",
          "No, waxing removes the hair root, leaving no target for the laser.",
          "No, they should use depilatory creams (like Nair) instead."
        ],
        correctIndex: 1,
        explanation: "Waxing rips the entire hair out of the follicle. Without that melanin-rich root present inside the skin, the laser light has nothing to target and will be completely ineffective."
      }
    ]
  },
  {
    id: 'lhr-6',
    title: "Complications & Adverse Reactions",
    icon: <AlertOctagon className="w-5 h-5" />,
    description: "Identifying, managing, and preventing laser complications.",
    track: "Clinical Safety",
    duration: "35 min",
    content: `
      **Normal Endpoints vs. Complications**
      It is vital to distinguish between a successful clinical endpoint and an adverse reaction.
      • **Normal Response:** Erythema (redness) and Perifollicular Edema (PFE). This means the follicle was successfully targeted.
      
      **Common Complications & Causes**
      • **Ocular Complications:** Direct or indirect ocular exposure can severely damage the cornea or retina.
      • **Burns & Blistering:** Caused by fluences that are too high, inadequate cooling, overlapping pulses, or treating skin with recent sun exposure (active melanin). 
      • **Hypopigmentation (White Spots):** These occur when the laser causes thermal damage to the skin’s melanin-producing cells. It is most directly associated with *laser settings that are too high* or treating recently tanned skin. 
      • **Paradoxical Hypertrichosis:** The stimulation of *new* terminal hair growth. Usually happens when sub-lethal (too low) fluences are used, effectively "warming" and stimulating the follicle instead of destroying it. *Warning:* Treating areas with fine, vellus hair ("peach fuzz") can inadvertently stimulate those hairs to become thick, terminal hairs.

      **Emergency Protocol: What to do if a burn occurs**
      If a patient complains of severe, lingering pain, or you visually notice extreme frosting, blistering, or skin lifting:
      1. **STOP IMMEDIATELY:** Cease laser firing. Turn the machine to standby.
      2. **COOL THE AREA:** Apply cold compresses or ice packs for 10-15 minutes to pull the heat out of the tissue.
      3. **TREAT:** Apply a soothing barrier ointment.
    `,
    questions: [
      {
        id: '6-1',
        text: "What is the IMMEDIATE first step if you suspect you have burned a patient or they report severe, abnormal pain?",
        options: [
          "Apply hydrocortisone cream while continuing to laser.",
          "Stop the treatment immediately and apply a cold compress to pull heat from the tissue.",
          "Turn up the fluence to finish the treatment faster."
        ],
        correctIndex: 1,
        explanation: "You must immediately cease laser firing and cool the area. Pulling the heat out of the tissue stops the thermal damage from progressing deeper into the skin."
      },
      {
        id: '6-2',
        text: "Which factor is most directly associated with the development of white spots (hypopigmentation) after laser hair removal?",
        options: [
          "Having a darker skin tone, which increases melanin production.",
          "Laser settings that are too high, causing thermal damage to the skin.",
          "Using a gentle cleanser as part of aftercare to soothe the skin."
        ],
        correctIndex: 1,
        explanation: "When laser settings are too intense, they can cause thermal damage that disrupts or destroys the skin's melanin-producing cells, leading to hypopigmentation (white spots)."
      }
    ]
  },
  {
    id: 'lhr-7',
    title: "Pre & Post Treatment Care Protocols",
    icon: <ClipboardList className="w-5 h-5" />,
    description: "Essential preparation and aftercare steps to maximize results and minimize side effects.",
    track: "Guest Experience",
    duration: "20 min",
    content: `
      **Pre-Treatment Care: Setting Up for Success**
      1. **Shave - Don’t Wax or Thread:** Shaving preserves the follicle while removing surface hair, allowing laser energy to travel directly to the root. 
      2. **Avoid Sun Exposure:** Tanned skin contains excess melanin, which competes with the hair follicle for laser energy. Avoid sun exposure for 10–14 days, skip tanning beds, and use broad-spectrum SPF daily. Treating recently tanned skin increases the risk of pigmentation changes.
      3. **Pause Certain Skincare Products:** Temporarily stop active ingredients like retinoids, exfoliating acids (AHA/BHA), and benzoyl peroxide 5–7 days prior.

      **Post-Treatment Care: Supporting the Healing Process**
      Immediately after treatment, mild redness or warmth (perifollicular edema) is normal. The goal is to let the skin cool down and heal:
      • **Avoid Heat:** Skip hot showers, saunas, hot tubs, and intense sweaty workouts for 24-48 hours. Trapping heat in the skin can cause rashes or blistering.
      • **Sun Protection is Critical:** Post-treatment skin is highly photosensitive. Apply SPF 30+ daily and keep the area covered.
      
      *Pro Provider Tips for Post-Care:*
      • **The "Shedding" Phase:** About 1 to 3 weeks after treatment, the destroyed hairs will push their way out of the skin. It looks like new hair growth, but it's actually dead hair shedding! *Important Note:* Not everyone sheds dramatically after every single session. Especially toward the endpoint of their LHR journey, shedding might be completely unnoticeable. Reassure the patient that this is a normal sign of progress.
      • **Gentle Exfoliation:** Once the redness subsides (usually after 3-5 days), gently exfoliate the area in the shower with a washcloth or shower glove to help the dead hairs shed and prevent ingrowns. 
    `,
    questions: [
      {
        id: '7-1',
        text: "Why are patients instructed to avoid hot showers, saunas, and intense workouts for 24 to 48 hours after a laser session?",
        options: [
          "Because sweat will wash away the laser energy.",
          "To prevent trapping excess heat in the skin, which can lead to blistering or rashes.",
          "Because hot water will stimulate the hair to grow back instantly."
        ],
        correctIndex: 1,
        explanation: "The laser deposits a massive amount of heat into the follicles. Adding external heat (like a sauna or hot shower) or internal heat (intense workouts) before the skin cools down can trigger adverse reactions like blistering."
      },
      {
        id: '7-2',
        text: "A patient is concerned because they didn't notice any dramatic 'shedding' after their 7th laser session. What is the most appropriate clinical response?",
        options: [
          "Assume they must have secretly waxed between sessions and reprimand them.",
          "Reassure them that shedding is often unnoticeable toward the end of their LHR journey because the remaining hair is much finer and sparser.",
          "Tell them to aggressively scrub their skin with a harsh exfoliant until the hair falls out."
        ],
        correctIndex: 1,
        explanation: "As a patient progresses through their treatment plan, their hair becomes significantly finer and lighter. Dramatic shedding is common early on, but a lack of noticeable shedding later in the journey is a normal sign of progress."
      }
    ]
  }
];

// --- TATTOO REMOVAL MODULES ---
const TATTOO_MODULES = [
  {
    id: 'tat-1',
    title: "Foundations of Laser Tattoo Removal",
    icon: <Sparkles className="w-5 h-5" />,
    description: "The nature of ink, macrophage steam explosions, and the Nano vs. Pico debate.",
    track: "Advanced Devices",
    duration: "45 min",
    content: `
      **A Quick History Fact!**
      Modern, scar-free laser tattoo removal was actually discovered by accident! In 1980, researchers at a hospital in Glasgow, Scotland originally wanted to use lasers to treat pediatric port wine stains. To gain some experience and practice using lasers safely on human skin first, they decided to test a Q-switched ruby laser on tattoos. It worked so incredibly well that it accidentally launched the entire modern tattoo removal industry! By 1988, the first dedicated clinic opened, and in 1991, the DermaLase DLR-1 gained FDA approval as the world's first commercial Q-switched tattoo removal laser.

      **Key Physics Concepts to Know**
      • **Chromophores:** Target structures (in this case, ink particles or aggregates) that absorb incoming light energy and heat up.
      • **Absorption:** When a photon of light interacts with an electron, the photon's energy is "taken" by the electron.
      • **Scattering:** If an electron absorbs a photon's energy but falls back into its orbit, it releases the energy as a new, scattered photon. 
      • **Photomechanical Reaction:** In laser tattoo removal, we are not trying to induce a pure thermal (heat) reaction; we are inducing a *photomechanical* (photoacoustic) reaction to aggressively fragment the ink.

      **The Nature of Tattoo Ink, Phagocytosis & Fibroblasts**
      When tattoo ink is introduced into the skin, it is pushed into the dermis using needles. This needle trauma triggers an immune response called **phagocytosis**, generating a raft of macrophages, fibroblasts, and mast cells to "attack" the invader. 
      Macrophages attempt to carry the ink particles away to the lymph nodes. However, the fibroblasts and mast cells do not remove the ink—they merely "engorge" it and stay permanently fixed within the connective tissue of the dermis. Because of the initial needle trauma and the encapsulated ink, a tattoo is literally just a *damaged piece of skin laden with ink particles*.

      **The Basic Overview: Shattering, Not Burning**
      Many patients think that tattoo removal involves a “burning off” of the tattoo. This simply isn’t the case. **The laser does not remove the tattoo—the body does.** The laser merely 'accelerates' the removal process. A tattoo might naturally be completely removed by the body over 300 to 400 years; the laser just speeds that up!
      
      💡 *Pro Pearl: It is an Immunological Treatment*
      Veteran providers will tell you: adopting the mindset that the body does the actual removal changes everything. It encourages less aggressive fluences, longer patient intervals, and far better long-term skin preservation.

      **The Macrophage Steam Explosion (Photoacoustic Effect)**
      Because these particles are so tiny, they lose heat extremely quickly. When you hit them with a laser, the particles absorb energy, passing that heat to the surrounding tissue water inside the macrophage. When water turns to steam, its volume expands massively (by a factor of about 2,000). The macrophage cannot withstand the pressure, causing it to explode! The explosive force sends the ink particles flying out in all directions, turning them into microscopic fragments.

      **Why Pulse Duration Matters (Milliseconds vs. Nanoseconds)**
      Hair removal lasers fire in **milliseconds**. The heat dissipates into the skin and cools quickly enough that it doesn’t burn the skin. This must NOT be used for tattoos because the metallics in ink would not allow the heat to dissipate, causing severe burns. Instead, tattoo removal technicians use lasers with a pulse delivery of a billionth (nanosecond) or trillionth (picosecond) of a second. 

      **The Nano vs. Pico Debate (Why We Use the M22)**
      Marketing pushes picosecond lasers as the ultimate devices. While picosecond lasers are fabulous tools for notoriously difficult colors (blues, greens), there is an unspoken truth: **Picosecond lasers are often terrible for dense, saturated black tattoo removal.**
      At our clinic, we exclusively use the M22 Q-Switched nanosecond laser. When you have a highly saturated, dense black tattoo (which makes up 90% of all tattoos), the thermal heat provided by a nanosecond laser is *required* to create a stronger shattering effect. This is why the M22 is our premier tool of choice.
    `,
    questions: [
      {
        id: 'tat-1-1',
        text: "What happens when laser energy rapidly heats the ink particles inside a macrophage?",
        options: [
          "The ink particles chemically react with the laser and dissolve.",
          "The heat turns the surrounding water into steam, causing the macrophage to explode.",
          "The macrophage absorbs the laser energy and becomes transparent."
        ],
        correctIndex: 1,
        explanation: "When laser energy heats the tiny ink particles, the surrounding water inside the macrophage instantly turns to steam, causing a pressure explosion that shatters the ink clump."
      },
      {
        id: 'tat-1-2',
        text: "According to the physics definitions provided, what is the primary reaction we are trying to induce during laser tattoo removal?",
        options: [
          "A pure thermal reaction to melt the ink.",
          "A photomechanical (photoacoustic) reaction to fragment the ink aggregates.",
          "A scattering reaction to reflect the ink."
        ],
        correctIndex: 1,
        explanation: "We rely on the photomechanical/photoacoustic shockwave to physically shatter the ink aggregates, rather than just melting them with pure heat."
      },
      {
        id: 'tat-1-3',
        text: "According to the lesson, which type of laser is most effective for removing dark, saturated black tattoos?",
        options: [
          "Picosecond laser",
          "Q-switch nanosecond laser",
          "Both are equally effective for black tattoos"
        ],
        correctIndex: 1,
        explanation: "The Q-switch nanosecond laser delivers the perfect balance of photothermal heat and photoacoustic shock needed to aggressively shatter dense black ink."
      }
    ]
  },
  {
    id: 'tat-2',
    title: "M22 Q-Switch: Device Operation & Variables",
    icon: <Activity className="w-5 h-5" />,
    description: "Mastering Fluence, Spot Size, Irradiance, and Repetition Rate.",
    track: "Advanced Devices",
    duration: "55 min",
    content: `
      **The Physical Variables**
      Every laser treatment comes down to physical variables. These aren’t arbitrary dial positions. Each one directly controls energy delivery. 

      **1. Fluence & Power Density**
      Fluence is energy density (Joules per square centimeter - J/cm²). **Power Density** is just like energy density, except it includes the *pulse duration*. It describes the amount of energy concentrated into a spot diameter being delivered *in that specific fraction of a second*. 

      💡 *Pro Pearl: Don't Chase Maximum Power*
      One of the biggest beginner mistakes is over-fluencing. Effective fragmentation is always greater than epidermal injury. You want a crisp frost, not charred skin. Many advanced providers purposely stay conservative and do more passes over time rather than "nuking" the tattoo, which can create scarring, hypopigmentation, and paradoxically delayed healing.

      **2. Spot Size Changes Everything (The Inverse Square Law)**
      If you halve the spot diameter while keeping the laser's energy constant, the fluence roughly quadruples. Because of the inverse square law, you must **NEVER "pull away" the handpiece from the skin surface while firing!** Pulling away shrinks the spot diameter hitting the skin, skyrocketing the fluence and causing irreversible burn damage. Keep the tip perpendicular and steady!

      💡 *Pro Pearl: Larger Spots are Safer*
      Many elite providers prefer a larger spot with a lower fluence over a tiny spot with high energy. Larger spot sizes penetrate more uniformly, reduce epidermal "hot spots", and scatter less. 

      **The Step-by-Step Clinical Firing Protocol**
      This is the ideal, safe approach to determining settings on a new tattoo:
      1. Use as **large a spot diameter** as your equipment will allow.
      2. Keep the fluence extremely low. For ALL new tattoo treatments, start at baseline/conservative.
      3. Fire **3 or 4 test shots** at an area of the tattoo. 
      4. **WAIT 30-60 seconds!** You are looking for erythema (reddening) and mild edema (swelling).
      5. If no reaction is observed after 60 seconds, increase the fluence by only 0.5 J/cm² and repeat.
      6. **NEVER go over an area twice in the same session.** Once the first pass generates steam bubbles (frosting), those vacuoles will merely reflect much of any subsequent laser energy back out of the skin! Excessive repeated passes increase complication risk faster than they improve clearance.
      7. **For Subsequent Sessions:** Do not drastically jump your settings! Increase the fluence slowly—by only 0.5 to 1.0 J/cm² every *two or three* sessions to account for the increasing depth of the remaining ink.

      **3. Repetition Rate & Stacked Passes**
      Repetition rate is measured in Hertz (Hz). If you fire too fast, the heat doesn’t dissipate completely, leading to **Thermal Stacking**. 
      
      💡 *Pro Pearl: Avoid Aggressive Pass Stacking*
      Many providers have backed away from multi-pass methods (like the "R20 method") because stacked passes drastically increase blistering, PIH, and scarring (especially in Fitz IV-VI). A single, high-quality pass is often safer and just as effective.
    `,
    questions: [
      {
        id: 'tat-2-1',
        text: "What happens to fluence when you halve the spot diameter while keeping the laser's energy constant?",
        options: [
          "It remains the same.",
          "It is halved.",
          "It roughly quadruples."
        ],
        correctIndex: 2,
        explanation: "Because of the inverse square relationship, packing the exact same amount of energy into a spot that is half the size will roughly quadruple the fluence (energy density)."
      },
      {
        id: 'tat-2-2',
        text: "When performing test shots on a new tattoo, how long should you wait to properly observe the tissue reaction before turning up the energy?",
        options: [
          "No waiting is needed; the reaction is instant.",
          "Wait 30-60 seconds to observe for erythema and edema.",
          "Wait 24 hours."
        ],
        correctIndex: 1,
        explanation: "While frosting is instant, the true inflammatory response (erythema and swelling) takes 30-60 seconds to develop. Turning up the energy before waiting this duration can lead to severe overdosing."
      },
      {
        id: 'tat-2-3',
        text: "Why should you never fire the laser over the exact same area twice during a single session?",
        options: [
          "Because the steam bubbles (vacuoles) from the first pass will simply reflect the subsequent laser energy back out of the skin, rendering it useless.",
          "Because the machine will automatically shut down.",
          "Because the ink becomes permanently immune to light for 24 hours."
        ],
        correctIndex: 0,
        explanation: "Firing a second pass is ineffective because the gas/steam bubbles formed by the first pass act as a mirror, and excessive repeated passes increase complication risk faster than they improve clearance."
      }
    ]
  },
  {
    id: 'tat-3',
    title: "Tattoo Anatomy, Skin Types & Conditions",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Understanding tattoo typology, 1064nm capabilities, and paradoxical darkening.",
    track: "Advanced Devices",
    duration: "40 min",
    content: `
      **Tattoo Typology & Depth**
      Tattoo dye composition is incredibly variable. The differing compositions explain why some tattoos respond favorably and others stubbornly resist.
      
      💡 *Pro Pearl: Amateur vs. Dense Professional Tattoos*
      Amateur tattoos (India ink/soot) often clear surprisingly fast with a Q-switch because there is less ink, it's more superficial, and deposition is uneven. Dense professional tattoos, however, require extreme patience. They are heavily saturated, deeply layered, and mixed with fillers. You must "chip away" slowly. Trying to blast them out in 3 sessions will cause fibrosis, which actually traps the pigment permanently!

      **Clearance Rates Across the Body**
      Many laser operators report massive variability in the rate at which tattoo ink clears across different parts of the body. One highly obvious factor is **distance from the heart**. Tattoos on the lower legs, ankles, and feet are notoriously stubborn due to poorer circulation of lymph and blood in those extremities.

      **Colors Can Be Deceiving!**
      We can never be entirely sure which colored inks are *actually* in any tattoo. We might see a color that appears to be "green," but it is in fact made up of yellow and blue inks mixed together. 
      **Clinical Approach:** Because our M22 system exclusively uses the 1064nm wavelength, we are highly specialized in targeting dark pigments. If a tattoo has bright colors, 1064nm will likely not "see" them efficiently.

      💡 *Pro Pearl: 1064nm is King for Black*
      Most seasoned providers default to 1064nm first with the largest spot size possible. The larger spot size penetrates deeper and scatters less, making it highly effective and incredibly safe for black, dark blue, and charcoal inks.

      **Difficulty of Removing Various Colors (For Our 1064nm System)**
      Because our clinic strictly uses the 1064nm wavelength, colors rank as follows:
      1. **Black, Charcoal, Dark Blue** (Easiest - Responds beautifully to 1064nm)
      2. **Reds, Greens, Blues, Yellows** (Will NOT respond well. 1064nm targets dark pigment. Bright colors require different wavelengths like 532nm, 755nm, etc.)

      **Wavelengths and Skin Types: Why We Use 1064nm**
      • **1064 nm (Near-Infrared):** Epidermal melanin absorbs very little energy at this wavelength, meaning it penetrates deeply and safely bypasses the surface skin. It is the absolute safest and most mandatory choice for darker skin types (Fitzpatrick IV-VI). 
      *(Note: Other clinics may use a 532nm green light for red inks. We do not use 532nm because it is highly absorbed by melanin, making it very risky for darker Fitzpatrick skin types and prone to destroying natural skin pigment.)*

      **White Ink & The Paradoxical Darkening Trap**
      Approach pink, red, and flesh-tone tattoos (lip liner, microblading, PMU) with extreme caution. **ALWAYS test spot white ink and flesh tones.** These inks often contain iron or titanium dioxide. Laser energy can cause a rapid chemical transformation (ferric oxide to ferrous oxide). This results in **paradoxical darkening**, where the ink violently oxidizes and instantly turns pitch black or gray. This blackened state is highly resistant to any additional therapy.

      **Limitations of Our Q-Switched 1064nm: When to Refer Out**
      Our clinic uses the M22 Q-Switched Nd:YAG equipped *exclusively* with the 1064nm wavelength. While this makes us the gold standard for safely treating black, dark blue, and charcoal inks on all skin types, it is not equipped for every color on the spectrum. 
      Anything that is not a dark ink—specifically **reds, vibrant sky blues, bright greens, and bright yellows**—must be referred out to another facility. 
      *Do not try to aggressively force these colors to fade using our 1064nm system; it will only cause unnecessary thermal damage and scarring.* Instead, refer these patients to a clinic that operates a **532nm (for reds)**, **Q-Switched Ruby (694nm)**, **Alexandrite (755nm)**, or a specific **Picosecond laser system** designed to target those highly stubborn bright pigments.
    `,
    questions: [
      {
        id: 'tat-3-1',
        text: "A patient requests removal of permanent cosmetic flesh-toned lip liner. What is a major clinical risk?",
        options: [
          "The laser will immediately dissolve the ink and leave a white scar.",
          "The laser may cause a chemical reaction (ferric oxide to ferrous oxide), causing the ink to paradoxically turn black and become highly resistant to further treatment.",
          "Flesh-toned ink reflects the laser perfectly, causing no reaction at all."
        ],
        correctIndex: 1,
        explanation: "This is known as paradoxical darkening. Treating cosmetic pink, red, or flesh tones can instantly turn the tattoo black and permanent."
      },
      {
        id: 'tat-3-2',
        text: "Why do tattoos located on the lower legs, ankles, or feet typically take significantly more sessions to fade?",
        options: [
          "Because the skin on the feet is thicker and blocks the laser light.",
          "Because of the distance from the heart; poorer blood and lymphatic circulation in the extremities drastically slows the removal of shattered ink.",
          "Because gravity pulls the shattered ink back down into the tattoo."
        ],
        correctIndex: 1,
        explanation: "The body's lymphatic system is responsible for flushing the ink away. Extremities far from the heart have slower circulation, meaning the flushing process takes much longer."
      },
      {
        id: 'tat-3-3',
        text: "If a young, healthy patient has a dense, professionally applied tattoo, why shouldn't you try to 'blast it out' aggressively in 3 sessions?",
        options: [
          "Aggressively over-treating dense ink will cause severe fibrosis (scarring), which will permanently trap the pigment in the skin.",
          "The laser will run out of pulses.",
          "The ink will dissolve too fast and enter the bloodstream all at once."
        ],
        correctIndex: 0,
        explanation: "Dense professional tattoos are deeply layered. Treating them too aggressively creates heavy scar tissue. Fibrosis permanently traps the ink, ruining the chance of successful clearance."
      },
      {
        id: 'tat-3-4',
        text: "Why is the 1064nm wavelength the safest and most effective choice for removing black tattoos on Fitzpatrick Type V and VI skin?",
        options: [
          "Because it is absorbed highly by epidermal melanin.",
          "Because 1064nm is a blue light that cools the skin.",
          "Because it has the lowest epidermal melanin absorption, allowing it to bypass the dark surface skin and target the deep ink without causing hypopigmentation."
        ],
        correctIndex: 2,
        explanation: "The 1064nm wavelength safely bypasses the abundant melanin in the surface of dark skin types, driving straight down to the dark tattoo ink without destroying the patient's natural pigment."
      },
      {
        id: 'tat-3-5',
        text: "A new patient comes in with a brightly colored tattoo containing reds, vibrant sky blues, and bright greens. How should you approach this treatment using our clinic's 1064nm M22 Q-Switch?",
        options: [
          "Use the 1064nm wavelength at maximum fluence to force the bright colors to shatter.",
          "Recognize that our 1064nm laser targets dark inks and cannot effectively treat reds, bright blues, and greens. Refer the patient out to a clinic with 532nm, Picosecond, or Alexandrite/Ruby lasers.",
          "Treat it normally; 1064nm removes all colors equally."
        ],
        correctIndex: 1,
        explanation: "Our 1064nm system is excellent for blacks and dark blues, but struggles with bright colors like reds, blues, and greens. Attempting to force clearance will only cause scarring. It is best clinical practice to refer these specific colors out."
      }
    ]
  },
  {
    id: 'tat-4',
    title: "Lumenis Safety & Contraindications",
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "M22 Calibration rules, eye protection, and absolute contraindications.",
    track: "Clinical Safety",
    duration: "30 min",
    content: `
      **Crucial Device Maintenance: Calibration**
      Energy calibration determines a constant relationship between electrical input and optical output, compensating for laser deterioration over time. The M22 requires QS Nd:YAG treatment head calibration at first connection and **at least every 50,000 pulses**. 
      *Absolute Rule:* Calibration must ALWAYS be done WITHOUT the lens assembly attached!

      **Ocular Safety & Plume Hazards**
      Because of the extreme peak power of Q-Switched lasers, a direct or scattered hit to the eye can cause immediate, irreversible blindness. Clinicians and attending staff MUST wear eyewear specifically marked with a **1064nm wavelength filter and an Optical Density (OD) > 4.0**. 
      Additionally, because shattering ink creates high-speed tissue fragments and vapor, universal precautions (masks and gloves) are mandatory to protect against laser plume inhalation or blood splatter.

      **Contraindications & Medical Clearance**
      • **Absolute Contraindications:** Pregnancy, breastfeeding, recent sun exposure, or active infections in the area. Tattoos younger than 6 months should generally not be treated as the body is still healing the initial trauma.
      • **Photosensitizing Medications:** You must screen for medications that make the skin sensitive to light (e.g., Doxycycline, Tetracyclines). Oral Isotretinoin (Accutane) requires a strict 6-month waiting period to avoid severe scarring.
      • **Gold Therapy (Chrysiasis):** Patients who have received gold salts (often for rheumatoid arthritis) must be approached with extreme caution. The laser can induce chrysiasis, causing permanent blue/gray hyperpigmentation of the skin.
    `,
    questions: [
      {
        id: 'tat-4-1',
        text: "How often should the M22 QS Nd:YAG treatment head be calibrated, and how should it be configured?",
        options: [
          "Every 10,000 pulses, with the lens assembly attached.",
          "Every 50,000 pulses, WITHOUT the lens assembly attached.",
          "Once a year, with a 2.0mm tip attached."
        ],
        correctIndex: 1,
        explanation: "Calibration ensures accurate energy output. It must be performed at least every 50,000 pulses, and the lens assembly must be completely removed prior to calibrating."
      },
      {
        id: 'tat-4-2',
        text: "What Optical Density (OD) rating is required for protective eyewear when operating the M22 QS Nd:YAG?",
        options: [
          "OD > 1.0",
          "OD > 2.0",
          "OD > 4.0"
        ],
        correctIndex: 2,
        explanation: "Because of the extreme power of the nanosecond pulse, safety goggles must have an OD > 4.0 for the 1064nm wavelength to protect the retina from irreversible damage."
      }
    ]
  },
  {
    id: 'tat-5',
    title: "Patient FAQs & Consultation",
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Answering questions on session counts, pain, and waiting periods.",
    track: "Guest Experience",
    duration: "25 min",
    content: `
      **The Critical Consultation**
      The consultation is a critical part of the tattoo removal process. This is where you establish expectations, explain the physiological process, and discover if the patient has any contraindications. While most tattoo removal lasers are relatively simple to physically operate, providing proper treatment requires extensive knowledge of tattoos, skin reactions, and laser physics. Treatment settings depend entirely on a thorough assessment of the patient’s tattoo colors, skin type, and medical history.

      **1. "Why do I have to wait 6 to 8 weeks between sessions?"**
      **Provider Answer:** "The waiting period is actually divided into two phases. The first two weeks allow your body to heal in the treated area—this is when any temporary scabs or blisters will subside. The following weeks allow your body's immune system (the lymphatic system) the time it needs to gradually flush away the shattered ink fragments. As a general rule, the longer you wait between treatments, the better fading you will yield from each single session!"

      **2. "How many sessions will it take?"**
      **Provider Answer:** "Most patients require 5 to 10 laser treatments. This is because when a tattoo is applied, the needle inserts at varying depths, leaving ink resting in multiple layers within the dermis. Each laser treatment only shatters the most shallow layer of ink. We have to progressively work our way through successively deeper layers with each session until none remain."

      **3. "Does it hurt?"**
      **Provider Answer:** "Yes, it is often described as feeling like hot bacon grease or a heavy rubber band snapping against the skin. Because the laser creates a microscopic shockwave, it is uncomfortable. However, treatments are incredibly fast (often lasting only seconds or minutes), and we use cooling systems to make it as tolerable as possible."

      **4. "Will it blister?"**
      **Provider Answer:** "Blistering is an extremely common, normal reaction within the first 24 to 48 hours after treatment. It is a sign that your body is reacting to the shattered ink and starting the healing process. We will provide you with specific aftercare instructions to manage them safely."

      **5. "Why does my tattoo look darker after treatment?"**
      **Provider Answer:** "This can be due to temporary inflammation or trapped carbonization as the ink is initially shattered. However, if your tattoo contained cosmetic ink, white ink, or flesh-tone pigments (which often contain iron oxides), this can be 'paradoxical darkening,' where the ink oxidizes and permanently turns pitch black or gray."

      **6. "Can I speed up the tattoo removal process?"**
      **Provider Answer:** "Ultimately, time is the biggest factor! However, because your healthy immune function does the actual removal, staying hydrated and exercising to boost circulation definitely helps. Conversely, smoking drastically slows removal. Please be highly cautious of 'miracle creams,' 'detox claims,' or lymphatic gimmicks sold online—they do not work."

      **7. "Can tattoo removal leave scars?"**
      **Provider Answer:** "When properly used, the laser itself is not supposed to scar the skin. However, the risk of scarring increases significantly with overtreatment, aggressive multi-pass methods, picking at your blisters, or developing an infection. It's also important to note that some existing scarring may actually be from the original tattoo application itself, which the laser will simply reveal as the ink fades."

      **8. "What exactly is the white frosting?"**
      **Provider Answer:** "That is a temporary whitening response caused by the rapid heating of intracellular water, which creates steam and vacuole formation in the skin. It usually fades within 10 to 20 minutes. It's important to know that more frosting does *not* automatically mean a better treatment!"

      **9. "Why are there tiny black dots left after several sessions?"**
      **Provider Answer:** "These dots can be residual deep pigment, highly resistant pigment particles, or trapped ink caused by microscopic scar tissue encapsulation. Sometimes, we ethically choose to stop treating before 100% clearance to preserve the overall quality and health of your skin."

      **10. "Can all tattoos be fully removed?"**
      **Provider Answer:** "Not always. Some tattoos will leave faint 'ghosting,' textural changes, or residual shadowing due to resistant pigments or oxidation. As ethical providers, we focus heavily on significant cosmetic improvement, skin preservation, and realistic expectations, rather than promising guarantees of absolute perfection."
    `,
    questions: [
      {
        id: 'tat-5-1',
        text: "Why is a minimum of 6 to 8 weeks required between tattoo removal sessions?",
        options: [
          "To give the machine time to rest.",
          "The first two weeks are for the skin to heal from blisters/scabs, and the following weeks give the lymphatic system time to flush away the shattered ink.",
          "To ensure the numbing cream fully wears off."
        ],
        correctIndex: 1,
        explanation: "Treating too soon increases scarring risks without speeding up removal. The body physically needs 6-8 weeks for both tissue healing and lymphatic flushing."
      },
      {
        id: 'tat-5-2',
        text: "Why do most patients require 5 to 10 sessions to clear a tattoo?",
        options: [
          "Because the ink is deposited in multiple layers in the dermis, and each laser session only shatters the shallowest layer.",
          "Because the laser can only stay on for 3 seconds before overheating.",
          "Because the patient builds an immunity to the laser over time."
        ],
        correctIndex: 0,
        explanation: "Tattoo ink rests in multiple layers. You cannot shatter the deepest layers until the more shallow layers of ink have been shattered and cleared by the body."
      },
      {
        id: 'tat-5-3',
        text: "A patient asks if an online 'detox cream' will speed up their tattoo removal. What is the most accurate clinical response?",
        options: [
          "Yes, detox creams break down the ink faster than the laser.",
          "Time is the biggest factor. While hydration and exercise help the immune system clear ink, miracle creams, detox claims, and lymphatic gimmicks do not work.",
          "Yes, but only if applied immediately after the laser session."
        ],
        correctIndex: 1,
        explanation: "Miracle creams and detox gimmicks are ineffective. Healthy immune function (hydration, exercise) and time are the only proven ways to accelerate lymphatic clearance."
      },
      {
        id: 'tat-5-4',
        text: "Why might an ethical provider choose to stop treating a tattoo that still has tiny, stubborn black dots remaining?",
        options: [
          "To preserve the overall quality of the skin and prevent permanent scarring or textural damage from over-treatment.",
          "Because the laser machine cannot fire at single dots.",
          "Because tiny black dots will eventually turn invisible on their own."
        ],
        correctIndex: 0,
        explanation: "Ethical providers focus on cosmetic improvement and skin preservation over absolute perfection. Continuing to aggressively target encapsulated or highly resistant residual dots often leads to irreversible skin damage."
      }
    ]
  },
  {
    id: 'tat-6',
    title: "Complications & Adverse Reactions",
    icon: <AlertOctagon className="w-5 h-5" />,
    description: "Identifying normal frosting vs. abnormal reactions, scarring, and pigment changes.",
    track: "Clinical Safety",
    duration: "30 min",
    content: `
      **The Clinical Endpoint: "Frosting" & Light Scattering**
      The immediate, desired clinical endpoint during tattoo removal is called **frosting** (epidermal whitening). It is caused by rapid steam/gas bubble formation in the skin from the shattered ink and water. 

      💡 *Pro Pearl: Frosting ≠ The Ultimate Endpoint*
      Heavy frosting doesn’t always mean better clearance. Experienced techs actually aim for light-to-moderate frosting, an audible snap, and mild perifollicular edema instead of aggressive, blinding whitening. 

      <div style="background-color: #231C1A; border: 1px solid #8B4828; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
        <h4 style="color: #d4b09e; margin-top: 0; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">📷 Clinical Visual Guide: The Ideal Endpoint</h4>
        <p style="margin-bottom: 10px; font-size: 14px; color: #e8d5cc;"><strong>1. Immediate Post-Pulse:</strong> A distinct, opaque white "frosting" appears directly over the treated ink.</p>
        <p style="margin-bottom: 0; font-size: 14px; color: #e8d5cc;"><strong>2. Shortly After (10-20 mins):</strong> The frosting fades. The tissue appears slightly "bruised" with localized erythema (reddening) and mild edema (swelling). <em>This is the perfect, safe reaction. Be patient and wait for it!</em></p>
      </div>
      
      **The Danger of "Chasing the Crack" or "Chasing the Frost"**
      Some operators look for a blinding white frost or listen for a loud 'crack' sound with every single pulse. **This is wrong!** A loud crack indicates that *too much energy* has been delivered. Furthermore, some ink colors simply will not turn white or generate a crack. 
      
      **What are the exact effects of using too much fluence (energy)?**
      1. More damage to the collagen, resulting in **more scarring**.
      2. More scarring means **more light scattering** in subsequent treatments.
      3. More scattering means **less effective treatments**, especially in deeper regions.
      4. Ultimately, **less likelihood of a successful clearance!**

      *A Critical Clinical Shift:* Frosting is usually very obvious during the first few treatments. However, **it becomes much less noticeable after around four or five sessions.** Scarred tissue (fibrosis) from prior sessions scatters light much more readily, making the frost look far less obvious. 
      **WARNING:** Do not "chase" the visual frost by aggressively turning up the fluence. Relying purely on frost in later sessions is a massive mistake that will lead to hypertrophic scarring!

      💡 *Pro Pearl: The "Ghost Tattoo" Trap*
      If you overtreat and severely damage the collagen, the skin becomes pale and shiny (fibrosis). Any residual ink then becomes permanently trapped beneath this scar tissue. The tattoo looks "stuck." Advanced providers know that perfect clearance isn't always worth it—they would rather leave faint residual shadowing than permanently scar the skin chasing perfection.

      **Avoiding Hypopigmentation**
      Hypopigmentation (white spots) is the result of killing melanocytes. The providers with the best long-term outcomes are incredibly conservative, especially on darker Fitzpatrick types.
      To avoid hypopigmentation:
      1. **Stay Conservative:** Undertreat slightly and build gradually.
      2. **Watch the Skin, Not the Ink:** Stop treating if you see epidermal graying, waxy texture, delayed healing, or shiny skin. These are warning signs that melanocytes are stressed!

      **What Causes Scarring?**
      Scar formation generally occurs for only two reasons:
      1. **Infection:** Fibrosis can occur after a severe post-treatment infection. (Entirely the patient's responsibility).
      2. **Too Much Energy:** The application of too much laser energy thermally damages the dermis. (Entirely the operator's responsibility!).

      <div style="background-color: #2a1114; border: 1px solid #7f1d1d; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
        <h4 style="color: #fca5a5; margin-top: 0; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">⚠️ Clinical Visual Guide: Adverse Reactions</h4>
        <p style="margin-bottom: 10px; font-size: 14px; color: #fecaca;"><strong>Severe Blistering:</strong> Thick, dark, blood-filled blisters. This frequently happens when the area is severely over-heated by excessive fluence.</p>
        <p style="margin-bottom: 0; font-size: 14px; color: #fecaca;"><strong>Punctate Bleeding & Epidermal Loss:</strong> If the epidermis is completely removed, exposing the raw, ink-laden dermis beneath, the fluence used was drastically too high. A large margin of angry erythema indicates high probability of impending infection.</p>
      </div>
    `,
    questions: [
      {
        id: 'tat-6-1',
        text: "According to advanced providers, what is the 'Ghost Tattoo' trap?",
        options: [
          "When a tattoo disappears completely but returns a year later.",
          "Overtreating the skin until it becomes pale, shiny scar tissue, permanently trapping the remaining faint ink underneath.",
          "When invisible ink is used."
        ],
        correctIndex: 1,
        explanation: "Chasing 100% perfection with aggressive settings causes fibrosis. This scar tissue becomes shiny and pale, permanently trapping the remaining 'ghost' ink beneath it."
      },
      {
        id: 'tat-6-2',
        text: "According to the lesson, what is the ultimate cascade effect of using too much fluence and 'chasing the crack'?",
        options: [
          "It clears the tattoo much faster, requiring fewer sessions.",
          "It causes excessive collagen damage and scarring, which scatters light in future sessions and drastically lowers the likelihood of successful clearance.",
          "It prevents the lymphatic system from functioning properly."
        ],
        correctIndex: 1,
        explanation: "Excess energy causes more scarring. Scarring scatters light in subsequent treatments, making future sessions less effective and preventing complete clearance."
      },
      {
        id: 'tat-6-3',
        text: "When attempting to avoid permanent hypopigmentation, which of the following is a major warning sign that you should stop treating or lower settings?",
        options: [
          "Mild perifollicular edema.",
          "Epidermal graying, waxy texture, or overly shiny skin.",
          "A crisp, opaque white frosting that fades in 10 minutes."
        ],
        correctIndex: 1,
        explanation: "Waxy, shiny, or graying epidermis indicates severe stress to the melanocytes. Providers must watch the skin's reaction, not just the ink's reaction, to prevent hypopigmentation."
      },
      {
        id: 'tat-6-4',
        text: "Which of the following significantly increases the risk of severe hypopigmentation (white spots) on a patient?",
        options: [
          "Using a 1064nm wavelength conservatively.",
          "Waiting 8-12 weeks between sessions.",
          "Using fluences that are too high, permanently destroying the natural melanocytes."
        ],
        correctIndex: 2,
        explanation: "Excessive energy destroys the skin's melanin-producing cells, leading to permanent hypopigmentation. Staying conservative and watching the skin's reaction preserves natural pigment."
      }
    ]
  },
  {
    id: 'tat-7',
    title: "Pre & Post Treatment Care Protocols",
    icon: <ClipboardList className="w-5 h-5" />,
    description: "Preparing the skin and strict aftercare to support lymphatic drainage and healing.",
    track: "Guest Experience",
    duration: "20 min",
    content: `
      **The Ideal Treatment Protocol: Icing & Cooling**
      Thermal management is critical to preventing burns and minimizing pain. 
      • **PRE-TREATMENT:** Apply an ice pack (like a Kool Pak) to the treatment area for *at least five minutes* prior to firing the laser. This will significantly reduce the painful sensations felt by the patient.
      • **POST-TREATMENT:** Apply an ice pack for *at least ten minutes* immediately following the treatment. This draws out any excess heat trapped in the dermis, dramatically reducing blistering, erythema, and epidermal damage.

      **Pre-Treatment Preparation**
      • **Sun Avoidance:** Tanned skin acts as a light-blocker, drawing laser energy into the epidermis and away from the tattoo, risking severe burns. Patients must avoid sun/tanning beds for 3-4 weeks prior. 
      • **Clean Skin:** Ensure the treatment area is perfectly clean. Inorganic sunscreens or foundations left on the skin may cause a loud "pop" when the laser is applied, signaling inadequate cleansing that can burn the surface.
      • **Shaving:** The area should be shaved to prevent surface hair from absorbing energy and burning.

      **Wound Healing & Time Between Sessions**
      While 6 to 8 weeks is the "industry standard" minimum wait time, clinical research strongly suggests that waiting **12 weeks (or up to 6 months!)** is significantly better and results in higher ink clearance rates. Here is why:
      1. After a laser session, the skin enters complex stages of wound healing (Haemostasis, Inflammation, Proliferation, and Remodelling). 
      2. The main priorities of the body's wound response mechanism are to repair structural damage and fight infection. 
      3. **Removing annoying bits of ink is very low on the body's priority list!**
      
      💡 *Pro Pearl: The 8-12 Week Surge*
      A huge pearl providers learn late: Tattoos often lighten MORE between weeks 8 and 12 than they do between weeks 0 and 6! The majority of the ink removal process only occurs *after* the initial wound is fully healed. If you treat a patient every 4 to 6 weeks, you are not allowing sufficient time for the skin to remove the ink before creating a *new* trauma. 

      **The 18-Month Equation**
      Think about the overall timeline required to remove a tattoo:
      • 10 treatments spaced at 2-month intervals = roughly **20 months**.
      • 4 treatments spaced at 5-month intervals = roughly **20 months**.
      The overall time required is almost identical! However, the longer intervals result in drastically less trauma to the skin, a massive reduction in scarring, and significantly fewer painful visits for the patient.

      💡 *Pro Pearl: The Immune System Dictates Success*
      Because tattoo removal is biologically dependent, the patient's lifestyle matters heavily. Slower clearance is almost always seen with smoking, autoimmune issues, and poor circulation. Conversely, patients who exercise regularly, hydrate well, and have healthy lymphatic drainage will see significantly faster fading.

      **Post-Treatment Care: The Healing Phase**
      Immediately after treatment, the area should be cooled. 
      • **Wound Care:** With the epithelium injured, patients must consider the site an "open wound". A barrier cream (like Biafine, E45, or a sterile hydrogel) should be applied. 
      • **Blister Management:** If blisters form (which is common), patients must NOT pop, pick, or scratch them. Doing so opens the skin to severe infection and virtually guarantees a permanent scar.
      • **Hydration:** Patients should be instructed to drink 8-10 glasses of water daily. Proper hydration is critical to support the lymphatic system.
    `,
    questions: [
      {
        id: 'tat-7-1',
        text: "Why is waiting 12 weeks (or even 6 months) between sessions often far more effective than the standard 6 weeks?",
        options: [
          "Because the laser machine needs to be recalibrated every 12 weeks.",
          "Because the body prioritizes structural wound healing first. Ink removal is a low priority and mostly occurs 8-12 weeks AFTER the initial laser trauma.",
          "Because the ink takes 12 weeks to chemically dissolve."
        ],
        correctIndex: 1,
        explanation: "Treating too frequently interrupts the body's natural clearing process. Giving the body 3 to 6 months allows it to flush significantly more ink per session."
      },
      {
        id: 'tat-7-2',
        text: "Why does the patient's lifestyle (smoking, exercise, hydration) drastically impact their tattoo removal results?",
        options: [
          "Because exercise makes the skin stretch and pull the ink apart.",
          "Because tattoo removal is an immunologic process. Healthy lymphatic drainage and good circulation are required to physically flush the shattered ink from the body.",
          "It doesn't; the laser does 100% of the removal work."
        ],
        correctIndex: 1,
        explanation: "The laser only shatters the ink. The patient's immune system does the actual removal. Poor circulation (from smoking) drastically slows clearance, while exercise and hydration speed it up."
      },
      {
        id: 'tat-7-3',
        text: "According to the '18-Month Equation', why might a provider recommend 4 treatments spaced 5 months apart rather than 10 treatments spaced 2 months apart?",
        options: [
          "Because the provider makes more money doing fewer treatments.",
          "The overall completion time is the same, but the longer intervals result in drastically less skin trauma, less scarring, and fewer painful visits for the patient.",
          "Because the laser requires 5 months to recharge."
        ],
        correctIndex: 1,
        explanation: "Spacing treatments out allows the lymphatic system to naturally clear significantly more ink per session, resulting in identical timeline results but with far less bodily trauma."
      }
    ]
  }
];

const CERTIFICATIONS = [
  {
    id: 'lhr',
    title: 'LHR — SplendorX',
    modules: LHR_MODULES,
    practical: [
      { id: 'lhr-p1', label: 'Observed and Performed SplendorX Startup & HEPA filter check' },
      { id: 'lhr-p2', label: 'Observed and Performed Patch Test Protocol & Settings Selection' },
      { id: 'lhr-p3', label: 'Observed and Performed 3 Underarm Treatments' },
      { id: 'lhr-p4', label: 'Observed and Performed 3 Brazilian Treatments' },
      { id: 'lhr-p5', label: 'Observed and Performed 2 Full Leg Treatments' },
      { id: 'lhr-p6', label: 'Observed and Performed 3 Full Face Treatments' },
      { id: 'lhr-p7', label: 'Observed and Performed 3 Neck Treatments' },
      { id: 'lhr-p8', label: 'Observed and Performed Proper Cleaning & Sanitization of Handpiece / Optics' },
      { id: 'lhr-p9', label: 'Observed and Performed Pre-Treatment Contraindication Screening' },
      { id: 'lhr-p10', label: 'Observed and Performed Proper Treatment Area Lining/Marking' },
      { id: 'lhr-p11', label: 'Observed and Performed Post-Care Education Prior to Client Departure' },
      { id: 'lhr-p12', label: 'Observed and Performed 2 Full Arm Treatments' }
    ]
  },
  {
    id: 'tattoo',
    title: 'Tattoo removal (M22)',
    modules: TATTOO_MODULES,
    practical: [
      { id: 'tat-p1', label: 'Observed and Performed M22 QS Nd:YAG Startup & Safety (OD > 4.0 Eyewear)' },
      { id: 'tat-p2', label: 'Observed and Performed Device Calibration (Without Lens Assembly)' },
      { id: 'tat-p3', label: 'Observed and Performed Pre-Treatment Contraindication Screening (Tans, Gold Therapy, Double Tattoos)' },
      { id: 'tat-p4', label: 'Observed and Performed Test Patch with 30-60 Second Wait Time' },
      { id: 'tat-p5', label: 'Observed and Performed 3 Tattoo Removal Treatments (Tip Legs in Contact, No Scratching)' },
      { id: 'tat-p6', label: 'Demonstrated Recognition of Proper Clinical Endpoints (Frosting & Pinpoint Bleeding)' },
      { id: 'tat-p7', label: 'Observed and Performed Post-Care Education (Lymphatic Drainage Hydration)' },
      { id: 'tat-p8', label: 'Observed and Performed Proper Cleaning of Lens Assembly & Metallic Tips' }
    ]
  }
];

export default function App() {
  const [appState, setAppState] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeCertId, setActiveCertId] = useState('lhr');
  
  // Dashboard Specific State
  const [studentActiveTab, setStudentActiveTab] = useState('dashboard'); // 'dashboard', 'courses', 'course-details', 'completion'
  const [supervisorActiveTab, setSupervisorActiveTab] = useState('dashboard');
  const [activeModuleId, setActiveModuleId] = useState(LHR_MODULES[0].id);
  const [readingMode, setReadingMode] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizState, setQuizState] = useState({ submitted: false, passed: false });
  const [quizError, setQuizError] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Feedback State
  const [courseFeedbackText, setCourseFeedbackText] = useState('');
  const [isSavingCourseFeedback, setIsSavingCourseFeedback] = useState(false);
  const [showCourseFeedbackSuccess, setShowCourseFeedbackSuccess] = useState(false);
  const [courseFeedbackQuote, setCourseFeedbackQuote] = useState("");
  
  // Supervisor Drafts State
  const [supervisorDrafts, setSupervisorDrafts] = useState({});
  const [supervisorPrivateDrafts, setSupervisorPrivateDrafts] = useState({});
  const [supervisorOverallDrafts, setSupervisorOverallDrafts] = useState({});
  
  // Data State
  const [studentData, setStudentData] = useState({ 
    theoreticalProgress: {}, 
    practicalChecklist: {}, 
    signoffs: {}, 
    courseFeedback: {}, 
    quizPerformance: {},
    supervisorComments: {},
    supervisorPrivateNotes: {},
    supervisorOverallNotes: {},
    moduleTimeSpent: {},
    activityLog: []
  });
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentForSignoff, setSelectedStudentForSignoff] = useState(null);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  
  // Auth state
  const [firebaseUser, setFirebaseUser] = useState(null);

  // --- FIREBASE INIT ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error", err);
        try { await signInAnonymously(auth); } catch {}
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setFirebaseUser);
    return () => unsubscribe();
  }, []);

  // --- DATA SYNC ---
  useEffect(() => {
    if (!firebaseUser || !db || !currentUser) return;
    
    let unsubscribe;
    
    if (currentUser.role === 'student') {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          setDoc(docRef, { 
            theoreticalProgress: {}, 
            practicalChecklist: {}, 
            signoffs: {}, 
            courseFeedback: {}, 
            quizPerformance: {},
            supervisorComments: {},
            supervisorPrivateNotes: {},
            supervisorOverallNotes: {},
            moduleTimeSpent: {},
            activityLog: [{
              id: Date.now().toString(),
              studentName: currentUser.name,
              text: `enrolled in training portal`,
              time: new Date().toISOString(),
              type: 'info'
            }]
          });
        }
      }, (err) => console.error(err));
      
    } else if (currentUser.role === 'supervisor') {
      const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
      unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const students = [];
        querySnapshot.forEach((doc) => {
          students.push({ id: doc.id, ...doc.data() });
        });
        setAllStudents(students);
      }, (err) => console.error(err));
    }
    
    return () => { if (unsubscribe) unsubscribe(); };
  }, [firebaseUser, currentUser]);

  // Sync Local Course Feedback Text when Track Changes
  useEffect(() => {
    if (studentData?.courseFeedback?.[activeCertId]) {
      setCourseFeedbackText(studentData.courseFeedback[activeCertId]);
    } else {
      setCourseFeedbackText('');
    }
  }, [activeCertId, studentData.courseFeedback]);

  // Derived state for student
  const activeCert = CERTIFICATIONS.find(c => c.id === activeCertId) || CERTIFICATIONS[0];
  const activeModule = activeCert.modules.find(m => m.id === activeModuleId) || activeCert.modules[0];
  const theoreticalProgress = studentData.theoreticalProgress || {};
  const practicalChecklist = studentData.practicalChecklist || {};
  
  const currentSignoff = studentData.signoffs?.[activeCertId];
  const isSignedOff = !!currentSignoff;

  const completedModulesCount = activeCert.modules.filter(m => theoreticalProgress[m.id] === 'passed').length;
  const totalModules = activeCert.modules.length;
  const avgCompletion = Math.round((completedModulesCount / totalModules) * 100) || 0;
  
  const completedPracticalCount = activeCert.practical.filter(p => practicalChecklist[p.id] === true).length;
  const totalPractical = activeCert.practical.length;
  
  const isFullyReadyForSignoff = completedModulesCount === totalModules && completedPracticalCount === totalPractical;

  let totalAttempts = 0;
  if (studentData.quizPerformance) {
    Object.values(studentData.quizPerformance).forEach(modulePerf => {
      totalAttempts += (modulePerf.attempts || 0);
    });
  }

  // --- HANDLERS ---
  const handleLogin = (e, role) => {
    e.preventDefault();
    const nameInput = e.target.elements.name.value.trim();
    if (!nameInput) return;
    
    if (role === 'supervisor') {
      const pinInput = e.target.elements.pin.value;
      if (pinInput !== SUPERVISOR_ACCESS_PIN) {
        setLoginError('Incorrect Supervisor Access PIN.');
        return;
      }
    }
    
    setLoginError(''); 
    setCurrentUser({ name: nameInput, role });
    setActiveModuleId(LHR_MODULES[0].id); 
    setStudentActiveTab('dashboard'); 
    setSupervisorActiveTab('dashboard');
    setAppState(role === 'student' ? 'student-dash' : 'supervisor-dash');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStudentData({ theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, courseFeedback: {}, quizPerformance: {}, supervisorComments: {}, supervisorPrivateNotes: {}, supervisorOverallNotes: {}, moduleTimeSpent: {}, activityLog: [] });
    setLoginError('');
    setReadingMode(false);
    setReadingStartTime(null);
    setShowCourseFeedbackSuccess(false);
    setAppState('login');
  };

  const selectModule = (id) => {
    setActiveModuleId(id);
  };

  const handleCertChange = (certId) => {
    setActiveCertId(certId);
    setShowCourseFeedbackSuccess(false);
    const newCert = CERTIFICATIONS.find(c => c.id === certId);
    if (newCert && newCert.modules.length > 0) {
      selectModule(newCert.modules[0].id);
    }
  };

  const saveTimeSpent = async (secondsToAdd) => {
    if (!currentUser || !activeModuleId) return;
    const currentSpent = studentData.moduleTimeSpent?.[activeModuleId] || 0;
    const newTotal = currentSpent + secondsToAdd;

    // Optimistic UI Update
    setStudentData(prev => ({
      ...prev,
      moduleTimeSpent: { ...prev.moduleTimeSpent, [activeModuleId]: newTotal }
    }));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      try {
        await updateDoc(docRef, {
          [`moduleTimeSpent.${activeModuleId}`]: newTotal
        });
      } catch (e) { 
        console.error("Error saving time tracking", e); 
      }
    }
  };

  const handleOpenReadingMode = () => {
    setReadingStartTime(Date.now());
    setReadingMode(true);
  };

  const handleCloseReadingMode = async () => {
    if (readingStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - readingStartTime) / 1000);
      await saveTimeSpent(elapsedSeconds);
    }
    setReadingStartTime(null);
    setReadingMode(false);
  };

  const handleStartQuiz = async () => {
    if (readingStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - readingStartTime) / 1000);
      await saveTimeSpent(elapsedSeconds);
    }
    setReadingStartTime(null);
    setReadingMode(false);
    setAppState('quiz');
    setAnswers({});
    setQuizError('');
    setQuizState({ submitted: false, passed: false });
    window.scrollTo(0, 0);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (quizState.submitted || !currentUser) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setQuizError('');
  };

  const handleSubmitQuiz = async () => {
    if (!currentUser) return; // Removed strict Firebase dependency to allow local execution
    if (Object.keys(answers).length < activeModule.questions.length) {
      setQuizError("Please answer all questions before checking your results.");
      return;
    }

    const wrongQuestionIds = activeModule.questions
      .filter(q => answers[q.id] !== q.correctIndex)
      .map(q => q.id);

    const allCorrect = wrongQuestionIds.length === 0;
    setQuizState({ submitted: true, passed: allCorrect });

    const currentStats = studentData.quizPerformance?.[activeModuleId] || { attempts: 0, mistakes: {} };
    const newAttempts = currentStats.attempts + 1;
    const newMistakes = { ...currentStats.mistakes };
    
    wrongQuestionIds.forEach(id => {
       newMistakes[id] = (newMistakes[id] || 0) + 1;
    });

    const newLog = {
      id: Date.now().toString(),
      studentName: currentUser.name,
      text: allCorrect ? `passed ${activeModule.title}` : `retried ${activeModule.title} quiz`,
      time: new Date().toISOString(),
      type: allCorrect ? 'success' : 'warning'
    };

    // 1. Instantly update local UI so the app functions regardless of Firebase status
    setStudentData(prev => ({
      ...prev,
      theoreticalProgress: { 
         ...prev.theoreticalProgress, 
         ...(allCorrect ? { [activeModuleId]: 'passed' } : {}) 
      },
      quizPerformance: {
         ...prev.quizPerformance,
         [activeModuleId]: { attempts: newAttempts, mistakes: newMistakes }
      },
      activityLog: [...(prev.activityLog || []), newLog]
    }));

    // 2. Sync to Firebase if available
    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      const updates = {
        [`quizPerformance.${activeModuleId}`]: {
           attempts: newAttempts,
           mistakes: newMistakes
        },
        activityLog: [...(studentData.activityLog || []), newLog]
      };

      if (allCorrect) {
        updates[`theoreticalProgress.${activeModuleId}`] = 'passed';
      }

      try {
        await updateDoc(docRef, updates);
      } catch (err) {
        console.error("Error saving progress to Firebase", err);
      }
    }
  };

  const handleSaveCourseFeedback = async () => {
    if (!currentUser) return;
    setIsSavingCourseFeedback(true);
    
    const quotes = [
      "Continuous improvement is better than delayed perfection. Your feedback helps our practice grow.",
      "Great leaders are always learning. Thank you for elevating our standard of care.",
      "The beautiful thing about learning is that no one can take it away from you.",
      "Knowledge shared is knowledge multiplied. Thank you for your insights!",
      "Your voice is the catalyst for our growth. Thank you for sharing your perspective.",
      "Every insight you share builds a stronger, more capable team.",
      "Excellence is not a destination; it's a continuous journey. Thanks for walking it with us.",
      "The expert in anything was once a beginner. Keep growing, keep shining!",
      "Feedback is the breakfast of champions. Thank you for fueling our collective success.",
      "Small steps every day lead to massive results over time.",
      "We rise by lifting others. Thank you for contributing to our educational standard.",
      "Your dedication to mastering your craft is what makes this clinic exceptional.",
      "Never stop learning, because the industry never stops evolving.",
      "Quality means doing it right when no one is looking. Thank you for your commitment.",
      "The best way to predict the future is to create it. Thanks for helping us build a better training experience.",
      "Let the beauty of what you love be what you do. — Rumi",
      "As you start to walk on the way, the way appears. — Rumi",
      "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself. — Rumi",
      "You are not a drop in the ocean. You are the entire ocean in a drop. — Rumi",
      "What you seek is seeking you. — Rumi",
      "Wear gratitude like a cloak, and it will feed every corner of your life. — Rumi",
      "The wound is the place where the Light enters you. — Rumi",
      "Do not feel lonely, the entire universe is inside you. — Rumi",
      "There is a voice that doesn’t use words. Listen. — Rumi",
      "Keep your face always toward the sunshine—and shadows will fall behind you. — Walt Whitman"
    ];
    
    const newLog = {
      id: Date.now().toString(),
      studentName: currentUser.name,
      text: `submitted course feedback — ${activeCert.title}`,
      time: new Date().toISOString(),
      type: 'info'
    };

    // Optimistic UI Update
    setStudentData(prev => ({
      ...prev,
      courseFeedback: { ...prev.courseFeedback, [activeCertId]: courseFeedbackText },
      activityLog: [...(prev.activityLog || []), newLog]
    }));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      try {
        await updateDoc(docRef, {
          [`courseFeedback.${activeCertId}`]: courseFeedbackText,
          activityLog: [...(studentData.activityLog || []), newLog]
        });
      } catch (err) {
        console.error("Error saving feedback", err);
      }
    }

    setTimeout(() => {
      setCourseFeedbackQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setIsSavingCourseFeedback(false);
      setShowCourseFeedbackSuccess(true);
    }, 600);
  };

  const handleSaveSupervisorComment = async (studentId, moduleId) => {
    if (!currentUser) return;
    const draftKey = `${studentId}_${moduleId}`;
    const textToSave = supervisorDrafts[draftKey] || '';
    
    // Optimistic UI Update
    setAllStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, supervisorComments: { ...s.supervisorComments, [moduleId]: textToSave } } : s
    ));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
      try {
        await updateDoc(docRef, {
          [`supervisorComments.${moduleId}`]: textToSave
        });
      } catch (err) {
        console.error("Error saving supervisor comment", err);
      }
    }
  };

  const handleSaveSupervisorPrivateNote = async (studentId, moduleId) => {
    if (!currentUser) return;
    const draftKey = `${studentId}_${moduleId}`;
    const textToSave = supervisorPrivateDrafts[draftKey] || '';
    
    // Optimistic UI Update
    setAllStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, supervisorPrivateNotes: { ...s.supervisorPrivateNotes, [moduleId]: textToSave } } : s
    ));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
      try {
        await updateDoc(docRef, {
          [`supervisorPrivateNotes.${moduleId}`]: textToSave
        });
      } catch (err) {
        console.error("Error saving supervisor private note", err);
      }
    }
  };

  const handleSaveSupervisorOverallNote = async (studentId, certId) => {
    if (!currentUser) return;
    const draftKey = `${studentId}_${certId}`;
    const textToSave = supervisorOverallDrafts[draftKey] || '';
    
    // Optimistic UI Update
    setAllStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, supervisorOverallNotes: { ...s.supervisorOverallNotes, [certId]: textToSave } } : s
    ));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
      try {
        await updateDoc(docRef, {
          [`supervisorOverallNotes.${certId}`]: textToSave
        });
      } catch (err) {
        console.error("Error saving overall supervisor note", err);
      }
    }
  };

  const handleTogglePractical = async (studentId, itemId, currentChecklist, isSignedOffForStudent) => {
    if (isSignedOffForStudent || !currentUser) return; 
    
    const newValue = !currentChecklist[itemId];
    
    // Optimistic UI Update
    setAllStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, practicalChecklist: { ...s.practicalChecklist, [itemId]: newValue } } : s
    ));

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
      try {
        await updateDoc(docRef, {
          [`practicalChecklist.${itemId}`]: newValue
        });
      } catch (err) {
        console.error("Error saving practical item", err);
      }
    }
  };

  const handleSupervisorSignoff = async () => {
    if (!currentUser || !selectedStudentForSignoff) return;
    
    const signoffData = {
      status: true,
      by: currentUser.name,
      at: new Date().toISOString()
    };

    const newLog = {
      id: Date.now().toString(),
      studentName: selectedStudentForSignoff.id,
      text: `certified — ${activeCert.title} track signed off`,
      time: new Date().toISOString(),
      type: 'success'
    };

    // Optimistic UI Update
    setAllStudents(prev => prev.map(s => 
      s.id === selectedStudentForSignoff.id ? { 
        ...s, 
        signoffs: { ...s.signoffs, [activeCertId]: signoffData },
        activityLog: [...(s.activityLog || []), newLog]
      } : s
    ));

    setAppState('supervisor-dash');
    setSelectedStudentForSignoff(null);

    if (db && firebaseUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', selectedStudentForSignoff.id);
      try {
        await updateDoc(docRef, {
          [`signoffs.${activeCertId}`]: signoffData,
          activityLog: [...(selectedStudentForSignoff.activityLog || []), newLog]
        });
      } catch (err) {
        console.error("Error signing off", err);
      }
    }
  };

  // --- RENDERERS ---

  const renderLogin = () => (
    <div className="max-w-md mx-auto mt-12 bg-[#231C1A] rounded-3xl shadow-2xl border border-stone-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#171311] p-8 text-center border-b border-stone-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          SELFishly <span className="font-normal text-[#d4b09e]">Aesthetics & Wellness</span>
        </h1>
        <p className="text-stone-400 mt-2 text-xs font-bold uppercase tracking-widest">Learning Management System (LMS)</p>
      </div>
      <div className="p-8 space-y-8">
        <form onSubmit={(e) => handleLogin(e, 'student')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1.5">New Employee Login</label>
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full bg-[#171311] text-white px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B4828] focus:border-[#8B4828] transition-colors" />
          </div>
          <button type="submit" className="w-full bg-[#8B4828] hover:bg-[#a85a36] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <User className="w-5 h-5"/> Login as New Employee
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-800"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#231C1A] text-stone-500 font-bold uppercase tracking-widest text-[10px]">OR</span></div>
        </div>

        <form onSubmit={(e) => handleLogin(e, 'supervisor')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1.5">Clinical Supervisor Login</label>
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full bg-[#171311] text-white px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:border-stone-700 transition-colors mb-4" />
            
            <label className="block text-sm font-semibold text-stone-300 mb-1.5">Access PIN</label>
            <input required type="password" name="pin" placeholder="Enter supervisor PIN..." className="w-full bg-[#171311] text-white px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:border-stone-700 transition-colors" />
            
            {loginError && (
              <p className="text-rose-400 text-sm font-semibold mt-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {loginError}
              </p>
            )}
          </div>
          <button type="submit" className="w-full bg-[#171311] hover:bg-stone-800 text-white border border-stone-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md mt-2">
            <ShieldCheck className="w-5 h-5"/> Login as Supervisor
          </button>
        </form>
      </div>
    </div>
  );

  const renderLuxeStudentDashboard = () => {
    // Global Stats for the Analytics Dashboard
    const totalAllModules = CERTIFICATIONS.reduce((acc, c) => acc + c.modules.length, 0);
    const totalPassedAll = CERTIFICATIONS.reduce((acc, c) => acc + c.modules.filter(m => theoreticalProgress[m.id] === 'passed').length, 0);
    const overallCompletionPct = totalAllModules === 0 ? 0 : Math.round((totalPassedAll / totalAllModules) * 100);

    const totalAllPrac = CERTIFICATIONS.reduce((acc, c) => acc + c.practical.length, 0);
    const totalPracChecked = CERTIFICATIONS.reduce((acc, c) => acc + c.practical.filter(p => practicalChecklist[p.id] === true).length, 0);
    const overallPracPct = totalAllPrac === 0 ? 0 : Math.round((totalPracChecked / totalAllPrac) * 100);

    const renderStudentAnalytics = () => (
      <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 animate-in fade-in duration-300">
         {/* Top Banner */}
         <div className="bg-[#8B4828] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <Sparkles className="w-64 h-64" />
           </div>
           <p className="text-xs font-bold text-[#f5dbce] uppercase tracking-wider mb-2">EMPLOYEE LOGIN</p>
           <h2 className="text-3xl sm:text-5xl font-bold mb-4 relative z-10 tracking-tight">SELFishly Training Dashboard</h2>
           <p className="text-[#e8d5cc] text-sm sm:text-base leading-relaxed max-w-2xl relative z-10">Clinical modules, quizzes, certification progress, and practical observations are now pulled into your luxury LMS preview.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Luxury Analytics Dashboard Card */}
            <div className="bg-gradient-to-br from-[#2C1A14] to-[#1a0f0c] rounded-3xl p-8 shadow-2xl border border-[#3e2720] flex flex-col justify-between relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                 <Activity className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                 <p className="text-[#d4b09e] text-[10px] font-bold uppercase tracking-widest mb-3">Luxury Analytics Dashboard</p>
                 <h3 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight tracking-tight">Clinical<br/>Education<br/>Performance</h3>
                 <p className="text-stone-400 text-sm leading-relaxed mb-8 pr-4">Real-time certification analytics, provider completion tracking, quiz accuracy, and operational readiness across the SELFishly LMS ecosystem.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div className="bg-[#ffffff]/5 p-5 rounded-2xl border border-[#ffffff]/10 backdrop-blur-sm">
                   <span className="text-3xl sm:text-4xl font-bold text-white block mb-1">{overallCompletionPct}%</span>
                   <span className="text-[9px] sm:text-[10px] text-[#d4b09e] uppercase font-bold tracking-widest">Average Theory<br/>Completion</span>
                 </div>
                 <div className="bg-[#ffffff]/5 p-5 rounded-2xl border border-[#ffffff]/10 backdrop-blur-sm">
                   <span className="text-3xl sm:text-4xl font-bold text-white block mb-1">{totalPassedAll}</span>
                   <span className="text-[9px] sm:text-[10px] text-[#d4b09e] uppercase font-bold tracking-widest">Total Modules<br/>Passed</span>
                 </div>
               </div>
            </div>

            {/* Certification Completion Card */}
            <div className="bg-[#3b2116] rounded-3xl p-8 shadow-2xl border border-[#4a2b1d] flex flex-col relative overflow-hidden">
              <p className="text-[#d4b09e] text-[10px] font-bold uppercase tracking-widest mb-3">Certification Completion</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">Provider Progress<br/>Overview</h3>
              
              <div className="space-y-8 mt-auto relative z-10">
                {CERTIFICATIONS.map(cert => {
                   const cPassed = cert.modules.filter(m => theoreticalProgress[m.id] === 'passed').length;
                   const cProg = cert.modules.length === 0 ? 0 : Math.round((cPassed / cert.modules.length) * 100);
                   
                   return (
                     <div key={cert.id}>
                       <div className="flex justify-between items-end mb-2.5">
                         <span className="text-sm font-bold text-white tracking-wide">{cert.title}</span>
                         <span className="text-sm font-bold text-white">{cProg}%</span>
                       </div>
                       <div className="w-full bg-[#24140d] h-2.5 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-[#d4b09e] rounded-full transition-all duration-1000 ease-out" style={{ width: `${cProg}%` }}></div>
                       </div>
                     </div>
                   )
                })}
                <div className="pt-4">
                   <div className="flex justify-between items-end mb-2.5">
                     <span className="text-sm font-bold text-white tracking-wide">Practical Sign-Off Completion</span>
                     <span className="text-sm font-bold text-white">{overallPracPct}%</span>
                   </div>
                   <div className="w-full bg-[#24140d] h-2.5 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${overallPracPct}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    );

    const renderCourseOverview = () => (
      <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 animate-in fade-in duration-300">
         <div className="bg-[#8B4828] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
           <h2 className="text-3xl font-bold mb-3 relative z-10 tracking-tight">Clinical Provider Tracks</h2>
           <p className="text-[#e8d5cc] text-sm relative z-10">Select a certification track to continue your theoretical modules and view practical task checklists.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {CERTIFICATIONS.map(cert => {
              const cPassed = cert.modules.filter(m => theoreticalProgress[m.id] === 'passed').length;
              const cProg = cert.modules.length === 0 ? 0 : Math.round((cPassed / cert.modules.length) * 100);
              const isCertSignedOff = !!studentData.signoffs?.[cert.id];
              return (
                <div key={cert.id} className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                    {isCertSignedOff && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/>}
                  </div>
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-2.5">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Course Progress</span>
                      <span className="text-sm font-bold text-white">{cProg}%</span>
                    </div>
                    <div className="w-full bg-[#171311] h-2 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[#d4b09e] rounded-full transition-all duration-1000 ease-out" style={{ width: `${cProg}%` }}></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setActiveCertId(cert.id); setStudentActiveTab('course-details'); window.scrollTo(0,0); }}
                    className="w-full bg-[#302624] hover:bg-[#8B4828] text-white py-3.5 rounded-xl font-bold transition-colors mt-auto flex items-center justify-center gap-2 shadow-sm"
                  >
                    Enter Course <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              );
           })}
         </div>
      </div>
    );

    const renderCompletionStatus = () => (
      <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 animate-in fade-in duration-300">
         <div className="bg-[#171311] border border-stone-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <Award className="w-64 h-64" />
           </div>
           <h2 className="text-3xl font-bold mb-3 relative z-10 tracking-tight flex items-center gap-3">
             <CheckCircle className="w-8 h-8 text-[#d4b09e]"/> Completion Status
           </h2>
           <p className="text-stone-400 text-sm relative z-10 max-w-2xl">Review your completed modules and verified practical tasks across all certification tracks. Once a track is signed off by a supervisor, your official certificate will be available here.</p>
         </div>

         {CERTIFICATIONS.map(cert => {
            const passedModules = cert.modules.filter(m => theoreticalProgress[m.id] === 'passed');
            const isCertSignedOff = !!studentData.signoffs?.[cert.id];

            return (
              <div key={cert.id} className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-lg mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-stone-800/50 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                    <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">{passedModules.length} / {cert.modules.length} Modules Completed</p>
                  </div>
                  {isCertSignedOff ? (
                    <button onClick={() => { setActiveCertId(cert.id); setAppState('certificate'); window.scrollTo(0,0); }} className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm shadow-md w-full sm:w-auto">
                      <Printer className="w-4 h-4"/> View Certificate
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171311] text-stone-500 text-xs font-bold border border-stone-800">
                      Pending Supervisor Sign-Off
                    </span>
                  )}
                </div>
                
                <h4 className="font-bold text-[#d4b09e] text-xs uppercase tracking-widest mb-4">Passed Theoretical Modules</h4>
                {passedModules.length === 0 ? (
                  <p className="text-stone-600 italic text-sm mb-6">No modules completed yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    {passedModules.map(m => (
                      <div key={m.id} className="bg-[#171311] border border-stone-800 p-4 rounded-2xl flex items-start gap-3 transition-colors hover:border-stone-700">
                         <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/>
                         <div>
                           <span className="text-stone-200 text-sm font-bold block mb-1">{m.title}</span>
                           <span className="text-stone-500 text-[10px] uppercase tracking-wider">{m.track}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
         })}
      </div>
    );

    const renderCourseDetails = () => {
      const isPassedActive = theoreticalProgress[activeModule.id] === 'passed';
      
      return (
        <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 animate-in fade-in duration-300">
           <button onClick={() => { setStudentActiveTab('courses'); window.scrollTo(0,0); }} className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors w-fit bg-[#171311] px-4 py-2 rounded-full border border-stone-800">
             <ArrowLeft className="w-4 h-4"/> Back to All Tracks
           </button>
           
           <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <GraduationCap className="w-64 h-64" />
              </div>
              <p className="text-xs font-bold text-[#f5dbce] uppercase tracking-wider mb-2">COURSE OVERVIEW</p>
              <h2 className="text-3xl font-bold mb-3 relative z-10">{activeCert.title}</h2>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-center items-center">
                 <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">{totalModules}</span>
                 <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wide">Active Modules</span>
              </div>
              <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-center items-center">
                 <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">{avgCompletion}%</span>
                 <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wide">Avg Completion</span>
              </div>
              <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-center items-center">
                 <span className="text-3xl sm:text-4xl font-extrabold text-white block mb-1">{completedPracticalCount}/{totalPractical}</span>
                 <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wide">Practical Tasks</span>
              </div>
           </div>

           {isFullyReadyForSignoff && !isSignedOff && (
              <div className="bg-[#1c221e] border border-emerald-900/50 rounded-3xl p-6 flex items-start gap-4 shadow-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-300 text-lg">Ready for Supervisor Sign-Off</h3>
                  <p className="text-sm text-emerald-100/70 mt-1.5 leading-relaxed">You have completed all theoretical modules and practical requirements for this track. Please notify your clinical supervisor to review your profile.</p>
                </div>
              </div>
           )}

           <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
              {/* Center Content (Modules List) */}
              <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
                <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Training Modules</h3>
                      <p className="text-sm text-stone-400">Select a module to view materials.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeCert.modules.map(module => {
                      const isPassed = theoreticalProgress[module.id] === 'passed';
                      const isActive = activeModuleId === module.id;
                      
                      return (
                        <div 
                          key={module.id} 
                          onClick={() => selectModule(module.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 group ${
                            isActive ? 'border-[#8B4828] bg-[#2e1d16] shadow-md' : isPassed ? 'border-stone-800/60 bg-[#171311]/40 opacity-75 hover:opacity-100 hover:border-[#4d3a33] hover:bg-[#1f1917]' : 'border-stone-800 bg-[#171311] hover:border-[#4d3a33] hover:bg-[#1f1917]'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className={`font-bold text-[15px] mb-1.5 transition-colors flex items-center gap-2 ${isActive ? 'text-[#f5dbce]' : isPassed ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-200 group-hover:text-white'}`}>
                                {module.title}
                                {isPassed && <CheckCircle className="w-4 h-4 text-emerald-500/80" />}
                              </h4>
                              <p className="text-xs text-stone-500 font-medium">{module.track} • {module.duration}</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'text-[#8B4828]' : 'text-stone-600 group-hover:text-stone-400'} ${isActive ? 'translate-x-1' : ''}`} />
                          </div>
                          
                          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isPassed ? 'bg-[#8B4828] w-full' : isActive ? 'bg-[#d4b09e] w-1/4' : 'w-0'}`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Content (Now Viewing & Checklist) */}
              <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                <div className="bg-[#171311] border border-stone-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                     {React.cloneElement(activeModule.icon, { className: "w-32 h-32" })}
                   </div>
                   
                   <div className="flex items-center gap-2 text-[10px] font-bold text-[#d4b09e] uppercase tracking-widest mb-3 relative z-10">
                     <BookOpen className="w-3.5 h-3.5"/> Now Viewing
                   </div>
                   <h3 className="text-xl font-bold mb-4 leading-tight pr-4 relative z-10 text-white">{activeModule.title}</h3>
                   
                   <div className="mb-6 relative z-10">
                     <div className="flex justify-between items-center text-xs font-bold text-stone-500 mb-2">
                       <span>{isPassedActive ? '100% complete' : 'Ready to begin'}</span>
                       <div className="flex items-center gap-3">
                         <span className="flex items-center gap-1.5 text-[#d4b09e]">
                           <Clock className="w-3.5 h-3.5" /> {formatTime(studentData.moduleTimeSpent?.[activeModule.id])}
                         </span>
                         {isPassedActive && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                       </div>
                     </div>
                     <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full ${isPassedActive ? 'bg-[#d4b09e] w-full' : 'bg-stone-600 w-1/12'}`}></div>
                     </div>
                   </div>

                   <button 
                     onClick={handleOpenReadingMode} 
                     className="w-full bg-[#8B4828] hover:bg-[#a85a36] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg relative z-10"
                   >
                     <Play className="w-4 h-4" fill="currentColor" /> {isPassedActive ? 'Review Lesson' : 'Start Reading'}
                   </button>
                </div>

                {studentData.supervisorComments?.[activeModuleId] && (
                  <div className="bg-[#8B4828]/10 border border-[#8B4828]/30 rounded-3xl p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-2 text-[#d4b09e] flex items-center gap-2"><MessageCircle className="w-4 h-4"/> Supervisor Notes</h3>
                     <p className="text-sm text-stone-200 leading-relaxed">{studentData.supervisorComments[activeModuleId]}</p>
                  </div>
                )}

                <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-[#8B4828]"/> Practical Tasks</h3>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs text-stone-400">Evaluated by clinical supervisor only.</p>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#171311] text-stone-300 border border-stone-800">
                      {completedPracticalCount} / {totalPractical}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeCert.practical.map((item) => {
                      const isChecked = practicalChecklist[item.id] === true;
                      return (
                        <div key={item.id} className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all cursor-default ${isChecked ? 'bg-[#171311] border-[#8B4828]/50 shadow-sm' : 'bg-[#171311] border-stone-800 opacity-70'}`}>
                          <div className="pt-0.5">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-[#8B4828] bg-[#231C1A] rounded border-stone-700 focus:ring-[#8B4828] focus:ring-offset-[#171311]" 
                              checked={isChecked}
                              onChange={() => {}} // Disabled for employees
                              disabled={true}
                            />
                          </div>
                          <span className={`text-xs leading-relaxed ${isChecked ? 'text-white font-semibold' : 'text-stone-400'}`}>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Panel (Feedback) */}
              <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-8 shadow-lg">
                   <h3 className="font-bold text-xl mb-2 text-white flex items-center gap-3"><MessageCircle className="w-5 h-5 text-[#8B4828]"/> End of Course Feedback</h3>
                   
                   {showCourseFeedbackSuccess ? (
                     <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="mx-auto w-14 h-14 bg-emerald-950/30 rounded-full flex items-center justify-center mb-5 border border-emerald-900/50">
                           <CheckCircle className="w-7 h-7 text-emerald-500" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2 tracking-wide">Feedback Saved!</h4>
                        <p className="text-[#d4b09e] text-base italic font-serif leading-relaxed mb-6 px-4 max-w-2xl mx-auto">
                          "{courseFeedbackQuote}"
                        </p>
                        <button 
                           onClick={() => setShowCourseFeedbackSuccess(false)}
                           className="text-sm font-bold text-stone-400 hover:text-white underline underline-offset-4 transition-colors"
                        >
                          Edit or Add More Feedback
                        </button>
                     </div>
                   ) : (
                     <>
                       <p className="text-sm text-stone-400 mb-6">Share your overall thoughts, notes, or questions regarding the <span className="text-stone-300 font-medium">"{activeCert.title}"</span> track with your supervisor.</p>
                       
                       <textarea 
                          value={courseFeedbackText}
                          onChange={(e) => setCourseFeedbackText(e.target.value)}
                          placeholder="Type your notes here..."
                          className="w-full bg-[#171311] text-white placeholder-stone-600 border border-stone-800 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4828] transition-all min-h-[140px] resize-none mb-5"
                       />
                       <button 
                          onClick={handleSaveCourseFeedback}
                          disabled={isSavingCourseFeedback || !courseFeedbackText.trim()}
                          className="w-full sm:w-auto sm:px-10 bg-[#8B4828] hover:bg-[#a85a36] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 text-sm ml-auto"
                       >
                          {isSavingCourseFeedback ? <Activity className="w-5 h-5 animate-spin"/> : 'Save Feedback'}
                       </button>
                     </>
                   )}
                </div>
              </div>
           </div>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDEBAR */}
        <div className="col-span-1 lg:col-span-3 hidden md:flex flex-col gap-6">
          <div className="bg-[#8B4828] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
               <Sparkles className="w-32 h-32" />
             </div>
             <p className="text-xs font-bold text-[#f5dbce] uppercase tracking-wider mb-2">Welcome back, {currentUser.name.split(' ')[0]}</p>
             <h2 className="text-2xl font-bold mb-3 relative z-10">Training Portal</h2>
             <p className="text-[#e8d5cc] text-sm leading-relaxed relative z-10">A premium LMS built around SELFishly clinical training, quizzes, sign-offs, and certifications.</p>
          </div>

          <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-4 shadow-lg flex flex-col gap-2">
            <button 
              onClick={() => setStudentActiveTab('dashboard')}
              className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold transition-all border ${studentActiveTab === 'dashboard' ? 'bg-[#171311] text-[#d4b09e] border-stone-800 shadow-sm' : 'text-stone-400 border-transparent hover:bg-[#302624] hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5"/> Dashboard
            </button>
            <button 
              onClick={() => setStudentActiveTab('courses')}
              className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold transition-all border ${(studentActiveTab === 'courses' || studentActiveTab === 'course-details') ? 'bg-[#171311] text-[#d4b09e] border-stone-800 shadow-sm' : 'text-stone-400 border-transparent hover:bg-[#302624] hover:text-white'}`}
            >
              <GraduationCap className="w-5 h-5"/> Clinical Provider Tracks
            </button>
            <button 
              onClick={() => setStudentActiveTab('completion')} 
              className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold transition-all border ${studentActiveTab === 'completion' ? 'bg-[#171311] text-[#d4b09e] border-stone-800 shadow-sm' : 'text-stone-400 border-transparent hover:bg-[#302624] hover:text-white'}`}
            >
              <CheckCircle className="w-5 h-5"/> Completion Status
            </button>
          </div>
        </div>

        {/* CONDITIONAL RENDER BASED ON TAB */}
        {studentActiveTab === 'dashboard' && renderStudentAnalytics()}
        {studentActiveTab === 'courses' && renderCourseOverview()}
        {studentActiveTab === 'course-details' && renderCourseDetails()}
        {studentActiveTab === 'completion' && renderCompletionStatus()}
      </div>
    );
  };

  const ReadingModal = () => {
    if (!readingMode || !activeModule) return null;
    const isPassedActive = theoreticalProgress[activeModule.id] === 'passed';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseReadingMode}></div>
        <div className="relative w-full max-w-4xl max-h-full bg-[#171311] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-stone-800">
          
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-800 bg-[#231C1A]">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-[#171311] rounded-2xl shadow-inner border border-stone-800">
                  {React.cloneElement(activeModule.icon, { className: "w-6 h-6 text-[#d4b09e]" })}
               </div>
               <div>
                 <p className="text-[10px] font-bold text-[#8B4828] uppercase tracking-widest mb-1.5">{activeModule.track}</p>
                 <h2 className="text-2xl sm:text-3xl font-bold text-white leading-none tracking-tight">{activeModule.title}</h2>
               </div>
            </div>
            <button onClick={handleCloseReadingMode} className="p-2.5 bg-[#171311] hover:bg-stone-800 border border-stone-800 rounded-full transition-colors flex-shrink-0">
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 md:p-10 bg-[#171311]">
            <div className="prose prose-invert prose-stone max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-stone-300 prose-p:leading-relaxed prose-strong:text-stone-100 prose-li:text-stone-300">
              {activeModule.content.split('\n').map((paragraph, idx) => (
                <p 
                  key={idx} 
                  className="mb-5 text-[15px]"
                  dangerouslySetInnerHTML={{
                    __html: paragraph.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t border-stone-800 bg-[#231C1A] flex justify-end">
            {!isPassedActive ? (
              <button onClick={handleStartQuiz} className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2">
                Take Quiz <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleCloseReadingMode} className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg">
                Done Reading
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => (
    <div className="max-w-4xl mx-auto space-y-6 mt-8 px-4 sm:px-6 mb-16">
      <button 
        onClick={() => {
          if (quizState.passed) {
            setAppState('student-dash');
          } else {
            setAppState('student-dash');
            setReadingMode(true);
          }
        }}
        className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {quizState.passed ? 'Back to Dashboard' : 'Back to Reading'}
      </button>

      <div className="bg-[#231C1A] rounded-3xl shadow-2xl border border-stone-800 overflow-hidden">
        <div className="bg-[#171311] border-b border-stone-800 p-8">
           <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Knowledge Check: {activeModule?.title}</h1>
           {!quizState.submitted ? (
             <p className="text-stone-400 text-sm mt-3">Select your answers below. You must score 100% to pass.</p>
           ) : (
             <p className={`text-sm mt-3 font-bold ${quizState.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
               {quizState.passed ? 'Excellent! You passed the module.' : 'Some answers were incorrect. Review the feedback below and try again.'}
             </p>
           )}
        </div>
        
        <div className="p-8 space-y-10">
          {activeModule?.questions.map((q, qIndex) => {
            const isUserCorrectForThisQuestion = answers[q.id] === q.correctIndex;
            const isSubmitted = quizState.submitted;

            return (
              <div key={q.id} className="space-y-4">
                <h3 className="font-bold text-white text-lg leading-relaxed">
                  <span className="text-[#8B4828] mr-2">{qIndex + 1}.</span> 
                  {q.text}
                </h3>
                
                <div className="space-y-3">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[q.id] === optIndex;
                    const isTheCorrectAnswer = optIndex === q.correctIndex;
                    
                    let btnClass = "bg-[#171311] border-stone-800 text-stone-400 hover:border-[#8B4828] hover:text-[#f5dbce]";
                    let radioClass = "border-stone-700";
                    
                    if (isSubmitted) {
                      if (isSelected && isUserCorrectForThisQuestion) {
                        btnClass = "bg-[#8B4828] border-[#8B4828] text-white shadow-md";
                        radioClass = "border-white bg-white";
                      } else if (isSelected && !isUserCorrectForThisQuestion) {
                        btnClass = "bg-stone-800 border-stone-700 text-stone-500 opacity-80";
                        radioClass = "border-stone-500 bg-stone-500";
                      } else if (isTheCorrectAnswer) {
                        btnClass = "bg-[#231C1A] border-[#8B4828] text-[#8B4828] border-dashed";
                        radioClass = "border-[#8B4828]";
                      } else {
                        btnClass = "bg-[#171311] border-stone-800 text-stone-600 opacity-50";
                        radioClass = "border-stone-800";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-[#8B4828] border-[#8B4828] text-white shadow-md";
                      radioClass = "border-white bg-white";
                    }

                    return (
                      <label 
                        key={optIndex} 
                        onClick={() => handleAnswerSelect(q.id, optIndex)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${!isSubmitted ? 'cursor-pointer hover:shadow-md' : 'cursor-default'} ${btnClass}`}
                      >
                        <div className="flex-shrink-0 pt-0.5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${radioClass}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#171311]" />}
                          </div>
                        </div>
                        <span className="text-sm font-semibold leading-relaxed">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className={`mt-5 p-5 rounded-2xl border ${isUserCorrectForThisQuestion ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-rose-950/20 border-rose-900/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isUserCorrectForThisQuestion ? <Smile className="text-emerald-500 w-5 h-5" /> : <Frown className="text-rose-500 w-5 h-5" />}
                      <span className={`font-bold uppercase tracking-wider text-xs ${isUserCorrectForThisQuestion ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUserCorrectForThisQuestion ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed mt-2">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {quizError && (
            <div className="bg-rose-950/30 text-rose-400 p-4 rounded-xl flex items-start gap-3 border border-rose-900/50">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{quizError}</p>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-stone-800 flex justify-end">
            {!quizState.submitted ? (
              <button onClick={handleSubmitQuiz} className="bg-white hover:bg-stone-200 text-black px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">Check Answers</button>
            ) : quizState.passed ? (
              <button onClick={() => { 
                  setAppState('student-dash'); 
                  const currentIndex = activeCert.modules.findIndex(m => m.id === activeModuleId);
                  if (currentIndex < activeCert.modules.length - 1) {
                    setActiveModuleId(activeCert.modules[currentIndex + 1].id);
                  }
                  window.scrollTo(0, 0); 
                }} 
                className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg"
              >
                Complete Module & Continue
              </button>
            ) : (
              <button onClick={handleStartQuiz} className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">Retry Quiz</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupervisorDashboard = () => {
    // Process stats for all students
    const allActivities = [];
    
    const studentStats = allStudents.map(student => {
      let totalPassed = 0;
      let totalPrac = 0;
      let totalReqs = 0;
      
      let lhrPassed = 0, lhrTotal = 0;
      let tatPassed = 0, tatTotal = 0;
      let isCertified = false;
      let isReady = false;

      CERTIFICATIONS.forEach(c => {
         const mTotal = c.modules.length;
         const pTotal = c.practical.length;
         const mPassed = c.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length;
         const pPassed = c.practical.filter(p => (student.practicalChecklist || {})[p.id] === true).length;
         
         totalReqs += mTotal + pTotal;
         totalPassed += mPassed;
         totalPrac += pPassed;

         if (c.id === 'lhr') { lhrPassed = mPassed + pPassed; lhrTotal = mTotal + pTotal; }
         if (c.id === 'tattoo') { tatPassed = mPassed + pPassed; tatTotal = mTotal + pTotal; }

         if (student.signoffs?.[c.id]) isCertified = true;
         if (mPassed === mTotal && pPassed === pTotal && !student.signoffs?.[c.id]) isReady = true;
      });
      
      const score = totalReqs === 0 ? 0 : Math.round(((totalPassed + totalPrac) / totalReqs) * 100);
      
      let status = 'JUST ENROLLED';
      if (isCertified) status = 'CERTIFIED';
      else if (isReady) status = 'AWAITING REVIEW';
      else if (CERTIFICATIONS.some(c => c.modules.every(m => (student.theoreticalProgress || {})[m.id] === 'passed') && !student.signoffs?.[c.id])) status = 'THEORY COMPLETE';
      else if (score > 0) status = 'IN PROGRESS';

      // Gather track names for the roster display
      const activeTracks = [];
      if (lhrPassed > 0 || student.signoffs?.['lhr']) activeTracks.push('LHR');
      if (tatPassed > 0 || student.signoffs?.['tattoo']) activeTracks.push('Tattoo removal');
      const trackString = activeTracks.length > 0 ? activeTracks.join(' • ') : 'Just enrolled';

      // Collect activities
      if (student.activityLog && Array.isArray(student.activityLog)) {
        allActivities.push(...student.activityLog);
      }

      return { 
        ...student, 
        score, 
        totalPassed, 
        isReady, 
        isCertified, 
        status, 
        trackString,
        lhrPct: lhrTotal ? Math.round((lhrPassed / lhrTotal) * 100) : 0,
        tatPct: tatTotal ? Math.round((tatPassed / tatTotal) * 100) : 0
      };
    }).sort((a, b) => b.score - a.score);

    // Process Activity Feed
    allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = allActivities.slice(0, 5);

    // Global Supervisor Metrics
    const totalEnrolled = studentStats.length;
    const overallCompletion = studentStats.length ? Math.round(studentStats.reduce((acc, s) => acc + s.score, 0) / studentStats.length) : 0;
    const totalModulesPassed = studentStats.reduce((acc, s) => acc + s.totalPassed, 0);
    const totalReady = studentStats.filter(s => s.isReady).length;
    const totalCertified = studentStats.filter(s => s.isCertified).length;

    // Track Completions Average
    const avgLHR = studentStats.length ? Math.round(studentStats.reduce((acc, s) => acc + s.lhrPct, 0) / studentStats.length) : 0;
    const avgTattoo = studentStats.length ? Math.round(studentStats.reduce((acc, s) => acc + s.tatPct, 0) / studentStats.length) : 0;
    
    // Practical Completion Average (Global across all tracks & students)
    let totalAllPracItems = 0;
    let totalAllPracPassed = 0;
    allStudents.forEach(s => {
      CERTIFICATIONS.forEach(c => {
         totalAllPracItems += c.practical.length;
         totalAllPracPassed += c.practical.filter(p => (s.practicalChecklist || {})[p.id] === true).length;
      });
    });
    const avgPractical = totalAllPracItems ? Math.round((totalAllPracPassed / totalAllPracItems) * 100) : 0;

    const topPerformers = studentStats.slice(0, 4);

    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Supervisor Sidebar */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0 gap-8">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { setSupervisorActiveTab('dashboard'); setExpandedStudentId(null); }}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'dashboard' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4"/> Dashboard
            </button>
            <button 
              onClick={() => { setSupervisorActiveTab('providers'); setExpandedStudentId(null); }}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'providers' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4"/> Providers
            </button>
            <button onClick={() => { setSupervisorActiveTab('certifications'); setExpandedStudentId(null); }} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'certifications' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}><Award className="w-4 h-4"/> Certifications</button>
            <button onClick={() => { setSupervisorActiveTab('practical'); setExpandedStudentId(null); }} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'practical' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}><CheckSquare className="w-4 h-4"/> Practical tasks</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-3 pl-3">Clinical Tracks</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setActiveCertId('lhr'); setSupervisorActiveTab('roster'); setExpandedStudentId(null); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'roster' && activeCertId === 'lhr' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}
              >
                <Zap className="w-4 h-4"/> LHR — SplendorX
              </button>
              <button 
                onClick={() => { setActiveCertId('tattoo'); setSupervisorActiveTab('roster'); setExpandedStudentId(null); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold transition-all ${supervisorActiveTab === 'roster' && activeCertId === 'tattoo' ? 'bg-[#231C1A] text-[#d4b09e]' : 'text-stone-400 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4"/> Tattoo removal
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-3 pl-3">System</p>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full p-3 rounded-xl font-bold text-stone-400 hover:text-white transition-all"><Settings className="w-4 h-4"/> Settings</button>
              <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl font-bold text-stone-400 hover:text-white transition-all"><LogOut className="w-4 h-4"/> Log out</button>
            </div>
          </div>
        </div>

        {/* Supervisor Main Content */}
        <div className="flex-grow flex flex-col gap-6 w-full max-w-full overflow-hidden">
          
        {supervisorActiveTab === 'dashboard' ? (
            <>
              {studentStats.some(s => s.status === 'THEORY COMPLETE' || s.status === 'AWAITING REVIEW') && (
                <div className="bg-[#2a1810] border border-[#8B4828] rounded-2xl p-4 flex items-start gap-4 mb-2">
                  <AlertOctagon className="w-5 h-5 text-[#d4b09e] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Action Required</p>
                    <div className="flex flex-wrap gap-2">
                      {studentStats.filter(s => s.status === 'THEORY COMPLETE' || s.status === 'AWAITING REVIEW').map(s => (
                        <span key={s.id} className="text-xs text-[#d4b09e] bg-[#8B4828]/20 border border-[#8B4828]/40 px-3 py-1 rounded-full font-semibold">
                          {s.id} — {s.status === 'THEORY COMPLETE' ? 'Theory done, needs practical sign-off' : 'Ready for full certification'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Dashboard Top Banner */}
              <div className="bg-gradient-to-br from-[#1c1410] to-[#120a07] border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="relative z-10">
                  <p className="text-[#8B4828] text-[10px] font-bold uppercase tracking-widest mb-2">Supervisor Dashboard</p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Clinical Training<br/>Overview</h1>
                  <p className="text-stone-400 text-sm leading-relaxed max-w-xs">Real-time provider certification and practical readiness across both tracks.</p>
                </div>
                <div className="relative z-10 text-right shrink-0 pr-4 sm:pr-8">
                  <span className="text-5xl sm:text-6xl font-bold text-white block mb-1">{overallCompletion}%</span>
                  <span className="text-[#8B4828] text-[10px] uppercase font-bold tracking-widest block">Overall<br/>Completion</span>
                </div>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#171311] border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4">Providers Enrolled</p>
                  <span className="text-3xl font-bold text-white mb-3">{totalEnrolled}</span>
                  <p className="text-stone-500 text-xs">— 3 active tracks</p>
                </div>
                <div className="bg-[#171311] border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4">Modules Passed</p>
                  <span className="text-3xl font-bold text-white mb-3">{totalModulesPassed}</span>
                  <p className="text-emerald-500 text-xs flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> {recentActivities.filter(a => a.type === 'success').length} recently</p>
                </div>
                <div className="bg-[#171311] border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4">Ready for Sign-off</p>
                  <span className="text-3xl font-bold text-white mb-3">{totalReady}</span>
                  <p className="text-stone-500 text-xs flex items-center gap-1.5"><Clock className="w-3 h-3"/> Awaiting review</p>
                </div>
                <div className="bg-[#171311] border border-stone-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-4">Certified Providers</p>
                  <span className="text-3xl font-bold text-white mb-3">{totalCertified}</span>
                  <p className="text-emerald-500 text-xs flex items-center gap-1.5"><CheckCircle className="w-3 h-3"/> All tracks</p>
                </div>
              </div>

              {/* 3 Columns Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Track Completion Card */}
                <div className="bg-[#171311] border border-stone-800 rounded-3xl p-8 shadow-md">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-8">Track Completion</p>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-white leading-none">LHR —<br/>SplendorX</span>
                        <span className="text-sm font-bold text-stone-400">{avgLHR}%</span>
                      </div>
                      <div className="w-full bg-[#231C1A] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B4828] rounded-full" style={{ width: `${avgLHR}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-white leading-none">Tattoo removal<br/>(M22)</span>
                        <span className="text-sm font-bold text-stone-400">{avgTattoo}%</span>
                      </div>
                      <div className="w-full bg-[#231C1A] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d4b09e] rounded-full" style={{ width: `${avgTattoo}%` }}></div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-stone-800 my-4"></div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-stone-300">Practical sign-offs</span>
                        <span className="text-sm font-bold text-stone-400">{avgPractical}%</span>
                      </div>
                      <div className="w-full bg-[#231C1A] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgPractical}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-stone-300">Quiz accuracy</span>
                        <span className="text-sm font-bold text-stone-400">91%</span>
                      </div>
                      <div className="w-full bg-[#231C1A] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `91%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Card */}
                <div className="bg-[#171311] border border-stone-800 rounded-3xl p-8 shadow-md">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-6">Recent Activity</p>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-800 before:to-transparent">
                    {recentActivities.map(act => {
                      let dotColor = 'bg-stone-500';
                      if (act.type === 'success') dotColor = 'bg-emerald-500';
                      if (act.type === 'warning') dotColor = 'bg-yellow-500';
                      if (act.type === 'info') dotColor = 'bg-blue-500';
                      
                      const nameParts = act.studentName.split(' ');
                      const shortName = nameParts[0] + (nameParts.length > 1 ? ' ' + nameParts[nameParts.length - 1][0] + '.' : '');

                      return (
                        <div key={act.id} className="relative flex items-start gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${dotColor} ring-4 ring-[#171311] mt-1.5 shrink-0 z-10`}></div>
                          <div>
                            <p className="text-stone-300 text-sm leading-snug font-medium"><span className="text-white font-bold">{shortName}</span> {act.text}</p>
                            <p className="text-stone-500 text-xs mt-1">{formatTimeAgo(act.time)}</p>
                          </div>
                        </div>
                      )
                    })}
                    {recentActivities.length === 0 && <p className="text-stone-500 text-sm font-medium relative z-10 bg-[#171311] py-1 inline-block">No recent activity.</p>}
                  </div>
                </div>

                {/* Top Providers Card */}
                <div className="bg-[#171311] border border-stone-800 rounded-3xl p-8 shadow-md flex flex-col">
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-6">Top Providers</p>
                  <div className="space-y-4">
                    {topPerformers.map((sp, idx) => (
                       <div key={sp.id} className="bg-[#231C1A] border border-stone-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-4">
                           <span className="text-stone-500 font-bold text-xs">{idx + 1}</span>
                           <div className="w-10 h-10 rounded-full bg-[#302624] text-[#d4b09e] flex items-center justify-center font-bold text-sm border border-stone-700">{sp.id.substring(0,2).toUpperCase()}</div>
                           <p className="text-white font-bold text-sm">{sp.id}</p>
                         </div>
                         <span className="text-stone-300 font-bold text-sm">{sp.score}%</span>
                       </div>
                    ))}
                    {topPerformers.length === 0 && <p className="text-stone-500 text-sm font-medium">No data available yet.</p>}
                  </div>
                </div>

              </div>

              {/* Provider Roster Section */}
              <div className="bg-[#171311] rounded-3xl shadow-xl border border-stone-800 overflow-hidden mt-4">
                <div className="px-8 py-6 border-b border-stone-800 bg-[#1a1513]">
                  <h2 className="font-bold text-stone-400 text-[10px] tracking-widest uppercase">Provider Roster — All Tracks</h2>
                </div>
                
                {studentStats.length === 0 ? (
                  <div className="p-16 text-center text-stone-500 font-medium">No providers have registered yet.</div>
                ) : (
                  <div className="divide-y divide-stone-800">
                    {studentStats.map(student => {
                      const isExpanded = expandedStudentId === student.id;
                      
                      let badgeClasses = "text-stone-400 border-stone-800";
                      let badgeIcon = <Circle className="w-3.5 h-3.5" />;
                      if (student.status === 'CERTIFIED') {
  badgeClasses = "text-emerald-500 border-emerald-900/50 bg-emerald-950/20";
  badgeIcon = <CheckCircle className="w-3.5 h-3.5" />;
} else if (student.status === 'AWAITING REVIEW') {
  badgeClasses = "text-white border-[#8B4828] bg-[#8B4828]";
  badgeIcon = <AlertOctagon className="w-3.5 h-3.5" />;
} else if (student.status === 'THEORY COMPLETE') {
  badgeClasses = "text-purple-300 border-purple-800 bg-purple-950/30";
  badgeIcon = <Award className="w-3.5 h-3.5" />;
} else if (student.status === 'IN PROGRESS') {
  badgeClasses = "text-yellow-500 border-yellow-900/50 bg-yellow-950/20";
  badgeIcon = <Clock className="w-3.5 h-3.5" />;
} else {
  badgeClasses = "text-blue-400 border-blue-900/50 bg-blue-950/20";
  badgeIcon = <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mx-1"></div>;
}

                      return (
                        <div key={student.id} className="overflow-hidden">
                          <div 
                            onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                            className={`p-6 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors cursor-pointer hover:bg-[#231C1A] ${isExpanded ? 'bg-[#231C1A]' : ''}`}
                          >
                            <div className="flex-1 max-w-sm">
                              <h3 className="font-bold text-white text-base mb-1">{student.id}</h3>
                              <p className="text-xs text-stone-500 font-medium">{student.trackString}</p>
                            </div>
                            
                            <div className="flex items-center gap-6 flex-1 lg:justify-end">
                              <div className="flex items-center gap-3 w-48">
                                <div className="w-full bg-[#231C1A] h-1 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#8B4828] rounded-full" style={{ width: `${student.score}%` }}></div>
                                </div>
                                <span className="text-stone-400 text-xs font-bold w-8 text-right">{student.score}%</span>
                              </div>
                              
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider w-36 justify-center ${badgeClasses}`}>
                                {badgeIcon} {student.status}
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded Details Render */}
                          {isExpanded && (
                            <div className="p-6 sm:px-8 bg-[#1a1513] border-t border-stone-800 shadow-inner">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  <User className="w-4 h-4 text-[#d4b09e]"/> Detailed Provider View
                                </h4>
                                {(() => {
  const allPracDone = CERTIFICATIONS.every(cert =>
    cert.practical.every(p => (student.practicalChecklist || {})[p.id] === true)
  );
  const allModsDone = CERTIFICATIONS.every(cert =>
    cert.modules.every(m => (student.theoreticalProgress || {})[m.id] === 'passed')
  );
  const alreadyCertified = CERTIFICATIONS.some(c => student.signoffs?.[c.id]);

  if (alreadyCertified) {
    return (
      <button
        onClick={() => { setActiveCertId(Object.keys(student.signoffs)[0]); setSelectedStudentForSignoff(student); setAppState('certificate'); window.scrollTo(0,0); }}
        className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2"
      >
        <Award className="w-3.5 h-3.5" /> View Certificate
      </button>
    );
  }

  if (allModsDone && allPracDone) {
    return (
      <button
        onClick={() => { setSelectedStudentForSignoff(student); setAppState('signoff'); window.scrollTo(0,0); }}
        className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 animate-pulse"
      >
        <Award className="w-3.5 h-3.5" /> Ready — Sign Off Now
      </button>
    );
  }

  if (allModsDone && !allPracDone) {
    const totalPrac = CERTIFICATIONS.reduce((a, c) => a + c.practical.length, 0);
    const donePrac = CERTIFICATIONS.reduce((a, c) => a + c.practical.filter(p => (student.practicalChecklist || {})[p.id]).length, 0);
    return (
      <span className="text-xs text-purple-300 border border-purple-800 bg-purple-950/30 px-3 py-1.5 rounded-lg font-bold">
        Theory ✓ — Practicals {donePrac}/{totalPrac}
      </span>
    );
  }

  return null;
})()}
                              </div>
                              
                              <div className="space-y-8">
                                {CERTIFICATIONS.map(cert => {
                                  const cPassed = cert.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length;
                                  const cProg = cert.modules.length === 0 ? 0 : Math.round((cPassed / cert.modules.length) * 100);
                                  const isCertSignedOff = !!student.signoffs?.[cert.id];

                                  return (
                                    <div key={cert.id} className="bg-[#231C1A] rounded-2xl border border-stone-800 p-6">
                                      <div className="flex items-center justify-between mb-5 border-b border-stone-800 pb-4">
                                        <div>
                                          <h5 className="font-bold text-stone-200 text-sm">{cert.title}</h5>
                                          <p className="text-xs text-stone-500 mt-1">{cProg}% Complete</p>
                                        </div>
                                        {isCertSignedOff && <span className="text-emerald-500 text-[10px] uppercase font-bold tracking-widest border border-emerald-900/50 bg-emerald-950/20 px-2 py-1 rounded">Certified</span>}
                                      </div>

                                      <div className="grid gap-4 md:grid-cols-2">
                                        {cert.modules.map(mod => {
                                          const isPassed = (student.theoreticalProgress || {})[mod.id] === 'passed';
                                          const stats = (student.quizPerformance || {})[mod.id] || { attempts: 0, mistakes: {} };
                                          const draftKey = `${student.id}_${mod.id}`;
                                          const currentDraft = supervisorDrafts[draftKey] ?? (student.supervisorComments?.[mod.id] || '');
                                          
                                          return (
                                            <div key={mod.id} className="bg-[#171311] border border-stone-800 rounded-xl p-4">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-stone-300 text-xs pr-2">{mod.title}</span>
                                                {isPassed ? (
                                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0"/>
                                                ) : (
                                                  <Circle className="w-3.5 h-3.5 text-stone-600 shrink-0"/>
                                                )}
                                              </div>
                                              <p className="text-[10px] text-stone-500 mb-3">Attempts: {stats.attempts} | Time: {formatTime(student.moduleTimeSpent?.[mod.id])}</p>

{stats.mistakes && Object.keys(stats.mistakes).length > 0 && (
  <div className="mb-3 bg-rose-950/20 border border-rose-900/30 rounded-lg p-3">
    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2">Questions Missed</p>
    {Object.entries(stats.mistakes).map(([questionId, count]) => {
      const allModules = CERTIFICATIONS.flatMap(c => c.modules);
      const mod = allModules.find(m => m.questions?.some(q => q.id === questionId));
      const question = mod?.questions?.find(q => q.id === questionId);
      return question ? (
        <div key={questionId} className="mb-2 pb-2 border-b border-rose-900/20 last:border-0 last:mb-0 last:pb-0">
          <p className="text-[10px] text-rose-300 leading-relaxed">"{question.text}"</p>
          <p className="text-[9px] text-rose-500 mt-1 font-bold">{count}x incorrect</p>
        </div>
      ) : null;
    })}
  </div>
)}
                                              
                                              <textarea
                                                value={currentDraft}
                                                onChange={(e) => setSupervisorDrafts(prev => ({ ...prev, [draftKey]: e.target.value }))}
                                                placeholder="Add student note..."
                                                className="w-full bg-[#231C1A] text-stone-300 placeholder-stone-600 border border-stone-800 rounded-lg p-2 text-[10px] focus:outline-none focus:border-[#8B4828] transition-all resize-none min-h-[50px] mb-2"
                                              />
                                              <button
                                                onClick={() => handleSaveSupervisorComment(student.id, mod.id)}
                                                className="w-full bg-[#302624] hover:bg-[#8B4828] text-white py-1.5 rounded text-[10px] font-bold transition-colors"
                                              >
                                                Save Note
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      <div className="mt-6 pt-6 border-t border-stone-800">
                                        <h6 className="font-bold text-stone-300 text-xs uppercase tracking-wider mb-4">Practical Tasks</h6>
                                        <div className="space-y-2">
                                          {cert.practical.map((item) => {
                                            const isChecked = (student.practicalChecklist || {})[item.id] === true;
                                            return (
                                              <label key={item.id} className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${isCertSignedOff ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-[#171311]'} ${isChecked ? 'border-[#8B4828]/50 bg-[#171311]' : 'border-stone-800 bg-[#231C1A]'}`}>
                                                <input 
                                                  type="checkbox" 
                                                  className="w-3.5 h-3.5 mt-0.5 text-[#8B4828] bg-[#171311] rounded border-stone-700 focus:ring-[#8B4828]" 
                                                  checked={isChecked}
                                                  onChange={() => handleTogglePractical(student.id, item.id, student.practicalChecklist || {}, isCertSignedOff)}
                                                  disabled={isCertSignedOff}
                                                />
                                                <span className={`text-[11px] leading-relaxed ${isChecked ? 'text-stone-200' : 'text-stone-500'}`}>{item.label}</span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
         ) : supervisorActiveTab === 'providers' ? (
          <div className="flex flex-col gap-6">
            <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold tracking-tight">Provider Statistics</h2>
              <p className="text-[#e8d5cc] text-sm mt-2">Detailed breakdown of every employee — time spent, quiz performance, and missed questions.</p>
            </div>
            {allStudents.length === 0 ? (
              <div className="bg-[#171311] border border-stone-800 rounded-3xl p-16 text-center text-stone-500">No providers have registered yet.</div>
            ) : (
              allStudents.map(student => {
                const totalMods = CERTIFICATIONS.reduce((a, c) => a + c.modules.length, 0);
                const passed = CERTIFICATIONS.reduce((a, c) => a + c.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length, 0);
                const totalTime = Object.values(student.moduleTimeSpent || {}).reduce((a, b) => a + b, 0);
                const totalAttempts = Object.values(student.quizPerformance || {}).reduce((a, b) => a + (b.attempts || 0), 0);
                const totalMistakes = Object.values(student.quizPerformance || {}).reduce((a, b) => a + Object.values(b.mistakes || {}).reduce((x, y) => x + y, 0), 0);
                return (
                  <div key={student.id} className="bg-[#171311] border border-stone-800 rounded-3xl overflow-hidden shadow-lg">
                    <div className="bg-[#231C1A] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#302624] text-[#d4b09e] flex items-center justify-center font-bold text-lg border border-stone-700">{student.id.substring(0,2).toUpperCase()}</div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{student.id}</h3>
                          <p className="text-xs text-stone-500">{passed}/{totalMods} modules passed</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-xl font-bold text-white">{formatTime(totalTime)}</p>
                          <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Total Time</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white">{totalAttempts}</p>
                          <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Quiz Attempts</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-rose-400">{totalMistakes}</p>
                          <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Total Mistakes</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CERTIFICATIONS.flatMap(cert => cert.modules).map(mod => {
                        const isPassed = (student.theoreticalProgress || {})[mod.id] === 'passed';
                        const stats = (student.quizPerformance || {})[mod.id] || { attempts: 0, mistakes: {} };
                        const timeSpent = (student.moduleTimeSpent || {})[mod.id] || 0;
                        const mistakeCount = Object.values(stats.mistakes || {}).reduce((a, b) => a + b, 0);
                        return (
                          <div key={mod.id} className={`bg-[#231C1A] border rounded-2xl p-5 ${isPassed ? 'border-[#8B4828]/40' : 'border-stone-800'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1 pr-3">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{mod.track}</p>
                                <h4 className="font-bold text-white text-sm leading-snug">{mod.title}</h4>
                              </div>
                              {isPassed ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1"/> : <Circle className="w-4 h-4 text-stone-600 shrink-0 mt-1"/>}
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                                <p className="text-sm font-bold text-white">{formatTime(timeSpent)}</p>
                                <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Time Spent</p>
                              </div>
                              <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                                <p className="text-sm font-bold text-white">{stats.attempts}</p>
                                <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Attempts</p>
                              </div>
                              <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                                <p className={`text-sm font-bold ${mistakeCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{mistakeCount}</p>
                                <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Mistakes</p>
                              </div>
                            </div>
                            {stats.mistakes && Object.keys(stats.mistakes).length > 0 && (
                              <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4">
                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-3">Missed Questions</p>
                                <div className="space-y-3">
                                  {Object.entries(stats.mistakes).map(([questionId, count]) => {
                                    const question = CERTIFICATIONS.flatMap(c => c.modules).flatMap(m => m.questions).find(q => q.id === questionId);
                                    return question ? (
                                      <div key={questionId} className="pb-3 border-b border-rose-900/20 last:border-0 last:pb-0">
                                        <p className="text-[11px] text-rose-200 leading-relaxed mb-1">"{question.text}"</p>
                                        <div className="flex items-center justify-between">
                                          <p className="text-[10px] text-rose-400 font-bold">{count}x incorrect</p>
                                          <p className="text-[10px] text-stone-500">Correct: "{question.options[question.correctIndex]}"</p>
                                        </div>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
 ) : supervisorActiveTab === 'providers' ? (
  <div className="flex flex-col gap-6">
    <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-xl">
      <h2 className="text-3xl font-bold tracking-tight">Provider Statistics</h2>
      <p className="text-[#e8d5cc] text-sm mt-2">Detailed breakdown of every employee — time spent, quiz performance, and missed questions.</p>
    </div>
    {allStudents.length === 0 ? (
      <div className="bg-[#171311] border border-stone-800 rounded-3xl p-16 text-center text-stone-500">No providers have registered yet.</div>
    ) : allStudents.map(student => {
      const totalMods = CERTIFICATIONS.reduce((a, c) => a + c.modules.length, 0);
      const passed = CERTIFICATIONS.reduce((a, c) => a + c.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length, 0);
      const totalTime = Object.values(student.moduleTimeSpent || {}).reduce((a, b) => a + b, 0);
      const totalAttempts = Object.values(student.quizPerformance || {}).reduce((a, b) => a + (b.attempts || 0), 0);
      const totalMistakes = Object.values(student.quizPerformance || {}).reduce((a, b) => a + Object.values(b.mistakes || {}).reduce((x, y) => x + y, 0), 0);
      return (
        <div key={student.id} className="bg-[#171311] border border-stone-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="bg-[#231C1A] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#302624] text-[#d4b09e] flex items-center justify-center font-bold text-lg border border-stone-700">{student.id.substring(0,2).toUpperCase()}</div>
              <div>
                <h3 className="font-bold text-white text-lg">{student.id}</h3>
                <p className="text-xs text-stone-500">{passed}/{totalMods} modules passed</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div><p className="text-xl font-bold text-white">{formatTime(totalTime)}</p><p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Total Time</p></div>
              <div><p className="text-xl font-bold text-white">{totalAttempts}</p><p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Quiz Attempts</p></div>
              <div><p className="text-xl font-bold text-rose-400">{totalMistakes}</p><p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Total Mistakes</p></div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATIONS.flatMap(cert => cert.modules).map(mod => {
              const isPassed = (student.theoreticalProgress || {})[mod.id] === 'passed';
              const stats = (student.quizPerformance || {})[mod.id] || { attempts: 0, mistakes: {} };
              const timeSpent = (student.moduleTimeSpent || {})[mod.id] || 0;
              const mistakeCount = Object.values(stats.mistakes || {}).reduce((a, b) => a + b, 0);
              return (
                <div key={mod.id} className={`bg-[#231C1A] border rounded-2xl p-5 ${isPassed ? 'border-[#8B4828]/40' : 'border-stone-800'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-3">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{mod.track}</p>
                      <h4 className="font-bold text-white text-sm leading-snug">{mod.title}</h4>
                    </div>
                    {isPassed ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1"/> : <Circle className="w-4 h-4 text-stone-600 shrink-0 mt-1"/>}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                      <p className="text-sm font-bold text-white">{formatTime(timeSpent)}</p>
                      <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Time Spent</p>
                    </div>
                    <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                      <p className="text-sm font-bold text-white">{stats.attempts}</p>
                      <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Attempts</p>
                    </div>
                    <div className="bg-[#171311] rounded-xl p-3 text-center border border-stone-800">
                      <p className={`text-sm font-bold ${mistakeCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{mistakeCount}</p>
                      <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Mistakes</p>
                    </div>
                  </div>
                  {stats.mistakes && Object.keys(stats.mistakes).length > 0 && (
                    <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-3">Missed Questions</p>
                      <div className="space-y-3">
                        {Object.entries(stats.mistakes).map(([questionId, count]) => {
                          const question = CERTIFICATIONS.flatMap(c => c.modules).flatMap(m => m.questions).find(q => q.id === questionId);
                          return question ? (
                            <div key={questionId} className="pb-3 border-b border-rose-900/20 last:border-0 last:pb-0">
                              <p className="text-[11px] text-rose-200 leading-relaxed mb-1">"{question.text}"</p>
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] text-rose-400 font-bold">{count}x incorrect</p>
                                <p className="text-[10px] text-stone-500">Correct: "{question.options[question.correctIndex]}"</p>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>

) : supervisorActiveTab === 'certifications' ? (
  <div className="flex flex-col gap-6">
    <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-xl">
      <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
      <p className="text-[#e8d5cc] text-sm mt-2">Overview of all certified providers and pending sign-offs.</p>
    </div>
    {CERTIFICATIONS.map(cert => {
      const certifiedStudents = allStudents.filter(s => s.signoffs?.[cert.id]);
      const readyStudents = allStudents.filter(s => {
        const allMods = cert.modules.every(m => (s.theoreticalProgress || {})[m.id] === 'passed');
        const allPrac = cert.practical.every(p => (s.practicalChecklist || {})[p.id] === true);
        return allMods && allPrac && !s.signoffs?.[cert.id];
      });
      return (
        <div key={cert.id} className="bg-[#171311] border border-stone-800 rounded-3xl overflow-hidden">
          <div className="bg-[#231C1A] px-8 py-6 border-b border-stone-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">{cert.title}</h3>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-1.5 rounded-lg">{certifiedStudents.length} Certified</span>
              {readyStudents.length > 0 && <span className="text-xs font-bold text-[#d4b09e] bg-[#8B4828]/20 border border-[#8B4828]/40 px-3 py-1.5 rounded-lg">{readyStudents.length} Awaiting Sign-Off</span>}
            </div>
          </div>
          <div className="p-6 space-y-3">
            {readyStudents.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-[#d4b09e] uppercase tracking-widest mb-3">Ready for Sign-Off</p>
                {readyStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-[#2a1810] border border-[#8B4828]/40 rounded-2xl p-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#8B4828] text-white flex items-center justify-center font-bold text-sm">{s.id.substring(0,2).toUpperCase()}</div>
                      <span className="font-bold text-white text-sm">{s.id}</span>
                    </div>
                    <button onClick={() => { setSelectedStudentForSignoff(s); setAppState('signoff'); window.scrollTo(0,0); }} className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2">
                      <Award className="w-3.5 h-3.5"/> Sign Off Now
                    </button>
                  </div>
                ))}
              </div>
            )}
            {certifiedStudents.length > 0 ? (
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Certified Providers</p>
                {certifiedStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-[#171311] border border-emerald-900/30 rounded-2xl p-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm">{s.id.substring(0,2).toUpperCase()}</div>
                      <div>
                        <span className="font-bold text-white text-sm block">{s.id}</span>
                        <span className="text-[10px] text-stone-500">Certified {s.signoffs[cert.id]?.at ? new Date(s.signoffs[cert.id].at).toLocaleDateString() : ''} by {s.signoffs[cert.id]?.by}</span>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500"/>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-sm text-center py-4">No certified providers yet for this track.</p>
            )}
          </div>
        </div>
      );
    })}
  </div>

) : supervisorActiveTab === 'practical' ? (
  <div className="flex flex-col gap-6">
    <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-xl">
      <h2 className="text-3xl font-bold tracking-tight">Practical Tasks</h2>
      <p className="text-[#e8d5cc] text-sm mt-2">Check off hands-on tasks as each provider completes them in person.</p>
    </div>
    {allStudents.length === 0 ? (
      <div className="bg-[#171311] border border-stone-800 rounded-3xl p-16 text-center text-stone-500">No providers registered yet.</div>
    ) : allStudents.map(student => (
      <div key={student.id} className="bg-[#171311] border border-stone-800 rounded-3xl overflow-hidden">
        <div className="bg-[#231C1A] px-8 py-5 border-b border-stone-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#302624] text-[#d4b09e] flex items-center justify-center font-bold border border-stone-700">{student.id.substring(0,2).toUpperCase()}</div>
          <h3 className="font-bold text-white">{student.id}</h3>
        </div>
        <div className="p-6 space-y-6">
          {CERTIFICATIONS.map(cert => {
            const isCertSignedOff = !!student.signoffs?.[cert.id];
            const checkedCount = cert.practical.filter(p => (student.practicalChecklist || {})[p.id] === true).length;
            return (
              <div key={cert.id}>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-[#d4b09e] uppercase tracking-widest">{cert.title}</p>
                  <span className="text-[10px] text-stone-400 font-bold">{checkedCount}/{cert.practical.length}</span>
                </div>
                <div className="space-y-2">
                  {cert.practical.map(item => {
                    const isChecked = (student.practicalChecklist || {})[item.id] === true;
                    return (
                      <label key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isCertSignedOff ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-[#231C1A]'} ${isChecked ? 'border-[#8B4828]/50 bg-[#1a1210]' : 'border-stone-800'}`}>
                        <input type="checkbox" className="w-4 h-4 mt-0.5 text-[#8B4828] bg-[#171311] rounded border-stone-700 focus:ring-[#8B4828]" checked={isChecked} onChange={() => handleTogglePractical(student.id, item.id, student.practicalChecklist || {}, isCertSignedOff)} disabled={isCertSignedOff}/>
                        <span className={`text-xs leading-relaxed ${isChecked ? 'text-white font-semibold' : 'text-stone-400'}`}>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>

) : (
  <div className="bg-[#171311] rounded-3xl shadow-xl border border-stone-800 overflow-hidden">
    <div className="px-8 py-6 border-b border-stone-800 bg-[#231C1A]">
      <h2 className="font-bold text-white text-lg tracking-wide">Clinical Track: <span className="text-[#d4b09e]">{activeCert.title}</span></h2>
    </div>
    <div className="p-6 flex flex-col gap-4">
      {allStudents.length === 0 ? (
        <p className="text-stone-500 text-center py-8">No providers registered yet.</p>
      ) : allStudents.map(student => {
        const cPassed = activeCert.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length;
        const cPrac = activeCert.practical.filter(p => (student.practicalChecklist || {})[p.id]).length;
        const pct = Math.round(((cPassed + cPrac) / (activeCert.modules.length + activeCert.practical.length)) * 100) || 0;
        const isSigned = !!student.signoffs?.[activeCertId];
        return (
          <div key={student.id} className="bg-[#231C1A] border border-stone-800 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#302624] text-[#d4b09e] flex items-center justify-center font-bold text-sm border border-stone-700">{student.id.substring(0,2).toUpperCase()}</div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm mb-2">{student.id}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B4828] rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-xs text-stone-400 font-bold w-8">{pct}%</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">{cPassed}/{activeCert.modules.length} modules · {cPrac}/{activeCert.practical.length} practicals</p>
              </div>
            </div>
            {isSigned ? (
              <span className="text-[10px] font-bold text-emerald-400 border border-emerald-900/50 bg-emerald-950/20 px-2 py-1 rounded">Certified</span>
            ) : (
              <button onClick={() => { setExpandedStudentId(student.id); setSupervisorActiveTab('dashboard'); window.scrollTo(0,0); }} className="text-xs font-bold text-stone-400 hover:text-white border border-stone-700 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors">View Profile</button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
        </div>
      </div>
    );
  };

  const renderSupervisorSignoff = () => {
    if (!selectedStudentForSignoff) return null;
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-12 px-4">
        <button onClick={() => setAppState('supervisor-dash')} className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors px-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-[#231C1A] rounded-3xl shadow-2xl border border-stone-800 p-10 text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-[#171311] rounded-full flex items-center justify-center border border-stone-800 shadow-inner">
            <FileSignature className="w-10 h-10 text-[#d4b09e]" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Official Certification Sign-off</h1>
            <p className="text-stone-400 mt-4 leading-relaxed text-lg">
              <span className="font-bold text-white">{selectedStudentForSignoff.id}</span> has completed all requirements for <span className="font-bold text-white">{activeCert.title}</span>.
            </p>
          </div>

          <div className="bg-[#171311] border border-stone-800 rounded-2xl p-6 text-left space-y-4 shadow-inner">
            <h3 className="font-bold text-[#d4b09e] border-b border-stone-800 pb-3 uppercase tracking-widest text-xs">Requirements Met</h3>
            <ul className="space-y-4 text-sm text-stone-300 font-medium pt-2">
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> All Theoretical Modules Passed</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> All Hands-on Practical Items Checked</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-stone-800">
            <p className="text-sm text-stone-400 mb-8 italic leading-relaxed px-4">
              "By signing off, I verify that I have reviewed this employee's knowledge and they are officially cleared for practical, unsupervised application at SELFishly Aesthetics & Wellness."
            </p>
            <button
              onClick={handleSupervisorSignoff}
              className="w-full flex justify-center items-center gap-3 bg-[#8B4828] hover:bg-[#a85a36] text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-lg text-lg"
            >
              <UserCheck className="w-6 h-6" /> Execute Clinical Supervisor Sign Off
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCertificate = () => {
    return (
      <div className="max-w-4xl mx-auto space-y-6 mt-8">
        <div className="flex justify-between items-center print:hidden px-4">
          <button onClick={() => {
             if (currentUser.role === 'supervisor') setAppState('supervisor-dash');
             else setAppState('student-dash');
          }} className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <button onClick={() => window.print()} className="bg-white hover:bg-stone-200 text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Printer className="w-4 h-4"/> Print Certificate
          </button>
        </div>
        
        <div className="bg-[#FAF9F6] p-12 md:p-20 border-[16px] border-[#2C1A14] rounded-3xl shadow-2xl text-center print:shadow-none print:m-0 print:border-8 print:rounded-none">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-8 border border-stone-200 shadow-sm">
            <Award className="w-12 h-12 text-[#8B4828]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#2C1A14] mb-3">Certificate of Completion</h1>
          <p className="text-lg md:text-xl text-[#8B4828] tracking-widest uppercase mb-16 font-bold">{activeCert.title}</p>
          
          <p className="text-lg text-stone-600 mb-4 font-serif italic">This certifies that</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 border-b-2 border-stone-200 inline-block px-16 pb-3">{currentUser?.name}</h2>
          <p className="text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed mb-20">
            has successfully completed all theoretical coursework, device operation protocol, safety training, and hands-on practical requirements necessary to earn certification for {activeCert.title} at SELFishly Aesthetics & Wellness.
          </p>

          <div className="flex justify-around items-end pt-12 border-t border-stone-200">
            <div className="text-center">
              <p className="text-xl font-bold text-black font-serif italic">{currentSignoff?.by}</p>
              <div className="w-56 h-px bg-stone-300 my-3 mx-auto"></div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Clinical Supervisor</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-black">{currentSignoff?.at ? new Date(currentSignoff.at).toLocaleDateString() : 'N/A'}</p>
              <div className="w-56 h-px bg-stone-300 my-3 mx-auto"></div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Date of Certification</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#171311] font-sans text-stone-100 selection:bg-[#8B4828] selection:text-white">
      {/* Top Navbar */}
      <nav className="bg-[#231C1A] border-b border-stone-800 px-6 py-4 sticky top-0 z-40 shadow-xl flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-[#171311] border border-stone-800 p-2.5 rounded-xl flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-[#d4b09e]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-white tracking-tight leading-none">
              SELFishly <span className="font-normal text-[#d4b09e]">Aesthetics & Wellness</span>
            </span>
            <span className="text-[9px] font-bold text-[#8B4828] mt-1.5 tracking-widest uppercase">
              Learning Management System
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          {currentUser && (
            <div className="flex items-center gap-4 border-stone-800">
              <div className="w-10 h-10 rounded-full bg-[#171311] text-[#d4b09e] border border-stone-800 flex items-center justify-center font-bold shadow-inner">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-stone-500 hover:text-rose-500 transition-colors" title="Log Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Router */}
      {appState === 'login' && (
        <div className="py-12 px-4">
          {renderLogin()}
        </div>
      )}
      
      {appState === 'student-dash' && (
        <main className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {renderLuxeStudentDashboard()}
        </main>
      )}

      {appState === 'quiz' && renderQuiz()}
      {appState === 'supervisor-dash' && renderSupervisorDashboard()}
      {appState === 'signoff' && renderSupervisorSignoff()}
      {appState === 'certificate' && renderCertificate()}
      
      {/* Global Modals */}
      <ReadingModal />
    </div>
  );
}