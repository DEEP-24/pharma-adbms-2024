import { PrismaClient } from '@prisma/client'
import { createPasswordHash } from '~/utils/misc.server'
import {
  DoctorQualification,
  DoctorSpecialization,
  Gender,
  MedicationType,
  MedicationUnit,
} from '~/utils/prisma-enums'

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
      firstName: 'Admin',
      lastName: 'User',
      address: '123 Admin St, Apt 1, Admin City, AD, 12345',
      phone: '1234567890',
      dob: new Date('1980-01-01'),
      gender: Gender.MALE,
      age: 40,
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
      firstName: 'Doctor',
      lastName: 'User',
      address: '123 Doctor St, Apt 1, Doctor City, DC, 12345',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1980-01-01'),
      phone: '1234567890',
      age: 45,
      specialization: DoctorSpecialization.CARDIOLOGIST,
      qualification: DoctorQualification.MD,
    },
  })
  console.timeEnd(`👤 Created doctors...`)
}

async function createPatients() {
  console.time(`👤 Created patients...`)
  await db.patient.create({
    data: {
      email: 'patient@app.com',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Patient St, Apt 1, Patient City, PC, 12345',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1990-01-01'),
      phone: '1234567890',
      age: 30,
      height: 145,
      weight: 70,
    },
  })
  console.timeEnd(`👤 Created patients...`)
}

async function createPharmacists() {
  console.time(`👤 Created pharmacists...`)
  await db.pharmacist.create({
    data: {
      email: 'pharmacist@app.com',
      firstName: 'Aden',
      lastName: 'Smith',
      address: '123 Pharmacist St, Apt 1, Pharmacist City, PC, 12345',
      password: await createPasswordHash('password'),
      gender: Gender.MALE,
      dob: new Date('1985-01-01'),
      phone: '1234567890',
      age: 35,
    },
  })
  console.timeEnd(`👤 Created pharmacists...`)
}

async function createMedications() {
  console.time(`💊 Created medications...`)
  await db.medication.createMany({
    data: [
      {
        brand: 'Lipitor',
        dosage: '20',
        name: 'Atorvastatin',
        quantity: 30,
        price: 45,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: true,
      },
      {
        brand: 'Amoxil',
        dosage: '500',
        name: 'Amoxicillin',
        quantity: 30,
        price: 25,
        unit: MedicationUnit.MG,
        type: MedicationType.CAPSULE,
        prescriptionRequired: true,
      },
      {
        brand: 'Crestor',
        dosage: '10',
        name: 'Rosuvastatin',
        quantity: 30,
        price: 50,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: true,
      },
      {
        brand: 'Synthroid',
        dosage: '100',
        name: 'Levothyroxine',
        quantity: 90,
        price: 20,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: true,
      },
      {
        brand: 'Prozac',
        dosage: '20',
        name: 'Fluoxetine',
        quantity: 30,
        price: 40,
        unit: MedicationUnit.MG,
        type: MedicationType.CAPSULE,
        prescriptionRequired: true,
      },
      {
        brand: 'Norvasc',
        dosage: '5',
        name: 'Amlodipine',
        quantity: 30,
        price: 35,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: true,
      },
      {
        brand: 'Prilosec',
        dosage: '20',
        name: 'Omeprazole',
        quantity: 30,
        price: 22,
        unit: MedicationUnit.MG,
        type: MedicationType.CAPSULE,
        prescriptionRequired: true,
      },
      {
        brand: 'Zithromax',
        dosage: '250',
        name: 'Azithromycin',
        quantity: 6,
        price: 18,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: true,
      },
      {
        brand: 'Advil',
        dosage: '200',
        name: 'Ibuprofen',
        quantity: 50,
        price: 10,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: false,
      },
      {
        brand: 'Tylenol',
        dosage: '500',
        name: 'Acetaminophen',
        quantity: 100,
        price: 12,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: false,
      },
      {
        brand: 'Nexium',
        dosage: '40',
        name: 'Esomeprazole',
        quantity: 30,
        price: 28,
        unit: MedicationUnit.MG,
        type: MedicationType.CAPSULE,
        prescriptionRequired: true,
      },
      {
        brand: 'Allegra',
        dosage: '180',
        name: 'Fexofenadine',
        quantity: 30,
        price: 18,
        unit: MedicationUnit.MG,
        type: MedicationType.TABLET,
        prescriptionRequired: false,
      },
      {
        brand: 'Cough Syrup',
        dosage: '10',
        name: 'Dextromethorphan',
        quantity: 150,
        price: 15,
        unit: MedicationUnit.ML,
        type: MedicationType.SYRUP,
        prescriptionRequired: false,
      },
      {
        brand: 'Benadryl',
        dosage: '25',
        name: 'Diphenhydramine',
        quantity: 30,
        price: 7,
        unit: MedicationUnit.MG,
        type: MedicationType.CAPSULE,
        prescriptionRequired: false,
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
