
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model app_status_history
 * 
 */
export type app_status_history = $Result.DefaultSelection<Prisma.$app_status_historyPayload>
/**
 * Model applications
 * 
 */
export type applications = $Result.DefaultSelection<Prisma.$applicationsPayload>
/**
 * Model dashboard_activity
 * 
 */
export type dashboard_activity = $Result.DefaultSelection<Prisma.$dashboard_activityPayload>
/**
 * Model events
 * 
 */
export type events = $Result.DefaultSelection<Prisma.$eventsPayload>
/**
 * Model jobs
 * 
 */
export type jobs = $Result.DefaultSelection<Prisma.$jobsPayload>
/**
 * Model partners
 * 
 */
export type partners = $Result.DefaultSelection<Prisma.$partnersPayload>
/**
 * Model resumes
 * 
 */
export type resumes = $Result.DefaultSelection<Prisma.$resumesPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ProgramType: {
  FOUNDATIONS: 'FOUNDATIONS',
  ONE_ZERO_ONE: 'ONE_ZERO_ONE',
  LIFTOFF: 'LIFTOFF',
  ALUMNI: 'ALUMNI'
};

export type ProgramType = (typeof ProgramType)[keyof typeof ProgramType]


export const JobType: {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  APPRENTICESHIP: 'APPRENTICESHIP',
  INTERNSHIP: 'INTERNSHIP'
};

export type JobType = (typeof JobType)[keyof typeof JobType]


export const JobTag: {
  FULLY_REMOTE: 'FULLY_REMOTE',
  HYBRID: 'HYBRID',
  IN_PERSON: 'IN_PERSON',
  FRONT_END: 'FRONT_END',
  BACK_END: 'BACK_END',
  FULL_STACK: 'FULL_STACK',
  NON_PROFIT: 'NON_PROFIT',
  START_UP: 'START_UP',
  EDUCATION: 'EDUCATION',
  HEALTHCARE: 'HEALTHCARE',
  FINTECH: 'FINTECH',
  MARKETING: 'MARKETING',
  DATA_SCIENCE: 'DATA_SCIENCE',
  CYBERSECURITY: 'CYBERSECURITY',
  UX_UI_DESIGN: 'UX_UI_DESIGN',
  IT: 'IT',
  PRODUCT_MANAGEMENT: 'PRODUCT_MANAGEMENT',
  GAME_DEVELOPMENT: 'GAME_DEVELOPMENT',
  AI_ML: 'AI_ML',
  CLOUD_COMPUTING: 'CLOUD_COMPUTING',
  DEVOPS: 'DEVOPS',
  BUSINESS_ANALYSIS: 'BUSINESS_ANALYSIS',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA'
};

export type JobTag = (typeof JobTag)[keyof typeof JobTag]


export const ApplicationStatus: {
  INTERESTED: 'INTERESTED',
  APPLIED: 'APPLIED',
  REJECTED: 'REJECTED',
  INTERVIEWING: 'INTERVIEWING',
  NEGOTIATING: 'NEGOTIATING',
  ACCEPTED: 'ACCEPTED'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]


export const AppHistoryStatus: {
  APPLIED: 'APPLIED',
  INTERVIEWING: 'INTERVIEWING',
  OFFERED: 'OFFERED',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED'
};

export type AppHistoryStatus = (typeof AppHistoryStatus)[keyof typeof AppHistoryStatus]

}

export type ProgramType = $Enums.ProgramType

export const ProgramType: typeof $Enums.ProgramType

export type JobType = $Enums.JobType

export const JobType: typeof $Enums.JobType

export type JobTag = $Enums.JobTag

export const JobTag: typeof $Enums.JobTag

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

export type AppHistoryStatus = $Enums.AppHistoryStatus

