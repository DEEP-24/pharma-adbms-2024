import { CreateAppointmentModal } from '~/routes/resources+/create-appointment'
import { CreateMedicationModal } from '~/routes/resources+/create-medication'
import { CreateUserModal } from '~/routes/resources+/create-user'
import { EditMedicationModal } from '~/routes/resources+/edit-medication'
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
  createUser: 'create-user',
  createAppointment: 'create-appointment',
  editPharmacist: 'edit-pharmacist',
  editMedication: 'edit-medication',
  editUser: 'edit-user',
} as const

const modalMapper = {
  [MODAL.createAppointment]: CreateAppointmentModal,
  [MODAL.createMedication]: CreateMedicationModal,
  [MODAL.editMedication]: EditMedicationModal,
  [MODAL.editPharmacist]: EditPharmacistModal,
  [MODAL.createUser]: CreateUserModal,
} as const

interface ModalPropMappings {
  [MODAL.createAppointment]: InferProps<typeof CreateAppointmentModal>
  [MODAL.createMedication]: InferProps<typeof CreateMedicationModal>
  [MODAL.editMedication]: InferProps<typeof EditMedicationModal>
  [MODAL.editPharmacist]: InferProps<typeof EditPharmacistModal>
  [MODAL.createUser]: InferProps<typeof CreateUserModal>
}

type RequiredPropsModals = {
  [MODAL.createAppointment]: ModalPropMappings['create-appointment']
  [MODAL.editMedication]: ModalPropMappings['edit-medication']
  [MODAL.editPharmacist]: ModalPropMappings['edit-pharmacist']
  [MODAL.createUser]: ModalPropMappings['create-user']
}

type OptionalPropsModals = {
  [MODAL.createMedication]: ModalPropMappings['create-medication']
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
