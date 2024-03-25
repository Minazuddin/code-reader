const CompileCodeHelpers = require("./compile-code.helpers");

const ReadCodeHelpers = {
  getFunctionMultiLine: (fnSingleLine) => {
    let result = "";

    for (let i = 0; i < fnSingleLine.length; i++) {
      result += fnSingleLine.charAt(i);

      if (
        fnSingleLine.charAt(i) === "{" ||
        (fnSingleLine.charAt(i) === ";" && i !== fnSingleLine.length - 1)
      ) {
        result += "\n\t";
      } else if (
        fnSingleLine.charAt(i) === ";" &&
        i == fnSingleLine.length - 1
      ) {
        result += "\n";
      }
    }

    return result + "}";
  },
  readCodeFlow: async (code) => {
    let result = {
      success: false,
      data: {},
    };

    let output = "";

    // 1) Find all function names (excluding functions in this pattern `obj.func(a, b)`)
    let fnNamesWithoutAssignments = code.match(/(?<!.)\w*(?=\((.*)[;])/g); // sum;
    console.log("fnNamesWithoutAssignments", fnNamesWithoutAssignments);

    if (!fnNamesWithoutAssignments) {
      fnNamesWithoutAssignments = [];
    }

    let fnNamesWithAssignments = code.match(/(?<== )\w*(?=\((.*)[;])/g); // const result = sum;

    if (!fnNamesWithAssignments) {
      fnNamesWithAssignments = [];
    }
    console.log("fnNamesWithAssignments", fnNamesWithAssignments);

    const fnNames = fnNamesWithAssignments.concat(fnNamesWithoutAssignments);
    console.log("fnNames", fnNames);

    // 2) Find all function calls and functions
    let vars = {};

    for (const fnName of fnNames) {
      // 2.1) Find function call
      const fnCallWithoutAssignmentRegex = new RegExp(
        `(?<!.)${fnName}[\(](.*)[;]`,
        "g"
      ); // sum(a, b);
      let fnCallWithoutAssignmentMatches = code.match(
        fnCallWithoutAssignmentRegex
      );
      console.log(
        "fnCallWithoutAssignmentMatches",
        fnCallWithoutAssignmentMatches
      );
      if (!fnCallWithoutAssignmentMatches) {
        fnCallWithoutAssignmentMatches = [];
      }

      const fnCallWithAssignmentRegex = new RegExp(
        `(?<== )${fnName}[\(](.*)[;]`,
        "g"
      ); // const result = sum(a, b);
      let fnCallWithAssignmentMatches = code.match(fnCallWithAssignmentRegex);

      if (!fnCallWithAssignmentMatches) {
        fnCallWithAssignmentMatches = [];
      }
      console.log("fnCallWithAssignmentsMatches", fnCallWithAssignmentMatches);

      const fnCallMatches = fnCallWithoutAssignmentMatches.concat(
        fnCallWithAssignmentMatches
      ); // ['sum', 'diff']

      // 2.2) Find function declaration
      const fnSingleLineRegex = new RegExp(
        `((let|const|var) ${fnName} = (.*?)(?=\})|(function ${fnName}(.*?)(?=\})))`,
        "g"
      );
      const fnSingleLineMatches = code
        .replace(/[\n]/g, "")
        .replace(/[\t]/g, "")
        .match(fnSingleLineRegex);
      const fnSingleLine = fnSingleLineMatches[0];
      const returnMatches = fnSingleLine.match(/return (.*)(?=;)/g);
      const returnStatement = returnMatches[0].replace(/[\sreturn]/g, "");
      console.log("fnSingleLineMatches", fnSingleLineMatches);
      console.log("returnStatement", returnStatement);

      // 2.3) Find arguments
      const args = fnCallMatches[0]
        .substring(fnName.length, fnCallMatches[0].length)
        .replace(/[\(\);]/g, "")
        .split(",");

      // 2.4) Process function arguments (In case of function calls like sum(a, b, '10')), find the values of the variables a and b from code
      let processedArguments = [];

      args.forEach((arg) => {
        if (arg.includes('"') || arg.match(/^\d+/g)) {
          // 2.4.1) arg is a value
          processedArguments.push(arg);
        } else {
          // 2.4.2) arg is a variable

          // find value of arg from code
          const findVarRegex = new RegExp(`${arg} =(.*)`, "g");

          const variableDefinitionMatches = code.match(findVarRegex);

          console.log({
            args,
            variableDefinitionMatches
          });

          let variableDefinition = variableDefinitionMatches[0];

          if (variableDefinition.includes(",")) {
            variableDefinition = variableDefinition.split(",")[0];
          }

          const value = variableDefinition
            .replace(arg, "")
            .replace(/[=\s;]/g, "");

          console.log("value", value);

          processedArguments.push(value);
        }
      });

      // 2.4) Find parameters
      let paramRegex = new RegExp(
        `((?<=(let|const|var) ${fnName}) = [\(](.*?)[\)]|(?<=function ${fnName})[\(](.*?)[\)])`,
        "g"
      );
      let paramMatches = fnSingleLine.match(paramRegex);
      const params = paramMatches[0].replace(/[\(\)\=\s>{]/g, "").split(",");
      console.log("params", params);

      // 2.5) Compute vars
      vars[fnName] = {};
      params.forEach((param, i) => {
        vars[fnName][param] = processedArguments[i];
      });

      // 2.6) Find return value
      // let returnStatementWithValues = returnStatement;

      // for (let prop in vars[fnName]) {
      //   returnStatementWithValues = returnStatementWithValues.replace(
      //     prop,
      //     vars[fnName][prop]
      //   ); // replace `a+b` with `10+b`
      // }
      // console.log("returnStatementWithValues", returnStatementWithValues);

      // let [returnStatementCompileError, returnValue] =
      //   await CompileCodeHelpers.compile(returnStatementWithValues, fnName);
      // if (returnStatementCompileError) {
      //   result.success = false;
      //   result.data = returnStatementCompileError;
      //   return result;
      // }

      console.log("vars", vars);

      // 2.5) Write params values in comment
      let comment = "";

      for (let variable in vars[fnName]) {
        comment += `@param ${variable.trim()} ${vars[fnName][variable]}\n`;
      }

      // 2.7) Write comment before function declaration in output
      output += comment;
      output += "\n";

      // 2.8) Write function declaration
      output += ReadCodeHelpers.getFunctionMultiLine(fnSingleLine);
      output += "\n\n\n";
    }

    console.log("output: ", output);

    let outputHtml = `<pre>${output}</pre>`;

    result.success = true;
    result.data = outputHtml;
    return result;
  },
};

module.exports = ReadCodeHelpers;
