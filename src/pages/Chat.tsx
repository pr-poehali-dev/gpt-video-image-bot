import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

type MessageType = 'text' | 'image' | 'video';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: 'Привет! Я AI-ассистент. Могу генерировать текст, изображения и видео. Чем могу помочь?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<MessageType>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: activeMode,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/ddba8256-f2be-4cf4-abbe-8b39571bc138', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          mode: activeMode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при обращении к API');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: data.type,
        content: data.content,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: `Ошибка: ${error instanceof Error ? error.message : 'Не удалось получить ответ'}. Проверьте, что вы добавили OPENAI_API_KEY в секреты проекта.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
        <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'gradient-primary' : 'bg-muted'
          }`}>
            {isUser ? (
              <Icon name="User" size={20} className="text-white" />
            ) : (
              <span className="text-lg">✨</span>
            )}
          </div>
          
          <Card className={`p-4 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
            {message.type === 'image' && (
              <div>
                <p className="text-sm mb-2">{message.sender === 'user' ? message.content : 'Вот ваше изображение:'}</p>
                {message.sender === 'ai' && (
                  <img src={message.content} alt="Generated" className="rounded-lg max-w-full" />
                )}
              </div>
            )}
            {message.type === 'video' && (
              <div>
                <p className="text-sm mb-2">{message.sender === 'user' ? message.content : 'Вот ваше видео:'}</p>
                {message.sender === 'ai' && (
                  <video src={message.content} controls className="rounded-lg max-w-full" />
                )}
              </div>
            )}
            <span className="text-xs opacity-60 mt-2 block">
              {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      <div className="container mx-auto max-w-5xl h-screen flex flex-col">
        <header className="py-4 px-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-xl font-bold gradient-text">AI Chatbot</h1>
            <div className="w-20" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <Card className="p-4 bg-card">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant={activeMode === 'text' ? 'default' : 'outline'}
              onClick={() => setActiveMode('text')}
              className={activeMode === 'text' ? 'gradient-primary' : ''}
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Текст
            </Button>
            <Button
              size="sm"
              variant={activeMode === 'image' ? 'default' : 'outline'}
              onClick={() => setActiveMode('image')}
              className={activeMode === 'image' ? 'gradient-primary' : ''}
            >
              <Icon name="Image" size={16} className="mr-2" />
              Картинка
            </Button>
            <Button
              size="sm"
              variant={activeMode === 'video' ? 'default' : 'outline'}
              onClick={() => setActiveMode('video')}
              className={activeMode === 'video' ? 'gradient-primary' : ''}
            >
              <Icon name="Video" size={16} className="mr-2" />
              Видео
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                activeMode === 'text' 
                  ? 'Напишите сообщение...' 
                  : activeMode === 'image'
                  ? 'Опишите изображение...'
                  : 'Опишите видео...'
              }
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!inputValue.trim() || isLoading}
              className="gradient-primary"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;