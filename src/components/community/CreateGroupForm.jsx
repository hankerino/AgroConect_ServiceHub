import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCommunityGroups } from "@/api/entities";

export default function CreateGroupForm({ onGroupCreated, language = 'pt' }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        topic: 'geral'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const text = {
        pt: {
            groupName: "Nome do Grupo",
            groupNamePlaceholder: "Ex: Soja Master",
            description: "Descrição",
            descriptionPlaceholder: "Qual o objetivo deste grupo?",
            topic: "Tópico Principal",
            createGroup: "Criar Grupo",
            creating: "Criando...",
            topics: {
                soja: "Soja",
                milho: "Milho",
                cafe: "Café",
                pecuaria: "Pecuária",
                organicos: "Orgânicos",
                tecnologia: "Tecnologia",
                geral: "Geral"
            }
        },
        en: {
            groupName: "Group Name",
            groupNamePlaceholder: "Ex: Soy Masters",
            description: "Description",
            descriptionPlaceholder: "What's the purpose of this group?",
            topic: "Main Topic",
            createGroup: "Create Group",
            creating: "Creating...",
            topics: {
                soja: "Soy",
                milho: "Corn",
                cafe: "Coffee",
                pecuaria: "Livestock",
                organicos: "Organics",
                tecnologia: "Technology",
                geral: "General"
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
            // This is a placeholder. In a real app, you'd get the current user's name.
            const creator_name = "Usuário Anônimo";
            await getCommunityGroups().data.create({ ...formData, creator_name });
            onGroupCreated();
        } catch (error) {
            console.error("Error creating group:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">{text[language].groupName}</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={text[language].groupNamePlaceholder}
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">{text[language].description}</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={text[language].descriptionPlaceholder}
                    required
                />
            </div>
            <div>
                <Label htmlFor="topic">{text[language].topic}</Label>
                <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                    <SelectTrigger id="topic">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(text[language].topics).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? text[language].creating : text[language].createGroup}
                </Button>
            </div>
        </form>
    );
}