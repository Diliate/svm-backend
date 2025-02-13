const prisma = require("../DB/db.config");

async function seed() {
  try {
    const products = await prisma.product.createMany({
      data: [
        {
          name: "CUFF-C Syrup  ",
          price: 229,
          indications:
            "Dry Cough, Allergic cough, Tonsilitis, Cough, Sinusitis, Nas bronchial allergy.",
          description:
            "CUFF-C Syrup provides natural, non-drowsy relief from dry and allergic  coughs, tonsillitis, sinusitis, and nasal allergies. It gently clears mucus, soothes  the throat, eases breathing, and reduces allergy symptoms—helping you feel  better without the drowsy side effects. Enjoy clear breathing and comfort all day long! ",
          inStock: true,
          categoryId: "d1df660d-8a98-424c-88c6-64a8695b0170",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline:
            "Changes In Season Has Every Reason for Cough & Congestion, A Herbal Cough Reliever",
          quantity: "200 ml",
          dosage:
            "One or Two teaspoon three times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "LIV- C SYRUP",
          price: 219,
          indications:
            "Hepatomegally, Alcoholic Liver Disease, Hepo Biliary Disorders, Loss of Appetite, Jaundice, Constipation.",
          description:
            "LIV-C Syrup protects the liver from harmful toxins, supports recovery from liver dysfunction, and aids in managing hepatitis and alcoholic liver issues. It boosts appetite, promotes growth, and is suitable for use alongside TB medications—making it ideal for comprehensive liver health and support.  ",
          inStock: true,
          categoryId: "0d323a55-a486-429b-9750-629e0d7cc85e",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline:
            "THE SUPERIOR STRENGTH GIVES CONVENIENT DOSAGE AND EXCELLENT EFFICIENCY ",
          quantity: "100 ml",
          dosage:
            "Two teaspoon three times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "MEDILIV – DS SYRUP",
          price: 329.99,
          indications:
            "Eniarged or Fatty Liver, Anorexia Hepalitis with or without Jaundice, Hepatic Dystunction & Nutritional Disorders.  ",
          description:
            "MEDILIV-DS Syrup helps protect the liver from harmful toxins, supports recovery from liver dysfunction, and aids in managing hepatitis and fatty liver. It boosts appetite, promotes growth, and is suitable as an add-on with TB medications—offering complete care for liver health and nutritional support.",
          inStock: true,
          categoryId: "0d323a55-a486-429b-9750-629e0d7cc85e",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "HIGH POTENCY OFFERS EASY DOSING AND EFFECTIVE RELIEF",
          quantity: "200 ml",
          dosage:
            "Two teaspoon three times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "ORTHONOVA OIL / CAPSULES",
          price: 119.99,
          indications:
            "Rheumatoid Arthritis Pain, Inflammation, Leg Cramps, Cervical & Lumber, Spondylosis, Stiffness, Backache & Muscular Pains.",
          description:
            "ORTHONOVA effectively relieves rheumatoid arthritis, inflammation, and muscle pain while reducing swelling and tenderness. It restores smooth, painfree movement of joints and enhances overall mobility. This powerful formula supports joint health, allowing you to engage in daily activities with ease. Trust ORTHONOVA for comprehensive pain management. ",
          inStock: true,
          categoryId: "d315b05e-9758-43a6-b8a7-32e252f57af7",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline:
            "RESTORE FLEXIBILITY OF JOINTS, A HERBAL MOBILITY RESTORER ",
          quantity: "",
          dosage:
            "To be massaged gently into the skin over the affected areas.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "MILAN TIME FORTE CAPSULES",
          price: 250,
          indications:
            "Strong aphrodisiac libido in both men and women, prevents functional impotence premature ejaculation and prolongs performance in men, spermatorrhoes, Impotency, Benign Prostatic enlargement. ",
          description:
            "MILAN TIME FORTE Capsules are a powerful aphrodisiac that boosts libido in both men and women. They help prevent functional impotence, premature ejaculation, and benign prostatic enlargement while enhancing stamina and confidence. This formula addresses sexual fatigue, loss oflibido, and erectile dysfunction. It also helps alleviate stress, anxiety, andirritability, promoting an improved mood for a fulfilling intimate experience.",
          inStock: true,
          categoryId: "a615a308-46f0-4220-ab89-7a9f6031e1d3",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "RESTORE SEXUAL AND EMOTIONAL VITALITY",
          quantity: "",
          dosage:
            "Take two Capsules with milk or water 1-2 times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "HI – TIME CAPSULES",
          price: 319,
          indications:
            "Strong aphrodisiac libido in both men and women, prevents functional impotence premature ejaculation and prolongs performance in men, spermatorrhoes, Impotancy, Benign Prostatic enlargement. ",
          description:
            "HI-TIME Capsules are designed to enhance libido in both men and women, prevent functional impotence, and prolong performance. They help boost stamina, confidence, and sexual endurance while addressing issues like sexual fatigue, premature ejaculation, and erectile dysfunction. This formula also relieves stress, anxiety, and irritability, promoting a balanced mood and overall well-being. ",
          inStock: true,
          categoryId: "a615a308-46f0-4220-ab89-7a9f6031e1d3",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "REVITALIZES SEXUAL PROWESS AND EMOTIONAL BALANCE",
          quantity: "",
          dosage:
            "Take two Hi-Time Gold Capsules with milk or water 1-2 times a day or as directed by the physician ",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: true,
        },
        {
          name: "BRAIN - UP SYRUP",
          price: 239,
          indications:
            "Nervine Tonic, Boosting Memory, Anxiety Neurosis, daily mental health supplement for professional, students & useful in migraine. ",
          description:
            "BRAIN-UP Syrup is a powerful nervine tonic that boosts memory, relieves anxiety, and supports daily mental health—ideal for students, professionals, and those dealing with migraines. It aids memory retention, learning skills, and helps prevent cognitive decline. BRAIN-UP reduces stress, anxiety, and mental fatigue while enhancing immunity, enabling sustained focus and intellectual activity. ",
          inStock: true,
          categoryId: "3564798d-d4fe-4626-b4a2-3d4607a6c330",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline:
            "FOR RAIN OF THOUGHTS IN BRAIN, A HERBAL NECTAR FOR BRAIN ",
          quantity: "200 ml",
          dosage:
            "One or Two teaspoon 3 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "CUFFY-DS COUGH SYRUP",
          price: 19.99,
          indications:
            "Dry Cough, Allergic cough, Tonsilitis, Whooping cough, Productive cough, Smoker’s cough, Sinusitis, Nasobronchial allergy. ",
          description:
            "This syrup provides effective relief from dry cough, allergic cough, tonsillitis, whooping cough, and sinusitis. It clears mucus, soothes the throat, and eases breathing with gentle bronchodilation. This non-sedative formula also reduces allergic reactions, making it ideal for managing coughs without causing drowsiness.",
          inStock: true,
          categoryId: "d1df660d-8a98-424c-88c6-64a8695b0170",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "A HERBAL EXPECTORANT WITH TULSI & HONEY",
          quantity: "",
          dosage:
            "One or two teaspoon three times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: true,
        },
        {
          name: "MOSAFA KHOON SYRUP",
          price: 293,
          indications:
            "Helps to purify blood, allergic & Chronic disorders of skin, Useful in boils, Eczema, scabies, Ringworm, Pimples, Fungal infections & Gout, Bring glow to skin. ",
          description:
            "MOSAFA KHOON Syrup helps purify the blood and supports skin health, providing relief from chronic skin conditions like eczema, boils, scabies, ringworm, pimples, and fungal infections. It promotes a natural glow to the skin, protects the liver from toxins, and aids in correcting liver dysfunction. Ideal for supporting liver health, it also boosts appetite and overall growth. ",
          inStock: true,
          categoryId: "b403a988-0584-4bd8-b62d-4462a815718f",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "A HERBAL BLOOD PRUIFIER ",
          quantity: "100 ml",
          dosage:
            "One or two teaspoon 3 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "VIC-Z-FORTE CAPSULES / SYRUP",
          price: 300,
          indications:
            "General weakness, Anorexia, Calcium deficiency, Chronic mental debility, Liver tonic, Nervousness, Indigestion Insomnia. ",
          description:
            "This tonic provides essential vitamins and minerals to combat general weakness, anorexia, calcium deficiency, and nervousness.It supports liver health, improves digestion, and helps with insomnia,strengthening the body’s resistance. Ideal for recovery and restoring vitality.",
          inStock: true,
          categoryId: "41998b58-c754-406c-aa2d-dd7c5d103582",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "ESSENTIAL VITAMINS & MINERALS FOR OPTIMAL HEALTH",
          quantity: "50",
          dosage:
            "One or two capsules three times a day or as directed by the physician.",
          imageUrls: ["image3.jpg", "image4.jpg"],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "MUFFER SYRUP / CAPSULES",
          price: 250,
          indications:
            "General tonic for physical and mental debility, Anaemia, Calcium deficiency, Chronic fatigue syndrome, General debility during pregnancy, Insomnia, Indigestion and Liver tonic. ",
          description:
            "MUFFER Syrup/Capsules provide a rich source of calcium, vitamin C, and iron, helping to combat physical and mental fatigue, anemia, calcium deficiency, and general weakness. It supports liver health, aids digestion, and promotes restful sleep. Ideal for use during pregnancy, recovery, and to strengthen the body's resistance.",
          inStock: true,
          categoryId: "41998b58-c754-406c-aa2d-dd7c5d103582",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "A COMPLETE TONIC FOR ALL AGES ",
          quantity: "",
          dosage:
            "One or two teaspoon 3 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "CAL-C SYRUP / CAPSULES",
          price: 300,
          indications:
            "Helps disintegration of Calculus, Flushes out crystal by diuretic action, helps relieve the pains, chronic infections.",
          description:
            "CAL-C Syrup/Capsules aid in the breakdown and removal of urinary stones, providing relief from pain and supporting urinary tract health. With strong antilithiatic and lithotriptic properties, CAL-C helps flush out crystals naturally and is effective in managing urinary calculi and chronic infections.",
          inStock: true,
          categoryId: "4e1ce729-21c4-4eb2-bd60-74ac606a9993",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "NATURALLY POWERFUL HERBAL REMEDY FOR CALCULUS CARE ",
          quantity: "50",
          dosage:
            "One or two capsules three times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "HEALTH-TONE SYRUP",
          price: 210,
          indications:
            "General tonic for physical and mental debility, Anaemia, Calcium deficiency, Chronic fatigue syndrome, General debility during pregnancy, Insomnia, Indigestion and Liver tonic.",
          description:
            "HEALTH TONE Syrup is a general tonic that helps address physical and mental debility, anemia, calcium deficiency, chronic fatigue, and indigestion. It supports liver health and provides relief during pregnancy. Additionally, it acts as a demulcent, offering natural relief in cough management, and works as a gentle bronchodilator to support normal breathing without sedative side effects.",
          inStock: true,
          categoryId: "7b747c4e-5940-41b8-bafe-9af4bec14fcc",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "Revitalize Your Health with Ayurvedic Medicine ",
          quantity: "200 ml",
          dosage:
            "One or two teaspoon 3 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: false,
        },
        {
          name: "DIAB-C CAPSULES",
          price: 180,
          indications:
            "General tonic for Diabetic control, Reduces risk of diabetic complications. ",
          description:
            "DIAB C Capsules help regulate blood sugar levels, reducing the risk of diabetic complications. This general tonic supports overall health,promoting balanced blood sugar and preventing common diabetes-related issues for improved well being. ",
          inStock: true,
          categoryId: "f66fcf58-01d5-45da-8bf5-59ccc1f5f63e",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "HERBAL SOLUTION FOR BALANCED BLOOD SUGAR LEVELS ",
          quantity: "",
          dosage:
            "One or two capsules three times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "PILE-C CAPSULES",
          price: 320,
          indications:
            "Useful in bleeding piles, Analfissure, Fistula internal, Haemarrhoids ",
          description:
            "PILE-C Capsules are effective in managing bleeding piles, anal fissures, fistulas, and hemorrhoids. They help alleviate pain, swelling, and itching in the anal region, and provide relief from chronic constipation that causes strain during bowel movements. PILE-C also aids in reducing bleeding during defecation caused by damaged blood vessels inflammation. ",
          inStock: true,
          categoryId: "4e1ce729-21c4-4eb2-bd60-74ac606a9993",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "FOR BLEEDING AND NON BLEEDING PILES",
          quantity: "",
          dosage:
            "One or two capsules 2 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: false,
        },
        {
          name: "RESLIM-A CAPSULES",
          price: 240,
          indications:
            "Reduce obesity and fat. Safe ayurvedic propriety medicine",
          description:
            "RESLIM-A Capsules are a safe and effective Ayurvedic remedy to help reduce obesity and burn body fat. They boost metabolism, suppress food cravings, and support healthy digestion. Packed with essential nutrients like potassium, calcium, and vitamin C, these capsules promote regular bowel movements and aid in achieving a healthier body. ",
          inStock: true,
          categoryId: "5de12734-110f-4f97-b67c-57439a9998e2",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "SIGNIFICANTLY REDUCES BELLY AND BODY FAT",
          quantity: "",
          dosage:
            " One or two capsules three times a day or as directed by the physician.",
          imageUrls: ["image3.jpg", "image4.jpg"],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "NERV-C CAPSULES",
          price: 190,
          indications: "Anxiety, Depression, Insomnia, Anti Stress",
          description:
            "NERV-C Capsules help alleviate symptoms of anxiety, mild to moderate depression, and insomnia. They effectively combat stress, promote relaxation, and improve mental resilience, supporting overall emotional well-being. ",
          inStock: true,
          categoryId: "3564798d-d4fe-4626-b4a2-3d4607a6c330",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "PRESERVES BRAIN, STIMULATES INNOVATIVE THINKING",
          quantity: "10",
          dosage:
            "One or two capsules 2 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: false,
        },
        {
          name: "BIG DESIRE CAPSULES",
          price: 230,
          indications:
            "Strong aphrodisiac libido in both men and women, prevents functional impotence premature ejaculation and prolongs performance in men, spermatorrhoes, impotancy, benign prostatic enlargement. ",
          description:
            "BIG DESIRE Capsules are a powerful aphrodisiac that boosts libido in both men and women. They help prevent functional impotence, premature ejaculation, and benign prostatic enlargement while enhancing sexual performance. These capsules also support erectile function, improve fertility, and promote overall reproductive health. ",
          inStock: true,
          categoryId: "a615a308-46f0-4220-ab89-7a9f6031e1d3",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "HERBAL AID FOR MEN’S PASSIONATE DRIVE ",
          quantity: "",
          dosage:
            "Take two Big Desire Capsules with milk or water 1-2 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "SHILAJIT CAPSULES",
          price: 260,
          indications:
            "Enhances overall energy and stamina, Boosts libido and supports reproductive health, Strengthens immune system. ",
          description:
            "SHILAJIT Capsules enhance overall energy, stamina, and libido while supporting reproductive health. They strengthen the immune system and offer a range of benefits, including anti-stress, antioxidant anti-obesity, anti cholesteremic, and anti-aging properties. These capsules also promote sexual health, help manage arthritis, diabetes, asthma, and anemia, contributing to a healthier, more vibrant life.",
          inStock: true,
          categoryId: "a615a308-46f0-4220-ab89-7a9f6031e1d3",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "ENHANCE VITALITY WITH SHILAJIT BLEND",
          quantity: "",
          dosage:
            "Take two Shilajit Capsules with milk or water 1-2 times a day or as directed by the physician. ",
          imageUrls: ["", "", "", ""],
          featured: true,
          limitedOffer: false,
        },
        {
          name: "ASHWAGANDHA CAPSULES",
          price: 450,
          indications:
            "Stress relief, improving energy levels, boosting immunity, enhancing cognitive function and memory, Supporting adrenal health and hormone balance. ",
          description:
            "ASHWAGANDHA Capsules help reduce anxiety and stress while boosting energy levels and immunity. They enhance cognitive function, improve memory, and support adrenal health and hormone balance, making them an effective general tonic for overall wellness. ",
          inStock: true,
          categoryId: "41998b58-c754-406c-aa2d-dd7c5d103582",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "ENHANCE VITALITY WITH ASHWAGANGHA BLEND",
          quantity: "",
          dosage:
            "Take two Ashwagangha Capsules with milk or water 1-2 times a day or as directed by the physician.",
          imageUrls: ["image3.jpg", "image4.jpg"],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "PLATE-WIN CAPSULES / SYRUP",
          price: 240,
          indications:
            "Help to enhance platelets enriched with Giloy, Tulsi, Papaya leaf, Kiwi, Wheat grass, Black pepper & Amla",
          description:
            "PLATE-WIN Capsules/Syrup are enriched with powerful ingredients like Giloy, Tulsi, Papaya leaf, Kiwi, Wheat grass, Black pepper, and Amla, designed to enhance platelet count. They provide immune system support and improve RBC production, making them beneficial for conditions like Dengue, Chikungunya, Swine Flu, Typhoid, and viral infections. Additionally, they aid in relieving acidity, indigestion, and flu symptoms. ",
          inStock: true,
          categoryId: "b403a988-0584-4bd8-b62d-4462a815718f",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "EFFECTIVE AGAINST VARIOUS VIRAL INFECTIONS",
          quantity: "",
          dosage: "15-20ml 3 times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: false,
          discount: 10.0,
          discountExpiry: new Date("2025-12-31T23:59:59"),
        },
        {
          name: "HEP-ZYME FORTE CAPSULES",
          price: 160,
          indications:
            "Anorexia, Indigestion & poor assimilation, Heartburn, Jaundice, Constipation, Loss of appetite, Hepatomegally, Hepo biliery disorders, Appetizer, Carminative, Antispasmodic, Gas troubles. ",
          description:
            "HEP-ZYME FORTE Capsules are designed to address anorexia, indigestion, heartburn, jaundice, and liver disorders. They act as an excellent liver tonic, especially for chronic and occasional drinkers, helping to improve liver function and increase serum albumin levels. These capsules are beneficial for conditions like fatty liver, hepatomegaly, hepatitis, and digestive issues such as gas troubles and constipation. They also stimulate appetite and support overall liver health. ",
          inStock: true,
          categoryId: "41998b58-c754-406c-aa2d-dd7c5d103582",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline: "PROMOTES LIVER HEALTH AND DETOXIFICATION ",
          quantity: "",
          dosage: `Infants: 3-5 drops twice a day.
          Children: 1.5 teaspoon twice a day.  
          Adults: 2-3 teaspoon 3-4 times a day. `,
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: true,
        },
        {
          name: "SVM ALLERGY RAKSHAK Avaleha",
          price: 240,
          indications: `Beneficial in Respiratory Allergies - Chronic cold & cough, Chronic sinusitis, Allergic rhintis, Asthma. 
          Skin Allergies: Eczema, Psoriasis, Scabies, Itchy skin, Skin rahes & Redness, Pimples.`,
          description:
            "SVM Allergy Rakshak is beneficial for managing respiratory allergies like chronic cold, cough, sinusitis, allergic rhinitis, and asthma. It also helps with skin allergies, including eczema, psoriasis, scabies, itchy skin, rashes, redness, and pimples. This special prash offers powerful relief from chronic cold, respiratory issues, and both skin and food allergies, effectively fighting all types of allergies. ",
          inStock: true,
          categoryId: "d1df660d-8a98-424c-88c6-64a8695b0170",
          precautions: [
            "Store in a cool and dry away from direct sunlight.",
            "Read the product label carefully before use.",
            "Keep out of reach of children.",
            "Do not exceed the recommended dosage ",
          ],
          punchline:
            "RELIEVES RESPIRATORY ALLERGIES, PROMOTES BREATHING WELLNESS ",
          quantity: "",
          dosage:
            "1-2 tablets three times a day or as directed by the physician.",
          imageUrls: ["", "", "", ""],
          featured: false,
          limitedOffer: false,
        },
      ],
    });

    console.log(`Successfully seeded ${products.count} products.`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
