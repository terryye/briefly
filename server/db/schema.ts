import { relations, sql } from "drizzle-orm";
import {
    date,
    index,
    integer,
    jsonb,
    pgTableCreator,
    primaryKey,
    serial,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator(
    (name) => `${process.env.DATABASE_TB_PREFIX}${name}`
);

export const users = createTable("user", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
}));

export const accounts = createTable(
    "account",
    {
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("provider_account_id", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_user_id_idx").on(account.userId),
    })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        sessionToken: varchar("session_token", { length: 255 })
            .notNull()
            .primaryKey(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: timestamp("expires", {
            mode: "date",
            withTimezone: true,
        }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_user_id_idx").on(session.userId),
    })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    "verification_token",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", {
            mode: "date",
            withTimezone: true,
        }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export const article = createTable("article", {
    id: serial().primaryKey().notNull(),
    articleId: uuid("article_id").defaultRandom().notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    createAt: timestamp("create_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
    date: date({ mode: "date" }).notNull(),
    poster: varchar({ length: 255 }).notNull(),
    audio: varchar({ length: 255 }).notNull(),
});

export interface Feedback {
    title: string;
    content: string;
}

export const answer = createTable("answer", {
    id: serial().primaryKey().notNull(),
    answerId: uuid("answer_id").defaultRandom().notNull(),
    answer: text().notNull(),
    score: integer().notNull(),
    createAt: timestamp("create_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
    feedbacks: jsonb().$type<Feedback[]>(),
    questionId: uuid("question_id").notNull(),
    userId: uuid("user_id").notNull(),
    articleId: uuid("article_id").notNull(),
    updateAt: timestamp("update_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
});

export const question = createTable("question", {
    id: serial().primaryKey().notNull(),
    questionId: uuid("question_id").defaultRandom().notNull(),
    articleId: uuid("article_id").notNull(),
    seq: integer().notNull(),
    question: text().notNull(),
    type: integer().notNull(),
    tip: text().notNull(),
    answer: text(),
});

export const summary = createTable("summary", {
    id: serial().primaryKey().notNull(),
    summaryId: uuid("summary_id").defaultRandom().notNull(),
    articleId: uuid("article_id").notNull(),
    score: integer().notNull(),
    post: text().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    articleDate: date("article_date", { mode: "date" }).notNull(),
    createAt: timestamp("create_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
    feedback: jsonb().notNull(),
});

export const history = createTable("history", {
    id: serial().primaryKey().notNull(),
    historyId: uuid("history_id").defaultRandom().notNull(),
    articleId: uuid("article_id").notNull(),
    score: integer().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createAt: timestamp("create_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
    updateAt: timestamp("update_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
    questionsNum: integer("questions_num").notNull(),
    answersNum: integer("answers_num").notNull(),
});

export const sumup = createTable("sumup", {
    id: serial().primaryKey().notNull(),
    sumupId: uuid("sumup_id").defaultRandom().notNull(),
    articleId: uuid("article_id").notNull(),
    userId: uuid("user_id").notNull(),
    message: text().notNull(),
    type: integer().notNull(),
    extra: jsonb(),
    createAt: timestamp("create_at", { withTimezone: true, mode: "string" })
        .defaultNow()
        .notNull(),
});
