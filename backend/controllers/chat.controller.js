import ChatMessage from '../models/chat.model.js';
import MenuItem from '../models/menu.model.js';
import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const client = new OpenAI({
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY || 'placeholder',
});

const SYSTEM_PROMPT = `You are HomeCook AI, a friendly and helpful assistant for a homemade food delivery platform called "HomeCook".

Your personality:
- Warm, friendly, and enthusiastic about food
- You use food emojis occasionally 🍕🍲🥗
- You're knowledgeable about cooking and nutrition
- You help customers with orders, menu recommendations, and general food queries

You can help with:
1. Food recommendations based on preferences, dietary needs, or mood
2. Order-related questions (explain delivery process, timing, etc.)
3. General food & cooking tips
4. Feedback collection — ask users to rate their experience
5. Platform FAQs (payment methods, delivery areas, how to become a chef, etc.)

Key platform info:
- Currency: Indian Rupees (₹/INR)
- Payment: Stripe (card payments)
- Roles: Customers order food, Chefs cook at home and list their dishes
- Delivery: Typically 30-60 minutes depending on distance
- Users can rate & review after delivery

Keep responses concise (2-4 sentences max) unless the user asks for details. Be helpful but brief.
If asked about something unrelated to food/platform, politely redirect the conversation.

IMPORTANT: When users ask about meals, orders, or ratings, use the available tools to fetch real data.`;

// Tool definitions for NVIDIA Llama
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_meals',
      description: 'Search for available meals by dietary tag, price range, or category',
      parameters: {
        type: 'object',
        properties: {
          dietary_tag: {
            type: 'string',
            description: 'Dietary preference (vegan, vegetarian, gluten_free, dairy_free, etc.)'
          },
          max_price: {
            type: 'number',
            description: 'Maximum price in INR'
          },
          min_price: {
            type: 'number',
            description: 'Minimum price in INR'
          },
          category: {
            type: 'string',
            description: 'Meal category (breakfast, lunch, dinner, dessert, snacks, etc.)'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_order_status',
      description: 'Retrieve the current status of an order by order ID',
      parameters: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'The unique order ID'
          }
        },
        required: ['order_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'save_rating',
      description: 'Save customer rating and feedback for a meal or order',
      parameters: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'The order ID to rate'
          },
          menu_item_id: {
            type: 'string',
            description: 'The menu item ID to rate'
          },
          rating: {
            type: 'number',
            description: 'Rating from 1-5 stars',
            minimum: 1,
            maximum: 5
          },
          comment: {
            type: 'string',
            description: 'Customer feedback comment'
          }
        },
        required: ['rating']
      }
    }
  }
];

// Tool execution functions
async function searchMeals(params) {
  try {
    const query = { is_available: true };

    if (params.dietary_tag) {
      query.dietary_info = new RegExp(params.dietary_tag, 'i');
    }

    if (params.category) {
      query.category = new RegExp(params.category, 'i');
    }

    if (params.min_price !== undefined || params.max_price !== undefined) {
      query.price = {};
      if (params.min_price !== undefined) query.price.$gte = params.min_price;
      if (params.max_price !== undefined) query.price.$lte = params.max_price;
    }

    const meals = await MenuItem.find(query).limit(5);

    if (meals.length === 0) {
      return { success: false, message: 'No meals found matching your criteria' };
    }

    const formatted = meals.map(m => ({
      id: m.id,
      name: m.name,
      price: m.price,
      category: m.category,
      dietary_info: m.dietary_info,
      description: m.description,
      prep_time: m.preparation_time
    }));

    return { success: true, meals: formatted };
  } catch (error) {
    console.error('Search meals error:', error);
    return { success: false, error: error.message };
  }
}

async function getOrderStatus(params, userId) {
  try {
    const order = await Order.findOne({ id: params.order_id });

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Check authorization
    if (userId !== 'anonymous' && order.customer_id !== userId) {
      return { success: false, message: 'You can only track your own orders' };
    }

    return {
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total_amount: order.total_amount,
        items_count: order.items.length,
        created_at: order.created_at,
        estimated_delivery: new Date(new Date(order.created_at).getTime() + 45 * 60000).toISOString(),
        delivery_address: order.delivery_address
      }
    };
  } catch (error) {
    console.error('Get order status error:', error);
    return { success: false, error: error.message };
  }
}

