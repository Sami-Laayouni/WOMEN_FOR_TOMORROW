# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Retell API Configuration
RETELL_API_KEY=your_retell_api_key_here
RETELL_AGENT_ID=agent_8746f2856aa615812ba28fdfeb

# Retell Phone Number (if using phone calls)
RETELL_PHONE_NUMBER=+1234567890
```

## Getting Your Retell Credentials

1. **Sign up for Retell AI**: Go to https://retellai.com and create an account

2. **Get your API Key**:
   - Go to your Retell dashboard
   - Navigate to Settings > API Keys
   - Copy your API key

3. **Configure Your Agent**:
   - The agent ID is already set: `agent_8746f2856aa615812ba28fdfeb`
   - In your Retell dashboard, configure this agent with:
     - **Voice**: Choose a hyper-realistic voice (e.g., "11labs-Jenny", "11labs-Adrian")
     - **Language**: English (US)
     - **Prompt**: Copy the agent prompt from `lib/retell-config.ts`

4. **Configure Webhook**:
   - In your agent settings, set the webhook URL to: `https://your-domain.com/api/webhook/retell`
   - For local development, use a service like ngrok: `https://your-ngrok-url.ngrok.io/api/webhook/retell`

## Testing Locally

1. Install dependencies: `npm install`
2. Set up `.env.local` with your credentials
3. Run the dev server: `npm run dev`
4. For webhook testing, use ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```
5. Update the webhook URL in Retell dashboard with your ngrok URL

## Troubleshooting API Endpoint Errors

If you see an error like "Cannot POST /create-web-call", it means the Retell API endpoint URL might be incorrect. 

**To fix this:**

1. **Check Retell API Documentation**: Visit https://docs.retellai.com and find the correct endpoint for creating web calls
2. **Verify API Base URL**: The endpoint format might be different. You can override it by adding to `.env.local`:
   ```env
   RETELL_API_BASE_URL=https://api.retellai.com
   ```
3. **Check API Version**: Retell might use different API versions (v1, v2, etc.). Check their documentation for the correct version
4. **Verify Credentials**: Make sure your `RETELL_API_KEY` and `RETELL_AGENT_ID` are correct
5. **Check Retell Dashboard**: Log into your Retell dashboard and verify:
   - Your API key is active
   - Your agent ID exists and is correct
   - The agent is published/active

**Common Endpoint Formats:**
- `https://api.retellai.com/v2/create-web-call`
- `https://api.retellai.com/create-web-call`
- `https://api.retellai.com/v2/calls/create-web`

Update the endpoint in `app/api/calls/create/route.ts` if needed based on Retell's current API documentation.
