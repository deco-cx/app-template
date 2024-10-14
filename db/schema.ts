import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contact = sqliteTable("contact", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  country: text("country"),
  serialNumber: text("serialNumber"),
  subject: text("subject"),
  message: text("message"),
  personName: text("personName"),
  personSurname: text("personSurname"),
  personEmail: text("personEmail"),
  personPhone: text("personPhone"),
  date: text("date"),
  status: text("status"),
});
