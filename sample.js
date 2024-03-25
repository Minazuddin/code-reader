const code = `
    const sum = (a, b) => {
        console.log(a, b);
        return a + b;
    }

    const diff = (a, b) => {
        console.log(a, b);
        return a - b;
    }

    let a = 20, b = 10;

    const result = sum(a, b);

    diff(a, b);
`;

const a = 10;
let fnName = 'sum';

// 2.1) Find function call
const fnCallWithoutAssignmentRegex = new RegExp(
  `(?<!.)${fnName}[\(](.*)[;]`,
  "g"
); // sum(a, b);
const fnCallWithoutAssignmentMatches = code.match(fnCallWithoutAssignmentRegex);
console.log("fnCallWithoutAssignmentMatches", fnCallWithoutAssignmentMatches);

const fnCallWithAssignmentRegex = new RegExp(
  `(?<== )${fnName}[\(](.*)[;]`,
  "g"
); // const result = sum(a, b);
const fnCallWithAssignmentMatches = code.match(fnCallWithAssignmentRegex);
console.log("fnCallWithAssignmentsMatches", fnCallWithAssignmentMatches);

sum()