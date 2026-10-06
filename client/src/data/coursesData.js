/**
 * Comprehensive Course Data for Vidhya Learning Platform
 * Includes multiple categories with videos, notes, and MCQs
 */

const createLesson = ({
  id,
  title,
  duration,
  videoUrl = null,
  notes,
  question,
  options,
  correctAnswer,
  explanation,
}) => ({
  id,
  title,
  duration,
  videoUrl,
  notes,
  mcqs: [
    {
      id: `${id}-q1`,
      question,
      options,
      correctAnswer,
      explanation,
    },
  ],
})

const supplementalThumbnails = {
  'Academic Education': [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
  ],
  'Skill-based Courses': [
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
  ],
  'Sports & Fitness': [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
  ],
  'Competitive Exams': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
  ],
  'BSc Agriculture': [
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=450&fit=crop',
  ],
  'AR & VR Learning': [
    'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
  ],
}

const chooseSupplementalThumbnail = (courseId, category) => {
  const images = supplementalThumbnails[category] || supplementalThumbnails['Academic Education']
  const imageIndex = [...courseId].reduce((total, character) => total + character.charCodeAt(0), 0) % images.length

  return images[imageIndex]
}

const createSupplementalCourse = ({
  id,
  title,
  category,
  subcategory,
  description,
  skills,
  videoUrl,
  lessonTitle,
  notes,
  question,
  options,
  correctAnswer,
  explanation,
}) => ({
  id,
  title,
  category,
  subcategory,
  description,
  instructor: 'Vidhya Learning Team',
  difficulty: 'Beginner',
  duration: '1 hour',
  totalLessons: 1,
  rating: 4.7,
  enrolledCount: 0,
  thumbnail: chooseSupplementalThumbnail(id, category),
  skills,
  playlist: [
    createLesson({
      id: `${id}-lesson-1`,
      title: lessonTitle,
      duration: '25 min',
      videoUrl,
      notes,
      question,
      options,
      correctAnswer,
      explanation,
    }),
  ],
})

