import React, { useState, useEffect } from "react";
import { DataSource } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Search } from "lucide-react";

export default function DataSources() {
  const { language } = useLanguage();
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await DataSource.list();
      setSources(data);
      setFilteredSources(data);
      
      const uniqueRegions = [...new Set(data.map(item => item.state_region))];
      setRegions(uniqueRegions.sort());
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = sources;

    if (searchTerm) {
      result = result.filter(source =>
        source.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== "all") {
      result = result.filter(source => source.state_region === selectedRegion);
    }

    if (selectedCategory !== "all") {
      result = result.filter(source => source.category === selectedCategory);
    }

    setFilteredSources(result);
  }, [searchTerm, selectedRegion, selectedCategory, sources]);

  const text = {
    pt: {
      title: "Fontes de Dados Agrícolas",
      description: "Um diretório de organizações que fornecem dados e orientações valiosas.",
      searchPlaceholder: "Buscar por organização...",
      allRegions: "Todas as Regiões",
      allCategories: "Todas as Categorias",
      categories: {
        input_costs: "Custos de Insumos",
        agronomic_guidance: "Orientação Agronômica",
        both: "Ambos"
      },
      organization: "Organização",
      region: "Região/Estado",
      category: "Categoria",
      dataType: "Tipo de Dado",
      granularity: "Granularidade",
      website: "Website",
      noResults: "Nenhum resultado encontrado. Tente ajustar seus filtros."
    },
    en: {
      title: "Agricultural Data Sources",
      description: "A directory of organizations providing valuable data and guidance.",
      searchPlaceholder: "Search by organization...",
      allRegions: "All Regions",
      allCategories: "All Categories",
      categories: {
        input_costs: "Input Costs",
        agronomic_guidance: "Agronomic Guidance",
        both: "Both"
      },
      organization: "Organization",
      region: "State/Region",
      category: "Category",
      dataType: "Data Type",
      granularity: "Granularity",
      website: "Website",
      noResults: "No results found. Try adjusting your filters."
    }
  };
  
  const categoryOptions = {
    pt: [
      { value: "all", label: text.pt.allCategories },
      { value: "input_costs", label: text.pt.categories.input_costs },
      { value: "agronomic_guidance", label: text.pt.categories.agronomic_guidance },
      { value: "both", label: text.pt.categories.both }
    ],
    en: [
      { value: "all", label: text.en.allCategories },
      { value: "input_costs", label: text.en.categories.input_costs },
      { value: "agronomic_guidance", label: text.en.categories.agronomic_guidance },
      { value: "both", label: text.en.categories.both }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
        <p className="text-lg text-gray-600 mt-2">{text[language].description}</p>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={text[language].searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder={text[language].allRegions} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text[language].allRegions}</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={text[language].allCategories} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions[language].map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{text[language].organization}</TableHead>
                <TableHead>{text[language].region}</TableHead>
                <TableHead>{text[language].category}</TableHead>
                <TableHead>{text[language].dataType}</TableHead>
                <TableHead>{text[language].granularity}</TableHead>
                <TableHead>{text[language].website}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.length > 0 ? (
                filteredSources.map(source => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.organization_name}</TableCell>
                    <TableCell>{source.state_region}</TableCell>
                    <TableCell>{text[language].categories[source.category] || source.category}</TableCell>
                    <TableCell>{source.data_type}</TableCell>
                    <TableCell>{source.granularity}</TableCell>
                    <TableCell>
                      <a href={source.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 flex items-center gap-1">
                        <span>Link</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    {text[language].noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}