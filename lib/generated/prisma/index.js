
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.App_status_historyScalarFieldEnum = {
  app_history_id: 'app_history_id',
  application_id: 'application_id',
  status: 'status',
  changed_at: 'changed_at'
};

exports.Prisma.ApplicationsScalarFieldEnum = {
  application_id: 'application_id',
  user_id: 'user_id',
  job_id: 'job_id',
  status: 'status',
  applied_at: 'applied_at',
  status_updated: 'status_updated',
  resume_id: 'resume_id',
  position: 'position'
};

exports.Prisma.Dashboard_activityScalarFieldEnum = {
  activity_id: 'activity_id',
  admin_id: 'admin_id',
  action: 'action',
  details: 'details',
  timestamp: 'timestamp'
};

exports.Prisma.EventsScalarFieldEnum = {
  event_id: 'event_id',
  title: 'title',
  description: 'description',
  event_date: 'event_date',
  created_at: 'created_at'
};

exports.Prisma.JobsScalarFieldEnum = {
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

exports.Prisma.PartnersScalarFieldEnum = {
  partner_id: 'partner_id',
  name: 'name',
  description: 'description',
  industry: 'industry',
  location: 'location',
  jobs_available: 'jobs_available',
  applicants: 'applicants',
  applicants_hired: 'applicants_hired'
};

exports.Prisma.ResumesScalarFieldEnum = {
  resume_id: 'resume_id',
  user_id: 'user_id',
  file_path: 'file_path',
  file_name: 'file_name',
  is_default: 'is_default',
  created_at: 'created_at'
};

exports.Prisma.UsersScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.ProgramType = exports.$Enums.ProgramType = {
  FOUNDATIONS: 'FOUNDATIONS',
  ONE_ZERO_ONE: 'ONE_ZERO_ONE',
  LIFTOFF: 'LIFTOFF',
  ALUMNI: 'ALUMNI'
};

exports.JobType = exports.$Enums.JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  APPRENTICESHIP: 'APPRENTICESHIP',
  INTERNSHIP: 'INTERNSHIP'
};