async function saveRating(params, userId) {
  try {
    if (!params.rating || params.rating < 1 || params.rating > 5) {
      return { success: false, message: 'Rating must be between 1-5' };
    }

    if (!params.order_id && !params.menu_item_id) {
      return { success: false, message: 'Either order_id or menu_item_id is required' };
    }

    const reviewData = {
      id: uuidv4(),
      rating: params.rating,
      comment: params.comment || '',
      customer_id: userId,
      created_at: new Date()
    };

    if (params.order_id) {
      reviewData.order_id = params.order_id;
      const order = await Order.findOne({ id: params.order_id });
      if (order) {
        reviewData.chef_id = order.chef_id;
        reviewData.customer_name = order.customer_id;
      }
    }

    if (params.menu_item_id) {
      reviewData.menu_item_id = params.menu_item_id;
      const menuItem = await MenuItem.findOne({ id: params.menu_item_id });
      if (menuItem) {
        reviewData.chef_id = menuItem.chef_id;
        reviewData.customer_name = userId;
      }
    }

    const review = new Review(reviewData);
    await review.save();

    return {
      success: true,
      message: `Thank you for rating! Your ${params.rating}-star review has been saved.`
    };
  } catch (error) {
    console.error('Save rating error:', error);
    return { success: false, error: error.message };
  }
}

// Process tool calls from AI
async function processToolCall(toolName, toolArgs, userId) {
  switch (toolName) {
    case 'search_meals':
      return await searchMeals(toolArgs);
    case 'get_order_status':
      return await getOrderStatus(toolArgs, userId);
    case 'save_rating':
      return await saveRating(toolArgs, userId);
    default:
      return { success: false, message: `Unknown tool: ${toolName}` };
  }
}

export const sendMessage = async (req, res) => {
  const { message, session_id } = req.body;
  const userId = req.user?.id || 'anonymous';
  const chatSessionId = session_id || uuidv4();

  try {
    // Get recent chat history for context
    const history = await ChatMessage.find({ session_id: chatSessionId })
      .sort({ created_at: -1 })
      .limit(10);

    const reversedHistory = history.reverse();

    // Build messages array for AI
    let messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...reversedHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    let aiResponse = '';
    let toolsUsed = [];

    try {
      // Call NVIDIA AI with tools
      const response = await client.chat.completions.create({
        model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct',
        messages,
        tools: TOOLS,
        temperature: 0.2,
        max_tokens: 1024,
        top_p: 0.7
      });

      const assistantMessage = response.choices[0]?.message;

      // Process tool calls if any
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolResults = [];

        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          toolsUsed.push(toolName);
          const toolResult = await processToolCall(toolName, toolArgs, userId);

          toolResults.push({
            type: 'tool',
            tool_use_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }

        // Add tool results to messages and get final response
        messages.push({ role: 'assistant', content: assistantMessage.content, tool_calls: assistantMessage.tool_calls });
        messages.push(...toolResults.map(tr => ({ role: 'user', content: tr.content })));

        // Get final response from AI
        const finalResponse = await client.chat.completions.create({
          model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct',
          messages,
          temperature: 0.2,
          max_tokens: 512,
          top_p: 0.7
        });

        aiResponse = finalResponse.choices[0]?.message?.content || 'I processed your request but couldn\'t generate a response.';
      } else {
        aiResponse = assistantMessage.content || 'Sorry, I couldn\'t process that. Please try again!';
      }
    } catch (aiErr) {
      console.error('AI API Error:', aiErr.message);
      // Fallback responses
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        aiResponse = 'Hey there! 👋 Welcome to HomeCook! I\'m your food assistant. How can I help you today? You can ask me about our menu, place orders, or get food recommendations! 🍽️';
      } else if (lowerMsg.includes('menu') || lowerMsg.includes('food') || lowerMsg.includes('recommend')) {
        aiResponse = 'Check out our Menu page for all available dishes from amazing home chefs! 🍕 I can help you find meals by diet, price, or category. What are you in the mood for?';
      } else if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
        aiResponse = 'You can track your orders from the Orders page! Each order shows real-time status from preparation to delivery. 📦 Need help with a specific order?';
      } else if (lowerMsg.includes('rate') || lowerMsg.includes('review')) {
        aiResponse = 'I\'d love to hear about your experience! You can rate meals and orders after they\'re delivered. ⭐ What would you like to rate?';
      } else {
        aiResponse = 'I\'m here to help with food orders, menu recommendations, and platform questions! 🍲 What would you like to know?';
      }
    }

    // Save messages to DB
    const userMsg = new ChatMessage({
      id: uuidv4(),
      user_id: userId,
      role: 'user',
      content: message,
      session_id: chatSessionId,
    });

    const assistantMsg = new ChatMessage({
      id: uuidv4(),
      user_id: userId,
      role: 'assistant',
      content: aiResponse,
      session_id: chatSessionId,
    });

    await Promise.all([userMsg.save(), assistantMsg.save()]);

    res.json({
      reply: aiResponse,
      session_id: chatSessionId,
      tools_used: toolsUsed
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Chat failed', error: err.message });
  }
};

export const getChatHistory = async (req, res) => {
  const { session_id } = req.params;
  try {
    const messages = await ChatMessage.find({ session_id })
      .sort({ created_at: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: err.message });
  }
};
