import { execFile } from "child_process";
import { rm, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { promisify } from "node:util";

const exec = promisify(execFile);

async function runCode(code, args) {
  try {
    const fileId = nanoid();

    args = String(args)
      .split("\n")
      .map((item) => "'" + String(item) + "'");

    const fullCode = `(async ()=>{
          try{
              const args = [${args}]
              function readLine(){return args.pop()}
              ${code}
          }catch(err){
              console.error(err)
          }
        })()`;

    await writeFile(`src/temp/${fileId}.js`, fullCode);

    const { stderr, stdout } = await exec("node", [`./src/temp/${fileId}.js`]);
    await rm(`./src/temp/${fileId}.js`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout;
  } catch (error) {
    throw new Error(error);
  }
}

export { runCode };
