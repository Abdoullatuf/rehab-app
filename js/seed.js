/**
 * SEED DATA - MonProg v4
 * Catalogue par defaut et mise a niveau des donnees locales.
 */

const CATALOG_VERSION = '2026-04-09-full-catalog-v1';

const RAW_PROGRAMS = [
    {
        "id": "football_recomp_2026",
        "name": "Football Endurance + Recomp",
        "category": "Performance & Recomposition",
        "description": "3 seances full body par semaine | 8 semaines | droit femoral et bas du dos integres",
        "duration": 8,
        "sessionsPerWeek": 3,
        "disclaimer": true,
        "phases": [
            {
                "id": 1,
                "name": "Seance A - full body force technique",
                "weeks": "1-8",
                "description": "Base force + cardio modere avec progression douce et dos neutre.",
                "frequency": "Mercredi",
                "rule": "Douleur acceptable 0 a 2/10. A 3 a 5/10 on reduit. Au-dela de 5/10 on modifie."
            },
            {
                "id": 2,
                "name": "Seance B - hypertrophie protegee",
                "weeks": "1-8",
                "description": "Volume utile, travail unilateral prudent et intervalles controles.",
                "frequency": "Samedi",
                "rule": "Les fentes ne passent que si tendon et dos restent calmes le jour meme et le lendemain."
            },
            {
                "id": 3,
                "name": "Seance C - endurance musculaire",
                "weeks": "1-8",
                "description": "Capacite de travail, volume controle et cardio de fin de seance.",
                "frequency": "Dimanche",
                "rule": "Toujours garder 2 repetitions de marge sur les pompes et les tirages."
            }
        ]
    },
    {
        "id": "force_fullbody",
        "name": "Force Full Body — Personnalisé",
        "category": "Force & Performance",
        "description": "Programme 3 séances/semaine alternées A/B/C | 12 semaines | Bas du dos & droit fémoral intégrés",
        "duration": 12,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Séance A — Full Body Bas du Corps",
                "weeks": "1–12",
                "description": "Accent quadriceps, chaîne postérieure et renforcement progressif du bas du dos.",
                "frequency": "Rotation A → B → C (1 séance sur 3)",
                "rule": "Douleur max 2/10 sur tous les exercices"
            },
            {
                "id": 2,
                "name": "Séance B — Full Body Haut du Corps",
                "weeks": "1–12",
                "description": "Accent pectoraux, dos, épaules et bras. Séance équilibrée poussée / tirage.",
                "frequency": "Rotation A → B → C (1 séance sur 3)"
            },
            {
                "id": 3,
                "name": "Séance C — Renforcement Ciblé & Récupération Active",
                "weeks": "1–12",
                "description": "Renforcement bas du dos + droit fémoral droit + mobilité. Séance complémentaire essentielle.",
                "frequency": "Rotation A → B → C (1 séance sur 3)",
                "rule": "Priorité qualité d'exécution — douleur max 2/10"
            }
        ]
    },
    {
        "id": "rehab_femoral",
        "name": "Rééducation — Droit Fémoral",
        "category": "Réhabilitation",
        "description": "Tendinopathie proximale | 12 semaines",
        "duration": 12,
        "disclaimer": true,
        "phases": [
            {
                "id": 1,
                "name": "Soulagement & Activation",
                "weeks": "1–3",
                "description": "Réduire la douleur, activer le muscle sans stress sur le tendon.",
                "frequency": "1×/jour, 5–7 jours/semaine",
                "rule": "Douleur max 3/10"
            },
            {
                "id": 2,
                "name": "Renforcement progressif",
                "weeks": "4–6",
                "description": "Renforcer le droit fémoral en charge progressive.",
                "frequency": "1 jour sur 2 (3–4×/semaine)",
                "rule": "Douleur max 2/10"
            },
            {
                "id": 3,
                "name": "Renforcement intensif & Pliométrie",
                "weeks": "7–9",
                "description": "Préparer le tendon aux contraintes explosives.",
                "frequency": "3×/semaine (jours alternés)",
                "rule": "Douleur max 3/10"
            },
            {
                "id": 4,
                "name": "Retour au football",
                "weeks": "10–12",
                "description": "Retrouver le geste sportif complet progressivement.",
                "frequency": "3×/semaine sport + 2× renforcement"
            }
        ]
    },
    {
        "id": "renfo_jambes",
        "name": "Force — Jambes Complètes",
        "category": "Force & Hypertrophie",
        "description": "Développer force et masse des jambes | 8 semaines",
        "duration": 8,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Activation & Fondamentaux",
                "weeks": "1–2",
                "description": "Maîtriser les mouvements de base avec bonne technique.",
                "frequency": "4×/semaine"
            },
            {
                "id": 2,
                "name": "Hypertrophie & Volume",
                "weeks": "3–6",
                "description": "Augmenter le volume d'entraînement pour stimuler la croissance musculaire.",
                "frequency": "4×/semaine"
            },
            {
                "id": 3,
                "name": "Force Maximale",
                "weeks": "7–8",
                "description": "Travailler à haute intensité pour maximiser la force.",
                "frequency": "3–4×/semaine"
            }
        ]
    },
    {
        "id": "core_gainage",
        "name": "Core & Gainage",
        "category": "Stabilité",
        "description": "Renforcer le centre du corps et la stabilité | 6 semaines",
        "duration": 6,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Fondamentaux du gainage",
                "weeks": "1–2",
                "description": "Maîtriser les exercices de base pour activer les muscles profonds.",
                "frequency": "5×/semaine (15–20 min)"
            },
            {
                "id": 2,
                "name": "Progression & Dynamique",
                "weeks": "3–4",
                "description": "Intégrer des mouvements dynamiques pour un gainage fonctionnel.",
                "frequency": "5×/semaine"
            },
            {
                "id": 3,
                "name": "Force & Rotation",
                "weeks": "5–6",
                "description": "Intégrer les rotations et la force du core en amplitude.",
                "frequency": "4×/semaine"
            }
        ]
    },
    {
        "id": "mobilite",
        "name": "Mobilité & Flexibilité",
        "category": "Récupération",
        "description": "Améliorer la mobilité articulaire | 4 semaines",
        "duration": 4,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Mobilité globale",
                "weeks": "1–4",
                "description": "Travailler quotidiennement sur la mobilité de toutes les articulations clés.",
                "frequency": "Quotidien (15–20 min)"
            }
        ]
    },
    {
        "id": "haut_corps",
        "name": "Force — Haut du Corps",
        "category": "Force & Hypertrophie",
        "description": "Renforcer poitrine, dos, épaules et bras | 8 semaines",
        "duration": 8,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Activation & Technique",
                "weeks": "1–2",
                "description": "Maîtriser les mouvements fondamentaux du haut du corps.",
                "frequency": "4×/semaine (push/pull)"
            },
            {
                "id": 2,
                "name": "Hypertrophie",
                "weeks": "3–6",
                "description": "Volume d'entraînement élevé pour stimuler la croissance musculaire.",
                "frequency": "4–5×/semaine (split push/pull/legs)"
            },
            {
                "id": 3,
                "name": "Force Maximale",
                "weeks": "7–8",
                "description": "Séances courtes et intenses à haute charge.",
                "frequency": "3×/semaine"
            }
        ]
    },
    {
        "id": "hiit_cardio",
        "name": "HIIT & Conditionnement",
        "category": "Cardio & Endurance",
        "description": "Brûler des calories et améliorer l'endurance | 4 semaines",
        "duration": 4,
        "disclaimer": false,
        "phases": [
            {
                "id": 1,
                "name": "Initiation HIIT",
                "weeks": "1–2",
                "description": "S'initier au HIIT avec des ratios travail/repos adaptés.",
                "frequency": "3–4×/semaine"
            },
            {
                "id": 2,
                "name": "HIIT Avancé",
                "weeks": "3–4",
                "description": "Intervalles plus intenses pour maximiser la combustion.",
                "frequency": "4×/semaine"
            }
        ]
    }
];

