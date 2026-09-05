import { Department, Doctor, Testimonial, HospitalFacility, HealthPackage, Appointment } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Care',
    tagline: 'Precision cardiovascular care and world-class interventional heart center',
    icon: 'HeartPulse',
    heroImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Comprehensive cardiac sciences featuring 24/7 catheterization laboratories, complex coronary angioplasty, heart failure clinic, and cardiac rehabilitation.',
    fullDescription: 'The Department of Cardiology at WeCare Hospitals is a premier center of excellence for cardiovascular diagnostics and therapy. Equipped with bi-plane digital Cath Labs and advanced cardiac imaging (3D-Echocardiography, Cardiac MRI, and 128-Slice CT Coronary Angiography), our multidisciplinary team handles complex coronary interventions, electrophysiology, pacemaker implantations, and pediatric cardiology with high clinical success rates.',
    headOfDepartment: {
      name: 'Dr. Arthur Vance, MD, DM, FACC',
      title: 'Director & Chief Interventional Cardiologist'
    },
    commonConditions: [
      'Coronary Artery Disease & Heart Attacks',
      'Heart Failure & Cardiomyopathy',
      'Arrhythmias & Palpitations',
      'Hypertension & Vascular Diseases',
      'Valvular Heart Disorders',
      'Congenital Heart Defects'
    ],
    keyProcedures: [
      'Primary Emergency Angioplasty (PAMI)',
      'Fractional Flow Reserve (FFR) & IVUS Stenting',
      'Electrophysiology & Radiofrequency Ablation',
      'Pacemaker, ICD & CRT-D Implantation',
      'Transcatheter Aortic Valve Replacement (TAVR)',
      'Preventive Cardiac Health Checkups'
    ],
    facilities: [
      '2 Dedicated Flat-Panel Cath Labs',
      '16-Bed Intensive Coronary Care Unit (ICCU)',
      'Advanced Non-Invasive Cardiac Lab',
      '24/7 Rapid Response Cardiac Ambulance'
    ],
    stats: [
      { label: 'Angioplasties Performed', value: '18,500+' },
      { label: 'Door-to-Balloon Time', value: '< 45 min' },
      { label: 'Clinical Success Rate', value: '99.2%' }
    ],
    doctorIds: ['doc-cardio-1', 'doc-cardio-2', 'doc-cardio-3']
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    tagline: 'Advanced brain, spine, and peripheral nerve treatment center',
    icon: 'Brain',
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Pioneering neurosciences center with micro-neurosurgery, comprehensive stroke management unit, epilepsy monitoring, and spine surgery.',
    fullDescription: 'Our Department of Neurology and Neurosurgery integrates leading neurologists, neurosurgeons, and neuro-interventional radiologists. Backed by 3 Tesla MRI, intraoperative neuro-monitoring, and neuronavigation systems, we deliver cutting-edge treatment for acute ischemic stroke, brain tumors, deep brain stimulation (DBS) for Parkinson’s, and minimally invasive spine surgeries.',
    headOfDepartment: {
      name: 'Dr. Eleanor Vance-Sterling, MD, MCh, FAANS',
      title: 'Chief of Neurosurgery & Neuro-Oncology'
    },
    commonConditions: [
      'Acute Ischemic & Hemorrhagic Stroke',
      'Brain & Spinal Cord Tumors',
      'Epilepsy & Seizure Disorders',
      "Parkinson's & Movement Disorders",
      'Migraine & Trigeminal Neuralgia',
      'Herniated Discs & Spinal Stenosis'
    ],
    keyProcedures: [
      'Rapid Stroke Thrombolysis & Mechanical Thrombectomy',
      'Minimally Invasive Brain Tumor Resection',
      'Stereotactic Neuronavigation Surgery',
      'Microdiscectomy & Endoscopic Spine Surgery',
      'Long-Term Video EEG Monitoring',
      'Neuro-Rehabilitation & Physical Therapy'
    ],
    facilities: [
      'Comprehensive 24/7 Stroke Unit',
      'Intraoperative 3D Neuro-Navigation OT',
      'Dedicated 12-Bed Neuro ICU',
      'Digital EEG, EMG & Evoked Potential Lab'
    ],
    stats: [
      { label: 'Neuro Surgeries', value: '9,200+' },
      { label: 'Stroke Window Response', value: '< 20 min' },
      { label: 'Tumor Resection Precision', value: '99.8%' }
    ],
    doctorIds: ['doc-neuro-1', 'doc-neuro-2', 'doc-neuro-3']
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Replacement',
    tagline: 'Robotic joint replacement, sports medicine, and trauma reconstruction',
    icon: 'Activity',
    heroImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Center for robotic knee and hip replacements, arthroscopic sports injury repair, complex fracture management, and pediatric orthopedics.',
    fullDescription: 'WeCare Orthopedic Institute delivers advanced musculoskeletal care utilizing Mako robotic-arm assisted surgical systems for sub-millimeter precision in total knee and hip arthroplasties. Our specialized sports injury clinic offers keyhole arthroscopic ligament reconstruction, cartilage restoration, and fast-track rehabilitation protocols for rapid return to active living.',
    headOfDepartment: {
      name: 'Dr. Marcus Holloway, MS, MCh (Ortho)',
      title: 'Head of Joint Reconstruction & Robotic Surgery'
    },
    commonConditions: [
      'Osteoarthritis of Knee, Hip & Shoulder',
      'ACL, PCL & Meniscal Sports Tears',
      'Rotator Cuff & Shoulder Impingement',
      'Complex Polytrauma & Pelvic Fractures',
      'Carpal Tunnel & Hand Deformities',
      'Pediatric Limb Alignment & Scoliosis'
    ],
    keyProcedures: [
      'Mako Robotic Total Knee & Hip Replacement',
      'Arthroscopic ACL / Meniscus Reconstruction',
      'Shoulder Arthroscopy & Reverse Total Shoulder',
      'Minimally Invasive Fracture Fixation (MIPO)',
      'Platelet-Rich Plasma (PRP) Therapy',
      'Post-Op Rapid Recovery Physiotherapy'
    ],
    facilities: [
      'High-Efficiency Clean Air Ultra-Sterile OTs',
      'Mako Robotic Arm System',
      'State-of-the-Art Sports Rehabilitation Gym',
      'Digital Bone Mineral Densitometry (DEXA)'
    ],
    stats: [
      { label: 'Joint Replacements', value: '14,000+' },
      { label: 'Patient Mobility in 24h', value: '94%' },
      { label: 'Infection Rate', value: '< 0.08%' }
    ],
    doctorIds: ['doc-ortho-1', 'doc-ortho-2', 'doc-ortho-3']
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    tagline: 'Compassionate and specialized healthcare for newborns, infants, and children',
    icon: 'Baby',
    heroImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Level-3 NICU & PICU, pediatric cardiology, developmental assessment, adolescent health, and comprehensive child immunization programs.',
    fullDescription: 'Our Department of Pediatrics & Neonatology is designed with child-friendly environments and backed by tertiary-level neonatal and pediatric intensive care units. We treat everything from routine childhood infections and growth tracking to extremely preterm neonatal care, congenital abnormalities, and childhood asthma.',
    headOfDepartment: {
      name: 'Dr. Sarah Jenkins, MD (Ped), DNB, Neonatology Fellow',
      title: 'Lead Neonatologist & Pediatric Critical Care Specialist'
    },
    commonConditions: [
      'Extreme Prematurity & Neonatal Jaundice',
      'Pediatric Respiratory Distress & Asthma',
      'Childhood Infections, Dengue & Pneumonia',
      'Growth & Nutritional Disorders',
      'Autism & Developmental Delays',
      'Pediatric Allergies & Immunodeficiencies'
    ],
    keyProcedures: [
      'Level-3 Neonatal Intensive Care & HFOV',
      'Pediatric Advanced Life Support (PALS)',
      'Comprehensive WHO Immunization Schedules',
      'Neonatal Neuro-Developmental Screening',
      'Pediatric Endoscopy & Bronchoscopy',
      'Child Psychology & Behavioral Counseling'
    ],
    facilities: [
      '14-Bed Advanced Level-3 NICU with Warmers',
      'Dedicated 8-Bed Pediatric ICU (PICU)',
      'Child-Friendly Play Therapy Zone',
      '24/7 Pediatric Emergency Resuscitation'
    ],
    stats: [
      { label: 'Preterm Babies Saved', value: '4,800+' },
      { label: 'Immunization Coverage', value: '100%' },
      { label: 'Parent Satisfaction', value: '99.5%' }
    ],
    doctorIds: ['doc-pedia-1', 'doc-pedia-2', 'doc-pedia-3']
  },
  {
    id: 'oncology',
    name: 'Medical & Surgical Oncology',
    tagline: 'Comprehensive cancer care, targeted therapies, and precision oncology',
    icon: 'ShieldAlert',
    heroImage: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Multi-disciplinary Tumor Board, precision chemotherapy, immunotherapy, robotic onco-surgery, and supportive palliative care.',
    fullDescription: 'WeCare Comprehensive Cancer Center delivers evidence-based oncology combining surgical oncology, medical oncology, hematology, and pain management. Every patient case is evaluated by our multidisciplinary Tumor Board to formulate personalized treatment strategies utilizing next-generation genomic testing, targeted therapies, and organ-preserving surgeries.',
    headOfDepartment: {
      name: 'Dr. Rajesh Nair, MD, DM (Medical Oncology), ESMO Certified',
      title: 'Senior Consultant & Clinical Oncologist'
    },
    commonConditions: [
      'Breast, Ovarian & Cervical Cancers',
      'Lung, Esophageal & Colorectal Cancers',
      'Head, Neck & Thyroid Malignancies',
      'Prostate, Renal & Bladder Tumors',
      'Leukemia, Lymphoma & Multiple Myeloma',
      'Gastrointestinal & Hepato-Pancreatic Cancers'
    ],
    keyProcedures: [
      'Targeted Molecular Therapy & Immunotherapy',
      'Minimally Invasive Laparoscopic Onco-Surgery',
      'Day-Care Ambulatory Chemotherapy Center',
      'Tumor Board Personalized Case Discussions',
      'Port-a-Cath Implantation & Maintenance',
      'Onco-Nutrition & Palliative Care Counseling'
    ],
    facilities: [
      '20-Bed Modern Chemotherapy Daycare Suite',
      'Laminar Flow Sterile Cytotoxic Drug Prep Unit',
      'Dedicated Surgical Oncology Operative Suites',
      'Cancer Genetic Screening & Counseling Clinic'
    ],
    stats: [
      { label: 'Chemo Sessions Managed', value: '25,000+' },
      { label: 'Tumor Board Reviews', value: '100%' },
      { label: '5-Year Remission Support', value: 'High' }
    ],
    doctorIds: ['doc-onco-1', 'doc-onco-2']
  },
  {
    id: 'gynecology',
    name: 'Obstetrics & Gynecology',
    tagline: 'Holistic care for women across all stages of life, maternity & fertility',
    icon: 'Users',
    heroImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'High-risk pregnancy management, painless natural birthing suites (LDR), laparoscopic gynecological surgeries, and fertility support.',
    fullDescription: 'Our Women’s Health division offers holistic healthcare encompassing adolescent health, pre-conception guidance, high-risk obstetrics, painless labor suites, minimally invasive gynecological endoscopy, and menopause management. We believe in gentle, patient-centered birthing experiences with full backup from our Neonatal ICU.',
    headOfDepartment: {
      name: 'Dr. Meera Vasudevan, MD, DGO, FICOG',
      title: 'Director of Obstetrics & High-Risk Pregnancy'
    },
    commonConditions: [
      'High-Risk Pregnancy & Gestational Diabetes',
      'Uterine Fibroids, Polyps & Endometriosis',
      'PCOS / PCOD & Menstrual Irregularities',
      'Ovarian Cysts & Pelvic Inflammatory Disease',
      'Infertility & Recurrent Miscarriages',
      'Menopausal Symptoms & Pelvic Floor Prolapse'
    ],
    keyProcedures: [
      'Painless Labor with Epidural Analgesia',
      '3D/4D Fetal Anomaly Ultrasonography',
      'Advanced 3D Laparoscopic Hysterectomy & Myomectomy',
      'Hysteroscopic Correction of Uterine Anomalies',
      'Pre-Natal & Post-Natal Wellness Yoga & Lamaze',
      'Cervical Cancer Pap Smear & HPV Vaccination'
    ],
    facilities: [
      'Luxury Labor-Delivery-Recovery (LDR) Rooms',
      'Direct Connectivity to Level-3 Neonatal ICU',
      'Advanced 4D Ultrasound Suite',
      'Fetal Medicine & Maternal High-Dependency Unit'
    ],
    stats: [
      { label: 'Safe Deliveries', value: '16,500+' },
      { label: 'Painless Labor Rate', value: '88%' },
      { label: 'Laparoscopic Precision', value: '99.6%' }
    ],
    doctorIds: ['doc-gyn-1', 'doc-gyn-2', 'doc-gyn-3']
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    tagline: 'Advanced digestive tract, liver, pancreas, and endoscopic sciences',
    icon: 'Stethoscope',
    heroImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'State-of-the-art diagnostic and therapeutic endoscopy, ERCP, liver disease management, and metabolic disorder treatments.',
    fullDescription: 'The Gastroenterology Center provides comprehensive treatment for disorders of the esophagus, stomach, intestines, liver, gallbladder, and pancreas. Equipped with high-definition narrow-band imaging endoscopes and SpyGlass cholangioscopy, we perform advanced therapeutic endoscopic interventions with minimal discomfort.',
    headOfDepartment: {
      name: 'Dr. Tariq Al-Mansoor, MD, DM, FACG',
      title: 'Chief Gastroenterologist & Therapeutic Endoscopist'
    },
    commonConditions: [
      'Acid Reflux (GERD) & Peptic Ulcer Disease',
      'Fatty Liver Disease, Hepatitis B/C & Cirrhosis',
      'Inflammatory Bowel Disease (Crohn’s & Ulcerative Colitis)',
      'Gallbladder Stones & Common Bile Duct Obstruction',
      'Acute & Chronic Pancreatitis',
      'Irritable Bowel Syndrome (IBS) & Celiac Disease'
    ],
    keyProcedures: [
      'Diagnostic & Therapeutic Upper GI Endoscopy',
      'Colonoscopy & Polypectomy Screening',
      'ERCP for Bile Duct Stone Extraction & Stenting',
      'Endoscopic Ultrasound (EUS) & Fine Needle Aspiration',
      'FibroScan Non-Invasive Liver Stiffness Evaluation',
      'Capsule Endoscopy for Small Bowel Disorders'
    ],
    facilities: [
      'High-Definition Olympus EVIS X1 Endoscopy Suites',
      'FibroScan Liver Assessment Unit',
      'Dedicated GI Recovery and Observation Lounge',
      '24/7 GI Bleeding Emergency Rapid Protocol'
    ],
    stats: [
      { label: 'Endoscopies Performed', value: '22,000+' },
      { label: 'ERCP Success Rate', value: '98.5%' },
      { label: 'Same-Day Discharge', value: '95%' }
    ],
    doctorIds: ['doc-gastro-1', 'doc-gastro-2']
  },
  {
    id: 'emergency',
    name: 'Emergency & Critical Care Trauma',
    tagline: '24/7 Level-1 Trauma Care, rapid triage, and advanced resuscitation',
    icon: 'Crosshair',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Round-the-clock emergency medicine physicians, ACLS certified trauma teams, state-of-the-art crash rooms, and fleet of mobile ICUs.',
    fullDescription: 'Our 24/7 Emergency and Trauma Care center is organized to treat medical, surgical, cardiac, neurological, and pediatric emergencies without delay. With direct elevator access to our hybrid surgical suites, cath labs, and intensive care units, every critical patient is handled with zero-delay protocol.',
    headOfDepartment: {
      name: 'Dr. Samantha Reed, MD (Emergency Medicine), FEM',
      title: 'Head of Emergency Medical Services & Trauma Care'
    },
    commonConditions: [
      'Acute Polytrauma & Road Traffic Accidents',
      'Sudden Cardiac Arrest & Chest Pain Triage',
      'Acute Stroke & Sudden Loss of Consciousness',
      'Severe Breathing Difficulty & Respiratory Failure',
      'Acute Poisoning, Burns & Snake Bites',
      'Severe Septic Shock & Anaphylaxis'
    ],
    keyProcedures: [
      'Emergency Airway Management & Endotracheal Intubation',
      'Central Venous & Arterial Line Cannulation',
      'Defibrillation & Synchronized Cardioversion',
      'Focused Assessment with Sonography for Trauma (FAST)',
      'Immediate Wound Debridement & Emergency Chest Tube',
      'Advanced Cardiac Life Support (ACLS) Protocols'
    ],
    facilities: [
      '20-Bed Emergency Assessment & Resuscitation Bay',
      'Dedicated Minor Procedure OT & Plaster Room',
      'Direct Access Helipad & Rapid Transfer Ramp',
      'Advanced Life Support (ALS) Ambulance Fleet with GPS'
    ],
    stats: [
      { label: 'Emergency Admissions/Yr', value: '35,000+' },
      { label: 'Triage Waiting Time', value: '0 min' },
      { label: 'Golden Hour Survival', value: '96.8%' }
    ],
    doctorIds: ['doc-em-1', 'doc-em-2']
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology Doctors
  {
    id: 'doc-cardio-1',
    name: 'Dr. Arthur Vance',
    title: 'Director & Chief Interventional Cardiologist',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Care',
    specialty: 'Interventional Cardiology & Complex Angioplasty',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology), FACC (USA), FSCAI',
    experienceYears: 22,
    rating: 4.95,
    reviewsCount: 384,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Arthur Vance is an internationally renowned interventional cardiologist with over two decades of clinical mastery. He has spearheaded over 12,000 successful coronary angioplasties, complex bifurcation stenting, and pioneering structural heart procedures like TAVR. He is a frequent keynote speaker at global cardiology conferences.',
    consultationFee: 75,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:30 PM', '04:00 PM'],
    languages: ['English', 'Spanish', 'French'],
    opdRoom: 'Room 201, Heart Tower 2nd Floor',
    education: [
      'DM in Cardiology - Johns Hopkins Medical Institute',
      'MD in General Medicine - Harvard Medical School',
      'Fellow of the American College of Cardiology (FACC)'
    ],
    awards: [
      'National Healthcare Excellence Award 2024',
      'Pioneer in Minimally Invasive Angioplasty 2021'
    ],
    isAvailableToday: true
  },
  {
    id: 'doc-cardio-2',
    name: 'Dr. Priya Sharma',
    title: 'Consultant - Electrophysiologist & Heart Rhythm Specialist',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Care',
    specialty: 'Cardiac Electrophysiology, Pacemakers & Arrhythmias',
    qualifications: 'MBBS, MD, DNB (Cardiology), Fellowship in Electrophysiology (Cleveland Clinic)',
    experienceYears: 14,
    rating: 4.88,
    reviewsCount: 260,
    image: 'https://images.unsplash.com/photo-1594824813590-482a537f7663?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Priya Sharma is a dedicated cardiac electrophysiology specialist with vast experience in 3D mapping and radiofrequency ablation of complex arrhythmias (Atrial Fibrillation, VT). She is an expert in leadless pacemakers and subcutaneous ICD implantations.',
    consultationFee: 65,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
    languages: ['English', 'Hindi', 'Gujarati'],
    opdRoom: 'Room 204, Heart Tower 2nd Floor',
    education: [
      'Fellowship in Cardiac Electrophysiology - Cleveland Clinic',
      'DNB Cardiology - National Board of Examinations',
      'MD Internal Medicine - AIIMS'
    ],
    awards: ['Young Investigator Award - Asia Pacific Heart Rhythm Society'],
    isAvailableToday: true
  },
  {
    id: 'doc-cardio-3',
    name: 'Dr. David Henderson',
    title: 'Senior Consultant - Non-Invasive & Preventive Cardiology',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Care',
    specialty: 'Echocardiography, Heart Failure Management & Cardiac Rehab',
    qualifications: 'MBBS, MD, FASE, Fellowship in Preventive Cardiology',
    experienceYears: 16,
    rating: 4.91,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. David Henderson specializes in early risk stratification for cardiovascular diseases, advanced 3D speckle-tracking echocardiography, and lifestyle reversal of atherosclerotic plaque.',
    consultationFee: 55,
    availableDays: ['Tue', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
    languages: ['English', 'German'],
    opdRoom: 'Room 206, Heart Tower 2nd Floor',
    education: [
      'Fellowship in Preventive Cardiology - Mayo Clinic',
      'MD Medicine - King’s College London'
    ],
    isAvailableToday: false
  },

  // Neurology Doctors
  {
    id: 'doc-neuro-1',
    name: 'Dr. Eleanor Vance-Sterling',
    title: 'Chief of Neurosurgery & Neuro-Oncology',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialty: 'Brain Tumor Microsurgery & Minimally Invasive Skull Base Surgery',
    qualifications: 'MBBS, MS (Surgery), MCh (Neurosurgery), FAANS (USA)',
    experienceYears: 20,
    rating: 4.96,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Eleanor Vance-Sterling has performed over 4,500 complex intracranial micro-surgeries. Specializing in awake craniotomy for glioma resections and endoscopic transsphenoidal pituitary surgeries, she leads the region in precision neurosurgical outcomes.',
    consultationFee: 85,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeSlots: ['09:00 AM', '10:45 AM', '02:00 PM', '03:45 PM'],
    languages: ['English', 'German', 'Italian'],
    opdRoom: 'Room 302, Neurosciences Block 3rd Floor',
    education: [
      'MCh Neurosurgery - Oxford University Hospitals',
      'Fellowship in Skull Base Surgery - Stanford Health Care',
      'Fellow of the American Association of Neurological Surgeons (FAANS)'
    ],
    awards: ['Global Neurosurgeon of the Year 2023', 'Best Clinical Research in Neuro-Oncology'],
    isAvailableToday: true
  },
  {
    id: 'doc-neuro-2',
    name: 'Dr. Liam Montgomery',
    title: 'Senior Consultant Neurologist & Stroke Specialist',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialty: 'Hyperacute Stroke, Neurovascular Interventions & Epilepsy',
    qualifications: 'MBBS, MD, DM (Neurology), Stroke Fellowship (UCSF)',
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Liam Montgomery leads the Comprehensive Stroke Care unit at WeCare. He specializes in hyperacute ischemic stroke management, long-term epilepsy management, and neuromuscular diseases like Myasthenia Gravis.',
    consultationFee: 70,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '11:30 AM', '01:30 PM', '04:00 PM', '05:30 PM'],
    languages: ['English', 'Spanish'],
    opdRoom: 'Room 305, Neurosciences Block 3rd Floor',
    education: [
      'Stroke Fellowship - UCSF Medical Center',
      'DM Neurology - National Institute of Mental Health & Neurosciences'
    ],
    isAvailableToday: true
  },
  {
    id: 'doc-neuro-3',
    name: 'Dr. Anita Chen',
    title: 'Consultant Neuro-Spine Surgeon',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    specialty: 'Endoscopic Spine Surgery, Disc Herniation & Spinal Fusion',
    qualifications: 'MBBS, MS (Ortho/Neuro), Fellowship in Minimally Invasive Spine (Seoul)',
    experienceYears: 11,
    rating: 4.87,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Anita Chen is an expert in keyhole endoscopic spine surgery that allows patients to walk comfortably within hours after surgery with minimal soft tissue disruption.',
    consultationFee: 65,
    availableDays: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:15 PM'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    opdRoom: 'Room 308, Neurosciences Block 3rd Floor',
    education: [
      'Spine Fellowship - Severance Hospital, Yonsei University',
      'MS Ortho - National University of Singapore'
    ],
    isAvailableToday: false
  },

  // Orthopedics Doctors
  {
    id: 'doc-ortho-1',
    name: 'Dr. Marcus Holloway',
    title: 'Head of Joint Reconstruction & Robotic Surgery',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    specialty: 'Robotic Knee & Hip Arthroplasty, Revision Joint Replacement',
    qualifications: 'MBBS, MS (Ortho), MCh (Ortho, UK), FACS',
    experienceYears: 24,
    rating: 4.97,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Marcus Holloway is an orthopedic pioneer having performed over 8,000 joint replacements with exceptional outcomes. Certified proctor for Mako Robotic-Arm surgery, he is recognized for rapid post-operative recovery protocols.',
    consultationFee: 80,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM', '04:30 PM'],
    languages: ['English', 'Portuguese'],
    opdRoom: 'Room 110, Bone & Joint Clinic 1st Floor',
    education: [
      'MCh Orthopedics - Royal College of Surgeons of Edinburgh',
      'Robotic Arthroplasty Training - Hospital for Special Surgery, New York'
    ],
    awards: ['Lifetime Achievement in Joint Reconstruction 2025'],
    isAvailableToday: true
  },
  {
    id: 'doc-ortho-2',
    name: 'Dr. James Rodriguez',
    title: 'Consultant - Sports Medicine & Arthroscopy Specialist',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    specialty: 'Shoulder & Knee Arthroscopy, ACL Reconstruction, Cartilage Repair',
    qualifications: 'MBBS, DNB (Ortho), Fellowship in Sports Medicine (Barcelona)',
    experienceYears: 13,
    rating: 4.92,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. James Rodriguez is the team physician for elite athletic leagues, specializing in complex ligament reconstructions, rotator cuff repairs, and advanced biological therapies like Stem Cell and PRP injections.',
    consultationFee: 60,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:45 AM', '02:00 PM', '04:00 PM'],
    languages: ['English', 'Spanish'],
    opdRoom: 'Room 114, Bone & Joint Clinic 1st Floor',
    education: ['Sports Medicine Fellowship - FC Barcelona Medical Services', 'DNB Orthopedics'],
    isAvailableToday: true
  },
  {
    id: 'doc-ortho-3',
    name: 'Dr. Maya Patel',
    title: 'Consultant - Pediatric Orthopedics & Trauma',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    specialty: 'Pediatric Bone Deformities, Clubfoot, Scoliosis & Complex Fractures',
    qualifications: 'MBBS, MS (Ortho), Fellowship in Pediatric Orthopedics (Toronto)',
    experienceYears: 12,
    rating: 4.89,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Maya Patel is dedicated to caring for children with congenital musculoskeletal disorders, clubfoot (Ponseti method), developmental hip dysplasia, and pediatric fracture repair.',
    consultationFee: 60,
    availableDays: ['Tue', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:30 AM', '11:15 AM', '01:45 PM', '03:30 PM'],
    languages: ['English', 'Hindi', 'Gujarati'],
    opdRoom: 'Room 118, Bone & Joint Clinic 1st Floor',
    education: [
      'Pediatric Orthopedic Fellowship - Hospital for Sick Children (SickKids), Toronto',
      'MS Ortho - King Edward Memorial Hospital'
    ],
    isAvailableToday: false
  },

  // Pediatrics Doctors
  {
    id: 'doc-pedia-1',
    name: 'Dr. Sarah Jenkins',
    title: 'Lead Neonatologist & Pediatric Critical Care Specialist',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatology',
    specialty: 'Neonatal Intensive Care (NICU), Preterm Care, Pediatric Pulmonology',
    qualifications: 'MBBS, MD (Pediatrics), DNB, Fellowship in Neonatology (Sydney)',
    experienceYears: 18,
    rating: 4.98,
    reviewsCount: 610,
    image: 'https://images.unsplash.com/photo-1594824813590-482a537f7663?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Sarah Jenkins has managed care for thousands of critically ill newborns and premature infants as low as 550 grams. Her gentle clinical demeanor and holistic family-centered NICU approach are loved by parents.',
    consultationFee: 60,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:00 AM', '10:15 AM', '11:30 AM', '02:00 PM', '03:45 PM'],
    languages: ['English', 'Spanish'],
    opdRoom: 'Room 401, Children’s Pavilion 4th Floor',
    education: [
      'Fellowship in Neonatology - Royal Children’s Hospital Melbourne',
      'MD Pediatrics - Boston Children’s Hospital'
    ],
    awards: ['Outstanding Compassion in Pediatric Care Award 2024'],
    isAvailableToday: true
  },
  {
    id: 'doc-pedia-2',
    name: 'Dr. Daniel O’Connor',
    title: 'Senior Consultant - General Pediatrics & Adolescent Health',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatology',
    specialty: 'Child Growth & Nutrition, Immunization, Asthma & Allergies',
    qualifications: 'MBBS, MD (Pediatrics), MRCPCH (UK)',
    experienceYears: 16,
    rating: 4.93,
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Daniel O’Connor provides comprehensive primary and preventive healthcare for children from birth to 18 years, emphasizing developmental milestones, adolescent counseling, and vaccination.',
    consultationFee: 50,
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '04:15 PM'],
    languages: ['English', 'Irish'],
    opdRoom: 'Room 405, Children’s Pavilion 4th Floor',
    education: ['MRCPCH - Royal College of Paediatrics and Child Health, UK', 'MD - Trinity College Dublin'],
    isAvailableToday: true
  },
  {
    id: 'doc-pedia-3',
    name: 'Dr. Aisha Al-Hassan',
    title: 'Consultant - Pediatric Cardiology',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatology',
    specialty: 'Congenital Heart Disease, Pediatric Echocardiography & Murmurs',
    qualifications: 'MBBS, MD, DM (Pediatric Cardiology), Fellowship (London)',
    experienceYears: 12,
    rating: 4.91,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Aisha specializes in non-invasive diagnosis and intervention for congenital heart defects in infants and young children, providing empathetic guidance for young families.',
    consultationFee: 70,
    availableDays: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
    languages: ['English', 'Arabic'],
    opdRoom: 'Room 408, Children’s Pavilion 4th Floor',
    education: ['Pediatric Cardiology Fellowship - Great Ormond Street Hospital, London'],
    isAvailableToday: false
  },

  // Oncology Doctors
  {
    id: 'doc-onco-1',
    name: 'Dr. Rajesh Nair',
    title: 'Senior Consultant & Clinical Oncologist',
    departmentId: 'oncology',
    departmentName: 'Medical & Surgical Oncology',
    specialty: 'Targeted Immunotherapy, Breast & Lung Cancer, Precision Oncology',
    qualifications: 'MBBS, MD, DM (Medical Oncology), ESMO Certified (Europe)',
    experienceYears: 19,
    rating: 4.94,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Rajesh Nair is a leading medical oncologist specializing in genomic profiling of tumors, immunotherapy regimens, and clinical cancer trials with higher cure and survival rates.',
    consultationFee: 80,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:45 AM', '02:00 PM', '04:00 PM'],
    languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
    opdRoom: 'Room 501, Oncology Center 5th Floor',
    education: [
      'DM Medical Oncology - Tata Memorial Hospital',
      'ESMO Certification - European Society for Medical Oncology'
    ],
    awards: ['National Cancer Researcher of the Year 2023'],
    isAvailableToday: true
  },
  {
    id: 'doc-onco-2',
    name: 'Dr. Claire Laurent',
    title: 'Chief Surgical Oncologist',
    departmentId: 'oncology',
    departmentName: 'Medical & Surgical Oncology',
    specialty: 'Minimally Invasive Onco-Surgery, Gastrointestinal & Breast Oncology',
    qualifications: 'MBBS, MS (General Surgery), MCh (Surgical Oncology), FACS',
    experienceYears: 17,
    rating: 4.92,
    reviewsCount: 285,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Claire Laurent is a world-class onco-surgeon adept in laparoscopic and robotic-assisted tumor resections, organ-preserving breast surgeries (oncoplasty), and pelvic exenterations.',
    consultationFee: 85,
    availableDays: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
    languages: ['English', 'French'],
    opdRoom: 'Room 506, Oncology Center 5th Floor',
    education: [
      'Surgical Oncology Fellowship - Gustave Roussy Institute, Paris',
      'MCh Surgical Oncology - Johns Hopkins University'
    ],
    isAvailableToday: true
  },

  // Obstetrics & Gynecology Doctors
  {
    id: 'doc-gyn-1',
    name: 'Dr. Meera Vasudevan',
    title: 'Director of Obstetrics & High-Risk Pregnancy',
    departmentId: 'gynecology',
    departmentName: 'Obstetrics & Gynecology',
    specialty: 'High-Risk Obstetrics, Fetal Medicine & Natural Gentle Birthing',
    qualifications: 'MBBS, MD, DGO, FICOG, Fellowship in Maternal-Fetal Medicine',
    experienceYears: 23,
    rating: 4.98,
    reviewsCount: 680,
    image: 'https://images.unsplash.com/photo-1594824813590-482a537f7663?auto=format&fit=crop&w=600&q=80',
    bio: 'With over 10,000 successful deliveries, Dr. Meera Vasudevan is celebrated for managing complex high-risk maternal conditions, twins/triplets, and pioneering painless delivery programs.',
    consultationFee: 70,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:15 PM'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    opdRoom: 'Room 312, Women & Child Center 3rd Floor',
    education: [
      'Maternal Fetal Medicine - King’s College London',
      'MD Obstetrics & Gynecology - Madras Medical College'
    ],
    awards: ['Best Obstetrician Award 2024', 'Mother & Child Care Champion'],
    isAvailableToday: true
  },
  {
    id: 'doc-gyn-2',
    name: 'Dr. Sophia Martinez',
    title: 'Consultant - Laparoscopic Gynecologist & Infertility Specialist',
    departmentId: 'gynecology',
    departmentName: 'Obstetrics & Gynecology',
    specialty: 'Laparoscopic Hysterectomy, Endometriosis & PCOS Management',
    qualifications: 'MBBS, MS (OBG), Fellowship in Minimal Access Surgery (Germany)',
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Sophia Martinez specializes in 3D laparoscopic surgery for uterine fibroids, severe endometriosis excision, hysteroscopy, and advanced ovulation induction therapies.',
    consultationFee: 65,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['09:30 AM', '11:15 AM', '02:00 PM', '03:45 PM'],
    languages: ['English', 'Spanish'],
    opdRoom: 'Room 316, Women & Child Center 3rd Floor',
    education: ['Laparoscopic Fellowship - Kiel School of Gynecological Endoscopy, Germany'],
    isAvailableToday: true
  },
  {
    id: 'doc-gyn-3',
    name: 'Dr. Karen Bennett',
    title: 'Consultant - Urogynecology & Pelvic Floor Reconstruction',
    departmentId: 'gynecology',
    departmentName: 'Obstetrics & Gynecology',
    specialty: 'Urinary Incontinence, Pelvic Organ Prolapse & Menopause Clinic',
    qualifications: 'MBBS, MD (OBG), MRCOG (London)',
    experienceYears: 16,
    rating: 4.88,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Karen Bennett focuses on restorative women’s health, specialized pelvic floor therapies, urinary incontinence solutions, and evidence-based hormone replacement therapies.',
    consultationFee: 65,
    availableDays: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:45 AM', '01:30 PM', '04:00 PM'],
    languages: ['English'],
    opdRoom: 'Room 320, Women & Child Center 3rd Floor',
    education: ['MRCOG - Royal College of Obstetricians and Gynaecologists, London'],
    isAvailableToday: false
  },

  // Gastroenterology Doctors
  {
    id: 'doc-gastro-1',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'Chief Gastroenterologist & Therapeutic Endoscopist',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Hepatology',
    specialty: 'Advanced Therapeutic Endoscopy, ERCP & Pancreatic Disorders',
    qualifications: 'MBBS, MD (Medicine), DM (Gastroenterology), FACG (USA)',
    experienceYears: 21,
    rating: 4.96,
    reviewsCount: 440,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Tariq Al-Mansoor is a renowned gastroenterologist with over 15,000 advanced endoscopic procedures. He excels in complex ERCP for bile duct stones, endoscopic mucosal resection (EMR), and jaundice triage.',
    consultationFee: 75,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM'],
    languages: ['English', 'Arabic'],
    opdRoom: 'Room 220, Digestive Health Pavilion 2nd Floor',
    education: [
      'Advanced Endoscopy Fellowship - Harvard Medical School',
      'DM Gastroenterology - Post Graduate Institute of Medical Education (PGIMER)'
    ],
    awards: ['Master of the American College of Gastroenterology (MACG) Nominee'],
    isAvailableToday: true
  },
  {
    id: 'doc-gastro-2',
    name: 'Dr. Emily Watson',
    title: 'Consultant Hepatologist & Liver Transplant Physician',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Hepatology',
    specialty: 'Fatty Liver (NASH), Cirrhosis, Viral Hepatitis & Liver Failure',
    qualifications: 'MBBS, MD, DM (Hepatology), AASLD Member',
    experienceYears: 13,
    rating: 4.91,
    reviewsCount: 275,
    image: 'https://images.unsplash.com/photo-1594824813590-482a537f7663?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Emily Watson is passionate about non-alcoholic fatty liver disease (NAFLD) management, viral hepatitis cure programs, and pre/post-liver transplantation medical care.',
    consultationFee: 65,
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    languages: ['English', 'German'],
    opdRoom: 'Room 224, Digestive Health Pavilion 2nd Floor',
    education: ['Hepatology Fellowship - King’s College Hospital Liver Unit, London'],
    isAvailableToday: true
  },

  // Emergency & Trauma Doctors
  {
    id: 'doc-em-1',
    name: 'Dr. Samantha Reed',
    title: 'Head of Emergency Medical Services & Trauma Care',
    departmentId: 'emergency',
    departmentName: 'Emergency & Critical Care Trauma',
    specialty: 'Level-1 Trauma Resuscitation, Acute Toxicology & Disaster Medicine',
    qualifications: 'MBBS, MD (Emergency Medicine), FEM (UK), ACLS/ATLS Master Instructor',
    experienceYears: 18,
    rating: 4.99,
    reviewsCount: 510,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Samantha Reed directs the 24/7 Emergency & Level-1 Trauma Center at WeCare. She is celebrated for establishing rapid response golden-hour trauma protocols and mobile ICU triage standards.',
    consultationFee: 70,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'],
    languages: ['English', 'Spanish'],
    opdRoom: 'Ground Floor Trauma Triage Command',
    education: [
      'MD Emergency Medicine - George Washington University',
      'Fellow of Emergency Medicine - Royal College of Emergency Medicine'
    ],
    awards: ['National Emergency Physician of the Year 2024'],
    isAvailableToday: true
  },
  {
    id: 'doc-em-2',
    name: 'Dr. Benjamin Cruz',
    title: 'Senior Consultant - Critical Care & Intensivist',
    departmentId: 'emergency',
    departmentName: 'Emergency & Critical Care Trauma',
    specialty: 'Multi-Organ Failure, ECMO Management & Septic Shock',
    qualifications: 'MBBS, MD (Anesthesia & Critical Care), EDIC (European Diploma in Intensive Care)',
    experienceYears: 15,
    rating: 4.93,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Benjamin Cruz leads our multidisciplinary Intensive Care Units (ICU), specializing in advanced mechanical ventilation, bedside ECMO, and acute renal replacement therapy (CRRT).',
    consultationFee: 70,
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sun'],
    timeSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
    languages: ['English', 'Tagalog'],
    opdRoom: 'Ground Floor Emergency & Central ICU',
    education: ['European Diploma in Intensive Care (EDIC)', 'MD Anesthesiology - Johns Hopkins'],
    isAvailableToday: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'Robert Sterling',
    location: 'Chicago, IL',
    treatment: 'Emergency Primary Angioplasty',
    department: 'Cardiology & Heart Care',
    doctorName: 'Dr. Arthur Vance',
    rating: 5,
    comment: 'When I experienced severe chest pain at 2 AM, the WeCare emergency team had me in the Cath Lab within 18 minutes. Dr. Arthur Vance placed two stents with absolute mastery. They literally saved my life. Forever grateful to WeCare Hospitals.',
    date: 'February 14, 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-2',
    patientName: 'Hannah Montgomery',
    location: 'Austin, TX',
    treatment: 'Robotic Bilateral Knee Replacement',
    department: 'Orthopedics & Joint Replacement',
    doctorName: 'Dr. Marcus Holloway',
    rating: 5,
    comment: 'I had been struggling with severe osteoarthritis for 7 years. Dr. Marcus Holloway performed Mako robotic knee surgery. I was walking with support on day 2 and back on my morning bicycle rides within 6 weeks. Pristine hospital environment!',
    date: 'January 28, 2026',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-3',
    patientName: 'Elena Rostova',
    location: 'Seattle, WA',
    treatment: 'High-Risk Maternity & Gentle Birthing',
    department: 'Obstetrics & Gynecology',
    doctorName: 'Dr. Meera Vasudevan',
    rating: 5,
    comment: 'Dr. Meera and her nursing staff turned what could have been a terrifying high-risk pregnancy into the most calm, joyous birth for our baby girl. The LDR suites feel like a luxury resort with five-star medical precision.',
    date: 'December 19, 2025',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-4',
    patientName: 'Jonathan Hayes',
    location: 'Denver, CO',
    treatment: 'Microsurgical Brain Tumor Resection',
    department: 'Neurology & Neurosurgery',
    doctorName: 'Dr. Eleanor Vance-Sterling',
    rating: 5,
    comment: 'Dr. Eleanor is nothing short of miraculous. Her calm confidence gave our family hope during the darkest moment. The surgery completely removed the benign tumor with zero neurological deficits.',
    date: 'November 05, 2025',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const HOSPITAL_FACILITIES: HospitalFacility[] = [
  {
    id: 'f-1',
    title: 'Advanced Robotic Surgical Suites',
    category: 'Surgical Excellence',
    description: 'Equipped with Mako robotic arms and Da Vinci surgical systems for millimeter-level precision and ultra-fast healing.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-2',
    title: '24/7 Level-1 Trauma & Helipad',
    category: 'Emergency Services',
    description: 'Direct zero-delay triage with dedicated trauma bays, mobile ICUs, and on-roof helicopter emergency medical transport.',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-3',
    title: '3 Tesla MRI & 128-Slice CT',
    category: 'Diagnostic Radiology',
    description: 'Ultra-high-definition non-invasive imaging for rapid cardiac, neurological, and oncological evaluation with reduced radiation.',
    icon: 'Radio',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-4',
    title: 'Level-3 Neonatal & Pediatric ICU',
    category: 'Critical Care',
    description: 'Specialized climate-controlled incubators and advanced respiratory support for premature infants and pediatric emergencies.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  }
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-1',
    name: 'Executive Master Health Check',
    targetAudience: 'Men & Women (35+ years)',
    testsCount: 68,
    originalPrice: 280,
    discountedPrice: 169,
    popular: true,
    features: [
      'Complete Blood Count (CBC) & ESR',
      'Comprehensive Lipid Profile & Liver Function',
      'Kidney Function & HbA1c Glycated Sugar',
      'Cardiology 2D-Echo & Treadmill Test (TMT)',
      'Ultrasound Abdomen & Pelvis (USG)',
      'Chest X-Ray & Pulmonary Function Test',
      'Consultation with Senior Physician & Dietitian'
    ]
  },
  {
    id: 'pkg-2',
    name: 'Healthy Heart Comprehensive',
    targetAudience: 'Cardiac Risk Screening',
    testsCount: 42,
    originalPrice: 220,
    discountedPrice: 129,
    features: [
      'Coronary Risk Profile & High-Sensitivity CRP',
      'TMT / Stress Echo with Cardiologist',
      'Apolipoprotein A1 & B Screening',
      'Electrolytes & Renal Function Panel',
      'ECG 12-Lead with Computerized Analysis',
      'Personalized Cardio-Diet & Lifestyle Action Plan'
    ]
  },
  {
    id: 'pkg-3',
    name: "Women's Wellness & Cancer Screen",
    targetAudience: 'Women of all age groups',
    testsCount: 50,
    originalPrice: 250,
    discountedPrice: 149,
    features: [
      'Liquid-Based Pap Smear & HPV DNA Test',
      'Digital Bilateral Breast Mammography / Sonomammography',
      'Thyroid Profile (Free T3, Free T4, TSH)',
      'Bone Mineral Density (DEXA Scan)',
      'Vitamin D3 & B12 Levels',
      'Consultation with Senior Gynecologist'
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'WC-2026-4821',
    doctorId: 'doc-cardio-1',
    doctorName: 'Dr. Arthur Vance',
    doctorSpecialty: 'Interventional Cardiology & Complex Angioplasty',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Care',
    consultationType: 'in-person',
    date: '2026-09-02',
    timeSlot: '10:30 AM',
    patientName: 'Alexander Hayes',
    patientAge: 48,
    patientGender: 'Male',
    patientPhone: '+1 (555) 234-8901',
    patientEmail: 'a.hayes@example.com',
    reason: 'Follow-up consultation after stress test and hypertension management.',
    isFirstVisit: false,
    status: 'confirmed',
    createdAt: '2026-08-27T14:30:00Z',
    fee: 75
  },
  {
    id: 'WC-2026-8912',
    doctorId: 'doc-ortho-1',
    doctorName: 'Dr. Marcus Holloway',
    doctorSpecialty: 'Robotic Knee & Hip Arthroplasty',
    doctorImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    consultationType: 'in-person',
    date: '2026-09-05',
    timeSlot: '02:00 PM',
    patientName: 'Margaret Sullivan',
    patientAge: 62,
    patientGender: 'Female',
    patientPhone: '+1 (555) 876-5432',
    patientEmail: 'msullivan@example.com',
    reason: 'Evaluation for robotic knee arthroplasty due to persistent joint stiffness.',
    isFirstVisit: true,
    status: 'confirmed',
    createdAt: '2026-08-28T09:15:00Z',
    fee: 80
  }
];

export const HOSPITAL_INFO = {
  name: 'WeCare Hospitals',
  tagline: 'Compassionate Care, World-Class Medicine',
  establishedYear: 2004,
  phone: '+1 (800) 932-2731',
  emergencyPhone: '+1 (800) 911-2470',
  ambulanceDirect: '911 / +1 (800) 911-2470',
  email: 'care@wecarehospitals.com',
  appointmentsEmail: 'appointments@wecarehospitals.com',
  address: '742 Healthcare Boulevard, Medical District, Suite 500, Metro City, MC 90210',
  visitingHours: '10:00 AM - 08:00 PM (Daily)',
  opdHours: '08:30 AM - 08:00 PM (Monday - Saturday)',
  emergencyHours: '24 Hours / 7 Days a Week / 365 Days',
  accreditations: [
    { name: 'JCI Accredited', detail: 'Joint Commission International Gold Seal' },
    { name: 'NABH Certified', detail: 'Highest Healthcare Quality Standard' },
    { name: 'NABL Certified Lab', detail: 'ISO 15189 Molecular & Pathology' },
    { name: 'ISO 9001:2015', detail: 'Patient Safety & Clinical Hygiene' }
  ]
};

// Aliases for AI and Modal components
export const HOSPITAL_DEPARTMENTS = DEPARTMENTS;
export const DOCTORS_DATABASE = DOCTORS;

