import { exec } from "child_process";

// Handle POST requests to the ollama API
export async function POST(req) {
  const { text } = await req.json(); // Get JSON body from request

  // Construct the command to run ollama 3.1 llama model
  const command = `ollama run llama3.1 "${text}"`;

  // Log the command that will be executed
  console.log(`Running command: ${command}`); // Log the command being run

  return new Promise((resolve, reject) => {
    console.log("command passed to Promise");
    exec(command, (error, stdout, stderr) => {
      console.log("command executed");
      if (error) {
        console.error(`Error executing command: ${error}`);
        console.error(`stderr: ${stderr}`); // Log stderr for more details
        return resolve(
          new Response(JSON.stringify({ error: "Command execution failed" }), {
            status: 500,
          })
        );
      }

      // Log the output of the command
      console.log(`Command output: ${stdout.trim()}`); // Log the output of the command

      // If command is successful, return the result (stdout) to the client
      resolve(
        new Response(JSON.stringify({ modifiedText: stdout.trim() }), {
          status: 200,
        })
      );
    });
  });
}