const RAW_EXERCISES = [
    {
        "id": "fr26a0",
        "name": "Echauffement A",
        "meta": "10-12 min | avant seance",
        "purpose": "Preparer hanches, tronc et epaules avant les charges.",
        "steps": [
            "5 min de velo tranquille",
            "Mobilite douce hanches, chevilles et epaules",
            "Bird dog 2 x 6 par cote",
            "Dead bug 2 x 6 par cote",
            "2 series legeres du premier exercice"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a1",
        "name": "Presse a cuisses",
        "meta": "4 x 8 | repos 2 min",
        "purpose": "Travailler les quadriceps sans grosse charge axiale sur le dos.",
        "steps": [
            "Regler le siege pour garder le bassin stable",
            "Descendre controle jusqu a une amplitude confortable",
            "Ne pas ecraser le bas du dos en bas du mouvement",
            "Pousser fort sans verrouiller brutalement les genoux"
        ],
        "progression": "Commencer vers 50 kg si propre, puis monter de 2,5 a 5 kg quand les 4 series passent.",
        "warning": "Si douleur dos ou tendon > 3/10, reduire charge ou amplitude.",
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a2",
        "name": "Developpe couche halteres ou chest press",
        "meta": "4 x 6 a 8 | repos 2 min",
        "purpose": "Construire la force du haut du corps sans fatigue inutile.",
        "steps": [
            "Pieds stables au sol et omoplates serrees",
            "Descendre controle",
            "Pousser fort sans perdre la trajectoire",
            "Garder 1 a 2 reps de marge"
        ],
        "progression": "Rester aux halteres de 16 kg tant que la fourchette haute n est pas propre.",
        "warning": "Arreter avant l echec musculaire.",
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a3",
        "name": "Rowing assis poulie",
        "meta": "4 x 8 a 10 | repos 90 sec",
        "purpose": "Renforcer le dos et l equilibre poussee / tirage.",
        "steps": [
            "Buste stable et poitrine ouverte",
            "Tirer les coudes vers l arriere",
            "Serrer les omoplates 1 sec",
            "Revenir lentement"
        ],
        "progression": "Ajouter un peu de charge quand 4 x 10 sont propres.",
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a4",
        "name": "Hip thrust machine ou barre guidee",
        "meta": "3 x 8 a 10 | repos 90 sec",
        "purpose": "Renforcer les fessiers pour proteger le bas du dos.",
        "steps": [
            "Monter le bassin en gardant les cotes rentrees",
            "Marquer 1 a 2 sec en haut",
            "Redescendre sans perdre le controle"
        ],
        "progression": "Monter progressivement si aucune gene lombaire.",
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a5",
        "name": "Tirage vertical",
        "meta": "3 x 8 a 10 | repos 90 sec",
        "purpose": "Donner du volume au dos et soutenir les tractions.",
        "steps": [
            "Poitrine sortie et epaules basses",
            "Tirer les coudes vers les hanches",
            "Revenir controle en haut"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a6",
        "name": "Pallof press",
        "meta": "3 x 10 par cote | repos 45 sec",
        "purpose": "Stabiliser le tronc sans flexion ni extension agressive.",
        "steps": [
            "Se placer de profil au cable",
            "Pousser les mains devant soi sans tourner",
            "Tenir 1 sec puis revenir"
        ],
        "warning": "Si le dos vrille ou bouge, diminuer la charge.",
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26a7",
        "name": "Cardio zone 2",
        "meta": "12 a 15 min | velo ou elliptique",
        "purpose": "Ameliorer l endurance utile au football sans stress excessif.",
        "steps": [
            "Rester a intensite moderee",
            "Tu dois pouvoir parler en phrases courtes",
            "Sortir de seance plus chaud, pas epuise"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 1
    },
    {
        "id": "fr26b0",
        "name": "Echauffement B",
        "meta": "10-12 min | avant seance",
        "purpose": "Preparer les jambes et le tronc a un travail plus volumineux.",
        "steps": [
            "5 min de velo",
            "Montees de genoux douces sans impact",
            "Mobilite de hanches",
            "Planche laterale 2 x 20 sec par cote"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b1",
        "name": "Hack squat ou presse inclinee",
        "meta": "3 x 10 | repos 2 min",
        "purpose": "Monter le volume quadriceps dans un cadre stable.",
        "steps": [
            "Garder le bassin colle au support",
            "Descendre controle",
            "Monter sans a-coup",
            "Ne pas chercher la charge max"
        ],
        "progression": "Ajouter des reps puis un peu de charge quand la technique reste propre.",
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b2",
        "name": "Developpe incline machine ou halteres",
        "meta": "3 x 8 a 10 | repos 90 sec",
        "purpose": "Volume du haut du corps avec bonne stabilite.",
        "steps": [
            "Appuis solides",
            "Descente controlee",
            "Poussee reguliere",
            "Rester a 1 ou 2 reps de l echec"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b3",
        "name": "Rowing poitrine appuyee",
        "meta": "3 x 10 | repos 90 sec",
        "purpose": "Tirer sans fatigue lombaire excessive.",
        "steps": [
            "Poitrine appuyee au support",
            "Tirer les coudes vers l arriere",
            "Controler le retour"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b4",
        "name": "Leg curl assis ou couche",
        "meta": "3 x 10 a 12 | repos 75 sec",
        "purpose": "Renforcer les ischios pour equilibrer le travail des quadriceps.",
        "steps": [
            "Contracter fort en fin de flexion",
            "Redescendre lentement",
            "Eviter tout mouvement parasite du bassin"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b5",
        "name": "Split squat ou fente arriere legere",
        "meta": "2 a 3 x 8 par jambe | repos 75 sec",
        "purpose": "Stabilite unilaterale et controle de bassin.",
        "steps": [
            "Commencer au poids du corps ou leger",
            "Descendre sans impact",
            "Garder le buste stable",
            "Pousser par le pied avant"
        ],
        "progression": "N augmenter la charge que si aucune gene notable n apparait le lendemain.",
        "warning": "A supprimer si le tendon ou le dos reagit.",
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b6",
        "name": "Elevations laterales",
        "meta": "3 x 12 a 15 | repos 45 sec",
        "purpose": "Volume deltoides sans fatigue systemique importante.",
        "steps": [
            "Monter les bras jusqu a la ligne des epaules",
            "Controler la descente",
            "Ne pas hausser les epaules"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b7",
        "name": "Planche laterale",
        "meta": "3 x 20 a 30 sec par cote",
        "purpose": "Stabilite laterale du tronc et protection lombaire.",
        "steps": [
            "Aligner tete, bassin et chevilles",
            "Garder les hanches hautes",
            "Respirer normalement"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26b8",
        "name": "Intervalles controles",
        "meta": "8 x 30 sec modere/rapide + 60 sec facile",
        "purpose": "Travailler le cardio football sans faire de sprint maximal.",
        "steps": [
            "Faire les repetitions au velo",
            "Rester propre techniquement",
            "Ne pas transformer cela en sprint max"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 2
    },
    {
        "id": "fr26c0",
        "name": "Echauffement C",
        "meta": "10-12 min | avant seance",
        "purpose": "Preparer une seance orientee endurance musculaire.",
        "steps": [
            "5 min de rameur leger ou velo",
            "Dead bug 2 x 6",
            "Bird dog 2 x 6",
            "Squat poids du corps 2 x 8"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c1",
        "name": "Goblet squat ou presse legere",
        "meta": "3 x 12 | repos 90 sec",
        "purpose": "Volume quadriceps en restant loin des charges lourdes.",
        "steps": [
            "Tenir l haltere contre la poitrine ou choisir une presse legere",
            "Descendre avec controle",
            "Monter sans perdre le gainage"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c2",
        "name": "Pompes",
        "meta": "3 series avec 2 reps de marge | repos 75 sec",
        "purpose": "Endurance musculaire du haut du corps.",
        "steps": [
            "Corps gaine",
            "Descendre proprement",
            "S arreter 2 reps avant l echec"
        ],
        "progression": "Quand 3 series deviennent faciles, monter doucement le total de reps.",
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c3",
        "name": "Tractions assistees ou tirage vertical",
        "meta": "3 x 6 a 8 | repos 90 sec",
        "purpose": "Renforcer le tirage vertical dans une zone de travail propre.",
        "steps": [
            "Epaules basses",
            "Tirer sans balancer",
            "Revenir lentement"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c4",
        "name": "Rowing poulie basse",
        "meta": "3 x 12 | repos 75 sec",
        "purpose": "Augmenter la capacite de travail du dos avec stress lombaire faible.",
        "steps": [
            "Poitrine ouverte",
            "Trajet controle",
            "Retour lent"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c5",
        "name": "Pull-through poulie ou extension 45 degres legere",
        "meta": "2 a 3 x 12 | repos 60 sec",
        "purpose": "Travailler la charniere hanche-tronc sans deadlift lourd.",
        "steps": [
            "Garder un dos neutre",
            "Bouger depuis les hanches",
            "Finir avec les fessiers"
        ],
        "warning": "Si le dos tire en fin d amplitude, reduire la charge et l amplitude.",
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c6",
        "name": "Curl biceps + extension triceps poulie",
        "meta": "2 x 12 a 15 de chaque | repos 45 sec",
        "purpose": "Petit volume bras sans fatigue excessive.",
        "steps": [
            "Execution propre",
            "Controle sur toute l amplitude",
            "Pas de triche du buste"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c7",
        "name": "Cardio progressif",
        "meta": "10 min | 1 min moderee / 1 min plus rapide x 5",
        "purpose": "Finir la seance avec un effort cardio utile et controlable.",
        "steps": [
            "Rester en controle respiratoire",
            "Si match de foot prevu, reduire ce bloc",
            "Sortir de seance plus fatigue cardio que musculaire"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fr26c8",
        "name": "Routine tendon / dos",
        "meta": "8 min | apres seance ou jours off",
        "purpose": "Entretenir la progression du droit femoral et du bas du dos.",
        "steps": [
            "Leg extension isometrique 4 x 20 a 30 sec",
            "Bird dog 2 x 6 par cote",
            "Dead bug 2 x 6 par cote",
            "McGill curl-up modifie 2 x 8",
            "Marche 10 a 20 min si possible"
        ],
        "programId": "football_recomp_2026",
        "phaseId": 3
    },
    {
        "id": "fb1e1",
        "name": "Squat haltères / barre",
        "meta": "Ph 1–4 : 4×6 | Ph 5–8 : 4×5 | Ph 9–12 : 5×5",
        "purpose": "Exercice roi du bas du corps : quadriceps, fessiers, chaîne postérieure. Progression charge linéaire.",
        "steps": [
            "Pieds largeur d'épaules, orteils légèrement ouverts",
            "Haltères à l'épaule ou barre position haute",
            "Inspirer, gainage fort — descendre contrôlé 3 sec jusqu'à parallèle",
            "Genoux dans l'axe des pieds — jamais vers l'intérieur",
            "Pousser fort dans le sol, expirer en remontant"
        ],
        "progression": "Augmenter de 2,5 kg quand les séries sont maîtrisées (≤ RPE 8).",
        "warning": "Dos toujours neutre — ne jamais arrondir les lombaires sous charge.",
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb1e2",
        "name": "Soulevé de terre roumain",
        "meta": "3×8 rép | Tempo 3-1-2 | Poids modéré",
        "purpose": "Renforcer ischio-jambiers, fessiers et érecteurs du rachis. Clé pour le bas du dos sans compression.",
        "steps": [
            "Debout, haltères ou barre devant les cuisses",
            "Légère flexion des genoux fixe tout au long",
            "Pencher le buste dos plat — hanches poussées vers l'arrière",
            "Descendre jusqu'à mi-tibia en sentant l'étirement des ischios",
            "Remonter en contractant les fessiers et poussant les hanches en avant"
        ],
        "progression": "Commencer à 50–60 % du max. Augmenter 2,5 kg/semaine si douleur dos = 0/10.",
        "warning": "Jamais arrondir le bas du dos. Réduire l'amplitude si gêne lombaire.",
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb1e3",
        "name": "Leg press",
        "meta": "3×10–12 rép | Tempo 3-1-2",
        "purpose": "Force quadriceps sans charge axiale sur le dos. Idéal pour travailler le droit fémoral droit en sécurité.",
        "steps": [
            "Assis, pieds à largeur d'épaules sur la plateforme",
            "Descendre contrôlé 3 sec jusqu'à 90° de flexion",
            "Ne jamais verrouiller les genoux en extension",
            "Pousser fort pour remonter — les deux jambes symétriquement",
            "Vérifier que le genou droit ne dévie pas vers l'intérieur"
        ],
        "progression": "Augmenter de 5–10 kg quand 3 séries sont confortables.",
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb1e4",
        "name": "Tirage horizontal câble / haltère",
        "meta": "4×10 rép | Tempo 2-1-3",
        "purpose": "Équilibre poussée/tirage. Renforce dos, rhomboïdes et correcteurs posturaux.",
        "steps": [
            "Saisir la poignée ou l'haltère à hauteur de poitrine",
            "Dos légèrement incliné, gainage actif",
            "Tirer en ramenant les coudes près du corps — épaules basses",
            "Serrer les omoplates 1 sec en fin de mouvement",
            "Revenir lentement 3 sec — bras presque tendus"
        ],
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb1e5",
        "name": "Pont fessier unilatéral",
        "meta": "3×10 rép par jambe | Tempo 2-2-2",
        "purpose": "Renforcer les fessiers en unilatéral — corrige les déséquilibres D/G et soulage le bas du dos.",
        "steps": [
            "Allongé sur le dos, un genou fléchi, l'autre jambe tendue vers le plafond",
            "Serrer le fessier porteur et soulever le bassin",
            "Maintenir 2 sec — bassin parfaitement horizontal",
            "Redescendre lentement 2 sec",
            "Compléter toutes les reps d'un côté, puis changer"
        ],
        "progression": "Ajouter un élastique sur les hanches quand le geste est maîtrisé.",
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb1e6",
        "name": "Gainage planche avec variation",
        "meta": "3×30–45 sec | Repos 30 sec",
        "purpose": "Stabiliser le tronc et protéger le bas du dos lors des charges lourdes.",
        "steps": [
            "Appui sur avant-bras, corps parfaitement aligné",
            "Pas de creux dorsal ni de fesses en l'air",
            "Contracter abdos + fessiers + quadriceps simultanément",
            "Respirer régulièrement — ne jamais bloquer",
            "Variation : lever alternativement un bras ou une jambe"
        ],
        "progression": "Augmenter de 5 sec/semaine ou passer à la planche avec élévation.",
        "programId": "force_fullbody",
        "phaseId": 1
    },
    {
        "id": "fb2e1",
        "name": "Développé couché haltères / barre",
        "meta": "Ph 1–4 : 4×8 | Ph 5–8 : 4×5 | Ph 9–12 : 5×3–5",
        "purpose": "Développer la force des pectoraux, deltoïdes antérieurs et triceps.",
        "steps": [
            "Allongé sur banc plat, pieds fermement au sol",
            "Barre ou haltères à hauteur des pectoraux, coudes à 45–75° du buste",
            "Inspirer — descendre contrôlé 3 sec jusqu'à effleurer la poitrine",
            "Pousser explosif en expirant — verrouillage partiel des coudes en haut",
            "Omoplates rétractées et déprimées tout au long"
        ],
        "progression": "Augmenter de 2,5 kg par semaine si technique parfaite et RPE ≤ 8.",
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb2e2",
        "name": "Tractions / Lat pulldown",
        "meta": "4×6–8 rép",
        "purpose": "Développer la largeur du dos (grand dorsal). Exercice fondamental de tirage vertical.",
        "steps": [
            "Saisir la barre en pronation, écart légèrement plus large que les épaules",
            "Partir bras tendus — ne pas tricher avec les épaules",
            "Tirer en amenant les coudes vers les hanches, poitrine vers la barre",
            "Omoplates abaissées et rétractées en bas du mouvement",
            "Revenir lentement 3 sec jusqu'à extension complète"
        ],
        "progression": "Tractions impossible → lat pulldown → tractions assistées → tractions lestées.",
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb2e3",
        "name": "Développé militaire haltères",
        "meta": "3×8–10 rép | Tempo 2-1-2",
        "purpose": "Renforcer les deltoïdes et stabiliser les épaules. Améliore la posture et le gainage du buste.",
        "steps": [
            "Assis ou debout, haltères à hauteur des épaules, paumes vers l'avant",
            "Gainage fort — pousser les haltères au-dessus de la tête",
            "Terminer bras tendus, biceps proches des oreilles",
            "Redescendre contrôlé 2 sec",
            "Jamais cambrer le dos — si cambrure, réduire le poids"
        ],
        "warning": "Dos neutre impératif. La cambrure lombaire est la cause n°1 de blessure sur cet exercice.",
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb2e4",
        "name": "Rowing haltère unilatéral",
        "meta": "3×10 rép par bras | Tempo 2-1-3",
        "purpose": "Renforcer le grand dorsal en unilatéral. Corrige les déséquilibres gauche-droite.",
        "steps": [
            "Un genou et une main sur le banc — buste parallèle au sol",
            "Saisir l'haltère, bras tendu vers le bas",
            "Tirer en ramenant le coude au-dessus du buste (pas vers l'extérieur)",
            "Maintenir 1 sec en haut",
            "Redescendre lentement 3 sec jusqu'à extension complète"
        ],
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb2e5",
        "name": "Dips ou Pushdown triceps",
        "meta": "3×10–12 rép",
        "purpose": "Isoler les triceps — essentiel pour progresser sur le développé couché.",
        "steps": [
            "Dips : appui sur barres parallèles, descendre jusqu'à 90° de flexion du coude",
            "Ou Pushdown câble : coudes fixes le long du buste, pousser vers le bas",
            "Contrôler la descente 2 sec",
            "Extension complète en bas — 1 sec de contraction",
            "Revenir lentement"
        ],
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb2e6",
        "name": "Curl biceps haltères alternés",
        "meta": "3×12 rép",
        "purpose": "Isoler les biceps et renforcer les fléchisseurs du coude.",
        "steps": [
            "Debout, haltères dans chaque main, paumes vers l'avant",
            "Fléchir un bras en supinant le poignet en haut",
            "Maintenir 1 sec — redescendre lentement 2 sec",
            "Alterner les bras",
            "Coudes fixes contre le corps — ne pas tricher avec les épaules"
        ],
        "programId": "force_fullbody",
        "phaseId": 2
    },
    {
        "id": "fb3e1",
        "name": "Squat bulgare",
        "meta": "3×8–10 rép par jambe | Tempo 3-1-2",
        "purpose": "Renforcement intensif du quadriceps (droit fémoral) en position étirée. Corrige les déséquilibres D/G.",
        "steps": [
            "Pied arrière posé sur un banc (à hauteur de genou environ)",
            "Pied avant stable, à 60–70 cm du banc",
            "Descendre lentement 3 sec — sentir l'étirement à l'avant de la hanche côté arrière",
            "Maintenir 1 sec en bas",
            "Pousser sur le talon du pied avant pour remonter en 2 sec"
        ],
        "progression": "Sans poids → haltères 2 kg → 4 kg → 6 kg. Progresser lentement côté droit.",
        "warning": "Commencer par le côté DROIT pour égalité d'effort. Douleur droit fémoral > 2/10 : arrêter.",
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "fb3e2",
        "name": "Extension genou excentrique — droit fémoral",
        "meta": "3×10 rép | Descente 4 sec",
        "purpose": "Renforcement excentrique du droit fémoral droit — méthode la plus efficace pour la prévention tendineuse.",
        "steps": [
            "Assis sur banc ou machine, pieds ne touchant pas le sol",
            "Tendre les deux jambes simultanément (concentrique assisté)",
            "Descendre UNIQUEMENT avec la jambe droite — très lentement 4 sec",
            "Remonter avec l'aide de la jambe gauche",
            "Répéter — la fatigue du droit fémoral droit doit être progressive"
        ],
        "progression": "Sem 1–4 : 3×8 sans lest | Sem 5–8 : 3×10 + 0,5 kg | Sem 9–12 : 3×10 + 1–1,5 kg.",
        "warning": "Exercice prioritaire. Douleur > 3/10 : réduire le lest ou l'amplitude.",
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "fb3e3",
        "name": "Hip thrust",
        "meta": "4×12 rép | Pause 2 sec en haut",
        "purpose": "Activation maximale des fessiers — protège les disques lombaires et renforce la chaîne postérieure.",
        "steps": [
            "Dos appuyé sur le bord d'un banc, épaules au niveau du bord supérieur",
            "Barre sur les hanches (avec pad/serviette) ou haltère sur le bas du ventre",
            "Pousser les hanches vers le haut — contracter les fessiers au maximum",
            "Maintenir 2 sec en haut — vérifier symétrie D/G",
            "Redescendre lentement 2 sec — ne pas toucher le sol complètement"
        ],
        "progression": "Commencer poids de corps → barre seule → ajouter 5–10 kg/semaine.",
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "fb3e4",
        "name": "Bird-dog lent",
        "meta": "3×10 rép par côté | Tempo 3-3-3",
        "purpose": "Renforcer les stabilisateurs lombaires profonds sans compression — le meilleur exercice pour le bas du dos.",
        "steps": [
            "À quatre pattes, mains sous les épaules, genoux sous les hanches",
            "Étendre lentement le bras droit et la jambe gauche simultanément (3 sec)",
            "Maintenir 3 sec — dos parfaitement plat, pas de rotation du bassin",
            "Revenir lentement 3 sec au centre",
            "Alterner les côtés avec gainage parfait"
        ],
        "progression": "Ajouter des lests aux chevilles (0,5–1 kg) quand 3×10 est facile.",
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "fb3e5",
        "name": "Gainage latéral avec rotation",
        "meta": "3×8 rép par côté",
        "purpose": "Renforcer les obliques et la stabilité latérale du rachis. Prévient les blessures lombaires.",
        "steps": [
            "Planche latérale sur avant-bras, corps aligné",
            "Passer le bras libre sous le corps en rotation contrôlée",
            "Revenir en dérotant lentement à la position de départ",
            "Hanches stables et hautes pendant toute la rotation",
            "Alterner les côtés après toutes les reps"
        ],
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "fb3e6",
        "name": "Étirement actif psoas-quadriceps",
        "meta": "3×30 sec par côté",
        "purpose": "Libérer les fléchisseurs de hanche — essentiel pour le droit fémoral et le bas du dos.",
        "steps": [
            "Position chevalier servant (genou droit au sol)",
            "Avancer doucement le bassin vers l'avant",
            "Contracter simultanément abdominaux et fessier du côté genou au sol",
            "Sentir un étirement doux à l'avant de la hanche (jamais douloureux)",
            "Maintenir 30 sec en respirant profondément"
        ],
        "warning": "Étirement du droit fémoral droit : toujours DOUX. Ne jamais forcer.",
        "programId": "force_fullbody",
        "phaseId": 3
    },
    {
        "id": "rf1e1",
        "name": "Isométrique mural",
        "meta": "5 × 30–45 sec | Repos 30 sec",
        "purpose": "Activer le droit fémoral sans mouvement articulaire.",
        "steps": [
            "Dos contre un mur, pieds à 50 cm",
            "Descendre en position «chaise» (60° de flexion)",
            "Maintenir 30–45 secondes",
            "Pousser fort dans le sol",
            "Repos 30 sec entre séries"
        ],
        "warning": "Si douleur hanche > 3/10, remonter un peu la position.",
        "programId": "rehab_femoral",
        "phaseId": 1
    },
    {
        "id": "rf1e2",
        "name": "Isométrique flexion hanche",
        "meta": "5 × 20 sec | Repos 20 sec",
        "purpose": "Activer le droit fémoral dans sa fonction de fléchisseur de hanche.",
        "steps": [
            "Debout, dos contre un mur",
            "Lever le genou droit à 45°",
            "Placer les mains sur le genou, pousser vers le bas",
            "Résister avec la cuisse (genou immobile)",
            "Maintenir 20 sec à 50 % de force max"
        ],
        "progression": "Augmenter l'intensité progressivement (60 %, 70 %, 80 %).",
        "programId": "rehab_femoral",
        "phaseId": 1
    },
    {
        "id": "rf1e3",
        "name": "Pont fessier",
        "meta": "3 × 12 rép",
        "purpose": "Renforcer la chaîne postérieure pour équilibrer et soulager la hanche.",
        "steps": [
            "Allongé sur le dos, genoux fléchis",
            "Serrer les fessiers et soulever le bassin",
            "Alignement épaules–hanches–genoux",
            "Maintenir 3 sec en haut",
            "Redescendre lentement (3 sec)"
        ],
        "programId": "rehab_femoral",
        "phaseId": 1
    },
    {
        "id": "rf1e4",
        "name": "Gainage ventral",
        "meta": "3 × 30 sec | Repos 30 sec",
        "purpose": "Stabiliser le bassin et réduire le stress sur l'insertion tendineuse.",
        "steps": [
            "Appui sur avant-bras et pointes de pieds",
            "Corps parfaitement aligné",
            "Serrer les abdos, «rentrer le nombril»",
            "Maintenir 30 sec en respirant normalement"
        ],
        "programId": "rehab_femoral",
        "phaseId": 1
    },
    {
        "id": "rf2e1",
        "name": "Squat partiel",
        "meta": "4 × 12 rép | Tempo 3-1-3",
        "purpose": "Renforcement fonctionnel du quadriceps.",
        "steps": [
            "Debout, pieds largeur d'épaules",
            "Descendre lentement (3 sec) jusqu'à 45° de flexion",
            "Pause 1 sec",
            "Remonter lentement (3 sec)",
            "Ne pas dépasser 90° de flexion"
        ],
        "progression": "Ajouter du poids (sac à dos, haltères) quand 4 × 12 est aisé.",
        "programId": "rehab_femoral",
        "phaseId": 2
    },
    {
        "id": "rf2e2",
        "name": "Fente avant statique",
        "meta": "3 × 10 par jambe | Tempo 3-1-2",
        "purpose": "Renforcer le droit fémoral en position allongée.",
        "steps": [
            "Position fendue, pied avant en avant",
            "Descendre lentement (3 sec)",
            "Le genou arrière effleure le sol",
            "Pause 1 sec",
            "Remonter en 2 sec"
        ],
        "warning": "Le genou avant ne doit pas dépasser la pointe du pied.",
        "programId": "rehab_femoral",
        "phaseId": 2
    },
    {
        "id": "rf2e3",
        "name": "Extension genou excentrique",
        "meta": "4 × 8 rép | Descente 5 sec",
        "purpose": "Renforcement excentrique du quadriceps — essentiel pour la guérison tendineuse.",
        "steps": [
            "Assis sur une chaise haute, pieds ne touchant pas le sol",
            "Tendre la jambe droite (aidé de la gauche si besoin)",
            "Descendre très lentement en 5 sec sans aide",
            "Remonter avec l'aide de l'autre jambe"
        ],
        "progression": "Ajouter du lest progressivement : 0,5 kg → 1 kg → 1,5 kg → 2 kg.",
        "programId": "rehab_femoral",
        "phaseId": 2
    },
    {
        "id": "rf3e1",
        "name": "Squat bulgare",
        "meta": "4 × 8 par jambe | Tempo 3-1-1",
        "purpose": "Renforcement intensif du quadriceps en étirement du droit fémoral.",
        "steps": [
            "Pied arrière posé sur un banc derrière soi",
            "Pied avant stable devant",
            "Descendre lentement (3 sec)",
            "Sentir l'étirement à l'avant de la hanche",
            "Remonter en 1 sec"
        ],
        "progression": "Ajouter des haltères : 2 kg → 4 kg → 6 kg → 8 kg.",
        "programId": "rehab_femoral",
        "phaseId": 3
    },
    {
        "id": "rf3e2",
        "name": "Reverse Nordic Curl",
        "meta": "3 × 6 rép | Descente 5 sec",
        "purpose": "Exercice roi pour la rééducation du droit fémoral — charge excentrique maximale.",
        "steps": [
            "À genoux sur un tapis, pieds à plat derrière soi",
            "Corps droit des genoux aux épaules",
            "Se pencher très lentement vers l'arrière (5 sec)",
            "Hanches bien tendues — ne pas s'asseoir sur les talons",
            "Utiliser les mains pour remonter si nécessaire"
        ],
        "warning": "Exercice très exigeant — commencer avec petite amplitude.",
        "programId": "rehab_femoral",
        "phaseId": 3
    },
    {
        "id": "rf3e3",
        "name": "Sauts sur place",
        "meta": "3 × 10 sauts | Repos 60 sec",
        "purpose": "Réintroduire les contraintes explosives progressivement.",
        "steps": [
            "Pieds largeur d'épaules",
            "Petit squat puis saut vertical",
            "Atterrir en douceur, genoux fléchis",
            "Absorber l'impact en fléchissant",
            "Enchaîner les sauts sans précipitation"
        ],
        "progression": "Semaine 7 : sauts sur place → Semaine 8 : sauts en déplacement → Semaine 9 : unipodaux.",
        "programId": "rehab_femoral",
        "phaseId": 3
    },
    {
        "id": "rf4e1",
        "name": "Conduite de balle & passes courtes",
        "meta": "Semaine 10 | 20 min",
        "purpose": "Premier contact balle à faible intensité.",
        "steps": [
            "Conduite lente sur 20 m (aller-retour)",
            "Passes courtes intérieur du pied à 5–10 m (30 % intensité)",
            "Pas de frappe cou-de-pied ni passe enveloppée",
            "Jonglage léger si pas de douleur"
        ],
        "programId": "rehab_femoral",
        "phaseId": 4
    },
    {
        "id": "rf4e2",
        "name": "Frappes progressives",
        "meta": "Semaine 11 | 15 min",
        "purpose": "Réintroduire progressivement le geste de frappe.",
        "steps": [
            "Passes longues intérieur du pied à 15–20 m : 40 %",
            "Frappe cou-de-pied dans un but à 10 m : 30 % → 50 %",
            "Augmenter de 10 % par séance si 0 douleur",
            "Arrêter dès la moindre gêne au pli de l'aine"
        ],
        "warning": "La passe enveloppée est le DERNIER geste à reprendre.",
        "programId": "rehab_femoral",
        "phaseId": 4
    },
    {
        "id": "rj1e1",
        "name": "Squat goblet",
        "meta": "4 × 10–12 rép | Tempo 3-1-2",
        "purpose": "Activation du quadriceps avec bonne mécanique articulaire.",
        "steps": [
            "Tenir un haltère ou kettlebell à la poitrine",
            "Pieds largeur d'épaules, orteils légèrement ouverts",
            "Descendre contrôlé (3 sec) jusqu'à 90° de flexion",
            "Pause 1 sec en bas",
            "Remonter en 2 sec en poussant fort"
        ],
        "progression": "Augmenter de 2–5 kg par semaine.",
        "programId": "renfo_jambes",
        "phaseId": 1
    },
    {
        "id": "rj1e2",
        "name": "Soulevé de terre jambes tendues",
        "meta": "3 × 8–10 rép",
        "purpose": "Activation de la chaîne postérieure (ischio-jambiers, fessiers).",
        "steps": [
            "Debout, pieds largeur d'épaules, barre devant",
            "Légère flexion des genoux",
            "Pencher le buste en gardant le dos plat",
            "Descendre jusqu'à mi-tibia",
            "Remonter en contractant les fessiers"
        ],
        "programId": "renfo_jambes",
        "phaseId": 1
    },
    {
        "id": "rj1e3",
        "name": "Fente marchée",
        "meta": "3 × 12 pas par jambe",
        "purpose": "Développer la force unilatérale et l'équilibre.",
        "steps": [
            "Debout, haltères dans chaque main",
            "Faire un grand pas en avant",
            "Le genou arrière s'approche du sol",
            "Pousser sur le pied avant pour revenir",
            "Alterner les jambes en avançant"
        ],
        "programId": "renfo_jambes",
        "phaseId": 1
    },
    {
        "id": "rj2e1",
        "name": "Squat complet",
        "meta": "4 × 8–10 rép | Tempo 3-1-2",
        "purpose": "Renforcement maximal du quadriceps en amplitude complète.",
        "steps": [
            "Barre sur les épaules ou haltères",
            "Descendre contrôlé jusqu'à 90°",
            "Ne jamais verrouiller les genoux complètement",
            "Remonter en poussant fort dans le sol"
        ],
        "progression": "Augmenter de 2,5–5 kg par session.",
        "programId": "renfo_jambes",
        "phaseId": 2
    },
    {
        "id": "rj2e2",
        "name": "Leg press",
        "meta": "4 × 10 rép | Tempo contrôlé",
        "purpose": "Force brute des jambes sans charge sur le dos.",
        "steps": [
            "Assis, pieds largeur d'épaules sur la plateforme",
            "Descendre contrôlé jusqu'à 90°",
            "Ne pas verrouiller les genoux en haut",
            "Remonter en poussant fort"
        ],
        "programId": "renfo_jambes",
        "phaseId": 2
    },
    {
        "id": "rj2e3",
        "name": "Hip thrust",
        "meta": "4 × 12 rép | Pause 2 sec en haut",
        "purpose": "Isoler et maximiser l'activation des fessiers.",
        "steps": [
            "Dos appuyé sur un banc, épaules au niveau du bord",
            "Barre sur les hanches (serviette pour le confort)",
            "Pousser les hanches vers le haut",
            "Maintenir 2 sec — contracter au maximum les fessiers",
            "Redescendre lentement"
        ],
        "progression": "Augmenter de 5–10 kg par semaine.",
        "programId": "renfo_jambes",
        "phaseId": 2
    },
    {
        "id": "rj3e1",
        "name": "Squat lourd",
        "meta": "5 × 5 rép | Intensité 80–85 %",
        "purpose": "Développer la force maximale des membres inférieurs.",
        "steps": [
            "Barre correctement positionnée sur les trapèzes",
            "Descendre contrôlé jusqu'à parallèle",
            "Drive puissant avec les hanches",
            "Maintenir le dos rigide tout au long du mouvement",
            "Repos 3–5 min entre séries"
        ],
        "programId": "renfo_jambes",
        "phaseId": 3
    },
    {
        "id": "rj3e2",
        "name": "Soulevé de terre conventionnel",
        "meta": "5 × 3–5 rép | Intensité 80–85 %",
        "purpose": "Exercice roi de la force : chaîne postérieure complète.",
        "steps": [
            "Pieds hip-width, barre au-dessus des médio-pieds",
            "Saisir la barre en pronation ou alternée",
            "Dos plat, épaules légèrement devant la barre",
            "Pousser dans le sol pour initier le mouvement",
            "Hanches et épaules montent au même rythme"
        ],
        "warning": "Ne jamais arrondir le bas du dos sous charge maximale.",
        "programId": "renfo_jambes",
        "phaseId": 3
    },
    {
        "id": "cg1e1",
        "name": "Planche frontale",
        "meta": "3 × 20–60 sec | Repos 30 sec",
        "purpose": "Renforcer les abdominaux profonds et la stabilité du rachis.",
        "steps": [
            "Appui sur avant-bras et pointes de pieds",
            "Corps parfaitement aligné (pas de creux dorsal)",
            "Serrer les abdos, les fessiers et les cuisses",
            "Respirer normalement",
            "Tenir sans relâcher"
        ],
        "programId": "core_gainage",
        "phaseId": 1
    },
    {
        "id": "cg1e2",
        "name": "Planche latérale",
        "meta": "3 × 20–30 sec par côté",
        "purpose": "Renforcer les obliques et les stabilisateurs latéraux.",
        "steps": [
            "Allongé sur le côté, appui sur l'avant-bras",
            "Corps aligné de la tête aux pieds",
            "Soulever les hanches vers le haut",
            "Serrer les obliques",
            "Ne pas laisser les hanches s'affaisser"
        ],
        "programId": "core_gainage",
        "phaseId": 1
    },
    {
        "id": "cg1e3",
        "name": "Pont fessier",
        "meta": "3 × 15 rép | Tempo 2-2-2",
        "purpose": "Activer fessiers et chaîne postérieure.",
        "steps": [
            "Allongé sur le dos, genoux fléchis, pieds au sol",
            "Serrer les fessiers et soulever le bassin",
            "Alignement épaules–hanches–genoux",
            "Maintenir 2 sec en haut",
            "Redescendre en 2 sec"
        ],
        "programId": "core_gainage",
        "phaseId": 1
    },
    {
        "id": "cg1e4",
        "name": "Bird-dog",
        "meta": "3 × 10 par côté",
        "purpose": "Stabilité lombaire en dissociation des membres.",
        "steps": [
            "À quatre pattes, mains sous les épaules",
            "Étendre simultanément le bras droit et la jambe gauche",
            "Garder le dos plat et le bassin stable",
            "Revenir lentement au centre",
            "Alterner les côtés"
        ],
        "programId": "core_gainage",
        "phaseId": 1
    },
    {
        "id": "cg2e1",
        "name": "Dead bug",
        "meta": "3 × 10 par côté",
        "purpose": "Stabilité du core en mouvement — déconnexion bras/jambes.",
        "steps": [
            "Allongé sur le dos, bras tendus vers le plafond, genoux à 90°",
            "Abaisser lentement le bras droit et la jambe gauche",
            "Garder le bas du dos collé au sol — ne pas cambrer",
            "Revenir au centre",
            "Alterner de façon contrôlée"
        ],
        "programId": "core_gainage",
        "phaseId": 2
    },
    {
        "id": "cg2e2",
        "name": "Mountain climber",
        "meta": "3 × 30 sec",
        "purpose": "Gainage dynamique avec élévation du rythme cardiaque.",
        "steps": [
            "Position de pompe tendue, corps aligné",
            "Amener le genou droit vers la poitrine",
            "Replacer et amener le genou gauche",
            "Alterner rapidement en gardant le gainage"
        ],
        "progression": "Augmenter la vitesse d'exécution chaque semaine.",
        "programId": "core_gainage",
        "phaseId": 2
    },
    {
        "id": "cg3e1",
        "name": "Pallof press",
        "meta": "3 × 12 rép par côté",
        "purpose": "Renforcer le core en résistance à la rotation — très fonctionnel.",
        "steps": [
            "Élastique ou câble fixé à hauteur de hanche sur le côté",
            "Se tenir debout de profil, bras pliés, mains sur la poitrine",
            "Pousser les mains devant soi en tendant les bras",
            "Tenir 2 sec — résister à la rotation",
            "Revenir lentement"
        ],
        "programId": "core_gainage",
        "phaseId": 3
    },
    {
        "id": "mob1e1",
        "name": "Étirement psoas-iliaque",
        "meta": "3 × 30 sec par côté",
        "purpose": "Assouplir les fléchisseurs de hanche.",
        "steps": [
            "Position de chevalier servant (genou droit au sol)",
            "Pied gauche en avant, genou à 90°",
            "Avancer doucement le bassin vers l'avant",
            "Garder le buste droit, contracter les abdos",
            "Sentir l'étirement doux à l'avant de la hanche"
        ],
        "programId": "mobilite",
        "phaseId": 1
    },
    {
        "id": "mob1e2",
        "name": "Rotations hanche (couché)",
        "meta": "2 × 10 rotations par côté",
        "purpose": "Mobiliser l'articulation coxo-fémorale en rotation.",
        "steps": [
            "Allongé sur le dos, genoux fléchis",
            "Faire tomber les genoux à droite",
            "Garder les épaules au sol",
            "Revenir au centre",
            "Alterner les côtés"
        ],
        "programId": "mobilite",
        "phaseId": 1
    },
    {
        "id": "mob1e3",
        "name": "Mobilité thoracique",
        "meta": "2 × 10 par côté",
        "purpose": "Libérer la colonne thoracique souvent rigidifiée par la sédentarité.",
        "steps": [
            "À quatre pattes, main derrière la tête",
            "Faire une rotation du tronc vers le haut, coude vers le plafond",
            "Suivre du regard",
            "Revenir lentement",
            "Alterner les côtés"
        ],
        "programId": "mobilite",
        "phaseId": 1
    },
    {
        "id": "mob1e4",
        "name": "Squat profond assisté",
        "meta": "2 × 60 sec",
        "purpose": "Améliorer la mobilité des chevilles, hanches et colonne.",
        "steps": [
            "Se tenir à un montant ou un cadre de porte",
            "Descendre en squat aussi bas que possible",
            "Pousser les genoux vers l'extérieur avec les coudes",
            "Garder le dos droit",
            "Tenir et relâcher progressivement la tension"
        ],
        "programId": "mobilite",
        "phaseId": 1
    },
    {
        "id": "hc1e1",
        "name": "Pompes",
        "meta": "4 × 10–15 rép",
        "purpose": "Activation pectoraux, deltoïdes antérieurs et triceps.",
        "steps": [
            "Position de pompe, mains un peu plus larges que les épaules",
            "Corps aligné de la tête aux talons",
            "Descendre la poitrine jusqu'à 2 cm du sol",
            "Pousser puissamment vers le haut",
            "Garder le gainage tout au long"
        ],
        "programId": "haut_corps",
        "phaseId": 1
    },
    {
        "id": "hc1e2",
        "name": "Tirage horizontal (élastique ou câble)",
        "meta": "4 × 12 rép",
        "purpose": "Renforcer le dos et corriger la posture.",
        "steps": [
            "Saisir l'élastique ou la barre à hauteur de poitrine",
            "Tirer en ramenant les coudes près du corps",
            "Serrer les omoplates en fin de mouvement",
            "Revenir lentement (3 sec)"
        ],
        "programId": "haut_corps",
        "phaseId": 1
    },
    {
        "id": "hc1e3",
        "name": "Élévations latérales",
        "meta": "3 × 15 rép | Tempo contrôlé",
        "purpose": "Développer les deltoïdes latéraux pour des épaules larges.",
        "steps": [
            "Debout, haltères dans chaque main",
            "Lever les bras latéralement jusqu'à la hauteur des épaules",
            "Légère flexion du coude",
            "Redescendre lentement (3 sec)"
        ],
        "warning": "Ne jamais hausser les épaules lors du mouvement.",
        "programId": "haut_corps",
        "phaseId": 1
    },
    {
        "id": "hc2e1",
        "name": "Développé couché",
        "meta": "4 × 8–10 rép | Tempo 3-1-2",
        "purpose": "Exercice principal de force pectorale.",
        "steps": [
            "Allongé sur banc, pieds au sol",
            "Barre ou haltères à hauteur des pectoraux",
            "Descendre contrôlé (3 sec) jusqu'à effleurer la poitrine",
            "Pousser explosif vers le haut",
            "Verrouiller les coudes sans blocage complet"
        ],
        "progression": "Augmenter de 2,5 kg par semaine.",
        "programId": "haut_corps",
        "phaseId": 2
    },
    {
        "id": "hc2e2",
        "name": "Tractions / Lat pulldown",
        "meta": "4 × 8–12 rép",
        "purpose": "Développer la largeur du dos (grand dorsal).",
        "steps": [
            "Saisir la barre en pronation, largeur d'épaules ou plus",
            "Tirer la barre vers le bas en amenant les coudes vers les hanches",
            "Maintenir 1 sec en bas, omoplates abaissées",
            "Revenir lentement (3 sec)"
        ],
        "programId": "haut_corps",
        "phaseId": 2
    },
    {
        "id": "hc2e3",
        "name": "Curl biceps",
        "meta": "3 × 12 rép",
        "purpose": "Isoler et développer les biceps.",
        "steps": [
            "Debout, haltères dans chaque main, paumes vers l'avant",
            "Fléchir les avant-bras vers les épaules",
            "Maintenir 1 sec en haut",
            "Redescendre lentement (3 sec)"
        ],
        "programId": "haut_corps",
        "phaseId": 2
    },
    {
        "id": "hc3e1",
        "name": "Développé couché lourd",
        "meta": "5 × 3–5 rép | Intensité 80–85 %",
        "purpose": "Maximiser la force des pectoraux.",
        "steps": [
            "Échauffement progressif obligatoire",
            "Descendre contrôlé",
            "Pousser explosif",
            "Repos complet 3–4 min entre séries"
        ],
        "programId": "haut_corps",
        "phaseId": 3
    },
    {
        "id": "hi1e1",
        "name": "Burpees",
        "meta": "4 × 30 sec travail | 30 sec repos",
        "purpose": "Exercice complet — cardio, force, coordination.",
        "steps": [
            "Debout, mains au sol",
            "Sauter les pieds en arrière (position pompe)",
            "Option : faire une pompe",
            "Ramener les pieds, se redresser et sauter",
            "Les bras au-dessus de la tête"
        ],
        "progression": "Augmenter la durée ou réduire le repos chaque semaine.",
        "programId": "hiit_cardio",
        "phaseId": 1
    },
    {
        "id": "hi1e2",
        "name": "Mountain Climber",
        "meta": "4 × 30 sec | Repos 20 sec",
        "purpose": "Cardio intense + gainage dynamique.",
        "steps": [
            "Position de pompe",
            "Amener le genou droit vers la poitrine",
            "Replacer et amener le genou gauche",
            "Alterner rapidement"
        ],
        "programId": "hiit_cardio",
        "phaseId": 1
    },
    {
        "id": "hi1e3",
        "name": "Jump squats",
        "meta": "4 × 10 sauts | Repos 40 sec",
        "purpose": "Explosive power des membres inférieurs et cardio.",
        "steps": [
            "Position squat, pieds largeur épaules",
            "Descendre en squat",
            "Sauter explosif vers le haut",
            "Atterrir en douceur sur les deux pieds",
            "Enchaîner immédiatement"
        ],
        "programId": "hiit_cardio",
        "phaseId": 1
    },
    {
        "id": "hi2e1",
        "name": "Tabata — Burpees",
        "meta": "8 × (20 sec / 10 sec) = 4 min",
        "purpose": "Format Tabata ultra-intense pour brûler un maximum en peu de temps.",
        "steps": [
            "20 sec de burpees à effort maximal",
            "10 sec de repos complet",
            "Répéter 8 fois (4 min total)",
            "Récupérer 1–2 min avant le prochain exercice"
        ],
        "warning": "Ne jamais sacrifier la technique pour la vitesse.",
        "programId": "hiit_cardio",
        "phaseId": 2
    }
];

const SeedManager = {
    async seedIfEmpty() {
        return this.ensureCatalog();
    },

    async ensureCatalog() {
        try {
            const [programCount, exerciseCount, versionRow, existingPrograms, existingExercises] = await Promise.all([
                db.programs.count(),
                db.exercises.count(),
                db.settings.get('catalogVersion'),
                db.programs.toArray(),
                db.exercises.toArray()
            ]);

            const catalogPrograms = this.getPrograms();
            const catalogExercises = this.getExercises();
            const existingProgramIds = new Set(existingPrograms.map(program => program.id));
            const existingExerciseIds = new Set(existingExercises.map(exercise => exercise.id));
            const missingPrograms = catalogPrograms.filter(program => !existingProgramIds.has(program.id));
            const missingExercises = catalogExercises.filter(exercise => !existingExerciseIds.has(exercise.id));
            const needsBootstrap = programCount === 0 || exerciseCount === 0;
            const needsUpgrade = versionRow?.value !== CATALOG_VERSION;

            if (!needsBootstrap && !needsUpgrade && !missingPrograms.length && !missingExercises.length) {
                console.log('Catalogue deja a jour (' + programCount + ' programme(s), ' + exerciseCount + ' exercice(s))');
                return false;
            }

            if (needsBootstrap) {
                console.log('Base vide - initialisation du catalogue...');
            } else {
                console.log('Mise a niveau du catalogue (' + missingPrograms.length + ' programme(s), ' + missingExercises.length + ' exercice(s) manquant(s))...');
            }

            await this.seed();
            await db.settings.put({
                key: 'catalogVersion',
                value: CATALOG_VERSION,
                timestamp: Date.now()
            });

            console.log('Catalogue synchronise (' + catalogPrograms.length + ' programme(s), ' + catalogExercises.length + ' exercice(s))');
            return true;
        } catch (err) {
            console.error('Erreur SeedManager.ensureCatalog:', err);
            return false;
        }
    },

    async seed() {
        const programs = this.getPrograms();
        const exercises = this.getExercises();

        await db.programs.bulkPut(programs.map(program => ({
            id: program.id,
            name: program.name,
            category: program.category,
            description: program.description,
            duration: program.duration,
            sessionsPerWeek: program.sessionsPerWeek || null,
            phases: program.phases,
            disclaimer: program.disclaimer || false,
            timestamp: Date.now()
        })));

        await db.exercises.bulkPut(exercises.map(exercise => ({
            ...exercise,
            timestamp: Date.now()
        })));

        console.log(programs.length + ' programmes, ' + exercises.length + ' exercices inseres');
    },

    getPrograms() {
        return this.decoratePrograms(RAW_PROGRAMS);
    },

    getExercises() {
        return this.attachMediaUrls(RAW_EXERCISES);
    },

    decoratePrograms(programs) {
        const defaultPhaseColors = ['#0891B2', '#7C3AED', '#059669', '#DC2626'];

        return programs.map(program => ({
            ...program,
            phases: (program.phases || []).map((phase, index) => ({
                ...phase,
                color: phase.color || defaultPhaseColors[index % defaultPhaseColors.length]
            }))
        }));
    },

    attachMediaUrls(exercises) {
        return exercises.map(exercise => {
            const mediaUrl = exercise.mediaUrl || this.getMediaUrlForExercise(exercise);
            return mediaUrl ? { ...exercise, mediaUrl } : { ...exercise };
        });
    },

    getMediaUrlForExercise(exercise) {
        const label = this.normalizeText((exercise.name || '') + ' ' + (exercise.purpose || ''));
        const rules = [
            { tokens: ['isometrique mural', 'wall sit', 'chaise'], asset: 'assets/wall_sit.png' },
            { tokens: ['bird-dog', 'bird dog'], asset: 'assets/bird_dog.png' },
            { tokens: ['hip thrust'], asset: 'assets/hip_thrust.png' },
            { tokens: ['pont fessier', 'glute bridge'], asset: 'assets/glute_bridge.png' },
            { tokens: ['leg press', 'presse a cuisses', 'presse inclinee'], asset: 'assets/leg_press.png' },
            { tokens: ['rowing', 'tirage horizontal', 'rowing assis', 'rowing poulie', 'rowing poitrine'], asset: 'assets/rowing_cable.png' },
            { tokens: ['tirage vertical', 'tractions', 'lat pulldown', 'pullup', 'pull-up'], asset: 'assets/pullup.png' },
            { tokens: ['pompes', 'push up', 'pushup'], asset: 'assets/pushup.png' },
            { tokens: ['developpe couche', 'developpe incline', 'chest press', 'bench press'], asset: 'assets/benchpress_illustration_1775427787141.png' },
            { tokens: ['souleve de terre', 'deadlift'], asset: 'assets/deadlift_illustration_1775427773855.png' },
            { tokens: ['curl biceps', 'bicep curl'], asset: 'assets/bicep_curl.png' },
            { tokens: ['burpee'], asset: 'assets/burpee.png' },
            { tokens: ['planche', 'gainage', 'plank'], asset: 'assets/plank_illustration_1775427797986.png' },
            { tokens: ['squat'], asset: 'assets/squat_illustration_1775427762074.png' }
        ];

        const match = rules.find(rule => rule.tokens.some(token => label.includes(token)));
        return match ? match.asset : '';
    },

    normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
};
