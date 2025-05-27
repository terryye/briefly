import { relations } from "drizzle-orm/relations";
import { brieflyUser, brieflySession, brieflyAccount } from "./schema";

export const brieflySessionRelations = relations(brieflySession, ({one}) => ({
	brieflyUser: one(brieflyUser, {
		fields: [brieflySession.userId],
		references: [brieflyUser.id]
	}),
}));

export const brieflyUserRelations = relations(brieflyUser, ({many}) => ({
	brieflySessions: many(brieflySession),
	brieflyAccounts: many(brieflyAccount),
}));

export const brieflyAccountRelations = relations(brieflyAccount, ({one}) => ({
	brieflyUser: one(brieflyUser, {
		fields: [brieflyAccount.userId],
		references: [brieflyUser.id]
	}),
}));