const supplementalCourses = [
  createSupplementalCourse({
    id: 'webxr-ar-fundamentals',
    title: 'Build WebXR Augmented Reality Experiences',
    category: 'AR & VR Learning',
    subcategory: 'WebXR Development',
    description: 'Understand browser-based AR, WebXR sessions, and how to plan an accessible first immersive lesson.',
    skills: ['WebXR', 'Augmented Reality', 'Interaction Design'],
    videoUrl: 'https://www.youtube.com/watch?v=Sul61kSfMyU',
    lessonTitle: 'How WebXR brings AR to the browser',
    notes: `# WebXR augmented reality\n\nWebXR is a browser interface for immersive sessions. An AR session can place a digital object in relation to a live camera view when the browser and device support the required features.\n\n## Design checklist\n- Start with one learning goal and one object.\n- Keep labels readable and provide a non-immersive fallback.\n- Ask for camera or motion access only when the lesson needs it.\n- Test placement, scale, and lighting on the target device.\n\n## Try it\nSketch where a learner should place a virtual cell model, then name one visual cue that would help them understand its scale.`,
    question: 'What is the main role of WebXR in an AR lesson?',
    options: ['It provides browser features for immersive AR or VR sessions', 'It guarantees every browser has a headset', 'It replaces lesson content with a camera feed', 'It is a 3D file format'],
    correctAnswer: 0,
    explanation: 'WebXR exposes immersive-session features to compatible browsers and devices; it does not guarantee hardware support.',
  }),
  createSupplementalCourse({
    id: 'ar-science-modeling',
    title: 'Create Science Models for Augmented Reality',
    category: 'AR & VR Learning',
    subcategory: '3D Modeling',
    description: 'Plan and model a clear, correctly scaled science object that learners can inspect in an AR view.',
    skills: ['3D Modeling', 'Blender', 'Science Visualization'],
    videoUrl: 'https://www.youtube.com/watch?v=elUJCEC06r8',
    lessonTitle: 'Block out a model before adding detail',
    notes: `# Modeling for AR science\n\nAn educational model should make a concept easier to see. Begin with simple shapes, a known scale, and only the details that support the learning goal.\n\n## Workflow\n1. Write down what the learner should notice.\n2. Block out the major forms and compare their proportions.\n3. Add labels, color, and detail only when each improves understanding.\n4. Check the object at real-world size and from several angles.\n\nA lightweight model loads faster on mobile devices and is often easier to understand than a highly detailed one.`,
    question: 'Why should a science AR model begin with simple blockout shapes?',
    options: ['To establish useful form and scale before adding detail', 'To make the model impossible to rotate', 'To avoid setting any learning objective', 'To increase the file size'],
    correctAnswer: 0,
    explanation: 'A blockout helps validate silhouette, proportions, and scale before time is spent on detail.',
  }),
  createSupplementalCourse({
    id: 'aframe-vr-labs',
    title: 'Create a Virtual Science Lab with A-Frame',
    category: 'AR & VR Learning',
    subcategory: 'Virtual Labs',
    description: 'Explore scene entities, cameras, materials, and controls for a browser-based virtual lab.',
    skills: ['A-Frame', 'Virtual Reality', '3D Scenes'],
    videoUrl: 'https://www.youtube.com/watch?v=pVetLvb3deE',
    lessonTitle: 'Compose a scene from entities',
    notes: `# A-Frame virtual labs\n\nA-Frame builds WebXR scenes from entities and components. A useful lab scene gives learners a clear starting point, safe ways to move, and a central object to investigate.\n\n## Scene building blocks\n- Geometry defines an object's shape.\n- Materials control color and surface appearance.\n- Position and rotation place objects in the scene.\n- A camera and input controls define how the learner looks around.\n\nKeep a desktop view available so learners can inspect the scene even when immersive hardware is unavailable.`,
    question: "In an A-Frame scene, what defines an object's shape?",
    options: ['Geometry', 'A quiz answer', 'The browser address bar', 'A certificate record'],
    correctAnswer: 0,
    explanation: 'Geometry provides the mesh or primitive shape used by an entity.',
  }),
  createSupplementalCourse({
    id: 'threejs-immersive-science',
    title: 'Three.js Scenes for Immersive Science',
    category: 'AR & VR Learning',
    subcategory: 'WebXR Development',
    description: 'Learn how a Three.js scene, camera, lights, and objects combine to create an interactive science view.',
    skills: ['Three.js', 'WebXR', 'JavaScript'],
    videoUrl: 'https://www.youtube.com/watch?v=vnC9Sw6k5Ao',
    lessonTitle: 'Build the parts of a 3D scene',
    notes: `# Three.js scene foundations\n\nA Three.js scene is a container for objects, lights, and cameras. The renderer draws the scene into a canvas, while the camera determines which part of the scene is visible.\n\n## A practical order\n1. Create a scene and choose a camera.\n2. Add a simple object and set its position.\n3. Add lighting and a readable material.\n4. Render and inspect the result at desktop and mobile sizes.\n\nFor an immersive lesson, make controls discoverable and keep the model near a comfortable viewing distance.`,
    question: 'Which Three.js component determines the viewer perspective?',
    options: ['Camera', 'Material', 'Texture', 'Quiz'],
    correctAnswer: 0,
    explanation: 'The camera defines the view and projection used when the scene is rendered.',
  }),
  createSupplementalCourse({
    id: 'xr-scale-spatial-design',
    title: 'Scale and Spatial Design for AR Learning',
    category: 'AR & VR Learning',
    subcategory: 'Immersive Design',
    description: 'Use scale, distance, contrast, and placement to make AR science models comfortable and understandable.',
    skills: ['Spatial Design', 'AR', 'Accessibility'],
    videoUrl: 'https://www.youtube.com/watch?v=ttDyimAk88Y',
    lessonTitle: 'Make virtual objects readable in space',
    notes: `# Spatial design and scale\n\nAn AR object needs a meaningful size and a stable relationship to its surroundings. If scale is unknown, provide a reference such as a ruler, hand, or familiar object.\n\n## Make it easier to inspect\n- Place the first object where it does not block the learner's view.\n- Use a size cue and labels with strong contrast.\n- Let learners move around the object instead of relying on tiny text.\n- Offer a reset or recenter action.\n\nA good spatial layout gives the learner room to look without requiring uncomfortable movement.`,
    question: 'What helps a learner interpret the size of an unfamiliar AR model?',
    options: ['A familiar scale reference', 'More decorative particles', 'Hiding the surrounding view', 'Removing all labels'],
    correctAnswer: 0,
    explanation: "A known reference helps learners judge the model's size and proportions.",
  }),
  createSupplementalCourse({
    id: 'virtual-anatomy-classroom',
    title: 'Teach Human Anatomy with Virtual Models',
    category: 'AR & VR Learning',
    subcategory: 'Immersive Science',
    description: 'Plan an interactive anatomy activity that uses 3D layers, labels, and guided observation.',
    skills: ['Anatomy', 'Virtual Reality', 'Science Teaching'],
    videoUrl: 'https://www.youtube.com/watch?v=ttDyimAk88Y',
    lessonTitle: 'Guide an anatomy model exploration',
    notes: `# Virtual anatomy exploration\n\nA 3D anatomy model can help learners connect structures to their location and neighboring systems. The lesson should guide attention instead of asking learners to explore an unlabeled model without direction.\n\n## Activity sequence\n1. Show the whole body for orientation.\n2. Reveal one system or layer at a time.\n3. Ask learners to identify a structure and describe its relationship to another.\n4. Use a short retrieval question before revealing the label.\n\nUse accurate labels, readable colors, and an option to return to the whole-body view.`,
    question: 'Why reveal anatomy layers one at a time?',
    options: ['To focus attention and connect structures to their location', 'To conceal the learning objective', 'To prevent comparison between structures', 'To replace all teacher guidance'],
    correctAnswer: 0,
    explanation: 'Sequenced layers reduce visual clutter and help learners build a spatial understanding of anatomy.',
  }),
  createSupplementalCourse({
    id: 'ar-solar-system',
    title: 'Explore the Solar System in Augmented Reality',
    category: 'AR & VR Learning',
    subcategory: 'Astronomy',
    description: 'Use a spatial solar system model to compare orbital order, relative distance, and scale limitations.',
    skills: ['Astronomy', 'Augmented Reality', 'Scale'],
    videoUrl: 'https://www.youtube.com/watch?v=TKM0P3XlMNA',
    lessonTitle: 'Represent planetary order and distance',
    notes: `# Solar system models\n\nA classroom solar system model can show the order of planets and the idea of orbiting a star. A single model cannot usually show planet sizes and orbital distances to the same scale at once, so the lesson should state which scale is being emphasized.\n\n## Compare carefully\n- Identify the Sun and planets in order.\n- Distinguish a planet's size from its distance to the Sun.\n- Treat orbital paths as simplified diagrams.\n- Ask learners to predict what changes when the view is zoomed.\n\nUse the model to discuss relationships, not to imply that the planets are equally spaced.`,
    question: 'Why should a solar system model state which scale it represents?',
    options: ['Planet size and orbital distance cannot both be shown accurately in one convenient classroom model', 'All planets are the same size', 'Orbits never change', 'A model has no dimensions'],
    correctAnswer: 0,
    explanation: 'Solar system diagrams often simplify size or distance to fit a usable viewing space.',
  }),
  createSupplementalCourse({
    id: 'xr-accessibility-safety',
    title: 'Accessible and Comfortable XR Lessons',
    category: 'AR & VR Learning',
    subcategory: 'Immersive Design',
    description: 'Design inclusive AR and VR activities with alternatives, readable controls, and comfort-aware movement.',
    skills: ['Accessibility', 'XR Safety', 'Inclusive Design'],
    videoUrl: 'https://www.youtube.com/watch?v=Sul61kSfMyU',
    lessonTitle: 'Plan inclusive participation options',
    notes: `# Accessibility and comfort in XR\n\nLearners differ in vision, mobility, balance, sensory needs, and access to devices. An XR activity should keep its learning goal available through more than one way to participate.\n\n## Practical checks\n- Provide captions or a text equivalent for spoken instructions.\n- Keep important controls large, labeled, and easy to reach.\n- Avoid forced camera motion and offer a seated or desktop mode.\n- Let learners pause, recenter, or leave the immersive view at any time.\n\nTest the lesson with keyboard, touch, and screen-size changes before using it with a class.`,
    question: 'Which choice improves comfort for learners who cannot use a headset?',
    options: ['A complete desktop or mobile 3D alternative', 'A forced immersive session', 'Smaller unlabeled buttons', 'Removing captions'],
    correctAnswer: 0,
    explanation: 'A non-immersive mode preserves access to the lesson for learners without suitable hardware or who prefer not to use it.',
  }),
  createSupplementalCourse({
    id: 'xr-interaction-design',
    title: 'Interaction Design for AR and VR Lessons',
    category: 'AR & VR Learning',
    subcategory: 'Immersive Design',
    description: 'Choose simple, understandable interactions that support observing, comparing, and practicing science concepts.',
    skills: ['Interaction Design', 'XR', 'Learning Design'],
    videoUrl: 'https://www.youtube.com/watch?v=vnC9Sw6k5Ao',
    lessonTitle: 'Connect an interaction to a learning goal',
    notes: `# XR interaction design\n\nAn interaction is useful when it helps the learner do something meaningful with the concept. Rotating a model can support spatial reasoning; tapping a random object may add activity without adding understanding.\n\n## Choose interactions deliberately\n- State the concept the learner should practice.\n- Match the action to that concept, such as rotate, compare, or assemble.\n- Give feedback that explains the result.\n- Keep a clear way to undo, reset, or continue.\n\nPrefer a small set of predictable controls over many gestures that learners must memorize.`,
    question: 'When is an XR interaction educationally useful?',
    options: ['When the action helps practice or reveal the target concept', 'When it adds the greatest number of gestures', 'When it hides the model', 'When it works only once'],
    correctAnswer: 0,
    explanation: 'The interaction should directly support the learning objective and provide meaningful feedback.',
  }),
  createSupplementalCourse({
    id: 'xr-performance-mobile',
    title: 'Optimize Immersive Scenes for Mobile Devices',
    category: 'AR & VR Learning',
    subcategory: 'WebXR Development',
    description: 'Reduce unnecessary scene work and keep AR or VR lessons responsive on phones and standalone headsets.',
    skills: ['3D Optimization', 'WebXR', 'Mobile Performance'],
    videoUrl: 'https://www.youtube.com/watch?v=vnC9Sw6k5Ao',
    lessonTitle: 'Keep a 3D scene responsive',
    notes: `# Mobile XR performance\n\nImmersive scenes must render smoothly while tracking device movement. Dense geometry, oversized textures, and too many dynamic lights can make a scene slow or uncomfortable.\n\n## Optimization steps\n1. Remove objects that do not support the lesson.\n2. Use appropriately sized textures and simple geometry.\n3. Limit real-time lights and expensive effects.\n4. Test on the target phone or headset, not only on a desktop.\n\nMeasure frame behavior before and after a change so you know which optimization helped.`,
    question: 'Which change is most likely to reduce unnecessary rendering work?',
    options: ['Remove off-topic objects and simplify geometry', 'Add more high-resolution textures', 'Increase every light to real-time shadows', 'Duplicate the entire scene'],
    correctAnswer: 0,
    explanation: 'Removing unneeded objects and geometry reduces the number of resources the device must render.',
  }),
  createSupplementalCourse({
    id: 'xr-hit-testing-placement',
    title: 'AR Surface Detection and Object Placement',
    category: 'AR & VR Learning',
    subcategory: 'WebXR Development',
    description: 'Learn the concept of surface detection and design clear placement feedback for AR objects.',
    skills: ['AR', 'WebXR', 'Spatial Tracking'],
    videoUrl: 'https://www.youtube.com/watch?v=Sul61kSfMyU',
    lessonTitle: 'Make object placement understandable',
    notes: `# AR placement and surface detection\n\nSurface detection helps an AR application estimate a place where virtual content can appear. The application should show learners when it is searching, when a suitable surface is found, and when the object has been placed.\n\n## Placement feedback\n- Use a subtle reticle or preview object while searching.\n- Explain what surface or movement is needed.\n- Confirm placement with a visible state change.\n- Allow the learner to reposition or reset the object.\n\nDevice support varies, so provide a fallback scene when immersive placement is unavailable.`,
    question: 'What should an AR lesson show while a learner is finding a surface?',
    options: ['Clear search and placement feedback', 'A success state before placement', 'A blank screen with no instructions', 'A quiz that cannot be closed'],
    correctAnswer: 0,
    explanation: 'Clear feedback helps learners understand when the app is searching and when placement is ready.',
  }),
  createSupplementalCourse({
    id: 'xr-assessment-design',
    title: 'Assess Learning in Immersive Science Activities',
    category: 'AR & VR Learning',
    subcategory: 'Learning Design',
    description: 'Pair immersive exploration with observation prompts and short checks that measure the intended understanding.',
    skills: ['Assessment Design', 'XR', 'Science Education'],
    videoUrl: 'https://www.youtube.com/watch?v=ttDyimAk88Y',
    lessonTitle: 'Write a check for an immersive activity',
    notes: `# Assessing an XR activity\n\nA learner can enjoy exploring a 3D scene without meeting the lesson objective. Use a prompt that asks them to explain, compare, predict, or identify something from the exploration.\n\n## Build a useful check\n1. Name the learning objective in observable terms.\n2. Ask a question that requires evidence from the model.\n3. Provide feedback that explains why an answer is correct.\n4. Let the learner revisit the relevant scene and try again.\n\nKeep completion criteria clear so learners know what is needed for course progress.`,
    question: 'Which prompt best checks understanding after a virtual anatomy exploration?',
    options: ['Explain where one organ sits relative to another', 'Did you enjoy the colors?', 'Did you click every button?', 'Can you guess the background color?'],
    correctAnswer: 0,
    explanation: 'A spatial explanation checks whether the learner understood relationships shown in the model.',
  }),
  createSupplementalCourse({
    id: 'xr-ecosystem-field-lab',
    title: 'AR & VR Ecosystem Field Lab',
    category: 'AR & VR Learning',
    subcategory: 'Immersive Science',
    description: 'Use an immersive ecosystem scene to identify producers, consumers, decomposers, and energy relationships.',
    skills: ['Ecology', 'Virtual Labs', 'AR & VR'],
    videoUrl: 'https://www.youtube.com/watch?v=v6ubvEJ3KGM',
    lessonTitle: 'Investigate an ecosystem in 3D',
    notes: `# Immersive ecosystem field lab\n\nA virtual field scene can help learners inspect organisms and trace relationships that are difficult to observe in a short classroom session. The model should distinguish observed evidence from simplified representations.\n\n## Investigation sequence\n1. Identify the habitat and the living and nonliving features shown.\n2. Sort organisms into producer, consumer, or decomposer roles.\n3. Trace one energy pathway through the food web.\n4. Change one condition and predict which relationships could be affected.\n\nAsk learners to support their explanation with details they observed in the scene.`,
    question: 'Which statement best describes the role of decomposers in an ecosystem?',
    options: ['They break down organic matter and help return nutrients', 'They create sunlight', 'They consume only rocks', 'They stop all energy transfer'],
    correctAnswer: 0,
    explanation: 'Decomposers break down dead organisms and waste, making nutrients available again in the ecosystem.',
  }),
  createSupplementalCourse({
    id: 'agri-water-management',
    title: 'Agriculture: Efficient Irrigation and Water Management',
    category: 'BSc Agriculture',
    subcategory: 'Agronomy',
    description: 'Compare irrigation methods and plan water use around crop needs, soil, and local conditions.',
    skills: ['Irrigation', 'Water Management', 'Agronomy'],
    videoUrl: 'https://youtu.be/8ulpy_GFLDk',
    lessonTitle: 'Match irrigation to field conditions',
    notes: `# Irrigation planning\n\nIrrigation planning aims to provide water when and where a crop needs it while reducing avoidable losses. Soil texture, crop stage, weather, field slope, and water availability all influence the choice.\n\n## Compare methods\n- Surface irrigation can suit level fields but needs careful flow management.\n- Sprinklers distribute water over the crop and soil surface.\n- Drip systems deliver water near plant roots and can reduce evaporation.\n\nCheck local recommendations and water quality before choosing or scheduling a method.`,
    question: 'Where does a drip irrigation system deliver most of its water?',
    options: ['Near the crop root zone', 'Only above the tree canopy', 'Into the field boundary drains', 'Directly into the atmosphere'],
    correctAnswer: 0,
    explanation: 'Drip systems apply water near the plant root zone through emitters.',
  }),
  createSupplementalCourse({
    id: 'agri-seed-quality',
    title: 'Agriculture: Seed Quality and Germination',
    category: 'BSc Agriculture',
    subcategory: 'Seed Science',
    description: 'Review seed viability, vigor, storage, and the conditions required for reliable germination.',
    skills: ['Seed Science', 'Germination', 'Crop Production'],
    videoUrl: 'https://youtu.be/JTdRho4j3qw',
    lessonTitle: 'Conditions that support germination',
    notes: `# Seed quality and germination\n\nSeed quality includes genetic identity, physical purity, viability, and vigor. Germination begins when a viable seed takes up water and the embryo resumes growth under suitable conditions.\n\n## Remember\n- Water activates metabolic processes in the seed.\n- Oxygen supports respiration during early growth.\n- Temperature affects the rate and success of germination.\n- Storage conditions influence how well seed remains viable.\n\nA germination test uses a representative sample and consistent conditions so results can be compared.`,
    question: 'Which resource is needed for a seed to begin normal germination?',
    options: ['Water, oxygen, and suitable temperature', 'Darkness and fertilizer only', 'Pesticide and strong wind', 'Salt water and dry soil'],
    correctAnswer: 0,
    explanation: 'Water, oxygen, and a suitable temperature are core environmental requirements for germination.',
  }),
  createSupplementalCourse({
    id: 'agri-integrated-pest-management',
    title: 'Agriculture: Integrated Pest Management',
    category: 'BSc Agriculture',
    subcategory: 'Crop Protection',
    description: 'Use monitoring, prevention, biological controls, and careful interventions in an integrated pest plan.',
    skills: ['Integrated Pest Management', 'Crop Protection', 'Field Monitoring'],
    videoUrl: 'https://youtu.be/ZM2X-XBRKHM',
    lessonTitle: 'Build a monitoring-led pest plan',
    notes: `# Integrated pest management\n\nIntegrated pest management (IPM) combines compatible methods to keep pest damage within acceptable limits. It begins with correct identification and monitoring rather than automatic spraying.\n\n## Decision sequence\n1. Identify the pest and record its distribution.\n2. Monitor crop damage and beneficial organisms.\n3. Use prevention and cultural or biological controls where appropriate.\n4. Consider a targeted, label-compliant treatment only when a threshold is reached.\n\nRecheck the field after action and keep records to improve future decisions.`,
    question: 'What should an IPM plan do before selecting a control measure?',
    options: ['Identify and monitor the pest', 'Apply every available pesticide', 'Ignore beneficial organisms', 'Wait until the crop is harvested'],
    correctAnswer: 0,
    explanation: 'Correct identification and monitoring provide the evidence needed to choose a suitable intervention.',
  }),
  createSupplementalCourse({
    id: 'agri-crop-nutrition',
    title: 'Agriculture: Plant Nutrients and Fertilizer Planning',
    category: 'BSc Agriculture',
    subcategory: 'Soil Fertility',
    description: 'Connect soil testing, plant nutrient roles, and responsible fertilizer decisions for crop growth.',
    skills: ['Plant Nutrition', 'Soil Fertility', 'Crop Management'],
    videoUrl: 'https://youtu.be/voWgADFhht8',
    lessonTitle: 'Plan nutrients from evidence',
    notes: `# Plant nutrients and fertilizer planning\n\nPlants need essential nutrients in different amounts. Nutrient availability depends on soil properties, moisture, pH, crop demand, and the timing and placement of inputs.\n\n## A responsible approach\n- Use a representative soil test and local crop guidance.\n- Match nutrient type and amount to the crop stage and expected removal.\n- Place and time fertilizer to improve plant access and limit losses.\n- Keep records and observe crop response.\n\nSymptoms alone can be misleading; confirm suspected deficiencies before applying inputs.`,
    question: 'What is a strong starting point for a fertilizer plan?',
    options: ['A soil test and crop-specific local guidance', 'A guess based only on leaf color', 'The same high rate for every field', 'Ignoring crop growth stage'],
    correctAnswer: 0,
    explanation: 'Soil testing and local crop guidance help match nutrients to actual field conditions and crop needs.',
  }),
  createSupplementalCourse({
    id: 'agri-crop-rotation',
    title: 'Agriculture: Crop Rotation and Sustainable Systems',
    category: 'BSc Agriculture',
    subcategory: 'Sustainable Agriculture',
    description: 'Design a crop sequence that considers soil cover, nutrient cycling, pest cycles, and farm goals.',
    skills: ['Crop Rotation', 'Soil Health', 'Sustainable Agriculture'],
    videoUrl: 'https://youtu.be/e-FXzFhk4Ag',
    lessonTitle: 'Plan a useful crop sequence',
    notes: `# Crop rotation\n\nCrop rotation changes the crop grown in a field over time. A well-planned sequence can diversify root structures, residue, nutrient demand, and pest hosts. Benefits depend on the crops selected and local soil and climate.\n\n## Planning questions\n- Are crops from different plant families included?\n- Does the sequence maintain soil cover?\n- How do nutrient needs and residues change between crops?\n- Could the rotation interrupt a pest or disease cycle?\n\nRotation supports a broader management plan; it does not guarantee that every pest or soil problem disappears.`,
    question: 'How can a diverse crop rotation help manage some crop diseases?',
    options: ['By interrupting the continuous availability of a preferred host', 'By making every soil pathogen disappear', 'By preventing all weather damage', 'By removing the need to inspect crops'],
    correctAnswer: 0,
    explanation: 'Changing host crops can interrupt the life cycles of some pathogens and pests.',
  }),
  createSupplementalCourse({
    id: 'biology-ecosystems',
    title: 'Biology: Ecosystems and Energy Flow',
    category: 'Academic Education',
    subcategory: 'Biology',
    description: 'Trace energy through producers, consumers, and decomposers in an ecosystem.',
    skills: ['Ecology', 'Food Webs', 'Energy Flow'],
    videoUrl: 'https://www.youtube.com/watch?v=v6ubvEJ3KGM',
    lessonTitle: 'Follow energy through a food web',
    notes: `# Ecosystems and energy\n\nAn ecosystem includes living organisms and the nonliving environment with which they interact. Energy enters most ecosystems through sunlight captured by producers, then moves through feeding relationships.\n\n## Food-web roles\n- Producers make organic matter using an energy source.\n- Consumers obtain energy by eating other organisms.\n- Decomposers break down dead matter and return nutrients to the environment.\n\nEnergy is transferred between trophic levels, while matter such as carbon and nitrogen cycles through organisms and the environment.`,
    question: 'Which organisms usually capture sunlight to begin energy flow in a food web?',
    options: ['Producers', 'Top predators', 'Decomposers only', 'Parasites only'],
    correctAnswer: 0,
    explanation: 'Producers such as plants and algae capture light energy and store it in organic matter.',
  }),
  createSupplementalCourse({
    id: 'astronomy-solar-system',
    title: 'Astronomy: Planets and the Solar System',
    category: 'Academic Education',
    subcategory: 'Astronomy',
    description: 'Learn the organization of the solar system and compare planetary orbits and major bodies.',
    skills: ['Astronomy', 'Planetary Science', 'Scientific Models'],
    videoUrl: 'https://www.youtube.com/watch?v=TKM0P3XlMNA',
    lessonTitle: 'Map the solar system',
    notes: `# The solar system\n\nThe solar system includes the Sun, planets, dwarf planets, moons, smaller bodies, and the space in which they move. The planets orbit the Sun, but their paths, sizes, and compositions differ.\n\n## Study the system\n- Compare the inner rocky planets with the outer giant planets.\n- Track orbital order from the Sun.\n- Distinguish a moon orbiting a planet from a planet orbiting the Sun.\n- Treat classroom diagrams as models that simplify scale.\n\nUse evidence from observation and spacecraft missions to refine models of planetary systems.`,
    question: 'What do planets in our solar system orbit?',
    options: ['The Sun', 'Earth', 'The nearest moon', 'The Milky Way center directly'],
    correctAnswer: 0,
    explanation: 'The planets in our solar system orbit the Sun.',
  }),
  createSupplementalCourse({
    id: 'chemistry-atoms-elements',
    title: 'Chemistry: Atoms, Elements, and Compounds',
    category: 'Academic Education',
    subcategory: 'Chemistry',
    description: 'Understand how atoms define elements and combine into molecules and compounds.',
    skills: ['Atomic Structure', 'Elements', 'Chemical Bonding'],
    videoUrl: 'https://www.youtube.com/watch?v=IFKnq9QM6_A',
    lessonTitle: 'Connect atoms to elements',
    notes: `# Atoms, elements, and compounds\n\nAn atom is the smallest unit that retains the chemical identity of an element. The number of protons in the nucleus defines the element; atoms may gain, lose, or share electrons during chemical interactions.\n\n## Keep the terms clear\n- An element contains one type of atom.\n- A molecule contains atoms joined by chemical bonds.\n- A compound contains atoms of more than one element in a fixed chemical combination.\n\nWater, H2O, contains hydrogen and oxygen atoms in a two-to-one ratio.`,
    question: 'What determines which chemical element an atom belongs to?',
    options: ['The number of protons in its nucleus', 'The number of surrounding molecules', 'Its color in a diagram', 'The number of atoms in a nearby compound'],
    correctAnswer: 0,
    explanation: 'An element is identified by its atomic number, the number of protons in the nucleus.',
  }),
  createSupplementalCourse({
    id: 'chemistry-periodic-table',
    title: 'Chemistry: Reading the Periodic Table',
    category: 'Academic Education',
    subcategory: 'Chemistry',
    description: 'Read element symbols, atomic numbers, groups, and periods to find patterns in element properties.',
    skills: ['Periodic Table', 'Chemistry', 'Atomic Structure'],
    videoUrl: 'https://www.youtube.com/watch?v=0RRVV4Diomg',
    lessonTitle: 'Find patterns in the periodic table',
    notes: `# Reading the periodic table\n\nThe periodic table organizes elements by atomic number and recurring chemical properties. Each element box commonly shows a symbol, name, atomic number, and relative atomic mass.\n\n## How to navigate\n- Atomic number identifies the element.\n- A period is a horizontal row.\n- A group is a vertical column with elements that often share chemical patterns.\n- The table's regions broadly distinguish metals, nonmetals, and metalloids.\n\nUse position to generate a prediction, then check the prediction against measured chemical behavior.`,
    question: 'What is the atomic number of an element equal to?',
    options: ['The number of protons in its nucleus', 'Its number of electron shells only', 'Its mass in grams', 'The number of elements in its group'],
    correctAnswer: 0,
    explanation: 'Atomic number is defined as the number of protons in an atom’s nucleus.',
  }),
  createSupplementalCourse({
    id: 'biology-cell-division',
    title: 'Biology: Cell Division and the Cell Cycle',
    category: 'Academic Education',
    subcategory: 'Biology',
    description: 'Follow the main stages of the cell cycle and understand why cells divide.',
    skills: ['Cell Biology', 'Mitosis', 'Life Science'],
    videoUrl: 'https://www.youtube.com/watch?v=7xeFP0SEDdc',
    lessonTitle: 'Trace a cell through mitosis',
    notes: `# Cell cycle and mitosis\n\nThe cell cycle includes growth, DNA replication, and division. During mitosis, duplicated chromosomes are separated so each daughter cell receives a matching set of genetic information.\n\n## Main ideas\n- Interphase includes growth and DNA copying.\n- Mitosis separates the duplicated chromosomes.\n- Cytokinesis divides the cell contents.\n- Checkpoints help regulate progression through the cycle.\n\nMitosis supports growth and tissue repair in many organisms; it is distinct from meiosis, which produces cells for sexual reproduction.`,
    question: 'What is the result of mitosis in a typical body cell?',
    options: ['Two daughter cells with matching sets of chromosomes', 'Four genetically unique gametes', 'One cell with no DNA', 'A single new species'],
    correctAnswer: 0,
    explanation: 'Mitosis separates duplicated chromosomes so two daughter cells receive matching chromosome sets.',
  }),
  createSupplementalCourse({
    id: 'data-statistics-basics',
    title: 'Statistics: Averages and Data Distributions',
    category: 'Academic Education',
    subcategory: 'Mathematics',
    description: 'Choose and interpret mean, median, and range while noticing how unusual values affect a dataset.',
    skills: ['Statistics', 'Data Analysis', 'Numeracy'],
    videoUrl: 'https://www.youtube.com/watch?v=oHf-09998F0',
    lessonTitle: 'Summarize a small dataset',
    notes: `# Describing data\n\nA statistic summarizes a feature of a dataset. The mean uses every value and can be affected by extreme values. The median is the middle value after sorting, and the range is the difference between the largest and smallest values.\n\n## Choose with context\n- Sort the data before finding the median.\n- Compare mean and median when the distribution is skewed.\n- Report units and sample size with a summary.\n- Look at a graph as well as a single number.\n\nNo single summary describes every important feature of a distribution.`,
    question: 'Which measure is usually less affected by one extremely high value?',
    options: ['Median', 'Mean', 'Range', 'Sum'],
    correctAnswer: 0,
    explanation: 'The median depends on the middle position after sorting, so one extreme value often has less effect than it does on the mean.',
  }),
  createSupplementalCourse({
    id: 'data-charts-communication',
    title: 'Data Literacy: Select a Clear Chart',
    category: 'Academic Education',
    subcategory: 'Data Literacy',
    description: 'Match chart types to comparisons, trends, and distributions, and label a visualization honestly.',
    skills: ['Data Visualization', 'Chart Design', 'Communication'],
    videoUrl: 'https://www.youtube.com/watch?v=h8EYEJ32oQ8',
    lessonTitle: 'Match the chart to the question',
    notes: `# Choosing a chart\n\nA chart should make a specific comparison easier to see. A bar chart works well for comparing categories, while a line chart can show change across an ordered time axis.\n\n## Check the message\n- Start with the question the reader needs to answer.\n- Label axes, units, categories, and time periods.\n- Use scales that do not exaggerate small differences.\n- Include a source and explain missing or filtered data.\n\nA clear title tells readers what is being measured, not what conclusion they are expected to reach.`,
    question: 'Which chart is commonly suited to showing a value changing over time?',
    options: ['Line chart', 'Unlabeled decorative chart', 'Word cloud', 'Randomly ordered icon grid'],
    correctAnswer: 0,
    explanation: 'A line chart makes ordered change and trends over time easy to inspect.',
  }),
  createSupplementalCourse({
    id: 'python-data-automation',
    title: 'Python: Automate Everyday Data Tasks',
    category: 'Skill-based Courses',
    subcategory: 'Programming',
    description: 'Use variables, lists, loops, and functions to organize and process a small dataset.',
    skills: ['Python', 'Automation', 'Problem Solving'],
    videoUrl: 'https://www.youtube.com/watch?v=s0TDQLb4U6o',
    lessonTitle: 'Write a small repeatable data task',
    notes: `# Python data task\n\nA short program can repeat routine data work consistently. Use variables for named values, lists for ordered collections, loops for repeated operations, and functions for reusable steps.\n\n## Plan before coding\n1. Describe the input and expected output.\n2. Try the logic on a tiny example.\n3. Use clear names and handle empty or unexpected inputs.\n4. Check the output against a known result.\n\nSmall, testable steps make a script easier to understand and maintain.`,
    question: 'Which Python structure is designed to hold an ordered collection of values?',
    options: ['List', 'Comment', 'Comparison operator', 'Indentation error'],
    correctAnswer: 0,
    explanation: 'A Python list stores an ordered collection of values.',
  }),
  createSupplementalCourse({
    id: 'web-html-css-layout',
    title: 'Web Design: Responsive HTML and CSS Layouts',
    category: 'Skill-based Courses',
    subcategory: 'Web Development',
    description: 'Structure an accessible page and use flexible CSS layout rules across common screen sizes.',
    skills: ['HTML', 'CSS', 'Responsive Design'],
    videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
    lessonTitle: 'Structure a responsive page',
    notes: `# Responsive web layout\n\nHTML provides the structure and meaning of page content. CSS controls presentation and layout. Responsive design lets the same content adapt to different viewport sizes.\n\n## Start with structure\n- Use semantic elements that match the content.\n- Keep headings in a logical order.\n- Use flexible widths and spacing rather than fixed page-wide dimensions.\n- Check keyboard focus, contrast, and narrow screen behavior.\n\nA layout is responsive when content remains usable, not merely when it fits on screen.`,
    question: 'Which language provides the semantic structure of a web page?',
    options: ['HTML', 'CSS', 'JPEG', 'SQL'],
    correctAnswer: 0,
    explanation: 'HTML describes the structure and meaning of the content; CSS controls its presentation.',
  }),
  createSupplementalCourse({
    id: 'cybersecurity-passwords',
    title: 'Cybersecurity: Passwords and Account Protection',
    category: 'Skill-based Courses',
    subcategory: 'Cybersecurity',
    description: 'Reduce common account risks with unique passwords, a password manager, and multi-factor authentication.',
    skills: ['Cybersecurity', 'Account Safety', 'Digital Literacy'],
    videoUrl: 'https://www.youtube.com/watch?v=QWwaidg3AtY',
    lessonTitle: 'Protect an online account',
    notes: `# Protecting online accounts\n\nAccount security depends on making stolen or guessed credentials less useful. Reusing one password across services lets a breach at one site affect other accounts.\n\n## Safer habits\n- Use a unique, long password for each account.\n- Store passwords in a trusted password manager.\n- Turn on multi-factor authentication when available.\n- Check the web address before entering credentials.\n\nNever share a one-time code with someone who contacted you unexpectedly.`,
    question: 'Why should important accounts use unique passwords?',
    options: ['A breach at one service is less likely to expose other accounts', 'Unique passwords make phishing impossible', 'It removes the need for account recovery', 'It makes public Wi-Fi private'],
    correctAnswer: 0,
    explanation: 'Unique passwords limit the damage if credentials from one service are exposed.',
  }),
  createSupplementalCourse({
    id: 'cybersecurity-phishing',
    title: 'Cybersecurity: Spot Phishing and Social Engineering',
    category: 'Skill-based Courses',
    subcategory: 'Cybersecurity',
    description: 'Recognize suspicious requests and verify links and senders before sharing information.',
    skills: ['Phishing Awareness', 'Online Safety', 'Cybersecurity'],
    videoUrl: 'https://www.youtube.com/watch?v=UCkjoQjbY_s',
    lessonTitle: 'Check a message before acting',
    notes: `# Spotting phishing\n\nPhishing messages try to persuade people to reveal information, open a harmful attachment, or sign in on a false page. They can appear through email, texts, social media, or phone calls.\n\n## Slow down and check\n- Verify the sender using a known contact method.\n- Inspect the actual link destination before opening it.\n- Be cautious with urgent requests for passwords or codes.\n- Report suspicious messages through the organization's process.\n\nA familiar logo or display name alone does not prove that a message is authentic.`,
    question: 'What is a safer response to an unexpected urgent request for a sign-in code?',
    options: ['Verify the request through a known, separate contact channel', 'Reply with the code immediately', 'Forward the code to coworkers', 'Open every link in the message'],
    correctAnswer: 0,
    explanation: 'Verifying separately avoids relying on the potentially compromised message itself.',
  }),
  createSupplementalCourse({
    id: 'finance-budget-planning',
    title: 'Personal Finance: Build a Practical Monthly Budget',
    category: 'Skill-based Courses',
    subcategory: 'Personal Finance',
    description: 'Track income and spending, plan for recurring costs, and set a realistic savings target.',
    skills: ['Budgeting', 'Financial Planning', 'Money Management'],
    videoUrl: 'https://www.youtube.com/watch?v=qQLLDPAEzT0',
    lessonTitle: 'Map monthly income and expenses',
    notes: `# A monthly budget\n\nA budget compares expected income with planned expenses. It helps reveal regular commitments, flexible spending, and room for savings.\n\n## Build a first draft\n1. Estimate take-home income for the month.\n2. List fixed costs such as rent and subscriptions.\n3. Review variable spending such as food and transport.\n4. Set aside a realistic amount for savings and irregular expenses.\n\nReview the budget against actual spending and adjust it as circumstances change.`,
    question: 'What should a useful monthly budget compare?',
    options: ['Income and planned spending', 'Only a list of purchases', 'The balance of someone else’s account', 'Expenses without dates or categories'],
    correctAnswer: 0,
    explanation: 'A budget organizes income and spending so a person can plan and review financial choices.',
  }),
  createSupplementalCourse({
    id: 'finance-emergency-savings',
    title: 'Personal Finance: Plan for Emergency Savings',
    category: 'Skill-based Courses',
    subcategory: 'Personal Finance',
    description: 'Set a savings goal and choose a regular contribution that fits your income and essential expenses.',
    skills: ['Saving', 'Financial Resilience', 'Planning'],
    videoUrl: 'https://www.youtube.com/watch?v=Rm6UdfRs3gw',
    lessonTitle: 'Turn a savings goal into a plan',
    notes: `# Emergency savings\n\nEmergency savings can help cover unexpected costs or a temporary loss of income. A useful target depends on household needs, income stability, and available support.\n\n## Make progress manageable\n- Start with a specific, reachable first target.\n- Set a regular contribution amount and date.\n- Keep savings accessible for genuine emergencies.\n- Review the target after major changes in income or expenses.\n\nAvoid taking on high-cost debt or investment risk based only on a general savings rule; individual circumstances differ.`,
    question: 'Which step makes a savings goal easier to follow?',
    options: ['Choose a regular contribution amount and review it over time', 'Wait for an unspecified large payment', 'Ignore essential expenses', 'Spend the savings on routine purchases'],
    correctAnswer: 0,
    explanation: 'A specific recurring contribution turns a broad goal into an actionable plan.',
  }),
  createSupplementalCourse({
    id: 'web-javascript-interactivity',
    title: 'Web Development: Add Interactivity with JavaScript',
    category: 'Skill-based Courses',
    subcategory: 'Web Development',
    description: 'Connect user actions to clear page updates with basic JavaScript event handling.',
    skills: ['JavaScript', 'Web Development', 'Interaction'],
    videoUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s',
    lessonTitle: 'Respond to a user action',
    notes: `# JavaScript interactions\n\nJavaScript can respond to events such as a button click and update page content. Keep the behavior predictable and communicate state changes to all users.\n\n## Interaction flow\n1. Select the intended element.\n2. Listen for a meaningful event.\n3. Validate the action or input.\n4. Update the page and show a clear result.\n\nUse semantic HTML controls so keyboard and assistive technology users can operate the feature as well.`,
    question: 'What does an event listener do in a web page?',
    options: ['Runs a response when a specified event occurs', 'Changes HTML into a database', 'Guarantees a network connection', 'Stores every user password'],
    correctAnswer: 0,
    explanation: 'An event listener connects an event, such as a click, to code that responds to it.',
  }),
  createSupplementalCourse({
    id: 'upsc-indian-polity-basics',
    title: 'UPSC: Foundations of the Indian Constitution',
    category: 'Competitive Exams',
    subcategory: 'Indian Polity',
    description: 'Review constitutional structure, fundamental rights, and the role of institutions as a starting point for exam study.',
    skills: ['Indian Polity', 'Constitution', 'Exam Preparation'],
    videoUrl: 'https://www.youtube.com/watch?v=G5STfWKbF0E',
    lessonTitle: 'Understand constitutional foundations',
    notes: `# Constitutional foundations\n\nThe Constitution of India sets out the structure of government, distributes public powers, and protects rights. Exam preparation should connect constitutional text with institutions and current public questions.\n\n## Study method\n- Learn key terms and constitutional parts from a reliable text.\n- Distinguish the roles of the Union, states, and local institutions.\n- Compare rights, duties, and directive principles carefully.\n- Use dated notes for amendments and current affairs.\n\nVerify legal and syllabus details against current official materials before an examination.`,
    question: 'What is a central role of a constitution?',
    options: ['Set the framework for government and public powers', 'Replace every ordinary law', 'Decide the result of every election', 'Remove the need for public institutions'],
    correctAnswer: 0,
    explanation: 'A constitution establishes core government structures, powers, and principles.',
  }),
  createSupplementalCourse({
    id: 'upsc-current-affairs-notes',
    title: 'UPSC: Build a Current Affairs Revision System',
    category: 'Competitive Exams',
    subcategory: 'Exam Preparation',
    description: 'Organize current affairs around syllabus topics, evidence, and concise revision notes.',
    skills: ['Current Affairs', 'Note Making', 'Exam Preparation'],
    videoUrl: 'https://www.youtube.com/watch?v=XbHer3LuGOs',
    lessonTitle: 'Turn a news item into a revision note',
    notes: `# Current affairs revision\n\nUseful exam notes connect a news event to a syllabus concept. A short, structured record is easier to revise than a collection of copied headlines.\n\n## Note structure\n- Record the event date and reliable source.\n- Explain the background and relevant institution or policy.\n- Note different perspectives and supporting evidence.\n- Add the syllabus theme and one possible question.\n\nCheck updates before the exam because policies, data, and official positions may change.`,
    question: 'What makes a current-affairs note useful for revision?',
    options: ['A clear link between the event and a syllabus concept', 'A headline without a date or source', 'A copied article with no summary', 'An opinion with no supporting information'],
    correctAnswer: 0,
    explanation: 'Connecting the event to a syllabus theme makes the note useful for recall and application.',
  }),
  createSupplementalCourse({
    id: 'fitness-mobility-foundations',
    title: 'Fitness: Gentle Mobility and Movement Foundations',
    category: 'Sports & Fitness',
    subcategory: 'Mobility',
    description: 'Practice a simple movement routine with gradual range of motion, steady breathing, and personal pacing.',
    skills: ['Mobility', 'Movement', 'Fitness'],
    videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    lessonTitle: 'Move with control and comfortable range',
    notes: `# Mobility foundations\n\nMobility practice explores comfortable movement through a joint's available range. Move gradually, keep breathing, and adjust a position when it causes sharp or unusual pain.\n\n## Build a short routine\n- Begin with a gentle warm-up.\n- Move slowly and avoid forcing end ranges.\n- Use support when balance is uncertain.\n- Stop if you feel pain, dizziness, or unusual shortness of breath.\n\nThis is general learning content. Choose movements appropriate to your condition and follow guidance from a qualified professional when needed.`,
    question: 'How should a beginner approach a new mobility movement?',
    options: ['Move gradually within a comfortable range', 'Force the deepest position immediately', 'Hold the breath throughout', 'Continue through sharp pain'],
    correctAnswer: 0,
    explanation: 'Gradual, controlled movement helps learners explore a comfortable range and notice their response.',
  }),
  createSupplementalCourse({
    id: 'fitness-breathing-recovery',
    title: 'Fitness: Breathing, Recovery, and Mindful Practice',
    category: 'Sports & Fitness',
    subcategory: 'Wellbeing',
    description: 'Use simple breathing awareness and recovery habits to support a calm, sustainable movement practice.',
    skills: ['Breath Awareness', 'Recovery', 'Mindful Movement'],
    videoUrl: 'https://www.youtube.com/watch?v=nM-ySWyID9o',
    lessonTitle: 'Pair steady breathing with movement',
    notes: `# Breathing and recovery\n\nBreath awareness can help a person notice effort and settle into a comfortable pace. Recovery also includes sleep, hydration, rest, and adjusting activity to match current ability.\n\n## Practice\n- Choose a comfortable seated or standing position.\n- Breathe naturally; do not force a breath hold.\n- Notice tension and release what you can.\n- Take breaks and return to normal breathing if uncomfortable.\n\nThis activity is educational and is not a substitute for individualized health advice.`,
    question: 'What should you do if a breathing exercise feels uncomfortable?',
    options: ['Stop the exercise and return to comfortable normal breathing', 'Force a longer breath hold', 'Speed up the exercise', 'Ignore dizziness'],
    correctAnswer: 0,
    explanation: 'Stop and return to natural breathing if discomfort or dizziness occurs.',
  }),
  createSupplementalCourse({
    id: 'fitness-yoga-balance',
    title: 'Fitness: Beginner Yoga Balance and Posture',
    category: 'Sports & Fitness',
    subcategory: 'Yoga',
    description: 'Learn to set a stable base, use support, and approach beginner balance poses with control.',
    skills: ['Yoga', 'Balance', 'Posture'],
    videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    lessonTitle: 'Build a stable balance pose',
    notes: `# Balance and posture\n\nBalance depends on a stable base, visual focus, and the body's ongoing adjustments. A wall or sturdy chair can provide support while a learner practices.\n\n## Try a supported balance\n1. Stand near a wall with both feet grounded.\n2. Shift weight slowly and keep a soft bend in the standing knee.\n3. Use a hand on the wall if needed.\n4. Stop if balance feels unsafe or painful.\n\nThe goal is controlled practice, not achieving a particular pose shape.`,
    question: 'What is a sensible support for a beginner balance exercise?',
    options: ['A wall or sturdy chair within reach', 'A rolling chair', 'A slippery floor', 'Closing the eyes before balance feels steady'],
    correctAnswer: 0,
    explanation: 'A stable support can make balance practice safer and more accessible for beginners.',
  }),
]

