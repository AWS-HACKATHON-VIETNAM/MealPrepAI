import { useState } from 'react';
import { ChefHat, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { recipeService } from '../services/recipe.service';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  recipe?: any;
}

interface HomeScreenProps {
  onRecipeSelect: () => void;
}

// Format recipe data into readable text
const formatRecipe = (recipe: any): string => {
  const lines: string[] = [];
  
  if (recipe.name) {
    lines.push(`🍽️ ${recipe.name}\n`);
  }
  
  if (recipe.time_taken_minutes || recipe.calories) {
    lines.push(`⏱️ Time: ${recipe.time_taken_minutes || '?'} min | 🔥 Calories: ${recipe.calories || '?'}\n`);
  }
  
  if (recipe.macros) {
    lines.push(`📊 Protein: ${recipe.macros.protein || '?'}g | Carbs: ${recipe.macros.carbs || '?'}g | Fat: ${recipe.macros.fat || '?'}g\n`);
  }
  
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    lines.push('\n📋 Ingredients:');
    recipe.ingredients.forEach((ing: any) => {
      const amount = ing.amount ? `${ing.amount} ${ing.unit || ''}` : '';
      lines.push(`  • ${amount} ${ing.item || ing.name || ''}`);
    });
    lines.push('');
  }
  
  if (recipe.steps && recipe.steps.length > 0) {
    lines.push('\n👨‍🍳 Steps:');
    recipe.steps.forEach((step: string, idx: number) => {
      lines.push(`  ${idx + 1}. ${step}`);
    });
  }
  
  return lines.join('\n');
};

export function HomeScreen({ onRecipeSelect }: HomeScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Good morning! 🌅 What would you like for lunch today?",
      suggestions: ['Something quick', 'High protein', 'Vegetarian', 'Low carb'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessageId = Date.now().toString();
    const assistantMessageId = (Date.now() + 1).toString();

    // Add user message and loading message
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        type: 'user',
        content: message,
      },
      {
        id: assistantMessageId,
        type: 'assistant',
        content: "Generating your recipe... 🍳",
      },
    ]);
    setInputValue('');
    setIsLoading(true);

    try {
      const recipe = await recipeService.generateRecipe({ prompt: message });
      const formattedRecipe = formatRecipe(recipe);

      // Update assistant message with the recipe
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: formattedRecipe, recipe }
            : msg
        )
      );
    } catch (error) {
      console.error('Error generating recipe:', error);
      
      // Update with error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, I couldn't generate a recipe right now. Please try again! 😔",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-12 pb-20 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Hai Minh</h2>
            <p className="text-gray-500 text-sm">Your personal chef</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'assistant' ? (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm border border-orange-200 hover:bg-orange-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-orange-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%]">
                  <p>{message.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Type your preferences..."
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            className="bg-orange-500 hover:bg-orange-600 px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
