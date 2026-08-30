import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NOMINI GROUP & AGRO. database from Corporate Portfolio PDF...');

  // 1. Clean existing records in correct relation order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.crowdfarmProject.deleteMany();
  await prisma.task.deleteMany();
  await prisma.product.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('NominiPass2026!', 10);

  // 2. Create Users based on Leadership & Management Team in PDF
  // CEO & MD
  const ceo = await prisma.user.create({
    data: {
      email: 'wares.ceo@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Abdul Wares',
      role: Role.ADMIN,
      department: 'Managing Director & CEO (Executive Board)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  // COO & Marketing
  const coo = await prisma.user.create({
    data: {
      email: 'anwar.coo@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Anwar Hossain',
      role: Role.ADMIN,
      department: 'COO & VP Marketing',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  // CFO & Finance
  const cfo = await prisma.user.create({
    data: {
      email: 'sahadat.cfo@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Sahadat Hossain',
      role: Role.ADMIN,
      department: 'CFO & VP Finance',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Operations In-Charge (Farm Operator)
  const opsLead = await prisma.user.create({
    data: {
      email: 'rubel.ops@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Rubel Hossain',
      role: Role.FARM_OPERATOR,
      department: 'Operations In-Charge (Fulbari Hub)',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Department Head (Employee)
  const deptHead = await prisma.user.create({
    data: {
      email: 'plabon.lead@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Plabon Bin Ratul',
      role: Role.EMPLOYEE,
      department: 'Department Head (Agriculture & Bio-Energy)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // HR Manager & Sourcing (Employee)
  const hrSourcing = await prisma.user.create({
    data: {
      email: 'rakibul.hr@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Rakibul Islam',
      role: Role.EMPLOYEE,
      department: 'Director - HR & Sourcing',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Admin Manager
  const adminMgr = await prisma.user.create({
    data: {
      email: 'abdullah.admin@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Abdullah (Shidhu)',
      role: Role.ADMIN,
      department: 'Director & Admin Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Global Investor
  const investor = await prisma.user.create({
    data: {
      email: 'elena.investor@nominigroup.com',
      password: passwordHash,
      fullName: 'Elena Rostova',
      role: Role.INVESTOR,
      department: 'Global Impact Agro Investment Fund',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  // International Export Buyer / Customer
  const customer = await prisma.user.create({
    data: {
      email: 'alex.buyer@nominigroup.com',
      password: passwordHash,
      fullName: 'Alex Morgan',
      role: Role.CUSTOMER,
      department: 'Global Organic Foods Distribution Ltd.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Agro Inputs & Machinery Supplier / Partner
  const supplier = await prisma.user.create({
    data: {
      email: 'kamal.supplier@nominigroup.com',
      password: passwordHash,
      fullName: 'Md. Kamal Hossain',
      role: Role.SUPPLIER,
      department: 'Agro Machinery & Solar Pump Supplies Partner',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Created users matching Nomini Group Leadership, Staff, Customers, Investors & Suppliers');

  // 3. Create DPP Batches matching Nomini Group 6 Core Sectors in Bangladesh
  // Batch 1: Agriculture & Spices (Fulbari Plot Alpha, Dinajpur)
  const batch1 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-NOM-2026-001',
      farmPlot: 'Plot Alpha-1 (Fulbari Agro Zone, Dinajpur, Bangladesh)',
      harvestDate: new Date('2026-08-22T08:00:00Z'),
      geoCoordinates: '25.4988° N, 88.8892° E',
      labReportUrl: 'https://nominigroup.com/reports/BATCH-NOM-2026-001-LAB.pdf',
      sustainability: {
        carbonRating: 'A+',
        netEmissionsKg: '-2.10 kg CO2e / kg (Carbon Negative Circular)',
        waterConservation: '98.6% via Solar Drip Irrigation & Rainwater Catchment',
        organicCertified: true,
        certificationBody: 'ISO 22000, HACCP, Ecocert & Halal Bangladesh Certified',
        pesticideFree: '100% Zero Synthetic Pesticides (Integrated Bio-Pest Defense)',
        soilHealthIndex: 97,
        solarPoweredProcessing: '100% Solar-Powered Closed-Loop Dryers',
        circularEconomy: 'Organic cattle manure & biogas slurry recycled into 100% bio-compost',
        biodiversityScore: 'High (Cover Cropping & Indigenous Pollinator Hedges)',
      },
      timeline: [
        {
          step: 1,
          date: '2026-03-05',
          title: 'Bio-Compost Soil Conditioning & Solar Irrigation Prep',
          description: 'Applied 25,000 MT spec organic compost from our green-energy division to restore alluvial soil microbiomes in Fulbari.',
          operator: 'Md. Rubel Hossain (Operations In-Charge)',
          location: 'Fulbari Agro Zone, Dinajpur',
          status: 'COMPLETED',
        },
        {
          step: 2,
          date: '2026-05-12',
          title: 'High-Yield Scientific Seed Sowing & Smart Drip Activation',
          description: 'Sowed high-yielding organic cardamom, black pepper, and turmeric varieties with IoT soil moisture deficit scheduling.',
          operator: 'Md. Plabon Bin Ratul (Dept Head Agriculture)',
          location: 'Fulbari Plot Alpha-1',
          status: 'COMPLETED',
        },
        {
          step: 3,
          date: '2026-07-20',
          title: 'Chemical Purity & Heavy Metal Spectrometry Testing',
          description: 'Independent lab assay confirmed 0.00 ppm chemical pesticides, zero synthetic nitrates, and pristine purity.',
          operator: 'Nomini Group Quality Assurance Lab',
          location: 'Central QA Lab, Dinajpur',
          status: 'COMPLETED',
        },
        {
          step: 4,
          date: '2026-08-22',
          title: 'Handpicked Selective Harvest & Solar Dehydration',
          description: 'Harvested at peak essential oil content; sun-dried on solar-assisted hygiene racks at 42°C.',
          operator: 'Harvest Crew (Contract Farming Team #4)',
          location: 'Fulbari Solar Dry Facility',
          status: 'COMPLETED',
        },
        {
          step: 5,
          date: '2026-08-26',
          title: 'Vacuum Hermetic Sealing & QR DPP Minting',
          description: 'Nitrogen-flushed food-grade packaging stamped with EU ESPR and Bangladesh export compliance tags.',
          operator: 'Md. Rakibul Islam (Director Sourcing)',
          location: 'Nomini Processing Mill #1',
          status: 'COMPLETED',
        },
      ],
    },
  });

  // Batch 2: Advanced Aquaculture & Seafood (Biofloc Hatchery Dinajpur)
  const batch2 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-NOM-2026-002',
      farmPlot: 'Biofloc Hatchery Unit 4 (Nomini Aquaculture Basin, Rangpur)',
      harvestDate: new Date('2026-08-18T06:30:00Z'),
      geoCoordinates: '25.7439° N, 89.2752° E',
      labReportUrl: 'https://nominigroup.com/reports/BATCH-NOM-2026-002-AQUA.pdf',
      sustainability: {
        carbonRating: 'A+',
        netEmissionsKg: '0.08 kg CO2e / kg',
        waterConservation: '96.2% Water Recycling via Biofloc Recirculating Systems (RAS)',
        organicCertified: true,
        certificationBody: 'US FDA & EU Seafood Export Standard, Halal Certified',
        pesticideFree: '100% Antibiotic-Free & Zero Formalin Verified',
        soilHealthIndex: 99,
        solarPoweredProcessing: '100% Solar-Spun Aeration & Cold-Chain Storage',
        biodiversityScore: 'Zero River Pollution (Closed-Loop Sludge to Biogas)',
      },
      timeline: [
        {
          step: 1,
          date: '2026-04-10',
          title: 'Microbial Floc Inoculation & Probiotic Water Balancing',
          description: 'Cultivated beneficial heterotrophic bacteria for natural water purification without chemical antibiotics.',
          operator: 'Md. Rubel Hossain (Operations In-Charge)',
          location: 'Biofloc Hatchery Unit 4',
          status: 'COMPLETED',
        },
        {
          step: 2,
          date: '2026-06-15',
          title: 'High-Protein Extruded Floating Feed Cycle',
          description: 'Fed proprietary eco-friendly floating aqua-feed formulated with natural algae and zero mammalian bone meal.',
          operator: 'Aquaculture Feeding Team Alpha',
          location: 'Biofloc Hatchery Unit 4',
          status: 'COMPLETED',
        },
        {
          step: 3,
          date: '2026-08-18',
          title: 'Live Harvest & Immediate Cold-Chain Flash Chilling',
          description: 'Harvested premium Black Tiger Shrimp and Tilapia fillets chilled to 0°C within 15 minutes of water exit.',
          operator: 'Nomini Cold-Chain Logistics Hub',
          location: 'Processing Hub Rangpur',
          status: 'COMPLETED',
        },
        {
          step: 4,
          date: '2026-08-24',
          title: 'HACCP Pathogen & Heavy Metals Clearance',
          description: 'Certified negative for Vibrio, Salmonella, and lead. Export clearance issued for international markets.',
          operator: 'International Export Audit Body',
          location: 'Chittagong Export Depot',
          status: 'COMPLETED',
        },
      ],
    },
  });

  // Batch 3: Food Processing & Botanical Extracts (Nomini Processing Plant Dinajpur)
  const batch3 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-NOM-2026-003',
      farmPlot: 'Plant #2 Agroforestry Terraces (Fulbari, Dinajpur)',
      harvestDate: new Date('2026-08-15T09:15:00Z'),
      geoCoordinates: '25.5012° N, 88.8945° E',
      labReportUrl: 'https://nominigroup.com/reports/BATCH-NOM-2026-003-FOOD.pdf',
      sustainability: {
        carbonRating: 'A',
        netEmissionsKg: '-0.95 kg CO2e / liter',
        waterConservation: '95.0% Closed Loop Washing & Recycling',
        organicCertified: true,
        certificationBody: 'BSTI, ISO 22000, Organic Bio-Standard & Halal',
        pesticideFree: '100% Solvent-Free Mechanical Cold Press',
        soilHealthIndex: 94,
        solarPoweredProcessing: '100% Rooftop Solar Powered Cold Pressing Mill',
        biodiversityScore: 'High (Contract Farmer Agroforestry Network)',
      },
      timeline: [
        {
          step: 1,
          date: '2026-03-01',
          title: 'Moringa & Mustard Seed Contract Farming Inoculation',
          description: 'Distributed certified seeds and organic bio-fertilizers to 2,400 contract farming families in Dinajpur.',
          operator: 'Md. Rakibul Islam (Director Sourcing)',
          location: 'Fulbari Farmer Center',
          status: 'COMPLETED',
        },
        {
          step: 2,
          date: '2026-06-28',
          title: 'Fresh Botanical Leaf Dehydration (<38°C)',
          description: 'Ultra-gentle low temperature solar drying preserved 99.4% active vitamins, antioxidants, and chlorophyll.',
          operator: 'Nomini Green Tech Team',
          location: 'Nomini Processing Mill #2',
          status: 'COMPLETED',
        },
        {
          step: 3,
          date: '2026-08-15',
          title: 'Single-Pass Cold Mechanical Expeller Pressing',
          description: 'Cold-pressed virgin mustard and botanical seed oil at <26°C with zero chemical solvents or heat treatment.',
          operator: 'Md. Plabon Bin Ratul (Dept Head)',
          location: 'Nomini Processing Mill #2',
          status: 'COMPLETED',
        },
        {
          step: 4,
          date: '2026-08-25',
          title: 'UV Sterilization & Dark Amber Bottle Packaging',
          description: 'Sealed in UV-resistant glass bottles to lock in natural polyphenols and extend fresh shelf life to 24 months.',
          operator: 'Nomini Packaging Line B',
          location: 'Fulbari Central Facility',
          status: 'COMPLETED',
        },
      ],
    },
  });

  // Batch 4: Renewable Bio-Energy & Eco-Bio Fiber (Green Tech Division)
  const batch4 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-NOM-2026-004',
      farmPlot: 'Green Tech Circular Eco Hub (Fulbari, Dinajpur)',
      harvestDate: new Date('2026-08-10T10:00:00Z'),
      geoCoordinates: '25.4950° N, 88.8850° E',
      labReportUrl: 'https://nominigroup.com/reports/BATCH-NOM-2026-004-FIBER.pdf',
      sustainability: {
        carbonRating: 'A+',
        netEmissionsKg: '-4.80 kg CO2e / kg (Ultra Carbon Sink)',
        waterConservation: '100% Upcycled Agricultural Byproducts',
        organicCertified: true,
        certificationBody: 'Global Organic Textile Standard (GOTS) & Green Eco Certified',
        pesticideFree: '100% Zero Chemical Retting & Zero Bleach',
        soilHealthIndex: 98,
        solarPoweredProcessing: '100% Solar-Powered Mechanical Decortication',
        circularEconomy: 'Converts banana pseudostems, pineapple leaves & water hyacinth into high-tensile eco fiber',
      },
      timeline: [
        {
          step: 1,
          date: '2026-05-10',
          title: 'Agro-Waste Collection (Banana & Pineapple Stems)',
          description: 'Collected 120 tons of post-harvest crop stems from local farming cooperatives, preventing open burning.',
          operator: 'Md. Rubel Hossain (Operations In-Charge)',
          location: 'Dinajpur Agro Clusters',
          status: 'COMPLETED',
        },
        {
          step: 2,
          date: '2026-07-02',
          title: 'Solar-Powered Mechanical Fiber Decortication',
          description: 'Extracted long-staple natural cellulose fibers using our 15 MW solar-assisted mechanical decorticator.',
          operator: 'Green Tech Engineering Team',
          location: 'Nomini Bio-Energy Hub',
          status: 'COMPLETED',
        },
        {
          step: 3,
          date: '2026-08-10',
          title: 'Natural Biological Softening & Solar Yarn Spooling',
          description: 'Eco-conditioned using plant enzymes without caustic soda; wound into high-tensile export-grade eco yarn.',
          operator: 'Md. Plabon Bin Ratul (Dept Head)',
          location: 'Fulbari Fiber Mill',
          status: 'COMPLETED',
        },
      ],
    },
  });

  console.log('✅ Created DPP batches covering Agriculture, Aquaculture, Food Processing & Bio-Energy');

  // 4. Create Physical Products linked to Batches (Reflecting Nomini Group Product Lines)
  await prisma.product.create({
    data: {
      title: 'Nomini Estate Single-Origin Organic Black Pepper & Spices (250g)',
      description: 'Single-estate whole black pepper and premium organic spices cultivated in Dinajpur with solar drip fertigation. 100% chemical free with guaranteed high piperine content.',
      priceUSD: 12.50,
      stockQty: 350,
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80',
      category: 'Organic Spices',
      sku: 'NOM-SPICE-PEP-250G',
      originFarm: 'Nomini Agro Zone, Fulbari, Dinajpur, Bangladesh',
      batchId: batch1.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Nomini Export-Grade Biofloc Black Tiger Shrimp & Tilapia Fillets (500g)',
      description: 'Sustainably farmed in closed-loop biofloc aquaculture tanks. Antibiotic-free, zero chemical formalin, flash-frozen to -18°C for peak oceanic freshness and export purity.',
      priceUSD: 18.00,
      stockQty: 220,
      imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80',
      category: 'Seafood & Aquaculture',
      sku: 'NOM-AQUA-SHRIMP-500G',
      originFarm: 'Nomini Biofloc Hatcheries, Rangpur, Bangladesh',
      batchId: batch2.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Nomini Cold-Pressed Virgin Mustard & Moringa Botanical Extract (500ml)',
      description: 'Single-pass cold-pressed virgin mustard oil infused with antioxidant-rich moringa leaf extract. Retains natural allyl isothiocyanates, vitamins, and zero synthetic solvents.',
      priceUSD: 14.50,
      stockQty: 280,
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      category: 'Gourmet Oils & Botanicals',
      sku: 'NOM-OIL-MUST-500ML',
      originFarm: 'Nomini Processing Mill #2, Dinajpur, Bangladesh',
      batchId: batch3.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Nomini Organic Bio-Fertilizer & Soil-Enriched Compost (10kg Bag)',
      description: '100% organic bio-fertilizer produced from recycled livestock manure and biogas digestate. Enriched with natural NPK, humic acid, and soil-rebuilding beneficial microbes.',
      priceUSD: 22.00,
      stockQty: 500,
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
      category: 'Renewable Bio-Energy & Soil',
      sku: 'NOM-BIO-FERT-10KG',
      originFarm: 'Nomini Green Tech Division, Fulbari, Bangladesh',
      batchId: batch4.id,
    },
  });

  console.log('✅ Created physical products matching Nomini portfolio');

  // 5. Create Crowdfarming Projects directly from the PDF Financial Plan ($800,000 Model)
  const project1 = await prisma.crowdfarmProject.create({
    data: {
      title: 'Nomini Fulbari Integrated Agro-Industrial Park & Solar Greenhouse ($800,000 Project)',
      description: 'Establish a commercial 500-hectare precision agriculture and solar greenhouse complex in Fulbari, Dinajpur. Funds land preparation ($500k), modern farm machinery ($100k), high-yield seeds ($50k), and working capital ($50k). Projected 3-year sales reach $1.15M with $700k total operating profit.',
      location: 'Fulbari, Dinajpur, Rangpur Division, Bangladesh',
      targetAmount: 800000,
      raisedAmount: 325000,
      sharePrice: 50.00,
      totalShares: 16000,
      availableShares: 9500,
      expectedRoi: '20.5% Projected Annual Dividend + Land Equity Growth',
      harvestCycle: 'Continuous Multi-Crop Cycles (Grains, Spices & Horticulture)',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    },
  });

  const project2 = await prisma.crowdfarmProject.create({
    data: {
      title: 'Nomini High-Tech Biofloc Hatchery & RAS Aquaculture Expansion',
      description: 'Scale our commercial Biofloc and Recirculating Aquaculture Systems (RAS) producing 2,500 metric tons of export-grade Black Tiger Shrimp, Tilapia, and Carp fingerlings with US FDA & EU compliance.',
      location: 'Rangpur Agro-Aquaculture Basin, Bangladesh',
      targetAmount: 350000,
      raisedAmount: 180000,
      sharePrice: 100.00,
      totalShares: 3500,
      availableShares: 1700,
      expectedRoi: '24.0% Biannual Export Harvest Dividends',
      harvestCycle: 'Biannual Harvest Cycles (April & October)',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    },
  });

  const project3 = await prisma.crowdfarmProject.create({
    data: {
      title: 'Nomini 15 MW Agro-Solar Grid & 25,000 MT Bio-Fertilizer Division',
      description: 'Phase 1 flagship green energy infrastructure: Converting agricultural and cattle waste into 25,000 MT/year certified organic bio-fertilizers and generating clean solar power for national grid injection.',
      location: 'Fulbari Green Energy Corridor, Dinajpur',
      targetAmount: 500000,
      raisedAmount: 260000,
      sharePrice: 25.00,
      totalShares: 20000,
      availableShares: 9600,
      expectedRoi: '18.0% Clean Energy Return + Carbon Credit Dividends',
      harvestCycle: 'Quarterly Continuous Dividends',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    },
  });

  // Seed initial investment for Elena Rostova
  await prisma.investment.create({
    data: {
      userId: investor.id,
      projectId: project1.id,
      sharesBooked: 100,
      totalPaidUSD: 5000.00,
      certificateUrl: 'https://nominigroup.com/certificates/NOM-CERT-2026-WARES88.pdf',
      status: 'ISSUED',
    },
  });

  console.log('✅ Created crowdfarming projects from $800k financial model');

  // 6. Create Operations Tasks based on PDF Operations Strategy across TODO, IN_PROGRESS, IN_REVIEW, COMPLETED
  const tasks = [
    {
      title: 'Deploy 24 IoT Soil Hygrometers across Fulbari Plot Alpha-1',
      description: 'Calibrate precision LoRaWAN soil moisture probes to automate solar-powered drip irrigation for the upcoming grain season.',
      status: TaskStatus.TODO,
      priority: 'HIGH',
      assignedTo: opsLead.id,
      assignedBy: ceo.id,
      dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
    },
    {
      title: 'Audit 25,000 MT Organic Bio-Fertilizer Composting Digesters',
      description: 'Inspect anaerobic biogas digestion temperature and microbial breakdown efficiency at the Green Tech facility.',
      status: TaskStatus.TODO,
      priority: 'MEDIUM',
      assignedTo: deptHead.id,
      assignedBy: coo.id,
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    },
    {
      title: 'Conduct Contract Farmer Training on Climate-Smart Drip Irrigation',
      description: 'Host workshop for 150 local farming families in Dinajpur on organic bio-pest control and water conservation techniques.',
      status: TaskStatus.IN_PROGRESS,
      priority: 'HIGH',
      assignedTo: hrSourcing.id,
      assignedBy: ceo.id,
      dueDate: new Date(Date.now() + 1 * 24 * 3600 * 1000),
    },
    {
      title: 'Optimize Automated Milking Parlor & Cattle Diet Rations',
      description: 'Adjust Total Mixed Ration (TMR) fodder mix and check automated milking sensors on Holstein Friesian dairy herd.',
      status: TaskStatus.IN_PROGRESS,
      priority: 'URGENT',
      assignedTo: opsLead.id,
      assignedBy: ceo.id,
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    },
    {
      title: 'Verify EU & US FDA Export Seafood HACCP Assay for Biofloc Shrimp',
      description: 'Review spectrophotometer residue results to ensure 0.00 ppm chemical antibiotics before export shipment packaging.',
      status: TaskStatus.IN_REVIEW,
      priority: 'HIGH',
      assignedTo: deptHead.id,
      assignedBy: coo.id,
      dueDate: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
    {
      title: 'Synchronize 15 MW Agro-Solar Inverter Grid on Greenhouse Roofs',
      description: 'Completed MPPT calibration on 120kW rooftop solar arrays powering the recirculating aquaculture tanks.',
      status: TaskStatus.COMPLETED,
      priority: 'MEDIUM',
      assignedTo: deptHead.id,
      assignedBy: ceo.id,
      dueDate: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
    {
      title: 'Dispatch Batch #NOM-2026-001 Export Consignment to Rotterdam Depot',
      description: 'Sealed export pallets with tamper-evident NFC tags and registered DPP provenance on Nomini Group chain.',
      status: TaskStatus.COMPLETED,
      priority: 'URGENT',
      assignedTo: hrSourcing.id,
      assignedBy: ceo.id,
      dueDate: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log('✅ Created real-world operations tasks across all status columns');
  console.log('🚀 Nomini Group database re-seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
