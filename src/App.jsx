import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Circle, BookOpen, ShieldCheck, AlertTriangle, 
  Award, ArrowRight, ArrowLeft, Activity, UserCheck, FileSignature, 
  Zap, MessageCircle, AlertOctagon, Smile, Frown, ClipboardList,
  User, CheckSquare, Printer, Users, LogOut, ChevronDown, ChevronUp
} from 'lucide-react';

// --- FIREBASE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

let app, auth, db, appId;
try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  }
} catch (e) {
  console.warn("Firebase not initialized. Running in local mode.");
}

// 🔒 CHANGE THIS TO YOUR CLINIC'S SECRET SUPERVISOR PIN 🔒
const SUPERVISOR_ACCESS_PIN = "2790";

// --- MOCK DATA ---
const TRAINING_MODULES = [
  {
    id: 1,
    title: "Foundations of Laser Hair Removal",
    icon: <Zap className="w-6 h-6 text-amber-900" />,
    description: "Learn the core mechanism of selective photothermolysis and parameter interaction.",
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

      **Basic Delivery Modes: Continuous Wave vs. Pulsing**
      • **Continuous Wave (CW):** The laser is on continuously. It delivers a high photon flux quickly, meaning shorter treatment times, but poses a higher risk of heating the skin when high power density is needed.
      • **Pulsing:** Alternates time on and time off (e.g., 50% duty cycle). Because the beam is intermittently off, total heating is reduced, making it safer for darker skin types. The tradeoff is longer treatment times because the average power is lower.
      • **Superpulse:** Extremely short on-times (often nanoseconds) with high peak power. It allows high peak irradiance in deep structures without surface burns because the tissue doesn't have time to heat up. However, the average energy delivery remains low, leading to longer treatment sessions.
    `,
    questions: [
      {
        id: '1-1',
        text: "Using only wavelength, without adjusting fluence, pulse duration, spot size, or cooling, is sufficient to achieve safe and effective laser hair removal for every patient.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "The lesson clearly states multiple interacting parameters and operator technique are required for safe, effective results. You cannot rely on wavelength alone."
      },
      {
        id: '1-2',
        text: "Which statement best summarizes how wavelength fits into selecting parameters for laser hair removal?",
        options: [
          "Wavelength choice is irrelevant when using cooling and high fluence because cooling fully prevents epidermal absorption.",
          "Wavelength only affects skin safety and has no influence on depth or follicle targeting.",
          "Wavelength determines depth and target specificity but must be combined with fluence, pulse duration, spot size, and cooling to achieve safe and effective hair removal.",
          "Wavelength alone is sufficient to ensure safe and effective hair removal for every patient."
        ],
        correctIndex: 2,
        explanation: "The lesson states wavelength sets penetration and specificity but explicitly explains no single parameter is sufficient; safe, effective treatment requires combining wavelength with other parameters and cooling."
      },
      {
        id: '1-3',
        text: "Superpulse lasers always produce shorter treatment sessions than continuous wave lasers because their high peak power delivers energy more quickly.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. A drawback of superpulse devices is that their extremely short on-time limits the total amount of energy delivered per unit time. Because the average energy delivery can be low, treatment times are often longer."
      },
      {
        id: '1-4',
        text: "Which statement best describes why superpulse laser delivery can avoid skin burns while producing high peak irradiance?",
        options: [
          "Superpulse delivery uses very slow pulsing frequency so surface tissue can cool completely between pulses.",
          "Superpulse lasers increase average power but spread energy over a larger spot size to prevent burns.",
          "Superpulse lasers keep the beam on continuously but reduce the laser wavelength to prevent heating.",
          "Superpulse lasers can deliver very high peak power while keeping average power low, which helps avoid surface burns despite high instantaneous irradiance."
        ],
        correctIndex: 3,
        explanation: "Superpulse enables very high peak irradiance with minimal surface heating because of the extremely short pulses. The surface tissue simply has insufficient time to heat up."
      },
      {
        id: '1-5',
        text: "Permanent hair removal works mainly by heating the subcutaneous fat layer beneath the dermis to destroy hair follicles.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. While the subcutaneous fat is part of the skin system, the key region for hair removal is the dermis, where the follicles and roots sit."
      },
      {
        id: '1-6',
        text: "Which statement best describes the primary mechanism by which lasers and IPL produce long-term hair reduction?",
        options: [
          "Light energy is absorbed by melanin in the hair and converted to heat that damages the follicle and its blood supply.",
          "They stimulate the epidermis to produce hormones that prevent hair growth.",
          "They heat the subcutaneous fat beneath the dermis to destroy hair follicles.",
          "They chemically dissolve the hair shaft so follicles stop producing hair."
        ],
        correctIndex: 0,
        explanation: "The light seeks the chromophore (melanin). This absorbed light converts to heat, which travels down to damage the bulb and the structures (blood supply) that nourish the hair."
      },
      {
        id: '1-7',
        text: "If you keep the laser's power and application time exactly the same, but switch to a smaller spot size (beam area), what happens to the fluence?",
        options: [
          "It decreases.",
          "It stays exactly the same.",
          "It increases.",
          "It drops to zero."
        ],
        correctIndex: 2,
        explanation: "Because fluence is energy divided by area, concentrating the same amount of energy into a smaller area results in a higher energy density (increased fluence)."
      },
      {
        id: '1-8',
        text: "What is the main difference between Joules (J) and Fluence (J/cm²)?",
        options: [
          "They are exactly the same thing and can be used interchangeably.",
          "Joules measure total energy delivered, while Fluence measures energy per unit area.",
          "Fluence measures total energy delivered, while Joules measure energy per unit area.",
          "Joules measure application time, while Fluence measures the wavelength."
        ],
        correctIndex: 1,
        explanation: "Joules (J) represent the actual total amount of heat energy delivered to the tissue to produce a biological effect. Fluence (J/cm²) is just how densely that energy is packed into a specific area."
      },
      {
        id: '1-9',
        text: "Blue and green wavelengths can reliably penetrate to hair follicle depth and are the best choice for permanent hair removal.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. Blue and green wavelengths are mostly absorbed in the superficial skin layers. Red and near-infrared wavelengths (like 755nm or 1064nm) are required to reach the deep dermis where hair follicles reside."
      },
      {
        id: '1-10',
        text: "Based on the lesson, which wavelength range is most appropriate for reliably reaching and denaturing hair follicle germ cells?",
        options: [
          "Any wavelength will work equally if high fluence is used.",
          "Green-yellow wavelengths designed for deep dermal targets.",
          "Red or near-infrared wavelengths (e.g., 755–1064 nm) are used because they penetrate deeply enough to reach hair follicle germ cells.",
          "Blue light wavelengths that are absorbed mainly in the epidermis."
        ],
        correctIndex: 2,
        explanation: "Because hair follicles are deep targets, you must use wavelengths that penetrate to follicular depth—generally red or near-IR light, such as 755nm or 1064nm."
      },
      {
        id: '1-11',
        text: "Gray or white hair is an excellent target for standard laser hair removal because it contains high melanin concentration.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. Gray or white hair lacks the necessary melanin (the target chromophore) for the laser to absorb and convert to heat, making it a poor target."
      },
      {
        id: '1-12',
        text: "According to the lesson, which wavelength range is most effective for targeting melanin in hair during laser hair removal?",
        options: [
          "Wavelengths greater than 1,500 nm (mid-infrared).",
          "Any wavelength is equally effective if fluence is increased sufficiently.",
          "Lasers with wavelengths between about 700 and 1,000 nm target melanin in the hair and are therefore commonly used for hair removal.",
          "Wavelengths under 500 nm (visible blue-green light)."
        ],
        correctIndex: 2,
        explanation: "Wavelengths between 700 and 1,000 nm are selectively absorbed by melanin in the hair shaft, while competing chromophores like water and blood absorb far less energy at these ranges."
      }
    ]
  },
  {
    id: 2,
    title: "SplendorX: Device Operation & BLEND X",
    icon: <Activity className="w-6 h-6 text-black" />,
    description: "Mastering the SplendorX interface, pulse duration, and safe handpiece operation.",
    content: `
      **BLEND X Technology & Wavelength Customization**
      The SplendorX features proprietary BLEND X technology, which allows for the synchronized, simultaneous emission of both Alexandrite (755nm) and Nd:YAG (1064nm) from a single handpiece. 
      Using the Blend Mode, you must adjust the ratios based on the patient's Fitzpatrick skin type:
      • **Skin Types I-II (Fair):** You will rely heavily on Alexandrite (e.g., 75% Alex / 25% Nd:YAG).
      • **Skin Types III-IV (Medium/Olive):** Often utilize a balanced 50/50 mix.
      • **Skin Types V-VI (Dark):** You must protect the epidermis by dropping the Alex significantly. You will use mostly or entirely Nd:YAG (e.g., 75% to 100% Nd:YAG) to safely target the deep root without burning the surface skin.

      **Pulse Duration (Pulse Width): The Timing of Heat**
      Pulse duration is the length of time the laser delivers energy to tissue, typically measured in milliseconds (ms). It determines how energy is distributed over time. 
      • **Short pulse durations:** Deliver energy very quickly. Often used for lighter phototypes or thick, coarse hair where rapid heating is effective. 
      • **Long pulse durations:** Spread the same energy over a longer time. For darker phototypes (Fitzpatrick IV–VI), longer pulse durations (e.g., >100 ms) are preferred to safely heat the follicle while reducing peak epidermal temperature, lowering the risk of burns.
      *Beware:* Devices that combine short pulses with high fluence without allowing you to adjust them manually can increase adverse effects. Delivering 20 J/cm² in 400 ms behaves very differently than 20 J/cm² in 20 ms. 
      *Note on Frequency (Hz):* Changing repetition frequency affects pulse duration. Lowering the frequency usually allows the device to lengthen the pulse width, while increasing frequency can force the machine to shorten the pulse width to fit the timing constraints.

      **Clinical Strategy: High vs. Low Contrast**
      High contrast between hair color and skin color (dark hair on light skin) is the classical ideal scenario. In such cases, you can often achieve good results using moderate fluence and variable pulse widths.
      For fine or lighter hair, it can help to use higher fluences but with longer pulses and/or adjusted repetition rates to keep epidermal risk low.
      When treating darker phototypes (IV–VI) where contrast is low, the safest approach often uses longer pulse durations and conservative fluences. You may need a more gradual protocol to avoid thermal injury to the epidermis.

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
          "Rely mostly or entirely on Nd:YAG (1064nm), such as a 75% or 100% Nd:YAG ratio, to bypass epidermal melanin and prevent burns.",
          "Use a very fast pulsing frequency with 100% Alexandrite."
        ],
        correctIndex: 2,
        explanation: "Correct! Nd:YAG (1064nm) is much safer for Skin Types V and VI because it has lower melanin absorption and penetrates deeper, bypassing the pigment in the epidermis."
      },
      {
        id: '2-2',
        text: "When changing the physical tip on the SplendorX handpiece to a different size, what MUST the operator do to prevent patient injury?",
        options: [
          "Nothing, the machine automatically detects the new spot size via a microchip.",
          "Manually update the screen to perfectly match the new spot size and shape, because the machine does NOT have automatic spot recognition.",
          "Turn the machine off and leave it off for 10 minutes to recalibrate.",
          "Increase the cooling to maximum level before firing."
        ],
        correctIndex: 1,
        explanation: "Absolutely critical! The SplendorX does not know what tip is attached. You must manually verify that the screen settings match the physical tip to prevent delivering dangerously high fluence."
      },
      {
        id: '2-3',
        text: "When using the Square Spot tip on the SplendorX, how much should you overlap your pulses?",
        options: [
          "10% to 15% overlap.",
          "50% overlap.",
          "0% overlap (No overlapping).",
          "It doesn't matter, you can overlap as much as you want."
        ],
        correctIndex: 2,
        explanation: "Correct! The major advantage of the square spot is that it can be stacked edge-to-edge in a grid. Overlapping square spots will double the delivered energy and cause burns."
      },
      {
        id: '2-4',
        text: "In 'Alexandrite + Nd:YAG' (Blend) mode, how does the SplendorX deliver the two different wavelengths?",
        options: [
          "It alternates them: one pulse is Alex, the next pulse is Nd:YAG.",
          "It fires both wavelengths simultaneously in a synchronized emission.",
          "It fires Alexandrite first, waits 5 seconds, then fires Nd:YAG.",
          "It randomly selects which one to fire based on the hair color."
        ],
        correctIndex: 1,
        explanation: "The proprietary BLEND X technology allows the machine to fire both the 755nm and 1064nm wavelengths at the exact same time."
      },
      {
        id: '2-5',
        text: "If a laser device does not allow manual adjustment of pulse duration, you still retain full control to optimize safety and efficacy for all skin phototypes and hair types.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. If a device locks or auto-selects pulse width without manual override, you lose a crucial parameter needed to balance safety (epidermal protection) and efficacy (follicular heating) for diverse client profiles."
      },
      {
        id: '2-6',
        text: "According to the lesson, what is the consequence of using a laser hair removal device that does not allow manual adjustment of pulse duration?",
        options: [
          "If a device does not allow manual adjustment of pulse duration, you lose an important control needed to optimize safety and efficacy for different clients.",
          "Only treatment speed is affected; safety and efficacy remain unchanged.",
          "You can still fully optimize treatment for all clients because fluence alone determines clinical outcomes.",
          "Device wavelength automatically compensates for the lack of pulse duration control, so no adjustment is needed."
        ],
        correctIndex: 0,
        explanation: "Pulse duration controls how fast energy is delivered. Without manual control, you cannot safely adapt the thermal dynamics for highly varied hair thicknesses and darker skin types."
      }
    ]
  },
  {
    id: 3,
    title: "Skin Anatomy, Fitzpatrick Types & Conditions",
    icon: <BookOpen className="w-6 h-6 text-stone-800" />,
    description: "Deep dive into skin anatomy, ethnic skin typing, and treating over skin conditions.",
    content: `
      **Hair Anatomy & The Target**
      Before explaining how permanent hair removal is achieved, it’s essential to understand how hair forms. The skin has distinct layers: the epidermis *(the protective outer shield)*, the dermis *(the middle layer where follicles, glands, and blood vessels live)*, and subcutaneous fat. For hair removal, the key region is the dermis.
      The visible hair shaft is only part of the structure. Beneath the surface is the root and bulb complex. Thin, fine hairs (vellus hair) have smaller follicles and blood supply. Thick, coarse hairs (terminal hair) have larger follicles and greater vascularization—like a large tree with a large root system. Larger roots mean more melanin to target.

      **Follicular Edema & Immediate Clinical Signs**
      One useful indicator of effective follicular damage is a visible immediate reaction in the treated hair follicle: a perifollicular edema (swelling) or a change in the hair appearance where the hair shaft seems more easily extractable or appears singed inside the follicle. 
      These signs suggest that the follicle received a sufficient thermal insult. Many devices on the market do not consistently produce this immediate perifollicular reaction because their combination of pulse width and fluence is not optimized for the client’s hair and skin type. When you see good perifollicular edema immediately after treatment, that often correlates with better medium-term hair reduction results.

      **Understanding the Fitzpatrick Scale**
      Developed in 1975 by dermatologist Thomas B. Fitzpatrick, this numerical classification describes human skin color based on pigment and response to UV light. It acts as a reference point to gauge how well someone tolerates sun and light exposure. Modern lasers adapt their settings according to this scale to ensure safe operational levels. The key principle is contrast: the device focuses on the darker pigment (the hair), allowing heat to be delivered preferentially to the hair shaft.

      **Mastering the Fitzpatrick Scale & Ethnic Skin**
      Properly classifying a patient's skin type is the most critical safety step. Do not just look at their current skin color; consider their ethnic background (the Lancer Ethnicity Scale) and how they react to the sun.
      • **Type I & II:** Fair/light skin, light eyes. Highly sun-sensitive, always burns, never or rarely tans. (Generally safe for 755nm Alexandrite).
      • **Type III:** Olive skin, dark hair, Mediterranean background. Sometimes burns but tans evenly. (Safe for Alexandrite or a Blend).
      • **Type IV (Olive / Hispanic / Asian):** Medium brown skin. *Provider Trap!* Many patients of East Asian descent appear very fair and might classify themselves as a Type II. However, Asian skin has highly reactive melanocytes. Even if they look pale, you MUST treat them cautiously (often as a Type IV) because they are highly prone to Post-Inflammatory Hyperpigmentation (PIH) from laser heat.
      • **Type V & VI (Brown to Black):** Deep brown to black skin, Afro-Caribbean or African background (e.g., Will Smith). Sun-insensitive, never burns. Abundant epidermal melanin. **You must rely heavily or entirely on Nd:YAG (1064nm)** to bypass the epidermis and prevent severe burns or permanent hypopigmentation. The 1064 nm Nd:YAG laser is the preferred and safest choice for darker skin tones.

      **Consultation, Patch Testing & Scheduling**
      A thorough consultation and patch test are critical. The patch test involves marking a small area (approx. 3 × 5 cm) and applying the laser. If no negative reaction occurs, the first full treatment can proceed. Treatments are usually spaced about six weeks apart, typically requiring six to twelve sessions for optimal 80-90% reduction. This offers long-term cost and time savings compared to the temporary results of waxing and shaving.

      **Common Skin Conditions in the Laser Room**
      • **"Strawberry Skin" (Keratosis Pilaris):** Patients often complain of tiny dark dots or rough bumps on their legs or arms. This is caused by excess keratin trapping dead skin and hair inside the follicle. *Good news:* Laser hair removal is one of the best treatments for this! By destroying the hair follicle, you eliminate the pocket where the keratin gets trapped, smoothing the skin over time.
      • **Pseudofolliculitis Barbae (PFB):** Severe razor bumps/ingrown hairs, common on the neck or bikini line. LHR is the gold standard cure for this condition.
      • **Melasma:** Patches of hyperpigmentation, often on the upper lip or cheeks, triggered by hormones and heat. *Warning:* Do NOT treat directly over active melasma with high heat, as the thermal energy from the laser can stimulate the melanocytes and make the melasma much darker.
      • **Herpes Simplex (Cold Sores):** The heat from the laser can trigger a viral flare-up. If treating the upper lip, chin, or bikini on a patient with a history of HSV, they must be pre-medicated with an antiviral (like Valacyclovir) by your medical director prior to their session.
    `,
    questions: [
      {
        id: '3-1',
        text: "Which Fitzpatrick skin types can be safely treated using the SplendorX?",
        options: ["Types I-III only", "Types IV-VI only", "Types I-IV only", "All Types I-VI"],
        correctIndex: 3,
        explanation: "Because it utilizes both Alexandrite and Nd:YAG, the SplendorX can be safely customized to treat the entire Fitzpatrick spectrum (I-VI)."
      },
      {
        id: '3-2',
        text: "When treating a patient with Fitzpatrick Type VI skin, which wavelength should be the primary or exclusive setting?",
        options: [
          "Alexandrite (755nm)",
          "Nd:YAG (1064nm)",
          "A 50/50 mix of both",
          "None of the above"
        ],
        correctIndex: 1,
        explanation: "Nd:YAG (1064nm) has lower melanin absorption and penetrates deeper, bypassing the epidermal melanin in darker skin tones. This protects Type VI skin from severe burns."
      },
      {
        id: '3-3',
        text: "A patient of East Asian descent comes in for treatment. Her skin appears very fair and she says she burns easily in the sun. Why should you still exercise extreme caution and likely treat her as a Fitzpatrick Type IV?",
        options: [
          "Because fair skin absorbs more heat than dark skin.",
          "Because Asian skin types have highly reactive melanocytes and are extremely prone to Post-Inflammatory Hyperpigmentation (PIH) from heat.",
          "Because her hair is likely too light for the laser to see.",
          "Because Alexandrite lasers do not work on fair skin."
        ],
        correctIndex: 1,
        explanation: "This is a classic provider trap. Despite appearing pale, Asian skin behaves like a Type IV under laser heat. The melanocytes are highly reactive and will trigger PIH if treated too aggressively with Alexandrite."
      },
      {
        id: '3-4',
        text: "A patient is embarrassed to get laser on her legs because she has 'Strawberry Skin' (Keratosis Pilaris). How should you advise her?",
        options: [
          "Tell her laser hair removal will make the bumps much worse.",
          "Tell her you cannot treat her until she sees a dermatologist to cure it.",
          "Assure her that laser hair removal is actually an excellent treatment for Keratosis Pilaris, because destroying the follicle removes the structure where keratin gets trapped.",
          "Tell her you must use the highest possible fluence to burn the bumps off."
        ],
        correctIndex: 2,
        explanation: "Laser hair removal is a fantastic solution for KP! Once the hair follicle is permanently destroyed, the keratin has nowhere to get trapped, leading to much smoother skin."
      },
      {
        id: '3-5',
        text: "A patient wants laser hair removal on her upper lip, but she has a dark patch of Melasma in that exact area. What is the clinical risk?",
        options: [
          "The laser will permanently cure the melasma.",
          "The thermal heat from the laser can stimulate the melanocytes and cause the melasma to become much darker.",
          "The laser will turn the melasma white (hypopigmentation).",
          "There is no risk; melasma does not react to lasers."
        ],
        correctIndex: 1,
        explanation: "Melasma is highly sensitive to heat. Firing a hair removal laser over active melasma can easily trigger it to darken significantly. You must proceed with extreme caution or avoid treating directly over the patches."
      },
      {
        id: '3-6',
        text: "Immediately after treating a patient's legs, you notice small, hive-like bumps forming exactly around the hair follicles (Perifollicular Edema). What does this indicate?",
        options: [
          "The patient is having an allergic reaction to the laser.",
          "A second-degree burn is forming, indicating the fluence was too high.",
          "A normal, desired clinical endpoint showing the follicle received a sufficient thermal insult.",
          "The cooling system has failed and must be checked."
        ],
        correctIndex: 2,
        explanation: "Perifollicular Edema (PFE) is exactly what you want to see! The localized swelling means the heat successfully disrupted the targeted hair follicle, which correlates with better medium-term hair reduction results."
      },
      {
        id: '3-7',
        text: "Clinicians use the Fitzpatrick scale to help choose appropriate laser settings to make laser hair removal safer and more effective.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "True. The Fitzpatrick scale is an essential reference point to gauge sun and light tolerance, guiding clinicians in selecting safe parameters to avoid adverse reactions."
      },
      {
        id: '3-8',
        text: "According to the lesson, what is the primary purpose of performing a patch test before full laser hair removal treatment?",
        options: [
          "To select the client’s foundation shade for cosmetic matching during treatment.",
          "To determine the exact number of full treatment sessions needed for complete hair removal.",
          "To permanently remove all hair from the test area before starting full treatment.",
          "A patch test treats a small area with the laser to check for adverse reactions before full treatment."
        ],
        correctIndex: 3,
        explanation: "A patch test (typically an area of 3x5 cm) allows the provider to test the selected settings on the patient's skin to ensure they can safely tolerate the treatment before proceeding with a full session."
      },
      {
        id: '3-9',
        text: "The 1064 nm Nd:YAG laser is the preferred and safest choice for darker skin tones (Fitzpatrick Types V and VI).",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "True. The Nd:YAG 1064nm wavelength penetrates deeply and has the lowest epidermal melanin absorption, bypassing the surface skin to safely target the deep hair bulb on darker skin tones."
      },
      {
        id: '3-10',
        text: "Which laser wavelength is primarily recommended for Fitzpatrick skin types V and VI due to its safety profile?",
        options: [
          "755 nm Diode",
          "755 nm Alexandrite",
          "810 nm Diode",
          "1064 nm Nd:YAG"
        ],
        correctIndex: 3,
        explanation: "The 1064 nm Nd:YAG laser operates at the greatest depth and safety for highly pigmented skin because it minimizes absorption by surface melanin."
      }
    ]
  },
  {
    id: 4,
    title: "Lumenis Safety & Contraindications",
    icon: <ShieldCheck className="w-6 h-6 text-black" />,
    description: "Critical safety measures including Dual Cooling and dual-wavelength eyewear.",
    content: `
      Safety is our highest priority. Because the SplendorX emits two distinct wavelengths (755nm and 1064nm) simultaneously, both the operator and the patient MUST wear specialized protective eyewear rated for BOTH wavelengths. 
      
      The SplendorX features a Dual Cooling System (DCS), which combines cold air and a chilled tip to protect the epidermis and maximize patient comfort. It also includes a built-in smoke evacuator system with a HEPA filter directly on the handpiece to protect you and the patient from inhaling dangerous laser plume.
      
      **Comprehensive Contraindications & Special Care:**
      • **Absolute Contraindications:** Pregnancy, breastfeeding, recent sun exposure, intense tan, or use of self-tanning products (within 2-4 weeks). Active infections or Herpes Simplex in the treatment area (requires antiviral prophylaxis). Cancer or pre-cancerous lesions in the treatment area. Epilepsy (due to risk of light-induced seizures). Diseases causing photosensitivity. Anticoagulant therapy. Mechanical or chemical hair removal (waxing/plucking) within 6 weeks prior.
      • **Photosensitizing Medications:** You must screen for medications that make the skin sensitive to light, which can cause severe burns or pigmentation changes. Contraindicated medications include:
        - **Antibiotics:** Tetracyclines (Doxycycline, Minocycline), Fluoroquinolones (Cipro), Sulfonamides (Bactrim).
        - **Acne medications:** Oral isotretinoin (Accutane) requires a strict 6-month waiting period.
        - **NSAIDs:** Ibuprofen (Advil, Motrin), Naproxen (Aleve), Celecoxib (Celebrex), Diclofenac.
        - **Antidepressants:** Tricyclics (Amitriptyline), SSRIs (Fluoxetine/Prozac, Sertraline/Zoloft, Citalopram/Celexa).
        - **Antihistamines:** Diphenhydramine (Benadryl), Promethazine, Chlorpheniramine.
        - **Diuretics:** Thiazides (Hydrochlorothiazide).
        - **Herbal Supplements:** St. John's Wort, Dong Quai.
      • **Topical Restrictions:** Stop use of topical retinoids (Retin-A, Tretinoin) and exfoliating acids in the treatment area several days prior. Skin must be perfectly clean, dry, and free of any creams, body lotions, make-up, deodorants, or fragrances.
      • **Special Care & Medical Clearance:** Patients with long-term diabetes (poor healing), hemophilia (bleeding risks), metallic implants, or a heart pacemaker require careful evaluation and clearance from a medical director. Patients with a history of keloid scarring, Koebnerizing isomorphic diseases, livedo reticularis, or erythema ab igne should be approached with extreme caution.
      • **Tattoos & Permanent Makeup:** NEVER treat directly over tattoos or permanent makeup (e.g., lip liner, microblading). The laser will aggressively target the ink pigment, causing severe burns and destroying the tattoo. Always maintain a minimum 2mm safety margin. White eyeliner or white stickers can be used to block the pigment.
      • **Underlying Conditions:** Hirsutism or hypertrichosis may require investigation for hormonal, familial, drug- or tumor-related conditions (e.g., PCOS) to set realistic expectations, as the laser treats the symptom, not the root cause.
    `,
    questions: [
      {
        id: '4-1',
        text: "What type of protective eyewear is required when operating the SplendorX?",
        options: [
          "Standard sunglasses",
          "Eyewear rated only for 755nm",
          "Eyewear rated only for 1064nm",
          "Eyewear rated for BOTH 755nm and 1064nm"
        ],
        correctIndex: 3,
        explanation: "Since the BLEND X technology fires both wavelengths simultaneously, eyewear must be specifically rated to block both 755nm and 1064nm to fully protect your retinas."
      },
      {
        id: '4-2',
        text: "What is the purpose of the built-in HEPA smoke evacuator on the SplendorX handpiece?",
        options: [
          "To cool down the laser engine",
          "To protect the operator and patient from inhaling laser plume",
          "To blow cold air on the patient's skin",
          "To clean the square spot lens"
        ],
        correctIndex: 1,
        explanation: "When the laser carbonizes hair, it creates a 'plume' of vaporized tissue and particles. The HEPA evacuator safely removes this so it isn't inhaled."
      },
      {
        id: '4-3',
        text: "Which of the following conditions requires special medical clearance or is considered an absolute contraindication for laser hair removal?",
        options: [
          "A patient who has a heart pacemaker or long-term diabetes.",
          "A patient who shaved their legs 24 hours ago.",
          "A patient using a gentle daily moisturizer.",
          "A patient who is 45 years old."
        ],
        correctIndex: 0,
        explanation: "Patients with pacemakers, long-term diabetes, hemophilia, or metallic implants require special medical clearance. Pregnancy, breastfeeding, and recent Accutane use are absolute contraindications."
      },
      {
        id: '4-4',
        text: "A patient requests laser hair removal on their lower leg, but they have a large, dark tattoo on their calf. How should you proceed?",
        options: [
          "Treat directly over the tattoo, but use the Nd:YAG wavelength since it's safer for dark pigment.",
          "Cover the tattoo with white paper or white eyeliner and maintain at least a 2mm safety border around it.",
          "Use a shorter pulse duration when passing over the tattoo.",
          "You cannot treat any part of the leg if there is a tattoo present anywhere on the limb."
        ],
        correctIndex: 1,
        explanation: "Never treat directly over tattoos or permanent makeup! The laser cannot differentiate between melanin and ink pigment. Firing over a tattoo will cause severe burns and ruin the tattoo. You must cover it and keep a safe 2mm border."
      },
      {
        id: '4-5',
        text: "A patient arrives for their laser hair removal appointment and mentions they just started a course of Doxycycline (an antibiotic) for a sinus infection. How should you proceed?",
        options: [
          "Proceed with the treatment normally, as antibiotics only affect bacteria.",
          "Lower the laser fluence by 50% and proceed with the treatment.",
          "Postpone the treatment until they have finished the course and the medication is out of their system.",
          "Apply extra cooling gel and proceed."
        ],
        correctIndex: 2,
        explanation: "Many antibiotics, especially Tetracyclines like Doxycycline, are highly photosensitizing. Firing a laser on a patient taking these medications can result in severe burns or hyperpigmentation. The treatment must be postponed."
      }
    ]
  },
  {
    id: 5,
    title: "Patient FAQs & Consultation",
    icon: <MessageCircle className="w-6 h-6 text-stone-800" />,
    description: "Common patient questions and how to answer them professionally.",
    content: `
      **Common Patient FAQs**
      As a laser provider, setting realistic expectations during the consultation is just as important as the treatment itself. Here is how to answer the most common questions:

      **1. "Why do I have so much unwanted hair?"**
      **Provider Answer:** "Excessive unwanted hair can stem from genetics, androgen excess, heightened androgen sensitivity, or metabolic/endocrine disorders (like PCOS). Laser treats the symptom by destroying the hair bulb, but it does not cure underlying hormonal causes."

      **2. "Does it hurt?"**
      **Provider Answer:** "Most patients describe the sensation as a quick rubber band snap against the skin. Fortunately, our SplendorX device uses a Dual Cooling System (DCS) that constantly blows cold air and uses a chilled tip to keep your skin comfortable and protect the epidermis."

      **3. "How many sessions will I need?"**
      **Provider Answer:** "We usually advise that it takes somewhere close to 10-12 sessions, but around session 6 to 8 is when we can really determine how many more sessions an individual may actually need. This is because laser hair removal only destroys hair follicles that are in the active growth phase (Anagen). Because your hair grows in cycles, we need multiple sessions spaced 4 to 8 weeks apart to catch all the follicles in their active phase. The total hair growth cycle varies by body part: the upper lip cycle is short (4-6 months), while the back or thighs can take 6-12 months to complete a full cycle."

      **4. "Can I shave between treatments?"**
      **Provider Answer:** "Yes! In fact, you MUST shave 24 hours before your session. However, you absolutely cannot wax, pluck, tweeze, or thread between sessions. Those methods remove the hair root entirely, leaving the laser with no 'target' (melanin) to hunt."

      **5. "Is it 100% permanent and does it work on gray hair?"**
      **Provider Answer:** "The FDA classifies this as 'permanent hair reduction.' You can expect an 80-90% reduction in hair growth. However, laser relies on melanin (pigment) to work. Gray, white, or light blonde hair will NOT respond to laser. For those hairs, electrolysis is the only permanent option. Touch-up treatments 1-2 times a year may be needed for remaining hairs."

      **6. "How old do you have to be for laser hair removal?"**
      **Provider Answer:** "While there is no strict medical age limit, it is generally not recommended for very young adolescents as hormonal changes will continue to trigger new hair growth. Conversely, older patients must be evaluated to ensure their hair hasn't turned gray or white."
    `,
    questions: [
      {
        id: '5-1',
        text: "Why are multiple sessions required for laser hair removal?",
        options: [
          "To slowly build up the patient's pain tolerance",
          "Because the laser only destroys hair in the active (Anagen) growth phase",
          "Because the machine needs time to recharge",
          "To make sure the skin has time to tan between sessions"
        ],
        correctIndex: 1,
        explanation: "Laser light can only destroy the germinative matrix when the hair is attached during the Anagen (active) phase. Hairs in Catagen or Telogen phases will need to be caught in future sessions."
      },
      {
        id: '5-2',
        text: "A patient asks if they can wax their upper lip a week before their laser appointment. What is the correct response?",
        options: [
          "Yes, waxing makes the laser more effective.",
          "Yes, but only if they use soft wax.",
          "No, waxing removes the hair root, leaving no target for the laser.",
          "No, they should use depilatory creams (like Nair) instead."
        ],
        correctIndex: 2,
        explanation: "Waxing rips the entire hair out of the follicle. Without that melanin-rich root present inside the skin, the laser light has nothing to target and will be completely ineffective."
      },
      {
        id: '5-3',
        text: "A 14-year-old patient requests full body laser hair removal. While technically possible, what is the most appropriate clinical advice to give them regarding long-term expectations?",
        options: [
          "It will permanently remove all hair forever and they will never need to shave again.",
          "Because they are still undergoing adolescent hormonal changes, they are likely to develop new hair follicles over the next few years and will need ongoing maintenance.",
          "Laser hair removal is illegal for anyone under 18.",
          "Younger skin absorbs more laser heat, so they will need double the sessions."
        ],
        correctIndex: 1,
        explanation: "While there is no absolute age limit, young patients must understand that active hormonal changes will stimulate new hair growth, meaning 'permanent' reduction is harder to guarantee without future maintenance."
      },
      {
        id: '5-4',
        text: "According to hair growth cycle durations, which body area typically requires the longest total time (up to 6-12 months) to complete a full growth cycle?",
        options: [
          "Upper lip",
          "Axilla (underarms)",
          "Back and Thighs",
          "Eyebrows"
        ],
        correctIndex: 2,
        explanation: "The back and thighs have a much longer total hair growth cycle (6-12 months) compared to facial areas like the upper lip (4-6 months)."
      }
    ]
  },
  {
    id: 6,
    title: "Complications & Adverse Reactions",
    icon: <AlertOctagon className="w-6 h-6 text-black" />,
    description: "Identifying, managing, and preventing laser complications.",
    content: `
      **Normal Endpoints vs. Complications**
      It is vital to distinguish between a successful clinical endpoint and an adverse reaction.
      • **Normal Response:** Erythema (redness) and Perifollicular Edema (PFE). This means the follicle was successfully targeted.
      
      **Common Complications & Causes**
      • **Ocular Complications:** Direct or indirect ocular exposure can severely damage the cornea or retina. Appropriate wavelength-specific eyewear is absolutely mandatory for both provider and patient.
      • **Burns & Blistering:** Caused by fluences that are too high, inadequate cooling, overlapping pulses, or treating skin with recent sun exposure (active melanin). Avoid scratching blisters to prevent infections and scarring; treat with antimicrobial ointments.
      • **Hypopigmentation (White Spots):** These occur when the laser causes thermal damage to the skin’s melanin-producing cells, disrupting the natural pigment balance. It is most directly associated with *laser settings that are too high*. It can also be caused by treating recently tanned skin or highly sensitive skin. *Prevention:* Ensure proper skin preparation, choose a qualified practitioner to select correct settings, follow strict aftercare, and carefully monitor the skin.
      • **Hyperpigmentation (PIH):** Darkening of the skin due to thermal damage. More common in darker skin types or tanned skin.
      • **Milia:** Small white cysts can occasionally form post-treatment as the skin heals. These can be managed with gentle exfoliation (like topical glycolic acid) or manual extraction.
      • **Paradoxical Hypertrichosis:** The stimulation of *new* terminal hair growth. Usually happens on the face/neck of female patients with underlying hormonal conditions when sub-lethal (too low) fluences are used, effectively "warming" and stimulating the follicle instead of destroying it. *Warning:* Treating areas with fine, vellus hair ("peach fuzz") can also inadvertently stimulate those hairs to become thick, terminal hairs.

      **Emergency Protocol: What to do if a burn occurs**
      If a patient complains of severe, lingering pain, or you visually notice extreme frosting, blistering, or skin lifting:
      1. **STOP IMMEDIATELY:** Cease laser firing. Turn the machine to standby.
      2. **COOL THE AREA:** Apply cold compresses or ice packs (wrapped in a barrier, never direct ice to damaged skin) for 10-15 minutes to pull the heat out of the tissue.
      3. **TREAT:** Apply a soothing barrier ointment (like Aquaphor) or a topical hydrocortisone/burn cream per your medical director's standing orders.
      4. **DOCUMENT & REPORT:** Take photos (with patient consent), thoroughly document the exact parameters used, and notify your Medical Director or Clinic Manager immediately.
      5. **FOLLOW UP:** Call the patient within 24 hours to monitor healing. Advise them to avoid sun exposure and keep the area clean to prevent infection.
    `,
    questions: [
      {
        id: '6-1',
        text: "What is the IMMEDIATE first step if you suspect you have burned a patient or they report severe, abnormal pain?",
        options: [
          "Apply hydrocortisone cream while continuing to laser.",
          "Stop the treatment immediately and apply a cold compress to pull heat from the tissue.",
          "Turn up the fluence to finish the treatment faster.",
          "Tell the patient it is normal and will go away soon."
        ],
        correctIndex: 1,
        explanation: "You must immediately cease laser firing and cool the area. Pulling the heat out of the tissue stops the thermal damage from progressing deeper into the skin."
      },
      {
        id: '6-2',
        text: "White spots after laser hair removal can be prevented by proper skin preparation, choosing a qualified practitioner, following aftercare instructions, and monitoring the skin.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "True. While white spots (hypopigmentation) are a risk, they can be largely prevented by carefully assessing skin type, using appropriate settings, and following strict pre- and post-treatment care."
      },
      {
        id: '6-3',
        text: "Which factor is most directly associated with the development of white spots after laser hair removal?",
        options: [
          "Choosing a qualified practitioner with extensive experience.",
          "Having a darker skin tone, which increases melanin production.",
          "Laser settings that are too high, causing thermal damage to the skin.",
          "Using a gentle cleanser as part of aftercare to soothe the skin."
        ],
        correctIndex: 2,
        explanation: "When laser settings are too intense, they can cause thermal damage that disrupts or destroys the skin's melanin-producing cells, leading to hypopigmentation (white spots)."
      }
    ]
  },
  {
    id: 7,
    title: "Pre & Post Treatment Care Protocols",
    icon: <ClipboardList className="w-6 h-6 text-stone-800" />,
    description: "Essential preparation and aftercare steps to maximize results and minimize side effects.",
    content: `
      **Why Preparation Matters in Laser Hair Removal**
      Laser hair removal is a long-term solution, but results depend heavily on how well the skin is prepared. The laser targets melanin within the hair follicle. Anything that interferes with that process—from recent waxing to sun exposure—can reduce effectiveness or increase irritation.
      *Fact:* Hair follicles must be intact for laser energy to work. Removing the root before treatment prevents the laser from doing its job.

      **Pre-Treatment Care: Setting Up for Success**
      1. **Shave - Don’t Wax or Thread:** Shaving preserves the follicle while removing surface hair, allowing laser energy to travel directly to the root. Avoid waxing, threading, or epilators for at least 3–4 weeks before treatment.
      2. **Avoid Sun Exposure:** Tanned skin contains excess melanin, which competes with the hair follicle for laser energy. Avoid sun exposure for 10–14 days, skip tanning beds, and use broad-spectrum SPF daily. Treating recently tanned skin increases the risk of pigmentation changes (PIH/hypopigmentation) and reduces laser precision.
      3. **Pause Certain Skincare Products:** Temporarily stop active ingredients like retinoids, exfoliating acids (AHA/BHA), and benzoyl peroxide 5–7 days prior, as these increase skin sensitivity.
      
      *Pro Provider Tips for Pre-Care:* • Avoid caffeine for 24 hours before your session, as it can increase nerve sensitivity and make the treatment feel more painful. 
      • Arrive with perfectly clean skin: no lotions, body oils, makeup, or deodorant on the treatment areas.

      **Post-Treatment Care: Supporting the Healing Process**
      Immediately after treatment, mild redness or warmth (perifollicular edema) is normal. The goal is to let the skin cool down and heal:
      • **Avoid Heat:** Skip hot showers, saunas, hot tubs, and intense sweaty workouts for 24-48 hours. Trapping heat in the skin can cause rashes or blistering.
      • **Sun Protection is Critical:** Post-treatment skin is highly photosensitive. Apply SPF 30+ daily and keep the area covered. Sun exposure is the #1 cause of temporary pigmentation changes post-laser.
      
      *Pro Provider Tips for Post-Care:*
      • **The "Shedding" Phase:** About 1 to 3 weeks after treatment, the destroyed hairs will push their way out of the skin. It looks like new hair growth, but it's actually dead hair shedding! *Important Note:* Not everyone sheds dramatically after every single session. Especially toward the endpoint of their LHR journey, when the remaining hair is much finer and sparser, shedding might be completely unnoticeable. If a patient questions why they haven't shed, reassure them that this is a normal sign of progress.
      • **Gentle Exfoliation:** Once the redness subsides (usually after 3-5 days), gently exfoliate the area in the shower with a washcloth or shower glove to help the dead hairs shed and prevent ingrowns. 
      • **Loose Clothing:** Wear loose cotton clothing to your appointment and for a day after to prevent friction irritation on the treated skin.

      **Why Spacing Sessions Correctly Matters**
      Hair grows in cycles, and laser is only effective during the active growth phase (Anagen). Trying to rush sessions doesn’t improve results—it wastes them. When preparation and aftercare are followed consistently, regrowth becomes finer and slower, and fewer touch-ups are needed long-term.
    `,
    questions: [
      {
        id: '7-1',
        text: "Waxing is recommended at least 3-4 weeks before laser hair removal to preserve the hair follicle.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "False. Waxing removes the hair from the root, leaving nothing for the laser to target. Patients must strictly shave before their sessions."
      },
      {
        id: '7-2',
        text: "What should you do before laser hair removal to ensure the laser can effectively target the hair follicle?",
        options: [
          "Apply a tanning lotion to darken the skin for better laser absorption.",
          "Wax the area to remove hair from the root for a clean surface.",
          "Shave the area to remove surface hair while keeping the follicle intact.",
          "Use exfoliating acids to prepare the skin by removing dead cells."
        ],
        correctIndex: 2,
        explanation: "Shaving removes the surface hair (preventing surface burns) while keeping the melanin-rich root intact inside the skin for the laser to successfully target."
      },
      {
        id: '7-3',
        text: "Why are patients instructed to avoid hot showers, saunas, and intense workouts for 24 to 48 hours after a laser session?",
        options: [
          "Because sweat will wash away the laser energy.",
          "To prevent trapping excess heat in the skin, which can lead to blistering or rashes.",
          "Because hot water will stimulate the hair to grow back instantly.",
          "To allow the numbing cream to fully absorb."
        ],
        correctIndex: 1,
        explanation: "The laser deposits a massive amount of heat into the follicles. Adding external heat (like a sauna or hot shower) or internal heat (intense workouts) before the skin cools down can trigger adverse reactions like blistering."
      },
      {
        id: '7-4',
        text: "A patient is concerned because they didn't notice any dramatic 'shedding' after their 7th laser session. What is the most appropriate clinical response?",
        options: [
          "Tell them the treatment failed and needs to be repeated immediately at a higher fluence.",
          "Assume they must have secretly waxed between sessions and reprimand them.",
          "Reassure them that shedding is often unnoticeable toward the end of their LHR journey because the remaining hair is much finer and sparser.",
          "Tell them to aggressively scrub their skin with a harsh exfoliant until the hair falls out."
        ],
        correctIndex: 2,
        explanation: "As a patient progresses through their treatment plan, their hair becomes significantly finer and lighter. Dramatic shedding is common early on, but a lack of noticeable shedding later in the journey is a normal sign of progress."
      }
    ]
  }
];

