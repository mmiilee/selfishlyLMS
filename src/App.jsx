import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Circle, BookOpen, ShieldCheck, AlertTriangle, 
  Award, ArrowRight, ArrowLeft, Activity, UserCheck, FileSignature, 
  Zap, MessageCircle, AlertOctagon, Smile, Frown, ClipboardList,
  User, CheckSquare, Printer, Users, LogOut, ChevronDown, ChevronUp, Sparkles,
  LayoutDashboard, GraduationCap, HelpCircle, Play, Search, X, ChevronRight
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

let app, auth, db, appId;
try {
  // Use the preview config if in Canvas, otherwise use YOUR real config for Vercel
  const configToUse = typeof __firebase_config !== 'undefined' && Object.keys(JSON.parse(__firebase_config)).length > 0 
    ? JSON.parse(__firebase_config) 
    : myFirebaseConfig;
    
  app = initializeApp(configToUse);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase not initialized. Running in local mode.");
}

// A unique identifier for your LMS data path. Uses the dynamic ID in Canvas to satisfy security rules, 
// and falls back to your custom ID when running on Vercel.
appId = typeof __app_id !== 'undefined' ? __app_id : 'selfishly-lms-v1'; 

// 🔒 CHANGE THIS TO YOUR CLINIC'S SECRET SUPERVISOR PIN 🔒
const SUPERVISOR_ACCESS_PIN = "2790";

