/**
 * Used this file to store static data in order to mock the UI functionality rather than implementing actual API
 */
export const commands = [
  "client",
  "job",
  "amount",
  "update",
  "run",
  "jira",
  "timer",
  "comment",
  "invoice",
];
export const commandParams: Record<string, string[]> = {
  invoice: ["client", "job", "amount"],
}; // @todo:: Improvise it by defining it with commands and create proper type.
export const mentions = [
  "Alice",
  "John",
  "David",
  "Ice",
  "Blue",
  "Stark",
  "Erick",
  "Trump",
];
