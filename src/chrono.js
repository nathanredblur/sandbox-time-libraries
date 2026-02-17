import * as chrono from "chrono-node";

export const chronoParser = (dateString) => {
  return chrono.parseDate(dateString);
};