// --- CUSTOM LUXE COLORS ---
const BRAND_BROWN = "#8B4828";
const BRAND_LIGHT_BROWN = "#d4b09e";

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
      **The Nature of Tattoo Ink & Macrophages**
      Tattoos are made of incredibly tiny ink particles—often around 40 to 100 nanometers in size. When injected into the skin, these particles clump together. While the body's immune system can clear tiny, individual particles, it cannot remove these massive clumps. The body then encapsulates the clumps within *dermal macrophages* (essentially acting as prison cells, holding the ink in place).

      **The Macrophage Steam Explosion (Photoacoustic Effect)**
      Because these particles are so tiny, they lose heat extremely quickly (short thermal relaxation time). When you hit them with a laser, the particles absorb energy and heat up, passing that heat to the surrounding tissue water inside the macrophage. 
      When water turns to steam, its volume expands massively (by a factor of about 2,000). The macrophage cannot withstand the pressure from this steam formation, causing it to explode! The explosive force sends the ink particles flying out in all directions, turning them into microscopic fragments that the lymphatic system can now easily wash away. This is the **photoacoustic effect**.

      **Why Pulse Duration Matters**
      If your laser pulse is too long (like a **millisecond** laser), the ink particles lose too much heat before the temperature rises enough to create steam. The process is too gentle, heat is lost as fast as it comes in, and no explosion occurs. You must deliver energy in an incredibly short burst to achieve the temperature rise needed.

      **The Nano vs. Pico Debate**
      Marketing from laser companies pushes picosecond lasers as the ultimate devices. While picosecond lasers are fabulous tools (especially for notoriously difficult colors like blues, greens, or yellows), there is an unspoken truth: **Picosecond lasers are terrible for dense, saturated black tattoo removal.**
      • **Nanosecond (Q-Switched):** The M22 operates in nanoseconds (6-8 ns). Nanosecond pulses produce a balanced photothermal (heat) and photoacoustic (shockwave) effect.
      • **Picosecond:** Fires up to a hundred times shorter, shifting almost entirely to photoacoustic pressure with very little heat deposited.
      When you have a highly saturated, dense black tattoo, the thermal heat provided by a nanosecond laser is *required* to create a stronger shattering effect. A dark black tattoo that might take 8-10 sessions with a nanosecond laser could easily take 15-20 frustrating sessions with a picosecond device. Black ink makes up 90% of tattoos; a Q-Switched nanosecond laser is the premier tool for breaking it down.
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
        text: "Millisecond pulse durations are effective for tattoo removal.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False! Millisecond pulses are far too long. The heat dissipates before steam can form, meaning no explosive (photoacoustic) reaction occurs to shatter the ink."
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
      **The Four Physical Variables**
      Every laser treatment comes down to a few physical variables. These aren’t arbitrary dial positions. Each one directly controls energy delivery to ink particles and the tissue around them. 

      **1. Fluence: Energy Density**
      Fluence is energy density — defined as the energy per unit area, typically measured in Joules per square centimeter (J/cm²). That number tells you the total dose hitting each square centimeter of skin with every pulse. If the fluence is too low, particles won’t absorb enough energy to break apart. Too high, and you risk damage.

      **2. Spot Size Changes Everything (The Inverse Square Law)**
      Here’s what catches many off guard: if you keep your laser’s energy the same but dial down the spot size, your fluence shoots up. You’re packing identical energy into a much smaller area. 
      The relationship follows an inverse square law — **if you halve the spot diameter while keeping the laser's energy constant, the fluence roughly quadruples.** That’s why spot size and fluence are inseparable. 

      **Spot Size Selection on the M22**
      The M22 offers 7 tip sizes (from 2.0mm to 8.0mm). 
      *Rule of Thumb:* **Larger tip sizes penetrate deeper and deliver less surface fluence.** Larger spot sizes are more suited for:
      1. Higher densities of pigment/tattoo ink.
      2. Darker skin types.
      3. Sensitive body areas.
      From session to session, as the dark tattoo becomes lighter, reducing the spot size will increase the energy deposits to shatter the remaining stubborn pigment.

      **3. Fluence vs. Irradiance**
      Fluence is the *total* energy dose per area. Irradiance is the *power* per area at any moment during the pulse (the rate). To get irradiance, divide fluence by pulse duration. The instantaneous power surge drives the photoacoustic effect. Peak power indicates the mechanical shock delivered to ink.

      **4. Repetition Rate and Thermal Stacking**
      Repetition rate is measured in Hertz (Hz), or pulses per second. The gap between pulses is the tissue recovery window.
      If you fire too fast, the heat doesn’t dissipate completely. Residual heat from one pulse adds to the next. This is called **Thermal Stacking**. This cumulative heat buildup is a primary cause of unwanted thermal injury during treatment. Controlling the repetition rate prevents heat from accumulating.

      **The Top-Hat Beam Profile**
      The M22 QS Nd:YAG uses a "top-hat" beam profile. Unlike standard beams that have a dangerous "hot spot" in the center, the top-hat profile warrants a perfectly homogenous energy distribution across the entire spot. This highly minimizes epidermal damage, tissue textural changes, scarring, and dangerous blood splatter.
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
        text: "What is 'Thermal Stacking' in laser tattoo removal?",
        options: [
          "Stacking two different spot sizes on top of each other to increase depth.",
          "When pulses are fired too fast (high Hertz) and residual heat from one pulse adds to the next because the tissue hasn't had time to cool.",
          "When the ink particles stack on top of each other during the healing process."
        ],
        correctIndex: 1,
        explanation: "Thermal stacking occurs when the repetition rate is too fast, shrinking the tissue's recovery window. The heat builds up cumulatively and causes thermal burns."
      },
      {
        id: 'tat-2-3',
        text: "When adjusting settings on the M22, what is true regarding larger tip sizes (e.g., 6.0mm or 8.0mm)?",
        options: [
          "Larger tips penetrate shallower and deliver more fluence.",
          "Larger tips penetrate deeper, deliver less surface fluence, and are better for higher ink densities and darker skin types.",
          "Tip size has no effect on depth or fluence."
        ],
        correctIndex: 1,
        explanation: "Larger tip sizes drive the energy deeper into the dermis but deliver less total surface fluence, making them the safest starting point for dense tattoos and darker skin."
      }
    ]
  },
  {
    id: 'tat-3',
    title: "Tattoo Anatomy, Skin Types & Conditions",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Understanding tattoo typology, 1064nm vs. 532nm, and paradoxical darkening.",
    track: "Advanced Devices",
    duration: "40 min",
    content: `
      **Tattoo Typology & Depth**
      Tattoo dye composition is incredibly variable. The differing compositions explain why some tattoos respond favorably and others stubbornly resist.
      • **Professional Tattoos:** Contain organometallic dyes. They are densely packed and placed deep in the dermis with a machine. Usually require 6-10 sessions.
      • **Amateur Tattoos:** Often contain carbon-rich mixtures (like India ink or soot). They are sparse and placed irregularly, but mostly superficially. Usually require 4-6 sessions.
      • **Traumatic Tattoos:** Result from explosions, asphalt, pencil lead, or gunpowder. *Warning:* Explosive particles may react dangerously with laser therapy, ignite, and lead to pock-like scarring. 

      **Wavelengths and Skin Types (1064nm vs. 532nm)**
      The Lumenis M22 Q-Switched Nd:YAG provides two primary wavelengths for tattoo removal:
      • **1064 nm (Near-Infrared):** Highly effective for dark inks (black, dark blue). Epidermal melanin absorbs very little energy at this wavelength, meaning it penetrates deeply and safely bypasses the surface skin. It is the mandatory choice for darker skin types (Fitzpatrick IV-VI) to prevent severe hypopigmentation (white spots).
      • **532 nm (Green Light):** Created by passing the 1064nm beam through a KTP crystal. This wavelength is highly absorbed by red, orange, and yellow inks. *Warning:* Because 532nm is highly absorbed by melanin, it is very risky for darker Fitzpatrick skin types and can easily destroy their natural skin pigment.

      **Paradoxical Darkening (Cosmetic Tattoos)**
      Approach pink, red, and flesh-tone tattoos (such as lip liner, microblading, or cosmetic eyeliner) with extreme caution. These inks often contain iron or titanium oxide. Laser energy can cause a rapid chemical transformation of the ferric oxide into ferrous oxide. This results in **paradoxical darkening** (the ink instantly turns black), which is often highly resistant to any additional laser therapy.
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
        text: "Why is the 1064nm wavelength the safest and most effective choice for removing black tattoos on Fitzpatrick Type V and VI skin?",
        options: [
          "Because it is absorbed highly by epidermal melanin.",
          "Because 1064nm is a blue light that cools the skin.",
          "Because it has the lowest epidermal melanin absorption, allowing it to bypass the dark surface skin and target the deep ink without causing hypopigmentation."
        ],
        correctIndex: 2,
        explanation: "The 1064nm wavelength safely bypasses the abundant melanin in the surface of dark skin types, driving straight down to the dark tattoo ink without destroying the patient's natural pigment."
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
      **Managing Expectations**
      Tattoo removal requires patience. Appropriate pre-treatment counseling regarding realistic expectations is of utmost importance to ensure patient satisfaction. Patients must understand that complete clearance cannot be guaranteed.

      **1. "Why do I have to wait 6 to 8 weeks between sessions?"**
      **Provider Answer:** "The laser doesn't actually remove the ink; it just shatters it into microscopic pieces. Your body's immune system (the lymphatic system) has to do the heavy lifting to flush those particles out. That biological process takes 6 to 8 weeks. Treating it sooner won't speed up the fading, it will just unnecessarily damage your skin and increase the risk of scarring."

      **2. "How many sessions will it take?"**
      **Provider Answer:** "It is difficult to predict an exact number because every tattoo's depth, ink density, and chemical composition is different. Generally, amateur tattoos require 4-6 sessions, while professional tattoos usually require 6-10 sessions. You will likely see the most dramatic fading after the first couple of sessions, and slower, gradual fading toward the end."

      **3. "Does it hurt?"**
      **Provider Answer:** "Yes, it is often described as feeling like hot bacon grease or a heavy rubber band snapping against the skin. Because the laser creates a microscopic shockwave, it is uncomfortable. However, treatments are incredibly fast (often lasting only seconds or minutes), and we use cooling systems (or numbing agents) to make it as tolerable as possible."

      **4. "Will it blister?"**
      **Provider Answer:** "Blistering is an extremely common, normal reaction within the first 24 to 48 hours after treatment. It is a sign that your body is reacting to the shattered ink and starting the healing process. We will provide you with specific aftercare instructions to manage them safely."
    `,
    questions: [
      {
        id: 'tat-5-1',
        text: "Why is a minimum of 6 to 8 weeks required between tattoo removal sessions?",
        options: [
          "To give the machine time to rest.",
          "Because the immune system (macrophages) needs time to clear the shattered ink through the lymphatic system.",
          "To ensure the numbing cream fully wears off."
        ],
        correctIndex: 1,
        explanation: "Treating too soon increases scarring risks without speeding up removal. The body physically needs 6-8 weeks to flush the shattered ink particles away."
      },
      {
        id: 'tat-5-2',
        text: "If a patient asks if blistering is normal after their first tattoo removal session, what is the correct response?",
        options: [
          "Blistering means the laser was too high and you sustained a 3rd-degree burn.",
          "Blistering is extremely common within the first 24-48 hours and is a normal part of the healing process.",
          "Blistering means the tattoo is permanently scarred."
        ],
        correctIndex: 1,
        explanation: "Blistering is an incredibly common, expected reaction as the skin responds to the intense photoacoustic shockwave and thermal energy."
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
      **The Clinical Endpoint: "Frosting"**
      The immediate, desired clinical endpoint during tattoo removal is called **frosting** (epidermal whitening). This white, ash-like appearance happens immediately as the laser pulse strikes the ink. It is caused by rapid steam/gas bubble formation in the skin from the shattered ink and water. This frosting typically subsides within 10 to 20 minutes. If frosting is not observed, the laser exposure dose is likely insufficient.

      **Other Normal Immediate Reactions**
      Mild erythema (redness), edema (swelling), and occasional pinpoint bleeding are also normal immediate endpoints, especially in darker or densely packed tattoos. 
      *Technique tip:* If pinpoint bleeding occurs, gently pat the area dry with sterile gauze before firing again to avoid blood splatter.

      **Possible Mid- to Long-Term Complications**
      • **Hypopigmentation (White Spots):** Drop-like white maculae can occur if the fluence is too high or if the 532nm wavelength is used inappropriately on darker skin, destroying the natural melanin. It is usually transient but can take 3-6 months to resolve.
      • **Hyperpigmentation (PIH):** Darkening of the skin due to thermal damage. Highly exacerbated by sun exposure!
      • **Scarring:** Extremely rare when using appropriate spot sizes and intervals. Areas prone to hypertrophic scarring (chest, neck, upper back) should be treated with lower fluences. Overlapping pulses or treating too frequently (ignoring the 6-week rule) massively increases scarring risk.
    `,
    questions: [
      {
        id: 'tat-6-1',
        text: "What is the immediate, desired clinical endpoint when firing the QS Nd:YAG over a dark tattoo?",
        options: [
          "Immediate disappearance of the tattoo forever.",
          "Epidermal frosting (a white, ash-like appearance) caused by gas bubbles.",
          "Severe bruising and large hematomas."
        ],
        correctIndex: 1,
        explanation: "Frosting is the expected clinical endpoint indicating the ink has shattered. It is caused by steam/gas bubbles and usually fades in 10-20 minutes."
      },
      {
        id: 'tat-6-2',
        text: "Which of the following significantly increases the risk of severe hypopigmentation (white spots) on a patient with Fitzpatrick Type V skin?",
        options: [
          "Using a 1064nm wavelength.",
          "Waiting 8 weeks between sessions.",
          "Using a 532nm wavelength."
        ],
        correctIndex: 2,
        explanation: "The 532nm wavelength is highly absorbed by melanin. Using it on dark skin will aggressively destroy the patient's natural pigment, causing severe hypopigmentation."
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
      **Pre-Treatment Preparation**
      • **Sun Avoidance:** Tanned skin acts as a light-blocker, drawing laser energy into the epidermis and away from the tattoo, risking severe burns. Patients must avoid sun/tanning beds for 3-4 weeks prior. Tanned skin CANNOT simply be treated as a darker Fitzpatrick type.
      • **Clean Skin:** Ensure the treatment area is perfectly clean. Inorganic sunscreens or foundations left on the skin may cause a loud "pop" when the laser is applied, signaling inadequate cleansing that can burn the surface.
      • **Shaving:** The area should be shaved to prevent surface hair from absorbing energy and burning.

      **Post-Treatment Care: The Healing Phase**
      Immediately after treatment, the area should be cooled with cool compresses or cold air to pull out residual heat.
      • **Wound Care:** With the epithelium injured, an antibiotic ointment or hydrogel dressing should be applied. 
      • **Blister Management:** If blisters form (which is common), patients must NOT pop, pick, or scratch them. Doing so opens the skin to severe infection and virtually guarantees a permanent scar.
      • **Hydration:** Patients should be instructed to drink 8-10 glasses of water daily. Proper hydration is critical to support the lymphatic system as it works to flush the shattered ink particles out of the body.
      • **Sun Protection:** The treated area is incredibly photosensitive. Strict sun avoidance and SPF 30-50 are mandatory to prevent post-inflammatory hyperpigmentation.
    `,
    questions: [
      {
        id: 'tat-7-1',
        text: "Why is it important for a patient to drink 8-10 glasses of water daily following a tattoo removal session?",
        options: [
          "To cool down their core body temperature.",
          "To support the lymphatic system in efficiently flushing out the shattered ink particles.",
          "To prevent the laser from dehydrating the epidermis."
        ],
        correctIndex: 1,
        explanation: "Hydration is essential for optimal lymphatic function, which is the system responsible for clearing the microscopic ink fragments from the body."
      },
      {
        id: 'tat-7-2',
        text: "If a patient comes in with a fresh, dark suntan over their tattoo, how should you proceed?",
        options: [
          "Increase the laser energy to push through the tan.",
          "Refuse treatment until the tan has completely faded (3-4 weeks minimum) to avoid severe burns and hypopigmentation.",
          "Reclassify them as a Fitzpatrick VI and proceed normally."
        ],
        correctIndex: 1,
        explanation: "Treating over a fresh tan is an absolute contraindication. The active surface melanin will absorb the laser energy, causing severe epidermal burns and pigment damage."
      }
    ]
  }
];

const CERTIFICATIONS = [
  {
    id: 'lhr',
    title: 'LHR Certifications',
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
    title: 'Laser Tattoo Removal (M22)',
    modules: TATTOO_MODULES,
    practical: [
      { id: 'tat-p1', label: 'Observed and Performed M22 QS Nd:YAG Startup & Safety (OD > 4.0 Eyewear)' },
      { id: 'tat-p2', label: 'Observed and Performed Device Calibration (Without Lens Assembly)' },
      { id: 'tat-p3', label: 'Observed and Performed Pre-Treatment Contraindication Screening (Tans, Gold Therapy, Double Tattoos)' },
      { id: 'tat-p4', label: 'Observed and Performed Test Patch with Minimum 30-min Wait Time' },
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
  const [activeModuleId, setActiveModuleId] = useState(LHR_MODULES[0].id);
  const [readingMode, setReadingMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizState, setQuizState] = useState({ submitted: false, passed: false });
  const [quizError, setQuizError] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Feedback State
  const [feedbackText, setFeedbackText] = useState('');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [feedbackQuote, setFeedbackQuote] = useState("");
  
  // Data State
  const [studentData, setStudentData] = useState({ theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, moduleFeedback: {}, quizPerformance: {} });
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
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error", err);
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
          setDoc(docRef, { theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, moduleFeedback: {}, quizPerformance: {} });
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

  // Sync Local Feedback Text when Module Changes
  useEffect(() => {
    if (studentData?.moduleFeedback?.[activeModuleId]) {
      setFeedbackText(studentData.moduleFeedback[activeModuleId]);
    } else {
      setFeedbackText('');
    }
  }, [activeModuleId, studentData.moduleFeedback]);

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
      // Sum all attempts across all modules the student has taken
      totalAttempts += (modulePerf.attempts || 0);
    });
  }

  // --- HANDLERS ---
  const handleLogin = (e, role) => {
    e.preventDefault();
    const nameInput = e.target.elements.name.value.trim();
    if (!nameInput) return;
    
    // Supervisor PIN Verification
    if (role === 'supervisor') {
      const pinInput = e.target.elements.pin.value;
      if (pinInput !== SUPERVISOR_ACCESS_PIN) {
        setLoginError('Incorrect Supervisor Access PIN.');
        return;
      }
    }
    
    setLoginError(''); // Clear any previous errors
    setCurrentUser({ name: nameInput, role });
    setActiveModuleId(LHR_MODULES[0].id); // Reset view
    setAppState(role === 'student' ? 'student-dash' : 'supervisor-dash');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStudentData({ theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, moduleFeedback: {}, quizPerformance: {} });
    setLoginError('');
    setReadingMode(false);
    setShowFeedbackSuccess(false);
    setAppState('login');
  };

  const selectModule = (id) => {
    setActiveModuleId(id);
    setShowFeedbackSuccess(false);
  };

  const handleCertChange = (certId) => {
    setActiveCertId(certId);
    const newCert = CERTIFICATIONS.find(c => c.id === certId);
    if (newCert && newCert.modules.length > 0) {
      selectModule(newCert.modules[0].id);
    }
  };

  const handleStartQuiz = () => {
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
    if (!currentUser || !db || !firebaseUser) return;
    if (Object.keys(answers).length < activeModule.questions.length) {
      setQuizError("Please answer all questions before checking your results.");
      return;
    }

    const wrongQuestionIds = activeModule.questions
      .filter(q => answers[q.id] !== q.correctIndex)
      .map(q => q.id);

    const allCorrect = wrongQuestionIds.length === 0;
    setQuizState({ submitted: true, passed: allCorrect });

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
    const currentStats = studentData.quizPerformance?.[activeModuleId] || { attempts: 0, mistakes: {} };
    const newAttempts = currentStats.attempts + 1;
    const newMistakes = { ...currentStats.mistakes };
    
    wrongQuestionIds.forEach(id => {
       newMistakes[id] = (newMistakes[id] || 0) + 1;
    });

    const updates = {
      [`quizPerformance.${activeModuleId}`]: {
         attempts: newAttempts,
         mistakes: newMistakes
      }
    };

    if (allCorrect) {
      updates[`theoreticalProgress.${activeModuleId}`] = 'passed';
    }

    try {
      await updateDoc(docRef, updates);
      setStudentData(prev => ({
        ...prev,
        theoreticalProgress: { 
           ...prev.theoreticalProgress, 
           ...(allCorrect ? { [activeModuleId]: 'passed' } : {}) 
        },
        quizPerformance: {
           ...prev.quizPerformance,
           [activeModuleId]: { attempts: newAttempts, mistakes: newMistakes }
        }
      }));
    } catch (err) {
      console.error("Error saving progress", err);
    }
  };

  const handleSaveFeedback = async () => {
    if (!currentUser || !db || !firebaseUser) return;
    setIsSavingFeedback(true);
    
    const quotes = [
      "Continuous improvement is better than delayed perfection. Your feedback helps our practice grow.",
      "Great leaders are always learning. Thank you for elevating our standard of care.",
      "The beautiful thing about learning is that no one can take it away from you.",
      "Knowledge shared is knowledge multiplied. Thank you for your insights!"
    ];
    
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
    try {
      await updateDoc(docRef, {
        [`moduleFeedback.${activeModuleId}`]: feedbackText
      });
      // Pick a random quote and show success screen
      setTimeout(() => {
        setFeedbackQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setIsSavingFeedback(false);
        setShowFeedbackSuccess(true);
      }, 600);
    } catch (err) {
      console.error("Error saving feedback", err);
      setIsSavingFeedback(false);
    }
  };

  const handleTogglePractical = async (id) => {
    if (isSignedOff) return; 
    if (!currentUser || !db || !firebaseUser) return;
    
    const newValue = !practicalChecklist[id];
    
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
    try {
      await updateDoc(docRef, {
        [`practicalChecklist.${id}`]: newValue
      });
      setStudentData(prev => ({
        ...prev,
        practicalChecklist: { ...prev.practicalChecklist, [id]: newValue }
      }));
    } catch (err) {
      console.error("Error saving practical item", err);
    }
    
  };

  const handleSupervisorSignoff = async () => {
    if (!currentUser || !db || !firebaseUser || !selectedStudentForSignoff) return;
    
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', selectedStudentForSignoff.id);
    try {
      await updateDoc(docRef, {
        [`signoffs.${activeCertId}`]: {
          status: true,
          by: currentUser.name,
          at: new Date().toISOString()
        }
      });
      setAppState('supervisor-dash');
      setSelectedStudentForSignoff(null);
    } catch (err) {
      console.error("Error signing off", err);
    }
  };

  // --- RENDERERS ---

  const renderLogin = () => (
    <div className="max-w-md mx-auto mt-12 bg-[#231C1A] rounded-3xl shadow-2xl border border-stone-800 overflow-hidden">
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
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full bg-white text-black px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8B4828] focus:border-[#8B4828] transition-colors" />
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
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full bg-white text-black px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors mb-4" />
            
            <label className="block text-sm font-semibold text-stone-300 mb-1.5">Access PIN</label>
            <input required type="password" name="pin" placeholder="Enter supervisor PIN..." className="w-full bg-white text-black px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors" />
            
            {loginError && (
              <p className="text-rose-400 text-sm font-semibold mt-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {loginError}
              </p>
            )}
          </div>
          <button type="submit" className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md mt-2">
            <ShieldCheck className="w-5 h-5"/> Login as Supervisor
          </button>
        </form>
      </div>
    </div>
  );

  const renderLuxeStudentDashboard = () => {
    const isPassedActive = theoreticalProgress[activeModule.id] === 'passed';

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
             <p className="text-[#e8d5cc] text-sm leading-relaxed relative z-10">Track onboarding, clinical education, policy reviews, and feedback in one polished dashboard.</p>
          </div>

          <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-4 shadow-lg flex flex-col gap-2">
            <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#171311] text-white font-bold border border-stone-800 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-[#d4b09e]"/> Dashboard
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl text-stone-400 hover:bg-[#302624] hover:text-white font-medium transition-colors">
              <GraduationCap className="w-5 h-5"/> Courses
            </button>
            <button onClick={() => { if(isSignedOff) setAppState('certificate'); window.scrollTo(0,0); }} className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${isSignedOff ? 'text-[#f5dbce] bg-[#8B4828]/20 border border-[#8B4828]/30' : 'text-stone-400 hover:bg-[#302624] hover:text-white'}`}>
              <CheckCircle className={`w-5 h-5 ${isSignedOff ? 'text-[#d4b09e]' : ''}`}/> Completion Status
            </button>
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
          <div className="bg-[#8B4828] rounded-3xl p-8 text-white shadow-lg block md:hidden">
             <p className="text-xs font-bold text-[#f5dbce] uppercase tracking-wider mb-2">EMPLOYEE PORTAL</p>
             <h2 className="text-3xl font-bold mb-3">SELFishly Training</h2>
          </div>

          {/* Certification Track Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {CERTIFICATIONS.map(cert => (
              <button
                key={cert.id}
                onClick={() => handleCertChange(cert.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${activeCertId === cert.id ? 'bg-[#8B4828] text-white border-[#8B4828]' : 'bg-[#231C1A] border-stone-800 text-stone-400 hover:text-white hover:bg-[#302624]'}`}
              >
                {cert.title}
              </button>
            ))}
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

          {isSignedOff ? (
            <div className="bg-[#171311] border border-stone-800 rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-[#231C1A] border border-stone-800 p-3 rounded-full shadow-inner"><Award className="w-8 h-8 text-[#d4b09e]" /></div>
                <div>
                  <h3 className="font-bold text-lg text-white">Certification Complete</h3>
                  <p className="text-stone-400 text-xs mt-1">Signed off by {currentSignoff.by} on {new Date(currentSignoff.at).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => { setAppState('certificate'); window.scrollTo(0,0); }} className="w-full sm:w-auto bg-[#8B4828] hover:bg-[#a85a36] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md">
                <Printer className="w-4 h-4"/> View Certificate
              </button>
            </div>
          ) : isFullyReadyForSignoff ? (
            <div className="bg-[#1c221e] border border-emerald-900/50 rounded-3xl p-6 flex items-start gap-4 shadow-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-300 text-lg">Ready for Supervisor Sign-Off</h3>
                <p className="text-sm text-emerald-100/70 mt-1.5 leading-relaxed">You have completed all theoretical modules and practical requirements for this track. Please notify your clinical supervisor to review your profile.</p>
              </div>
            </div>
          ) : null}

          {/* Module List */}
          <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Training Modules</h3>
                <p className="text-sm text-stone-400">Select a module to view materials.</p>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input type="text" placeholder="Search..." className="w-full sm:w-64 bg-[#171311] text-white placeholder-stone-600 pl-11 pr-4 py-3 rounded-full border border-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4828] transition-all" />
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
                      isActive ? 'border-[#8B4828] bg-[#2e1d16] shadow-md' : 'border-stone-800 bg-[#171311] hover:border-[#4d3a33] hover:bg-[#1f1917]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-bold text-[15px] mb-1.5 transition-colors ${isActive ? 'text-[#f5dbce]' : 'text-stone-200 group-hover:text-white'}`}>{module.title}</h4>
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

        {/* RIGHT PANEL - Now Viewing, Checklist & Feedback */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          
          {/* 1. Now Viewing Card */}
          <div className="bg-[#171311] border border-stone-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
               {React.cloneElement(activeModule.icon, { className: "w-32 h-32" })}
             </div>
             
             <div className="flex items-center gap-2 text-[10px] font-bold text-[#d4b09e] uppercase tracking-widest mb-3 relative z-10">
               <BookOpen className="w-3.5 h-3.5"/> Now Viewing
             </div>
             <h3 className="text-xl font-bold mb-4 leading-tight pr-4 relative z-10 text-white">{activeModule.title}</h3>
             
             <div className="mb-6 relative z-10">
               <div className="flex justify-between text-xs font-bold text-stone-500 mb-2">
                 <span>{isPassedActive ? '100% complete' : 'Ready to begin'}</span>
                 {isPassedActive && <CheckCircle className="w-4 h-4 text-emerald-500" />}
               </div>
               <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                 <div className={`h-full ${isPassedActive ? 'bg-[#d4b09e] w-full' : 'bg-stone-600 w-1/12'}`}></div>
               </div>
             </div>

             <button 
               onClick={() => setReadingMode(true)} 
               className="w-full bg-[#8B4828] hover:bg-[#a85a36] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg relative z-10"
             >
               <Play className="w-4 h-4" fill="currentColor" /> {isPassedActive ? 'Review Lesson' : 'Start Reading'}
             </button>
          </div>

          {/* 2. Practical Checklist */}
          <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-[#8B4828]"/> Practical Tasks</h3>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-stone-400">Complete with supervisor.</p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#171311] text-stone-300 border border-stone-800">
                {completedPracticalCount} / {totalPractical}
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {activeCert.practical.map((item) => {
                const isChecked = practicalChecklist[item.id] === true;
                return (
                  <label key={item.id} className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${isSignedOff ? 'opacity-50 cursor-default' : 'cursor-pointer'} ${isChecked ? 'bg-[#171311] border-[#8B4828]/50' : 'bg-[#171311] border-stone-800 hover:border-stone-700'}`}>
                    <div className="pt-0.5">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-[#8B4828] bg-[#231C1A] rounded border-stone-700 focus:ring-[#8B4828] focus:ring-offset-[#171311]" 
                        checked={isChecked}
                        onChange={() => handleTogglePractical(item.id)}
                        disabled={isSignedOff}
                      />
                    </div>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'text-white font-semibold' : 'text-stone-400'}`}>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Module Feedback */}
          <div className="bg-[#231C1A] border border-stone-800 rounded-3xl p-6 shadow-lg">
             <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#8B4828]"/> Module Feedback</h3>
             
             {showFeedbackSuccess ? (
               <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="mx-auto w-12 h-12 bg-emerald-950/30 rounded-full flex items-center justify-center mb-4 border border-emerald-900/50">
                     <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="text-white font-bold mb-2 tracking-wide">Feedback Saved!</h4>
                  <p className="text-[#d4b09e] text-sm italic font-serif leading-relaxed mb-6 px-2">
                    "{feedbackQuote}"
                  </p>
                  <button 
                     onClick={() => setShowFeedbackSuccess(false)}
                     className="text-xs font-bold text-stone-400 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Edit or Add More Feedback
                  </button>
               </div>
             ) : (
               <>
                 <p className="text-xs text-stone-400 mb-4">Leave notes, questions, or feedback regarding <span className="text-stone-300 font-medium">"{activeModule.title}"</span> for your supervisor.</p>
                 
                 <textarea 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Type your notes here..."
                    className="w-full bg-[#171311] text-white placeholder-stone-600 border border-stone-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4828] transition-all min-h-[120px] resize-none mb-4"
                 />
                 <button 
                    onClick={handleSaveFeedback}
                    disabled={isSavingFeedback || !feedbackText.trim()}
                    className="w-full bg-[#171311] border border-stone-700 hover:border-stone-500 text-white py-3 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                 >
                    {isSavingFeedback ? <Activity className="w-4 h-4 animate-spin"/> : 'Save Feedback'}
                 </button>
               </>
             )}
          </div>

        </div>

      </div>
    );
  };

  const ReadingModal = () => {
    if (!readingMode || !activeModule) return null;
    const isPassedActive = theoreticalProgress[activeModule.id] === 'passed';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setReadingMode(false)}></div>
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
            <button onClick={() => setReadingMode(false)} className="p-2.5 bg-[#171311] hover:bg-stone-800 border border-stone-800 rounded-full transition-colors flex-shrink-0">
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
              <button onClick={() => setReadingMode(false)} className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg">
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
              <button onClick={() => { setAppState('student-dash'); setActiveModuleId(LHR_MODULES[0].id); }} className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">Complete Module</button>
            ) : (
              <button onClick={handleStartQuiz} className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">Retry Quiz</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupervisorDashboard = () => (
    <div className="max-w-[1400px] mx-auto space-y-6 mt-8 px-4 sm:px-6">
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {CERTIFICATIONS.map(cert => (
          <button
            key={cert.id}
            onClick={() => { setActiveCertId(cert.id); setExpandedStudentId(null); }}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${activeCertId === cert.id ? 'bg-[#8B4828] text-white border-[#8B4828]' : 'bg-[#231C1A] border-stone-800 text-stone-400 hover:text-white hover:bg-[#302624]'}`}
          >
            {cert.title}
          </button>
        ))}
      </div>

      <div className="bg-[#171311] border border-stone-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <ShieldCheck className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 bg-[#231C1A] rounded-2xl border border-stone-800">
            <ShieldCheck className="w-10 h-10 text-[#d4b09e]" />
          </div>
          <div>
            <p className="text-[#8B4828] text-[10px] font-bold uppercase tracking-widest mb-1.5">Management Portal</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Clinical Supervisor Dashboard</h1>
            <p className="text-stone-400 mt-2 text-sm sm:text-base">Welcome, {currentUser.name}. Review and certify your staff for <span className="font-bold text-white">{activeCert.title}</span> below.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#231C1A] rounded-3xl shadow-xl border border-stone-800 overflow-hidden">
        <div className="px-8 py-6 border-b border-stone-800 bg-[#171311] flex items-center gap-3">
          <Users className="w-5 h-5 text-[#d4b09e]" />
          <h2 className="font-bold text-white text-lg tracking-wide">Student Roster</h2>
        </div>
        
        {allStudents.length === 0 ? (
          <div className="p-16 text-center text-stone-500 font-medium">No students have registered yet.</div>
        ) : (
          <div className="divide-y divide-stone-800/50">
            {allStudents.map(student => {
              const s_theoCount = activeCert.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length;
              const s_pracCount = activeCert.practical.filter(p => (student.practicalChecklist || {})[p.id] === true).length;
              
              const s_currentSignoff = student.signoffs?.[activeCertId];
              const s_isSignedOff = !!s_currentSignoff;

              const isReady = s_theoCount === totalModules && s_pracCount === totalPractical && !s_isSignedOff;
              const isExpanded = expandedStudentId === student.id;
              
              return (
                <div key={student.id} className="overflow-hidden">
                  <div 
                    onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    className={`p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${isExpanded ? 'bg-[#302624]' : 'hover:bg-[#302624]'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-2 bg-[#171311] rounded-lg border border-stone-800">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white tracking-tight">{student.id}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Theory: <span className="text-white">{s_theoCount}/{totalModules}</span></span>
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Practical: <span className="text-white">{s_pracCount}/{totalPractical}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                      {s_isSignedOff ? (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171311] text-emerald-400 text-sm font-bold border border-stone-800 shadow-inner">
                          <CheckCircle className="w-4 h-4"/> Certified
                        </span>
                      ) : isReady ? (
                        <button 
                          onClick={() => { setSelectedStudentForSignoff(student); setAppState('signoff'); window.scrollTo(0,0); }}
                          className="bg-[#8B4828] hover:bg-[#a85a36] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                          Review & Sign Off
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171311] text-stone-500 text-sm font-bold border border-stone-800">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6 sm:px-8 bg-[#171311] border-t border-stone-800 shadow-inner">
                      <h4 className="font-bold text-white mb-5 flex items-center gap-2 tracking-wide">
                        <MessageCircle className="w-5 h-5 text-[#8B4828]"/> Module Feedback & Status
                      </h4>
                      <div className="grid gap-5 md:grid-cols-2">
                        {activeCert.modules.map(mod => {
                          const isPassed = student.theoreticalProgress?.[mod.id] === 'passed';
                          const feedback = student.moduleFeedback?.[mod.id];
                          
                          return (
                            <div key={mod.id} className="bg-[#231C1A] p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <span className="font-bold text-white text-sm pr-3 leading-snug">{mod.title}</span>
                                  {isPassed ? (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-900/20 text-emerald-400 uppercase tracking-wider border border-emerald-900/30">Read</span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#171311] text-stone-500 uppercase tracking-wider border border-stone-800">Pending</span>
                                  )}
                                </div>
                                {feedback ? (
                                  <div className="mt-3 bg-[#171311] p-3.5 rounded-xl border border-stone-800/50 relative">
                                    <span className="text-[#8B4828] font-serif text-3xl absolute top-1 left-2 opacity-50">"</span>
                                    <p className="text-sm text-stone-300 leading-relaxed relative z-10 pl-4">{feedback}</p>
                                  </div>
                                ) : (
                                  <div className="mt-3 pt-3 border-t border-stone-800/50">
                                    <span className="text-xs text-stone-600 italic">No feedback provided for this module.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderSupervisorSignoff = () => {
    if (!selectedStudentForSignoff) return null;
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-12 px-4">
        <button onClick={() => setAppState('supervisor-dash')} className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors px-2">
          <ArrowLeft className="w-4 h-4" /> Back to Roster
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
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> All {totalModules} Theoretical Modules Passed</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> All {totalPractical} Hands-on Practical Items Checked</li>
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

  const renderCertificate = () => (
    <div className="max-w-4xl mx-auto space-y-6 mt-8">
      <div className="flex justify-between items-center print:hidden px-4">
        <button onClick={() => setAppState('student-dash')} className="flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        {/* Certificate remains light-themed for actual printing purposes */}
        <button onClick={() => window.print()} className="bg-white hover:bg-stone-200 text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Printer className="w-4 h-4"/> Print Certificate
        </button>
      </div>
      
      {/* We force this specific card to be bright/white so it looks like a real paper certificate, even in the dark app theme */}
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
          <span className="hidden sm:inline-flex px-4 py-1.5 bg-[#171311] text-stone-400 rounded-full text-[10px] uppercase tracking-widest font-bold border border-stone-800">
            Preview Mode
          </span>
          {currentUser && (
            <div className="flex items-center gap-4 border-l border-stone-800 pl-5">
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