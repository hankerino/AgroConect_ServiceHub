import React, { useState, useEffect } from "react";
import { getUsers } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, MapPin, Sprout, Phone, Mail, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Profile() {
  const { user, language, switchLanguage, reloadUser, loading } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    farm_size: '',
    crops: [],
    location: '',
    farming_experience: '',
    phone: '',
    specialty: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        farm_size: user.farm_size || '',
        crops: user.crops || [],
        location: user.location || '',
        farming_experience: user.farming_experience || '',
        phone: user.phone || '',
        specialty: user.specialty || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await User.updateMyUserData(formData);
      await reloadUser(); // This will refresh the user data in the context
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleLanguageChange = (newLang) => {
    switchLanguage(newLang);
  };
  
  const handleCropAdd = (crop) => {
    if (crop && !formData.crops.includes(crop)) {
      setFormData({
        ...formData,
        crops: [...formData.crops, crop]
      });
    }
  };

  const handleCropRemove = (cropToRemove) => {
    setFormData({
      ...formData,
      crops: formData.crops.filter(crop => crop !== cropToRemove)
    });
  };

  const text = {
    pt: {
      title: "Meu Perfil",
      personalInfo: "Informações Pessoais",
      farmInfo: "Informações da Propriedade",
      edit: "Editar",
      save: "Salvar",
      cancel: "Cancelar",
      farmSize: "Tamanho da Propriedade (hectares)",
      crops: "Cultivos",
      location: "Localização",
      experience: "Experiência",
      language: "Idioma Preferido",
      phone: "Telefone",
      specialty: "Especialidade",
      addCrop: "Adicionar Cultivo",
      experiences: {
        beginner: "Iniciante",
        intermediate: "Intermediário", 
        advanced: "Avançado",
        expert: "Especialista"
      }
    },
    en: {
      title: "My Profile",
      personalInfo: "Personal Information",
      farmInfo: "Farm Information",
      edit: "Edit",
      save: "Save", 
      cancel: "Cancel",
      farmSize: "Farm Size (hectares)",
      crops: "Crops",
      location: "Location",
      experience: "Experience",
      language: "Preferred Language",
      phone: "Phone",
      specialty: "Specialty",
      addCrop: "Add Crop",
      experiences: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced", 
        expert: "Expert"
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {text[language].title}
        </h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? text[language].cancel : text[language].edit}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-xl">{user.full_name}</CardTitle>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{user.location || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sprout className="w-4 h-4" />
              <span>{user.specialty || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{user.phone || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>{language === 'pt' ? 'Português' : 'English'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {text[language].personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{text[language].phone}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{user.phone || 'Não informado'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="language">{text[language].language}</Label>
                  {isEditing ? (
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português (BR)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-700 py-2">
                      {language === 'pt' ? 'Português (BR)' : 'English'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                {text[language].farmInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farm_size">{text[language].farmSize}</Label>
                  {isEditing ? (
                    <Input
                      id="farm_size"
                      type="number"
                      value={formData.farm_size}
                      onChange={(e) => setFormData({ ...formData, farm_size: parseFloat(e.target.value) })}
                      placeholder="100"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">
                      {user.farm_size ? `${user.farm_size} hectares` : 'Não informado'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="experience">{text[language].experience}</Label>
                  {isEditing ? (
                    <Select
                      value={formData.farming_experience}
                      onValueChange={(value) => setFormData({ ...formData, farming_experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{text[language].experiences.beginner}</SelectItem>
                        <SelectItem value="intermediate">{text[language].experiences.intermediate}</SelectItem>
                        <SelectItem value="advanced">{text[language].experiences.advanced}</SelectItem>
                        <SelectItem value="expert">{text[language].experiences.expert}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-700 py-2">
                      {user.farming_experience ? text[language].experiences[user.farming_experience] : 'Não informado'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="location">{text[language].location}</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="São Paulo, SP"
                  />
                ) : (
                  <p className="text-gray-700 py-2">{user.location || 'Não informado'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="specialty">{text[language].specialty}</Label>
                {isEditing ? (
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Cultivo de café, criação de gado..."
                  />
                ) : (
                  <p className="text-gray-700 py-2">{user.specialty || 'Não informado'}</p>
                )}
              </div>

              <div>
                <Label>{text[language].crops}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(isEditing ? formData.crops : user.crops || []).map((crop, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {crop}
                      {isEditing && (
                        <button
                          onClick={() => handleCropRemove(crop)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-2">
                    <Input
                      placeholder={text[language].addCrop}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCropAdd(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                {text[language].save}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
