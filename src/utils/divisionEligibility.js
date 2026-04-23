export const age2026 = (birthDate) => {
  const year = new Date(birthDate).getFullYear();
  if (!year) return undefined;
  return 2026 - year;
};

const youthGroupAllowed = (groupName, age, gender) => {
  if (age > 18) return false;
  if (/Mixed 10U/i.test(groupName)) return age <= 10;

  const match = /(Girls|Boys)\s+(\d+)/i.exec(groupName);
  if (!match) return false;

  const type = match[1].toLowerCase();
  const max = parseInt(match[2], 10);

  if (type === "girls" && gender === "Female" && age <= max) return true;
  if (type === "boys" && gender === "Male" && age <= max) return true;
  return false;
};

const isFemaleCategory = (name = "") =>
  /\b(women|ladies|female|girls)\b/i.test(name);

const isMaleCategory = (name = "") =>
  /\b(men|male|boys)\b/i.test(name);

const eligibleAdultDivision = (division, age, gender) => {
  if (/Junior\s*\/\s*Youth/i.test(division.name)) return false;
  if (isMaleCategory(division.name) && !isFemaleCategory(division.name) && gender !== "Male") return false;
  if (isFemaleCategory(division.name) && gender !== "Female") return false;
  if (/Senior Grand Masters/i.test(division.name)) return age >= 60;
  if (/Grand Masters/i.test(division.name)) return age >= 50;
  if (/Masters/i.test(division.name)) return age >= 40;
  if (/Para/i.test(division.name)) return age >= 18;
  if (/Senior/i.test(division.name)) return age >= 18;
  return true;
};

const eligibleSeniorForJunior = (division, gender) => {
  if (/Junior\s*\/\s*Youth/i.test(division.name)) return false;
  if (/Senior\s+Grand\s+Masters/i.test(division.name)) return false;
  if (/Grand\s+Masters/i.test(division.name)) return false;
  if (/Masters/i.test(division.name)) return false;
  if (/Para/i.test(division.name)) return false;
  if (!/Senior/i.test(division.name)) return false;
  if (isMaleCategory(division.name) && !isFemaleCategory(division.name) && gender !== "Male") return false;
  if (isFemaleCategory(division.name) && gender !== "Female") return false;
  return true;
};

export const filterDivisionsForAthlete = (divisions, birthDate, gender) => {
  const age = age2026(birthDate);
  if (!Array.isArray(divisions) || age === undefined || !gender) return [];

  const isYouth = age <= 18;
  const results = [];

  for (const division of divisions) {
    const isJuniorYouthDivision = /Junior\s*\/\s*Youth/i.test(division.name);

    if (isJuniorYouthDivision) {
      const groups = (division.groups || []).filter((group) =>
        youthGroupAllowed(group.division, age, gender),
      );
      if (groups.length) results.push({ ...division, groups });
      continue;
    }

    const juniorCanEnterSenior = isYouth && eligibleSeniorForJunior(division, gender);
    const adultEligible = eligibleAdultDivision(division, age, gender);
    if (juniorCanEnterSenior || adultEligible) results.push(division);
  }

  if (isYouth) {
    results.sort((a, b) => {
      const aJunior = /Junior\s*\/\s*Youth/i.test(a.name) ? 0 : 1;
      const bJunior = /Junior\s*\/\s*Youth/i.test(b.name) ? 0 : 1;
      return aJunior - bJunior;
    });
  }

  return results;
};
