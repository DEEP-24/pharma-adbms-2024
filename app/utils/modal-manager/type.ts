import { type FunctionComponent } from 'react'

import { type EASY_MODAL_ID } from './share'

type Id = number | string

type ModalPromise<V> = {
  reject: (reason: any) => void
  resolve: GenerateTypeInfer<V>
}

type ItemConfig = {
  /**
   * @name only custom item's id
   */
  id?: Id
  /**
   * Whether to default to resolve when the hide method is called
   * @name defaultValue = true
   */
  resolveOnHide?: boolean
}

type EasyModalItem<P = any, V = any> = {
  config: ItemConfig
  id: Id
  promise: ModalPromise<V>
  props: P
  visible: boolean
}

type innerDispatch = <P, V>(action: EasyModalAction<P, V>) => void

type ActionPayload<P, V> = {
  config?: ItemConfig
  id: Id
  promise?: ModalPromise<V>
  props?: P
  visible?: boolean
}

type EasyModalAction<P = any, V = any> =
  | { payload: ActionPayload<P, V>; type: 'easy_modal/hide' }
  | { payload: ActionPayload<P, V>; type: 'easy_modal/remove' }
  | { payload: ActionPayload<P, V>; type: 'easy_modal/show' }
  | { payload: ActionPayload<P, V>; type: 'easy_modal/update' }

type NoVoidValue<T> = T extends void ? never : T /* if else */
// type Get Generics Type
type GenerateTypeInfer<V> =
  NoVoidValue<V> extends never
    ? () => void
    : (result: V | null /* hack */) => void

type InnerModalProps<V = never> = {
  config?: ItemConfig
  hide: GenerateTypeInfer<V>
  id: Id
  reject: (reason: any) => void
  remove: () => void
  resolve: GenerateTypeInfer<V>
  visible: boolean
}

// Modal Base
interface EasyModal<P, V> {
  (props: P & InnerModalProps<V>): JSX.Element
}

// Modal HOC Interface
interface EasyModalHOC<P = unknown, V = unknown>
  extends EasyModal<P, V>,
    Omit<FunctionComponent<P>, ''> {
  __easy_modal_is_single__?: boolean
  __typeof_easy_modal__?: symbol
  [EASY_MODAL_ID]?: Id
}

// Props Injected By Users
type ModalProps<P, V> = Omit<P, keyof InnerModalProps<V>>

type ModalResolveType<V> =
  NoVoidValue<V> extends never
    ? never
    : V extends InnerModalProps<infer Result>
      ? Result
      : never

export type {
  EasyModalAction,
  EasyModalHOC,
  EasyModalItem,
  GenerateTypeInfer,
  Id,
  InnerModalProps,
  ModalPromise,
  ModalProps,
  ModalResolveType,
  innerDispatch,
}
