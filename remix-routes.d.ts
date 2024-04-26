declare module "remix-routes" {
  type URLSearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams;
  // symbol won't be a key of SearchParams
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  
    type ExportedQuery<T> = IsSearchParams<T> extends true ? T : URLSearchParamsInit;
  

  export interface Routes {
  
    "": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/_index').SearchParams>,
    };
  
    "/": {
      params: {
      
      },
      query: ExportedQuery<import('app/root').SearchParams>,
    };
  
    "/admin": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/_index').SearchParams>,
    };
  
    "/admin/doctors": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/doctors').SearchParams>,
    };
  
    "/admin/medications": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/medications').SearchParams>,
    };
  
    "/admin/patients": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/_index').SearchParams>,
    };
  
    "/admin/patients/:patientId": {
      params: {
      
        patientId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/$patientId+/_index').SearchParams>,
    };
  
    "/admin/patients/:patientId/:appointmentId": {
      params: {
      
        patientId: string | number;
      
        appointmentId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/$patientId+/$appointmentId+/_index').SearchParams>,
    };
  
    "/admin/patients/:patientId/:appointmentId/prescription": {
      params: {
      
        patientId: string | number;
      
        appointmentId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/$patientId+/$appointmentId+/prescription').SearchParams>,
    };
  
    "/admin/patients/:patientId/:appointmentId/questionnaire": {
      params: {
      
        patientId: string | number;
      
        appointmentId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/$patientId+/$appointmentId+/questionnaire').SearchParams>,
    };
  
    "/admin/patients/:patientId/appointments": {
      params: {
      
        patientId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/admin+/patients+/$patientId+/appointments').SearchParams>,
    };
  
    "/admin/pharmacists": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/pharmacists').SearchParams>,
    };
  
    "/admin/settings": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/admin+/settings').SearchParams>,
    };
  
    "/doctor": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/doctor+/_index').SearchParams>,
    };
  
    "/doctor/patients": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/doctor+/patients+/_index').SearchParams>,
    };
  
    "/doctor/patients/:patientId": {
      params: {
      
        patientId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/doctor+/patients+/$patientId+/_index').SearchParams>,
    };
  
    "/doctor/patients/:patientId/:prescriptionId": {
      params: {
      
        patientId: string | number;
      
        prescriptionId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/doctor+/patients+/$patientId+/$prescriptionId+/index').SearchParams>,
    };
  
    "/doctor/patients/:patientId/create-prescription": {
      params: {
      
        patientId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/doctor+/patients+/$patientId+/create-prescription').SearchParams>,
    };
  
    "/doctor/patients/:patientId/prescriptions": {
      params: {
      
        patientId: string | number;
      
      },
      query: ExportedQuery<import('app/routes/doctor+/patients+/$patientId+/prescriptions').SearchParams>,
    };
  
    "/doctor/settings": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/doctor+/settings').SearchParams>,
    };
  
    "/login": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/_auth+/login').SearchParams>,
    };
  
    "/logout": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/_auth+/logout').SearchParams>,
    };
  
    "/patient": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/patient+/_index').SearchParams>,
    };
  
    "/patient/medications": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/patient+/medications').SearchParams>,
    };
  
    "/patient/settings": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/patient+/settings').SearchParams>,
    };
  
    "/pharmacist": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/pharmacist+/_index').SearchParams>,
    };
  
    "/pharmacist/medications": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/pharmacist+/medications').SearchParams>,
    };
  
    "/pharmacist/settings": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/pharmacist+/settings').SearchParams>,
    };
  
    "/register": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/_auth+/register').SearchParams>,
    };
  
    "/resources/create-medication": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/create-medication').SearchParams>,
    };
  
    "/resources/create-user": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/create-user').SearchParams>,
    };
  
    "/resources/edit-doctor": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/edit-doctor').SearchParams>,
    };
  
    "/resources/edit-medication": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/edit-medication').SearchParams>,
    };
  
    "/resources/edit-patient": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/edit-patient').SearchParams>,
    };
  
    "/resources/edit-pharmacist": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/edit-pharmacist').SearchParams>,
    };
  
    "/resources/edit-user": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/edit-user').SearchParams>,
    };
  
    "/resources/search-medication": {
      params: {
      
      },
      query: ExportedQuery<import('app/routes/resources+/search-medication').SearchParams>,
    };
  
  }

  type RoutesWithParams = Pick<
    Routes,
    {
      [K in keyof Routes]: Routes[K]["params"] extends Record<string, never> ? never : K
    }[keyof Routes]
  >;

  export type RouteId =
    | 'root'
    | 'routes/_auth+/_layout'
    | 'routes/_auth+/login'
    | 'routes/_auth+/logout'
    | 'routes/_auth+/register'
    | 'routes/_index'
    | 'routes/admin+/_index'
    | 'routes/admin+/_layout'
    | 'routes/admin+/doctors'
    | 'routes/admin+/medications'
    | 'routes/admin+/patients+/_index'
    | 'routes/admin+/patients+/$patientId+/_index'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/_index'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/_layout'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/prescription'
    | 'routes/admin+/patients+/$patientId+/$appointmentId+/questionnaire'
    | 'routes/admin+/patients+/$patientId+/appointments'
    | 'routes/admin+/pharmacists'
    | 'routes/admin+/settings'
    | 'routes/doctor+/_index'
    | 'routes/doctor+/_layout'
    | 'routes/doctor+/patients+/_index'
    | 'routes/doctor+/patients+/$patientId+/_index'
    | 'routes/doctor+/patients+/$patientId+/_layout'
    | 'routes/doctor+/patients+/$patientId+/$prescriptionId+/_layout'
    | 'routes/doctor+/patients+/$patientId+/$prescriptionId+/index'
    | 'routes/doctor+/patients+/$patientId+/create-prescription'
    | 'routes/doctor+/patients+/$patientId+/prescriptions'
    | 'routes/doctor+/settings'
    | 'routes/patient+/_index'
    | 'routes/patient+/_layout'
    | 'routes/patient+/medications'
    | 'routes/patient+/settings'
    | 'routes/pharmacist+/_index'
    | 'routes/pharmacist+/_layout'
    | 'routes/pharmacist+/medications'
    | 'routes/pharmacist+/settings'
    | 'routes/resources+/create-medication'
    | 'routes/resources+/create-user'
    | 'routes/resources+/edit-doctor'
    | 'routes/resources+/edit-medication'
    | 'routes/resources+/edit-patient'
    | 'routes/resources+/edit-pharmacist'
    | 'routes/resources+/edit-user'
    | 'routes/resources+/search-medication';

  export function $path<
    Route extends keyof Routes,
    Rest extends {
      params: Routes[Route]["params"];
      query?: Routes[Route]["query"];
    }
  >(
    ...args: Rest["params"] extends Record<string, never>
      ? [route: Route, query?: Rest["query"]]
      : [route: Route, params: Rest["params"], query?: Rest["query"]]
  ): string;

  export function $params<
    Route extends keyof RoutesWithParams,
    Params extends RoutesWithParams[Route]["params"]
  >(
      route: Route,
      params: { readonly [key: string]: string | undefined }
  ): {[K in keyof Params]: string};

  export function $routeId(routeId: RouteId): RouteId;
}