import ollama from 'ollama';

async function test() {
  try {
    console.log('Connecting to Ollama...');
    const list = await ollama.list();
    console.log('Models found:', list);
    
    console.log('Sending test chat...');
    const response = await ollama.chat({
      model: 'qwen2:0.5b',
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('Response:', response.message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
