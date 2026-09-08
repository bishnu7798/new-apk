import { PoleModel } from '../types';

/**
 * Resequences a list of poles in geographic/route order:
 * 1. Sets slNo = 1, 2, 3, 4...
 * 2. Assigns sequential pole numbers based on type:
 *    - 'Ex Pole' -> E1, E2, E3...
 *    - 'New pole' -> P1, P2, P3...
 *    - 'Others' / other -> O1, O2, O3...
 * 
 * Example 1 (Mid-Span New Pole):
 * [E1, E2, P1, P2] -> Insert New Pole between E1 and E2
 * Result: [E1, P1, E2, P2, P3]
 * 
 * Example 2 (Mid-Span Ex Pole):
 * [E1, E2, P1, P2] -> Insert Ex Pole between E1 and E2
 * Result: [E1, E2, E3, P1, P2]
 */
export function resequencePolesList(poles: PoleModel[]): PoleModel[] {
  let eCount = 0;
  let pCount = 0;
  let oCount = 0;

  return poles.map((p, index) => {
    let prefix = 'P';
    if (p.typeOfPole === 'Ex Pole') {
      prefix = 'E';
      eCount++;
      return {
        ...p,
        slNo: index + 1,
        poleNo: `${prefix}${eCount}`,
      };
    } else if (p.typeOfPole === 'New pole') {
      prefix = 'P';
      pCount++;
      return {
        ...p,
        slNo: index + 1,
        poleNo: `${prefix}${pCount}`,
      };
    } else {
      prefix = 'O';
      oCount++;
      return {
        ...p,
        slNo: index + 1,
        poleNo: `${prefix}${oCount}`,
      };
    }
  });
}

/**
 * Calculates the prospective pole number for a new pole inserted at `insertIndex`
 */
export function calculateProspectivePoleNo(
  existingPoles: PoleModel[],
  insertIndex: number,
  typeOfPole: string
): { prospectivePoleNo: string; shiftMessage: string } {
  const prefix = typeOfPole === 'Ex Pole' ? 'E' : typeOfPole === 'Others' ? 'O' : 'P';

  // Count how many poles with this prefix appear BEFORE insertIndex
  const beforePoles = existingPoles.slice(0, insertIndex);
  const countBefore = beforePoles.filter((p) => {
    if (typeOfPole === 'Ex Pole') return p.typeOfPole === 'Ex Pole';
    if (typeOfPole === 'New pole') return p.typeOfPole === 'New pole';
    return p.typeOfPole !== 'Ex Pole' && p.typeOfPole !== 'New pole';
  }).length;

  const assignedNum = countBefore + 1;
  const prospectivePoleNo = `${prefix}${assignedNum}`;

  // Count how many poles of this type exist AT OR AFTER insertIndex that will be shifted
  const afterPoles = existingPoles.slice(insertIndex);
  const willShift = afterPoles.filter((p) => {
    if (typeOfPole === 'Ex Pole') return p.typeOfPole === 'Ex Pole';
    if (typeOfPole === 'New pole') return p.typeOfPole === 'New pole';
    return p.typeOfPole !== 'Ex Pole' && p.typeOfPole !== 'New pole';
  });

  let shiftMessage = '';
  if (willShift.length > 0) {
    const fromNum = assignedNum;
    shiftMessage = `Following ${prefix}-poles will shift (${prefix}${fromNum} → ${prefix}${fromNum + 1}...)`;
  } else {
    shiftMessage = `Assigned as ${prefix}${assignedNum} in sequence`;
  }

  return { prospectivePoleNo, shiftMessage };
}
