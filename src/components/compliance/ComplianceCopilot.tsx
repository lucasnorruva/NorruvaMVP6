
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { queryComplianceCopilot } from '@/ai/flows/compliance-copilot-flow';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ComplianceCopilot() {
  const searchParams = useSearchParams(); // Get search params
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Check for contextQuery parameter on mount
    const contextQuery = searchParams.get('contextQuery');
    if (contextQuery) {
      setInputValue(decodeURIComponent(contextQuery));
      // Optionally, you could auto-send this message or add a "Send Pre-filled Query?" button
      toast({
        title: "Context Query Loaded",
        description: "Your question from the product page has been pre-filled. Press send to ask the Co-Pilot.",
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryComplianceCopilot({ query: userMessage.text });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error querying compliance co-pilot:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI Co-Pilot. Please try again.',
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request right now. Please try again later.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Bot className="mr-2 h-6 w-6 text-primary" />
          AI Compliance Co-Pilot
        </CardTitle>
        <CardDescription>
          Ask questions about EU Digital Product Passport regulations and related compliance topics.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[60vh]">
        <ScrollArea className="flex-grow p-4 border rounded-md mb-4 bg-muted/50" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground border'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-lg px-4 py-2 text-sm bg-background text-foreground border">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-2" />
                <p>Ask me anything about EU DPP regulations!</p>
                <p className="text-xs mt-1">E.g., "What is ESPR?" or "Tell me about battery passports."</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI Co-Pilot is for informational purposes and does not constitute legal advice. Responses are based on general knowledge.
        </p>
      </CardContent>
    </Card>
  );
}
