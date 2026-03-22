const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: "process.env.OPENAI_API_KEY,"
});

async function main() {
    try {
        await openai.models.list();
        console.log("SUCCESS");
        process.exit(0);
    } catch (error) {
        console.error("ERROR", error.message);
        process.exit(1);
    }
}

main();
