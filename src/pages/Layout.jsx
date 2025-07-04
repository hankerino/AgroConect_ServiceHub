import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage, LanguageProvider } from "@/components/providers/LanguageProvider";
import { signInWithGoogle, signOut } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Sprout,
  TrendingUp,
  CloudRain,
  Calendar,
  Users,
  Store,
  BookOpen,
  User as UserIcon,
  Globe,
  LogOut,
  LogIn
} from "lucide-react";

const navigationItems = [
  {
    title: "Assistente",
    titleEn: "Assistant",
    url: createPageUrl("Dashboard"),
    icon: Sprout,
  },
  {
    title: "Preços",
    titleEn: "Prices",
    url: createPageUrl("MarketPrices"),
    icon: TrendingUp,
  },
  {
    title: "Clima",
    titleEn: "Weather",
    url: createPageUrl("Weather"),
    icon: CloudRain,
  },
  {
    title: "Consultas",
    titleEn: "Consultations",
    url: createPageUrl("Consultations"),
    icon: Calendar,
  },
  {
    title: "Comunidade",
    titleEn: "Community",
    url: createPageUrl("Community"),
    icon: Users,
  },
  {
    title: "Mercado",
    titleEn: "Marketplace",
    url: createPageUrl("Marketplace"),
    icon: Store,
  },
  {
    title: "Aprendizagem",
    titleEn: "Learning",
    url: createPageUrl("LearningCenter"),
    icon: BookOpen,
  }
];

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { user, language, switchLanguage, loading } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const text = {
    pt: {
      title: "AgroConect",
      subtitle: "ServiceHub",
      profile: "Perfil",
      login: "Entrar",
      logout: "Sair"
    },
    en: {
      title: "AgroConect",
      subtitle: "ServiceHub",
      profile: "Profile",
      login: "Login",
      logout: "Logout"
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
        }

        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }

        .mobile-menu {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>

      {/* Header */}
      <header className="gradient-bg text-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{text[language].title}</h1>
                <p className="text-green-100 text-sm">{text[language].subtitle}</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchLanguage(language === 'pt' ? 'en' : 'pt')}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'pt' ? 'EN' : 'PT'}
              </Button>

              {/* Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => signInWithGoogle()}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile Menu Toggle (now using Sheet) */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-6 mobile-menu">
                  <nav className="flex flex-col w-full space-y-2 mt-8">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.url}
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                          location.pathname === item.url
                            ? 'nav-item active text-white'
                            : 'text-gray-700 hover:bg-white hover:bg-opacity-80'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{language === 'pt' ? item.title : item.titleEn}</span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col w-64 p-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.url
                  ? 'nav-item active text-white'
                  : 'text-gray-700 hover:bg-white hover:bg-opacity-80'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{language === 'pt' ? item.title : item.titleEn}</span>
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// The main Layout component now wraps the content with LanguageProvider
export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent currentPageName={currentPageName}>
        {children}
      </LayoutContent>
    </LanguageProvider>
  );
}