export const AppHistoryStatus: typeof $Enums.AppHistoryStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more App_status_histories
 * const app_status_histories = await prisma.app_status_history.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more App_status_histories
   * const app_status_histories = await prisma.app_status_history.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.app_status_history`: Exposes CRUD operations for the **app_status_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more App_status_histories
    * const app_status_histories = await prisma.app_status_history.findMany()
    * ```
    */
  get app_status_history(): Prisma.app_status_historyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.applications`: Exposes CRUD operations for the **applications** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.applications.findMany()
    * ```
    */
  get applications(): Prisma.applicationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dashboard_activity`: Exposes CRUD operations for the **dashboard_activity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dashboard_activities
    * const dashboard_activities = await prisma.dashboard_activity.findMany()
    * ```
    */
  get dashboard_activity(): Prisma.dashboard_activityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.events`: Exposes CRUD operations for the **events** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.events.findMany()
    * ```
    */
  get events(): Prisma.eventsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jobs`: Exposes CRUD operations for the **jobs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.jobs.findMany()
    * ```
    */
  get jobs(): Prisma.jobsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.partners`: Exposes CRUD operations for the **partners** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Partners
    * const partners = await prisma.partners.findMany()
    * ```
    */
  get partners(): Prisma.partnersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resumes`: Exposes CRUD operations for the **resumes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resumes.findMany()
    * ```
    */
  get resumes(): Prisma.resumesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    app_status_history: 'app_status_history',
    applications: 'applications',
    dashboard_activity: 'dashboard_activity',
    events: 'events',
    jobs: 'jobs',
    partners: 'partners',
    resumes: 'resumes',
    users: 'users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "app_status_history" | "applications" | "dashboard_activity" | "events" | "jobs" | "partners" | "resumes" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      app_status_history: {
        payload: Prisma.$app_status_historyPayload<ExtArgs>
        fields: Prisma.app_status_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.app_status_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.app_status_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          findFirst: {
            args: Prisma.app_status_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.app_status_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          findMany: {
            args: Prisma.app_status_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>[]
          }
          create: {
            args: Prisma.app_status_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          createMany: {
            args: Prisma.app_status_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.app_status_historyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>[]
          }
          delete: {
            args: Prisma.app_status_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          update: {
            args: Prisma.app_status_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          deleteMany: {
            args: Prisma.app_status_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.app_status_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.app_status_historyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>[]
          }
          upsert: {
            args: Prisma.app_status_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_status_historyPayload>
          }
          aggregate: {
            args: Prisma.App_status_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApp_status_history>
          }
          groupBy: {
            args: Prisma.app_status_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<App_status_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.app_status_historyCountArgs<ExtArgs>
            result: $Utils.Optional<App_status_historyCountAggregateOutputType> | number
          }
        }
      }
      applications: {
        payload: Prisma.$applicationsPayload<ExtArgs>
        fields: Prisma.applicationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.applicationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.applicationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          findFirst: {
            args: Prisma.applicationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.applicationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          findMany: {
            args: Prisma.applicationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>[]
          }
          create: {
            args: Prisma.applicationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          createMany: {
            args: Prisma.applicationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.applicationsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>[]
          }
          delete: {
            args: Prisma.applicationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          update: {
            args: Prisma.applicationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          deleteMany: {
            args: Prisma.applicationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.applicationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.applicationsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>[]
          }
          upsert: {
            args: Prisma.applicationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$applicationsPayload>
          }
          aggregate: {
            args: Prisma.ApplicationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplications>
          }
          groupBy: {
            args: Prisma.applicationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.applicationsCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationsCountAggregateOutputType> | number
          }
        }
      }
      dashboard_activity: {
        payload: Prisma.$dashboard_activityPayload<ExtArgs>
        fields: Prisma.dashboard_activityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dashboard_activityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dashboard_activityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          findFirst: {
            args: Prisma.dashboard_activityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dashboard_activityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          findMany: {
            args: Prisma.dashboard_activityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>[]
          }
          create: {
            args: Prisma.dashboard_activityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          createMany: {
            args: Prisma.dashboard_activityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.dashboard_activityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>[]
          }
          delete: {
            args: Prisma.dashboard_activityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          update: {
            args: Prisma.dashboard_activityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          deleteMany: {
            args: Prisma.dashboard_activityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dashboard_activityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.dashboard_activityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>[]
          }
          upsert: {
            args: Prisma.dashboard_activityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboard_activityPayload>
          }
          aggregate: {
            args: Prisma.Dashboard_activityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDashboard_activity>
          }
          groupBy: {
            args: Prisma.dashboard_activityGroupByArgs<ExtArgs>
            result: $Utils.Optional<Dashboard_activityGroupByOutputType>[]
          }
          count: {
            args: Prisma.dashboard_activityCountArgs<ExtArgs>
            result: $Utils.Optional<Dashboard_activityCountAggregateOutputType> | number
          }
        }
      }
      events: {
        payload: Prisma.$eventsPayload<ExtArgs>
        fields: Prisma.eventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.eventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.eventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          findFirst: {
            args: Prisma.eventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.eventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          findMany: {
            args: Prisma.eventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>[]
          }
          create: {
            args: Prisma.eventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          createMany: {
            args: Prisma.eventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.eventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>[]
          }
          delete: {
            args: Prisma.eventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          update: {
            args: Prisma.eventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          deleteMany: {
            args: Prisma.eventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.eventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.eventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>[]
          }
          upsert: {
            args: Prisma.eventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$eventsPayload>
          }
          aggregate: {
            args: Prisma.EventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvents>
          }
          groupBy: {
            args: Prisma.eventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.eventsCountArgs<ExtArgs>
            result: $Utils.Optional<EventsCountAggregateOutputType> | number
          }
        }
      }
      jobs: {
        payload: Prisma.$jobsPayload<ExtArgs>
        fields: Prisma.jobsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.jobsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.jobsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          findFirst: {
            args: Prisma.jobsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.jobsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          findMany: {
            args: Prisma.jobsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>[]
          }
          create: {
            args: Prisma.jobsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          createMany: {
            args: Prisma.jobsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.jobsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>[]
          }
          delete: {
            args: Prisma.jobsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          update: {
            args: Prisma.jobsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          deleteMany: {
            args: Prisma.jobsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.jobsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.jobsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>[]
          }
          upsert: {
            args: Prisma.jobsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jobsPayload>
          }
          aggregate: {
            args: Prisma.JobsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobs>
          }
          groupBy: {
            args: Prisma.jobsGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobsGroupByOutputType>[]
          }
          count: {
            args: Prisma.jobsCountArgs<ExtArgs>
            result: $Utils.Optional<JobsCountAggregateOutputType> | number
          }
        }
      }
      partners: {
        payload: Prisma.$partnersPayload<ExtArgs>
        fields: Prisma.partnersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.partnersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.partnersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          findFirst: {
            args: Prisma.partnersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.partnersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          findMany: {
            args: Prisma.partnersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>[]
          }
          create: {
            args: Prisma.partnersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          createMany: {
            args: Prisma.partnersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.partnersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>[]
          }
          delete: {
            args: Prisma.partnersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          update: {
            args: Prisma.partnersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          deleteMany: {
            args: Prisma.partnersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.partnersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.partnersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>[]
          }
          upsert: {
            args: Prisma.partnersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$partnersPayload>
          }
          aggregate: {
            args: Prisma.PartnersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartners>
          }
          groupBy: {
            args: Prisma.partnersGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartnersGroupByOutputType>[]
          }
          count: {
            args: Prisma.partnersCountArgs<ExtArgs>
            result: $Utils.Optional<PartnersCountAggregateOutputType> | number
          }
        }
      }
      resumes: {
        payload: Prisma.$resumesPayload<ExtArgs>
        fields: Prisma.resumesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.resumesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.resumesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          findFirst: {
            args: Prisma.resumesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.resumesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          findMany: {
            args: Prisma.resumesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>[]
          }
          create: {
            args: Prisma.resumesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          createMany: {
            args: Prisma.resumesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.resumesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>[]
          }
          delete: {
            args: Prisma.resumesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          update: {
            args: Prisma.resumesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          deleteMany: {
            args: Prisma.resumesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.resumesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.resumesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>[]
          }
          upsert: {
            args: Prisma.resumesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$resumesPayload>
          }
          aggregate: {
            args: Prisma.ResumesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResumes>
          }
          groupBy: {
            args: Prisma.resumesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumesGroupByOutputType>[]
          }
          count: {
            args: Prisma.resumesCountArgs<ExtArgs>
            result: $Utils.Optional<ResumesCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    app_status_history?: app_status_historyOmit
    applications?: applicationsOmit
    dashboard_activity?: dashboard_activityOmit
    events?: eventsOmit
    jobs?: jobsOmit
    partners?: partnersOmit
    resumes?: resumesOmit
    users?: usersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ApplicationsCountOutputType
   */

  export type ApplicationsCountOutputType = {
    app_status_history: number
  }

  export type ApplicationsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    app_status_history?: boolean | ApplicationsCountOutputTypeCountApp_status_historyArgs
  }

  // Custom InputTypes
  /**
   * ApplicationsCountOutputType without action
   */
  export type ApplicationsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationsCountOutputType
     */
    select?: ApplicationsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApplicationsCountOutputType without action
   */
  export type ApplicationsCountOutputTypeCountApp_status_historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: app_status_historyWhereInput
  }


  /**
   * Count Type JobsCountOutputType
   */

  export type JobsCountOutputType = {
    applications: number
  }

  export type JobsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | JobsCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * JobsCountOutputType without action
   */
  export type JobsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobsCountOutputType
     */
    select?: JobsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobsCountOutputType without action
   */
  export type JobsCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: applicationsWhereInput
  }


  /**
   * Count Type PartnersCountOutputType
   */

  export type PartnersCountOutputType = {
    jobs: number
  }

  export type PartnersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | PartnersCountOutputTypeCountJobsArgs
  }

  // Custom InputTypes
  /**
   * PartnersCountOutputType without action
   */
  export type PartnersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnersCountOutputType
     */
    select?: PartnersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PartnersCountOutputType without action
   */
  export type PartnersCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: jobsWhereInput
  }


  /**
   * Count Type ResumesCountOutputType
   */

  export type ResumesCountOutputType = {
    applications: number
  }

  export type ResumesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | ResumesCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * ResumesCountOutputType without action
   */
  export type ResumesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumesCountOutputType
     */
    select?: ResumesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumesCountOutputType without action
   */
  export type ResumesCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: applicationsWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    applications: number
    dashboard_activity: number
    resumes: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | UsersCountOutputTypeCountApplicationsArgs
    dashboard_activity?: boolean | UsersCountOutputTypeCountDashboard_activityArgs
    resumes?: boolean | UsersCountOutputTypeCountResumesArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: applicationsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountDashboard_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dashboard_activityWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountResumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: resumesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model app_status_history
   */

  export type AggregateApp_status_history = {
    _count: App_status_historyCountAggregateOutputType | null
    _avg: App_status_historyAvgAggregateOutputType | null
    _sum: App_status_historySumAggregateOutputType | null
    _min: App_status_historyMinAggregateOutputType | null
    _max: App_status_historyMaxAggregateOutputType | null
  }

  export type App_status_historyAvgAggregateOutputType = {
    app_history_id: number | null
    application_id: number | null
  }

  export type App_status_historySumAggregateOutputType = {
    app_history_id: number | null
    application_id: number | null
  }

  export type App_status_historyMinAggregateOutputType = {
    app_history_id: number | null
    application_id: number | null
    status: $Enums.AppHistoryStatus | null
    changed_at: Date | null
  }

  export type App_status_historyMaxAggregateOutputType = {
    app_history_id: number | null
    application_id: number | null
    status: $Enums.AppHistoryStatus | null
    changed_at: Date | null
  }

  export type App_status_historyCountAggregateOutputType = {
    app_history_id: number
    application_id: number
    status: number
    changed_at: number
    _all: number
  }


  export type App_status_historyAvgAggregateInputType = {
    app_history_id?: true
    application_id?: true
  }

  export type App_status_historySumAggregateInputType = {
    app_history_id?: true
    application_id?: true
  }

  export type App_status_historyMinAggregateInputType = {
    app_history_id?: true
    application_id?: true
    status?: true
    changed_at?: true
  }

  export type App_status_historyMaxAggregateInputType = {
    app_history_id?: true
    application_id?: true
    status?: true
    changed_at?: true
  }

  export type App_status_historyCountAggregateInputType = {
    app_history_id?: true
    application_id?: true
    status?: true
    changed_at?: true
    _all?: true
  }

  export type App_status_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which app_status_history to aggregate.
     */
    where?: app_status_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_status_histories to fetch.
     */
    orderBy?: app_status_historyOrderByWithRelationInput | app_status_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: app_status_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_status_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_status_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned app_status_histories
    **/
    _count?: true | App_status_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: App_status_historyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: App_status_historySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: App_status_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: App_status_historyMaxAggregateInputType
  }

  export type GetApp_status_historyAggregateType<T extends App_status_historyAggregateArgs> = {
        [P in keyof T & keyof AggregateApp_status_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApp_status_history[P]>
      : GetScalarType<T[P], AggregateApp_status_history[P]>
  }




  export type app_status_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: app_status_historyWhereInput
    orderBy?: app_status_historyOrderByWithAggregationInput | app_status_historyOrderByWithAggregationInput[]
    by: App_status_historyScalarFieldEnum[] | App_status_historyScalarFieldEnum
    having?: app_status_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: App_status_historyCountAggregateInputType | true
    _avg?: App_status_historyAvgAggregateInputType
    _sum?: App_status_historySumAggregateInputType
    _min?: App_status_historyMinAggregateInputType
    _max?: App_status_historyMaxAggregateInputType
  }

  export type App_status_historyGroupByOutputType = {
    app_history_id: number
    application_id: number
    status: $Enums.AppHistoryStatus
    changed_at: Date | null
    _count: App_status_historyCountAggregateOutputType | null
    _avg: App_status_historyAvgAggregateOutputType | null
    _sum: App_status_historySumAggregateOutputType | null
    _min: App_status_historyMinAggregateOutputType | null
    _max: App_status_historyMaxAggregateOutputType | null
  }

  type GetApp_status_historyGroupByPayload<T extends app_status_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<App_status_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof App_status_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], App_status_historyGroupByOutputType[P]>
            : GetScalarType<T[P], App_status_historyGroupByOutputType[P]>
        }
      >
    >


  export type app_status_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    app_history_id?: boolean
    application_id?: boolean
    status?: boolean
    changed_at?: boolean
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["app_status_history"]>

  export type app_status_historySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    app_history_id?: boolean
    application_id?: boolean
    status?: boolean
    changed_at?: boolean
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["app_status_history"]>

  export type app_status_historySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    app_history_id?: boolean
    application_id?: boolean
    status?: boolean
    changed_at?: boolean
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["app_status_history"]>

  export type app_status_historySelectScalar = {
    app_history_id?: boolean
    application_id?: boolean
    status?: boolean
    changed_at?: boolean
  }

  export type app_status_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"app_history_id" | "application_id" | "status" | "changed_at", ExtArgs["result"]["app_status_history"]>
  export type app_status_historyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }
  export type app_status_historyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }
  export type app_status_historyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | applicationsDefaultArgs<ExtArgs>
  }

  export type $app_status_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "app_status_history"
    objects: {
      applications: Prisma.$applicationsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      app_history_id: number
      application_id: number
      status: $Enums.AppHistoryStatus
      changed_at: Date | null
    }, ExtArgs["result"]["app_status_history"]>
    composites: {}
  }

  type app_status_historyGetPayload<S extends boolean | null | undefined | app_status_historyDefaultArgs> = $Result.GetResult<Prisma.$app_status_historyPayload, S>

  type app_status_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<app_status_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: App_status_historyCountAggregateInputType | true
    }

  export interface app_status_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['app_status_history'], meta: { name: 'app_status_history' } }
    /**
     * Find zero or one App_status_history that matches the filter.
     * @param {app_status_historyFindUniqueArgs} args - Arguments to find a App_status_history
     * @example
     * // Get one App_status_history
     * const app_status_history = await prisma.app_status_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends app_status_historyFindUniqueArgs>(args: SelectSubset<T, app_status_historyFindUniqueArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one App_status_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {app_status_historyFindUniqueOrThrowArgs} args - Arguments to find a App_status_history
     * @example
     * // Get one App_status_history
     * const app_status_history = await prisma.app_status_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends app_status_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, app_status_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first App_status_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyFindFirstArgs} args - Arguments to find a App_status_history
     * @example
     * // Get one App_status_history
     * const app_status_history = await prisma.app_status_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends app_status_historyFindFirstArgs>(args?: SelectSubset<T, app_status_historyFindFirstArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first App_status_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyFindFirstOrThrowArgs} args - Arguments to find a App_status_history
     * @example
     * // Get one App_status_history
     * const app_status_history = await prisma.app_status_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends app_status_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, app_status_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more App_status_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all App_status_histories
     * const app_status_histories = await prisma.app_status_history.findMany()
     * 
     * // Get first 10 App_status_histories
     * const app_status_histories = await prisma.app_status_history.findMany({ take: 10 })
     * 
     * // Only select the `app_history_id`
     * const app_status_historyWithApp_history_idOnly = await prisma.app_status_history.findMany({ select: { app_history_id: true } })
     * 
     */
    findMany<T extends app_status_historyFindManyArgs>(args?: SelectSubset<T, app_status_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a App_status_history.
     * @param {app_status_historyCreateArgs} args - Arguments to create a App_status_history.
     * @example
     * // Create one App_status_history
     * const App_status_history = await prisma.app_status_history.create({
     *   data: {
     *     // ... data to create a App_status_history
     *   }
     * })
     * 
     */
    create<T extends app_status_historyCreateArgs>(args: SelectSubset<T, app_status_historyCreateArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many App_status_histories.
     * @param {app_status_historyCreateManyArgs} args - Arguments to create many App_status_histories.
     * @example
     * // Create many App_status_histories
     * const app_status_history = await prisma.app_status_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends app_status_historyCreateManyArgs>(args?: SelectSubset<T, app_status_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many App_status_histories and returns the data saved in the database.
     * @param {app_status_historyCreateManyAndReturnArgs} args - Arguments to create many App_status_histories.
     * @example
     * // Create many App_status_histories
     * const app_status_history = await prisma.app_status_history.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many App_status_histories and only return the `app_history_id`
     * const app_status_historyWithApp_history_idOnly = await prisma.app_status_history.createManyAndReturn({
     *   select: { app_history_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends app_status_historyCreateManyAndReturnArgs>(args?: SelectSubset<T, app_status_historyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a App_status_history.
     * @param {app_status_historyDeleteArgs} args - Arguments to delete one App_status_history.
     * @example
     * // Delete one App_status_history
     * const App_status_history = await prisma.app_status_history.delete({
     *   where: {
     *     // ... filter to delete one App_status_history
     *   }
     * })
     * 
     */
    delete<T extends app_status_historyDeleteArgs>(args: SelectSubset<T, app_status_historyDeleteArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one App_status_history.
     * @param {app_status_historyUpdateArgs} args - Arguments to update one App_status_history.
     * @example
     * // Update one App_status_history
     * const app_status_history = await prisma.app_status_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends app_status_historyUpdateArgs>(args: SelectSubset<T, app_status_historyUpdateArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more App_status_histories.
     * @param {app_status_historyDeleteManyArgs} args - Arguments to filter App_status_histories to delete.
     * @example
     * // Delete a few App_status_histories
     * const { count } = await prisma.app_status_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends app_status_historyDeleteManyArgs>(args?: SelectSubset<T, app_status_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more App_status_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many App_status_histories
     * const app_status_history = await prisma.app_status_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends app_status_historyUpdateManyArgs>(args: SelectSubset<T, app_status_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more App_status_histories and returns the data updated in the database.
     * @param {app_status_historyUpdateManyAndReturnArgs} args - Arguments to update many App_status_histories.
     * @example
     * // Update many App_status_histories
     * const app_status_history = await prisma.app_status_history.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more App_status_histories and only return the `app_history_id`
     * const app_status_historyWithApp_history_idOnly = await prisma.app_status_history.updateManyAndReturn({
     *   select: { app_history_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends app_status_historyUpdateManyAndReturnArgs>(args: SelectSubset<T, app_status_historyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one App_status_history.
     * @param {app_status_historyUpsertArgs} args - Arguments to update or create a App_status_history.
     * @example
     * // Update or create a App_status_history
     * const app_status_history = await prisma.app_status_history.upsert({
     *   create: {
     *     // ... data to create a App_status_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the App_status_history we want to update
     *   }
     * })
     */
    upsert<T extends app_status_historyUpsertArgs>(args: SelectSubset<T, app_status_historyUpsertArgs<ExtArgs>>): Prisma__app_status_historyClient<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of App_status_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyCountArgs} args - Arguments to filter App_status_histories to count.
     * @example
     * // Count the number of App_status_histories
     * const count = await prisma.app_status_history.count({
     *   where: {
     *     // ... the filter for the App_status_histories we want to count
     *   }
     * })
    **/
    count<T extends app_status_historyCountArgs>(
      args?: Subset<T, app_status_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], App_status_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a App_status_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {App_status_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends App_status_historyAggregateArgs>(args: Subset<T, App_status_historyAggregateArgs>): Prisma.PrismaPromise<GetApp_status_historyAggregateType<T>>

    /**
     * Group by App_status_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_status_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends app_status_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: app_status_historyGroupByArgs['orderBy'] }
        : { orderBy?: app_status_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, app_status_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApp_status_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the app_status_history model
   */
  readonly fields: app_status_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for app_status_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__app_status_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends applicationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, applicationsDefaultArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the app_status_history model
   */
  interface app_status_historyFieldRefs {
    readonly app_history_id: FieldRef<"app_status_history", 'Int'>
    readonly application_id: FieldRef<"app_status_history", 'Int'>
    readonly status: FieldRef<"app_status_history", 'AppHistoryStatus'>
    readonly changed_at: FieldRef<"app_status_history", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * app_status_history findUnique
   */
  export type app_status_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter, which app_status_history to fetch.
     */
    where: app_status_historyWhereUniqueInput
  }

  /**
   * app_status_history findUniqueOrThrow
   */
  export type app_status_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter, which app_status_history to fetch.
     */
    where: app_status_historyWhereUniqueInput
  }

  /**
   * app_status_history findFirst
   */
  export type app_status_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter, which app_status_history to fetch.
     */
    where?: app_status_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_status_histories to fetch.
     */
    orderBy?: app_status_historyOrderByWithRelationInput | app_status_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for app_status_histories.
     */
    cursor?: app_status_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_status_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_status_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of app_status_histories.
     */
    distinct?: App_status_historyScalarFieldEnum | App_status_historyScalarFieldEnum[]
  }

  /**
   * app_status_history findFirstOrThrow
   */
  export type app_status_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter, which app_status_history to fetch.
     */
    where?: app_status_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_status_histories to fetch.
     */
    orderBy?: app_status_historyOrderByWithRelationInput | app_status_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for app_status_histories.
     */
    cursor?: app_status_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_status_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_status_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of app_status_histories.
     */
    distinct?: App_status_historyScalarFieldEnum | App_status_historyScalarFieldEnum[]
  }

  /**
   * app_status_history findMany
   */
  export type app_status_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter, which app_status_histories to fetch.
     */
    where?: app_status_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_status_histories to fetch.
     */
    orderBy?: app_status_historyOrderByWithRelationInput | app_status_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing app_status_histories.
     */
    cursor?: app_status_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_status_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_status_histories.
     */
    skip?: number
    distinct?: App_status_historyScalarFieldEnum | App_status_historyScalarFieldEnum[]
  }

  /**
   * app_status_history create
   */
  export type app_status_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * The data needed to create a app_status_history.
     */
    data: XOR<app_status_historyCreateInput, app_status_historyUncheckedCreateInput>
  }

  /**
   * app_status_history createMany
   */
  export type app_status_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many app_status_histories.
     */
    data: app_status_historyCreateManyInput | app_status_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * app_status_history createManyAndReturn
   */
  export type app_status_historyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * The data used to create many app_status_histories.
     */
    data: app_status_historyCreateManyInput | app_status_historyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * app_status_history update
   */
  export type app_status_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * The data needed to update a app_status_history.
     */
    data: XOR<app_status_historyUpdateInput, app_status_historyUncheckedUpdateInput>
    /**
     * Choose, which app_status_history to update.
     */
    where: app_status_historyWhereUniqueInput
  }

  /**
   * app_status_history updateMany
   */
  export type app_status_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update app_status_histories.
     */
    data: XOR<app_status_historyUpdateManyMutationInput, app_status_historyUncheckedUpdateManyInput>
    /**
     * Filter which app_status_histories to update
     */
    where?: app_status_historyWhereInput
    /**
     * Limit how many app_status_histories to update.
     */
    limit?: number
  }

  /**
   * app_status_history updateManyAndReturn
   */
  export type app_status_historyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * The data used to update app_status_histories.
     */
    data: XOR<app_status_historyUpdateManyMutationInput, app_status_historyUncheckedUpdateManyInput>
    /**
     * Filter which app_status_histories to update
     */
    where?: app_status_historyWhereInput
    /**
     * Limit how many app_status_histories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * app_status_history upsert
   */
  export type app_status_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * The filter to search for the app_status_history to update in case it exists.
     */
    where: app_status_historyWhereUniqueInput
    /**
     * In case the app_status_history found by the `where` argument doesn't exist, create a new app_status_history with this data.
     */
    create: XOR<app_status_historyCreateInput, app_status_historyUncheckedCreateInput>
    /**
     * In case the app_status_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<app_status_historyUpdateInput, app_status_historyUncheckedUpdateInput>
  }

  /**
   * app_status_history delete
   */
  export type app_status_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    /**
     * Filter which app_status_history to delete.
     */
    where: app_status_historyWhereUniqueInput
  }

  /**
   * app_status_history deleteMany
   */
  export type app_status_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which app_status_histories to delete
     */
    where?: app_status_historyWhereInput
    /**
     * Limit how many app_status_histories to delete.
     */
    limit?: number
  }

  /**
   * app_status_history without action
   */
  export type app_status_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
  }


  /**
   * Model applications
   */

  export type AggregateApplications = {
    _count: ApplicationsCountAggregateOutputType | null
    _avg: ApplicationsAvgAggregateOutputType | null
    _sum: ApplicationsSumAggregateOutputType | null
    _min: ApplicationsMinAggregateOutputType | null
    _max: ApplicationsMaxAggregateOutputType | null
  }

  export type ApplicationsAvgAggregateOutputType = {
    application_id: number | null
    user_id: number | null
    job_id: number | null
    resume_id: number | null
  }

  export type ApplicationsSumAggregateOutputType = {
    application_id: number | null
    user_id: number | null
    job_id: number | null
    resume_id: number | null
  }

  export type ApplicationsMinAggregateOutputType = {
    application_id: number | null
    user_id: number | null
    job_id: number | null
    status: $Enums.ApplicationStatus | null
    applied_at: Date | null
    status_updated: Date | null
    resume_id: number | null
    position: string | null
  }

  export type ApplicationsMaxAggregateOutputType = {
    application_id: number | null
    user_id: number | null
    job_id: number | null
    status: $Enums.ApplicationStatus | null
    applied_at: Date | null
    status_updated: Date | null
    resume_id: number | null
    position: string | null
  }

  export type ApplicationsCountAggregateOutputType = {
    application_id: number
    user_id: number
    job_id: number
    status: number
    applied_at: number
    status_updated: number
    resume_id: number
    position: number
    _all: number
  }


  export type ApplicationsAvgAggregateInputType = {
    application_id?: true
    user_id?: true
    job_id?: true
    resume_id?: true
  }

  export type ApplicationsSumAggregateInputType = {
    application_id?: true
    user_id?: true
    job_id?: true
    resume_id?: true
  }

  export type ApplicationsMinAggregateInputType = {
    application_id?: true
    user_id?: true
    job_id?: true
    status?: true
    applied_at?: true
    status_updated?: true
    resume_id?: true
    position?: true
  }

  export type ApplicationsMaxAggregateInputType = {
    application_id?: true
    user_id?: true
    job_id?: true
    status?: true
    applied_at?: true
    status_updated?: true
    resume_id?: true
    position?: true
  }

  export type ApplicationsCountAggregateInputType = {
    application_id?: true
    user_id?: true
    job_id?: true
    status?: true
    applied_at?: true
    status_updated?: true
    resume_id?: true
    position?: true
    _all?: true
  }

  export type ApplicationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which applications to aggregate.
     */
    where?: applicationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of applications to fetch.
     */
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: applicationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned applications
    **/
    _count?: true | ApplicationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApplicationsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApplicationsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationsMaxAggregateInputType
  }

  export type GetApplicationsAggregateType<T extends ApplicationsAggregateArgs> = {
        [P in keyof T & keyof AggregateApplications]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplications[P]>
      : GetScalarType<T[P], AggregateApplications[P]>
  }




  export type applicationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: applicationsWhereInput
    orderBy?: applicationsOrderByWithAggregationInput | applicationsOrderByWithAggregationInput[]
    by: ApplicationsScalarFieldEnum[] | ApplicationsScalarFieldEnum
    having?: applicationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationsCountAggregateInputType | true
    _avg?: ApplicationsAvgAggregateInputType
    _sum?: ApplicationsSumAggregateInputType
    _min?: ApplicationsMinAggregateInputType
    _max?: ApplicationsMaxAggregateInputType
  }

  export type ApplicationsGroupByOutputType = {
    application_id: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at: Date | null
    status_updated: Date | null
    resume_id: number | null
    position: string | null
    _count: ApplicationsCountAggregateOutputType | null
    _avg: ApplicationsAvgAggregateOutputType | null
    _sum: ApplicationsSumAggregateOutputType | null
    _min: ApplicationsMinAggregateOutputType | null
    _max: ApplicationsMaxAggregateOutputType | null
  }

  type GetApplicationsGroupByPayload<T extends applicationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationsGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationsGroupByOutputType[P]>
        }
      >
    >


  export type applicationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    application_id?: boolean
    user_id?: boolean
    job_id?: boolean
    status?: boolean
    applied_at?: boolean
    status_updated?: boolean
    resume_id?: boolean
    position?: boolean
    app_status_history?: boolean | applications$app_status_historyArgs<ExtArgs>
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
    _count?: boolean | ApplicationsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applications"]>

  export type applicationsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    application_id?: boolean
    user_id?: boolean
    job_id?: boolean
    status?: boolean
    applied_at?: boolean
    status_updated?: boolean
    resume_id?: boolean
    position?: boolean
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applications"]>

  export type applicationsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    application_id?: boolean
    user_id?: boolean
    job_id?: boolean
    status?: boolean
    applied_at?: boolean
    status_updated?: boolean
    resume_id?: boolean
    position?: boolean
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applications"]>

  export type applicationsSelectScalar = {
    application_id?: boolean
    user_id?: boolean
    job_id?: boolean
    status?: boolean
    applied_at?: boolean
    status_updated?: boolean
    resume_id?: boolean
    position?: boolean
  }

  export type applicationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"application_id" | "user_id" | "job_id" | "status" | "applied_at" | "status_updated" | "resume_id" | "position", ExtArgs["result"]["applications"]>
  export type applicationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    app_status_history?: boolean | applications$app_status_historyArgs<ExtArgs>
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
    _count?: boolean | ApplicationsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type applicationsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type applicationsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | jobsDefaultArgs<ExtArgs>
    resumes?: boolean | applications$resumesArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $applicationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "applications"
    objects: {
      app_status_history: Prisma.$app_status_historyPayload<ExtArgs>[]
      jobs: Prisma.$jobsPayload<ExtArgs>
      resumes: Prisma.$resumesPayload<ExtArgs> | null
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      application_id: number
      user_id: number
      job_id: number
      status: $Enums.ApplicationStatus
      applied_at: Date | null
      status_updated: Date | null
      resume_id: number | null
      position: string | null
    }, ExtArgs["result"]["applications"]>
    composites: {}
  }

  type applicationsGetPayload<S extends boolean | null | undefined | applicationsDefaultArgs> = $Result.GetResult<Prisma.$applicationsPayload, S>

  type applicationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<applicationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationsCountAggregateInputType | true
    }

  export interface applicationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['applications'], meta: { name: 'applications' } }
    /**
     * Find zero or one Applications that matches the filter.
     * @param {applicationsFindUniqueArgs} args - Arguments to find a Applications
     * @example
     * // Get one Applications
     * const applications = await prisma.applications.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends applicationsFindUniqueArgs>(args: SelectSubset<T, applicationsFindUniqueArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Applications that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {applicationsFindUniqueOrThrowArgs} args - Arguments to find a Applications
     * @example
     * // Get one Applications
     * const applications = await prisma.applications.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends applicationsFindUniqueOrThrowArgs>(args: SelectSubset<T, applicationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsFindFirstArgs} args - Arguments to find a Applications
     * @example
     * // Get one Applications
     * const applications = await prisma.applications.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends applicationsFindFirstArgs>(args?: SelectSubset<T, applicationsFindFirstArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Applications that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsFindFirstOrThrowArgs} args - Arguments to find a Applications
     * @example
     * // Get one Applications
     * const applications = await prisma.applications.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends applicationsFindFirstOrThrowArgs>(args?: SelectSubset<T, applicationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.applications.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.applications.findMany({ take: 10 })
     * 
     * // Only select the `application_id`
     * const applicationsWithApplication_idOnly = await prisma.applications.findMany({ select: { application_id: true } })
     * 
     */
    findMany<T extends applicationsFindManyArgs>(args?: SelectSubset<T, applicationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Applications.
     * @param {applicationsCreateArgs} args - Arguments to create a Applications.
     * @example
     * // Create one Applications
     * const Applications = await prisma.applications.create({
     *   data: {
     *     // ... data to create a Applications
     *   }
     * })
     * 
     */
    create<T extends applicationsCreateArgs>(args: SelectSubset<T, applicationsCreateArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {applicationsCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const applications = await prisma.applications.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends applicationsCreateManyArgs>(args?: SelectSubset<T, applicationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {applicationsCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const applications = await prisma.applications.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `application_id`
     * const applicationsWithApplication_idOnly = await prisma.applications.createManyAndReturn({
     *   select: { application_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends applicationsCreateManyAndReturnArgs>(args?: SelectSubset<T, applicationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Applications.
     * @param {applicationsDeleteArgs} args - Arguments to delete one Applications.
     * @example
     * // Delete one Applications
     * const Applications = await prisma.applications.delete({
     *   where: {
     *     // ... filter to delete one Applications
     *   }
     * })
     * 
     */
    delete<T extends applicationsDeleteArgs>(args: SelectSubset<T, applicationsDeleteArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Applications.
     * @param {applicationsUpdateArgs} args - Arguments to update one Applications.
     * @example
     * // Update one Applications
     * const applications = await prisma.applications.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends applicationsUpdateArgs>(args: SelectSubset<T, applicationsUpdateArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {applicationsDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.applications.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends applicationsDeleteManyArgs>(args?: SelectSubset<T, applicationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const applications = await prisma.applications.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends applicationsUpdateManyArgs>(args: SelectSubset<T, applicationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {applicationsUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const applications = await prisma.applications.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `application_id`
     * const applicationsWithApplication_idOnly = await prisma.applications.updateManyAndReturn({
     *   select: { application_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends applicationsUpdateManyAndReturnArgs>(args: SelectSubset<T, applicationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Applications.
     * @param {applicationsUpsertArgs} args - Arguments to update or create a Applications.
     * @example
     * // Update or create a Applications
     * const applications = await prisma.applications.upsert({
     *   create: {
     *     // ... data to create a Applications
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Applications we want to update
     *   }
     * })
     */
    upsert<T extends applicationsUpsertArgs>(args: SelectSubset<T, applicationsUpsertArgs<ExtArgs>>): Prisma__applicationsClient<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.applications.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends applicationsCountArgs>(
      args?: Subset<T, applicationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationsAggregateArgs>(args: Subset<T, ApplicationsAggregateArgs>): Prisma.PrismaPromise<GetApplicationsAggregateType<T>>

    /**
     * Group by Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {applicationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends applicationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: applicationsGroupByArgs['orderBy'] }
        : { orderBy?: applicationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, applicationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the applications model
   */
  readonly fields: applicationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for applications.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__applicationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    app_status_history<T extends applications$app_status_historyArgs<ExtArgs> = {}>(args?: Subset<T, applications$app_status_historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_status_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    jobs<T extends jobsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, jobsDefaultArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resumes<T extends applications$resumesArgs<ExtArgs> = {}>(args?: Subset<T, applications$resumesArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the applications model
   */
  interface applicationsFieldRefs {
    readonly application_id: FieldRef<"applications", 'Int'>
    readonly user_id: FieldRef<"applications", 'Int'>
    readonly job_id: FieldRef<"applications", 'Int'>
    readonly status: FieldRef<"applications", 'ApplicationStatus'>
    readonly applied_at: FieldRef<"applications", 'DateTime'>
    readonly status_updated: FieldRef<"applications", 'DateTime'>
    readonly resume_id: FieldRef<"applications", 'Int'>
    readonly position: FieldRef<"applications", 'String'>
  }
    

  // Custom InputTypes
  /**
   * applications findUnique
   */
  export type applicationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter, which applications to fetch.
     */
    where: applicationsWhereUniqueInput
  }

  /**
   * applications findUniqueOrThrow
   */
  export type applicationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter, which applications to fetch.
     */
    where: applicationsWhereUniqueInput
  }

  /**
   * applications findFirst
   */
  export type applicationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter, which applications to fetch.
     */
    where?: applicationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of applications to fetch.
     */
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for applications.
     */
    cursor?: applicationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of applications.
     */
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * applications findFirstOrThrow
   */
  export type applicationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter, which applications to fetch.
     */
    where?: applicationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of applications to fetch.
     */
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for applications.
     */
    cursor?: applicationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of applications.
     */
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * applications findMany
   */
  export type applicationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter, which applications to fetch.
     */
    where?: applicationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of applications to fetch.
     */
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing applications.
     */
    cursor?: applicationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` applications.
     */
    skip?: number
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * applications create
   */
  export type applicationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * The data needed to create a applications.
     */
    data: XOR<applicationsCreateInput, applicationsUncheckedCreateInput>
  }

  /**
   * applications createMany
   */
  export type applicationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many applications.
     */
    data: applicationsCreateManyInput | applicationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * applications createManyAndReturn
   */
  export type applicationsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * The data used to create many applications.
     */
    data: applicationsCreateManyInput | applicationsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * applications update
   */
  export type applicationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * The data needed to update a applications.
     */
    data: XOR<applicationsUpdateInput, applicationsUncheckedUpdateInput>
    /**
     * Choose, which applications to update.
     */
    where: applicationsWhereUniqueInput
  }

  /**
   * applications updateMany
   */
  export type applicationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update applications.
     */
    data: XOR<applicationsUpdateManyMutationInput, applicationsUncheckedUpdateManyInput>
    /**
     * Filter which applications to update
     */
    where?: applicationsWhereInput
    /**
     * Limit how many applications to update.
     */
    limit?: number
  }

  /**
   * applications updateManyAndReturn
   */
  export type applicationsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * The data used to update applications.
     */
    data: XOR<applicationsUpdateManyMutationInput, applicationsUncheckedUpdateManyInput>
    /**
     * Filter which applications to update
     */
    where?: applicationsWhereInput
    /**
     * Limit how many applications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * applications upsert
   */
  export type applicationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * The filter to search for the applications to update in case it exists.
     */
    where: applicationsWhereUniqueInput
    /**
     * In case the applications found by the `where` argument doesn't exist, create a new applications with this data.
     */
    create: XOR<applicationsCreateInput, applicationsUncheckedCreateInput>
    /**
     * In case the applications was found with the provided `where` argument, update it with this data.
     */
    update: XOR<applicationsUpdateInput, applicationsUncheckedUpdateInput>
  }

  /**
   * applications delete
   */
  export type applicationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    /**
     * Filter which applications to delete.
     */
    where: applicationsWhereUniqueInput
  }

  /**
   * applications deleteMany
   */
  export type applicationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which applications to delete
     */
    where?: applicationsWhereInput
    /**
     * Limit how many applications to delete.
     */
    limit?: number
  }

  /**
   * applications.app_status_history
   */
  export type applications$app_status_historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_status_history
     */
    select?: app_status_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_status_history
     */
    omit?: app_status_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_status_historyInclude<ExtArgs> | null
    where?: app_status_historyWhereInput
    orderBy?: app_status_historyOrderByWithRelationInput | app_status_historyOrderByWithRelationInput[]
    cursor?: app_status_historyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: App_status_historyScalarFieldEnum | App_status_historyScalarFieldEnum[]
  }

  /**
   * applications.resumes
   */
  export type applications$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    where?: resumesWhereInput
  }

  /**
   * applications without action
   */
  export type applicationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
  }


  /**
   * Model dashboard_activity
   */

  export type AggregateDashboard_activity = {
    _count: Dashboard_activityCountAggregateOutputType | null
    _avg: Dashboard_activityAvgAggregateOutputType | null
    _sum: Dashboard_activitySumAggregateOutputType | null
    _min: Dashboard_activityMinAggregateOutputType | null
    _max: Dashboard_activityMaxAggregateOutputType | null
  }

  export type Dashboard_activityAvgAggregateOutputType = {
    activity_id: number | null
    admin_id: number | null
  }

  export type Dashboard_activitySumAggregateOutputType = {
    activity_id: number | null
    admin_id: number | null
  }

  export type Dashboard_activityMinAggregateOutputType = {
    activity_id: number | null
    admin_id: number | null
    action: string | null
    details: string | null
    timestamp: Date | null
  }

  export type Dashboard_activityMaxAggregateOutputType = {
    activity_id: number | null
    admin_id: number | null
    action: string | null
    details: string | null
    timestamp: Date | null
  }

  export type Dashboard_activityCountAggregateOutputType = {
    activity_id: number
    admin_id: number
    action: number
    details: number
    timestamp: number
    _all: number
  }


  export type Dashboard_activityAvgAggregateInputType = {
    activity_id?: true
    admin_id?: true
  }

  export type Dashboard_activitySumAggregateInputType = {
    activity_id?: true
    admin_id?: true
  }

  export type Dashboard_activityMinAggregateInputType = {
    activity_id?: true
    admin_id?: true
    action?: true
    details?: true
    timestamp?: true
  }

  export type Dashboard_activityMaxAggregateInputType = {
    activity_id?: true
    admin_id?: true
    action?: true
    details?: true
    timestamp?: true
  }

  export type Dashboard_activityCountAggregateInputType = {
    activity_id?: true
    admin_id?: true
    action?: true
    details?: true
    timestamp?: true
    _all?: true
  }

  export type Dashboard_activityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dashboard_activity to aggregate.
     */
    where?: dashboard_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboard_activities to fetch.
     */
    orderBy?: dashboard_activityOrderByWithRelationInput | dashboard_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dashboard_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboard_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboard_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dashboard_activities
    **/
    _count?: true | Dashboard_activityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Dashboard_activityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Dashboard_activitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Dashboard_activityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Dashboard_activityMaxAggregateInputType
  }

  export type GetDashboard_activityAggregateType<T extends Dashboard_activityAggregateArgs> = {
        [P in keyof T & keyof AggregateDashboard_activity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDashboard_activity[P]>
      : GetScalarType<T[P], AggregateDashboard_activity[P]>
  }




  export type dashboard_activityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dashboard_activityWhereInput
    orderBy?: dashboard_activityOrderByWithAggregationInput | dashboard_activityOrderByWithAggregationInput[]
    by: Dashboard_activityScalarFieldEnum[] | Dashboard_activityScalarFieldEnum
    having?: dashboard_activityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Dashboard_activityCountAggregateInputType | true
    _avg?: Dashboard_activityAvgAggregateInputType
    _sum?: Dashboard_activitySumAggregateInputType
    _min?: Dashboard_activityMinAggregateInputType
    _max?: Dashboard_activityMaxAggregateInputType
  }

  export type Dashboard_activityGroupByOutputType = {
    activity_id: number
    admin_id: number
    action: string
    details: string | null
    timestamp: Date | null
    _count: Dashboard_activityCountAggregateOutputType | null
    _avg: Dashboard_activityAvgAggregateOutputType | null
    _sum: Dashboard_activitySumAggregateOutputType | null
    _min: Dashboard_activityMinAggregateOutputType | null
    _max: Dashboard_activityMaxAggregateOutputType | null
  }

  type GetDashboard_activityGroupByPayload<T extends dashboard_activityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Dashboard_activityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Dashboard_activityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Dashboard_activityGroupByOutputType[P]>
            : GetScalarType<T[P], Dashboard_activityGroupByOutputType[P]>
        }
      >
    >


  export type dashboard_activitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    activity_id?: boolean
    admin_id?: boolean
    action?: boolean
    details?: boolean
    timestamp?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboard_activity"]>

  export type dashboard_activitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    activity_id?: boolean
    admin_id?: boolean
    action?: boolean
    details?: boolean
    timestamp?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboard_activity"]>

  export type dashboard_activitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    activity_id?: boolean
    admin_id?: boolean
    action?: boolean
    details?: boolean
    timestamp?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboard_activity"]>

  export type dashboard_activitySelectScalar = {
    activity_id?: boolean
    admin_id?: boolean
    action?: boolean
    details?: boolean
    timestamp?: boolean
  }

  export type dashboard_activityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"activity_id" | "admin_id" | "action" | "details" | "timestamp", ExtArgs["result"]["dashboard_activity"]>
  export type dashboard_activityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type dashboard_activityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type dashboard_activityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $dashboard_activityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dashboard_activity"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      activity_id: number
      admin_id: number
      action: string
      details: string | null
      timestamp: Date | null
    }, ExtArgs["result"]["dashboard_activity"]>
    composites: {}
  }

  type dashboard_activityGetPayload<S extends boolean | null | undefined | dashboard_activityDefaultArgs> = $Result.GetResult<Prisma.$dashboard_activityPayload, S>

  type dashboard_activityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<dashboard_activityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Dashboard_activityCountAggregateInputType | true
    }

  export interface dashboard_activityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dashboard_activity'], meta: { name: 'dashboard_activity' } }
    /**
     * Find zero or one Dashboard_activity that matches the filter.
     * @param {dashboard_activityFindUniqueArgs} args - Arguments to find a Dashboard_activity
     * @example
     * // Get one Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dashboard_activityFindUniqueArgs>(args: SelectSubset<T, dashboard_activityFindUniqueArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dashboard_activity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {dashboard_activityFindUniqueOrThrowArgs} args - Arguments to find a Dashboard_activity
     * @example
     * // Get one Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dashboard_activityFindUniqueOrThrowArgs>(args: SelectSubset<T, dashboard_activityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dashboard_activity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityFindFirstArgs} args - Arguments to find a Dashboard_activity
     * @example
     * // Get one Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dashboard_activityFindFirstArgs>(args?: SelectSubset<T, dashboard_activityFindFirstArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dashboard_activity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityFindFirstOrThrowArgs} args - Arguments to find a Dashboard_activity
     * @example
     * // Get one Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dashboard_activityFindFirstOrThrowArgs>(args?: SelectSubset<T, dashboard_activityFindFirstOrThrowArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dashboard_activities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dashboard_activities
     * const dashboard_activities = await prisma.dashboard_activity.findMany()
     * 
     * // Get first 10 Dashboard_activities
     * const dashboard_activities = await prisma.dashboard_activity.findMany({ take: 10 })
     * 
     * // Only select the `activity_id`
     * const dashboard_activityWithActivity_idOnly = await prisma.dashboard_activity.findMany({ select: { activity_id: true } })
     * 
     */
    findMany<T extends dashboard_activityFindManyArgs>(args?: SelectSubset<T, dashboard_activityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dashboard_activity.
     * @param {dashboard_activityCreateArgs} args - Arguments to create a Dashboard_activity.
     * @example
     * // Create one Dashboard_activity
     * const Dashboard_activity = await prisma.dashboard_activity.create({
     *   data: {
     *     // ... data to create a Dashboard_activity
     *   }
     * })
     * 
     */
    create<T extends dashboard_activityCreateArgs>(args: SelectSubset<T, dashboard_activityCreateArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dashboard_activities.
     * @param {dashboard_activityCreateManyArgs} args - Arguments to create many Dashboard_activities.
     * @example
     * // Create many Dashboard_activities
     * const dashboard_activity = await prisma.dashboard_activity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dashboard_activityCreateManyArgs>(args?: SelectSubset<T, dashboard_activityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dashboard_activities and returns the data saved in the database.
     * @param {dashboard_activityCreateManyAndReturnArgs} args - Arguments to create many Dashboard_activities.
     * @example
     * // Create many Dashboard_activities
     * const dashboard_activity = await prisma.dashboard_activity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dashboard_activities and only return the `activity_id`
     * const dashboard_activityWithActivity_idOnly = await prisma.dashboard_activity.createManyAndReturn({
     *   select: { activity_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends dashboard_activityCreateManyAndReturnArgs>(args?: SelectSubset<T, dashboard_activityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Dashboard_activity.
     * @param {dashboard_activityDeleteArgs} args - Arguments to delete one Dashboard_activity.
     * @example
     * // Delete one Dashboard_activity
     * const Dashboard_activity = await prisma.dashboard_activity.delete({
     *   where: {
     *     // ... filter to delete one Dashboard_activity
     *   }
     * })
     * 
     */
    delete<T extends dashboard_activityDeleteArgs>(args: SelectSubset<T, dashboard_activityDeleteArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dashboard_activity.
     * @param {dashboard_activityUpdateArgs} args - Arguments to update one Dashboard_activity.
     * @example
     * // Update one Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dashboard_activityUpdateArgs>(args: SelectSubset<T, dashboard_activityUpdateArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dashboard_activities.
     * @param {dashboard_activityDeleteManyArgs} args - Arguments to filter Dashboard_activities to delete.
     * @example
     * // Delete a few Dashboard_activities
     * const { count } = await prisma.dashboard_activity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dashboard_activityDeleteManyArgs>(args?: SelectSubset<T, dashboard_activityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dashboard_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dashboard_activities
     * const dashboard_activity = await prisma.dashboard_activity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dashboard_activityUpdateManyArgs>(args: SelectSubset<T, dashboard_activityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dashboard_activities and returns the data updated in the database.
     * @param {dashboard_activityUpdateManyAndReturnArgs} args - Arguments to update many Dashboard_activities.
     * @example
     * // Update many Dashboard_activities
     * const dashboard_activity = await prisma.dashboard_activity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Dashboard_activities and only return the `activity_id`
     * const dashboard_activityWithActivity_idOnly = await prisma.dashboard_activity.updateManyAndReturn({
     *   select: { activity_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends dashboard_activityUpdateManyAndReturnArgs>(args: SelectSubset<T, dashboard_activityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Dashboard_activity.
     * @param {dashboard_activityUpsertArgs} args - Arguments to update or create a Dashboard_activity.
     * @example
     * // Update or create a Dashboard_activity
     * const dashboard_activity = await prisma.dashboard_activity.upsert({
     *   create: {
     *     // ... data to create a Dashboard_activity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dashboard_activity we want to update
     *   }
     * })
     */
    upsert<T extends dashboard_activityUpsertArgs>(args: SelectSubset<T, dashboard_activityUpsertArgs<ExtArgs>>): Prisma__dashboard_activityClient<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dashboard_activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityCountArgs} args - Arguments to filter Dashboard_activities to count.
     * @example
     * // Count the number of Dashboard_activities
     * const count = await prisma.dashboard_activity.count({
     *   where: {
     *     // ... the filter for the Dashboard_activities we want to count
     *   }
     * })
    **/
    count<T extends dashboard_activityCountArgs>(
      args?: Subset<T, dashboard_activityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Dashboard_activityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dashboard_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Dashboard_activityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Dashboard_activityAggregateArgs>(args: Subset<T, Dashboard_activityAggregateArgs>): Prisma.PrismaPromise<GetDashboard_activityAggregateType<T>>

    /**
     * Group by Dashboard_activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboard_activityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dashboard_activityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dashboard_activityGroupByArgs['orderBy'] }
        : { orderBy?: dashboard_activityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dashboard_activityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDashboard_activityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dashboard_activity model
   */
  readonly fields: dashboard_activityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dashboard_activity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dashboard_activityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dashboard_activity model
   */
  interface dashboard_activityFieldRefs {
    readonly activity_id: FieldRef<"dashboard_activity", 'Int'>
    readonly admin_id: FieldRef<"dashboard_activity", 'Int'>
    readonly action: FieldRef<"dashboard_activity", 'String'>
    readonly details: FieldRef<"dashboard_activity", 'String'>
    readonly timestamp: FieldRef<"dashboard_activity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * dashboard_activity findUnique
   */
  export type dashboard_activityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter, which dashboard_activity to fetch.
     */
    where: dashboard_activityWhereUniqueInput
  }

  /**
   * dashboard_activity findUniqueOrThrow
   */
  export type dashboard_activityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter, which dashboard_activity to fetch.
     */
    where: dashboard_activityWhereUniqueInput
  }

  /**
   * dashboard_activity findFirst
   */
  export type dashboard_activityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter, which dashboard_activity to fetch.
     */
    where?: dashboard_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboard_activities to fetch.
     */
    orderBy?: dashboard_activityOrderByWithRelationInput | dashboard_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dashboard_activities.
     */
    cursor?: dashboard_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboard_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboard_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dashboard_activities.
     */
    distinct?: Dashboard_activityScalarFieldEnum | Dashboard_activityScalarFieldEnum[]
  }

  /**
   * dashboard_activity findFirstOrThrow
   */
  export type dashboard_activityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter, which dashboard_activity to fetch.
     */
    where?: dashboard_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboard_activities to fetch.
     */
    orderBy?: dashboard_activityOrderByWithRelationInput | dashboard_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dashboard_activities.
     */
    cursor?: dashboard_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboard_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboard_activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dashboard_activities.
     */
    distinct?: Dashboard_activityScalarFieldEnum | Dashboard_activityScalarFieldEnum[]
  }

  /**
   * dashboard_activity findMany
   */
  export type dashboard_activityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter, which dashboard_activities to fetch.
     */
    where?: dashboard_activityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboard_activities to fetch.
     */
    orderBy?: dashboard_activityOrderByWithRelationInput | dashboard_activityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dashboard_activities.
     */
    cursor?: dashboard_activityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboard_activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboard_activities.
     */
    skip?: number
    distinct?: Dashboard_activityScalarFieldEnum | Dashboard_activityScalarFieldEnum[]
  }

  /**
   * dashboard_activity create
   */
  export type dashboard_activityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * The data needed to create a dashboard_activity.
     */
    data: XOR<dashboard_activityCreateInput, dashboard_activityUncheckedCreateInput>
  }

  /**
   * dashboard_activity createMany
   */
  export type dashboard_activityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dashboard_activities.
     */
    data: dashboard_activityCreateManyInput | dashboard_activityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dashboard_activity createManyAndReturn
   */
  export type dashboard_activityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * The data used to create many dashboard_activities.
     */
    data: dashboard_activityCreateManyInput | dashboard_activityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * dashboard_activity update
   */
  export type dashboard_activityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * The data needed to update a dashboard_activity.
     */
    data: XOR<dashboard_activityUpdateInput, dashboard_activityUncheckedUpdateInput>
    /**
     * Choose, which dashboard_activity to update.
     */
    where: dashboard_activityWhereUniqueInput
  }

  /**
   * dashboard_activity updateMany
   */
  export type dashboard_activityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dashboard_activities.
     */
    data: XOR<dashboard_activityUpdateManyMutationInput, dashboard_activityUncheckedUpdateManyInput>
    /**
     * Filter which dashboard_activities to update
     */
    where?: dashboard_activityWhereInput
    /**
     * Limit how many dashboard_activities to update.
     */
    limit?: number
  }

  /**
   * dashboard_activity updateManyAndReturn
   */
  export type dashboard_activityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * The data used to update dashboard_activities.
     */
    data: XOR<dashboard_activityUpdateManyMutationInput, dashboard_activityUncheckedUpdateManyInput>
    /**
     * Filter which dashboard_activities to update
     */
    where?: dashboard_activityWhereInput
    /**
     * Limit how many dashboard_activities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * dashboard_activity upsert
   */
  export type dashboard_activityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * The filter to search for the dashboard_activity to update in case it exists.
     */
    where: dashboard_activityWhereUniqueInput
    /**
     * In case the dashboard_activity found by the `where` argument doesn't exist, create a new dashboard_activity with this data.
     */
    create: XOR<dashboard_activityCreateInput, dashboard_activityUncheckedCreateInput>
    /**
     * In case the dashboard_activity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dashboard_activityUpdateInput, dashboard_activityUncheckedUpdateInput>
  }

  /**
   * dashboard_activity delete
   */
  export type dashboard_activityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    /**
     * Filter which dashboard_activity to delete.
     */
    where: dashboard_activityWhereUniqueInput
  }

  /**
   * dashboard_activity deleteMany
   */
  export type dashboard_activityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dashboard_activities to delete
     */
    where?: dashboard_activityWhereInput
    /**
     * Limit how many dashboard_activities to delete.
     */
    limit?: number
  }

  /**
   * dashboard_activity without action
   */
  export type dashboard_activityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
  }


  /**
   * Model events
   */

  export type AggregateEvents = {
    _count: EventsCountAggregateOutputType | null
    _avg: EventsAvgAggregateOutputType | null
    _sum: EventsSumAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  export type EventsAvgAggregateOutputType = {
    event_id: number | null
  }

  export type EventsSumAggregateOutputType = {
    event_id: number | null
  }

  export type EventsMinAggregateOutputType = {
    event_id: number | null
    title: string | null
    description: string | null
    event_date: Date | null
    created_at: Date | null
  }

  export type EventsMaxAggregateOutputType = {
    event_id: number | null
    title: string | null
    description: string | null
    event_date: Date | null
    created_at: Date | null
  }

  export type EventsCountAggregateOutputType = {
    event_id: number
    title: number
    description: number
    event_date: number
    created_at: number
    _all: number
  }


  export type EventsAvgAggregateInputType = {
    event_id?: true
  }

  export type EventsSumAggregateInputType = {
    event_id?: true
  }

  export type EventsMinAggregateInputType = {
    event_id?: true
    title?: true
    description?: true
    event_date?: true
    created_at?: true
  }

  export type EventsMaxAggregateInputType = {
    event_id?: true
    title?: true
    description?: true
    event_date?: true
    created_at?: true
  }

  export type EventsCountAggregateInputType = {
    event_id?: true
    title?: true
    description?: true
    event_date?: true
    created_at?: true
    _all?: true
  }

  export type EventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which events to aggregate.
     */
    where?: eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventsOrderByWithRelationInput | eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned events
    **/
    _count?: true | EventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventsMaxAggregateInputType
  }

  export type GetEventsAggregateType<T extends EventsAggregateArgs> = {
        [P in keyof T & keyof AggregateEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvents[P]>
      : GetScalarType<T[P], AggregateEvents[P]>
  }




  export type eventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: eventsWhereInput
    orderBy?: eventsOrderByWithAggregationInput | eventsOrderByWithAggregationInput[]
    by: EventsScalarFieldEnum[] | EventsScalarFieldEnum
    having?: eventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventsCountAggregateInputType | true
    _avg?: EventsAvgAggregateInputType
    _sum?: EventsSumAggregateInputType
    _min?: EventsMinAggregateInputType
    _max?: EventsMaxAggregateInputType
  }

  export type EventsGroupByOutputType = {
    event_id: number
    title: string
    description: string | null
    event_date: Date
    created_at: Date | null
    _count: EventsCountAggregateOutputType | null
    _avg: EventsAvgAggregateOutputType | null
    _sum: EventsSumAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  type GetEventsGroupByPayload<T extends eventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventsGroupByOutputType[P]>
            : GetScalarType<T[P], EventsGroupByOutputType[P]>
        }
      >
    >


  export type eventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    event_id?: boolean
    title?: boolean
    description?: boolean
    event_date?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["events"]>

  export type eventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    event_id?: boolean
    title?: boolean
    description?: boolean
    event_date?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["events"]>

  export type eventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    event_id?: boolean
    title?: boolean
    description?: boolean
    event_date?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["events"]>

  export type eventsSelectScalar = {
    event_id?: boolean
    title?: boolean
    description?: boolean
    event_date?: boolean
    created_at?: boolean
  }

  export type eventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"event_id" | "title" | "description" | "event_date" | "created_at", ExtArgs["result"]["events"]>

  export type $eventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "events"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      event_id: number
      title: string
      description: string | null
      event_date: Date
      created_at: Date | null
    }, ExtArgs["result"]["events"]>
    composites: {}
  }

  type eventsGetPayload<S extends boolean | null | undefined | eventsDefaultArgs> = $Result.GetResult<Prisma.$eventsPayload, S>

  type eventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<eventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventsCountAggregateInputType | true
    }

  export interface eventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['events'], meta: { name: 'events' } }
    /**
     * Find zero or one Events that matches the filter.
     * @param {eventsFindUniqueArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends eventsFindUniqueArgs>(args: SelectSubset<T, eventsFindUniqueArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Events that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {eventsFindUniqueOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends eventsFindUniqueOrThrowArgs>(args: SelectSubset<T, eventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsFindFirstArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends eventsFindFirstArgs>(args?: SelectSubset<T, eventsFindFirstArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsFindFirstOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends eventsFindFirstOrThrowArgs>(args?: SelectSubset<T, eventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.events.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.events.findMany({ take: 10 })
     * 
     * // Only select the `event_id`
     * const eventsWithEvent_idOnly = await prisma.events.findMany({ select: { event_id: true } })
     * 
     */
    findMany<T extends eventsFindManyArgs>(args?: SelectSubset<T, eventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Events.
     * @param {eventsCreateArgs} args - Arguments to create a Events.
     * @example
     * // Create one Events
     * const Events = await prisma.events.create({
     *   data: {
     *     // ... data to create a Events
     *   }
     * })
     * 
     */
    create<T extends eventsCreateArgs>(args: SelectSubset<T, eventsCreateArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {eventsCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends eventsCreateManyArgs>(args?: SelectSubset<T, eventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {eventsCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `event_id`
     * const eventsWithEvent_idOnly = await prisma.events.createManyAndReturn({
     *   select: { event_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends eventsCreateManyAndReturnArgs>(args?: SelectSubset<T, eventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Events.
     * @param {eventsDeleteArgs} args - Arguments to delete one Events.
     * @example
     * // Delete one Events
     * const Events = await prisma.events.delete({
     *   where: {
     *     // ... filter to delete one Events
     *   }
     * })
     * 
     */
    delete<T extends eventsDeleteArgs>(args: SelectSubset<T, eventsDeleteArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Events.
     * @param {eventsUpdateArgs} args - Arguments to update one Events.
     * @example
     * // Update one Events
     * const events = await prisma.events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends eventsUpdateArgs>(args: SelectSubset<T, eventsUpdateArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {eventsDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends eventsDeleteManyArgs>(args?: SelectSubset<T, eventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends eventsUpdateManyArgs>(args: SelectSubset<T, eventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {eventsUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `event_id`
     * const eventsWithEvent_idOnly = await prisma.events.updateManyAndReturn({
     *   select: { event_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends eventsUpdateManyAndReturnArgs>(args: SelectSubset<T, eventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Events.
     * @param {eventsUpsertArgs} args - Arguments to update or create a Events.
     * @example
     * // Update or create a Events
     * const events = await prisma.events.upsert({
     *   create: {
     *     // ... data to create a Events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Events we want to update
     *   }
     * })
     */
    upsert<T extends eventsUpsertArgs>(args: SelectSubset<T, eventsUpsertArgs<ExtArgs>>): Prisma__eventsClient<$Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.events.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends eventsCountArgs>(
      args?: Subset<T, eventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventsAggregateArgs>(args: Subset<T, EventsAggregateArgs>): Prisma.PrismaPromise<GetEventsAggregateType<T>>

    /**
     * Group by Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {eventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends eventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: eventsGroupByArgs['orderBy'] }
        : { orderBy?: eventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, eventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the events model
   */
  readonly fields: eventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for events.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__eventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the events model
   */
  interface eventsFieldRefs {
    readonly event_id: FieldRef<"events", 'Int'>
    readonly title: FieldRef<"events", 'String'>
    readonly description: FieldRef<"events", 'String'>
    readonly event_date: FieldRef<"events", 'DateTime'>
    readonly created_at: FieldRef<"events", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * events findUnique
   */
  export type eventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where: eventsWhereUniqueInput
  }

  /**
   * events findUniqueOrThrow
   */
  export type eventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where: eventsWhereUniqueInput
  }

  /**
   * events findFirst
   */
  export type eventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where?: eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventsOrderByWithRelationInput | eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for events.
     */
    cursor?: eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * events findFirstOrThrow
   */
  export type eventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where?: eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventsOrderByWithRelationInput | eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for events.
     */
    cursor?: eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * events findMany
   */
  export type eventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter, which events to fetch.
     */
    where?: eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of events to fetch.
     */
    orderBy?: eventsOrderByWithRelationInput | eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing events.
     */
    cursor?: eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` events.
     */
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * events create
   */
  export type eventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * The data needed to create a events.
     */
    data: XOR<eventsCreateInput, eventsUncheckedCreateInput>
  }

  /**
   * events createMany
   */
  export type eventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many events.
     */
    data: eventsCreateManyInput | eventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * events createManyAndReturn
   */
  export type eventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * The data used to create many events.
     */
    data: eventsCreateManyInput | eventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * events update
   */
  export type eventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * The data needed to update a events.
     */
    data: XOR<eventsUpdateInput, eventsUncheckedUpdateInput>
    /**
     * Choose, which events to update.
     */
    where: eventsWhereUniqueInput
  }

  /**
   * events updateMany
   */
  export type eventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update events.
     */
    data: XOR<eventsUpdateManyMutationInput, eventsUncheckedUpdateManyInput>
    /**
     * Filter which events to update
     */
    where?: eventsWhereInput
    /**
     * Limit how many events to update.
     */
    limit?: number
  }

  /**
   * events updateManyAndReturn
   */
  export type eventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * The data used to update events.
     */
    data: XOR<eventsUpdateManyMutationInput, eventsUncheckedUpdateManyInput>
    /**
     * Filter which events to update
     */
    where?: eventsWhereInput
    /**
     * Limit how many events to update.
     */
    limit?: number
  }

  /**
   * events upsert
   */
  export type eventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * The filter to search for the events to update in case it exists.
     */
    where: eventsWhereUniqueInput
    /**
     * In case the events found by the `where` argument doesn't exist, create a new events with this data.
     */
    create: XOR<eventsCreateInput, eventsUncheckedCreateInput>
    /**
     * In case the events was found with the provided `where` argument, update it with this data.
     */
    update: XOR<eventsUpdateInput, eventsUncheckedUpdateInput>
  }

  /**
   * events delete
   */
  export type eventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
    /**
     * Filter which events to delete.
     */
    where: eventsWhereUniqueInput
  }

  /**
   * events deleteMany
   */
  export type eventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which events to delete
     */
    where?: eventsWhereInput
    /**
     * Limit how many events to delete.
     */
    limit?: number
  }

  /**
   * events without action
   */
  export type eventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the events
     */
    omit?: eventsOmit<ExtArgs> | null
  }


  /**
   * Model jobs
   */

  export type AggregateJobs = {
    _count: JobsCountAggregateOutputType | null
    _avg: JobsAvgAggregateOutputType | null
    _sum: JobsSumAggregateOutputType | null
    _min: JobsMinAggregateOutputType | null
    _max: JobsMaxAggregateOutputType | null
  }

  export type JobsAvgAggregateOutputType = {
    job_id: number | null
    partner_id: number | null
  }

  export type JobsSumAggregateOutputType = {
    job_id: number | null
    partner_id: number | null
  }

  export type JobsMinAggregateOutputType = {
    job_id: number | null
    job_type: $Enums.JobType | null
    title: string | null
    description: string | null
    company: string | null
    website: string | null
    location: string | null
    partner_id: number | null
    created_at: Date | null
  }

  export type JobsMaxAggregateOutputType = {
    job_id: number | null
    job_type: $Enums.JobType | null
    title: string | null
    description: string | null
    company: string | null
    website: string | null
    location: string | null
    partner_id: number | null
    created_at: Date | null
  }

  export type JobsCountAggregateOutputType = {
    job_id: number
    job_type: number
    title: number
    description: number
    company: number
    website: number
    location: number
    partner_id: number
    created_at: number
    tags: number
    _all: number
  }


  export type JobsAvgAggregateInputType = {
    job_id?: true
    partner_id?: true
  }

  export type JobsSumAggregateInputType = {
    job_id?: true
    partner_id?: true
  }

  export type JobsMinAggregateInputType = {
    job_id?: true
    job_type?: true
    title?: true
    description?: true
    company?: true
    website?: true
    location?: true
    partner_id?: true
    created_at?: true
  }

  export type JobsMaxAggregateInputType = {
    job_id?: true
    job_type?: true
    title?: true
    description?: true
    company?: true
    website?: true
    location?: true
    partner_id?: true
    created_at?: true
  }

  export type JobsCountAggregateInputType = {
    job_id?: true
    job_type?: true
    title?: true
    description?: true
    company?: true
    website?: true
    location?: true
    partner_id?: true
    created_at?: true
    tags?: true
    _all?: true
  }

  export type JobsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which jobs to aggregate.
     */
    where?: jobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jobs to fetch.
     */
    orderBy?: jobsOrderByWithRelationInput | jobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: jobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned jobs
    **/
    _count?: true | JobsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobsMaxAggregateInputType
  }

  export type GetJobsAggregateType<T extends JobsAggregateArgs> = {
        [P in keyof T & keyof AggregateJobs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobs[P]>
      : GetScalarType<T[P], AggregateJobs[P]>
  }




  export type jobsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: jobsWhereInput
    orderBy?: jobsOrderByWithAggregationInput | jobsOrderByWithAggregationInput[]
    by: JobsScalarFieldEnum[] | JobsScalarFieldEnum
    having?: jobsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobsCountAggregateInputType | true
    _avg?: JobsAvgAggregateInputType
    _sum?: JobsSumAggregateInputType
    _min?: JobsMinAggregateInputType
    _max?: JobsMaxAggregateInputType
  }

  export type JobsGroupByOutputType = {
    job_id: number
    job_type: $Enums.JobType
    title: string
    description: string | null
    company: string
    website: string | null
    location: string | null
    partner_id: number | null
    created_at: Date | null
    tags: $Enums.JobTag[]
    _count: JobsCountAggregateOutputType | null
    _avg: JobsAvgAggregateOutputType | null
    _sum: JobsSumAggregateOutputType | null
    _min: JobsMinAggregateOutputType | null
    _max: JobsMaxAggregateOutputType | null
  }

  type GetJobsGroupByPayload<T extends jobsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobsGroupByOutputType[P]>
            : GetScalarType<T[P], JobsGroupByOutputType[P]>
        }
      >
    >


  export type jobsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_type?: boolean
    title?: boolean
    description?: boolean
    company?: boolean
    website?: boolean
    location?: boolean
    partner_id?: boolean
    created_at?: boolean
    tags?: boolean
    applications?: boolean | jobs$applicationsArgs<ExtArgs>
    partners?: boolean | jobs$partnersArgs<ExtArgs>
    _count?: boolean | JobsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobs"]>

  export type jobsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_type?: boolean
    title?: boolean
    description?: boolean
    company?: boolean
    website?: boolean
    location?: boolean
    partner_id?: boolean
    created_at?: boolean
    tags?: boolean
    partners?: boolean | jobs$partnersArgs<ExtArgs>
  }, ExtArgs["result"]["jobs"]>

  export type jobsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    job_id?: boolean
    job_type?: boolean
    title?: boolean
    description?: boolean
    company?: boolean
    website?: boolean
    location?: boolean
    partner_id?: boolean
    created_at?: boolean
    tags?: boolean
    partners?: boolean | jobs$partnersArgs<ExtArgs>
  }, ExtArgs["result"]["jobs"]>

  export type jobsSelectScalar = {
    job_id?: boolean
    job_type?: boolean
    title?: boolean
    description?: boolean
    company?: boolean
    website?: boolean
    location?: boolean
    partner_id?: boolean
    created_at?: boolean
    tags?: boolean
  }

  export type jobsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"job_id" | "job_type" | "title" | "description" | "company" | "website" | "location" | "partner_id" | "created_at" | "tags", ExtArgs["result"]["jobs"]>
  export type jobsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | jobs$applicationsArgs<ExtArgs>
    partners?: boolean | jobs$partnersArgs<ExtArgs>
    _count?: boolean | JobsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type jobsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partners?: boolean | jobs$partnersArgs<ExtArgs>
  }
  export type jobsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partners?: boolean | jobs$partnersArgs<ExtArgs>
  }

  export type $jobsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "jobs"
    objects: {
      applications: Prisma.$applicationsPayload<ExtArgs>[]
      partners: Prisma.$partnersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      job_id: number
      job_type: $Enums.JobType
      title: string
      description: string | null
      company: string
      website: string | null
      location: string | null
      partner_id: number | null
      created_at: Date | null
      tags: $Enums.JobTag[]
    }, ExtArgs["result"]["jobs"]>
    composites: {}
  }

  type jobsGetPayload<S extends boolean | null | undefined | jobsDefaultArgs> = $Result.GetResult<Prisma.$jobsPayload, S>

  type jobsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<jobsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobsCountAggregateInputType | true
    }

  export interface jobsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['jobs'], meta: { name: 'jobs' } }
    /**
     * Find zero or one Jobs that matches the filter.
     * @param {jobsFindUniqueArgs} args - Arguments to find a Jobs
     * @example
     * // Get one Jobs
     * const jobs = await prisma.jobs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends jobsFindUniqueArgs>(args: SelectSubset<T, jobsFindUniqueArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Jobs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {jobsFindUniqueOrThrowArgs} args - Arguments to find a Jobs
     * @example
     * // Get one Jobs
     * const jobs = await prisma.jobs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends jobsFindUniqueOrThrowArgs>(args: SelectSubset<T, jobsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsFindFirstArgs} args - Arguments to find a Jobs
     * @example
     * // Get one Jobs
     * const jobs = await prisma.jobs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends jobsFindFirstArgs>(args?: SelectSubset<T, jobsFindFirstArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jobs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsFindFirstOrThrowArgs} args - Arguments to find a Jobs
     * @example
     * // Get one Jobs
     * const jobs = await prisma.jobs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends jobsFindFirstOrThrowArgs>(args?: SelectSubset<T, jobsFindFirstOrThrowArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.jobs.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.jobs.findMany({ take: 10 })
     * 
     * // Only select the `job_id`
     * const jobsWithJob_idOnly = await prisma.jobs.findMany({ select: { job_id: true } })
     * 
     */
    findMany<T extends jobsFindManyArgs>(args?: SelectSubset<T, jobsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Jobs.
     * @param {jobsCreateArgs} args - Arguments to create a Jobs.
     * @example
     * // Create one Jobs
     * const Jobs = await prisma.jobs.create({
     *   data: {
     *     // ... data to create a Jobs
     *   }
     * })
     * 
     */
    create<T extends jobsCreateArgs>(args: SelectSubset<T, jobsCreateArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {jobsCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const jobs = await prisma.jobs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends jobsCreateManyArgs>(args?: SelectSubset<T, jobsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {jobsCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const jobs = await prisma.jobs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `job_id`
     * const jobsWithJob_idOnly = await prisma.jobs.createManyAndReturn({
     *   select: { job_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends jobsCreateManyAndReturnArgs>(args?: SelectSubset<T, jobsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Jobs.
     * @param {jobsDeleteArgs} args - Arguments to delete one Jobs.
     * @example
     * // Delete one Jobs
     * const Jobs = await prisma.jobs.delete({
     *   where: {
     *     // ... filter to delete one Jobs
     *   }
     * })
     * 
     */
    delete<T extends jobsDeleteArgs>(args: SelectSubset<T, jobsDeleteArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Jobs.
     * @param {jobsUpdateArgs} args - Arguments to update one Jobs.
     * @example
     * // Update one Jobs
     * const jobs = await prisma.jobs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends jobsUpdateArgs>(args: SelectSubset<T, jobsUpdateArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {jobsDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.jobs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends jobsDeleteManyArgs>(args?: SelectSubset<T, jobsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const jobs = await prisma.jobs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends jobsUpdateManyArgs>(args: SelectSubset<T, jobsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs and returns the data updated in the database.
     * @param {jobsUpdateManyAndReturnArgs} args - Arguments to update many Jobs.
     * @example
     * // Update many Jobs
     * const jobs = await prisma.jobs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jobs and only return the `job_id`
     * const jobsWithJob_idOnly = await prisma.jobs.updateManyAndReturn({
     *   select: { job_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends jobsUpdateManyAndReturnArgs>(args: SelectSubset<T, jobsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Jobs.
     * @param {jobsUpsertArgs} args - Arguments to update or create a Jobs.
     * @example
     * // Update or create a Jobs
     * const jobs = await prisma.jobs.upsert({
     *   create: {
     *     // ... data to create a Jobs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Jobs we want to update
     *   }
     * })
     */
    upsert<T extends jobsUpsertArgs>(args: SelectSubset<T, jobsUpsertArgs<ExtArgs>>): Prisma__jobsClient<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.jobs.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends jobsCountArgs>(
      args?: Subset<T, jobsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobsAggregateArgs>(args: Subset<T, JobsAggregateArgs>): Prisma.PrismaPromise<GetJobsAggregateType<T>>

    /**
     * Group by Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jobsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends jobsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: jobsGroupByArgs['orderBy'] }
        : { orderBy?: jobsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, jobsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the jobs model
   */
  readonly fields: jobsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for jobs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__jobsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends jobs$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, jobs$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    partners<T extends jobs$partnersArgs<ExtArgs> = {}>(args?: Subset<T, jobs$partnersArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the jobs model
   */
  interface jobsFieldRefs {
    readonly job_id: FieldRef<"jobs", 'Int'>
    readonly job_type: FieldRef<"jobs", 'JobType'>
    readonly title: FieldRef<"jobs", 'String'>
    readonly description: FieldRef<"jobs", 'String'>
    readonly company: FieldRef<"jobs", 'String'>
    readonly website: FieldRef<"jobs", 'String'>
    readonly location: FieldRef<"jobs", 'String'>
    readonly partner_id: FieldRef<"jobs", 'Int'>
    readonly created_at: FieldRef<"jobs", 'DateTime'>
    readonly tags: FieldRef<"jobs", 'JobTag[]'>
  }
    

  // Custom InputTypes
  /**
   * jobs findUnique
   */
  export type jobsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter, which jobs to fetch.
     */
    where: jobsWhereUniqueInput
  }

  /**
   * jobs findUniqueOrThrow
   */
  export type jobsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter, which jobs to fetch.
     */
    where: jobsWhereUniqueInput
  }

  /**
   * jobs findFirst
   */
  export type jobsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter, which jobs to fetch.
     */
    where?: jobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jobs to fetch.
     */
    orderBy?: jobsOrderByWithRelationInput | jobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for jobs.
     */
    cursor?: jobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of jobs.
     */
    distinct?: JobsScalarFieldEnum | JobsScalarFieldEnum[]
  }

  /**
   * jobs findFirstOrThrow
   */
  export type jobsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter, which jobs to fetch.
     */
    where?: jobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jobs to fetch.
     */
    orderBy?: jobsOrderByWithRelationInput | jobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for jobs.
     */
    cursor?: jobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of jobs.
     */
    distinct?: JobsScalarFieldEnum | JobsScalarFieldEnum[]
  }

  /**
   * jobs findMany
   */
  export type jobsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter, which jobs to fetch.
     */
    where?: jobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jobs to fetch.
     */
    orderBy?: jobsOrderByWithRelationInput | jobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing jobs.
     */
    cursor?: jobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jobs.
     */
    skip?: number
    distinct?: JobsScalarFieldEnum | JobsScalarFieldEnum[]
  }

  /**
   * jobs create
   */
  export type jobsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * The data needed to create a jobs.
     */
    data: XOR<jobsCreateInput, jobsUncheckedCreateInput>
  }

  /**
   * jobs createMany
   */
  export type jobsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many jobs.
     */
    data: jobsCreateManyInput | jobsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * jobs createManyAndReturn
   */
  export type jobsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * The data used to create many jobs.
     */
    data: jobsCreateManyInput | jobsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * jobs update
   */
  export type jobsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * The data needed to update a jobs.
     */
    data: XOR<jobsUpdateInput, jobsUncheckedUpdateInput>
    /**
     * Choose, which jobs to update.
     */
    where: jobsWhereUniqueInput
  }

  /**
   * jobs updateMany
   */
  export type jobsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update jobs.
     */
    data: XOR<jobsUpdateManyMutationInput, jobsUncheckedUpdateManyInput>
    /**
     * Filter which jobs to update
     */
    where?: jobsWhereInput
    /**
     * Limit how many jobs to update.
     */
    limit?: number
  }

  /**
   * jobs updateManyAndReturn
   */
  export type jobsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * The data used to update jobs.
     */
    data: XOR<jobsUpdateManyMutationInput, jobsUncheckedUpdateManyInput>
    /**
     * Filter which jobs to update
     */
    where?: jobsWhereInput
    /**
     * Limit how many jobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * jobs upsert
   */
  export type jobsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * The filter to search for the jobs to update in case it exists.
     */
    where: jobsWhereUniqueInput
    /**
     * In case the jobs found by the `where` argument doesn't exist, create a new jobs with this data.
     */
    create: XOR<jobsCreateInput, jobsUncheckedCreateInput>
    /**
     * In case the jobs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<jobsUpdateInput, jobsUncheckedUpdateInput>
  }

  /**
   * jobs delete
   */
  export type jobsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    /**
     * Filter which jobs to delete.
     */
    where: jobsWhereUniqueInput
  }

  /**
   * jobs deleteMany
   */
  export type jobsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which jobs to delete
     */
    where?: jobsWhereInput
    /**
     * Limit how many jobs to delete.
     */
    limit?: number
  }

  /**
   * jobs.applications
   */
  export type jobs$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    where?: applicationsWhereInput
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    cursor?: applicationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * jobs.partners
   */
  export type jobs$partnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    where?: partnersWhereInput
  }

  /**
   * jobs without action
   */
  export type jobsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
  }


  /**
   * Model partners
   */

  export type AggregatePartners = {
    _count: PartnersCountAggregateOutputType | null
    _avg: PartnersAvgAggregateOutputType | null
    _sum: PartnersSumAggregateOutputType | null
    _min: PartnersMinAggregateOutputType | null
    _max: PartnersMaxAggregateOutputType | null
  }

  export type PartnersAvgAggregateOutputType = {
    partner_id: number | null
    jobs_available: number | null
    applicants: number | null
    applicants_hired: number | null
  }

  export type PartnersSumAggregateOutputType = {
    partner_id: number | null
    jobs_available: number | null
    applicants: number | null
    applicants_hired: number | null
  }

  export type PartnersMinAggregateOutputType = {
    partner_id: number | null
    name: string | null
    description: string | null
    industry: string | null
    location: string | null
    jobs_available: number | null
    applicants: number | null
    applicants_hired: number | null
  }

  export type PartnersMaxAggregateOutputType = {
    partner_id: number | null
    name: string | null
    description: string | null
    industry: string | null
    location: string | null
    jobs_available: number | null
    applicants: number | null
    applicants_hired: number | null
  }

  export type PartnersCountAggregateOutputType = {
    partner_id: number
    name: number
    description: number
    industry: number
    location: number
    jobs_available: number
    applicants: number
    applicants_hired: number
    _all: number
  }


  export type PartnersAvgAggregateInputType = {
    partner_id?: true
    jobs_available?: true
    applicants?: true
    applicants_hired?: true
  }

  export type PartnersSumAggregateInputType = {
    partner_id?: true
    jobs_available?: true
    applicants?: true
    applicants_hired?: true
  }

  export type PartnersMinAggregateInputType = {
    partner_id?: true
    name?: true
    description?: true
    industry?: true
    location?: true
    jobs_available?: true
    applicants?: true
    applicants_hired?: true
  }

  export type PartnersMaxAggregateInputType = {
    partner_id?: true
    name?: true
    description?: true
    industry?: true
    location?: true
    jobs_available?: true
    applicants?: true
    applicants_hired?: true
  }

  export type PartnersCountAggregateInputType = {
    partner_id?: true
    name?: true
    description?: true
    industry?: true
    location?: true
    jobs_available?: true
    applicants?: true
    applicants_hired?: true
    _all?: true
  }

  export type PartnersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which partners to aggregate.
     */
    where?: partnersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of partners to fetch.
     */
    orderBy?: partnersOrderByWithRelationInput | partnersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: partnersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned partners
    **/
    _count?: true | PartnersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartnersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartnersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartnersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartnersMaxAggregateInputType
  }

  export type GetPartnersAggregateType<T extends PartnersAggregateArgs> = {
        [P in keyof T & keyof AggregatePartners]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartners[P]>
      : GetScalarType<T[P], AggregatePartners[P]>
  }




  export type partnersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: partnersWhereInput
    orderBy?: partnersOrderByWithAggregationInput | partnersOrderByWithAggregationInput[]
    by: PartnersScalarFieldEnum[] | PartnersScalarFieldEnum
    having?: partnersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartnersCountAggregateInputType | true
    _avg?: PartnersAvgAggregateInputType
    _sum?: PartnersSumAggregateInputType
    _min?: PartnersMinAggregateInputType
    _max?: PartnersMaxAggregateInputType
  }

  export type PartnersGroupByOutputType = {
    partner_id: number
    name: string
    description: string | null
    industry: string | null
    location: string | null
    jobs_available: number | null
    applicants: number | null
    applicants_hired: number | null
    _count: PartnersCountAggregateOutputType | null
    _avg: PartnersAvgAggregateOutputType | null
    _sum: PartnersSumAggregateOutputType | null
    _min: PartnersMinAggregateOutputType | null
    _max: PartnersMaxAggregateOutputType | null
  }

  type GetPartnersGroupByPayload<T extends partnersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartnersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartnersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartnersGroupByOutputType[P]>
            : GetScalarType<T[P], PartnersGroupByOutputType[P]>
        }
      >
    >


  export type partnersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    partner_id?: boolean
    name?: boolean
    description?: boolean
    industry?: boolean
    location?: boolean
    jobs_available?: boolean
    applicants?: boolean
    applicants_hired?: boolean
    jobs?: boolean | partners$jobsArgs<ExtArgs>
    _count?: boolean | PartnersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partners"]>

  export type partnersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    partner_id?: boolean
    name?: boolean
    description?: boolean
    industry?: boolean
    location?: boolean
    jobs_available?: boolean
    applicants?: boolean
    applicants_hired?: boolean
  }, ExtArgs["result"]["partners"]>

  export type partnersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    partner_id?: boolean
    name?: boolean
    description?: boolean
    industry?: boolean
    location?: boolean
    jobs_available?: boolean
    applicants?: boolean
    applicants_hired?: boolean
  }, ExtArgs["result"]["partners"]>

  export type partnersSelectScalar = {
    partner_id?: boolean
    name?: boolean
    description?: boolean
    industry?: boolean
    location?: boolean
    jobs_available?: boolean
    applicants?: boolean
    applicants_hired?: boolean
  }

  export type partnersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"partner_id" | "name" | "description" | "industry" | "location" | "jobs_available" | "applicants" | "applicants_hired", ExtArgs["result"]["partners"]>
  export type partnersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | partners$jobsArgs<ExtArgs>
    _count?: boolean | PartnersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type partnersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type partnersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $partnersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "partners"
    objects: {
      jobs: Prisma.$jobsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      partner_id: number
      name: string
      description: string | null
      industry: string | null
      location: string | null
      jobs_available: number | null
      applicants: number | null
      applicants_hired: number | null
    }, ExtArgs["result"]["partners"]>
    composites: {}
  }

  type partnersGetPayload<S extends boolean | null | undefined | partnersDefaultArgs> = $Result.GetResult<Prisma.$partnersPayload, S>

  type partnersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<partnersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartnersCountAggregateInputType | true
    }

  export interface partnersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['partners'], meta: { name: 'partners' } }
    /**
     * Find zero or one Partners that matches the filter.
     * @param {partnersFindUniqueArgs} args - Arguments to find a Partners
     * @example
     * // Get one Partners
     * const partners = await prisma.partners.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends partnersFindUniqueArgs>(args: SelectSubset<T, partnersFindUniqueArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Partners that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {partnersFindUniqueOrThrowArgs} args - Arguments to find a Partners
     * @example
     * // Get one Partners
     * const partners = await prisma.partners.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends partnersFindUniqueOrThrowArgs>(args: SelectSubset<T, partnersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersFindFirstArgs} args - Arguments to find a Partners
     * @example
     * // Get one Partners
     * const partners = await prisma.partners.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends partnersFindFirstArgs>(args?: SelectSubset<T, partnersFindFirstArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partners that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersFindFirstOrThrowArgs} args - Arguments to find a Partners
     * @example
     * // Get one Partners
     * const partners = await prisma.partners.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends partnersFindFirstOrThrowArgs>(args?: SelectSubset<T, partnersFindFirstOrThrowArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Partners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Partners
     * const partners = await prisma.partners.findMany()
     * 
     * // Get first 10 Partners
     * const partners = await prisma.partners.findMany({ take: 10 })
     * 
     * // Only select the `partner_id`
     * const partnersWithPartner_idOnly = await prisma.partners.findMany({ select: { partner_id: true } })
     * 
     */
    findMany<T extends partnersFindManyArgs>(args?: SelectSubset<T, partnersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Partners.
     * @param {partnersCreateArgs} args - Arguments to create a Partners.
     * @example
     * // Create one Partners
     * const Partners = await prisma.partners.create({
     *   data: {
     *     // ... data to create a Partners
     *   }
     * })
     * 
     */
    create<T extends partnersCreateArgs>(args: SelectSubset<T, partnersCreateArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Partners.
     * @param {partnersCreateManyArgs} args - Arguments to create many Partners.
     * @example
     * // Create many Partners
     * const partners = await prisma.partners.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends partnersCreateManyArgs>(args?: SelectSubset<T, partnersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Partners and returns the data saved in the database.
     * @param {partnersCreateManyAndReturnArgs} args - Arguments to create many Partners.
     * @example
     * // Create many Partners
     * const partners = await prisma.partners.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Partners and only return the `partner_id`
     * const partnersWithPartner_idOnly = await prisma.partners.createManyAndReturn({
     *   select: { partner_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends partnersCreateManyAndReturnArgs>(args?: SelectSubset<T, partnersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Partners.
     * @param {partnersDeleteArgs} args - Arguments to delete one Partners.
     * @example
     * // Delete one Partners
     * const Partners = await prisma.partners.delete({
     *   where: {
     *     // ... filter to delete one Partners
     *   }
     * })
     * 
     */
    delete<T extends partnersDeleteArgs>(args: SelectSubset<T, partnersDeleteArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Partners.
     * @param {partnersUpdateArgs} args - Arguments to update one Partners.
     * @example
     * // Update one Partners
     * const partners = await prisma.partners.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends partnersUpdateArgs>(args: SelectSubset<T, partnersUpdateArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Partners.
     * @param {partnersDeleteManyArgs} args - Arguments to filter Partners to delete.
     * @example
     * // Delete a few Partners
     * const { count } = await prisma.partners.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends partnersDeleteManyArgs>(args?: SelectSubset<T, partnersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Partners
     * const partners = await prisma.partners.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends partnersUpdateManyArgs>(args: SelectSubset<T, partnersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Partners and returns the data updated in the database.
     * @param {partnersUpdateManyAndReturnArgs} args - Arguments to update many Partners.
     * @example
     * // Update many Partners
     * const partners = await prisma.partners.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Partners and only return the `partner_id`
     * const partnersWithPartner_idOnly = await prisma.partners.updateManyAndReturn({
     *   select: { partner_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends partnersUpdateManyAndReturnArgs>(args: SelectSubset<T, partnersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Partners.
     * @param {partnersUpsertArgs} args - Arguments to update or create a Partners.
     * @example
     * // Update or create a Partners
     * const partners = await prisma.partners.upsert({
     *   create: {
     *     // ... data to create a Partners
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Partners we want to update
     *   }
     * })
     */
    upsert<T extends partnersUpsertArgs>(args: SelectSubset<T, partnersUpsertArgs<ExtArgs>>): Prisma__partnersClient<$Result.GetResult<Prisma.$partnersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersCountArgs} args - Arguments to filter Partners to count.
     * @example
     * // Count the number of Partners
     * const count = await prisma.partners.count({
     *   where: {
     *     // ... the filter for the Partners we want to count
     *   }
     * })
    **/
    count<T extends partnersCountArgs>(
      args?: Subset<T, partnersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartnersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PartnersAggregateArgs>(args: Subset<T, PartnersAggregateArgs>): Prisma.PrismaPromise<GetPartnersAggregateType<T>>

    /**
     * Group by Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {partnersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends partnersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: partnersGroupByArgs['orderBy'] }
        : { orderBy?: partnersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, partnersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartnersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the partners model
   */
  readonly fields: partnersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for partners.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__partnersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jobs<T extends partners$jobsArgs<ExtArgs> = {}>(args?: Subset<T, partners$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jobsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the partners model
   */
  interface partnersFieldRefs {
    readonly partner_id: FieldRef<"partners", 'Int'>
    readonly name: FieldRef<"partners", 'String'>
    readonly description: FieldRef<"partners", 'String'>
    readonly industry: FieldRef<"partners", 'String'>
    readonly location: FieldRef<"partners", 'String'>
    readonly jobs_available: FieldRef<"partners", 'Int'>
    readonly applicants: FieldRef<"partners", 'Int'>
    readonly applicants_hired: FieldRef<"partners", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * partners findUnique
   */
  export type partnersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter, which partners to fetch.
     */
    where: partnersWhereUniqueInput
  }

  /**
   * partners findUniqueOrThrow
   */
  export type partnersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter, which partners to fetch.
     */
    where: partnersWhereUniqueInput
  }

  /**
   * partners findFirst
   */
  export type partnersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter, which partners to fetch.
     */
    where?: partnersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of partners to fetch.
     */
    orderBy?: partnersOrderByWithRelationInput | partnersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for partners.
     */
    cursor?: partnersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of partners.
     */
    distinct?: PartnersScalarFieldEnum | PartnersScalarFieldEnum[]
  }

  /**
   * partners findFirstOrThrow
   */
  export type partnersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter, which partners to fetch.
     */
    where?: partnersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of partners to fetch.
     */
    orderBy?: partnersOrderByWithRelationInput | partnersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for partners.
     */
    cursor?: partnersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of partners.
     */
    distinct?: PartnersScalarFieldEnum | PartnersScalarFieldEnum[]
  }

  /**
   * partners findMany
   */
  export type partnersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter, which partners to fetch.
     */
    where?: partnersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of partners to fetch.
     */
    orderBy?: partnersOrderByWithRelationInput | partnersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing partners.
     */
    cursor?: partnersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` partners.
     */
    skip?: number
    distinct?: PartnersScalarFieldEnum | PartnersScalarFieldEnum[]
  }

  /**
   * partners create
   */
  export type partnersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * The data needed to create a partners.
     */
    data: XOR<partnersCreateInput, partnersUncheckedCreateInput>
  }

  /**
   * partners createMany
   */
  export type partnersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many partners.
     */
    data: partnersCreateManyInput | partnersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * partners createManyAndReturn
   */
  export type partnersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * The data used to create many partners.
     */
    data: partnersCreateManyInput | partnersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * partners update
   */
  export type partnersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * The data needed to update a partners.
     */
    data: XOR<partnersUpdateInput, partnersUncheckedUpdateInput>
    /**
     * Choose, which partners to update.
     */
    where: partnersWhereUniqueInput
  }

  /**
   * partners updateMany
   */
  export type partnersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update partners.
     */
    data: XOR<partnersUpdateManyMutationInput, partnersUncheckedUpdateManyInput>
    /**
     * Filter which partners to update
     */
    where?: partnersWhereInput
    /**
     * Limit how many partners to update.
     */
    limit?: number
  }

  /**
   * partners updateManyAndReturn
   */
  export type partnersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * The data used to update partners.
     */
    data: XOR<partnersUpdateManyMutationInput, partnersUncheckedUpdateManyInput>
    /**
     * Filter which partners to update
     */
    where?: partnersWhereInput
    /**
     * Limit how many partners to update.
     */
    limit?: number
  }

  /**
   * partners upsert
   */
  export type partnersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * The filter to search for the partners to update in case it exists.
     */
    where: partnersWhereUniqueInput
    /**
     * In case the partners found by the `where` argument doesn't exist, create a new partners with this data.
     */
    create: XOR<partnersCreateInput, partnersUncheckedCreateInput>
    /**
     * In case the partners was found with the provided `where` argument, update it with this data.
     */
    update: XOR<partnersUpdateInput, partnersUncheckedUpdateInput>
  }

  /**
   * partners delete
   */
  export type partnersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
    /**
     * Filter which partners to delete.
     */
    where: partnersWhereUniqueInput
  }

  /**
   * partners deleteMany
   */
  export type partnersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which partners to delete
     */
    where?: partnersWhereInput
    /**
     * Limit how many partners to delete.
     */
    limit?: number
  }

  /**
   * partners.jobs
   */
  export type partners$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jobs
     */
    select?: jobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jobs
     */
    omit?: jobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jobsInclude<ExtArgs> | null
    where?: jobsWhereInput
    orderBy?: jobsOrderByWithRelationInput | jobsOrderByWithRelationInput[]
    cursor?: jobsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobsScalarFieldEnum | JobsScalarFieldEnum[]
  }

  /**
   * partners without action
   */
  export type partnersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the partners
     */
    select?: partnersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the partners
     */
    omit?: partnersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: partnersInclude<ExtArgs> | null
  }


  /**
   * Model resumes
   */

  export type AggregateResumes = {
    _count: ResumesCountAggregateOutputType | null
    _avg: ResumesAvgAggregateOutputType | null
    _sum: ResumesSumAggregateOutputType | null
    _min: ResumesMinAggregateOutputType | null
    _max: ResumesMaxAggregateOutputType | null
  }

  export type ResumesAvgAggregateOutputType = {
    resume_id: number | null
    user_id: number | null
  }

  export type ResumesSumAggregateOutputType = {
    resume_id: number | null
    user_id: number | null
  }

  export type ResumesMinAggregateOutputType = {
    resume_id: number | null
    user_id: number | null
    file_path: string | null
    file_name: string | null
    is_default: boolean | null
    created_at: Date | null
  }

  export type ResumesMaxAggregateOutputType = {
    resume_id: number | null
    user_id: number | null
    file_path: string | null
    file_name: string | null
    is_default: boolean | null
    created_at: Date | null
  }

  export type ResumesCountAggregateOutputType = {
    resume_id: number
    user_id: number
    file_path: number
    file_name: number
    is_default: number
    created_at: number
    _all: number
  }


  export type ResumesAvgAggregateInputType = {
    resume_id?: true
    user_id?: true
  }

  export type ResumesSumAggregateInputType = {
    resume_id?: true
    user_id?: true
  }

  export type ResumesMinAggregateInputType = {
    resume_id?: true
    user_id?: true
    file_path?: true
    file_name?: true
    is_default?: true
    created_at?: true
  }

  export type ResumesMaxAggregateInputType = {
    resume_id?: true
    user_id?: true
    file_path?: true
    file_name?: true
    is_default?: true
    created_at?: true
  }

  export type ResumesCountAggregateInputType = {
    resume_id?: true
    user_id?: true
    file_path?: true
    file_name?: true
    is_default?: true
    created_at?: true
    _all?: true
  }

  export type ResumesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which resumes to aggregate.
     */
    where?: resumesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of resumes to fetch.
     */
    orderBy?: resumesOrderByWithRelationInput | resumesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: resumesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned resumes
    **/
    _count?: true | ResumesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumesMaxAggregateInputType
  }

  export type GetResumesAggregateType<T extends ResumesAggregateArgs> = {
        [P in keyof T & keyof AggregateResumes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResumes[P]>
      : GetScalarType<T[P], AggregateResumes[P]>
  }




  export type resumesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: resumesWhereInput
    orderBy?: resumesOrderByWithAggregationInput | resumesOrderByWithAggregationInput[]
    by: ResumesScalarFieldEnum[] | ResumesScalarFieldEnum
    having?: resumesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumesCountAggregateInputType | true
    _avg?: ResumesAvgAggregateInputType
    _sum?: ResumesSumAggregateInputType
    _min?: ResumesMinAggregateInputType
    _max?: ResumesMaxAggregateInputType
  }

  export type ResumesGroupByOutputType = {
    resume_id: number
    user_id: number
    file_path: string
    file_name: string
    is_default: boolean | null
    created_at: Date | null
    _count: ResumesCountAggregateOutputType | null
    _avg: ResumesAvgAggregateOutputType | null
    _sum: ResumesSumAggregateOutputType | null
    _min: ResumesMinAggregateOutputType | null
    _max: ResumesMaxAggregateOutputType | null
  }

  type GetResumesGroupByPayload<T extends resumesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumesGroupByOutputType[P]>
            : GetScalarType<T[P], ResumesGroupByOutputType[P]>
        }
      >
    >


  export type resumesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    resume_id?: boolean
    user_id?: boolean
    file_path?: boolean
    file_name?: boolean
    is_default?: boolean
    created_at?: boolean
    applications?: boolean | resumes$applicationsArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
    _count?: boolean | ResumesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumes"]>

  export type resumesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    resume_id?: boolean
    user_id?: boolean
    file_path?: boolean
    file_name?: boolean
    is_default?: boolean
    created_at?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumes"]>

  export type resumesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    resume_id?: boolean
    user_id?: boolean
    file_path?: boolean
    file_name?: boolean
    is_default?: boolean
    created_at?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumes"]>

  export type resumesSelectScalar = {
    resume_id?: boolean
    user_id?: boolean
    file_path?: boolean
    file_name?: boolean
    is_default?: boolean
    created_at?: boolean
  }

  export type resumesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"resume_id" | "user_id" | "file_path" | "file_name" | "is_default" | "created_at", ExtArgs["result"]["resumes"]>
  export type resumesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | resumes$applicationsArgs<ExtArgs>
    users?: boolean | usersDefaultArgs<ExtArgs>
    _count?: boolean | ResumesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type resumesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type resumesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $resumesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "resumes"
    objects: {
      applications: Prisma.$applicationsPayload<ExtArgs>[]
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      resume_id: number
      user_id: number
      file_path: string
      file_name: string
      is_default: boolean | null
      created_at: Date | null
    }, ExtArgs["result"]["resumes"]>
    composites: {}
  }

  type resumesGetPayload<S extends boolean | null | undefined | resumesDefaultArgs> = $Result.GetResult<Prisma.$resumesPayload, S>

  type resumesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<resumesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumesCountAggregateInputType | true
    }

  export interface resumesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['resumes'], meta: { name: 'resumes' } }
    /**
     * Find zero or one Resumes that matches the filter.
     * @param {resumesFindUniqueArgs} args - Arguments to find a Resumes
     * @example
     * // Get one Resumes
     * const resumes = await prisma.resumes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends resumesFindUniqueArgs>(args: SelectSubset<T, resumesFindUniqueArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resumes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {resumesFindUniqueOrThrowArgs} args - Arguments to find a Resumes
     * @example
     * // Get one Resumes
     * const resumes = await prisma.resumes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends resumesFindUniqueOrThrowArgs>(args: SelectSubset<T, resumesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesFindFirstArgs} args - Arguments to find a Resumes
     * @example
     * // Get one Resumes
     * const resumes = await prisma.resumes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends resumesFindFirstArgs>(args?: SelectSubset<T, resumesFindFirstArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resumes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesFindFirstOrThrowArgs} args - Arguments to find a Resumes
     * @example
     * // Get one Resumes
     * const resumes = await prisma.resumes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends resumesFindFirstOrThrowArgs>(args?: SelectSubset<T, resumesFindFirstOrThrowArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resumes.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resumes.findMany({ take: 10 })
     * 
     * // Only select the `resume_id`
     * const resumesWithResume_idOnly = await prisma.resumes.findMany({ select: { resume_id: true } })
     * 
     */
    findMany<T extends resumesFindManyArgs>(args?: SelectSubset<T, resumesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resumes.
     * @param {resumesCreateArgs} args - Arguments to create a Resumes.
     * @example
     * // Create one Resumes
     * const Resumes = await prisma.resumes.create({
     *   data: {
     *     // ... data to create a Resumes
     *   }
     * })
     * 
     */
    create<T extends resumesCreateArgs>(args: SelectSubset<T, resumesCreateArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resumes.
     * @param {resumesCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resumes = await prisma.resumes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends resumesCreateManyArgs>(args?: SelectSubset<T, resumesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {resumesCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resumes = await prisma.resumes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `resume_id`
     * const resumesWithResume_idOnly = await prisma.resumes.createManyAndReturn({
     *   select: { resume_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends resumesCreateManyAndReturnArgs>(args?: SelectSubset<T, resumesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resumes.
     * @param {resumesDeleteArgs} args - Arguments to delete one Resumes.
     * @example
     * // Delete one Resumes
     * const Resumes = await prisma.resumes.delete({
     *   where: {
     *     // ... filter to delete one Resumes
     *   }
     * })
     * 
     */
    delete<T extends resumesDeleteArgs>(args: SelectSubset<T, resumesDeleteArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resumes.
     * @param {resumesUpdateArgs} args - Arguments to update one Resumes.
     * @example
     * // Update one Resumes
     * const resumes = await prisma.resumes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends resumesUpdateArgs>(args: SelectSubset<T, resumesUpdateArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resumes.
     * @param {resumesDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resumes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends resumesDeleteManyArgs>(args?: SelectSubset<T, resumesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resumes = await prisma.resumes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends resumesUpdateManyArgs>(args: SelectSubset<T, resumesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes and returns the data updated in the database.
     * @param {resumesUpdateManyAndReturnArgs} args - Arguments to update many Resumes.
     * @example
     * // Update many Resumes
     * const resumes = await prisma.resumes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resumes and only return the `resume_id`
     * const resumesWithResume_idOnly = await prisma.resumes.updateManyAndReturn({
     *   select: { resume_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends resumesUpdateManyAndReturnArgs>(args: SelectSubset<T, resumesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resumes.
     * @param {resumesUpsertArgs} args - Arguments to update or create a Resumes.
     * @example
     * // Update or create a Resumes
     * const resumes = await prisma.resumes.upsert({
     *   create: {
     *     // ... data to create a Resumes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resumes we want to update
     *   }
     * })
     */
    upsert<T extends resumesUpsertArgs>(args: SelectSubset<T, resumesUpsertArgs<ExtArgs>>): Prisma__resumesClient<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resumes.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends resumesCountArgs>(
      args?: Subset<T, resumesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumesAggregateArgs>(args: Subset<T, ResumesAggregateArgs>): Prisma.PrismaPromise<GetResumesAggregateType<T>>

    /**
     * Group by Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {resumesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends resumesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: resumesGroupByArgs['orderBy'] }
        : { orderBy?: resumesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, resumesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the resumes model
   */
  readonly fields: resumesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for resumes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__resumesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends resumes$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, resumes$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the resumes model
   */
  interface resumesFieldRefs {
    readonly resume_id: FieldRef<"resumes", 'Int'>
    readonly user_id: FieldRef<"resumes", 'Int'>
    readonly file_path: FieldRef<"resumes", 'String'>
    readonly file_name: FieldRef<"resumes", 'String'>
    readonly is_default: FieldRef<"resumes", 'Boolean'>
    readonly created_at: FieldRef<"resumes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * resumes findUnique
   */
  export type resumesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter, which resumes to fetch.
     */
    where: resumesWhereUniqueInput
  }

  /**
   * resumes findUniqueOrThrow
   */
  export type resumesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter, which resumes to fetch.
     */
    where: resumesWhereUniqueInput
  }

  /**
   * resumes findFirst
   */
  export type resumesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter, which resumes to fetch.
     */
    where?: resumesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of resumes to fetch.
     */
    orderBy?: resumesOrderByWithRelationInput | resumesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for resumes.
     */
    cursor?: resumesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of resumes.
     */
    distinct?: ResumesScalarFieldEnum | ResumesScalarFieldEnum[]
  }

  /**
   * resumes findFirstOrThrow
   */
  export type resumesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter, which resumes to fetch.
     */
    where?: resumesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of resumes to fetch.
     */
    orderBy?: resumesOrderByWithRelationInput | resumesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for resumes.
     */
    cursor?: resumesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of resumes.
     */
    distinct?: ResumesScalarFieldEnum | ResumesScalarFieldEnum[]
  }

  /**
   * resumes findMany
   */
  export type resumesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter, which resumes to fetch.
     */
    where?: resumesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of resumes to fetch.
     */
    orderBy?: resumesOrderByWithRelationInput | resumesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing resumes.
     */
    cursor?: resumesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` resumes.
     */
    skip?: number
    distinct?: ResumesScalarFieldEnum | ResumesScalarFieldEnum[]
  }

  /**
   * resumes create
   */
  export type resumesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * The data needed to create a resumes.
     */
    data: XOR<resumesCreateInput, resumesUncheckedCreateInput>
  }

  /**
   * resumes createMany
   */
  export type resumesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many resumes.
     */
    data: resumesCreateManyInput | resumesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * resumes createManyAndReturn
   */
  export type resumesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * The data used to create many resumes.
     */
    data: resumesCreateManyInput | resumesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * resumes update
   */
  export type resumesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * The data needed to update a resumes.
     */
    data: XOR<resumesUpdateInput, resumesUncheckedUpdateInput>
    /**
     * Choose, which resumes to update.
     */
    where: resumesWhereUniqueInput
  }

  /**
   * resumes updateMany
   */
  export type resumesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update resumes.
     */
    data: XOR<resumesUpdateManyMutationInput, resumesUncheckedUpdateManyInput>
    /**
     * Filter which resumes to update
     */
    where?: resumesWhereInput
    /**
     * Limit how many resumes to update.
     */
    limit?: number
  }

  /**
   * resumes updateManyAndReturn
   */
  export type resumesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * The data used to update resumes.
     */
    data: XOR<resumesUpdateManyMutationInput, resumesUncheckedUpdateManyInput>
    /**
     * Filter which resumes to update
     */
    where?: resumesWhereInput
    /**
     * Limit how many resumes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * resumes upsert
   */
  export type resumesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * The filter to search for the resumes to update in case it exists.
     */
    where: resumesWhereUniqueInput
    /**
     * In case the resumes found by the `where` argument doesn't exist, create a new resumes with this data.
     */
    create: XOR<resumesCreateInput, resumesUncheckedCreateInput>
    /**
     * In case the resumes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<resumesUpdateInput, resumesUncheckedUpdateInput>
  }

  /**
   * resumes delete
   */
  export type resumesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    /**
     * Filter which resumes to delete.
     */
    where: resumesWhereUniqueInput
  }

  /**
   * resumes deleteMany
   */
  export type resumesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which resumes to delete
     */
    where?: resumesWhereInput
    /**
     * Limit how many resumes to delete.
     */
    limit?: number
  }

  /**
   * resumes.applications
   */
  export type resumes$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    where?: applicationsWhereInput
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    cursor?: applicationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * resumes without action
   */
  export type resumesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    user_id: number | null
  }

  export type UsersSumAggregateOutputType = {
    user_id: number | null
  }

  export type UsersMinAggregateOutputType = {
    user_id: number | null
    is_active: boolean | null
    username: string | null
    first_name: string | null
    last_name: string | null
    password_hash: string | null
    is_admin: boolean | null
    program: $Enums.ProgramType | null
    created_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    user_id: number | null
    is_active: boolean | null
    username: string | null
    first_name: string | null
    last_name: string | null
    password_hash: string | null
    is_admin: boolean | null
    program: $Enums.ProgramType | null
    created_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    user_id: number
    is_active: number
    username: number
    first_name: number
    last_name: number
    password_hash: number
    is_admin: number
    program: number
    created_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    user_id?: true
  }

  export type UsersSumAggregateInputType = {
    user_id?: true
  }

  export type UsersMinAggregateInputType = {
    user_id?: true
    is_active?: true
    username?: true
    first_name?: true
    last_name?: true
    password_hash?: true
    is_admin?: true
    program?: true
    created_at?: true
  }

  export type UsersMaxAggregateInputType = {
    user_id?: true
    is_active?: true
    username?: true
    first_name?: true
    last_name?: true
    password_hash?: true
    is_admin?: true
    program?: true
    created_at?: true
  }

  export type UsersCountAggregateInputType = {
    user_id?: true
    is_active?: true
    username?: true
    first_name?: true
    last_name?: true
    password_hash?: true
    is_admin?: true
    program?: true
    created_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    user_id: number
    is_active: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin: boolean | null
    program: $Enums.ProgramType | null
    created_at: Date | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    is_active?: boolean
    username?: boolean
    first_name?: boolean
    last_name?: boolean
    password_hash?: boolean
    is_admin?: boolean
    program?: boolean
    created_at?: boolean
    applications?: boolean | users$applicationsArgs<ExtArgs>
    dashboard_activity?: boolean | users$dashboard_activityArgs<ExtArgs>
    resumes?: boolean | users$resumesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    is_active?: boolean
    username?: boolean
    first_name?: boolean
    last_name?: boolean
    password_hash?: boolean
    is_admin?: boolean
    program?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    is_active?: boolean
    username?: boolean
    first_name?: boolean
    last_name?: boolean
    password_hash?: boolean
    is_admin?: boolean
    program?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    user_id?: boolean
    is_active?: boolean
    username?: boolean
    first_name?: boolean
    last_name?: boolean
    password_hash?: boolean
    is_admin?: boolean
    program?: boolean
    created_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "is_active" | "username" | "first_name" | "last_name" | "password_hash" | "is_admin" | "program" | "created_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | users$applicationsArgs<ExtArgs>
    dashboard_activity?: boolean | users$dashboard_activityArgs<ExtArgs>
    resumes?: boolean | users$resumesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      applications: Prisma.$applicationsPayload<ExtArgs>[]
      dashboard_activity: Prisma.$dashboard_activityPayload<ExtArgs>[]
      resumes: Prisma.$resumesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: number
      is_active: boolean
      username: string
      first_name: string
      last_name: string
      password_hash: string
      is_admin: boolean | null
      program: $Enums.ProgramType | null
      created_at: Date | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const usersWithUser_idOnly = await prisma.users.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `user_id`
     * const usersWithUser_idOnly = await prisma.users.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `user_id`
     * const usersWithUser_idOnly = await prisma.users.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends users$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, users$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$applicationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dashboard_activity<T extends users$dashboard_activityArgs<ExtArgs> = {}>(args?: Subset<T, users$dashboard_activityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dashboard_activityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resumes<T extends users$resumesArgs<ExtArgs> = {}>(args?: Subset<T, users$resumesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$resumesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly user_id: FieldRef<"users", 'Int'>
    readonly is_active: FieldRef<"users", 'Boolean'>
    readonly username: FieldRef<"users", 'String'>
    readonly first_name: FieldRef<"users", 'String'>
    readonly last_name: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly is_admin: FieldRef<"users", 'Boolean'>
    readonly program: FieldRef<"users", 'ProgramType'>
    readonly created_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.applications
   */
  export type users$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the applications
     */
    select?: applicationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the applications
     */
    omit?: applicationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: applicationsInclude<ExtArgs> | null
    where?: applicationsWhereInput
    orderBy?: applicationsOrderByWithRelationInput | applicationsOrderByWithRelationInput[]
    cursor?: applicationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationsScalarFieldEnum | ApplicationsScalarFieldEnum[]
  }

  /**
   * users.dashboard_activity
   */
  export type users$dashboard_activityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboard_activity
     */
    select?: dashboard_activitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboard_activity
     */
    omit?: dashboard_activityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dashboard_activityInclude<ExtArgs> | null
    where?: dashboard_activityWhereInput
    orderBy?: dashboard_activityOrderByWithRelationInput | dashboard_activityOrderByWithRelationInput[]
    cursor?: dashboard_activityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Dashboard_activityScalarFieldEnum | Dashboard_activityScalarFieldEnum[]
  }

  /**
   * users.resumes
   */
  export type users$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the resumes
     */
    select?: resumesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the resumes
     */
    omit?: resumesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: resumesInclude<ExtArgs> | null
    where?: resumesWhereInput
    orderBy?: resumesOrderByWithRelationInput | resumesOrderByWithRelationInput[]
    cursor?: resumesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumesScalarFieldEnum | ResumesScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const App_status_historyScalarFieldEnum: {
    app_history_id: 'app_history_id',
    application_id: 'application_id',
    status: 'status',
    changed_at: 'changed_at'
  };

  export type App_status_historyScalarFieldEnum = (typeof App_status_historyScalarFieldEnum)[keyof typeof App_status_historyScalarFieldEnum]


  export const ApplicationsScalarFieldEnum: {
    application_id: 'application_id',
    user_id: 'user_id',
    job_id: 'job_id',
    status: 'status',
    applied_at: 'applied_at',
    status_updated: 'status_updated',
    resume_id: 'resume_id',
    position: 'position'
  };

  export type ApplicationsScalarFieldEnum = (typeof ApplicationsScalarFieldEnum)[keyof typeof ApplicationsScalarFieldEnum]


  export const Dashboard_activityScalarFieldEnum: {
    activity_id: 'activity_id',
    admin_id: 'admin_id',
    action: 'action',
    details: 'details',
    timestamp: 'timestamp'
  };

  export type Dashboard_activityScalarFieldEnum = (typeof Dashboard_activityScalarFieldEnum)[keyof typeof Dashboard_activityScalarFieldEnum]


  export const EventsScalarFieldEnum: {
    event_id: 'event_id',
    title: 'title',
    description: 'description',
    event_date: 'event_date',
    created_at: 'created_at'
  };

  export type EventsScalarFieldEnum = (typeof EventsScalarFieldEnum)[keyof typeof EventsScalarFieldEnum]


  export const JobsScalarFieldEnum: {
    job_id: 'job_id',
    job_type: 'job_type',
    title: 'title',
    description: 'description',
    company: 'company',
    website: 'website',
    location: 'location',
    partner_id: 'partner_id',
    created_at: 'created_at',
    tags: 'tags'
  };

  export type JobsScalarFieldEnum = (typeof JobsScalarFieldEnum)[keyof typeof JobsScalarFieldEnum]


  export const PartnersScalarFieldEnum: {
    partner_id: 'partner_id',
    name: 'name',
    description: 'description',
    industry: 'industry',
    location: 'location',
    jobs_available: 'jobs_available',
    applicants: 'applicants',
    applicants_hired: 'applicants_hired'
  };

  export type PartnersScalarFieldEnum = (typeof PartnersScalarFieldEnum)[keyof typeof PartnersScalarFieldEnum]


  export const ResumesScalarFieldEnum: {
    resume_id: 'resume_id',
    user_id: 'user_id',
    file_path: 'file_path',
    file_name: 'file_name',
    is_default: 'is_default',
    created_at: 'created_at'
  };

  export type ResumesScalarFieldEnum = (typeof ResumesScalarFieldEnum)[keyof typeof ResumesScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    user_id: 'user_id',
    is_active: 'is_active',
    username: 'username',
    first_name: 'first_name',
    last_name: 'last_name',
    password_hash: 'password_hash',
    is_admin: 'is_admin',
    program: 'program',
    created_at: 'created_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AppHistoryStatus'
   */
  export type EnumAppHistoryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppHistoryStatus'>
    


  /**
   * Reference to a field of type 'AppHistoryStatus[]'
   */
  export type ListEnumAppHistoryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppHistoryStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus[]'
   */
  export type ListEnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'JobType'
   */
  export type EnumJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobType'>
    


  /**
   * Reference to a field of type 'JobType[]'
   */
  export type ListEnumJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobType[]'>
    


  /**
   * Reference to a field of type 'JobTag[]'
   */
  export type ListEnumJobTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobTag[]'>
    


  /**
   * Reference to a field of type 'JobTag'
   */
  export type EnumJobTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobTag'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ProgramType'
   */
  export type EnumProgramTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramType'>
    


  /**
   * Reference to a field of type 'ProgramType[]'
   */
  export type ListEnumProgramTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type app_status_historyWhereInput = {
    AND?: app_status_historyWhereInput | app_status_historyWhereInput[]
    OR?: app_status_historyWhereInput[]
    NOT?: app_status_historyWhereInput | app_status_historyWhereInput[]
    app_history_id?: IntFilter<"app_status_history"> | number
    application_id?: IntFilter<"app_status_history"> | number
    status?: EnumAppHistoryStatusFilter<"app_status_history"> | $Enums.AppHistoryStatus
    changed_at?: DateTimeNullableFilter<"app_status_history"> | Date | string | null
    applications?: XOR<ApplicationsScalarRelationFilter, applicationsWhereInput>
  }

  export type app_status_historyOrderByWithRelationInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
    status?: SortOrder
    changed_at?: SortOrderInput | SortOrder
    applications?: applicationsOrderByWithRelationInput
  }

  export type app_status_historyWhereUniqueInput = Prisma.AtLeast<{
    app_history_id?: number
    AND?: app_status_historyWhereInput | app_status_historyWhereInput[]
    OR?: app_status_historyWhereInput[]
    NOT?: app_status_historyWhereInput | app_status_historyWhereInput[]
    application_id?: IntFilter<"app_status_history"> | number
    status?: EnumAppHistoryStatusFilter<"app_status_history"> | $Enums.AppHistoryStatus
    changed_at?: DateTimeNullableFilter<"app_status_history"> | Date | string | null
    applications?: XOR<ApplicationsScalarRelationFilter, applicationsWhereInput>
  }, "app_history_id">

  export type app_status_historyOrderByWithAggregationInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
    status?: SortOrder
    changed_at?: SortOrderInput | SortOrder
    _count?: app_status_historyCountOrderByAggregateInput
    _avg?: app_status_historyAvgOrderByAggregateInput
    _max?: app_status_historyMaxOrderByAggregateInput
    _min?: app_status_historyMinOrderByAggregateInput
    _sum?: app_status_historySumOrderByAggregateInput
  }

  export type app_status_historyScalarWhereWithAggregatesInput = {
    AND?: app_status_historyScalarWhereWithAggregatesInput | app_status_historyScalarWhereWithAggregatesInput[]
    OR?: app_status_historyScalarWhereWithAggregatesInput[]
    NOT?: app_status_historyScalarWhereWithAggregatesInput | app_status_historyScalarWhereWithAggregatesInput[]
    app_history_id?: IntWithAggregatesFilter<"app_status_history"> | number
    application_id?: IntWithAggregatesFilter<"app_status_history"> | number
    status?: EnumAppHistoryStatusWithAggregatesFilter<"app_status_history"> | $Enums.AppHistoryStatus
    changed_at?: DateTimeNullableWithAggregatesFilter<"app_status_history"> | Date | string | null
  }

  export type applicationsWhereInput = {
    AND?: applicationsWhereInput | applicationsWhereInput[]
    OR?: applicationsWhereInput[]
    NOT?: applicationsWhereInput | applicationsWhereInput[]
    application_id?: IntFilter<"applications"> | number
    user_id?: IntFilter<"applications"> | number
    job_id?: IntFilter<"applications"> | number
    status?: EnumApplicationStatusFilter<"applications"> | $Enums.ApplicationStatus
    applied_at?: DateTimeNullableFilter<"applications"> | Date | string | null
    status_updated?: DateTimeNullableFilter<"applications"> | Date | string | null
    resume_id?: IntNullableFilter<"applications"> | number | null
    position?: StringNullableFilter<"applications"> | string | null
    app_status_history?: App_status_historyListRelationFilter
    jobs?: XOR<JobsScalarRelationFilter, jobsWhereInput>
    resumes?: XOR<ResumesNullableScalarRelationFilter, resumesWhereInput> | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type applicationsOrderByWithRelationInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    status?: SortOrder
    applied_at?: SortOrderInput | SortOrder
    status_updated?: SortOrderInput | SortOrder
    resume_id?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    app_status_history?: app_status_historyOrderByRelationAggregateInput
    jobs?: jobsOrderByWithRelationInput
    resumes?: resumesOrderByWithRelationInput
    users?: usersOrderByWithRelationInput
  }

  export type applicationsWhereUniqueInput = Prisma.AtLeast<{
    application_id?: number
    AND?: applicationsWhereInput | applicationsWhereInput[]
    OR?: applicationsWhereInput[]
    NOT?: applicationsWhereInput | applicationsWhereInput[]
    user_id?: IntFilter<"applications"> | number
    job_id?: IntFilter<"applications"> | number
    status?: EnumApplicationStatusFilter<"applications"> | $Enums.ApplicationStatus
    applied_at?: DateTimeNullableFilter<"applications"> | Date | string | null
    status_updated?: DateTimeNullableFilter<"applications"> | Date | string | null
    resume_id?: IntNullableFilter<"applications"> | number | null
    position?: StringNullableFilter<"applications"> | string | null
    app_status_history?: App_status_historyListRelationFilter
    jobs?: XOR<JobsScalarRelationFilter, jobsWhereInput>
    resumes?: XOR<ResumesNullableScalarRelationFilter, resumesWhereInput> | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "application_id">

  export type applicationsOrderByWithAggregationInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    status?: SortOrder
    applied_at?: SortOrderInput | SortOrder
    status_updated?: SortOrderInput | SortOrder
    resume_id?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    _count?: applicationsCountOrderByAggregateInput
    _avg?: applicationsAvgOrderByAggregateInput
    _max?: applicationsMaxOrderByAggregateInput
    _min?: applicationsMinOrderByAggregateInput
    _sum?: applicationsSumOrderByAggregateInput
  }

  export type applicationsScalarWhereWithAggregatesInput = {
    AND?: applicationsScalarWhereWithAggregatesInput | applicationsScalarWhereWithAggregatesInput[]
    OR?: applicationsScalarWhereWithAggregatesInput[]
    NOT?: applicationsScalarWhereWithAggregatesInput | applicationsScalarWhereWithAggregatesInput[]
    application_id?: IntWithAggregatesFilter<"applications"> | number
    user_id?: IntWithAggregatesFilter<"applications"> | number
    job_id?: IntWithAggregatesFilter<"applications"> | number
    status?: EnumApplicationStatusWithAggregatesFilter<"applications"> | $Enums.ApplicationStatus
    applied_at?: DateTimeNullableWithAggregatesFilter<"applications"> | Date | string | null
    status_updated?: DateTimeNullableWithAggregatesFilter<"applications"> | Date | string | null
    resume_id?: IntNullableWithAggregatesFilter<"applications"> | number | null
    position?: StringNullableWithAggregatesFilter<"applications"> | string | null
  }

  export type dashboard_activityWhereInput = {
    AND?: dashboard_activityWhereInput | dashboard_activityWhereInput[]
    OR?: dashboard_activityWhereInput[]
    NOT?: dashboard_activityWhereInput | dashboard_activityWhereInput[]
    activity_id?: IntFilter<"dashboard_activity"> | number
    admin_id?: IntFilter<"dashboard_activity"> | number
    action?: StringFilter<"dashboard_activity"> | string
    details?: StringNullableFilter<"dashboard_activity"> | string | null
    timestamp?: DateTimeNullableFilter<"dashboard_activity"> | Date | string | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type dashboard_activityOrderByWithRelationInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type dashboard_activityWhereUniqueInput = Prisma.AtLeast<{
    activity_id?: number
    AND?: dashboard_activityWhereInput | dashboard_activityWhereInput[]
    OR?: dashboard_activityWhereInput[]
    NOT?: dashboard_activityWhereInput | dashboard_activityWhereInput[]
    admin_id?: IntFilter<"dashboard_activity"> | number
    action?: StringFilter<"dashboard_activity"> | string
    details?: StringNullableFilter<"dashboard_activity"> | string | null
    timestamp?: DateTimeNullableFilter<"dashboard_activity"> | Date | string | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "activity_id">

  export type dashboard_activityOrderByWithAggregationInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrderInput | SortOrder
    _count?: dashboard_activityCountOrderByAggregateInput
    _avg?: dashboard_activityAvgOrderByAggregateInput
    _max?: dashboard_activityMaxOrderByAggregateInput
    _min?: dashboard_activityMinOrderByAggregateInput
    _sum?: dashboard_activitySumOrderByAggregateInput
  }

  export type dashboard_activityScalarWhereWithAggregatesInput = {
    AND?: dashboard_activityScalarWhereWithAggregatesInput | dashboard_activityScalarWhereWithAggregatesInput[]
    OR?: dashboard_activityScalarWhereWithAggregatesInput[]
    NOT?: dashboard_activityScalarWhereWithAggregatesInput | dashboard_activityScalarWhereWithAggregatesInput[]
    activity_id?: IntWithAggregatesFilter<"dashboard_activity"> | number
    admin_id?: IntWithAggregatesFilter<"dashboard_activity"> | number
    action?: StringWithAggregatesFilter<"dashboard_activity"> | string
    details?: StringNullableWithAggregatesFilter<"dashboard_activity"> | string | null
    timestamp?: DateTimeNullableWithAggregatesFilter<"dashboard_activity"> | Date | string | null
  }

  export type eventsWhereInput = {
    AND?: eventsWhereInput | eventsWhereInput[]
    OR?: eventsWhereInput[]
    NOT?: eventsWhereInput | eventsWhereInput[]
    event_id?: IntFilter<"events"> | number
    title?: StringFilter<"events"> | string
    description?: StringNullableFilter<"events"> | string | null
    event_date?: DateTimeFilter<"events"> | Date | string
    created_at?: DateTimeNullableFilter<"events"> | Date | string | null
  }

  export type eventsOrderByWithRelationInput = {
    event_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    event_date?: SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type eventsWhereUniqueInput = Prisma.AtLeast<{
    event_id?: number
    AND?: eventsWhereInput | eventsWhereInput[]
    OR?: eventsWhereInput[]
    NOT?: eventsWhereInput | eventsWhereInput[]
    title?: StringFilter<"events"> | string
    description?: StringNullableFilter<"events"> | string | null
    event_date?: DateTimeFilter<"events"> | Date | string
    created_at?: DateTimeNullableFilter<"events"> | Date | string | null
  }, "event_id">

  export type eventsOrderByWithAggregationInput = {
    event_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    event_date?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: eventsCountOrderByAggregateInput
    _avg?: eventsAvgOrderByAggregateInput
    _max?: eventsMaxOrderByAggregateInput
    _min?: eventsMinOrderByAggregateInput
    _sum?: eventsSumOrderByAggregateInput
  }

  export type eventsScalarWhereWithAggregatesInput = {
    AND?: eventsScalarWhereWithAggregatesInput | eventsScalarWhereWithAggregatesInput[]
    OR?: eventsScalarWhereWithAggregatesInput[]
    NOT?: eventsScalarWhereWithAggregatesInput | eventsScalarWhereWithAggregatesInput[]
    event_id?: IntWithAggregatesFilter<"events"> | number
    title?: StringWithAggregatesFilter<"events"> | string
    description?: StringNullableWithAggregatesFilter<"events"> | string | null
    event_date?: DateTimeWithAggregatesFilter<"events"> | Date | string
    created_at?: DateTimeNullableWithAggregatesFilter<"events"> | Date | string | null
  }

  export type jobsWhereInput = {
    AND?: jobsWhereInput | jobsWhereInput[]
    OR?: jobsWhereInput[]
    NOT?: jobsWhereInput | jobsWhereInput[]
    job_id?: IntFilter<"jobs"> | number
    job_type?: EnumJobTypeFilter<"jobs"> | $Enums.JobType
    title?: StringFilter<"jobs"> | string
    description?: StringNullableFilter<"jobs"> | string | null
    company?: StringFilter<"jobs"> | string
    website?: StringNullableFilter<"jobs"> | string | null
    location?: StringNullableFilter<"jobs"> | string | null
    partner_id?: IntNullableFilter<"jobs"> | number | null
    created_at?: DateTimeNullableFilter<"jobs"> | Date | string | null
    tags?: EnumJobTagNullableListFilter<"jobs">
    applications?: ApplicationsListRelationFilter
    partners?: XOR<PartnersNullableScalarRelationFilter, partnersWhereInput> | null
  }

  export type jobsOrderByWithRelationInput = {
    job_id?: SortOrder
    job_type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    company?: SortOrder
    website?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    partner_id?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    tags?: SortOrder
    applications?: applicationsOrderByRelationAggregateInput
    partners?: partnersOrderByWithRelationInput
  }

  export type jobsWhereUniqueInput = Prisma.AtLeast<{
    job_id?: number
    AND?: jobsWhereInput | jobsWhereInput[]
    OR?: jobsWhereInput[]
    NOT?: jobsWhereInput | jobsWhereInput[]
    job_type?: EnumJobTypeFilter<"jobs"> | $Enums.JobType
    title?: StringFilter<"jobs"> | string
    description?: StringNullableFilter<"jobs"> | string | null
    company?: StringFilter<"jobs"> | string
    website?: StringNullableFilter<"jobs"> | string | null
    location?: StringNullableFilter<"jobs"> | string | null
    partner_id?: IntNullableFilter<"jobs"> | number | null
    created_at?: DateTimeNullableFilter<"jobs"> | Date | string | null
    tags?: EnumJobTagNullableListFilter<"jobs">
    applications?: ApplicationsListRelationFilter
    partners?: XOR<PartnersNullableScalarRelationFilter, partnersWhereInput> | null
  }, "job_id">

  export type jobsOrderByWithAggregationInput = {
    job_id?: SortOrder
    job_type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    company?: SortOrder
    website?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    partner_id?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    tags?: SortOrder
    _count?: jobsCountOrderByAggregateInput
    _avg?: jobsAvgOrderByAggregateInput
    _max?: jobsMaxOrderByAggregateInput
    _min?: jobsMinOrderByAggregateInput
    _sum?: jobsSumOrderByAggregateInput
  }

  export type jobsScalarWhereWithAggregatesInput = {
    AND?: jobsScalarWhereWithAggregatesInput | jobsScalarWhereWithAggregatesInput[]
    OR?: jobsScalarWhereWithAggregatesInput[]
    NOT?: jobsScalarWhereWithAggregatesInput | jobsScalarWhereWithAggregatesInput[]
    job_id?: IntWithAggregatesFilter<"jobs"> | number
    job_type?: EnumJobTypeWithAggregatesFilter<"jobs"> | $Enums.JobType
    title?: StringWithAggregatesFilter<"jobs"> | string
    description?: StringNullableWithAggregatesFilter<"jobs"> | string | null
    company?: StringWithAggregatesFilter<"jobs"> | string
    website?: StringNullableWithAggregatesFilter<"jobs"> | string | null
    location?: StringNullableWithAggregatesFilter<"jobs"> | string | null
    partner_id?: IntNullableWithAggregatesFilter<"jobs"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"jobs"> | Date | string | null
    tags?: EnumJobTagNullableListFilter<"jobs">
  }

  export type partnersWhereInput = {
    AND?: partnersWhereInput | partnersWhereInput[]
    OR?: partnersWhereInput[]
    NOT?: partnersWhereInput | partnersWhereInput[]
    partner_id?: IntFilter<"partners"> | number
    name?: StringFilter<"partners"> | string
    description?: StringNullableFilter<"partners"> | string | null
    industry?: StringNullableFilter<"partners"> | string | null
    location?: StringNullableFilter<"partners"> | string | null
    jobs_available?: IntNullableFilter<"partners"> | number | null
    applicants?: IntNullableFilter<"partners"> | number | null
    applicants_hired?: IntNullableFilter<"partners"> | number | null
    jobs?: JobsListRelationFilter
  }

  export type partnersOrderByWithRelationInput = {
    partner_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    jobs_available?: SortOrderInput | SortOrder
    applicants?: SortOrderInput | SortOrder
    applicants_hired?: SortOrderInput | SortOrder
    jobs?: jobsOrderByRelationAggregateInput
  }

  export type partnersWhereUniqueInput = Prisma.AtLeast<{
    partner_id?: number
    AND?: partnersWhereInput | partnersWhereInput[]
    OR?: partnersWhereInput[]
    NOT?: partnersWhereInput | partnersWhereInput[]
    name?: StringFilter<"partners"> | string
    description?: StringNullableFilter<"partners"> | string | null
    industry?: StringNullableFilter<"partners"> | string | null
    location?: StringNullableFilter<"partners"> | string | null
    jobs_available?: IntNullableFilter<"partners"> | number | null
    applicants?: IntNullableFilter<"partners"> | number | null
    applicants_hired?: IntNullableFilter<"partners"> | number | null
    jobs?: JobsListRelationFilter
  }, "partner_id">

  export type partnersOrderByWithAggregationInput = {
    partner_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    jobs_available?: SortOrderInput | SortOrder
    applicants?: SortOrderInput | SortOrder
    applicants_hired?: SortOrderInput | SortOrder
    _count?: partnersCountOrderByAggregateInput
    _avg?: partnersAvgOrderByAggregateInput
    _max?: partnersMaxOrderByAggregateInput
    _min?: partnersMinOrderByAggregateInput
    _sum?: partnersSumOrderByAggregateInput
  }

  export type partnersScalarWhereWithAggregatesInput = {
    AND?: partnersScalarWhereWithAggregatesInput | partnersScalarWhereWithAggregatesInput[]
    OR?: partnersScalarWhereWithAggregatesInput[]
    NOT?: partnersScalarWhereWithAggregatesInput | partnersScalarWhereWithAggregatesInput[]
    partner_id?: IntWithAggregatesFilter<"partners"> | number
    name?: StringWithAggregatesFilter<"partners"> | string
    description?: StringNullableWithAggregatesFilter<"partners"> | string | null
    industry?: StringNullableWithAggregatesFilter<"partners"> | string | null
    location?: StringNullableWithAggregatesFilter<"partners"> | string | null
    jobs_available?: IntNullableWithAggregatesFilter<"partners"> | number | null
    applicants?: IntNullableWithAggregatesFilter<"partners"> | number | null
    applicants_hired?: IntNullableWithAggregatesFilter<"partners"> | number | null
  }

  export type resumesWhereInput = {
    AND?: resumesWhereInput | resumesWhereInput[]
    OR?: resumesWhereInput[]
    NOT?: resumesWhereInput | resumesWhereInput[]
    resume_id?: IntFilter<"resumes"> | number
    user_id?: IntFilter<"resumes"> | number
    file_path?: StringFilter<"resumes"> | string
    file_name?: StringFilter<"resumes"> | string
    is_default?: BoolNullableFilter<"resumes"> | boolean | null
    created_at?: DateTimeNullableFilter<"resumes"> | Date | string | null
    applications?: ApplicationsListRelationFilter
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type resumesOrderByWithRelationInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    is_default?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    applications?: applicationsOrderByRelationAggregateInput
    users?: usersOrderByWithRelationInput
  }

  export type resumesWhereUniqueInput = Prisma.AtLeast<{
    resume_id?: number
    AND?: resumesWhereInput | resumesWhereInput[]
    OR?: resumesWhereInput[]
    NOT?: resumesWhereInput | resumesWhereInput[]
    user_id?: IntFilter<"resumes"> | number
    file_path?: StringFilter<"resumes"> | string
    file_name?: StringFilter<"resumes"> | string
    is_default?: BoolNullableFilter<"resumes"> | boolean | null
    created_at?: DateTimeNullableFilter<"resumes"> | Date | string | null
    applications?: ApplicationsListRelationFilter
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "resume_id">

  export type resumesOrderByWithAggregationInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    is_default?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: resumesCountOrderByAggregateInput
    _avg?: resumesAvgOrderByAggregateInput
    _max?: resumesMaxOrderByAggregateInput
    _min?: resumesMinOrderByAggregateInput
    _sum?: resumesSumOrderByAggregateInput
  }

  export type resumesScalarWhereWithAggregatesInput = {
    AND?: resumesScalarWhereWithAggregatesInput | resumesScalarWhereWithAggregatesInput[]
    OR?: resumesScalarWhereWithAggregatesInput[]
    NOT?: resumesScalarWhereWithAggregatesInput | resumesScalarWhereWithAggregatesInput[]
    resume_id?: IntWithAggregatesFilter<"resumes"> | number
    user_id?: IntWithAggregatesFilter<"resumes"> | number
    file_path?: StringWithAggregatesFilter<"resumes"> | string
    file_name?: StringWithAggregatesFilter<"resumes"> | string
    is_default?: BoolNullableWithAggregatesFilter<"resumes"> | boolean | null
    created_at?: DateTimeNullableWithAggregatesFilter<"resumes"> | Date | string | null
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    user_id?: IntFilter<"users"> | number
    is_active?: BoolFilter<"users"> | boolean
    username?: StringFilter<"users"> | string
    first_name?: StringFilter<"users"> | string
    last_name?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    is_admin?: BoolNullableFilter<"users"> | boolean | null
    program?: EnumProgramTypeNullableFilter<"users"> | $Enums.ProgramType | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    applications?: ApplicationsListRelationFilter
    dashboard_activity?: Dashboard_activityListRelationFilter
    resumes?: ResumesListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    user_id?: SortOrder
    is_active?: SortOrder
    username?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    password_hash?: SortOrder
    is_admin?: SortOrderInput | SortOrder
    program?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    applications?: applicationsOrderByRelationAggregateInput
    dashboard_activity?: dashboard_activityOrderByRelationAggregateInput
    resumes?: resumesOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    user_id?: number
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    is_active?: BoolFilter<"users"> | boolean
    username?: StringFilter<"users"> | string
    first_name?: StringFilter<"users"> | string
    last_name?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    is_admin?: BoolNullableFilter<"users"> | boolean | null
    program?: EnumProgramTypeNullableFilter<"users"> | $Enums.ProgramType | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    applications?: ApplicationsListRelationFilter
    dashboard_activity?: Dashboard_activityListRelationFilter
    resumes?: ResumesListRelationFilter
  }, "user_id">

  export type usersOrderByWithAggregationInput = {
    user_id?: SortOrder
    is_active?: SortOrder
    username?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    password_hash?: SortOrder
    is_admin?: SortOrderInput | SortOrder
    program?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    user_id?: IntWithAggregatesFilter<"users"> | number
    is_active?: BoolWithAggregatesFilter<"users"> | boolean
    username?: StringWithAggregatesFilter<"users"> | string
    first_name?: StringWithAggregatesFilter<"users"> | string
    last_name?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringWithAggregatesFilter<"users"> | string
    is_admin?: BoolNullableWithAggregatesFilter<"users"> | boolean | null
    program?: EnumProgramTypeNullableWithAggregatesFilter<"users"> | $Enums.ProgramType | null
    created_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
  }

  export type app_status_historyCreateInput = {
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
    applications: applicationsCreateNestedOneWithoutApp_status_historyInput
  }

  export type app_status_historyUncheckedCreateInput = {
    app_history_id?: number
    application_id: number
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
  }

  export type app_status_historyUpdateInput = {
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateOneRequiredWithoutApp_status_historyNestedInput
  }

  export type app_status_historyUncheckedUpdateInput = {
    app_history_id?: IntFieldUpdateOperationsInput | number
    application_id?: IntFieldUpdateOperationsInput | number
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type app_status_historyCreateManyInput = {
    app_history_id?: number
    application_id: number
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
  }

  export type app_status_historyUpdateManyMutationInput = {
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type app_status_historyUncheckedUpdateManyInput = {
    app_history_id?: IntFieldUpdateOperationsInput | number
    application_id?: IntFieldUpdateOperationsInput | number
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type applicationsCreateInput = {
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    app_status_history?: app_status_historyCreateNestedManyWithoutApplicationsInput
    jobs: jobsCreateNestedOneWithoutApplicationsInput
    resumes?: resumesCreateNestedOneWithoutApplicationsInput
    users: usersCreateNestedOneWithoutApplicationsInput
  }

  export type applicationsUncheckedCreateInput = {
    application_id?: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
    app_status_history?: app_status_historyUncheckedCreateNestedManyWithoutApplicationsInput
  }

  export type applicationsUpdateInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUpdateManyWithoutApplicationsNestedInput
    jobs?: jobsUpdateOneRequiredWithoutApplicationsNestedInput
    resumes?: resumesUpdateOneWithoutApplicationsNestedInput
    users?: usersUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUncheckedUpdateManyWithoutApplicationsNestedInput
  }

  export type applicationsCreateManyInput = {
    application_id?: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
  }

  export type applicationsUpdateManyMutationInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type applicationsUncheckedUpdateManyInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type dashboard_activityCreateInput = {
    action: string
    details?: string | null
    timestamp?: Date | string | null
    users: usersCreateNestedOneWithoutDashboard_activityInput
  }

  export type dashboard_activityUncheckedCreateInput = {
    activity_id?: number
    admin_id: number
    action: string
    details?: string | null
    timestamp?: Date | string | null
  }

  export type dashboard_activityUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneRequiredWithoutDashboard_activityNestedInput
  }

  export type dashboard_activityUncheckedUpdateInput = {
    activity_id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dashboard_activityCreateManyInput = {
    activity_id?: number
    admin_id: number
    action: string
    details?: string | null
    timestamp?: Date | string | null
  }

  export type dashboard_activityUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dashboard_activityUncheckedUpdateManyInput = {
    activity_id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventsCreateInput = {
    title: string
    description?: string | null
    event_date: Date | string
    created_at?: Date | string | null
  }

  export type eventsUncheckedCreateInput = {
    event_id?: number
    title: string
    description?: string | null
    event_date: Date | string
    created_at?: Date | string | null
  }

  export type eventsUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    event_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventsUncheckedUpdateInput = {
    event_id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    event_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventsCreateManyInput = {
    event_id?: number
    title: string
    description?: string | null
    event_date: Date | string
    created_at?: Date | string | null
  }

  export type eventsUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    event_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type eventsUncheckedUpdateManyInput = {
    event_id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    event_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type jobsCreateInput = {
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
    applications?: applicationsCreateNestedManyWithoutJobsInput
    partners?: partnersCreateNestedOneWithoutJobsInput
  }

  export type jobsUncheckedCreateInput = {
    job_id?: number
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    partner_id?: number | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
    applications?: applicationsUncheckedCreateNestedManyWithoutJobsInput
  }

  export type jobsUpdateInput = {
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
    applications?: applicationsUpdateManyWithoutJobsNestedInput
    partners?: partnersUpdateOneWithoutJobsNestedInput
  }

  export type jobsUncheckedUpdateInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    partner_id?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
    applications?: applicationsUncheckedUpdateManyWithoutJobsNestedInput
  }

  export type jobsCreateManyInput = {
    job_id?: number
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    partner_id?: number | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
  }

  export type jobsUpdateManyMutationInput = {
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
  }

  export type jobsUncheckedUpdateManyInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    partner_id?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
  }

  export type partnersCreateInput = {
    name: string
    description?: string | null
    industry?: string | null
    location?: string | null
    jobs_available?: number | null
    applicants?: number | null
    applicants_hired?: number | null
    jobs?: jobsCreateNestedManyWithoutPartnersInput
  }

  export type partnersUncheckedCreateInput = {
    partner_id?: number
    name: string
    description?: string | null
    industry?: string | null
    location?: string | null
    jobs_available?: number | null
    applicants?: number | null
    applicants_hired?: number | null
    jobs?: jobsUncheckedCreateNestedManyWithoutPartnersInput
  }

  export type partnersUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
    jobs?: jobsUpdateManyWithoutPartnersNestedInput
  }

  export type partnersUncheckedUpdateInput = {
    partner_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
    jobs?: jobsUncheckedUpdateManyWithoutPartnersNestedInput
  }

  export type partnersCreateManyInput = {
    partner_id?: number
    name: string
    description?: string | null
    industry?: string | null
    location?: string | null
    jobs_available?: number | null
    applicants?: number | null
    applicants_hired?: number | null
  }

  export type partnersUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type partnersUncheckedUpdateManyInput = {
    partner_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type resumesCreateInput = {
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
    applications?: applicationsCreateNestedManyWithoutResumesInput
    users: usersCreateNestedOneWithoutResumesInput
  }

  export type resumesUncheckedCreateInput = {
    resume_id?: number
    user_id: number
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
    applications?: applicationsUncheckedCreateNestedManyWithoutResumesInput
  }

  export type resumesUpdateInput = {
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateManyWithoutResumesNestedInput
    users?: usersUpdateOneRequiredWithoutResumesNestedInput
  }

  export type resumesUncheckedUpdateInput = {
    resume_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUncheckedUpdateManyWithoutResumesNestedInput
  }

  export type resumesCreateManyInput = {
    resume_id?: number
    user_id: number
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
  }

  export type resumesUpdateManyMutationInput = {
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type resumesUncheckedUpdateManyInput = {
    resume_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateInput = {
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsCreateNestedManyWithoutUsersInput
    dashboard_activity?: dashboard_activityCreateNestedManyWithoutUsersInput
    resumes?: resumesCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    user_id?: number
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsUncheckedCreateNestedManyWithoutUsersInput
    dashboard_activity?: dashboard_activityUncheckedCreateNestedManyWithoutUsersInput
    resumes?: resumesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateManyWithoutUsersNestedInput
    dashboard_activity?: dashboard_activityUpdateManyWithoutUsersNestedInput
    resumes?: resumesUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUncheckedUpdateManyWithoutUsersNestedInput
    dashboard_activity?: dashboard_activityUncheckedUpdateManyWithoutUsersNestedInput
    resumes?: resumesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    user_id?: number
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
  }

  export type usersUpdateManyMutationInput = {
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumAppHistoryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppHistoryStatus | EnumAppHistoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppHistoryStatusFilter<$PrismaModel> | $Enums.AppHistoryStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ApplicationsScalarRelationFilter = {
    is?: applicationsWhereInput
    isNot?: applicationsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type app_status_historyCountOrderByAggregateInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
    status?: SortOrder
    changed_at?: SortOrder
  }

  export type app_status_historyAvgOrderByAggregateInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
  }

  export type app_status_historyMaxOrderByAggregateInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
    status?: SortOrder
    changed_at?: SortOrder
  }

  export type app_status_historyMinOrderByAggregateInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
    status?: SortOrder
    changed_at?: SortOrder
  }

  export type app_status_historySumOrderByAggregateInput = {
    app_history_id?: SortOrder
    application_id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumAppHistoryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppHistoryStatus | EnumAppHistoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppHistoryStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppHistoryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppHistoryStatusFilter<$PrismaModel>
    _max?: NestedEnumAppHistoryStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type App_status_historyListRelationFilter = {
    every?: app_status_historyWhereInput
    some?: app_status_historyWhereInput
    none?: app_status_historyWhereInput
  }

  export type JobsScalarRelationFilter = {
    is?: jobsWhereInput
    isNot?: jobsWhereInput
  }

  export type ResumesNullableScalarRelationFilter = {
    is?: resumesWhereInput | null
    isNot?: resumesWhereInput | null
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type app_status_historyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type applicationsCountOrderByAggregateInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    status?: SortOrder
    applied_at?: SortOrder
    status_updated?: SortOrder
    resume_id?: SortOrder
    position?: SortOrder
  }

  export type applicationsAvgOrderByAggregateInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    resume_id?: SortOrder
  }

  export type applicationsMaxOrderByAggregateInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    status?: SortOrder
    applied_at?: SortOrder
    status_updated?: SortOrder
    resume_id?: SortOrder
    position?: SortOrder
  }

  export type applicationsMinOrderByAggregateInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    status?: SortOrder
    applied_at?: SortOrder
    status_updated?: SortOrder
    resume_id?: SortOrder
    position?: SortOrder
  }

  export type applicationsSumOrderByAggregateInput = {
    application_id?: SortOrder
    user_id?: SortOrder
    job_id?: SortOrder
    resume_id?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type dashboard_activityCountOrderByAggregateInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
  }

  export type dashboard_activityAvgOrderByAggregateInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
  }

  export type dashboard_activityMaxOrderByAggregateInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
  }

  export type dashboard_activityMinOrderByAggregateInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
  }

  export type dashboard_activitySumOrderByAggregateInput = {
    activity_id?: SortOrder
    admin_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type eventsCountOrderByAggregateInput = {
    event_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    event_date?: SortOrder
    created_at?: SortOrder
  }

  export type eventsAvgOrderByAggregateInput = {
    event_id?: SortOrder
  }

  export type eventsMaxOrderByAggregateInput = {
    event_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    event_date?: SortOrder
    created_at?: SortOrder
  }

  export type eventsMinOrderByAggregateInput = {
    event_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    event_date?: SortOrder
    created_at?: SortOrder
  }

  export type eventsSumOrderByAggregateInput = {
    event_id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | EnumJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJobTypeFilter<$PrismaModel> | $Enums.JobType
  }

  export type EnumJobTagNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.JobTag[] | ListEnumJobTagFieldRefInput<$PrismaModel> | null
    has?: $Enums.JobTag | EnumJobTagFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.JobTag[] | ListEnumJobTagFieldRefInput<$PrismaModel>
    hasSome?: $Enums.JobTag[] | ListEnumJobTagFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ApplicationsListRelationFilter = {
    every?: applicationsWhereInput
    some?: applicationsWhereInput
    none?: applicationsWhereInput
  }

  export type PartnersNullableScalarRelationFilter = {
    is?: partnersWhereInput | null
    isNot?: partnersWhereInput | null
  }

  export type applicationsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type jobsCountOrderByAggregateInput = {
    job_id?: SortOrder
    job_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    company?: SortOrder
    website?: SortOrder
    location?: SortOrder
    partner_id?: SortOrder
    created_at?: SortOrder
    tags?: SortOrder
  }

  export type jobsAvgOrderByAggregateInput = {
    job_id?: SortOrder
    partner_id?: SortOrder
  }

  export type jobsMaxOrderByAggregateInput = {
    job_id?: SortOrder
    job_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    company?: SortOrder
    website?: SortOrder
    location?: SortOrder
    partner_id?: SortOrder
    created_at?: SortOrder
  }

  export type jobsMinOrderByAggregateInput = {
    job_id?: SortOrder
    job_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    company?: SortOrder
    website?: SortOrder
    location?: SortOrder
    partner_id?: SortOrder
    created_at?: SortOrder
  }

  export type jobsSumOrderByAggregateInput = {
    job_id?: SortOrder
    partner_id?: SortOrder
  }

  export type EnumJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | EnumJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.JobType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobTypeFilter<$PrismaModel>
    _max?: NestedEnumJobTypeFilter<$PrismaModel>
  }

  export type JobsListRelationFilter = {
    every?: jobsWhereInput
    some?: jobsWhereInput
    none?: jobsWhereInput
  }

  export type jobsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type partnersCountOrderByAggregateInput = {
    partner_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    industry?: SortOrder
    location?: SortOrder
    jobs_available?: SortOrder
    applicants?: SortOrder
    applicants_hired?: SortOrder
  }

  export type partnersAvgOrderByAggregateInput = {
    partner_id?: SortOrder
    jobs_available?: SortOrder
    applicants?: SortOrder
    applicants_hired?: SortOrder
  }

  export type partnersMaxOrderByAggregateInput = {
    partner_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    industry?: SortOrder
    location?: SortOrder
    jobs_available?: SortOrder
    applicants?: SortOrder
    applicants_hired?: SortOrder
  }

  export type partnersMinOrderByAggregateInput = {
    partner_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    industry?: SortOrder
    location?: SortOrder
    jobs_available?: SortOrder
    applicants?: SortOrder
    applicants_hired?: SortOrder
  }

  export type partnersSumOrderByAggregateInput = {
    partner_id?: SortOrder
    jobs_available?: SortOrder
    applicants?: SortOrder
    applicants_hired?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type resumesCountOrderByAggregateInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    is_default?: SortOrder
    created_at?: SortOrder
  }

  export type resumesAvgOrderByAggregateInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
  }

  export type resumesMaxOrderByAggregateInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    is_default?: SortOrder
    created_at?: SortOrder
  }

  export type resumesMinOrderByAggregateInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    is_default?: SortOrder
    created_at?: SortOrder
  }

  export type resumesSumOrderByAggregateInput = {
    resume_id?: SortOrder
    user_id?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumProgramTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramType | EnumProgramTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProgramTypeNullableFilter<$PrismaModel> | $Enums.ProgramType | null
  }

  export type Dashboard_activityListRelationFilter = {
    every?: dashboard_activityWhereInput
    some?: dashboard_activityWhereInput
    none?: dashboard_activityWhereInput
  }

  export type ResumesListRelationFilter = {
    every?: resumesWhereInput
    some?: resumesWhereInput
    none?: resumesWhereInput
  }

  export type dashboard_activityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type resumesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    user_id?: SortOrder
    is_active?: SortOrder
    username?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    password_hash?: SortOrder
    is_admin?: SortOrder
    program?: SortOrder
    created_at?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    user_id?: SortOrder
    is_active?: SortOrder
    username?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    password_hash?: SortOrder
    is_admin?: SortOrder
    program?: SortOrder
    created_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    user_id?: SortOrder
    is_active?: SortOrder
    username?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    password_hash?: SortOrder
    is_admin?: SortOrder
    program?: SortOrder
    created_at?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumProgramTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramType | EnumProgramTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProgramTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProgramType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProgramTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumProgramTypeNullableFilter<$PrismaModel>
  }

  export type applicationsCreateNestedOneWithoutApp_status_historyInput = {
    create?: XOR<applicationsCreateWithoutApp_status_historyInput, applicationsUncheckedCreateWithoutApp_status_historyInput>
    connectOrCreate?: applicationsCreateOrConnectWithoutApp_status_historyInput
    connect?: applicationsWhereUniqueInput
  }

  export type EnumAppHistoryStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppHistoryStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type applicationsUpdateOneRequiredWithoutApp_status_historyNestedInput = {
    create?: XOR<applicationsCreateWithoutApp_status_historyInput, applicationsUncheckedCreateWithoutApp_status_historyInput>
    connectOrCreate?: applicationsCreateOrConnectWithoutApp_status_historyInput
    upsert?: applicationsUpsertWithoutApp_status_historyInput
    connect?: applicationsWhereUniqueInput
    update?: XOR<XOR<applicationsUpdateToOneWithWhereWithoutApp_status_historyInput, applicationsUpdateWithoutApp_status_historyInput>, applicationsUncheckedUpdateWithoutApp_status_historyInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type app_status_historyCreateNestedManyWithoutApplicationsInput = {
    create?: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput> | app_status_historyCreateWithoutApplicationsInput[] | app_status_historyUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: app_status_historyCreateOrConnectWithoutApplicationsInput | app_status_historyCreateOrConnectWithoutApplicationsInput[]
    createMany?: app_status_historyCreateManyApplicationsInputEnvelope
    connect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
  }

  export type jobsCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<jobsCreateWithoutApplicationsInput, jobsUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: jobsCreateOrConnectWithoutApplicationsInput
    connect?: jobsWhereUniqueInput
  }

  export type resumesCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<resumesCreateWithoutApplicationsInput, resumesUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: resumesCreateOrConnectWithoutApplicationsInput
    connect?: resumesWhereUniqueInput
  }

  export type usersCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<usersCreateWithoutApplicationsInput, usersUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: usersCreateOrConnectWithoutApplicationsInput
    connect?: usersWhereUniqueInput
  }

  export type app_status_historyUncheckedCreateNestedManyWithoutApplicationsInput = {
    create?: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput> | app_status_historyCreateWithoutApplicationsInput[] | app_status_historyUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: app_status_historyCreateOrConnectWithoutApplicationsInput | app_status_historyCreateOrConnectWithoutApplicationsInput[]
    createMany?: app_status_historyCreateManyApplicationsInputEnvelope
    connect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type app_status_historyUpdateManyWithoutApplicationsNestedInput = {
    create?: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput> | app_status_historyCreateWithoutApplicationsInput[] | app_status_historyUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: app_status_historyCreateOrConnectWithoutApplicationsInput | app_status_historyCreateOrConnectWithoutApplicationsInput[]
    upsert?: app_status_historyUpsertWithWhereUniqueWithoutApplicationsInput | app_status_historyUpsertWithWhereUniqueWithoutApplicationsInput[]
    createMany?: app_status_historyCreateManyApplicationsInputEnvelope
    set?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    disconnect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    delete?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    connect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    update?: app_status_historyUpdateWithWhereUniqueWithoutApplicationsInput | app_status_historyUpdateWithWhereUniqueWithoutApplicationsInput[]
    updateMany?: app_status_historyUpdateManyWithWhereWithoutApplicationsInput | app_status_historyUpdateManyWithWhereWithoutApplicationsInput[]
    deleteMany?: app_status_historyScalarWhereInput | app_status_historyScalarWhereInput[]
  }

  export type jobsUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<jobsCreateWithoutApplicationsInput, jobsUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: jobsCreateOrConnectWithoutApplicationsInput
    upsert?: jobsUpsertWithoutApplicationsInput
    connect?: jobsWhereUniqueInput
    update?: XOR<XOR<jobsUpdateToOneWithWhereWithoutApplicationsInput, jobsUpdateWithoutApplicationsInput>, jobsUncheckedUpdateWithoutApplicationsInput>
  }

  export type resumesUpdateOneWithoutApplicationsNestedInput = {
    create?: XOR<resumesCreateWithoutApplicationsInput, resumesUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: resumesCreateOrConnectWithoutApplicationsInput
    upsert?: resumesUpsertWithoutApplicationsInput
    disconnect?: resumesWhereInput | boolean
    delete?: resumesWhereInput | boolean
    connect?: resumesWhereUniqueInput
    update?: XOR<XOR<resumesUpdateToOneWithWhereWithoutApplicationsInput, resumesUpdateWithoutApplicationsInput>, resumesUncheckedUpdateWithoutApplicationsInput>
  }

  export type usersUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<usersCreateWithoutApplicationsInput, usersUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: usersCreateOrConnectWithoutApplicationsInput
    upsert?: usersUpsertWithoutApplicationsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutApplicationsInput, usersUpdateWithoutApplicationsInput>, usersUncheckedUpdateWithoutApplicationsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type app_status_historyUncheckedUpdateManyWithoutApplicationsNestedInput = {
    create?: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput> | app_status_historyCreateWithoutApplicationsInput[] | app_status_historyUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: app_status_historyCreateOrConnectWithoutApplicationsInput | app_status_historyCreateOrConnectWithoutApplicationsInput[]
    upsert?: app_status_historyUpsertWithWhereUniqueWithoutApplicationsInput | app_status_historyUpsertWithWhereUniqueWithoutApplicationsInput[]
    createMany?: app_status_historyCreateManyApplicationsInputEnvelope
    set?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    disconnect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    delete?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    connect?: app_status_historyWhereUniqueInput | app_status_historyWhereUniqueInput[]
    update?: app_status_historyUpdateWithWhereUniqueWithoutApplicationsInput | app_status_historyUpdateWithWhereUniqueWithoutApplicationsInput[]
    updateMany?: app_status_historyUpdateManyWithWhereWithoutApplicationsInput | app_status_historyUpdateManyWithWhereWithoutApplicationsInput[]
    deleteMany?: app_status_historyScalarWhereInput | app_status_historyScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutDashboard_activityInput = {
    create?: XOR<usersCreateWithoutDashboard_activityInput, usersUncheckedCreateWithoutDashboard_activityInput>
    connectOrCreate?: usersCreateOrConnectWithoutDashboard_activityInput
    connect?: usersWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type usersUpdateOneRequiredWithoutDashboard_activityNestedInput = {
    create?: XOR<usersCreateWithoutDashboard_activityInput, usersUncheckedCreateWithoutDashboard_activityInput>
    connectOrCreate?: usersCreateOrConnectWithoutDashboard_activityInput
    upsert?: usersUpsertWithoutDashboard_activityInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutDashboard_activityInput, usersUpdateWithoutDashboard_activityInput>, usersUncheckedUpdateWithoutDashboard_activityInput>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type jobsCreatetagsInput = {
    set: $Enums.JobTag[]
  }

  export type applicationsCreateNestedManyWithoutJobsInput = {
    create?: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput> | applicationsCreateWithoutJobsInput[] | applicationsUncheckedCreateWithoutJobsInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutJobsInput | applicationsCreateOrConnectWithoutJobsInput[]
    createMany?: applicationsCreateManyJobsInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type partnersCreateNestedOneWithoutJobsInput = {
    create?: XOR<partnersCreateWithoutJobsInput, partnersUncheckedCreateWithoutJobsInput>
    connectOrCreate?: partnersCreateOrConnectWithoutJobsInput
    connect?: partnersWhereUniqueInput
  }

  export type applicationsUncheckedCreateNestedManyWithoutJobsInput = {
    create?: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput> | applicationsCreateWithoutJobsInput[] | applicationsUncheckedCreateWithoutJobsInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutJobsInput | applicationsCreateOrConnectWithoutJobsInput[]
    createMany?: applicationsCreateManyJobsInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type EnumJobTypeFieldUpdateOperationsInput = {
    set?: $Enums.JobType
  }

  export type jobsUpdatetagsInput = {
    set?: $Enums.JobTag[]
    push?: $Enums.JobTag | $Enums.JobTag[]
  }

  export type applicationsUpdateManyWithoutJobsNestedInput = {
    create?: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput> | applicationsCreateWithoutJobsInput[] | applicationsUncheckedCreateWithoutJobsInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutJobsInput | applicationsCreateOrConnectWithoutJobsInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutJobsInput | applicationsUpsertWithWhereUniqueWithoutJobsInput[]
    createMany?: applicationsCreateManyJobsInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutJobsInput | applicationsUpdateWithWhereUniqueWithoutJobsInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutJobsInput | applicationsUpdateManyWithWhereWithoutJobsInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type partnersUpdateOneWithoutJobsNestedInput = {
    create?: XOR<partnersCreateWithoutJobsInput, partnersUncheckedCreateWithoutJobsInput>
    connectOrCreate?: partnersCreateOrConnectWithoutJobsInput
    upsert?: partnersUpsertWithoutJobsInput
    disconnect?: partnersWhereInput | boolean
    delete?: partnersWhereInput | boolean
    connect?: partnersWhereUniqueInput
    update?: XOR<XOR<partnersUpdateToOneWithWhereWithoutJobsInput, partnersUpdateWithoutJobsInput>, partnersUncheckedUpdateWithoutJobsInput>
  }

  export type applicationsUncheckedUpdateManyWithoutJobsNestedInput = {
    create?: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput> | applicationsCreateWithoutJobsInput[] | applicationsUncheckedCreateWithoutJobsInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutJobsInput | applicationsCreateOrConnectWithoutJobsInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutJobsInput | applicationsUpsertWithWhereUniqueWithoutJobsInput[]
    createMany?: applicationsCreateManyJobsInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutJobsInput | applicationsUpdateWithWhereUniqueWithoutJobsInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutJobsInput | applicationsUpdateManyWithWhereWithoutJobsInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type jobsCreateNestedManyWithoutPartnersInput = {
    create?: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput> | jobsCreateWithoutPartnersInput[] | jobsUncheckedCreateWithoutPartnersInput[]
    connectOrCreate?: jobsCreateOrConnectWithoutPartnersInput | jobsCreateOrConnectWithoutPartnersInput[]
    createMany?: jobsCreateManyPartnersInputEnvelope
    connect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
  }

  export type jobsUncheckedCreateNestedManyWithoutPartnersInput = {
    create?: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput> | jobsCreateWithoutPartnersInput[] | jobsUncheckedCreateWithoutPartnersInput[]
    connectOrCreate?: jobsCreateOrConnectWithoutPartnersInput | jobsCreateOrConnectWithoutPartnersInput[]
    createMany?: jobsCreateManyPartnersInputEnvelope
    connect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
  }

  export type jobsUpdateManyWithoutPartnersNestedInput = {
    create?: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput> | jobsCreateWithoutPartnersInput[] | jobsUncheckedCreateWithoutPartnersInput[]
    connectOrCreate?: jobsCreateOrConnectWithoutPartnersInput | jobsCreateOrConnectWithoutPartnersInput[]
    upsert?: jobsUpsertWithWhereUniqueWithoutPartnersInput | jobsUpsertWithWhereUniqueWithoutPartnersInput[]
    createMany?: jobsCreateManyPartnersInputEnvelope
    set?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    disconnect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    delete?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    connect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    update?: jobsUpdateWithWhereUniqueWithoutPartnersInput | jobsUpdateWithWhereUniqueWithoutPartnersInput[]
    updateMany?: jobsUpdateManyWithWhereWithoutPartnersInput | jobsUpdateManyWithWhereWithoutPartnersInput[]
    deleteMany?: jobsScalarWhereInput | jobsScalarWhereInput[]
  }

  export type jobsUncheckedUpdateManyWithoutPartnersNestedInput = {
    create?: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput> | jobsCreateWithoutPartnersInput[] | jobsUncheckedCreateWithoutPartnersInput[]
    connectOrCreate?: jobsCreateOrConnectWithoutPartnersInput | jobsCreateOrConnectWithoutPartnersInput[]
    upsert?: jobsUpsertWithWhereUniqueWithoutPartnersInput | jobsUpsertWithWhereUniqueWithoutPartnersInput[]
    createMany?: jobsCreateManyPartnersInputEnvelope
    set?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    disconnect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    delete?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    connect?: jobsWhereUniqueInput | jobsWhereUniqueInput[]
    update?: jobsUpdateWithWhereUniqueWithoutPartnersInput | jobsUpdateWithWhereUniqueWithoutPartnersInput[]
    updateMany?: jobsUpdateManyWithWhereWithoutPartnersInput | jobsUpdateManyWithWhereWithoutPartnersInput[]
    deleteMany?: jobsScalarWhereInput | jobsScalarWhereInput[]
  }

  export type applicationsCreateNestedManyWithoutResumesInput = {
    create?: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput> | applicationsCreateWithoutResumesInput[] | applicationsUncheckedCreateWithoutResumesInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutResumesInput | applicationsCreateOrConnectWithoutResumesInput[]
    createMany?: applicationsCreateManyResumesInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type usersCreateNestedOneWithoutResumesInput = {
    create?: XOR<usersCreateWithoutResumesInput, usersUncheckedCreateWithoutResumesInput>
    connectOrCreate?: usersCreateOrConnectWithoutResumesInput
    connect?: usersWhereUniqueInput
  }

  export type applicationsUncheckedCreateNestedManyWithoutResumesInput = {
    create?: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput> | applicationsCreateWithoutResumesInput[] | applicationsUncheckedCreateWithoutResumesInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutResumesInput | applicationsCreateOrConnectWithoutResumesInput[]
    createMany?: applicationsCreateManyResumesInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type applicationsUpdateManyWithoutResumesNestedInput = {
    create?: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput> | applicationsCreateWithoutResumesInput[] | applicationsUncheckedCreateWithoutResumesInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutResumesInput | applicationsCreateOrConnectWithoutResumesInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutResumesInput | applicationsUpsertWithWhereUniqueWithoutResumesInput[]
    createMany?: applicationsCreateManyResumesInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutResumesInput | applicationsUpdateWithWhereUniqueWithoutResumesInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutResumesInput | applicationsUpdateManyWithWhereWithoutResumesInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type usersUpdateOneRequiredWithoutResumesNestedInput = {
    create?: XOR<usersCreateWithoutResumesInput, usersUncheckedCreateWithoutResumesInput>
    connectOrCreate?: usersCreateOrConnectWithoutResumesInput
    upsert?: usersUpsertWithoutResumesInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutResumesInput, usersUpdateWithoutResumesInput>, usersUncheckedUpdateWithoutResumesInput>
  }

  export type applicationsUncheckedUpdateManyWithoutResumesNestedInput = {
    create?: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput> | applicationsCreateWithoutResumesInput[] | applicationsUncheckedCreateWithoutResumesInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutResumesInput | applicationsCreateOrConnectWithoutResumesInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutResumesInput | applicationsUpsertWithWhereUniqueWithoutResumesInput[]
    createMany?: applicationsCreateManyResumesInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutResumesInput | applicationsUpdateWithWhereUniqueWithoutResumesInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutResumesInput | applicationsUpdateManyWithWhereWithoutResumesInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type applicationsCreateNestedManyWithoutUsersInput = {
    create?: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput> | applicationsCreateWithoutUsersInput[] | applicationsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutUsersInput | applicationsCreateOrConnectWithoutUsersInput[]
    createMany?: applicationsCreateManyUsersInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type dashboard_activityCreateNestedManyWithoutUsersInput = {
    create?: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput> | dashboard_activityCreateWithoutUsersInput[] | dashboard_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: dashboard_activityCreateOrConnectWithoutUsersInput | dashboard_activityCreateOrConnectWithoutUsersInput[]
    createMany?: dashboard_activityCreateManyUsersInputEnvelope
    connect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
  }

  export type resumesCreateNestedManyWithoutUsersInput = {
    create?: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput> | resumesCreateWithoutUsersInput[] | resumesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: resumesCreateOrConnectWithoutUsersInput | resumesCreateOrConnectWithoutUsersInput[]
    createMany?: resumesCreateManyUsersInputEnvelope
    connect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
  }

  export type applicationsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput> | applicationsCreateWithoutUsersInput[] | applicationsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutUsersInput | applicationsCreateOrConnectWithoutUsersInput[]
    createMany?: applicationsCreateManyUsersInputEnvelope
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
  }

  export type dashboard_activityUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput> | dashboard_activityCreateWithoutUsersInput[] | dashboard_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: dashboard_activityCreateOrConnectWithoutUsersInput | dashboard_activityCreateOrConnectWithoutUsersInput[]
    createMany?: dashboard_activityCreateManyUsersInputEnvelope
    connect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
  }

  export type resumesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput> | resumesCreateWithoutUsersInput[] | resumesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: resumesCreateOrConnectWithoutUsersInput | resumesCreateOrConnectWithoutUsersInput[]
    createMany?: resumesCreateManyUsersInputEnvelope
    connect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableEnumProgramTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProgramType | null
  }

  export type applicationsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput> | applicationsCreateWithoutUsersInput[] | applicationsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutUsersInput | applicationsCreateOrConnectWithoutUsersInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutUsersInput | applicationsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: applicationsCreateManyUsersInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutUsersInput | applicationsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutUsersInput | applicationsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type dashboard_activityUpdateManyWithoutUsersNestedInput = {
    create?: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput> | dashboard_activityCreateWithoutUsersInput[] | dashboard_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: dashboard_activityCreateOrConnectWithoutUsersInput | dashboard_activityCreateOrConnectWithoutUsersInput[]
    upsert?: dashboard_activityUpsertWithWhereUniqueWithoutUsersInput | dashboard_activityUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: dashboard_activityCreateManyUsersInputEnvelope
    set?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    disconnect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    delete?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    connect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    update?: dashboard_activityUpdateWithWhereUniqueWithoutUsersInput | dashboard_activityUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: dashboard_activityUpdateManyWithWhereWithoutUsersInput | dashboard_activityUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: dashboard_activityScalarWhereInput | dashboard_activityScalarWhereInput[]
  }

  export type resumesUpdateManyWithoutUsersNestedInput = {
    create?: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput> | resumesCreateWithoutUsersInput[] | resumesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: resumesCreateOrConnectWithoutUsersInput | resumesCreateOrConnectWithoutUsersInput[]
    upsert?: resumesUpsertWithWhereUniqueWithoutUsersInput | resumesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: resumesCreateManyUsersInputEnvelope
    set?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    disconnect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    delete?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    connect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    update?: resumesUpdateWithWhereUniqueWithoutUsersInput | resumesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: resumesUpdateManyWithWhereWithoutUsersInput | resumesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: resumesScalarWhereInput | resumesScalarWhereInput[]
  }

  export type applicationsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput> | applicationsCreateWithoutUsersInput[] | applicationsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: applicationsCreateOrConnectWithoutUsersInput | applicationsCreateOrConnectWithoutUsersInput[]
    upsert?: applicationsUpsertWithWhereUniqueWithoutUsersInput | applicationsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: applicationsCreateManyUsersInputEnvelope
    set?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    disconnect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    delete?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    connect?: applicationsWhereUniqueInput | applicationsWhereUniqueInput[]
    update?: applicationsUpdateWithWhereUniqueWithoutUsersInput | applicationsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: applicationsUpdateManyWithWhereWithoutUsersInput | applicationsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
  }

  export type dashboard_activityUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput> | dashboard_activityCreateWithoutUsersInput[] | dashboard_activityUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: dashboard_activityCreateOrConnectWithoutUsersInput | dashboard_activityCreateOrConnectWithoutUsersInput[]
    upsert?: dashboard_activityUpsertWithWhereUniqueWithoutUsersInput | dashboard_activityUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: dashboard_activityCreateManyUsersInputEnvelope
    set?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    disconnect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    delete?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    connect?: dashboard_activityWhereUniqueInput | dashboard_activityWhereUniqueInput[]
    update?: dashboard_activityUpdateWithWhereUniqueWithoutUsersInput | dashboard_activityUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: dashboard_activityUpdateManyWithWhereWithoutUsersInput | dashboard_activityUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: dashboard_activityScalarWhereInput | dashboard_activityScalarWhereInput[]
  }

  export type resumesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput> | resumesCreateWithoutUsersInput[] | resumesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: resumesCreateOrConnectWithoutUsersInput | resumesCreateOrConnectWithoutUsersInput[]
    upsert?: resumesUpsertWithWhereUniqueWithoutUsersInput | resumesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: resumesCreateManyUsersInputEnvelope
    set?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    disconnect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    delete?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    connect?: resumesWhereUniqueInput | resumesWhereUniqueInput[]
    update?: resumesUpdateWithWhereUniqueWithoutUsersInput | resumesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: resumesUpdateManyWithWhereWithoutUsersInput | resumesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: resumesScalarWhereInput | resumesScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumAppHistoryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppHistoryStatus | EnumAppHistoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppHistoryStatusFilter<$PrismaModel> | $Enums.AppHistoryStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAppHistoryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppHistoryStatus | EnumAppHistoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppHistoryStatus[] | ListEnumAppHistoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppHistoryStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppHistoryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppHistoryStatusFilter<$PrismaModel>
    _max?: NestedEnumAppHistoryStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | EnumJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJobTypeFilter<$PrismaModel> | $Enums.JobType
  }

  export type NestedEnumJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | EnumJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobType[] | ListEnumJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.JobType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobTypeFilter<$PrismaModel>
    _max?: NestedEnumJobTypeFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumProgramTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramType | EnumProgramTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProgramTypeNullableFilter<$PrismaModel> | $Enums.ProgramType | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumProgramTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramType | EnumProgramTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProgramType[] | ListEnumProgramTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProgramTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProgramType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProgramTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumProgramTypeNullableFilter<$PrismaModel>
  }

  export type applicationsCreateWithoutApp_status_historyInput = {
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    jobs: jobsCreateNestedOneWithoutApplicationsInput
    resumes?: resumesCreateNestedOneWithoutApplicationsInput
    users: usersCreateNestedOneWithoutApplicationsInput
  }

  export type applicationsUncheckedCreateWithoutApp_status_historyInput = {
    application_id?: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
  }

  export type applicationsCreateOrConnectWithoutApp_status_historyInput = {
    where: applicationsWhereUniqueInput
    create: XOR<applicationsCreateWithoutApp_status_historyInput, applicationsUncheckedCreateWithoutApp_status_historyInput>
  }

  export type applicationsUpsertWithoutApp_status_historyInput = {
    update: XOR<applicationsUpdateWithoutApp_status_historyInput, applicationsUncheckedUpdateWithoutApp_status_historyInput>
    create: XOR<applicationsCreateWithoutApp_status_historyInput, applicationsUncheckedCreateWithoutApp_status_historyInput>
    where?: applicationsWhereInput
  }

  export type applicationsUpdateToOneWithWhereWithoutApp_status_historyInput = {
    where?: applicationsWhereInput
    data: XOR<applicationsUpdateWithoutApp_status_historyInput, applicationsUncheckedUpdateWithoutApp_status_historyInput>
  }

  export type applicationsUpdateWithoutApp_status_historyInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    jobs?: jobsUpdateOneRequiredWithoutApplicationsNestedInput
    resumes?: resumesUpdateOneWithoutApplicationsNestedInput
    users?: usersUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateWithoutApp_status_historyInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type app_status_historyCreateWithoutApplicationsInput = {
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
  }

  export type app_status_historyUncheckedCreateWithoutApplicationsInput = {
    app_history_id?: number
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
  }

  export type app_status_historyCreateOrConnectWithoutApplicationsInput = {
    where: app_status_historyWhereUniqueInput
    create: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput>
  }

  export type app_status_historyCreateManyApplicationsInputEnvelope = {
    data: app_status_historyCreateManyApplicationsInput | app_status_historyCreateManyApplicationsInput[]
    skipDuplicates?: boolean
  }

  export type jobsCreateWithoutApplicationsInput = {
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
    partners?: partnersCreateNestedOneWithoutJobsInput
  }

  export type jobsUncheckedCreateWithoutApplicationsInput = {
    job_id?: number
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    partner_id?: number | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
  }

  export type jobsCreateOrConnectWithoutApplicationsInput = {
    where: jobsWhereUniqueInput
    create: XOR<jobsCreateWithoutApplicationsInput, jobsUncheckedCreateWithoutApplicationsInput>
  }

  export type resumesCreateWithoutApplicationsInput = {
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
    users: usersCreateNestedOneWithoutResumesInput
  }

  export type resumesUncheckedCreateWithoutApplicationsInput = {
    resume_id?: number
    user_id: number
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
  }

  export type resumesCreateOrConnectWithoutApplicationsInput = {
    where: resumesWhereUniqueInput
    create: XOR<resumesCreateWithoutApplicationsInput, resumesUncheckedCreateWithoutApplicationsInput>
  }

  export type usersCreateWithoutApplicationsInput = {
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    dashboard_activity?: dashboard_activityCreateNestedManyWithoutUsersInput
    resumes?: resumesCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutApplicationsInput = {
    user_id?: number
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    dashboard_activity?: dashboard_activityUncheckedCreateNestedManyWithoutUsersInput
    resumes?: resumesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutApplicationsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutApplicationsInput, usersUncheckedCreateWithoutApplicationsInput>
  }

  export type app_status_historyUpsertWithWhereUniqueWithoutApplicationsInput = {
    where: app_status_historyWhereUniqueInput
    update: XOR<app_status_historyUpdateWithoutApplicationsInput, app_status_historyUncheckedUpdateWithoutApplicationsInput>
    create: XOR<app_status_historyCreateWithoutApplicationsInput, app_status_historyUncheckedCreateWithoutApplicationsInput>
  }

  export type app_status_historyUpdateWithWhereUniqueWithoutApplicationsInput = {
    where: app_status_historyWhereUniqueInput
    data: XOR<app_status_historyUpdateWithoutApplicationsInput, app_status_historyUncheckedUpdateWithoutApplicationsInput>
  }

  export type app_status_historyUpdateManyWithWhereWithoutApplicationsInput = {
    where: app_status_historyScalarWhereInput
    data: XOR<app_status_historyUpdateManyMutationInput, app_status_historyUncheckedUpdateManyWithoutApplicationsInput>
  }

  export type app_status_historyScalarWhereInput = {
    AND?: app_status_historyScalarWhereInput | app_status_historyScalarWhereInput[]
    OR?: app_status_historyScalarWhereInput[]
    NOT?: app_status_historyScalarWhereInput | app_status_historyScalarWhereInput[]
    app_history_id?: IntFilter<"app_status_history"> | number
    application_id?: IntFilter<"app_status_history"> | number
    status?: EnumAppHistoryStatusFilter<"app_status_history"> | $Enums.AppHistoryStatus
    changed_at?: DateTimeNullableFilter<"app_status_history"> | Date | string | null
  }

  export type jobsUpsertWithoutApplicationsInput = {
    update: XOR<jobsUpdateWithoutApplicationsInput, jobsUncheckedUpdateWithoutApplicationsInput>
    create: XOR<jobsCreateWithoutApplicationsInput, jobsUncheckedCreateWithoutApplicationsInput>
    where?: jobsWhereInput
  }

  export type jobsUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: jobsWhereInput
    data: XOR<jobsUpdateWithoutApplicationsInput, jobsUncheckedUpdateWithoutApplicationsInput>
  }

  export type jobsUpdateWithoutApplicationsInput = {
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
    partners?: partnersUpdateOneWithoutJobsNestedInput
  }

  export type jobsUncheckedUpdateWithoutApplicationsInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    partner_id?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
  }

  export type resumesUpsertWithoutApplicationsInput = {
    update: XOR<resumesUpdateWithoutApplicationsInput, resumesUncheckedUpdateWithoutApplicationsInput>
    create: XOR<resumesCreateWithoutApplicationsInput, resumesUncheckedCreateWithoutApplicationsInput>
    where?: resumesWhereInput
  }

  export type resumesUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: resumesWhereInput
    data: XOR<resumesUpdateWithoutApplicationsInput, resumesUncheckedUpdateWithoutApplicationsInput>
  }

  export type resumesUpdateWithoutApplicationsInput = {
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneRequiredWithoutResumesNestedInput
  }

  export type resumesUncheckedUpdateWithoutApplicationsInput = {
    resume_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUpsertWithoutApplicationsInput = {
    update: XOR<usersUpdateWithoutApplicationsInput, usersUncheckedUpdateWithoutApplicationsInput>
    create: XOR<usersCreateWithoutApplicationsInput, usersUncheckedCreateWithoutApplicationsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutApplicationsInput, usersUncheckedUpdateWithoutApplicationsInput>
  }

  export type usersUpdateWithoutApplicationsInput = {
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dashboard_activity?: dashboard_activityUpdateManyWithoutUsersNestedInput
    resumes?: resumesUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutApplicationsInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dashboard_activity?: dashboard_activityUncheckedUpdateManyWithoutUsersNestedInput
    resumes?: resumesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutDashboard_activityInput = {
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsCreateNestedManyWithoutUsersInput
    resumes?: resumesCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutDashboard_activityInput = {
    user_id?: number
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsUncheckedCreateNestedManyWithoutUsersInput
    resumes?: resumesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutDashboard_activityInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutDashboard_activityInput, usersUncheckedCreateWithoutDashboard_activityInput>
  }

  export type usersUpsertWithoutDashboard_activityInput = {
    update: XOR<usersUpdateWithoutDashboard_activityInput, usersUncheckedUpdateWithoutDashboard_activityInput>
    create: XOR<usersCreateWithoutDashboard_activityInput, usersUncheckedCreateWithoutDashboard_activityInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutDashboard_activityInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutDashboard_activityInput, usersUncheckedUpdateWithoutDashboard_activityInput>
  }

  export type usersUpdateWithoutDashboard_activityInput = {
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateManyWithoutUsersNestedInput
    resumes?: resumesUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutDashboard_activityInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUncheckedUpdateManyWithoutUsersNestedInput
    resumes?: resumesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type applicationsCreateWithoutJobsInput = {
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    app_status_history?: app_status_historyCreateNestedManyWithoutApplicationsInput
    resumes?: resumesCreateNestedOneWithoutApplicationsInput
    users: usersCreateNestedOneWithoutApplicationsInput
  }

  export type applicationsUncheckedCreateWithoutJobsInput = {
    application_id?: number
    user_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
    app_status_history?: app_status_historyUncheckedCreateNestedManyWithoutApplicationsInput
  }

  export type applicationsCreateOrConnectWithoutJobsInput = {
    where: applicationsWhereUniqueInput
    create: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput>
  }

  export type applicationsCreateManyJobsInputEnvelope = {
    data: applicationsCreateManyJobsInput | applicationsCreateManyJobsInput[]
    skipDuplicates?: boolean
  }

  export type partnersCreateWithoutJobsInput = {
    name: string
    description?: string | null
    industry?: string | null
    location?: string | null
    jobs_available?: number | null
    applicants?: number | null
    applicants_hired?: number | null
  }

  export type partnersUncheckedCreateWithoutJobsInput = {
    partner_id?: number
    name: string
    description?: string | null
    industry?: string | null
    location?: string | null
    jobs_available?: number | null
    applicants?: number | null
    applicants_hired?: number | null
  }

  export type partnersCreateOrConnectWithoutJobsInput = {
    where: partnersWhereUniqueInput
    create: XOR<partnersCreateWithoutJobsInput, partnersUncheckedCreateWithoutJobsInput>
  }

  export type applicationsUpsertWithWhereUniqueWithoutJobsInput = {
    where: applicationsWhereUniqueInput
    update: XOR<applicationsUpdateWithoutJobsInput, applicationsUncheckedUpdateWithoutJobsInput>
    create: XOR<applicationsCreateWithoutJobsInput, applicationsUncheckedCreateWithoutJobsInput>
  }

  export type applicationsUpdateWithWhereUniqueWithoutJobsInput = {
    where: applicationsWhereUniqueInput
    data: XOR<applicationsUpdateWithoutJobsInput, applicationsUncheckedUpdateWithoutJobsInput>
  }

  export type applicationsUpdateManyWithWhereWithoutJobsInput = {
    where: applicationsScalarWhereInput
    data: XOR<applicationsUpdateManyMutationInput, applicationsUncheckedUpdateManyWithoutJobsInput>
  }

  export type applicationsScalarWhereInput = {
    AND?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
    OR?: applicationsScalarWhereInput[]
    NOT?: applicationsScalarWhereInput | applicationsScalarWhereInput[]
    application_id?: IntFilter<"applications"> | number
    user_id?: IntFilter<"applications"> | number
    job_id?: IntFilter<"applications"> | number
    status?: EnumApplicationStatusFilter<"applications"> | $Enums.ApplicationStatus
    applied_at?: DateTimeNullableFilter<"applications"> | Date | string | null
    status_updated?: DateTimeNullableFilter<"applications"> | Date | string | null
    resume_id?: IntNullableFilter<"applications"> | number | null
    position?: StringNullableFilter<"applications"> | string | null
  }

  export type partnersUpsertWithoutJobsInput = {
    update: XOR<partnersUpdateWithoutJobsInput, partnersUncheckedUpdateWithoutJobsInput>
    create: XOR<partnersCreateWithoutJobsInput, partnersUncheckedCreateWithoutJobsInput>
    where?: partnersWhereInput
  }

  export type partnersUpdateToOneWithWhereWithoutJobsInput = {
    where?: partnersWhereInput
    data: XOR<partnersUpdateWithoutJobsInput, partnersUncheckedUpdateWithoutJobsInput>
  }

  export type partnersUpdateWithoutJobsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type partnersUncheckedUpdateWithoutJobsInput = {
    partner_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobs_available?: NullableIntFieldUpdateOperationsInput | number | null
    applicants?: NullableIntFieldUpdateOperationsInput | number | null
    applicants_hired?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type jobsCreateWithoutPartnersInput = {
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
    applications?: applicationsCreateNestedManyWithoutJobsInput
  }

  export type jobsUncheckedCreateWithoutPartnersInput = {
    job_id?: number
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
    applications?: applicationsUncheckedCreateNestedManyWithoutJobsInput
  }

  export type jobsCreateOrConnectWithoutPartnersInput = {
    where: jobsWhereUniqueInput
    create: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput>
  }

  export type jobsCreateManyPartnersInputEnvelope = {
    data: jobsCreateManyPartnersInput | jobsCreateManyPartnersInput[]
    skipDuplicates?: boolean
  }

  export type jobsUpsertWithWhereUniqueWithoutPartnersInput = {
    where: jobsWhereUniqueInput
    update: XOR<jobsUpdateWithoutPartnersInput, jobsUncheckedUpdateWithoutPartnersInput>
    create: XOR<jobsCreateWithoutPartnersInput, jobsUncheckedCreateWithoutPartnersInput>
  }

  export type jobsUpdateWithWhereUniqueWithoutPartnersInput = {
    where: jobsWhereUniqueInput
    data: XOR<jobsUpdateWithoutPartnersInput, jobsUncheckedUpdateWithoutPartnersInput>
  }

  export type jobsUpdateManyWithWhereWithoutPartnersInput = {
    where: jobsScalarWhereInput
    data: XOR<jobsUpdateManyMutationInput, jobsUncheckedUpdateManyWithoutPartnersInput>
  }

  export type jobsScalarWhereInput = {
    AND?: jobsScalarWhereInput | jobsScalarWhereInput[]
    OR?: jobsScalarWhereInput[]
    NOT?: jobsScalarWhereInput | jobsScalarWhereInput[]
    job_id?: IntFilter<"jobs"> | number
    job_type?: EnumJobTypeFilter<"jobs"> | $Enums.JobType
    title?: StringFilter<"jobs"> | string
    description?: StringNullableFilter<"jobs"> | string | null
    company?: StringFilter<"jobs"> | string
    website?: StringNullableFilter<"jobs"> | string | null
    location?: StringNullableFilter<"jobs"> | string | null
    partner_id?: IntNullableFilter<"jobs"> | number | null
    created_at?: DateTimeNullableFilter<"jobs"> | Date | string | null
    tags?: EnumJobTagNullableListFilter<"jobs">
  }

  export type applicationsCreateWithoutResumesInput = {
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    app_status_history?: app_status_historyCreateNestedManyWithoutApplicationsInput
    jobs: jobsCreateNestedOneWithoutApplicationsInput
    users: usersCreateNestedOneWithoutApplicationsInput
  }

  export type applicationsUncheckedCreateWithoutResumesInput = {
    application_id?: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    app_status_history?: app_status_historyUncheckedCreateNestedManyWithoutApplicationsInput
  }

  export type applicationsCreateOrConnectWithoutResumesInput = {
    where: applicationsWhereUniqueInput
    create: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput>
  }

  export type applicationsCreateManyResumesInputEnvelope = {
    data: applicationsCreateManyResumesInput | applicationsCreateManyResumesInput[]
    skipDuplicates?: boolean
  }

  export type usersCreateWithoutResumesInput = {
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsCreateNestedManyWithoutUsersInput
    dashboard_activity?: dashboard_activityCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutResumesInput = {
    user_id?: number
    is_active?: boolean
    username: string
    first_name: string
    last_name: string
    password_hash: string
    is_admin?: boolean | null
    program?: $Enums.ProgramType | null
    created_at?: Date | string | null
    applications?: applicationsUncheckedCreateNestedManyWithoutUsersInput
    dashboard_activity?: dashboard_activityUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutResumesInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutResumesInput, usersUncheckedCreateWithoutResumesInput>
  }

  export type applicationsUpsertWithWhereUniqueWithoutResumesInput = {
    where: applicationsWhereUniqueInput
    update: XOR<applicationsUpdateWithoutResumesInput, applicationsUncheckedUpdateWithoutResumesInput>
    create: XOR<applicationsCreateWithoutResumesInput, applicationsUncheckedCreateWithoutResumesInput>
  }

  export type applicationsUpdateWithWhereUniqueWithoutResumesInput = {
    where: applicationsWhereUniqueInput
    data: XOR<applicationsUpdateWithoutResumesInput, applicationsUncheckedUpdateWithoutResumesInput>
  }

  export type applicationsUpdateManyWithWhereWithoutResumesInput = {
    where: applicationsScalarWhereInput
    data: XOR<applicationsUpdateManyMutationInput, applicationsUncheckedUpdateManyWithoutResumesInput>
  }

  export type usersUpsertWithoutResumesInput = {
    update: XOR<usersUpdateWithoutResumesInput, usersUncheckedUpdateWithoutResumesInput>
    create: XOR<usersCreateWithoutResumesInput, usersUncheckedCreateWithoutResumesInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutResumesInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutResumesInput, usersUncheckedUpdateWithoutResumesInput>
  }

  export type usersUpdateWithoutResumesInput = {
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateManyWithoutUsersNestedInput
    dashboard_activity?: dashboard_activityUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutResumesInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    is_admin?: NullableBoolFieldUpdateOperationsInput | boolean | null
    program?: NullableEnumProgramTypeFieldUpdateOperationsInput | $Enums.ProgramType | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUncheckedUpdateManyWithoutUsersNestedInput
    dashboard_activity?: dashboard_activityUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type applicationsCreateWithoutUsersInput = {
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
    app_status_history?: app_status_historyCreateNestedManyWithoutApplicationsInput
    jobs: jobsCreateNestedOneWithoutApplicationsInput
    resumes?: resumesCreateNestedOneWithoutApplicationsInput
  }

  export type applicationsUncheckedCreateWithoutUsersInput = {
    application_id?: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
    app_status_history?: app_status_historyUncheckedCreateNestedManyWithoutApplicationsInput
  }

  export type applicationsCreateOrConnectWithoutUsersInput = {
    where: applicationsWhereUniqueInput
    create: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput>
  }

  export type applicationsCreateManyUsersInputEnvelope = {
    data: applicationsCreateManyUsersInput | applicationsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type dashboard_activityCreateWithoutUsersInput = {
    action: string
    details?: string | null
    timestamp?: Date | string | null
  }

  export type dashboard_activityUncheckedCreateWithoutUsersInput = {
    activity_id?: number
    action: string
    details?: string | null
    timestamp?: Date | string | null
  }

  export type dashboard_activityCreateOrConnectWithoutUsersInput = {
    where: dashboard_activityWhereUniqueInput
    create: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput>
  }

  export type dashboard_activityCreateManyUsersInputEnvelope = {
    data: dashboard_activityCreateManyUsersInput | dashboard_activityCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type resumesCreateWithoutUsersInput = {
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
    applications?: applicationsCreateNestedManyWithoutResumesInput
  }

  export type resumesUncheckedCreateWithoutUsersInput = {
    resume_id?: number
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
    applications?: applicationsUncheckedCreateNestedManyWithoutResumesInput
  }

  export type resumesCreateOrConnectWithoutUsersInput = {
    where: resumesWhereUniqueInput
    create: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput>
  }

  export type resumesCreateManyUsersInputEnvelope = {
    data: resumesCreateManyUsersInput | resumesCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type applicationsUpsertWithWhereUniqueWithoutUsersInput = {
    where: applicationsWhereUniqueInput
    update: XOR<applicationsUpdateWithoutUsersInput, applicationsUncheckedUpdateWithoutUsersInput>
    create: XOR<applicationsCreateWithoutUsersInput, applicationsUncheckedCreateWithoutUsersInput>
  }

  export type applicationsUpdateWithWhereUniqueWithoutUsersInput = {
    where: applicationsWhereUniqueInput
    data: XOR<applicationsUpdateWithoutUsersInput, applicationsUncheckedUpdateWithoutUsersInput>
  }

  export type applicationsUpdateManyWithWhereWithoutUsersInput = {
    where: applicationsScalarWhereInput
    data: XOR<applicationsUpdateManyMutationInput, applicationsUncheckedUpdateManyWithoutUsersInput>
  }

  export type dashboard_activityUpsertWithWhereUniqueWithoutUsersInput = {
    where: dashboard_activityWhereUniqueInput
    update: XOR<dashboard_activityUpdateWithoutUsersInput, dashboard_activityUncheckedUpdateWithoutUsersInput>
    create: XOR<dashboard_activityCreateWithoutUsersInput, dashboard_activityUncheckedCreateWithoutUsersInput>
  }

  export type dashboard_activityUpdateWithWhereUniqueWithoutUsersInput = {
    where: dashboard_activityWhereUniqueInput
    data: XOR<dashboard_activityUpdateWithoutUsersInput, dashboard_activityUncheckedUpdateWithoutUsersInput>
  }

  export type dashboard_activityUpdateManyWithWhereWithoutUsersInput = {
    where: dashboard_activityScalarWhereInput
    data: XOR<dashboard_activityUpdateManyMutationInput, dashboard_activityUncheckedUpdateManyWithoutUsersInput>
  }

  export type dashboard_activityScalarWhereInput = {
    AND?: dashboard_activityScalarWhereInput | dashboard_activityScalarWhereInput[]
    OR?: dashboard_activityScalarWhereInput[]
    NOT?: dashboard_activityScalarWhereInput | dashboard_activityScalarWhereInput[]
    activity_id?: IntFilter<"dashboard_activity"> | number
    admin_id?: IntFilter<"dashboard_activity"> | number
    action?: StringFilter<"dashboard_activity"> | string
    details?: StringNullableFilter<"dashboard_activity"> | string | null
    timestamp?: DateTimeNullableFilter<"dashboard_activity"> | Date | string | null
  }

  export type resumesUpsertWithWhereUniqueWithoutUsersInput = {
    where: resumesWhereUniqueInput
    update: XOR<resumesUpdateWithoutUsersInput, resumesUncheckedUpdateWithoutUsersInput>
    create: XOR<resumesCreateWithoutUsersInput, resumesUncheckedCreateWithoutUsersInput>
  }

  export type resumesUpdateWithWhereUniqueWithoutUsersInput = {
    where: resumesWhereUniqueInput
    data: XOR<resumesUpdateWithoutUsersInput, resumesUncheckedUpdateWithoutUsersInput>
  }

  export type resumesUpdateManyWithWhereWithoutUsersInput = {
    where: resumesScalarWhereInput
    data: XOR<resumesUpdateManyMutationInput, resumesUncheckedUpdateManyWithoutUsersInput>
  }

  export type resumesScalarWhereInput = {
    AND?: resumesScalarWhereInput | resumesScalarWhereInput[]
    OR?: resumesScalarWhereInput[]
    NOT?: resumesScalarWhereInput | resumesScalarWhereInput[]
    resume_id?: IntFilter<"resumes"> | number
    user_id?: IntFilter<"resumes"> | number
    file_path?: StringFilter<"resumes"> | string
    file_name?: StringFilter<"resumes"> | string
    is_default?: BoolNullableFilter<"resumes"> | boolean | null
    created_at?: DateTimeNullableFilter<"resumes"> | Date | string | null
  }

  export type app_status_historyCreateManyApplicationsInput = {
    app_history_id?: number
    status: $Enums.AppHistoryStatus
    changed_at?: Date | string | null
  }

  export type app_status_historyUpdateWithoutApplicationsInput = {
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type app_status_historyUncheckedUpdateWithoutApplicationsInput = {
    app_history_id?: IntFieldUpdateOperationsInput | number
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type app_status_historyUncheckedUpdateManyWithoutApplicationsInput = {
    app_history_id?: IntFieldUpdateOperationsInput | number
    status?: EnumAppHistoryStatusFieldUpdateOperationsInput | $Enums.AppHistoryStatus
    changed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type applicationsCreateManyJobsInput = {
    application_id?: number
    user_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
  }

  export type applicationsUpdateWithoutJobsInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUpdateManyWithoutApplicationsNestedInput
    resumes?: resumesUpdateOneWithoutApplicationsNestedInput
    users?: usersUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateWithoutJobsInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUncheckedUpdateManyWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateManyWithoutJobsInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type jobsCreateManyPartnersInput = {
    job_id?: number
    job_type: $Enums.JobType
    title: string
    description?: string | null
    company: string
    website?: string | null
    location?: string | null
    created_at?: Date | string | null
    tags?: jobsCreatetagsInput | $Enums.JobTag[]
  }

  export type jobsUpdateWithoutPartnersInput = {
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
    applications?: applicationsUpdateManyWithoutJobsNestedInput
  }

  export type jobsUncheckedUpdateWithoutPartnersInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
    applications?: applicationsUncheckedUpdateManyWithoutJobsNestedInput
  }

  export type jobsUncheckedUpdateManyWithoutPartnersInput = {
    job_id?: IntFieldUpdateOperationsInput | number
    job_type?: EnumJobTypeFieldUpdateOperationsInput | $Enums.JobType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: jobsUpdatetagsInput | $Enums.JobTag[]
  }

  export type applicationsCreateManyResumesInput = {
    application_id?: number
    user_id: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    position?: string | null
  }

  export type applicationsUpdateWithoutResumesInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUpdateManyWithoutApplicationsNestedInput
    jobs?: jobsUpdateOneRequiredWithoutApplicationsNestedInput
    users?: usersUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateWithoutResumesInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUncheckedUpdateManyWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateManyWithoutResumesInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type applicationsCreateManyUsersInput = {
    application_id?: number
    job_id: number
    status: $Enums.ApplicationStatus
    applied_at?: Date | string | null
    status_updated?: Date | string | null
    resume_id?: number | null
    position?: string | null
  }

  export type dashboard_activityCreateManyUsersInput = {
    activity_id?: number
    action: string
    details?: string | null
    timestamp?: Date | string | null
  }

  export type resumesCreateManyUsersInput = {
    resume_id?: number
    file_path: string
    file_name: string
    is_default?: boolean | null
    created_at?: Date | string | null
  }

  export type applicationsUpdateWithoutUsersInput = {
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUpdateManyWithoutApplicationsNestedInput
    jobs?: jobsUpdateOneRequiredWithoutApplicationsNestedInput
    resumes?: resumesUpdateOneWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateWithoutUsersInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    app_status_history?: app_status_historyUncheckedUpdateManyWithoutApplicationsNestedInput
  }

  export type applicationsUncheckedUpdateManyWithoutUsersInput = {
    application_id?: IntFieldUpdateOperationsInput | number
    job_id?: IntFieldUpdateOperationsInput | number
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    applied_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status_updated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume_id?: NullableIntFieldUpdateOperationsInput | number | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type dashboard_activityUpdateWithoutUsersInput = {
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dashboard_activityUncheckedUpdateWithoutUsersInput = {
    activity_id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dashboard_activityUncheckedUpdateManyWithoutUsersInput = {
    activity_id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type resumesUpdateWithoutUsersInput = {
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUpdateManyWithoutResumesNestedInput
  }

  export type resumesUncheckedUpdateWithoutUsersInput = {
    resume_id?: IntFieldUpdateOperationsInput | number
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    applications?: applicationsUncheckedUpdateManyWithoutResumesNestedInput
  }

  export type resumesUncheckedUpdateManyWithoutUsersInput = {
    resume_id?: IntFieldUpdateOperationsInput | number
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    is_default?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}