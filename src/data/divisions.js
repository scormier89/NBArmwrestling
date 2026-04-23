/**
 * @typedef {Object} WeightClassGroup
 * @property {string} division
 * @property {"Right" | "Left" | "Both"} hand
 * @property {string[]} classes
 * @property {string=} note
 */

/**
 * @typedef {Object} AgeDivision
 * @property {string} name
 * @property {string} ageRule
 * @property {WeightClassGroup[]} groups
 * @property {number=} fee
 */

export const ALL_DIVISIONS = [
  {
    name: "Senior Men",
    ageRule: "Open (any age eligible for senior)",
    groups: [
      {
        division: "Men Senior",
        hand: "Both",
        classes: ["60kg", "65kg", "70kg", "75kg", "80kg", "85kg", "90kg", "100kg", "110kg", "110+kg"],
      },
    ],
  },
  {
    name: "Senior Women",
    ageRule: "Open",
    groups: [
      {
        division: "Women Senior",
        hand: "Both",
        classes: ["55kg", "60kg", "70kg", "80kg", "80+kg"],
      },
    ],
  },
  {
    name: "Masters Men (40+)",
    ageRule: "40+ (age at end of calendar year)",
    groups: [
      {
        division: "Men Masters",
        hand: "Both",
        classes: ["70kg", "80kg", "90kg", "100kg", "100+kg"],
      },
    ],
  },
  {
    name: "Masters Women (40+)",
    ageRule: "40+",
    groups: [
      {
        division: "Women Masters",
        hand: "Both",
        classes: ["70kg", "80kg", "80+kg"],
      },
    ],
  },
  {
    name: "Grand Masters Men (50+)",
    ageRule: "50+",
    groups: [
      {
        division: "Men Grand Masters",
        hand: "Both",
        classes: ["75kg", "90kg", "90+kg"],
      },
    ],
  },
  {
    name: "Senior Grand Masters Men (60+)",
    ageRule: "60+",
    groups: [
      {
        division: "Men Senior Grand Masters",
        hand: "Both",
        classes: ["80kg", "90kg", "90+kg"],
      },
    ],
  },
  {
    name: "Para Men",
    ageRule: "Classification per CAWF policy",
    groups: [
      {
        division: "Para Men",
        hand: "Both",
        classes: ["75kg", "75+kg"],
        note: "Para classes require confirmed CAWF/WAF para eligibility and classification.",
      },
    ],
  },
  {
    name: "Para Women",
    ageRule: "Classification per CAWF policy",
    groups: [
      {
        division: "Para Women",
        hand: "Both",
        classes: ["Open"],
        note: "Para classes require confirmed CAWF/WAF para eligibility and classification.",
      },
    ],
  },
  {
    name: "Junior / Youth Mixed & Girls & Boys",
    ageRule: "Age by Dec 31 of competition year",
    groups: [
      { division: "Mixed 10U", hand: "Both", classes: ["40kg", "40+kg"] },
      { division: "Girls 12", hand: "Both", classes: ["Open"] },
      { division: "Girls 14", hand: "Both", classes: ["60kg", "60+kg"] },
      { division: "Girls 16", hand: "Both", classes: ["65kg", "65+kg"] },
      { division: "Girls 18", hand: "Both", classes: ["70kg", "70+kg"] },
      { division: "Boys 12", hand: "Both", classes: ["Open"] },
      { division: "Boys 14", hand: "Both", classes: ["65kg", "65+kg"] },
      { division: "Boys 16", hand: "Both", classes: ["70kg", "70+kg"] },
      { division: "Boys 18", hand: "Both", classes: ["70kg", "80kg", "90kg", "90+kg"] },
    ],
  },
];

export function resolveActiveDivisions(divisionsConfig) {
  if (!divisionsConfig || divisionsConfig.length === 0) {
    return ALL_DIVISIONS;
  }
  return divisionsConfig;
}
