import { describe, expect, it } from "vitest";
import { eventPhase, formatEventRange, isExpired, manilaDayKey } from "./dates";

describe("manilaDayKey", () => {
  it("uses the Manila calendar day, not UTC", () => {
    // 2026-12-05 23:30 UTC is already 2026-12-06 07:30 in Manila.
    expect(manilaDayKey("2026-12-05T23:30:00Z")).toBe("2026-12-06");
    expect(manilaDayKey("2026-12-05T15:59:59Z")).toBe("2026-12-05");
    expect(manilaDayKey("2026-12-05T16:00:00Z")).toBe("2026-12-06");
  });
});

describe("formatEventRange", () => {
  it("formats a same-day event once", () => {
    expect(formatEventRange("2026-12-05T14:00:00+08:00", "2026-12-05T18:00:00+08:00")).toBe(
      "Sat, Dec 5, 2026, 2:00 PM to 6:00 PM PHT",
    );
  });

  it("shows both days for an event that crosses midnight", () => {
    expect(formatEventRange("2026-12-05T20:00:00+08:00", "2026-12-06T02:00:00+08:00")).toBe(
      "Sat, Dec 5, 8:00 PM to Sun, Dec 6, 2026, 2:00 AM PHT",
    );
  });

  it("shows both years for an event over New Year", () => {
    expect(formatEventRange("2026-12-31T22:00:00+08:00", "2027-01-01T01:00:00+08:00")).toBe(
      "Thu, Dec 31, 2026, 10:00 PM to Fri, Jan 1, 2027, 1:00 AM PHT",
    );
  });

  it("formats noon and midnight correctly", () => {
    expect(formatEventRange("2026-12-05T00:00:00+08:00", "2026-12-05T12:30:00+08:00")).toBe(
      "Sat, Dec 5, 2026, 12:00 AM to 12:30 PM PHT",
    );
  });

  it("is independent of the input offset", () => {
    expect(formatEventRange("2026-12-05T06:00:00Z", "2026-12-05T10:00:00Z")).toBe(
      "Sat, Dec 5, 2026, 2:00 PM to 6:00 PM PHT",
    );
  });
});

describe("eventPhase", () => {
  const overnight = { startsAt: "2026-12-05T20:00:00+08:00", endsAt: "2026-12-06T02:00:00+08:00" };

  it("is upcoming before the start", () => {
    expect(eventPhase(overnight, new Date("2026-12-05T19:59:00+08:00"))).toBe("upcoming");
  });

  it("is live after midnight while an overnight event is still running", () => {
    expect(eventPhase(overnight, new Date("2026-12-06T01:00:00+08:00"))).toBe("live");
  });

  it("is past exactly at the end", () => {
    expect(eventPhase(overnight, new Date("2026-12-06T02:00:00+08:00"))).toBe("past");
  });

  it("is cancelled regardless of dates", () => {
    expect(eventPhase({ ...overnight, cancelled: true }, new Date("2020-01-01T00:00:00Z"))).toBe(
      "cancelled",
    );
  });
});

describe("isExpired", () => {
  it("keeps a job visible through the end of its expiry day in Manila", () => {
    expect(isExpired("2026-12-05", new Date("2026-12-05T23:59:00+08:00"))).toBe(false);
    expect(isExpired("2026-12-05", new Date("2026-12-06T00:00:00+08:00"))).toBe(true);
  });
});
