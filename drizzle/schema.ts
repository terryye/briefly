import { pgTable, varchar, timestamp, index, foreignKey, unique, serial, uuid, integer, text, jsonb, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const brieflyUser = pgTable("briefly_user", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	image: varchar({ length: 255 }),
});

export const brieflySession = pgTable("briefly_session", {
	sessionToken: varchar("session_token", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("session_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [brieflyUser.id],
			name: "briefly_session_user_id_briefly_user_id_fk"
		}),
]);

export const brieflySummary = pgTable("briefly_summary", {
	id: serial().notNull(),
	summaryId: uuid("summary_id").defaultRandom().notNull(),
	score: integer().notNull(),
	post: text().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	createAt: timestamp("create_at", { mode: 'string' }).defaultNow(),
	feedback: jsonb().notNull(),
	articleDate: date("article_date"),
	articleId: uuid("article_id").notNull(),
}, (table) => [
	unique("briefly_summary_summary_id").on(table.summaryId),
	unique("briefly_summary_article_id_user_id").on(table.userId, table.articleId),
]);

export const brieflyArticle = pgTable("briefly_article", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	createAt: timestamp("create_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	date: date().notNull(),
	poster: varchar({ length: 255 }).notNull(),
	articleId: uuid("article_id").defaultRandom(),
	summaryQuestions: jsonb("summary_questions"),
	discussionQuestions: jsonb("discussion_questions"),
}, (table) => [
	unique("constraint_title_date").on(table.title, table.date),
	unique("briefly_article_article_id").on(table.articleId),
]);

export const brieflyVerificationToken = pgTable("briefly_verification_token", {
	identifier: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "briefly_verification_token_identifier_token_pk"}),
]);

export const brieflyAccount = pgTable("briefly_account", {
	userId: varchar("user_id", { length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	provider: varchar({ length: 255 }).notNull(),
	providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: varchar("token_type", { length: 255 }),
	scope: varchar({ length: 255 }),
	idToken: text("id_token"),
	sessionState: varchar("session_state", { length: 255 }),
}, (table) => [
	index("account_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [brieflyUser.id],
			name: "briefly_account_user_id_briefly_user_id_fk"
		}),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "briefly_account_provider_provider_account_id_pk"}),
]);
