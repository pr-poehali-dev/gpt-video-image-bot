import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'MessageSquare',
      title: 'Умные ответы',
      description: 'GPT-технология для генерации текстов, кода и решения задач',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Image',
      title: 'Генерация картинок',
      description: 'Создавайте уникальные изображения из текстового описания',
      gradient: 'from-pink-500 to-orange-500'
    },
    {
      icon: 'Video',
      title: 'Создание видео',
      description: 'Генерируйте видеоролики по вашему запросу за секунды',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
            <span className="text-6xl">✨</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            AI Chatbot
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Мощный ИИ-ассистент для генерации текста, изображений и видео в одном месте
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/chat')}
            className="gradient-primary text-white px-8 py-6 text-lg rounded-2xl hover:scale-105 transition-transform duration-300 shadow-2xl"
          >
            <Icon name="Sparkles" size={24} className="mr-2" />
            Начать общение
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 hover:scale-105 transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 hover:border-primary animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <Icon name={feature.icon as any} size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-12 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Как это работает?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Выберите режим работы (текст, картинка или видео), опишите что вам нужно, 
            и наш ИИ создаст это за считанные секунды
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-lg">Выберите режим</h4>
              <p className="text-sm text-muted-foreground">Текст, изображение или видео</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-lg">Опишите задачу</h4>
              <p className="text-sm text-muted-foreground">Подробно объясните что нужно</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-lg">Получите результат</h4>
              <p className="text-sm text-muted-foreground">ИИ создаст контент за секунды</p>
            </div>
          </div>
        </Card>
      </div>

      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>Создано с помощью современных AI-технологий</p>
      </footer>
    </div>
  );
};

export default Index;
