import { squash } from "../../lib/dsa/lessons/checkCode.ts";
let bad = 0;
const eq = (name: string, got: string, want: string) => {
  const ok = got === want;
  if (!ok) bad++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}\n      got:  ${got}\n      want: ${want}`);
};
eq("python: # inside a string survives",
   squash('cur["#"] = True  # mark the end', "python"), 'cur["#"] = True');
eq("python: real comment goes",
   squash('x = 1  # set x\ny = 2', "python"), 'x = 1 y = 2');
eq("cpp: // inside a string survives",
   squash('cout << "a//b";   // note', "cpp"), 'cout << "a//b";');
eq("cpp: #include is kept",
   squash('#include <iostream>\nint x;', "cpp"), '#include <iostream> int x;');
eq("cpp: block comment goes",
   squash('int a; /* hi */ int b;', "cpp"), 'int a; int b;');
eq("escaped quote does not end the string",
   squash('s = "a\\"# b"  # gone', "python"), 's = "a\\"# b"');
console.log(bad ? `\n${bad} FAILED` : "\nALL PASS");
process.exit(bad ? 1 : 0);
