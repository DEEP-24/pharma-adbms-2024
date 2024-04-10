import { CreateMedicationModal } from '~/routes/resources+/create-medication'
import { EditDoctorModal } from '~/routes/resources+/edit-doctor'
import { EditMedicationModal } from '~/routes/resources+/edit-medication'
import { EditPatientModal } from '~/routes/resources+/edit-patient'
import { EditPharmacistModal } from '~/routes/resources+/edit-pharmacist'
import EasyModal, {
  type EasyModalHOC,
  type InnerModalProps,
  type ModalProps,
} from '~/utils/modal-manager'

export type BaseModalProps<T = never> = {
  afterClose?: () => void
  afterOpen?: () => void
  onClose?: () => void
} & InnerModalProps<T>

type InferProps<T> =
  T extends EasyModalHOC<infer P, infer V> ? ModalProps<P, V> : never

export const MODAL = {
  createMedication: 'create-medication',
  createPatient: 'create-patient',
  createUser: 'create-user',
  editDoctor: 'edit-doctor',
  editPharmacist: 'edit-pharmacist',
  editMedication: 'edit-medication',
  editPatient: 'edit-patient',
  editUser: 'edit-user',
} as const

const modalMapper = {
  [MODAL.createMedication]: CreateMedicationModal,
  // [MODAL.createPatient]: CreatePatientModal,
  //   [MODAL.createUser]: CreateUserModal,
  [MODAL.editMedication]: EditMedicationModal,
  [MODAL.editPatient]: EditPatientModal,
  [MODAL.editDoctor]: EditDoctorModal,
  [MODAL.editPharmacist]: EditPharmacistModal,
  // [MODAL.editUser]: EditUserModal,
} as const

interface ModalPropMappings {
  [MODAL.createMedication]: InferProps<typeof CreateMedicationModal>
  // [MODAL.createPatient]: InferProps<typeof CreatePatientModal>
  //   [MODAL.createUser]: InferProps<typeof CreateUserModal>
  [MODAL.editMedication]: InferProps<typeof EditMedicationModal>
  [MODAL.editPatient]: InferProps<typeof EditPatientModal>
  //   [MODAL.editUser]: InferProps<typeof EditUserModal>
  [MODAL.editDoctor]: InferProps<typeof EditDoctorModal>
  [MODAL.editPharmacist]: InferProps<typeof EditPharmacistModal>
}

type RequiredPropsModals = {
  //   [MODAL.createAppointment]: ModalPropMappings['create-appointment']
  //   [MODAL.createUser]: ModalPropMappings['create-user']
  //   [MODAL.editAppointment]: ModalPropMappings['edit-appointment']
  //   [MODAL.editLab]: ModalPropMappings['edit-lab']
  [MODAL.editMedication]: ModalPropMappings['edit-medication']
  [MODAL.editPatient]: ModalPropMappings['edit-patient']
  [MODAL.editDoctor]: ModalPropMappings['edit-doctor']
  [MODAL.editPharmacist]: ModalPropMappings['edit-pharmacist']
  //   [MODAL.editUser]: ModalPropMappings['edit-user']
}

type OptionalPropsModals = {
  [MODAL.createMedication]: ModalPropMappings['create-medication']
  // [MODAL.createPatient]: ModalPropMappings['create-patient']
}

export function openModal<M extends keyof RequiredPropsModals>(
  id: M,
  props: RequiredPropsModals[M],
): void

export function openModal<M extends keyof OptionalPropsModals>(
  id: M,
  props?: OptionalPropsModals[M],
): void

// TODO: Fix this later
export function openModal<M extends keyof ModalPropMappings>(
  id: M,
  props: ModalPropMappings[M] = {} as ModalPropMappings[M],
): void {
  const Comp = modalMapper[id]

  EasyModal.show(Comp as any, props)
}
