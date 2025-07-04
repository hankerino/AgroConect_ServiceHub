import React, { useState, useEffect } from "react";
import { getTechResources } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Clock, Download, User, Calendar } from "lucide-react";

export default function LearningCenter() {
    const { language } = useLanguage();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");

    useEffect(() => {
        loadResources();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedType, selectedDifficulty, resources]);

    const loadResources = async () => {
        try {
            const techResourceResults = await getTechResources();
            const data = techResourceResults.data;
            setResources(data);
        } catch (error) {
            console.error("Error loading resources:", error);
        }
    };

    const applyFilters = () => {
        let result = resources;

        if (searchTerm) {
            result = result.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(resource => resource.technology_category === selectedCategory);
        }

        if (selectedType !== "all") {
            result = result.filter(resource => resource.resource_type === selectedType);
        }

        if (selectedDifficulty !== "all") {
            result = result.filter(resource => resource.difficulty_level === selectedDifficulty);
        }

        setFilteredResources(result);
    };

    const text = {
        pt: {
            title: "Central de Aprendizagem",
            subtitle: "Recursos técnicos e educacionais para agricultura de precisão",
            searchPlaceholder: "Buscar recursos...",
            allCategories: "Todas as Categorias",
            allTypes: "Todos os Tipos",
            allDifficulties: "Todas as Dificuldades",
            categories: {
                drones: "Drones",
                sensors: "Sensores",
                gps: "GPS",
                precision_agriculture: "Agricultura de Precisão",
                biodegradable_tech: "Tecnologia Biodegradável",
                remote_sensing: "Sensoriamento Remoto",
                data_analysis: "Análise de Dados",
                regulations: "Regulamentações"
            },
            types: {
                guide: "Guia",
                tutorial: "Tutorial",
                research_paper: "Artigo de Pesquisa",
                case_study: "Estudo de Caso",
                regulation: "Regulamentação",
                best_practice: "Melhores Práticas",
                equipment_manual: "Manual de Equipamento",
                course_module: "Módulo de Curso"
            },
            difficulties: {
                beginner: "Iniciante",
                intermediate: "Intermediário",
                advanced: "Avançado",
                expert: "Especialista"
            },
            readMore: "Ler Mais",
            download: "Baixar",
            estimatedTime: "Tempo estimado",
            minutes: "minutos",
            author: "Autor",
            noResults: "Nenhum recurso encontrado. Tente ajustar os filtros."
        },
        en: {
            title: "Learning Center",
            subtitle: "Technical and educational resources for precision agriculture",
            searchPlaceholder: "Search resources...",
            allCategories: "All Categories",
            allTypes: "All Types",
            allDifficulties: "All Difficulties",
            categories: {
                drones: "Drones",
                sensors: "Sensors",
                gps: "GPS",
                precision_agriculture: "Precision Agriculture",
                biodegradable_tech: "Biodegradable Technology",
                remote_sensing: "Remote Sensing",
                data_analysis: "Data Analysis",
                regulations: "Regulations"
            },
            types: {
                guide: "Guide",
                tutorial: "Tutorial",
                research_paper: "Research Paper",
                case_study: "Case Study",
                regulation: "Regulation",
                best_practice: "Best Practices",
                equipment_manual: "Equipment Manual",
                course_module: "Course Module"
            },
            difficulties: {
                beginner: "Beginner",
                intermediate: "Intermediate",
                advanced: "Advanced",
                expert: "Expert"
            },
            readMore: "Read More",
            download: "Download",
            estimatedTime: "Estimated time",
            minutes: "minutes",
            author: "Author",
            noResults: "No resources found. Try adjusting the filters."
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-orange-100 text-orange-800';
            case 'expert':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            drones: 'bg-blue-100 text-blue-800',
            sensors: 'bg-purple-100 text-purple-800',
            gps: 'bg-indigo-100 text-indigo-800',
            precision_agriculture: 'bg-green-100 text-green-800',
            biodegradable_tech: 'bg-emerald-100 text-emerald-800',
            remote_sensing: 'bg-cyan-100 text-cyan-800',
            data_analysis: 'bg-pink-100 text-pink-800',
            regulations: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
                <p className="text-lg text-gray-600 mt-2">{text[language].subtitle}</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder={text[language].searchPlaceholder}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder={text[language].allCategories} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{text[language].allCategories}</SelectItem>
                                {Object.entries(text[language].categories).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder={text[language].allTypes} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{text[language].allTypes}</SelectItem>
                                {Object.entries(text[language].types).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                            <SelectTrigger>
                                <SelectValue placeholder={text[language].allDifficulties} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{text[language].allDifficulties}</SelectItem>
                                {Object.entries(text[language].difficulties).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <Card key={resource.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge className={getCategoryColor(resource.technology_category)}>
                                        {text[language].categories[resource.technology_category] || resource.technology_category}
                                    </Badge>
                                    <Badge className={getDifficultyColor(resource.difficulty_level)}>
                                        {text[language].difficulties[resource.difficulty_level] || resource.difficulty_level}
                                    </Badge>
                                    <Badge variant="outline">
                                        {text[language].types[resource.resource_type] || resource.resource_type}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {resource.content.substring(0, 200)}...
                                    </p>
                                    
                                    {Array.isArray(resource.tags) ? (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {resource.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No tags</span>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{resource.estimated_read_time} {text[language].minutes}</span>
                                        </div>
                                        {resource.author && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span className="truncate">{resource.author}</span>
                                            </div>
                                        )}
                                    </div>

                                    {resource.publication_date && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(resource.publication_date).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            {text[language].readMore}
                                        </Button>
                                        {resource.downloadable && (
                                            <Button variant="outline" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">{text[language].noResults}</p>
                    </div>
                )}
            </div>
        </div>
    );
}