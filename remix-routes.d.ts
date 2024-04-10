declare module 'remix-routes' {
  type URLSearchParamsInit =
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
  // symbol won't be a key of SearchParams
  type IsSearchParams<T> = symbol extends keyof T ? false : true

  type ExportedQuery<T> =
    IsSearchParams<T> extends true ? T : URLSearchParamsInit

  export interface Routes {
    '': {
      params: {}
      query: ExportedQuery<import('app/routes/_index').SearchParams>
    }

    '/': {
      params: {}
      query: ExportedQuery<import('app/root').SearchParams>
    }

    '/admin': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/_index').SearchParams>
    }

    '/admin/analytics': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/analytics').SearchParams>
    }

    '/admin/labs': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/labs').SearchParams>
    }

    '/admin/medications': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/medications').SearchParams>
    }

    '/admin/patients': {
      params: {}
      query: ExportedQuery<
        import('app/routes/admin+/patients+/_index').SearchParams
      >
    }

    '/admin/patients/:patientId': {
      params: {
        patientId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/_index').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/_index').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId/labs': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/labs').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId/notes': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/notes').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId/overview': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/overview').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId/prescription': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/prescription').SearchParams
      >
    }

    '/admin/patients/:patientId/:appointmentId/questionnaire': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/$appointmentId+/questionnaire').SearchParams
      >
    }

    '/admin/patients/:patientId/activity': {
      params: {
        patientId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/activity').SearchParams
      >
    }

    '/admin/patients/:patientId/appointments': {
      params: {
        patientId: string | number
      }
      query: ExportedQuery<
        import('app/routes/admin+/patients+/$patientId+/appointments').SearchParams
      >
    }

    '/admin/settings': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/settings').SearchParams>
    }

    '/admin/doctors': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/doctors').SearchParams>
    }

    '/admin/pharmacists': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/pharmacists').SearchParams>
    }

    '/admin/patients': {
      params: {}
      query: ExportedQuery<import('app/routes/admin+/patients').SearchParams>
    }

    '/doctor': {
      params: {}
      query: ExportedQuery<import('app/routes/doctor+/_index').SearchParams>
    }

    '/doctor/appointments': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/_index').SearchParams
      >
    }

    '/doctor/appointments/:patientId': {
      params: {
        patientId: string | number
      }
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/$patientId+/_index').SearchParams
      >
    }

    '/doctor/appointments/:patientId/:appointmentId': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/$patientId+/$appointmentId+/_index').SearchParams
      >
    }

    '/doctor/appointments/:patientId/:appointmentId/labs': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/$patientId+/$appointmentId+/labs').SearchParams
      >
    }

    '/doctor/appointments/:patientId/:appointmentId/notes': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/$patientId+/$appointmentId+/notes').SearchParams
      >
    }

    '/doctor/appointments/:patientId/:appointmentId/prescription': {
      params: {
        patientId: string | number

        appointmentId: string | number
      }
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/$patientId+/$appointmentId+/prescription').SearchParams
      >
    }

    '/doctor/appointments/previous': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/doctor/patients': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/doctor/settings': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/patient': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/patient/medications': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/patient/settings': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/pharmacist': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/pharmacist/medications': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/pharmacist/orders': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/pharmacist/settings': {
      params: {}
      query: ExportedQuery<
        import('app/routes/doctor+/appointments+/previous').SearchParams
      >
    }

    '/login': {
      params: {}
      query: ExportedQuery<import('app/routes/_auth+/login').SearchParams>
    }

    '/logout': {
      params: {}
      query: ExportedQuery<import('app/routes/_auth+/logout').SearchParams>
    }

    '/resources/create-appointment': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/create-appointment').SearchParams
      >
    }

    '/resources/create-lab': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/create-lab').SearchParams
      >
    }

    '/resources/create-medication': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/create-medication').SearchParams
      >
    }

    '/resources/create-patient': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/create-patient').SearchParams
      >
    }

    '/resources/create-user': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/create-user').SearchParams
      >
    }

    '/resources/edit-appointment': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/edit-appointment').SearchParams
      >
    }

    '/resources/edit-lab': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/edit-lab').SearchParams
      >
    }

    '/resources/edit-medication': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/edit-medication').SearchParams
      >
    }

    '/resources/edit-patient': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/edit-patient').SearchParams
      >
    }

    '/resources/edit-user': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/edit-user').SearchParams
      >
    }

    '/resources/generate-notes': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/generate-notes').SearchParams
      >
    }

    '/resources/generate-questions': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/generate-questions').SearchParams
      >
    }

    '/resources/healthcheck': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/healthcheck').SearchParams
      >
    }

    '/resources/search-medication': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/search-medication').SearchParams
      >
    }

    '/resources/set-theme': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/set-theme').SearchParams
      >
    }

    '/resources/subscribe/notification': {
      params: {}
      query: ExportedQuery<
        import('app/routes/resources+/subscribe+/notification').SearchParams
      >
    }

    '/settings': {
      params: {}
      query: ExportedQuery<import('app/routes/settings+/_index').SearchParams>
    }

    '/settings/appearance': {
      params: {}
      query: ExportedQuery<
        import('app/routes/settings+/appearance').SearchParams
      >
    }

    '/settings/security': {
      params: {}
      query: ExportedQuery<import('app/routes/settings+/security').SearchParams>
    }

    '/superstockist': {
      params: {}
      query: ExportedQuery<
        import('app/routes/superstockist+/_index').SearchParams
      >
    }

    '/superstockist/medications': {
      params: {}
      query: ExportedQuery<
        import('app/routes/superstockist+/medications').SearchParams
      >
    }
  }

  type RoutesWithParams = Pick<
    Routes,
    {
      [K in keyof Routes]: Routes[K]['params'] extends Record<string, never>
        ? never
        : K
    }[keyof Routes]
  >

  export type RouteId =
    | 'root'
    | 'routes/_auth+/_layout'
    | 'routes/_auth+/login'
    | 'routes/_auth+/logout'
    | 'routes/_index'
    | 'routes/admin+/_index'
    | 'routes/admin+/_layout'
    | 'routes/admin+/analytics'
    | 'routes/admin+/medications'
    | 'routes/admin+/patients+/_index'
    | 'routes/admin+/patients+/$patientId+/_index'
    | 'routes/admin+/patients+/$patientId+/_layout'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/_index'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/_layout'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/labs'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/notes'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/overview'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/prescription'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/questionnaire'
    | 'routes/admin+/patients+/$patientId+/activity'
    | 'routes/admin+/patients+/$patientId+/appointments'
    | 'routes/admin+/settings'
    | 'routes/admin+/doctors'
    | 'routes/admin+/pharmacists'
    | 'routes/admin+/patients'
    | 'routes/cp+/_index'
    | 'routes/cp+/_layout'
    | 'routes/cp+/analytics'
    | 'routes/cp+/medications'
    | 'routes/cp+/patients+/_index'
    | 'routes/cp+/patients+/$patientId+/_index'
    | 'routes/cp+/patients+/$patientId+/_layout'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/_index'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/_layout'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/labs'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/notes'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/overview'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/prescription'
    | 'routes/cp+/patients+/$patientId+/$appointmentId+/questionnaire'
    | 'routes/cp+/patients+/$patientId+/activity'
    | 'routes/cp+/patients+/$patientId+/appointments'
    | 'routes/doctor+/_index'
    | 'routes/doctor+/_layout'
    | 'routes/doctor+/appointments+/_index'
    | 'routes/doctor+/appointments+/$patientId+/_index'
    | 'routes/doctor+/appointments+/$patientId+/_layout'
    | 'routes/doctor+/appointments+/$patientId+/$appointmentId+/_index'
    | 'routes/doctor+/appointments+/$patientId+/$appointmentId+/_layout'
    | 'routes/doctor+/appointments+/$patientId+/$appointmentId+/labs'
    | 'routes/doctor+/appointments+/$patientId+/$appointmentId+/notes'
    | 'routes/doctor+/appointments+/$patientId+/$appointmentId+/prescription'
    | 'routes/doctor+/appointments+/previous'
    | 'routes/doctor+/patients'
    | 'routes/doctor+/settings'
    | 'routes/patient+/_layout'
    | 'routes/patient+/_index'
    | 'routes/patient+/medications'
    | 'routes/patient+/settings'
    | 'routes/pharmacist+/_layout'
    | 'routes/pharmacist+/_index'
    | 'routes/pharmacist+/medications'
    | 'routes/pharmacist+/orders'
    | 'routes/pharmacist+/settings'
    | 'routes/resources+/create-appointment'
    | 'routes/resources+/create-lab'
    | 'routes/resources+/create-medication'
    | 'routes/resources+/create-patient'
    | 'routes/resources+/create-user'
    | 'routes/resources+/edit-appointment'
    | 'routes/resources+/edit-lab'
    | 'routes/resources+/edit-medication'
    | 'routes/resources+/edit-patient'
    | 'routes/resources+/edit-user'
    | 'routes/resources+/generate-notes'
    | 'routes/resources+/generate-questions'
    | 'routes/resources+/healthcheck'
    | 'routes/resources+/search-medication'
    | 'routes/resources+/set-theme'
    | 'routes/resources+/subscribe+/notification'
    | 'routes/settings+/_index'
    | 'routes/settings+/_layout'
    | 'routes/settings+/appearance'
    | 'routes/settings+/security'
    | 'routes/superstockist+/_index'
    | 'routes/superstockist+/_layout'
    | 'routes/superstockist+/medications'

  export function $path<
    Route extends keyof Routes,
    Rest extends {
      params: Routes[Route]['params']
      query?: Routes[Route]['query']
    },
  >(
    ...args: Rest['params'] extends Record<string, never>
      ? [route: Route, query?: Rest['query']]
      : [route: Route, params: Rest['params'], query?: Rest['query']]
  ): string

  export function $params<
    Route extends keyof RoutesWithParams,
    Params extends RoutesWithParams[Route]['params'],
  >(
    route: Route,
    params: { readonly [key: string]: string | undefined },
  ): { [K in keyof Params]: string }

  export function $routeId(routeId: RouteId): RouteId
}
