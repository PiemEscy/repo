export async function sendEmailActivity(id: string, to: string, subject: string, body: string) {
  const result = {
    success: true,
    messageId: 'mock-msg-' + Math.floor(Math.random() * 10000),
    timestamp: Date.now(),
  };
  console.log(`[SEND_EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`);
  console.log('Mock email returned:', result);
  return result;
}
