import { Gender, PrismaClient } from '@prisma/client'
import { createPasswordHash } from '~/utils/misc.server'
import { MedicationUnit } from '~/utils/prisma-enums'

const db = new PrismaClient()

async function cleanup() {
  console.time('🧹 Cleaned up the database...')
  await db.medicationOrder.deleteMany()
  await db.payment.deleteMany()
  await db.order.deleteMany()
  await db.prescribedMedication.deleteMany()
  await db.prescription.deleteMany()
  await db.patient.deleteMany()
  await db.doctor.deleteMany()
  await db.pharmacist.deleteMany()
  await db.admin.deleteMany()
  await db.medication.deleteMany()
  console.timeEnd('🧹 Cleaned up the database...')
}

async function createAdmins() {
  console.time(`👤 Created admins...`)
  await db.admin.create({
    data: {
      email: 'admin@app.com',
      name: 'Admin User',
      password: await createPasswordHash('password'),
    },
  })
  console.timeEnd(`👤 Created admins...`)
}

async function createDoctors() {
  console.time(`👤 Created doctors...`)
  await db.doctor.create({
    data: {
      email: 'doctor@app.com',
      name: 'Doctor User',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1980-01-01'),
      phone: '1234567890',
    },
  })
  console.timeEnd(`👤 Created doctors...`)
}

async function createPatients() {
  console.time(`👤 Created patients...`)
  await db.patient.create({
    data: {
      email: 'patient@app.com',
      name: 'John Doe',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1990-01-01'),
      phone: '1234567890',
    },
  })
  console.timeEnd(`👤 Created patients...`)
}

async function createPharmacists() {
  console.time(`👤 Created pharmacists...`)
  await db.pharmacist.create({
    data: {
      email: 'pharmacist@app.com',
      name: 'Aden Walker',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1985-01-01'),
      phone: '1234567890',
    },
  })
  console.timeEnd(`👤 Created pharmacists...`)
}

async function createMedications() {
  console.time(`💊 Created medications...`)
  await db.medication.createMany({
    data: [
      {
        brand: 'Glucophage',
        dosage: '500',
        name: 'Metformin',
        quantity: 60,
        price: 60,
        unit: MedicationUnit.MG,
        prescriptionRequired: false,
      },
      {
        brand: 'Dolo',
        dosage: '500',
        name: 'Dolo 500',
        quantity: 60,
        price: 40,
        unit: MedicationUnit.MG,
        prescriptionRequired: true,
      },
      {
        brand: 'Dolo',
        dosage: '650',
        name: 'Dolo 650 EX',
        quantity: 30,
        price: 12,
        unit: MedicationUnit.MG,
        prescriptionRequired: false,
      },
      {
        brand: 'Dolo',
        dosage: '250',
        name: 'Dolo Liquid',
        quantity: 100,
        price: 20,
        unit: MedicationUnit.ML,
        prescriptionRequired: true,
      },
      {
        brand: 'Saradon',
        dosage: '500',
        name: 'Saradon',
        quantity: 60,
        price: 50,
        unit: MedicationUnit.MG,
        prescriptionRequired: false,
      },
      {
        brand: 'Lipitor',
        dosage: '20',
        name: 'Atorvastatin',
        quantity: 30,
        price: 45,
        unit: 'MG',
        prescriptionRequired: true,
      },
      {
        brand: 'Ventolin',
        dosage: '100',
        name: 'Salbutamol',
        quantity: 200,
        price: 30,
        unit: 'MCG',
        prescriptionRequired: false,
      },
      {
        brand: 'Amoxil',
        dosage: '500',
        name: 'Amoxicillin',
        quantity: 30,
        price: 25,
        unit: 'MG',
        prescriptionRequired: true,
      },
      {
        brand: 'Zyrtec',
        dosage: '10',
        name: 'Cetirizine',
        quantity: 30,
        price: 18,
        unit: 'MG',
        prescriptionRequired: false,
      },
      {
        brand: 'Norvasc',
        dosage: '5',
        name: 'Amlodipine',
        quantity: 30,
        price: 35,
        unit: 'MG',
        prescriptionRequired: true,
      },
      {
        brand: 'Tylenol',
        dosage: '500',
        name: 'Acetaminophen',
        quantity: 100,
        price: 10,
        unit: 'MG',
        prescriptionRequired: false,
      },
      {
        brand: 'Prilosec',
        dosage: '20',
        name: 'Omeprazole',
        quantity: 30,
        price: 28,
        unit: 'MG',
        prescriptionRequired: true,
      },
      {
        brand: 'Lasix',
        dosage: '40',
        name: 'Furosemide',
        quantity: 30,
        price: 15,
        unit: 'MG',
        prescriptionRequired: true,
      },
      {
        brand: 'Allegra',
        dosage: '180',
        name: 'Fexofenadine',
        quantity: 30,
        price: 22,
        unit: 'MG',
        prescriptionRequired: false,
      },
      {
        brand: 'Advil',
        dosage: '200',
        name: 'Ibuprofen',
        quantity: 50,
        price: 12,
        unit: 'MG',
        prescriptionRequired: false,
      },
      {
        brand: 'Synthroid',
        dosage: '100',
        name: 'Levothyroxine',
        quantity: 30,
        price: 20,
        unit: 'MCG',
        prescriptionRequired: true,
      },
      {
        brand: 'Crestor',
        dosage: '10',
        name: 'Rosuvastatin',
        quantity: 30,
        price: 60,
        unit: 'MG',
        prescriptionRequired: true,
      },
    ],
  })
  console.timeEnd(`💊 Created medications...`)
}

async function seed() {
  console.log('🌱 Seeding...\n')

  await cleanup()

  console.time(`🌱 Database has been seeded`)

  await Promise.all([
    createAdmins(),
    createDoctors(),
    createPatients(),
    createPharmacists(),
    createMedications(),
  ])

  console.timeEnd(`🌱 Database has been seeded`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