exports.JobTag = exports.$Enums.JobTag = {
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

exports.ApplicationStatus = exports.$Enums.ApplicationStatus = {
  INTERESTED: 'INTERESTED',
  APPLIED: 'APPLIED',
  REJECTED: 'REJECTED',
  INTERVIEWING: 'INTERVIEWING',
  NEGOTIATING: 'NEGOTIATING',
  ACCEPTED: 'ACCEPTED'
};

exports.AppHistoryStatus = exports.$Enums.AppHistoryStatus = {
  APPLIED: 'APPLIED',
  INTERVIEWING: 'INTERVIEWING',
  OFFERED: 'OFFERED',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  app_status_history: 'app_status_history',
  applications: 'applications',
  dashboard_activity: 'dashboard_activity',
  events: 'events',
  jobs: 'jobs',
  partners: 'partners',
  resumes: 'resumes',
  users: 'users'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Projects\\Launchpad-Career-Hub\\lib\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Projects\\Launchpad-Career-Hub\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": "postgresql://neondb_owner:npg_PYaxFKSNdI65@ep-shrill-recipe-a5byulik-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
      }
    }
  },
  "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../lib/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n/**\n * --------------------------------------------------------------------------\n */\n/**\n * ENUM VALUES\n */\n/**\n * --------------------------------------------------------------------------\n */\nenum ProgramType {\n  FOUNDATIONS\n  ONE_ZERO_ONE\n  LIFTOFF\n  ALUMNI\n}\n\nenum JobType {\n  FULL_TIME\n  PART_TIME\n  CONTRACT\n  APPRENTICESHIP\n  INTERNSHIP\n}\n\nenum JobTag {\n  FULLY_REMOTE\n  HYBRID\n  IN_PERSON\n  FRONT_END\n  BACK_END\n  FULL_STACK\n  NON_PROFIT\n  START_UP\n  EDUCATION\n  HEALTHCARE\n  FINTECH\n  MARKETING\n  DATA_SCIENCE\n  CYBERSECURITY\n  UX_UI_DESIGN\n  IT\n  PRODUCT_MANAGEMENT\n  GAME_DEVELOPMENT\n  AI_ML\n  CLOUD_COMPUTING\n  DEVOPS\n  BUSINESS_ANALYSIS\n  SOCIAL_MEDIA\n}\n\nenum ApplicationStatus {\n  INTERESTED\n  APPLIED\n  REJECTED\n  INTERVIEWING\n  NEGOTIATING\n  ACCEPTED\n}\n\nenum AppHistoryStatus {\n  APPLIED\n  INTERVIEWING\n  OFFERED\n  HIRED\n  REJECTED\n}\n\n/**\n * --------------------------------------------------------------------------\n */\n/**\n * ENUM VALUES\n */\n/**\n * --------------------------------------------------------------------------\n */\n\nmodel app_status_history {\n  app_history_id Int              @id @default(autoincrement())\n  application_id Int\n  status         AppHistoryStatus\n  changed_at     DateTime?        @default(now()) @db.Timestamptz(6)\n  applications   applications     @relation(fields: [application_id], references: [application_id], onDelete: Cascade, onUpdate: NoAction)\n}\n\nmodel applications {\n  application_id     Int                  @id @default(autoincrement())\n  user_id            Int\n  job_id             Int\n  status             ApplicationStatus\n  applied_at         DateTime?            @default(now()) @db.Timestamptz(6)\n  status_updated     DateTime?            @db.Timestamptz(6)\n  resume_id          Int?\n  position           String?\n  app_status_history app_status_history[]\n  jobs               jobs                 @relation(fields: [job_id], references: [job_id], onDelete: Cascade, onUpdate: NoAction)\n  resumes            resumes?             @relation(fields: [resume_id], references: [resume_id], onUpdate: NoAction)\n  users              users                @relation(fields: [user_id], references: [user_id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([application_id], map: \"idx_applications_id\")\n}\n\nmodel dashboard_activity {\n  activity_id Int       @id @default(autoincrement())\n  admin_id    Int\n  action      String    @db.VarChar\n  details     String?\n  timestamp   DateTime? @default(now()) @db.Timestamptz(6)\n  users       users     @relation(fields: [admin_id], references: [user_id], onDelete: Cascade, onUpdate: NoAction)\n}\n\nmodel events {\n  event_id    Int       @id @default(autoincrement())\n  title       String    @db.VarChar\n  description String?\n  event_date  DateTime  @db.Date\n  created_at  DateTime? @default(now()) @db.Timestamptz(6)\n}\n\nmodel jobs {\n  job_id       Int            @id @default(autoincrement())\n  job_type     JobType\n  title        String         @db.VarChar\n  description  String?\n  company      String         @db.VarChar\n  website      String?        @db.VarChar\n  location     String?        @db.VarChar\n  partner_id   Int?\n  created_at   DateTime?      @default(now()) @db.Timestamptz(6)\n  tags         JobTag[]\n  applications applications[]\n  partners     partners?      @relation(fields: [partner_id], references: [partner_id], onUpdate: NoAction)\n\n  @@index([job_id], map: \"idx_jobs_job_id\")\n  @@index([title], map: \"idx_jobs_title\")\n}\n\nmodel partners {\n  partner_id       Int     @id @default(autoincrement())\n  name             String  @db.VarChar\n  description      String?\n  industry         String? @db.VarChar\n  location         String? @db.VarChar\n  jobs_available   Int?    @default(0)\n  applicants       Int?    @default(0)\n  applicants_hired Int?    @default(0)\n  jobs             jobs[]\n}\n\nmodel resumes {\n  resume_id    Int            @id @default(autoincrement())\n  user_id      Int\n  file_path    String         @db.VarChar\n  file_name    String         @db.VarChar\n  is_default   Boolean?       @default(false)\n  created_at   DateTime?      @default(now()) @db.Timestamptz(6)\n  applications applications[]\n  users        users          @relation(fields: [user_id], references: [user_id], onDelete: Cascade, onUpdate: NoAction)\n\n  @@index([resume_id], map: \"idx_resumes_resume_id\")\n}\n\nmodel users {\n  user_id            Int                  @id @default(autoincrement())\n  is_active          Boolean              @default(true)\n  username           String               @db.VarChar\n  first_name         String               @db.VarChar\n  last_name          String               @db.VarChar\n  password_hash      String               @db.VarChar\n  is_admin           Boolean?             @default(false)\n  program            ProgramType?\n  created_at         DateTime?            @default(now()) @db.Timestamptz(6)\n  applications       applications[]\n  dashboard_activity dashboard_activity[]\n  resumes            resumes[]\n\n  @@index([user_id], map: \"idx_users_user_id\")\n}\n",
  "inlineSchemaHash": "9b448905cceba47bbd06781eb892f533af7057ae5a46aaff72774f3c02b8dece",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "lib/generated/prisma",
    "generated/prisma",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"app_status_history\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"app_history_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"application_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AppHistoryStatus\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applications\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"applications\",\"nativeType\":null,\"relationName\":\"app_status_historyToapplications\",\"relationFromFields\":[\"application_id\"],\"relationToFields\":[\"application_id\"],\"relationOnDelete\":\"Cascade\",\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"applications\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"application_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ApplicationStatus\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applied_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status_updated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resume_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"position\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"app_status_history\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"app_status_history\",\"nativeType\":null,\"relationName\":\"app_status_historyToapplications\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"jobs\",\"nativeType\":null,\"relationName\":\"applicationsTojobs\",\"relationFromFields\":[\"job_id\"],\"relationToFields\":[\"job_id\"],\"relationOnDelete\":\"Cascade\",\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resumes\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"resumes\",\"nativeType\":null,\"relationName\":\"applicationsToresumes\",\"relationFromFields\":[\"resume_id\"],\"relationToFields\":[\"resume_id\"],\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"users\",\"nativeType\":null,\"relationName\":\"applicationsTousers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"user_id\"],\"relationOnDelete\":\"Cascade\",\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"dashboard_activity\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"activity_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"details\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"users\",\"nativeType\":null,\"relationName\":\"dashboard_activityTousers\",\"relationFromFields\":[\"admin_id\"],\"relationToFields\":[\"user_id\"],\"relationOnDelete\":\"Cascade\",\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"events\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"event_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Date\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"jobs\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"job_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"company\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"website\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobTag\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"applications\",\"nativeType\":null,\"relationName\":\"applicationsTojobs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partners\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"partners\",\"nativeType\":null,\"relationName\":\"jobsTopartners\",\"relationFromFields\":[\"partner_id\"],\"relationToFields\":[\"partner_id\"],\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"partners\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"partner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"industry\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs_available\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applicants\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applicants_hired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"jobs\",\"nativeType\":null,\"relationName\":\"jobsTopartners\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"resumes\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"resume_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_path\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_default\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"applications\",\"nativeType\":null,\"relationName\":\"applicationsToresumes\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"users\",\"nativeType\":null,\"relationName\":\"resumesTousers\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"user_id\"],\"relationOnDelete\":\"Cascade\",\"relationOnUpdate\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"users\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"first_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"VarChar\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_admin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"program\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProgramType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[\"6\"]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"applications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"applications\",\"nativeType\":null,\"relationName\":\"applicationsTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dashboard_activity\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"dashboard_activity\",\"nativeType\":null,\"relationName\":\"dashboard_activityTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resumes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"resumes\",\"nativeType\":null,\"relationName\":\"resumesTousers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"ProgramType\":{\"values\":[{\"name\":\"FOUNDATIONS\",\"dbName\":null},{\"name\":\"ONE_ZERO_ONE\",\"dbName\":null},{\"name\":\"LIFTOFF\",\"dbName\":null},{\"name\":\"ALUMNI\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"--------------------------------------------------------------------------\\\\nENUM VALUES\\\\n--------------------------------------------------------------------------\"},\"JobType\":{\"values\":[{\"name\":\"FULL_TIME\",\"dbName\":null},{\"name\":\"PART_TIME\",\"dbName\":null},{\"name\":\"CONTRACT\",\"dbName\":null},{\"name\":\"APPRENTICESHIP\",\"dbName\":null},{\"name\":\"INTERNSHIP\",\"dbName\":null}],\"dbName\":null},\"JobTag\":{\"values\":[{\"name\":\"FULLY_REMOTE\",\"dbName\":null},{\"name\":\"HYBRID\",\"dbName\":null},{\"name\":\"IN_PERSON\",\"dbName\":null},{\"name\":\"FRONT_END\",\"dbName\":null},{\"name\":\"BACK_END\",\"dbName\":null},{\"name\":\"FULL_STACK\",\"dbName\":null},{\"name\":\"NON_PROFIT\",\"dbName\":null},{\"name\":\"START_UP\",\"dbName\":null},{\"name\":\"EDUCATION\",\"dbName\":null},{\"name\":\"HEALTHCARE\",\"dbName\":null},{\"name\":\"FINTECH\",\"dbName\":null},{\"name\":\"MARKETING\",\"dbName\":null},{\"name\":\"DATA_SCIENCE\",\"dbName\":null},{\"name\":\"CYBERSECURITY\",\"dbName\":null},{\"name\":\"UX_UI_DESIGN\",\"dbName\":null},{\"name\":\"IT\",\"dbName\":null},{\"name\":\"PRODUCT_MANAGEMENT\",\"dbName\":null},{\"name\":\"GAME_DEVELOPMENT\",\"dbName\":null},{\"name\":\"AI_ML\",\"dbName\":null},{\"name\":\"CLOUD_COMPUTING\",\"dbName\":null},{\"name\":\"DEVOPS\",\"dbName\":null},{\"name\":\"BUSINESS_ANALYSIS\",\"dbName\":null},{\"name\":\"SOCIAL_MEDIA\",\"dbName\":null}],\"dbName\":null},\"ApplicationStatus\":{\"values\":[{\"name\":\"INTERESTED\",\"dbName\":null},{\"name\":\"APPLIED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"INTERVIEWING\",\"dbName\":null},{\"name\":\"NEGOTIATING\",\"dbName\":null},{\"name\":\"ACCEPTED\",\"dbName\":null}],\"dbName\":null},\"AppHistoryStatus\":{\"values\":[{\"name\":\"APPLIED\",\"dbName\":null},{\"name\":\"INTERVIEWING\",\"dbName\":null},{\"name\":\"OFFERED\",\"dbName\":null},{\"name\":\"HIRED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "lib/generated/prisma/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "lib/generated/prisma/schema.prisma")
