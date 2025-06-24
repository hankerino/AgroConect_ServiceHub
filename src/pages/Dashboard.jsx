
import React, { useState, useEffect } from "react";
import { Consultation } from "@/api/entities";
import { ForumPost } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  CloudRain, 
  Thermometer, 
  Users,
  Sprout,
  Clock,
  ArrowRight,
  Store,
  BookOpen,
  Briefcase
} from "lucide-react";

import VoiceAssistant from "../components/VoiceAssistant";
import ServiceCard from "../components/ServiceCard";

export default function Dashboard() {
  const { user, language } = useLanguage();
  const [consultations, setConsultations] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [weather] = useState({
    temperature: 28,
    condition: 'Ensolarado',
    humidity: 65,
    rainfall: 0
  });

  useEffect(() => {
    loadConsultations();
    loadRecentPosts();
  }, []);

  const loadConsultations = async () => {
    try {
      const consultationData = await Consultation.list('-scheduled_date', 3);
      setConsultations(consultationData);
    } catch (error) {
      console.error("Error loading consultations:", error);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const posts = await ForumPost.list('-created_date', 3);
      setRecentPosts(posts);
    } catch (error) {
      console.error("Error loading forum posts:", error);
    }
  };

  const text = {
    pt: {
      welcome: "Bem-vindo ao AgroConect",
      greeting: user ? `Olá, ${user.full_name || 'Usuário'}!` : "Olá, Usuário!",
      subtitle: "Sua plataforma de serviços conectados",
      description: "Estou aqui para conectá-lo com os serviços e suporte adequados. Fale comigo ou navegue pelos nossos serviços abaixo.",
      services: "Serviços Disponíveis",
      popularServices: "Serviços Populares",
      weather: "Clima Atual",
      temperature: "Temperatura",
      humidity: "Umidade", 
      rainfall: "Precipitação",
      upcomingConsultations: "Próximas Consultas",
      recentActivity: "Atividade Recente",
      noConsultations: "Nenhuma consulta agendada",
      noPosts: "Nenhuma atividade recente",
      viewAll: "Ver Todos",
      scheduleConsultation: "Agendar Consulta",
      serviceDetails: {
        prices: {
          title: "Preços de Mercado",
          description: "Consulte preços atuais dos produtos em tempo real"
        },
        consultation: {
          title: "Consulta com Especialista", 
          description: "Agende uma consulta com nossos especialistas"
        },
        community: {
          title: "Comunidade",
          description: "Conecte-se com outros usuários e compartilhe experiências"
        },
        weather: {
          title: "Previsão do Tempo",
          description: "Informações meteorológicas para planejamento"
        },
        marketplace: {
          title: "Mercado de Serviços",
          description: "Compre e alugue produtos e serviços"
        },
        learningCenter: {
          title: "Central de Aprendizagem",
          description: "Acesse guias, cursos e artigos técnicos"
        }
      },
      quickServices: {
        pestControl: "Controle de Pragas",
        training: "Treinamento",
        equipment: "Equipamentos",
        supplies: "Suprimentos"
      }
    },
    en: {
      welcome: "Welcome to AgroConect",
      greeting: user ? `Hello, ${user.full_name || 'User'}!` : "Hello, User!",
      subtitle: "Your connected services platform",
      description: "I'm here to connect you with the right services and support. Speak to me or browse our services below.",
      services: "Available Services",
      popularServices: "Popular Services",
      weather: "Current Weather",
      temperature: "Temperature",
      humidity: "Humidity",
      rainfall: "Rainfall", 
      upcomingConsultations: "Upcoming Consultations",
      recentActivity: "Recent Activity",
      noConsultations: "No scheduled consultations",
      noPosts: "No recent activity",
      viewAll: "View All",
      scheduleConsultation: "Schedule Consultation",
      serviceDetails: {
        prices: {
          title: "Market Prices",
          description: "Check current product prices in real-time"
        },
        consultation: {
          title: "Expert Consultation",
          description: "Schedule a consultation with our specialists"
        },
        community: {
          title: "Community", 
          description: "Connect with other users and share experiences"
        },
        weather: {
          title: "Weather Forecast",
          description: "Meteorological information for planning"
        },
        marketplace: {
          title: "Service Marketplace",
          description: "Buy and rent products and services"
        },
        learningCenter: {
          title: "Learning Center",
          description: "Access guides, courses, and technical articles"
        }
      },
      quickServices: {
        pestControl: "Pest Control",
        training: "Training",
        equipment: "Equipment Rental",
        supplies: "Supply Marketplace"
      }
    }
  };

  const services = [
    {
      ...text[language].serviceDetails.prices,
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600",
      onClick: () => window.location.href = createPageUrl("MarketPrices")
    },
    {
      ...text[language].serviceDetails.consultation,
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600", 
      onClick: () => window.location.href = createPageUrl("Consultations")
    },
    {
      ...text[language].serviceDetails.community,
      icon: Users,
      gradient: "from-orange-500 to-orange-600",
      onClick: () => window.location.href = createPageUrl("Community")
    },
    {
      ...text[language].serviceDetails.weather,
      icon: CloudRain,
      gradient: "from-cyan-500 to-cyan-600",
      onClick: () => window.location.href = createPageUrl("Weather")
    },
    {
      ...text[language].serviceDetails.marketplace,
      icon: Store,
      gradient: "from-green-500 to-green-600",
      onClick: () => window.location.href = createPageUrl("Marketplace")
    },
    {
      ...text[language].serviceDetails.learningCenter,
      icon: BookOpen,
      gradient: "from-rose-500 to-rose-600",
      onClick: () => window.location.href = createPageUrl("LearningCenter")
    }
  ];

  const quickServices = [
    {
      title: text[language].serviceDetails.weather.title,
      icon: CloudRain,
      gradient: "from-blue-500 to-blue-600",
      onClick: () => window.location.href = createPageUrl("Weather")
    },
    {
      title: text[language].quickServices.pestControl,
      icon: Sprout,
      gradient: "from-red-500 to-red-600", 
      onClick: () => alert(language === 'pt' ? 'Em breve!' : 'Coming soon!')
    },
    {
      title: text[language].serviceDetails.prices.title,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      onClick: () => window.location.href = createPageUrl("MarketPrices")
    },
    {
      title: text[language].quickServices.training,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      onClick: () => window.location.href = createPageUrl("LearningCenter")
    }
  ];

  return (
    <div className="space-y-8">
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Hero Section */}
      <div className="text-center space-y-4 fade-in">
        <h1 className="text-4xl font-bold text-gray-800">
          {text[language].greeting}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {text[language].description}
        </p>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant language={language} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fade-in">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">{text[language].temperature}</p>
                <p className="text-2xl font-bold text-green-700">{weather.temperature}°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">{text[language].humidity}</p>
                <p className="text-2xl font-bold text-blue-700">{weather.humidity}%</p>
              </div>
              <CloudRain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">{text[language].upcomingConsultations}</p>
                <p className="text-2xl font-bold text-purple-700">{consultations.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">{text[language].recentActivity}</p>
                <p className="text-2xl font-bold text-orange-700">{recentPosts.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Services Grid */}
      <div className="fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {text[language].services}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              gradient={service.gradient}
              onClick={service.onClick}
              size="large"
            />
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="fade-in">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {text[language].popularServices}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickServices.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              icon={service.icon}
              gradient={service.gradient}
              onClick={service.onClick}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
        {/* Upcoming Consultations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{text[language].upcomingConsultations}</CardTitle>
            <Link to={createPageUrl("Consultations")}>
              <Button variant="ghost" size="sm">
                {text[language].viewAll}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {consultations.length > 0 ? (
              <div className="space-y-3">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{consultation.expert_name}</p>
                      <p className="text-sm text-gray-600">{consultation.consultation_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(consultation.scheduled_date).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">
                        {consultation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {text[language].noConsultations}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Community Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{text[language].recentActivity}</CardTitle>
            <Link to={createPageUrl("Community")}>
              <Button variant="ghost" size="sm">
                {text[language].viewAll}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{post.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600">{post.author_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {text[language].noPosts}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
