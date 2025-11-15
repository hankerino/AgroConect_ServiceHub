import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getForumPosts } from "@/api/entities";

export default function PostForm({ groups, onPostCreated, language = 'pt' }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        group_name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const text = {
        pt: {
            title: "Criar Nova Discussão",
            postTitle: "Título",
            postTitlePlaceholder: "Qual a sua dúvida ou ideia?",
            content: "Conteúdo",
            contentPlaceholder: "Descreva com mais detalhes...",
            category: "Categoria",
            group: "Grupo",
            selectGroup: "Selecione um grupo",
            noGroup: "Nenhum (Geral)",
            createPost: "Publicar",
            creating: "Publicando...",
            categories: {
                crop_advice: "Conselhos de Cultivo",
                disease_help: "Ajuda com Doenças",
                market_info: "Info do Mercado",
                equipment: "Equipamentos",
                general: "Geral",
                success_story: "História de Sucesso",
                weather_alert: "Alerta Climático"
            }
        },
        en: {
            title: "Create New Discussion",
            postTitle: "Title",
            postTitlePlaceholder: "What's your question or idea?",
            content: "Content",
            contentPlaceholder: "Describe in more detail...",
            category: "Category",
            group: "Group",
            selectGroup: "Select a group",
            noGroup: "None (General)",
            createPost: "Publish",
            creating: "Publishing...",
            categories: {
                crop_advice: "Crop Advice",
                disease_help: "Disease Help",
                market_info: "Market Info",
                equipment: "Equipment",
                general: "General",
                success_story: "Success Story",
                weather_alert: "Weather Alert"
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // This is a placeholder. In a real app, you'd get the current user's name and location.
            const author_name = "Usuário Anônimo";
            const location = "Brasil";
            
            await getForumPosts().data.create({ ...formData, author_name, location });
            onPostCreated();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">{text[language].postTitle}</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={text[language].postTitlePlaceholder}
                    required
                />
            </div>
            <div>
                <Label htmlFor="content">{text[language].content}</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={text[language].contentPlaceholder}
                    required
                    rows={5}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="category">{text[language].category}</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger id="category">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(text[language].categories).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="group">{text[language].group}</Label>
                    <Select value={formData.group_name} onValueChange={(value) => handleInputChange('group_name', value)}>
                        <SelectTrigger id="group">
                            <SelectValue placeholder={text[language].selectGroup} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={null}>{text[language].noGroup}</SelectItem>
                            {groups.map(group => (
                                <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? text[language].creating : text[language].createPost}
                </Button>
            </div>
        </form>
    );
}
