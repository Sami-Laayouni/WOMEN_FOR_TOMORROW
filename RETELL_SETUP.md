# Retell Agent Configuration Guide

This guide will help you configure your Retell Voice Agent for Women for Tomorrow.

## Step 1: Create Your Retell Agent

1. Log in to your Retell dashboard at https://retellai.com
2. Navigate to "Agents" and click "Create New Agent"
3. Fill in the basic information:
   - **Agent Name**: "Women for Tomorrow Voice Assistant"
   - **Language**: English (US)

## Step 2: Configure Voice Settings

1. Go to the "Voice" section
2. Select a hyper-realistic voice. Recommended options:
   - **11labs-Jenny** (Female, warm, professional)
   - **11labs-Adrian** (Male, clear, friendly)
   - **11labs-Sarah** (Female, empathetic, clear)
3. Adjust voice settings:
   - **Speed**: 1.0 (normal speed)
   - **Temperature**: 0.8 (for natural conversation)
   - **Stability**: 0.7 (for consistent voice quality)

## Step 3: Set Up the Agent Prompt

Copy the agent prompt from `lib/retell-config.ts` and paste it into the "System Prompt" or "Instructions" field in your Retell agent configuration.

The prompt includes:
- Greeting instructions
- Conversation guidelines
- Tone and style guidelines

## Step 4: Configure Webhooks

1. In your Retell agent settings, go to "Webhooks"
2. Set the webhook URL to: `https://your-domain.com/api/webhook/retell`
3. Enable the following events:
   - `call_started`
   - `call_ended`
   - `conversation_state`

## Step 5: Set Up Phone Number (Optional)

If you want to receive phone calls:

1. In Retell dashboard, go to "Phone Numbers"
2. Purchase or configure a phone number
3. Assign it to your agent
4. Update `RETELL_PHONE_NUMBER` in your `.env.local` file

## Step 6: Test Your Agent

1. Use Retell's built-in test interface to test the agent
2. Try different scenarios:
   - "Tell me about your programs"
   - "What events are coming up?"
   - "How can I get involved?"
   - "General information please"
3. Check that webhooks are being received

## Advanced Configuration

### Custom Voice Prompts

You can customize the greeting and responses by modifying the `agentPrompt` in `lib/retell-config.ts`. The agent will use this prompt to guide its conversation style.

## Troubleshooting

### Agent Not Responding
- Check that your API key is correct
- Verify the agent ID matches your configuration
- Ensure the agent is published/active

### Webhooks Not Received
- Ensure your webhook URL is publicly accessible
- Check firewall/security settings
- Verify webhook URL in Retell dashboard
- Use ngrok for local testing

### Voice Quality Issues
- Try different voice models
- Adjust voice speed and temperature
- Check your internet connection
- Review Retell's voice quality documentation

## Next Steps

1. Test thoroughly with real callers
2. Monitor webhook logs for call activity
3. Adjust prompts based on real usage
4. Set up analytics to track call volumes and patterns
5. Customize the agent prompt to better serve your needs