export const coursesData = [
  {
    id: 'ml-101',
    title: 'Machine Learning Fundamentals',
    category: 'Academic Education',
    subcategory: 'Computer Science',
    description:
      'Master the fundamentals of machine learning with hands-on projects and real-world applications.',
    instructor: 'Dr. Sarah Johnson',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    totalLessons: 3,
    rating: 4.8,
    enrolledCount: 12540,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Neural Networks'],
    playlist: [
      {
        id: 'ml-101-1',
        title: 'Introduction to Machine Learning',
        duration: '45 min',
        videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
        notes: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

### Key Concepts:

1. **Supervised Learning**: Learning from labeled data
   - Classification problems
   - Regression problems

2. **Unsupervised Learning**: Finding patterns in unlabeled data
   - Clustering
   - Dimensionality reduction

3. **Reinforcement Learning**: Learning through trial and error
   - Reward-based learning
   - Decision making

### Real-World Applications:

- **Healthcare**: Disease prediction, medical imaging analysis
- **Finance**: Fraud detection, algorithmic trading
- **E-commerce**: Recommendation systems, price optimization
- **Transportation**: Self-driving cars, route optimization

### Why Learn Machine Learning?

Machine learning is transforming every industry. Understanding ML fundamentals opens doors to:
- High-paying career opportunities
- Solving complex real-world problems
- Innovation in technology

### Prerequisites:

- Basic Python programming
- Understanding of statistics
- Linear algebra basics
- Curiosity and problem-solving mindset`,
        mcqs: [
          {
            id: 'ml-101-1-q1',
            question: 'What is the primary characteristic of supervised learning?',
            options: [
              'Learning from unlabeled data',
              'Learning from labeled data with known outcomes',
              'Learning through trial and error',
              'Learning without any data',
            ],
            correctAnswer: 1,
            explanation:
              'Supervised learning uses labeled data where the correct answer is known, allowing the model to learn patterns and make predictions.',
          },
          {
            id: 'ml-101-1-q2',
            question: 'Which of the following is NOT a type of machine learning?',
            options: [
              'Supervised Learning',
              'Unsupervised Learning',
              'Reinforcement Learning',
              'Deterministic Learning',
            ],
            correctAnswer: 3,
            explanation:
              'The three main types of machine learning are supervised, unsupervised, and reinforcement learning. Deterministic learning is not a recognized ML category.',
          },
          {
            id: 'ml-101-1-q3',
            question: 'What is a common application of unsupervised learning?',
            options: [
              'Email spam detection',
              'Customer segmentation',
              'House price prediction',
              'Image classification',
            ],
            correctAnswer: 1,
            explanation:
              'Customer segmentation uses clustering, an unsupervised learning technique, to group similar customers without predefined labels.',
          },
        ],
      },
      {
        id: 'ml-101-2',
        title: 'Python for Machine Learning',
        duration: '52 min',
        videoUrl: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
        notes: `# Python for Machine Learning

## Why Python?

Python is the most popular language for machine learning due to:
- Simple, readable syntax
- Extensive libraries (NumPy, Pandas, Scikit-learn)
- Large community support
- Cross-platform compatibility

## Essential Libraries:

### 1. NumPy
\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Mathematical operations
mean = np.mean(arr)
std = np.std(arr)
\`\`\`

### 2. Pandas
\`\`\`python
import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35]
})

# Data manipulation
filtered = df[df['age'] > 28]
\`\`\`

### 3. Matplotlib
\`\`\`python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('Sample Plot')
plt.show()
\`\`\`

## Data Structures for ML:

1. **Arrays**: Efficient numerical computations
2. **DataFrames**: Tabular data manipulation
3. **Matrices**: Linear algebra operations
4. **Tensors**: Multi-dimensional arrays for deep learning`,
        mcqs: [
          {
            id: 'ml-101-2-q1',
            question: 'Which Python library is primarily used for numerical computations in ML?',
            options: ['Pandas', 'NumPy', 'Matplotlib', 'Requests'],
            correctAnswer: 1,
            explanation:
              'NumPy (Numerical Python) is the fundamental library for numerical computations and array operations in machine learning.',
          },
          {
            id: 'ml-101-2-q2',
            question: 'What data structure does Pandas primarily work with?',
            options: ['Lists', 'Arrays', 'DataFrames', 'Dictionaries'],
            correctAnswer: 2,
            explanation:
              'Pandas works primarily with DataFrames, which are 2-dimensional labeled data structures similar to spreadsheets.',
          },
        ],
      },
      {
        id: 'ml-101-3',
        title: 'Linear Regression Basics',
        duration: '48 min',
        videoUrl: 'https://www.youtube.com/watch?v=7ArmBVF2dCs',
        notes: `# Linear Regression

## What is Linear Regression?

Linear regression is a fundamental supervised learning algorithm that models the relationship between variables by fitting a linear equation.

## The Linear Equation:

**y = mx + b**

Where:
- y = predicted value (dependent variable)
- x = input feature (independent variable)
- m = slope (coefficient)
- b = y-intercept (bias)

## Types of Linear Regression:

### 1. Simple Linear Regression
- One independent variable
- Example: Predicting house price based on size

### 2. Multiple Linear Regression
- Multiple independent variables
- Example: Predicting house price based on size, location, and age

## Cost Function (Mean Squared Error):

MSE = (1/n) Σ(actual - predicted)²

The goal is to minimize this cost function to find the best-fit line.

## Implementation Example:

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make predictions
predictions = model.predict([[6], [7]])
print(predictions)  # [12, 14]
\`\`\`

## Real-World Applications:

- Sales forecasting
- Risk assessment
- Trend analysis
- Price prediction`,
        mcqs: [
          {
            id: 'ml-101-3-q1',
            question: 'In the equation y = mx + b, what does m represent?',
            options: ['Y-intercept', 'Slope', 'Predicted value', 'Input feature'],
            correctAnswer: 1,
            explanation:
              'm represents the slope, which determines how much y changes for each unit change in x.',
          },
          {
            id: 'ml-101-3-q2',
            question: 'What is the goal when training a linear regression model?',
            options: [
              'Maximize the cost function',
              'Minimize the cost function',
              'Keep the cost function constant',
              'Ignore the cost function',
            ],
            correctAnswer: 1,
            explanation:
              'The goal is to minimize the cost function (typically MSE) to find the best-fit line that reduces prediction errors.',
          },
        ],
      },
    ],
  },
  {
    id: 'python-foundations',
    title: 'Python Programming Foundations',
    category: 'Skill-based Courses',
    subcategory: 'Programming',
    description:
      'Learn Python step by step with clear explanations, runnable examples, and short knowledge checks.',
    instructor: 'Vidhya Learning Team',
    difficulty: 'Beginner',
    duration: '3 weeks',
    totalLessons: 3,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop',
    skills: ['Python', 'Programming Logic', 'Functions', 'Data Structures'],
    playlist: [
      createLesson({
        id: 'python-foundations-1',
        title: 'Values, Variables, and Types',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=s0TDQLb4U6o',
        notes: `# Values, Variables, and Types

Python stores information as values. A variable gives a value a readable name:

python
student = "Mina"
lessons_finished = 3
is_enrolled = True


Common built-in types include str (text), int (whole numbers), float (decimal numbers), and bool (True or False). Use type(value) to inspect a value. Names are case-sensitive and should describe what they hold.

Convert between compatible types with int(), float(), or str(). Conversion can fail when the text is not a valid number, so validate external input before converting it.`,
        question: 'Which Python type represents a true-or-false value?',
        options: ['str', 'bool', 'float', 'list'],
        correctAnswer: 1,
        explanation: 'The bool type represents either True or False.',
      }),
      createLesson({
        id: 'python-foundations-2',
        title: 'Conditions, Loops, and Functions',
        duration: '30 min',
        videoUrl: 'https://www.youtube.com/watch?v=PkVKPif0K28',
        notes: `# Conditions, Loops, and Functions

An if statement chooses which block to run. Python uses indentation to define each block:

python
if score >= 70:
    print("Pass")
else:
    print("Keep practicing")


Use for to repeat an action for each item in a sequence and while when repetition depends on a condition. Make sure a while loop changes the condition so it can finish.

Functions package reusable behavior. Define one with def, name its inputs as parameters, and use return to send a result back to the caller.`,
        question: 'Which keyword defines a function in Python?',
        options: ['function', 'def', 'return', 'lambda'],
        correctAnswer: 1,
        explanation: 'A function definition begins with the def keyword.',
      }),
      createLesson({
        id: 'python-foundations-3',
        title: 'Lists, Dictionaries, and Debugging',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=RQdpQHhc9oY',
        notes: `# Collections and Debugging

A list keeps an ordered sequence and can be changed:

python
topics = ["strings", "loops"]
topics.append("functions")


A dictionary maps unique keys to values, which is useful for related named fields such as {"name": "Mina", "score": 82}. Use items() to iterate over keys and values together.

When code fails, read the final line of the traceback first. Check the named file and line, verify spelling and types, and reduce the problem to a small example. Print temporary values or use a debugger; then remove diagnostic output once the issue is fixed.`,
        question: 'Which collection is designed to map keys to values?',
        options: ['List', 'Tuple', 'Dictionary', 'String'],
        correctAnswer: 2,
        explanation: 'A dictionary stores values under keys.',
      }),
    ],
  },
  {
    id: 'cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    category: 'Skill-based Courses',
    subcategory: 'Digital Safety',
    description:
      'Build practical habits for protecting accounts, recognizing scams, and handling personal data safely.',
    instructor: 'Vidhya Learning Team',
    difficulty: 'Beginner',
    duration: '3 weeks',
    totalLessons: 3,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    skills: ['Account Security', 'Phishing Awareness', 'Privacy', 'Incident Response'],
    playlist: [
      createLesson({
        id: 'cybersecurity-1',
        title: 'Passwords and Multi-Factor Authentication',
        duration: '20 min',
        videoUrl: 'https://www.youtube.com/watch?v=QWwaidg3AtY',
        notes: `# Protecting Your Accounts

Use a unique password for every important account. A password manager can generate and store long, random passwords so you do not need to reuse or memorize them.

Multi-factor authentication (MFA) asks for another proof of identity in addition to a password. Authenticator apps or security keys reduce the risk of account takeover if a password is exposed. Keep recovery codes somewhere private and secure.

Never share a one-time sign-in code with someone who contacts you. A real support team should not need you to read that code back to them.`,
        question: 'Why should important accounts use unique passwords?',
        options: [
          'It makes passwords shorter',
          'It limits the damage if one service is breached',
          'It removes the need for MFA',
          'It makes phishing impossible',
        ],
        correctAnswer: 1,
        explanation: 'A breach at one service cannot directly expose the password for another account.',
      }),
      createLesson({
        id: 'cybersecurity-2',
        title: 'Recognizing Phishing and Scams',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=UCkjoQjbY_s',
        notes: `# Pause Before You Click

Phishing messages try to pressure you into opening a link, paying money, or revealing information. Watch for unexpected urgency, mismatched sender addresses, unusual requests, and links whose destination does not match the organization.

Verify requests through a separate trusted channel, such as the official app or a phone number you already know. Do not use contact details supplied in a suspicious message. Report it using your organization's normal process and delete it after reporting.

Attachments and QR codes can be used in the same way as links. Treat unexpected files cautiously, even when a familiar name appears in the sender field.`,
        question: 'What is the safest response to an urgent unexpected payment request?',
        options: [
          'Reply and ask for the bank details',
          'Verify the request using a trusted, separate channel',
          'Open the attached invoice immediately',
          'Forward it to all colleagues',
        ],
        correctAnswer: 1,
        explanation: 'Independent verification helps confirm the request without trusting the suspicious message.',
      }),
      createLesson({
        id: 'cybersecurity-3',
        title: 'Privacy, Updates, and Safe Recovery',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=zCcX6aSXcLI',
        notes: `# Reduce Everyday Risk

Install operating-system and application updates from their built-in update tools. Updates often fix security problems that attackers already know about. Back up important files regularly and protect backups from accidental deletion or ransomware.

Share only the personal details an app needs. Review privacy settings and remove old accounts you no longer use. On public Wi-Fi, use websites with HTTPS and avoid entering sensitive information on devices you do not control.

If you suspect an account is compromised, use a trusted device to change its password, revoke unfamiliar sessions, enable MFA, and contact the affected service or organization.`,
        question: 'Where should you install an operating-system security update from?',
        options: [
          'A link in an unsolicited message',
          'The device’s built-in update settings',
          'An unknown file-sharing site',
          'Any pop-up that appears first',
        ],
        correctAnswer: 1,
        explanation: 'Built-in update settings verify that updates come from the operating-system provider.',
      }),
    ],
  },
  {
    id: 'personal-finance-basics',
    title: 'Personal Finance Basics',
    category: 'Skill-based Courses',
    subcategory: 'Financial Literacy',
    description:
      'Understand budgets, saving, debt, and compound growth with clear examples for everyday decisions.',
    instructor: 'Vidhya Learning Team',
    difficulty: 'Beginner',
    duration: '3 weeks',
    totalLessons: 3,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
    skills: ['Budgeting', 'Saving', 'Interest', 'Financial Planning'],
    playlist: [
      createLesson({
        id: 'finance-1',
        title: 'Build a Simple, Flexible Budget',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=qQLLDPAEzT0',
        notes: `# Planning Where Money Goes

A budget is a plan for income and spending over a chosen period. Start with take-home income, then list essential costs, flexible spending, savings, and debt payments. Compare the plan with actual transactions and adjust it without treating one unexpected month as a failure.

An emergency fund is money kept for unplanned costs such as repairs or a temporary loss of income. A useful first target is an amount you can build consistently; the right longer-term target depends on your circumstances.

Track recurring payments and annual expenses too. Setting aside a small amount each month can make predictable bills easier to manage.`,
        question: 'What is the main purpose of a personal budget?',
        options: [
          'Guarantee that no unexpected costs occur',
          'Plan and review how income is allocated',
          'Increase income automatically',
          'Avoid recording spending',
        ],
        correctAnswer: 1,
        explanation: 'A budget helps plan spending and compare that plan with actual costs.',
      }),
      createLesson({
        id: 'finance-2',
        title: 'Saving, Interest, and Time',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=Rm6UdfRs3gw',
        notes: `# How Savings Grow

Simple interest is calculated on the original amount. Compound interest is calculated on the original amount plus interest already earned, so growth can accelerate over time when returns remain invested.

The annual percentage rate (APR) describes borrowing costs over a year. For savings, compare the stated rate, fees, withdrawal conditions, and whether the rate is fixed or variable. Inflation reduces what a fixed amount of money can buy in the future.

There is no guaranteed investment return. Higher potential returns usually come with higher risk, and past performance does not guarantee future results.`,
        question: 'What distinguishes compound interest from simple interest?',
        options: [
          'It is earned only once',
          'It can be calculated on previously earned interest',
          'It removes investment risk',
          'It applies only to borrowed money',
        ],
        correctAnswer: 1,
        explanation: 'Compounding includes previously earned interest in the amount that can grow.',
      }),
      createLesson({
        id: 'finance-3',
        title: 'Borrowing and Comparing Choices',
        duration: '30 min',
        videoUrl: 'https://www.youtube.com/watch?v=MqqXTrEEZ7Y',
        notes: `# Understand the Full Cost

Before borrowing, compare the APR, fees, repayment schedule, total amount repaid, and the consequences of a missed payment. A lower monthly payment can still cost more overall if it extends the repayment period.

For a credit card, paying the full statement balance by its due date usually avoids purchase interest, subject to the card agreement. Cash advances and late payments may have different terms. Read the agreement and ask the provider to clarify anything you do not understand.

Financial decisions depend on personal circumstances and local rules. Use this lesson for general education, and consult a qualified professional for individual advice.`,
        question: 'When comparing two loans, which details matter beyond the monthly payment?',
        options: [
          'Only the lender’s logo',
          'APR, fees, term, and total repayment',
          'The first advertised number',
          'Whether the payment is rounded',
        ],
        correctAnswer: 1,
        explanation: 'The APR, fees, term, and total repayment show the broader cost of borrowing.',
      }),
    ],
  },
  {
    id: 'biology-cell-science',
    title: 'Cell Biology: Structure and Function',
    category: 'Academic Education',
    subcategory: 'Life Science',
    description:
      'Explore cell structures, membranes, and energy transfer through concise notes and knowledge checks.',
    instructor: 'Vidhya Learning Team',
    difficulty: 'Beginner',
    duration: '3 weeks',
    totalLessons: 3,
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=450&fit=crop',
    skills: ['Cell Structure', 'Membrane Transport', 'Cellular Energy', 'Scientific Vocabulary'],
    playlist: [
      createLesson({
        id: 'cell-biology-1',
        title: 'Cell Theory and Organelles',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=tVcEEw6qbBQ',
        notes: `# Cells: The Basic Unit of Life

Cell theory states that living things are made of cells, the cell is the basic unit of life, and cells arise from pre-existing cells. Bacteria and archaea are prokaryotes, which lack a membrane-bound nucleus. Animals, plants, fungi, and protists are eukaryotes, which have one.

The nucleus stores most eukaryotic DNA. Ribosomes assemble proteins. Mitochondria release usable energy from food molecules, and plant cells also contain chloroplasts for photosynthesis. The endoplasmic reticulum and Golgi apparatus help produce and transport molecules.

Organelles work together; their roles are connected rather than independent.`,
        question: 'Which structure contains most of a eukaryotic cell’s DNA?',
        options: ['Ribosome', 'Nucleus', 'Cell membrane', 'Golgi apparatus'],
        correctAnswer: 1,
        explanation: 'The nucleus contains most of the DNA in a eukaryotic cell.',
      }),
      createLesson({
        id: 'cell-biology-2',
        title: 'Membranes and Movement',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=Ptmlvtei8hw',
        notes: `# The Cell Membrane

Cell membranes are made mainly of a phospholipid bilayer with proteins. The membrane is selectively permeable: some substances cross easily, while others need a channel or carrier.

Diffusion is the net movement of particles from a region of higher concentration to lower concentration. Osmosis is diffusion of water across a selectively permeable membrane. Active transport uses energy to move substances against a concentration gradient.

The direction and rate of movement depend on concentration, membrane properties, and available transport proteins.`,
        question: 'Which process requires energy to move a substance against its concentration gradient?',
        options: ['Diffusion', 'Osmosis', 'Active transport', 'Filtration'],
        correctAnswer: 2,
        explanation: 'Active transport uses energy to move material against a concentration gradient.',
      }),
      createLesson({
        id: 'cell-biology-3',
        title: 'Photosynthesis and Cellular Respiration',
        duration: '30 min',
        videoUrl: 'https://www.youtube.com/watch?v=7xeFP0SEDdc',
        notes: `# How Cells Transfer Energy

Photosynthesis captures light energy and stores it in chemical bonds. In plants, it uses carbon dioxide and water to make sugars and releases oxygen. Chloroplasts are the main site of this process.

Cellular respiration transfers energy from food molecules into ATP, a form cells can use. In eukaryotes, many stages occur in mitochondria. Oxygen is commonly used in aerobic respiration, and carbon dioxide and water are produced.

Photosynthesis and respiration connect through the movement of matter and energy, but they are not exact reverse processes. Both involve many regulated chemical reactions.`,
        question: 'What molecule provides a readily usable energy source for many cellular processes?',
        options: ['ATP', 'DNA', 'Cellulose', 'Chlorophyll'],
        correctAnswer: 0,
        explanation: 'ATP transfers usable energy to many processes inside the cell.',
      }),
    ],
  },
  {
    id: 'data-literacy-foundations',
    title: 'Data Literacy and Clear Charts',
    category: 'Academic Education',
    subcategory: 'Data Science',
    description:
      'Learn to read, summarize, and present data without misleading your audience.',
    instructor: 'Vidhya Learning Team',
    difficulty: 'Beginner',
    duration: '2 weeks',
    totalLessons: 3,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    skills: ['Data Quality', 'Descriptive Statistics', 'Chart Selection', 'Communication'],
    playlist: [
      createLesson({
        id: 'data-literacy-1',
        title: 'Ask Questions of Your Data',
        duration: '20 min',
        videoUrl: 'https://www.youtube.com/watch?v=oHf-09998F0',
        notes: `# Start with a Clear Question

Before analyzing data, decide what decision or question it should support. Identify who collected it, when and how it was gathered, which people or objects it describes, and what may be missing.

Data quality problems include missing values, duplicated records, inconsistent units, and a sample that excludes important groups. A large data set can still be biased if it was collected in a way that does not represent the population.

Keep a record of assumptions and cleaning steps so another person can understand how you reached a conclusion.`,
        question: 'Why inspect how a data set was collected?',
        options: [
          'Collection methods can affect which conclusions are supported',
          'A larger file is always more accurate',
          'It removes the need to check missing values',
          'It changes the recorded observations',
        ],
        correctAnswer: 0,
        explanation: 'Collection methods determine what the data represents and where bias may enter.',
      }),
      createLesson({
        id: 'data-literacy-2',
        title: 'Summaries and Variation',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=h8EYEJ32oQ8',
        notes: `# Describe the Whole Distribution

The mean is the arithmetic average and can be pulled by extreme values. The median is the middle value after sorting and is often more representative for skewed data. The mode is the most frequent value.

Measures of spread, such as range and interquartile range, show how much values vary. Two groups can have the same mean but very different distributions. Always report units and sample size alongside a summary.

Summary statistics describe data; they do not by themselves prove why an outcome occurred.`,
        question: 'Which measure is often less affected by an extreme value?',
        options: ['Mean', 'Median', 'Range', 'Sum'],
        correctAnswer: 1,
        explanation: 'The median depends on ordered position, so a single extreme value usually affects it less than the mean.',
      }),
      createLesson({
        id: 'data-literacy-3',
        title: 'Choose an Honest Chart',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=aUk4npRmjL8',
        notes: `# Make the Pattern Easy to Read

Use a bar chart to compare categories, a line chart to show change over ordered time, and a scatter plot to examine the relationship between two numeric variables. Histograms show the distribution of numeric values.

Label axes and units, include a useful title, and choose a scale that does not exaggerate differences. Do not connect unrelated categories with a line or use a three-dimensional effect that distorts area.

A chart can reveal patterns and outliers, but correlation alone does not establish causation. State what the data can and cannot tell the reader.`,
        question: 'Which chart is usually suited to showing a measurement over time?',
        options: ['Line chart', 'Pie chart', 'Word cloud', 'Unordered icon grid'],
        correctAnswer: 0,
        explanation: 'A line chart shows how a measure changes across an ordered time axis.',
      }),
    ],
  },
  {
    id: 'yoga-beginners',
    title: 'Yoga Foundations for Beginners',
    category: 'Sports & Fitness',
    subcategory: 'Yoga',
    description:
      'Start your yoga journey with beginner-friendly poses, breathing techniques, and mindfulness practices.',
    instructor: 'Maya Patel',
    instructorAvatar: 'https://i.pravatar.cc/150?img=20',
    difficulty: 'Beginner',
    duration: '4 weeks',
    totalLessons: 2,
    rating: 4.9,
    enrolledCount: 8920,
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
    skills: ['Flexibility', 'Mindfulness', 'Breathing', 'Balance'],
    playlist: [
      {
        id: 'yoga-1',
        title: 'Introduction to Yoga',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
        notes: `# Introduction to Yoga

## What is Yoga?

Yoga is an ancient practice that combines physical postures, breathing techniques, and meditation to promote overall wellness.

## Benefits of Yoga:

### Physical Benefits:
- Improved flexibility and strength
- Better posture and balance
- Enhanced cardiovascular health
- Pain relief and injury prevention

### Mental Benefits:
- Stress reduction
- Improved focus and concentration
- Better sleep quality
- Enhanced mood and emotional well-being

## Types of Yoga:

1. **Hatha Yoga**: Gentle, slow-paced
2. **Vinyasa Yoga**: Flow-based, dynamic
3. **Ashtanga Yoga**: Structured, challenging
4. **Yin Yoga**: Deep stretching, meditative

## Getting Started:

- Wear comfortable clothing
- Use a yoga mat
- Practice on an empty stomach
- Listen to your body
- Start with basic poses

## Basic Principles:

1. **Breath (Pranayama)**: Conscious breathing
2. **Posture (Asana)**: Physical poses
3. **Mindfulness**: Present moment awareness
4. **Non-judgment**: Accept where you are`,
        mcqs: [
          {
            id: 'yoga-1-q1',
            question: 'What are the three main components of yoga practice?',
            options: [
              'Exercise, diet, and sleep',
              'Postures, breathing, and meditation',
              'Strength, cardio, and flexibility',
              'Running, jumping, and stretching',
            ],
            correctAnswer: 1,
            explanation:
              'Yoga combines physical postures (asanas), breathing techniques (pranayama), and meditation for holistic wellness.',
          },
          {
            id: 'yoga-1-q2',
            question: 'Which type of yoga is best for beginners seeking a gentle practice?',
            options: ['Ashtanga', 'Hatha', 'Power Yoga', 'Hot Yoga'],
            correctAnswer: 1,
            explanation:
              'Hatha yoga is gentle and slow-paced, making it ideal for beginners to learn proper alignment and breathing.',
          },
        ],
      },
      {
        id: 'yoga-2',
        title: 'Basic Breathing Techniques',
        duration: '20 min',
        videoUrl: 'https://www.youtube.com/watch?v=nM-ySWyID9o',
        notes: `# Pranayama: The Art of Breathing

## What is Pranayama?

Pranayama is the practice of breath control, a vital aspect of yoga that enhances physical and mental well-being.

## Key Breathing Techniques:

### 1. Diaphragmatic Breathing
- Breathe deeply into your belly
- Activates the relaxation response
- Reduces stress and anxiety

### 2. Alternate Nostril Breathing (Nadi Shodhana)
- Balances left and right brain hemispheres
- Calms the nervous system
- Improves focus

### 3. Ujjayi Breath (Ocean Breath)
- Creates slight constriction in throat
- Sounds like ocean waves
- Builds internal heat

## Benefits:

- Increased lung capacity
- Better oxygen circulation
- Reduced blood pressure
- Enhanced mental clarity
- Stress relief

## Practice Tips:

1. Find a comfortable seated position
2. Keep spine straight
3. Breathe through your nose
4. Start with 5-10 minutes daily
5. Don't force the breath`,
        mcqs: [
          {
            id: 'yoga-2-q1',
            question: 'What is the primary benefit of diaphragmatic breathing?',
            options: [
              'Builds muscle strength',
              'Activates relaxation response',
              'Improves digestion',
              'Increases flexibility',
            ],
            correctAnswer: 1,
            explanation:
              "Diaphragmatic breathing activates the parasympathetic nervous system, triggering the body's relaxation response.",
          },
        ],
      },
    ],
  },
  {
    id: 'web-dev-bootcamp',
    title: 'Web Development Foundations',
    category: 'Skill-based Courses',
    subcategory: 'Web Development',
    description:
      'Build a solid foundation in semantic HTML, responsive CSS, and the JavaScript that brings web pages to life.',
    instructor: 'Alex Chen',
    instructorAvatar: 'https://i.pravatar.cc/150?img=12',
    difficulty: 'Beginner',
    duration: '3 weeks',
    totalLessons: 3,
    rating: 4.7,
    enrolledCount: 15670,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    playlist: [
      {
        id: 'web-1',
        title: 'HTML Fundamentals',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        notes: `# HTML Fundamentals

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## Basic Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
\`\`\`

## Essential HTML Tags:

### Headings:
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
\`\`\`

### Paragraphs and Text:
\`\`\`html
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<em>Italic text</em>
\`\`\`

### Links:
\`\`\`html
<a href="https://example.com">Visit Example</a>
\`\`\`

### Images:
\`\`\`html
<img src="image.jpg" alt="Description">
\`\`\`

### Lists:
\`\`\`html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ol>
    <li>First</li>
    <li>Second</li>
</ol>
\`\`\`

## Semantic HTML:

Use meaningful tags:
- \`<header>\` for page header
- \`<nav>\` for navigation
- \`<main>\` for main content
- \`<article>\` for articles
- \`<footer>\` for page footer`,
        mcqs: [
          {
            id: 'web-1-q1',
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language',
            ],
            correctAnswer: 0,
            explanation:
              'HTML stands for HyperText Markup Language, the standard language for creating web pages.',
          },
          {
            id: 'web-1-q2',
            question: 'Which tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: 1,
            explanation:
              'The <a> (anchor) tag is used to create hyperlinks in HTML, with the href attribute specifying the destination.',
          },
          {
            id: 'web-1-q3',
            question: 'What is the purpose of semantic HTML?',
            options: [
              'To make pages load faster',
              'To give meaning to the structure of web content',
              'To add styling to elements',
              'To create animations',
            ],
            correctAnswer: 1,
            explanation:
              'Semantic HTML uses meaningful tags to give structure and meaning to web content, improving accessibility and SEO.',
          },
        ],
      },
      createLesson({
        id: 'web-2',
        title: 'CSS Layout and Responsive Design',
        duration: '30 min',
        videoUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s',
        notes: `# Styling for Different Screens

CSS controls the appearance and layout of a web page. Rules select elements and assign properties such as color, spacing, and font size. The box model describes how content, padding, borders, and margins contribute to an element's size.

Flexbox arranges items along one axis and works well for navigation and aligned components. CSS Grid arranges content in rows and columns. Use media queries to adjust a layout when the available screen width changes.

Keep readable text contrast, preserve visible keyboard focus, and avoid using color as the only way to communicate meaning.`,
        question: 'Which CSS tool is designed for two-dimensional row and column layouts?',
        options: ['CSS Grid', 'The alt attribute', 'HTML headings', 'A URL fragment'],
        correctAnswer: 0,
        explanation: 'CSS Grid places items in both rows and columns.',
      }),
      createLesson({
        id: 'web-3',
        title: 'JavaScript and the Document',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=xKOyDDuQSVY',
        notes: `# Add Behavior to a Page

JavaScript can respond to user actions and update a page. Select elements with methods such as querySelector, listen for events such as click, and update the DOM when the interface changes.

Use const for bindings you do not reassign and let for bindings that need a new value. Functions keep actions reusable. Validate user input and provide useful feedback instead of silently ignoring errors.

Separate content (HTML), presentation (CSS), and behavior (JavaScript) when that makes a project easier to understand and maintain. Test interactive behavior with a keyboard as well as a pointer.`,
        question: 'Which browser API is commonly used to react when a button is clicked?',
        options: ['addEventListener', 'queryHistory', 'setViewport', 'createCookie'],
        correctAnswer: 0,
        explanation: 'addEventListener registers a function to run when an event such as click occurs.',
      }),
    ],
  },
  {
    id: 'upsc-prep',
    title: 'UPSC Civil Services: Exam and Governance Basics',
    category: 'Competitive Exams',
    subcategory: 'UPSC',
    description:
      'Review the examination stages and build a starting foundation in the Constitution and public administration.',
    instructor: 'Dr. Rajesh Kumar',
    instructorAvatar: 'https://i.pravatar.cc/150?img=33',
    difficulty: 'Advanced',
    duration: '3 weeks',
    totalLessons: 3,
    rating: 4.9,
    enrolledCount: 6780,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
    skills: ['Exam Structure', 'Constitution', 'Governance', 'General Studies'],
    playlist: [
      {
        id: 'upsc-1',
        title: 'Understanding UPSC Exam Pattern',
        duration: '40 min',
        videoUrl: 'https://youtu.be/G5STfWKbF0E?si=11dafKEx5o24yNBT',
        notes: `# UPSC Civil Services Examination

## Exam Structure:

The UPSC CSE consists of three stages:

### 1. Prelims (Objective Type)
- **Paper 1**: General Studies (200 marks)
- **Paper 2**: CSAT - Civil Services Aptitude Test (200 marks)
- **Duration**: 2 hours each
- **Qualifying**: Both papers, but only GS marks count for merit

### 2. Mains (Descriptive)
- **Essay**: 250 marks
- **GS Paper 1**: 250 marks (Indian Heritage, History, Geography)
- **GS Paper 2**: 250 marks (Governance, Constitution, Social Justice)
- **GS Paper 3**: 250 marks (Technology, Economy, Environment)
- **GS Paper 4**: 250 marks (Ethics, Integrity, Aptitude)
- **Optional Subject**: 2 papers × 250 marks
- **Total**: 1750 marks

### 3. Personality Test (Interview)
- **Marks**: 275
- **Final Merit**: Mains + Interview = 2025 marks

## Preparation Strategy:

1. **Understand the Syllabus**: Read it thoroughly
2. **NCERTs First**: Build strong foundation
3. **Current Affairs**: Daily newspaper reading
4. **Answer Writing**: Regular practice
5. **Test Series**: Mock tests and evaluation
6. **Optional Subject**: Choose wisely based on interest

## Time Management:

- Prelims preparation: 6-8 months
- Mains preparation: 10-12 months
- Continuous revision throughout

## Key Resources:

- NCERT textbooks (6-12)
- The Hindu/Indian Express
- Monthly magazines (Yojana, Kurukshetra)
- Standard reference books
- Previous year papers`,
        mcqs: [
          {
            id: 'upsc-1-q1',
            question: 'How many stages are there in UPSC Civil Services Examination?',
            options: ['Two', 'Three', 'Four', 'Five'],
            correctAnswer: 1,
            explanation:
              'UPSC CSE has three stages: Prelims (screening), Mains (written exam), and Interview (personality test).',
          },
          {
            id: 'upsc-1-q2',
            question: 'What is the total marks for UPSC Mains examination?',
            options: ['1000 marks', '1500 marks', '1750 marks', '2025 marks'],
            correctAnswer: 2,
            explanation: 'UPSC Mains has 1750 marks (Essay 250 + 4 GS papers 1000 + Optional 500).',
          },
          {
            id: 'upsc-1-q3',
            question: 'Which paper in Prelims is qualifying in nature?',
            options: ['Paper 1 (GS)', 'Paper 2 (CSAT)', 'Both papers', 'Neither paper'],
            correctAnswer: 1,
            explanation:
              'Paper 2 (CSAT) is qualifying with 33% minimum marks required, while Paper 1 marks count for final merit.',
          },
        ],
      },
      createLesson({
        id: 'upsc-2',
        title: 'Constitutional Foundations',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=XbHer3LuGOs',
        notes: `# A Framework for Public Institutions

The Constitution of India establishes the structure of government, distributes authority, and protects rights. The Preamble sets out the values and broad aims that guide the constitutional framework.

Fundamental Rights protect individuals from specified forms of state action. Directive Principles guide the state in shaping policy. These parts serve different purposes and must be read in the context of the Constitution as a whole.

The Constitution can be amended through the procedures it provides. Understanding the relevant institution, power, and process is more useful than memorizing a phrase without context.`,
        question: 'What is one role of the Preamble to the Constitution?',
        options: [
          'It describes broad values and aims of the constitutional framework',
          'It replaces all articles of the Constitution',
          'It lists every government employee',
          'It sets the annual budget',
        ],
        correctAnswer: 0,
        explanation: 'The Preamble expresses broad values and aims that frame the Constitution.',
      }),
      createLesson({
        id: 'upsc-3',
        title: 'Institutions and Public Accountability',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=xfmJ0rBBev8',
        notes: `# How Public Institutions Work

India has a parliamentary system with Union and state governments. The legislature makes laws and scrutinizes government, the executive administers public policy, and the judiciary interprets law and resolves disputes.

Federalism divides responsibilities between levels of government. A public policy question may therefore involve more than one authority. Identify which institution has the legal responsibility before proposing a solution.

Accountability can include legislative questions, audits, public records processes, independent review, and elections. Good analysis states the issue, supporting evidence, responsible institution, and practical limits of a proposed action.`,
        question: 'Which branch primarily interprets laws and resolves legal disputes?',
        options: ['Executive', 'Judiciary', 'Legislature', 'Election commission'],
        correctAnswer: 1,
        explanation: 'Courts in the judiciary interpret law and resolve legal disputes.',
      }),
    ],
  },
  {
    id: 'bsc-agri-soil-science',
    title: 'BSc Agriculture: Fundamentals of Soil Science',
    category: 'BSc Agriculture',
    subcategory: 'BSc Agriculture',
    description:
      'Build a strong foundation in soil formation, properties, fertility, and practical nutrient management for BSc Agriculture students.',
    instructor: 'Dr. Kavya Reddy',
    instructorAvatar: 'https://i.pravatar.cc/150?img=29',
    difficulty: 'Beginner',
    duration: '6 weeks',
    totalLessons: 2,
    rating: 4.8,
    enrolledCount: 4820,
    thumbnail: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=450&fit=crop',
    skills: ['Soil Profile', 'Soil Texture', 'Soil Fertility', 'NPK Management'],
    playlist: [
      {
        id: 'agri-soil-1',
        title: 'Soil Formation and Soil Profile',
        duration: '38 min',
        videoUrl: 'https://youtu.be/voWgADFhht8?si=WcbX0K4oUE6UcoYu',
        notes: `# Soil Formation and Profile

## Soil Formation Factors
Soil is formed by the combined effect of:
- Parent material
- Climate
- Organisms
- Relief (topography)
- Time

## Soil Horizons
A typical soil profile has:
- **O Horizon**: Organic litter
- **A Horizon**: Topsoil rich in humus
- **B Horizon**: Subsoil with clay and minerals
- **C Horizon**: Weathered parent material

## Importance for Agriculture
- Root growth depends on depth and structure
- Water movement depends on texture and pores
- Nutrient retention differs by horizon

Understanding profile layers helps farmers decide tillage depth, fertilizer application, and irrigation planning.`,
        mcqs: [
          {
            id: 'agri-soil-1-q1',
            question: 'Which factor is NOT a classic soil-forming factor?',
            options: ['Parent material', 'Climate', 'Market price', 'Time'],
            correctAnswer: 2,
            explanation: 'Market price is an economic factor, not a pedogenic soil-forming factor.',
          },
          {
            id: 'agri-soil-1-q2',
            question: 'Which horizon is usually called topsoil?',
            options: ['O horizon', 'A horizon', 'B horizon', 'C horizon'],
            correctAnswer: 1,
            explanation: 'A horizon is the mineral topsoil and is generally rich in humus.',
          },
        ],
      },
      {
        id: 'agri-soil-2',
        title: 'Soil Fertility and Nutrient Management',
        duration: '42 min',
        videoUrl: 'https://youtu.be/e-FXzFhk4Ag?si=j9gFaaBfDicSVCRe',
        notes: `# Soil Fertility and Nutrient Management

## Essential Nutrients
- **Primary**: Nitrogen (N), Phosphorus (P), Potassium (K)
- **Secondary**: Calcium, Magnesium, Sulfur
- **Micronutrients**: Zinc, Iron, Boron, Copper, etc.

## Soil Testing
Soil test reports help determine:
- pH
- Organic carbon
- Available N, P, K
- Micronutrient deficiencies

## Balanced Fertilization
Principles:
1. Right source
2. Right dose
3. Right time
4. Right method

## Sustainable Practices
- Compost and FYM integration
- Crop rotation with legumes
- Green manuring
- Site-specific nutrient management`,
        mcqs: [
          {
            id: 'agri-soil-2-q1',
            question: 'Which nutrient is primarily associated with vegetative growth?',
            options: ['Nitrogen', 'Phosphorus', 'Potassium', 'Boron'],
            correctAnswer: 0,
            explanation: 'Nitrogen promotes leaf and stem growth.',
          },
          {
            id: 'agri-soil-2-q2',
            question: 'What is the best first step before fertilizer planning?',
            options: ['Spray pesticide', 'Soil testing', 'Increase irrigation', 'Deep ploughing'],
            correctAnswer: 1,
            explanation: 'Soil testing provides the baseline nutrient status for proper planning.',
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-agri-agronomy',
    title: 'BSc Agriculture: Principles of Agronomy',
    category: 'BSc Agriculture',
    subcategory: 'BSc Agriculture',
    description:
      'Learn crop production principles, sowing methods, weed control, irrigation scheduling, and yield optimization.',
    instructor: 'Prof. Nikhil Sharma',
    instructorAvatar: 'https://i.pravatar.cc/150?img=34',
    difficulty: 'Intermediate',
    duration: '7 weeks',
    totalLessons: 2,
    rating: 4.7,
    enrolledCount: 4260,
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=450&fit=crop',
    skills: ['Crop Geometry', 'Seed Rate', 'Irrigation', 'Weed Management'],
    playlist: [
      {
        id: 'agri-agro-1',
        title: 'Crop Establishment and Seed Management',
        duration: '36 min',
        videoUrl: 'https://youtu.be/8ulpy_GFLDk?si=5Zdqe8UQVuEOCd31',
        notes: `# Crop Establishment

## Key Steps
- Land preparation
- Seed selection
- Seed treatment
- Sowing at optimum depth and spacing

## Seed Rate and Spacing
Correct seed rate avoids:
- Excess competition
- Poor plant population

## Sowing Methods
- Broadcasting
- Line sowing
- Dibbling
- Transplanting

Line sowing improves weed control and nutrient-use efficiency.`,
        mcqs: [
          {
            id: 'agri-agro-1-q1',
            question: 'Which sowing method improves row management most?',
            options: ['Broadcasting', 'Line sowing', 'Random placement', 'Late transplanting'],
            correctAnswer: 1,
            explanation: 'Line sowing allows better spacing, interculture, and weed control.',
          },
          {
            id: 'agri-agro-1-q2',
            question: 'Why is seed treatment important?',
            options: [
              'To increase soil salinity',
              'To protect seeds from early pests and diseases',
              'To reduce germination',
              'To harden rocks in the field',
            ],
            correctAnswer: 1,
            explanation: 'Seed treatment protects germinating seeds from seed and soil-borne pathogens.',
          },
        ],
      },
      {
        id: 'agri-agro-2',
        title: 'Irrigation and Weed Management',
        duration: '44 min',
        videoUrl: 'https://youtu.be/JTdRho4j3qw?si=HTk3a7BZ6lI4KsJ6',
        notes: `# Irrigation and Weed Management

## Critical Crop Stages for Water
Water stress at flowering and grain filling can significantly reduce yield.

## Irrigation Methods
- Surface irrigation
- Sprinkler
- Drip irrigation

## Weed Competition Period
The first 30-45 days in many crops are critical for weed control.

## Integrated Weed Management
- Preventive practices
- Mechanical weeding
- Chemical control
- Mulching and crop rotation`,
        mcqs: [
          {
            id: 'agri-agro-2-q1',
            question: 'Which irrigation method is most water-efficient?',
            options: ['Flooding', 'Furrow', 'Drip', 'Basin'],
            correctAnswer: 2,
            explanation: 'Drip irrigation applies water near roots and minimizes losses.',
          },
          {
            id: 'agri-agro-2-q2',
            question: 'Why is early weed control important?',
            options: [
              'Weeds help crop growth',
              'Early competition reduces crop yield significantly',
              'It delays crop maturity',
              'It decreases nutrient uptake by weeds only',
            ],
            correctAnswer: 1,
            explanation: 'Weeds competing early for light, water, and nutrients reduce final yield.',
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-agri-plant-pathology',
    title: 'BSc Agriculture: Basics of Plant Pathology',
    category: 'BSc Agriculture',
    subcategory: 'BSc Agriculture',
    description:
      'Understand major crop diseases, disease cycles, diagnosis basics, and integrated disease management strategies.',
    instructor: 'Dr. Meera Patil',
    instructorAvatar: 'https://i.pravatar.cc/150?img=47',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    totalLessons: 2,
    rating: 4.8,
    enrolledCount: 3985,
    thumbnail: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=450&fit=crop',
    skills: ['Disease Diagnosis', 'Pathogen Types', 'IPM', 'Field Scouting'],
    playlist: [
      {
        id: 'agri-path-1',
        title: 'Plant Disease Triangle and Symptoms',
        duration: '14:31 min',
        videoUrl: 'https://youtu.be/ZM2X-XBRKHM?si=OHSK-5SSZtIZ4Zbl',
        notes: `# Plant Disease Basics

## Disease Triangle
Disease occurs when three factors coincide:
- Susceptible host
- Virulent pathogen
- Favorable environment

## Common Symptoms
- Leaf spots
- Wilting
- Blight
- Rust pustules
- Root rot

Accurate diagnosis should combine symptom observation with field history and environmental conditions.`,
        mcqs: [
          {
            id: 'agri-path-1-q1',
            question: 'Which element is NOT part of the disease triangle?',
            options: ['Host', 'Pathogen', 'Environment', 'Market demand'],
            correctAnswer: 3,
            explanation: 'Disease triangle includes host, pathogen, and environment only.',
          },
          {
            id: 'agri-path-1-q2',
            question: 'Wilting in plants may be associated with:',
            options: ['Only nutrient excess', 'Vascular pathogen infection', 'Always insect damage', 'Only pH shock'],
            correctAnswer: 1,
            explanation: 'Several vascular diseases block transport and can cause wilting.',
          },
        ],
      },
      {
        id: 'agri-path-2',
        title: 'Integrated Disease Management (IDM)',
        duration: '27:49 min',
        videoUrl: 'https://youtu.be/s23Ti2yhfqY?si=wQwzXZFy87kzUy0f',
        notes: `# Integrated Disease Management

## IDM Principles
- Use resistant varieties
- Seed treatment
- Crop rotation
- Field sanitation
- Timely fungicide application based on threshold

## Preventive Focus
Prevention is more effective and cheaper than cure in most field crops.

## Good Practices
- Rogue infected plants early
- Avoid excessive canopy humidity
- Follow recommended spacing and irrigation timing`,
        mcqs: [
          {
            id: 'agri-path-2-q1',
            question: 'Which is a preventive disease management measure?',
            options: ['Random pesticide use', 'Using resistant varieties', 'Ignoring symptoms', 'Dense sowing'],
            correctAnswer: 1,
            explanation: 'Resistant varieties reduce disease incidence from the start.',
          },
          {
            id: 'agri-path-2-q2',
            question: 'Crop rotation helps by:',
            options: [
              'Increasing host continuity',
              'Breaking pathogen life cycles',
              'Eliminating all weeds instantly',
              'Reducing sunlight',
            ],
            correctAnswer: 1,
            explanation: 'Rotation interrupts disease cycles by removing preferred hosts.',
          },
        ],
      },
    ],
  },
  {
    id: 'arvr-science-foundations',
    title: 'Explore Science in AR & VR',
    category: 'Immersive Science Videos',
    subcategory: 'AR & VR video lessons',
    description:
      'Learn biology, astronomy, chemistry, physics, geography, Earth science, and history through academic AR and VR experiences, with lesson videos, study notes, and knowledge checks.',
    instructor: 'Vidhya Learning Library',
    difficulty: 'Beginner',
    duration: '1 week',
    totalLessons: 8,
    rating: 4.9,
    enrolledCount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=450&fit=crop',
    skills: ['Human Biology', 'Astronomy', 'Chemistry', 'Physics', 'Earth Science', 'History', 'AR', 'VR'],
    playlist: [
      createLesson({
        id: 'arvr-101-body-vr',
        title: 'Travel through the human body in VR',
        duration: '360° science video',
        videoUrl: 'https://www.youtube.com/watch?v=-FyN5_-njAU',
        notes: `# Inside the human body

This 360° science video gives a spatial view of the body's systems. As you look around, notice how organs sit in relation to one another and how food and oxygen move through the body.

## While you watch
- Name two organs you can see.
- Describe how the heart and lungs work together to move oxygen.
- Look around on a phone or drag the video on a computer; a headset is optional.`,
        question: 'What do the heart and lungs work together to move around the body?',
        options: ['Oxygen', 'Sound waves', 'Light', 'Soil nutrients'],
        correctAnswer: 0,
        explanation: 'The lungs add oxygen to the blood, and the heart pumps that blood around the body.',
      }),
      createLesson({
        id: 'arvr-101-earth-arvr',
        title: 'Explore a coral reef in 360° VR',
        duration: 'National Geographic 360°',
        videoUrl: 'https://www.youtube.com/watch?v=VVaYEnZUNHI',
        notes: `# Coral reefs and conservation

Take a 360° reef visit and observe the habitat from a diver's point of view. Coral reefs support diverse marine life, and warming water, pollution, and physical damage can put these ecosystems under pressure.

## While you watch
- Identify one living thing that depends on the reef.
- Notice how the reef provides shelter.
- Think of one action that can reduce harm to coastal habitats.`,
        question: 'What is one important role a coral reef plays?',
        options: ['It provides habitat and shelter for marine life', 'It removes all salt from the ocean', 'It stops tides from moving', 'It creates freshwater rivers'],
        correctAnswer: 0,
        explanation: 'Coral reefs provide food, shelter, and nursery areas for many marine species.',
      }),
      createLesson({
        id: 'arvr-101-solar-vr',
        title: 'Journey through the solar system in VR',
        duration: '360° space journey',
        videoUrl: 'https://www.youtube.com/watch?v=6c6k57ZZh9o',
        notes: `# A 360° tour of the solar system

Travel past planets and moons and compare their surfaces and surroundings. The video is a visual model rather than a scale-accurate map: distances and object sizes are compressed so the journey fits on screen.

## While you watch
- Put the planets you see in order from the Sun.
- Compare a rocky planet with a gas giant.
- Explain why a short video cannot show both planet size and orbital distance to scale.`,
        question: 'Why are the sizes and distances in a short solar system tour simplified?',
        options: ['To make the whole journey viewable while showing relationships', 'Because planets have no real size', 'Because planets do not orbit the Sun', 'To show that every planet is the same distance away'],
        correctAnswer: 0,
        explanation: 'Solar system videos compress enormous distances and sizes to make the relationships easier to view.',
      }),
      createLesson({
        id: 'arvr-101-classroom-ar',
        title: 'See augmented reality used in a classroom',
        duration: 'Google for Education',
        videoUrl: 'https://www.youtube.com/watch?v=3sIcDgZlgMU',
        notes: `# Science objects in augmented reality

This classroom example shows how a digital 3D object can appear alongside the real classroom view. In a biology lesson, students can move around a model to inspect parts and relationships that are hard to see in a flat diagram.

## Think about it
- Which part of a 3D model would you inspect from another angle?
- What labels would help explain the model?
- How could a student complete the activity without an AR-capable device?`,
        question: 'What does augmented reality add to a classroom view?',
        options: ['Digital models that students can inspect alongside the real world', 'A replacement for every classroom lesson', 'A printed 2D diagram only', 'A virtual headset that every learner must own'],
        correctAnswer: 0,
        explanation: 'AR places digital objects into the view of the real world so learners can inspect them in context.',
      }),
      createLesson({
        id: 'arvr-101-chemistry-vr',
        title: 'Build and explore molecules in 3D',
        duration: '3D chemistry lesson',
        videoUrl: 'https://www.youtube.com/watch?v=YNc97Cp-wGM',
        notes: `# Atoms, molecules, and chemical bonds

Molecules are groups of atoms joined by chemical bonds. A three-dimensional model makes it easier to see that atoms connect in particular arrangements rather than sitting on a flat page.

## While you watch
- Identify the atoms and bonds in one molecule.
- Rotate the 3D model and describe which atoms are connected.
- Explain how a reaction can rearrange atoms into new substances while conserving the atoms themselves.`,
        question: 'What happens to atoms during a chemical reaction?',
        options: ['They are rearranged into new combinations', 'They disappear completely', 'They turn into light', 'They stop moving forever'],
        correctAnswer: 0,
        explanation: 'Chemical reactions break and form bonds, rearranging atoms into different molecules.',
      }),
      createLesson({
        id: 'arvr-101-physics-vr',
        title: 'Experiment with forces and motion',
        duration: 'PhET simulation lesson',
        videoUrl: 'https://www.youtube.com/watch?v=bzwnWvuyvS0',
        notes: `# Forces change motion

In a virtual experiment, students can vary a push or pull and observe how the net force changes an object's motion. Virtual setups let you repeat a trial safely and compare what happens when one factor changes.

## While you watch
- Note the direction of the applied force.
- Compare motion when forces are balanced and unbalanced.
- Predict what will happen before changing a force in the simulation.`,
        question: 'What can an unbalanced net force do to an object\'s motion?',
        options: ['Change its speed or direction', 'Make its mass vanish', 'Remove gravity from the universe', 'Keep it permanently at rest'],
        correctAnswer: 0,
        explanation: 'An unbalanced force causes acceleration, which is a change in speed, direction, or both.',
      }),
      createLesson({
        id: 'arvr-101-history-vr',
        title: 'Visit Ancient Rome in a virtual tour',
        duration: '3D historical exploration',
        videoUrl: 'https://www.youtube.com/watch?v=-IqkKRscoIc',
        notes: `# Read a historical place

A virtual tour can help us inspect the layout of an ancient city and notice how monuments, public spaces, and artifacts relate to daily life. Treat a reconstruction as a model informed by historical evidence.

## While you watch
- Identify a public structure or artifact in the tour.
- Consider what its location tells you about the city.
- Ask what evidence historians would use to check a reconstruction.`,
        question: 'What can a virtual reconstruction help a history student investigate?',
        options: ['How buildings and public spaces relate to one another', 'The exact thoughts of every ancient resident', 'A future event that has not happened', 'The weather on every day in Roman history'],
        correctAnswer: 0,
        explanation: 'A reconstruction can help students examine spatial relationships while evidence and sources support historical interpretations.',
      }),
      createLesson({
        id: 'arvr-101-cell-vr',
        title: 'Explore the cell and its mitochondria',
        duration: '3D cell biology animation',
        videoUrl: 'https://www.youtube.com/watch?v=RrS2uROUjK4',
        notes: `# Inside a living cell

Cells contain specialized structures called organelles. The nucleus stores genetic information, the cell membrane forms a boundary, and mitochondria help release usable energy from food molecules.

## While you watch
- Locate the mitochondria and note what happens there.
- Find the nucleus and cell boundary in a cell model.
- Explain why a 3D view helps you see how structures fit inside the cell.`,
        question: 'What is a key role of mitochondria in a cell?',
        options: ['Help release usable energy from food molecules', 'Store all oxygen in the lungs', 'Build the cell wall of every animal cell', 'Carry sound from the ear to the brain'],
        correctAnswer: 0,
        explanation: 'Mitochondria help convert energy from food molecules into ATP that cells can use.',
      }),
    ],
  },
  ...supplementalCourses.filter(course => course.category !== 'AR & VR Learning'),
]

/**
 * Get course by ID
 */
export function getCourseById(courseId) {
  return coursesData.find(course => course.id === courseId)
}

/**
 * Get all courses by category
 */
export function getCoursesByCategory(category) {
  return coursesData.filter(course => course.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  return [...new Set(coursesData.map(course => course.category))]
}
