<template>
  <main>
    <div>
      <codemirror
        v-model="code"
        placeholder="Code goes here..."
        :style="{ height: '400px', width: '100%', fontSize: '1rem' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      />
      <label for="arguments" class="arguments-label">Input</label>
      <textarea v-model="args" name="arguments" id="arguments"></textarea>
      <div class="submit-btn-wrap">
        <button class="submit-btn" @click="runCode">submit</button>
      </div>
    </div>
    <div class="output">
      <h1 class="output-label">Output</h1>
      <pre class="code" :class="{ error: isError }">
        {{ output }}
      </pre>
    </div>
  </main>
</template>

<style>
pre {
  padding: 1rem;
  background: #f3f7f7;
  color: #262b2e;
  font-size: 1.25rem;
  white-space: pre-line;
}
pre.error {
  background: rgb(252, 127, 127);
}
textarea {
  padding: 1rem;
  width: 100%;
  background: #adbac7;
  font-size: 1.25rem;
  outline: none;
  resize: none;
  border: none;
}

.arguments-label {
  color: #adbac7;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 1rem 0;
  display: inline-block;
}

.output-label {
  color: #adbac7;
  font-size: 1.4rem;
  margin: 1rem 0;
}
.code {
  background: #adbac7;
}

.submit-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(173, 186, 199, 0.26);
  border-radius: 2px;
  margin: 0.5rem;
  background: #2d333b;
  color: white;
  cursor: pointer;
  margin: 1rem 0;
}

.submit-btn:hover {
  background: #262b2e;
}
</style>
<script>
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { ref } from "vue";

export default {
  components: {
    Codemirror,
  },
  setup() {
    const code =
      ref(`// use the readLine() function to read input one line at a time
const arg1 = parseInt(readLine())
const arg2 = parseInt(readLine())

// print to the console to see your output
console.log(arg1+arg2)`);
    const extensions = [javascript(), oneDark];
    const args = ref("1\n2");
    const output = ref("");
    const isError = ref(false);

    async function runCode() {
      console.log(code.value, args.value);
      const response = await fetch("http://localhost:1337/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.value,
          args: args.value,
        }),
      });
      const json = await response.json();
      if (json.status === "ok") {
        output.value = json.data;
      } else {
        isError.value = true;
        output.value = json.error;
      }

      console.log(json);
    }
    return {
      isError,
      output,
      args,
      runCode,
      code,
      extensions,
      log: console.log,
    };
  },
};
</script>