const CERTIFICATIONS = [
  {
    id: 'lhr',
    title: 'LHR Certifications',
    modules: TRAINING_MODULES,
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
    modules: [
      {
        id: 'tat-1',
        title: "The Nature of Ink & The Photoacoustic Effect",
        icon: <Zap className="w-6 h-6 text-amber-900" />,
        description: "Understanding how ink gets trapped in macrophages and how to shatter it.",
        content: `
          **The Nature of Tattoo Ink**
          Tattoos are made of incredibly tiny ink particles—often around 40 to 100 nanometers in size. When injected into the skin, these particles are attracted to each other and form massive clumps. While the body's immune system can clear tiny particles, it cannot remove these large clumps. The body then encapsulates the clumps within *dermal macrophages* (essentially acting as prison cells, holding the ink particles in place).

          **The Macrophage Steam Explosion**
          Because these particles are so tiny, they lose heat extremely quickly (short thermal relaxation time). When you hit them with a laser, the particles absorb energy and heat up, passing that heat to the surrounding tissue water inside the macrophage. 
          When water turns to steam, its volume expands massively (by a factor of about 2,000). The macrophage cannot withstand the pressure from this steam formation, causing it to explode! The explosive force sends the ink particles flying out in all directions, turning them into microscopic fragments that the lymphatic system can now easily wash away. This is the **photoacoustic effect**.

          **Why Pulse Duration Matters**
          If your laser pulse is too long (like a **millisecond** laser), the ink particles lose too much heat before the temperature rises enough to create steam. The process is too gentle, heat is lost as fast as it comes in, and no explosion occurs. 
          That is why we absolutely cannot use millisecond lasers for tattoo removal. You must deliver energy in an incredibly short burst to achieve the temperature rise needed for a steam explosion.

          **The Top-Hat Beam Profile**
          The M22 QS Nd:YAG uses a "top-hat" beam profile. Unlike standard beams that have a "hot spot" in the center, the top-hat profile warrants a perfectly homogenous energy distribution across the entire spot. As a result, it highly minimizes epidermal damage, tissue textural changes, and the occurrence of scarring. It also decreases bleeding and tissue splatter.
        `,
        questions: [
          {
            id: 'tat-1-1',
            text: "What happens when laser energy rapidly heats the ink particles inside a macrophage?",
            options: [
              "The ink particles chemically react with the laser and dissolve.",
              "The heat turns the surrounding water into steam, causing the macrophage to explode.",
              "The macrophage absorbs the laser energy and becomes transparent.",
              "The heat causes the ink particles to shrink and be absorbed by the body."
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
          }
        ]
      },
      {
        id: 'tat-2',
        title: "The Four Physical Variables",
        icon: <Activity className="w-6 h-6 text-black" />,
        description: "Mastering Fluence, Spot Size, Irradiance, and Repetition Rate to safely break down ink.",
        content: `
          **Understanding the Variables**
          Every laser treatment comes down to a few physical variables. These aren’t arbitrary dial positions. Each one directly controls energy delivery to ink particles and the tissue around them. Together, these four variables define the full dosimetric profile of your treatment.

          **1. Fluence: Energy Density**
          Of the four variables, fluence comes first. It’s energy density — defined as the energy per unit area, typically measured in Joules per square centimeter (J/cm²). That number tells you the total dose hitting each square centimeter of skin with every pulse. Higher fluence concentrates more energy into that area. If the fluence is too low, particles won’t absorb enough energy to break apart. Too high, and you risk damage.

          **2. Spot Size Changes Everything**
          Here’s what catches many off guard: if you keep your laser’s energy the same but dial down the spot size, your fluence shoots up. You’re packing identical energy into a much smaller area. 
          The relationship follows an inverse square law — **if you halve the spot diameter while keeping the laser's energy constant, the fluence roughly quadruples.** That’s why spot size and fluence are inseparable. Choose one, and you’ve already chosen the other. A small spot delivers a deep, intense punch while a large spot spreads the same dose over a wider, shallower field.

          **3. Fluence vs. Irradiance (Pulse Width)**
          Fluence and irradiance are related but not the same thing. Fluence is the *total* energy dose per area. Irradiance is the *power* per area at any moment during the pulse (the rate). 
          To get irradiance, divide fluence by pulse duration. So a very short pulse with the same fluence as a longer one will have dramatically higher irradiance. That difference — the instantaneous power surge — drives the photoacoustic effect. Average power indicates heat load over time. Peak power indicates the mechanical shock delivered to ink.

          **4. Repetition Rate and Thermal Stacking**
          Repetition rate is measured in Hertz (Hz), or pulses per second. At 10 Hz, ten pulses fire each second. The gap between pulses is the tissue recovery window.
          If you fire too fast, the heat doesn’t dissipate completely. Residual heat from one pulse adds to the next. This is called **Thermal Stacking**. This cumulative heat buildup is a primary cause of unwanted thermal injury during treatment. Over a full treatment pass, this can push tissue temperature well above safe limits, even if each individual pulse seems moderate. Controlling the repetition rate prevents heat from accumulating and keeps the treatment safe.

          **The Interplay of Variables**
          These four variables don’t work alone. Shorten the pulse width, and peak power rises for the same fluence. Increase the repetition rate, and the recovery window shrinks. Widen the spot size, and fluence drops unless you add more energy. 
          
          **A Clinical Decision Example:** For a dense black tattoo on a light skin type, you pick a wavelength absorbed by black ink (1064 nm). You set the fluence to 4–6 J/cm² to fragment the particles. You use a 6 mm spot size to maintain fluence at depth, and a Rep rate of 2 Hz so the tissue can recover safely between pulses. Every single number has a reason.
        `,
        questions: [
          {
            id: 'tat-2-1',
            text: "Fluence is defined as the energy per unit area, typically measured in joules per square centimeter.",
            options: ["True", "False"],
            correctIndex: 0,
            explanation: "True. Fluence measures the total energy dose delivered per area of tissue, expressed as J/cm²."
          },
          {
            id: 'tat-2-2',
            text: "What happens to fluence when you halve the spot diameter while keeping the laser's energy constant?",
            options: [
              "It remains the same.",
              "It is halved.",
              "It roughly quadruples.",
              "It roughly doubles."
            ],
            correctIndex: 2,
            explanation: "Because of the inverse square relationship, packing the exact same amount of energy into a spot that is half the size will roughly quadruple the fluence (energy density)."
          }
        ]
      },
      {
        id: 'tat-3',
        title: "Nanosecond vs. Picosecond Lasers",
        icon: <Zap className="w-6 h-6 text-black" />,
        description: "Understanding the controversy: why Q-Switched nanosecond is the gold standard for black ink.",
        content: `
          **The Nano vs. Pico Debate**
          Marketing from massive laser companies has pushed picosecond lasers as the newest, greatest, and most effective devices. While picosecond lasers are a fabulous tool and have a place in the industry, there is an unspoken truth among experienced removalists: **Picosecond lasers are terrible for dense, saturated black tattoo removal results.**

          **The Science Behind the Lasers**
          Pulse width determines how long a laser burst lasts. 
          • **Nanosecond (Q-Switched):** The M22 operates in nanoseconds (6-8 ns). Nanosecond pulses produce a balanced **photothermal** (heat) AND **photoacoustic** (shockwave) effect.
          • **Picosecond:** Fires pulses between 100 and 750 picoseconds—up to a hundred times shorter. This shifts the primary mechanism almost entirely toward photoacoustic pressure, with very little heat deposited.

          **The Shortcoming of Picosecond for Black Ink**
          When you have a highly saturated, dark, dense black tattoo, that thermal heat provided by a nanosecond laser is required to create a stronger shattering effect. A purer photoacoustic effect (picosecond) is actually *less* effective when there is a massive volume of black ink. Having less photothermal effect leads to a much slower, and sometimes impossible, result. A dark black tattoo that might take 8-10 sessions with a nanosecond laser could easily take 15-20 frustrating sessions with a picosecond device.

          **Where Picosecond Lasers Shine**
          If you have a tattoo with notoriously difficult colors like blues, greens, or even yellows, a picosecond laser is exactly what you need. The pure photoacoustic effect from specific wavelengths is extremely effective for clearing those bright colors that a Q-Switch cannot touch. 

          **The Ideal Clinical Approach**
          In a perfect world, a clinic would use a Q-Switched nanosecond laser (like the M22) for the first 80-90% of the removal process. Once the heavy black saturation has been cleared and the remaining ink is super light and sparse, switching to a picosecond laser would treat those final, tiny stubborn pigment particles more effectively to achieve the ultimate holy grail result.

          *Takeaway:* Black ink makes up 90% of tattoos. Equip yourself with the knowledge that a Q-Switched nanosecond laser is the premier tool for effectively breaking down saturated black ink.
        `,
        questions: [
          {
            id: 'tat-3-1',
            text: "Picosecond lasers are the most effective option for removing dark, saturated black tattoos.",
            options: ["True", "False"],
            correctIndex: 1,
            explanation: "False. Picosecond lasers lack the necessary photothermal (heat) effect needed to efficiently break down massive volumes of dense black ink, making nanosecond lasers superior for saturated black tattoos."
          },
          {
            id: 'tat-3-2',
            text: "According to the lesson, which type of laser is most effective for removing dark, saturated black tattoos?",
            options: [
              "Picosecond laser",
              "Neither laser works well for black tattoos",
              "Q-switch nanosecond laser",
              "Both are equally effective for black tattoos"
            ],
            correctIndex: 2,
            explanation: "The Q-switch nanosecond laser delivers the perfect balance of photothermal heat and photoacoustic shock needed to aggressively shatter dense black ink."
          }
        ]
      },
      {
        id: 'tat-4',
        title: "Tattoo Typology & Device Presets",
        icon: <BookOpen className="w-6 h-6 text-stone-800" />,
        description: "Analyzing ink types, paradoxical darkening, and parameter adjustments.",
        content: `
          **Tattoo Typology**
          Tattoo dye composition is quite variable. Ink placement necessitates deeply penetrating lasers (like 1064nm) to achieve clearance.
          • **Professional Tattoos:** Contain organometallic dyes, are dense, and placed deep. Usually require 6-10 sessions.
          • **Amateur Tattoos:** Contain carbon-rich mixtures (like India ink), are sparse, and placed irregularly but mostly superficially. Usually require 4-6 sessions.
          • **Traumatic Tattoos:** Result from explosions, asphalt, or gunpowder. *Warning:* Explosive particles may react dangerously with laser therapy and ignite, leading to pock-like scarring. 

          **Paradoxical Darkening (Cosmetic Tattoos)**
          Approach pink, red, and flesh-tone tattoos (such as lip liner or cosmetic eyeliner) with extreme caution. Laser energy can cause a chemical transformation of the ferric oxide into ferrous oxide. This results in a paradoxical darkening of the ink (it turns black), which is often highly resistant to additional QS laser therapy.

          **Spot Size and Fluence Selection on the M22**
          The M22 offers 7 tip sizes (from 2.0mm to 8.0mm). 
          *Rule of Thumb:* **Larger tip sizes penetrate deeper and deliver less fluence.** Larger spot sizes are more suited for:
          1. Higher densities of pigment/tattoo ink.
          2. Darker skin types.
          3. Sensitive body areas.
          From session to session, as the dark tattoo becomes lighter, reducing the spot size will increase the energy deposits to shatter the remaining stubborn pigment. Any change of settings implies a new test patch!
        `,
        questions: [
          {
            id: 'tat-4-1',
            text: "A patient requests removal of permanent cosmetic flesh-toned lip liner. What is a major clinical risk?",
            options: [
              "The laser will immediately dissolve the ink and leave a white scar.",
              "The laser may cause a chemical reaction (ferric oxide to ferrous oxide), causing the ink to turn black and become highly resistant to further treatment.",
              "Cosmetic ink absorbs too much water and will cause a severe burn.",
              "Flesh-toned ink reflects the laser perfectly, causing no reaction at all."
            ],
            correctIndex: 1,
            explanation: "This is known as paradoxical darkening. Treating cosmetic pink, red, or flesh tones can instantly turn the tattoo black and permanent."
          },
          {
            id: 'tat-4-2',
            text: "When adjusting settings on the M22, what is true regarding larger tip sizes (e.g., 6.0mm or 8.0mm)?",
            options: [
              "Larger tips penetrate shallower and deliver more fluence.",
              "Larger tips penetrate deeper, deliver less fluence, and are better for higher ink densities and darker skin types.",
              "Larger tips have the highest risk of burning and should only be used on Skin Type I.",
              "Tip size has no effect on depth or fluence."
            ],
            correctIndex: 1,
            explanation: "Larger tip sizes drive the energy deeper into the dermis but deliver less total surface fluence, making them the safest starting point for dense tattoos and darker skin."
          }
        ]
      },
      {
        id: 'tat-5',
        title: "Clinical Endpoints, Spacing & Maintenance",
        icon: <ShieldCheck className="w-6 h-6 text-black" />,
        description: "Proper technique, frosting, aftercare, and system calibration.",
        content: `
          **Treatment Technique & Endpoints**
          Ensure the distal end of the tip touches the skin perpendicularly with minimal pressure. Keep the tip "legs" in contact with the skin without scratching the already treated area. 
          • **The Endpoint ("Frosting"):** The immediate, desired visual endpoint during dark tattoo removal is a flash of white light followed by epidermal whitening (frosting). This white, ash-like appearance is caused by rapid steam/gas bubble formation from the shattered ink. It typically subsides within 10 to 20 minutes. If not observed, the laser exposure dose is likely insufficient.
          • **Other Normal Reactions:** Mild erythema, swelling, and occasional pinpoint bleeding. If pinpoint bleeding occurs, gently pat the area dry with a sterile gauze before proceeding to prevent blood splatter.

          **Treatment Intervals and Aftercare**
          Because the immune system needs time to clear the shattered ink, treatments should be spaced **6 to 8 weeks apart minimum**. Treating too soon does not speed up removal; it simply damages the skin and increases the risk of scarring. 
          • Post-op: Cool the area immediately. Apply antibiotic ointment or hydrogel dressing. 
          • Hydration: Post-treatment, patients should drink 8-10 glasses of water to encourage lymphatic drainage of the ink.

          **Crucial Device Maintenance: Calibration**
          Energy calibration compensates for laser deterioration. The M22 requires QS Nd:YAG treatment head calibration at first connection and **at least every 50,000 pulses**. 
          *Warning:* Calibration must ALWAYS be done WITHOUT the lens assembly attached.
        `,
        questions: [
          {
            id: 'tat-5-1',
            text: "What is the immediate, desired clinical endpoint when firing the QS Nd:YAG over a dark tattoo?",
            options: [
              "Immediate disappearance of the tattoo forever.",
              "Epidermal frosting (a white, ash-like appearance) caused by gas bubbles.",
              "Severe bruising and large hematomas.",
              "The skin turning completely black."
            ],
            correctIndex: 1,
            explanation: "Frosting is the expected clinical endpoint indicating the ink has shattered. It is caused by gas bubbles and usually fades in 10-20 minutes."
          },
          {
            id: 'tat-5-2',
            text: "How often should the M22 QS Nd:YAG treatment head be calibrated, and how should it be configured?",
            options: [
              "Every 10,000 pulses, with the lens assembly attached.",
              "Every 50,000 pulses, WITHOUT the lens assembly attached.",
              "Once a year, with a 2.0mm tip attached.",
              "Calibration is automatic and never needs to be done manually."
            ],
            correctIndex: 1,
            explanation: "Calibration ensures accurate energy output. It must be performed at least every 50,000 pulses and the lens assembly must be removed prior to calibrating."
          },
          {
            id: 'tat-5-3',
            text: "Why is a minimum of 6 to 8 weeks required between tattoo removal sessions?",
            options: [
              "To give the machine time to rest.",
              "To allow the patient's hair to grow back.",
              "Because the immune system (macrophages) needs time to clear the shattered ink through the lymphatic system.",
              "To ensure the numbing cream fully wears off."
            ],
            correctIndex: 2,
            explanation: "Treating too soon increases scarring risks without speeding up removal. The body physically needs 6-8 weeks to flush the shattered ink particles away."
          }
        ]
      }
    ],
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
  },
  {
    id: 'microneedling',
    title: 'Microneedling (Coming Soon)',
    modules: [
      {
        id: 'mn-1',
        title: "Introduction to Microneedling",
        icon: <Activity className="w-6 h-6 text-amber-900" />,
        description: "Placeholder module for the Microneedling certification.",
        content: "Module content is currently under development. Check back soon for the complete SkinPen Microneedling curriculum!",
        questions: [
          {
            id: 'mn-1-1',
            text: "Is this module currently under development?",
            options: ["Yes", "No"],
            correctIndex: 0,
            explanation: "Yes! The full curriculum is being built."
          }
        ]
      }
    ],
    practical: [
      { id: 'mn-p1', label: 'Observed and Performed 3 Microneedling Treatments' },
      { id: 'mn-p2', label: 'Observed and Performed Proper Device Cleaning & Storage' }
    ]
  }
];

export default function App() {
  const [appState, setAppState] = useState('login'); // 'login', 'student-dash', 'supervisor-dash', 'module', 'quiz', 'signoff', 'certificate'
  const [currentUser, setCurrentUser] = useState(null); // { name: '', role: 'student' | 'supervisor' }
  const [activeCertId, setActiveCertId] = useState('lhr');
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizState, setQuizState] = useState({ submitted: false, passed: false });
  const [quizError, setQuizError] = useState('');
  const [loginError, setLoginError] = useState(''); // NEW: Tracks login errors
  
  // Data State
  const [studentData, setStudentData] = useState({ theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, quizPerformance: {} });
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
      // Sync just this student's data
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          // Initialize new student document
          setDoc(docRef, { theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, quizPerformance: {} });
        }
      }, (err) => console.error(err));
      
    } else if (currentUser.role === 'supervisor') {
      // Sync all students for supervisor
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

  // Derived state for student
  const activeCert = CERTIFICATIONS.find(c => c.id === activeCertId) || CERTIFICATIONS[0];
  const theoreticalProgress = studentData.theoreticalProgress || {};
  const practicalChecklist = studentData.practicalChecklist || {};
  
  const currentSignoff = studentData.signoffs?.[activeCertId] || 
                         (activeCertId === 'lhr' && studentData.signedOff ? { status: true, by: studentData.signedOffBy, at: studentData.signedOffAt } : null);
  const isSignedOff = !!currentSignoff;

  const completedModulesCount = activeCert.modules.filter(m => theoreticalProgress[m.id] === 'passed').length;
  const totalModules = activeCert.modules.length;
  const theoreticalPercentage = Math.round((completedModulesCount / totalModules) * 100) || 0;
  
  const completedPracticalCount = activeCert.practical.filter(p => practicalChecklist[p.id] === true).length;
  const totalPractical = activeCert.practical.length;
  const practicalPercentage = Math.round((completedPracticalCount / totalPractical) * 100) || 0;
  const isFullyReadyForSignoff = theoreticalPercentage === 100 && practicalPercentage === 100;

  // --- HANDLERS ---
  const handleLogin = (e, role) => {
    e.preventDefault();
    const nameInput = e.target.elements.name.value.trim();
    if (!nameInput) return;
    
    // NEW: Supervisor PIN Verification
    if (role === 'supervisor') {
      const pinInput = e.target.elements.pin.value;
      if (pinInput !== SUPERVISOR_ACCESS_PIN) {
        setLoginError('Incorrect Supervisor Access PIN.');
        return;
      }
    }
    
    setLoginError(''); // Clear any previous errors
    setCurrentUser({ name: nameInput, role });
    setAppState(role === 'student' ? 'student-dash' : 'supervisor-dash');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStudentData({ theoreticalProgress: {}, practicalChecklist: {}, signoffs: {}, quizPerformance: {} });
    setLoginError('');
    setAppState('login');
  };

  const handleStartModule = (id) => {
    setActiveModuleId(id);
    setAppState('module');
    window.scrollTo(0, 0);
  };

  const handleStartQuiz = () => {
    setAppState('quiz');
    setAnswers({});
    setQuizError('');
    setQuizState({ submitted: false, passed: false });
    window.scrollTo(0, 0);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (quizState.submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setQuizError('');
  };

  const handleSubmitQuiz = async () => {
    const activeModule = activeCert.modules.find(m => m.id === activeModuleId);
    if (Object.keys(answers).length < activeModule.questions.length) {
      setQuizError("Please answer all questions before checking your results.");
      return;
    }

    const wrongQuestionIds = activeModule.questions
      .filter(q => answers[q.id] !== q.correctIndex)
      .map(q => q.id);

    const allCorrect = wrongQuestionIds.length === 0;
    setQuizState({ submitted: true, passed: allCorrect });

    if (db && currentUser) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUser.name);
      
      const currentStats = studentData.quizPerformance?.[activeCertId]?.[activeModuleId] || { attempts: 0, mistakes: {} };
      const newAttempts = currentStats.attempts + 1;
      const newMistakes = { ...currentStats.mistakes };
      
      wrongQuestionIds.forEach(id => {
         newMistakes[id] = (newMistakes[id] || 0) + 1;
      });

      const updates = {
        [`quizPerformance.${activeCertId}.${activeModuleId}`]: {
           attempts: newAttempts,
           mistakes: newMistakes
        }
      };

      if (allCorrect) {
        updates[`theoreticalProgress.${activeModuleId}`] = 'passed';
      }

      try {
        await updateDoc(docRef, updates);
        
        // Local state update for immediate feedback
        setStudentData(prev => ({
          ...prev,
          theoreticalProgress: { 
             ...prev.theoreticalProgress, 
             ...(allCorrect ? { [activeModuleId]: 'passed' } : {}) 
          },
          quizPerformance: {
             ...prev.quizPerformance,
             [activeCertId]: {
                ...(prev.quizPerformance?.[activeCertId] || {}),
                [activeModuleId]: { attempts: newAttempts, mistakes: newMistakes }
             }
          }
        }));
      } catch (err) {
        console.error("Error saving progress", err);
      }
    }
  };

  const handleTogglePractical = async (id) => {
    if (isSignedOff) return; // Locked if signed off
    
    const newValue = !practicalChecklist[id];
    if (db && currentUser) {
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
    }
  };

  const handleSupervisorSignoff = async () => {
    if (db && selectedStudentForSignoff && currentUser) {
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
    }
  };

  // --- RENDERERS ---

  const renderLogin = () => (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-950 p-8 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          SELFishly <span className="font-normal text-stone-200">Aesthetics & Wellness</span>
        </h1>
        <p className="text-stone-300 mt-2 text-xs font-bold uppercase tracking-widest">Learning Management System (LMS)</p>
      </div>
      <div className="p-8 space-y-8">
        <form onSubmit={(e) => handleLogin(e, 'student')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">New Employee Login</label>
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-900 focus:border-amber-900 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-amber-900 hover:bg-amber-950 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <User className="w-5 h-5"/> Login as New Employee
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-stone-500">OR</span></div>
        </div>

        <form onSubmit={(e) => handleLogin(e, 'supervisor')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Clinical Supervisor Login</label>
            <input required type="text" name="name" placeholder="Enter your full name..." className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors mb-3" />
            
            <label className="block text-sm font-semibold text-stone-700 mb-1">Access PIN</label>
            <input required type="password" name="pin" placeholder="Enter supervisor PIN..." className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors" />
            
            {loginError && (
              <p className="text-rose-600 text-sm font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {loginError}
              </p>
            )}
          </div>
          <button type="submit" className="w-full bg-stone-900 hover:bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2">
            <ShieldCheck className="w-5 h-5"/> Login as Supervisor
          </button>
        </form>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8">
      {/* Certification Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {CERTIFICATIONS.map(cert => (
          <button
            key={cert.id}
            onClick={() => setActiveCertId(cert.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCertId === cert.id ? 'bg-black text-white shadow-md' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            {cert.title}
          </button>
        ))}
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-black">My Certification Journey</h1>
            <p className="text-stone-500 mt-1">Student: <span className="font-medium text-stone-700">{currentUser.name}</span></p>
          </div>
          
          <div className="flex gap-4">
            {/* Theory Progress */}
            <div className="flex items-center gap-3 bg-stone-50 py-3 px-4 rounded-lg border border-stone-100">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-stone-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`${theoreticalPercentage === 100 ? 'text-black' : 'text-amber-900'} transition-all duration-1000`} strokeDasharray={`${theoreticalPercentage}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-xs font-bold text-stone-700">{theoreticalPercentage}%</div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Theory</p>
                <p className="text-sm font-semibold text-black">{completedModulesCount}/{totalModules}</p>
              </div>
            </div>

            {/* Practical Progress */}
            <div className="flex items-center gap-3 bg-stone-50 py-3 px-4 rounded-lg border border-stone-100">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-stone-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`${practicalPercentage === 100 ? 'text-black' : 'text-stone-600'} transition-all duration-1000`} strokeDasharray={`${practicalPercentage}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-xs font-bold text-stone-700">{practicalPercentage}%</div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Practical</p>
                <p className="text-sm font-semibold text-black">{completedPracticalCount}/{totalPractical}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isSignedOff ? (
        <div className="bg-black rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-stone-800 p-3 rounded-full"><Award className="w-8 h-8 text-white" /></div>
            <div>
              <h3 className="font-bold text-xl text-white">{activeCert.title} Complete</h3>
              <p className="text-stone-300 text-sm">Signed off by {currentSignoff?.by} on {currentSignoff?.at ? new Date(currentSignoff.at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <button onClick={() => { setAppState('certificate'); window.scrollTo(0,0); }} className="w-full md:w-auto bg-white text-black hover:bg-stone-100 px-6 py-3 rounded-lg font-bold transition-colors shadow flex items-center justify-center gap-2">
            <Printer className="w-5 h-5"/> View Certificate
          </button>
        </div>
      ) : isFullyReadyForSignoff ? (
        <div className="bg-stone-100 border border-stone-300 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-black flex-shrink-0" />
          <div>
            <h3 className="font-bold text-black text-lg">Ready for Clinical Supervisor Sign-Off</h3>
            <p className="text-sm text-stone-700">You have completed all theoretical and practical requirements. Please notify your supervisor to review your profile.</p>
          </div>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Theory */}
        <div>
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-900"/> Theoretical Modules</h2>
          <div className="space-y-3">
            {activeCert.modules.map((module) => {
              const isPassed = theoreticalProgress[module.id] === 'passed';
              return (
                <div key={module.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${isPassed ? 'border-stone-300' : 'border-stone-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isPassed ? 'bg-stone-100' : 'bg-stone-50'}`}>
                        {React.cloneElement(module.icon, { className: `w-5 h-5 ${isPassed ? 'text-black' : ''}` })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-black leading-tight">{module.title}</h3>
                        <div className="mt-1">
                          {isPassed ? (
                            <span className="text-xs font-semibold text-black flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passed</span>
                          ) : (
                            <span className="text-xs font-medium text-stone-400">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartModule(module.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                        isPassed ? 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50' : 'bg-amber-900 text-white hover:bg-black shadow-sm'
                      }`}
                    >
                      {isPassed ? 'Review' : 'Start'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Practical */}
        <div>
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-stone-600"/> Practical Checklist</h2>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-4">
            <p className="text-sm text-stone-500 mb-2">Complete these hands-on requirements under supervision and check them off.</p>
            {activeCert.practical.map((item) => {
              const isChecked = practicalChecklist[item.id] === true;
              return (
                <label key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isSignedOff ? 'opacity-70 cursor-default' : 'cursor-pointer'} ${isChecked ? 'bg-stone-100 border-stone-300' : 'bg-white border-stone-200 hover:border-stone-400'}`}>
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-amber-900 rounded border-stone-300 focus:ring-amber-900" 
                      checked={isChecked}
                      onChange={() => handleTogglePractical(item.id)}
                      disabled={isSignedOff}
                    />
                  </div>
                  <span className={`text-sm ${isChecked ? 'text-black font-medium' : 'text-stone-700'}`}>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupervisorDashboard = () => (
    <div className="space-y-6">
      {/* Certification Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {CERTIFICATIONS.map(cert => (
          <button
            key={cert.id}
            onClick={() => { setActiveCertId(cert.id); setExpandedStudentId(null); }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCertId === cert.id ? 'bg-black text-white shadow-md' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            {cert.title}
          </button>
        ))}
      </div>

      <div className="bg-black rounded-xl shadow-sm border border-stone-800 p-8 text-white">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-amber-900" />
          <div>
            <h1 className="text-2xl font-bold">Clinical Supervisor Dashboard</h1>
            <p className="text-stone-400 mt-1">Welcome, {currentUser.name}. Review and certify your staff for <span className="font-bold text-white">{activeCert.title}</span> below.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
          <Users className="w-5 h-5 text-stone-500" />
          <h2 className="font-bold text-black">Student Roster</h2>
        </div>
        
        {allStudents.length === 0 ? (
          <div className="p-8 text-center text-stone-500">No students found.</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {allStudents.map(student => {
              const s_theoCount = activeCert.modules.filter(m => (student.theoreticalProgress || {})[m.id] === 'passed').length;
              const s_pracCount = activeCert.practical.filter(p => (student.practicalChecklist || {})[p.id] === true).length;
              
              const s_currentSignoff = student.signoffs?.[activeCertId] || 
                                       (activeCertId === 'lhr' && student.signedOff ? { status: true, by: student.signedOffBy, at: student.signedOffAt } : null);
              const s_isSignedOff = !!s_currentSignoff;

              const isReady = s_theoCount === totalModules && s_pracCount === totalPractical && !s_isSignedOff;
              const isExpanded = expandedStudentId === student.id;
              
              return (
                <div key={student.id} className="border-b border-stone-100 last:border-0 overflow-hidden">
                  <div 
                    onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                      <div>
                        <h3 className="font-bold text-lg text-black">{student.id}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-stone-500">Theory: {s_theoCount}/{totalModules}</span>
                          <span className="text-sm font-medium text-stone-500">Practical: {s_pracCount}/{totalPractical}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                      {s_isSignedOff ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-black text-sm font-bold border border-stone-300">
                          <CheckCircle className="w-4 h-4"/> Certified
                        </span>
                      ) : isReady ? (
                        <button 
                          onClick={() => { setSelectedStudentForSignoff(student); setAppState('signoff'); window.scrollTo(0,0); }}
                          className="bg-amber-900 hover:bg-black text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors"
                        >
                          Review & Sign Off
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-sm font-medium border border-stone-200">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6 bg-stone-50 border-t border-stone-100">
                      <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-900"/> Quiz Performance Details
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {activeCert.modules.map(mod => {
                          const stats = student.quizPerformance?.[activeCertId]?.[mod.id];
                          if (!stats) return (
                            <div key={mod.id} className="bg-white p-4 rounded-xl border border-stone-200">
                              <span className="font-semibold text-black text-sm block mb-1">{mod.title}</span>
                              <span className="text-xs text-stone-400 font-medium">Not attempted yet</span>
                            </div>
                          );
                          
                          const hasMistakes = Object.keys(stats.mistakes).length > 0;
                          
                          return (
                            <div key={mod.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-semibold text-black text-sm pr-2">{mod.title}</span>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-stone-100 text-stone-600 whitespace-nowrap">
                                  Attempts: {stats.attempts}
                                </span>
                              </div>
                              {hasMistakes ? (
                                <div className="space-y-2 mt-3 pt-3 border-t border-stone-100">
                                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Questions missed during attempts:</p>
                                  <ul className="space-y-3">
                                    {Object.entries(stats.mistakes).map(([qId, count]) => {
                                       const qText = mod.questions.find(q => q.id === qId)?.text || 'Unknown question';
                                       return (
                                         <li key={qId} className="text-sm flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                              <span className="text-stone-700 leading-snug block mb-1">{qText}</span>
                                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">Missed {count}x</span>
                                            </div>
                                         </li>
                                       );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                <div className="mt-2 pt-3 border-t border-stone-100">
                                  <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Passed perfectly on first try!</span>
                                </div>
                              )}
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

  const renderModule = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => setAppState('student-dash')}
        className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 p-6 flex items-center gap-4">
           <div className="p-3 bg-white rounded-lg shadow-sm border border-stone-100">
              {activeCert.modules.find(m => m.id === activeModuleId)?.icon}
           </div>
           <div>
             <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Module {activeCert.modules.findIndex(m => m.id === activeModuleId) + 1}</div>
             <h1 className="text-2xl font-bold text-black">{activeCert.modules.find(m => m.id === activeModuleId)?.title}</h1>
           </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="prose prose-stone max-w-none">
            {activeCert.modules.find(m => m.id === activeModuleId)?.content.split('\n').map((paragraph, idx) => (
              <p 
                key={idx} 
                className="mb-4 text-stone-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: paragraph.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                }}
              />
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 bg-amber-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Take Quiz <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="max-w-3xl mx-auto space-y-6 mb-12">
      <button 
        onClick={() => quizState.passed ? setAppState('student-dash') : setAppState('module')}
        className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {quizState.passed ? 'Back to Dashboard' : 'Back to Reading'}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-100 border-b border-stone-200 p-6">
           <h1 className="text-xl font-bold text-black">Knowledge Check: {activeCert.modules.find(m => m.id === activeModuleId)?.title}</h1>
           {!quizState.submitted ? (
             <p className="text-stone-700 text-sm mt-1">Select your answers below. You must score 100% to pass.</p>
           ) : (
             <p className={`text-sm mt-1 font-semibold ${quizState.passed ? 'text-black' : 'text-stone-600'}`}>
               {quizState.passed ? 'Excellent! You passed the module.' : 'Some answers were incorrect. Review the feedback below and try again.'}
             </p>
           )}
        </div>
        
        <div className="p-6 md:p-8 space-y-10">
          {activeCert.modules.find(m => m.id === activeModuleId)?.questions.map((q, qIndex) => {
            const isUserCorrectForThisQuestion = answers[q.id] === q.correctIndex;

            return (
              <div key={q.id} className="space-y-4">
                <h3 className="font-semibold text-black text-lg">
                  <span className="text-amber-900 mr-2">{qIndex + 1}.</span> 
                  {q.text}
                </h3>
                
                <div className="space-y-3">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[q.id] === optIndex;
                    const isTheCorrectAnswer = optIndex === q.correctIndex;
                    
                    let borderClass = 'border-stone-200 hover:border-amber-900 hover:bg-stone-50';
                    let textClass = 'text-stone-700';
                    let radioClass = 'border-stone-300';
                    
                    if (quizState.submitted) {
                      if (isSelected && isUserCorrectForThisQuestion) {
                        borderClass = 'border-black bg-stone-100 shadow-sm';
                        textClass = 'text-black font-bold';
                        radioClass = 'border-black bg-black';
                      } else if (isSelected && !isUserCorrectForThisQuestion) {
                        borderClass = 'border-stone-400 bg-stone-50 shadow-sm';
                        textClass = 'text-stone-600 font-medium';
                        radioClass = 'border-stone-500 bg-stone-500';
                      } else if (isTheCorrectAnswer) {
                        borderClass = 'border-stone-300 bg-stone-50 border-dashed';
                        textClass = 'text-black font-medium';
                        radioClass = 'border-stone-400';
                      } else {
                        borderClass = 'border-stone-100 opacity-60';
                        textClass = 'text-stone-400';
                        radioClass = 'border-stone-200';
                      }
                    } else if (isSelected) {
                      borderClass = 'border-amber-900 bg-stone-50 shadow-sm';
                      textClass = 'text-black font-medium';
                      radioClass = 'border-amber-900 bg-amber-900';
                    }

                    return (
                      <label 
                        key={optIndex} 
                        onClick={() => handleAnswerSelect(q.id, optIndex)}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${!quizState.submitted ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'} ${borderClass}`}
                      >
                        <div className="flex-shrink-0 pt-0.5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${radioClass}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <span className={`text-sm ${textClass}`}>{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {quizState.submitted && (
                  <div className={`mt-4 p-5 rounded-xl border ${isUserCorrectForThisQuestion ? 'bg-stone-100 border-stone-300' : 'bg-white border-stone-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isUserCorrectForThisQuestion ? <Smile className="text-black w-5 h-5" /> : <Frown className="text-stone-500 w-5 h-5" />}
                      <span className={`font-bold ${isUserCorrectForThisQuestion ? 'text-black' : 'text-stone-600'}`}>
                        {isUserCorrectForThisQuestion ? 'Correct answer' : 'Incorrect answer'}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isUserCorrectForThisQuestion ? 'text-stone-700' : 'text-stone-500'}`}>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {quizError && (
            <div className="bg-stone-100 text-stone-700 p-4 rounded-lg flex items-start gap-3 border border-stone-200">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{quizError}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
            {!quizState.submitted ? (
              <button onClick={handleSubmitQuiz} className="bg-amber-900 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm">Check Answers</button>
            ) : quizState.passed ? (
              <button onClick={() => { setAppState('student-dash'); setActiveModuleId(null); }} className="bg-black hover:bg-stone-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm">Complete Module</button>
            ) : (
              <button onClick={handleStartQuiz} className="bg-stone-800 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm">Retry Quiz</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupervisorSignoff = () => {
    if (!selectedStudentForSignoff) return null;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setAppState('supervisor-dash')} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Roster
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
            <FileSignature className="w-10 h-10 text-amber-900" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-black">Official Certification Sign-off</h1>
            <p className="text-stone-500 mt-2">
              <span className="font-bold text-black">{selectedStudentForSignoff.id}</span> has completed all requirements for <span className="font-bold text-black">{activeCert.title}</span>.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-left space-y-3">
            <h3 className="font-semibold text-black border-b border-stone-200 pb-2">Requirements Met</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-black"/> All {totalModules} Theoretical Modules Passed</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-black"/> All {totalPractical} Hands-on Practical Items Checked</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <p className="text-sm text-stone-500 mb-4 italic">
              "By signing off, I verify that I have reviewed this employee's knowledge and they are officially cleared for practical, unsupervised application at SELFishly Aesthetics & Wellness."
            </p>
            <button
              onClick={handleSupervisorSignoff}
              className="w-full flex justify-center items-center gap-2 bg-black hover:bg-stone-800 text-white px-6 py-3.5 rounded-lg font-bold transition-colors shadow-sm"
            >
              <UserCheck className="w-5 h-5" /> Execute Clinical Supervisor Sign Off
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCertificate = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <button onClick={() => setAppState('student-dash')} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <button onClick={() => window.print()} className="bg-amber-900 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Printer className="w-4 h-4"/> Print Certificate
        </button>
      </div>
      
      <div className="bg-white p-12 md:p-20 border-[16px] border-black rounded-lg shadow-2xl text-center print:shadow-none print:m-0 print:border-8">
        <div className="w-24 h-24 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-8">
          <Award className="w-12 h-12 text-amber-900" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-black mb-2">Certificate of Completion</h1>
        <p className="text-xl text-stone-500 tracking-widest uppercase mb-12">{activeCert.title}</p>
        
        <p className="text-lg text-stone-600 mb-4">This certifies that</p>
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 border-b-2 border-stone-200 inline-block px-12 pb-2">{currentUser?.name}</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-16">
          has successfully completed all theoretical coursework, device operation protocol, safety training, and hands-on practical requirements necessary to earn certification for {activeCert.title} at SELFishly Aesthetics & Wellness.
        </p>

        <div className="flex justify-around items-end pt-12 border-t border-stone-200">
          <div className="text-center">
            <p className="text-lg font-bold text-black font-serif italic">{currentSignoff?.by}</p>
            <div className="w-48 h-px bg-stone-300 my-2 mx-auto"></div>
            <p className="text-sm font-bold text-stone-500 uppercase">Clinical Supervisor</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-black">{currentSignoff?.at ? new Date(currentSignoff.at).toLocaleDateString() : 'N/A'}</p>
            <div className="w-48 h-px bg-stone-300 my-2 mx-auto"></div>
            <p className="text-sm font-bold text-stone-500 uppercase">Date of Certification</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-black selection:bg-stone-200">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-black tracking-tight leading-none">
                SELFishly <span className="font-normal text-amber-900">Aesthetics & Wellness</span>
              </span>
              <span className="text-[10px] font-bold text-stone-500 mt-1 tracking-widest uppercase">
                Learning Management System (LMS)
              </span>
            </div>
          </div>
          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
                <div className={`w-2 h-2 rounded-full ${currentUser.role === 'supervisor' ? 'bg-amber-900' : 'bg-black'}`}></div>
                <span className="text-sm font-medium text-stone-700">{currentUser.name}</span>
              </div>
              <button onClick={handleLogout} className="text-stone-400 hover:text-black transition-colors" title="Log Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
        {appState === 'login' && renderLogin()}
        {appState === 'student-dash' && renderStudentDashboard()}
        {appState === 'supervisor-dash' && renderSupervisorDashboard()}
        {appState === 'module' && renderModule()}
        {appState === 'quiz' && renderQuiz()}
        {appState === 'signoff' && renderSupervisorSignoff()}
        {appState === 'certificate' && renderCertificate()}
      </main>
    </div>
  );
}