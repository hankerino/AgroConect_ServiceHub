import React, { useState, useEffect } from "react";
import { getForumPosts } from "@/api/entities";
import { getCommunityProfiles } from "@/api/entities";
import { getVideoPosts } from "@/api/entities";
import { getCommunityGroups } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Users, Video, MessageSquare, QrCode, UserPlus, Camera, Play, Plus, Hash, User, FileText, Sprout } from "lucide-react";

import SocialSignup from "../components/community/SocialSignup";
import QRCodeScanner from "../components/community/QRCodeScanner";
import VideoFeed from "../components/community/VideoFeed";
import CreateGroupForm from "../components/community/CreateGroupForm";
import PostForm from "../components/community/PostForm";

export default function Community() {
    const { language } = useLanguage();
    
    const [posts, setPosts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [showSignup, setShowSignup] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedGroup, posts]);

    const loadData = async () => {
        try {

            const [postResults, videoResults, profileResults, groupResults] = await Promise.all([
                getForumPosts(),
                getVideoPosts(),
                getCommunityProfiles(),
                getCommunityGroups()
            ]);

            const postData = postResults.data;
            const videoData = videoResults.data.slice(0, 20)
            const profileData = profileResults.data.slice(0, 20)
            const groupData = groupResults.data

            setPosts(postData);
            setVideos(videoData);
            setProfiles(profileData);
            setGroups(groupData);
        } catch (error) {
            console.error("Error loading community data:", error);
        }
    };

    const applyFilters = () => {
        let result = posts;

        if (selectedGroup) {
            result = result.filter(post => post.group_name === selectedGroup);
        }

        if (searchTerm) {
            result = result.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                post.author_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(post => post.category === selectedCategory);
        }

        setFilteredPosts(result);
    };
    
    const handleGroupFilter = (groupName) => {
        setSelectedGroup(groupName);
    };

    const handleSignupComplete = (profile) => {
        setUserProfile(profile);
        setShowSignup(false);
        setProfiles(prev => [profile, ...prev]);
    };

    const handleQRScanSuccess = (scannedProfile) => {
        setShowQRScanner(false);
        console.log("QR Scan success:", scannedProfile);
    };

    const text = {
        pt: {
            title: "Comunidade ServiceHub",
            subtitle: "Conecte-se com outros usuários de serviços",
            searchPlaceholder: "Buscar discussões...",
            allCategories: "Todas as Categorias",
            discussions: "Discussões",
            videos: "Vídeos",
            farmers: "Usuários",
            joinCommunity: "Entrar na Comunidade",
            scanQR: "Escanear QR",
            videoFeed: "Feed de Vídeos",
            categories: {
                crop_advice: "Conselhos de Cultivo",
                disease_help: "Ajuda com Doenças",
                market_info: "Info do Mercado",
                equipment: "Equipamentos",
                general: "Geral",
                success_story: "História de Sucesso",
                weather_alert: "Alerta Climático"
            },
            noResults: "Nenhuma discussão encontrada.",
            noVideos: "Nenhum vídeo disponível.",
            noFarmers: "Nenhum usuário encontrado.",
            replies: "respostas",
            likes: "curtidas",
            viewProfile: "Ver Perfil",
            connect: "Conectar",
            groups: "Grupos",
            createGroup: "Criar Grupo",
            createPost: "Criar Discussão",
            allGroups: "Todos os Grupos",
            noGroups: "Nenhum grupo encontrado. Seja o primeiro a criar um!",
            members: "membros",
            posts: "posts",
        },
        en: {
            title: "ServiceHub Community",
            subtitle: "Connect with other service users",
            searchPlaceholder: "Search discussions...",
            allCategories: "All Categories",
            discussions: "Discussions",
            videos: "Videos",
            farmers: "Users",
            joinCommunity: "Join Community",
            scanQR: "Scan QR",
            videoFeed: "Video Feed",
            categories: {
                crop_advice: "Crop Advice",
                disease_help: "Disease Help",
                market_info: "Market Info",
                equipment: "Equipment",
                general: "General",
                success_story: "Success Story",
                weather_alert: "Weather Alert"
            },
            noResults: "No discussions found.",
            noVideos: "No videos available.",
            noFarmers: "No users found.",
            replies: "replies",
            likes: "likes",
            viewProfile: "View Profile",
            connect: "Connect",
            groups: "Groups",
            createGroup: "Create Group",
            createPost: "Create Discussion",
            allGroups: "All Groups",
            noGroups: "No groups found. Be the first to create one!",
            members: "members",
            posts: "posts",
        }
    };
    
    const topicIcons = {
        soja: <Sprout className="w-4 h-4 text-green-600" />,
        milho: <Sprout className="w-4 h-4 text-yellow-500" />,
        cafe: <Sprout className="w-4 h-4 text-amber-800" />,
        pecuaria: <Users className="w-4 h-4 text-gray-600" />,
        organicos: <Sprout className="w-4 h-4 text-lime-600" />,
        tecnologia: <Camera className="w-4 h-4 text-blue-600" />,
        geral: <Hash className="w-4 h-4 text-gray-500" />
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
                <p className="text-lg text-gray-600 mt-2">{text[language].subtitle}</p>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder={text[language].searchPlaceholder}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder={text[language].allCategories} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{text[language].allCategories}</SelectItem>
                                    {Object.entries(text[language].categories).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedGroup && (
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => handleGroupFilter(null)}
                                >
                                    {selectedGroup} &times;
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex gap-2">
                            <Dialog open={showSignup} onOpenChange={setShowSignup}>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {text[language].joinCommunity}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <SocialSignup 
                                        onSignupComplete={handleSignupComplete}
                                        language={language}
                                    />
                                </DialogContent>
                            </Dialog>
                            
                            <Button variant="outline" onClick={() => setShowQRScanner(true)}>
                                <QrCode className="w-4 h-4 mr-2" />
                                {text[language].scanQR}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Community Tabs */}
            <Tabs defaultValue="discussions" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="discussions" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {text[language].discussions}
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {text[language].groups}
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        {text[language].videos}
                    </TabsTrigger>
                    <TabsTrigger value="farmers" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {text[language].farmers}
                    </TabsTrigger>
                </TabsList>

                {/* Discussions Tab */}
                <TabsContent value="discussions">
                    <div className="flex justify-end mb-4">
                        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {text[language].createPost}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{text[language].createPost}</DialogTitle>
                                </DialogHeader>
                                <PostForm
                                    groups={groups}
                                    onPostCreated={() => {
                                        setShowCreatePost(false);
                                        loadData();
                                    }}
                                    language={language}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <Card key={post.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge variant="secondary">
                                                        {text[language].categories[post.category] || post.category}
                                                    </Badge>
                                                    {post.group_name && (
                                                        <Badge
                                                            variant="outline"
                                                            className="cursor-pointer hover:bg-gray-100"
                                                            onClick={() => handleGroupFilter(post.group_name)}
                                                        >
                                                            <Hash className="w-3 h-3 mr-1" />
                                                            {post.group_name}
                                                        </Badge>
                                                    )}
                                                    {Array.isArray(post.tags) ? 
                                                        post.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        )) : 
                                                        <span className="text-xs text-gray-500">No specialties</span>
                                                    }
                                                </div>
                                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium">{post.author_name}</span>
                                                <span>•</span>
                                                <span>{post.location}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span>{post.likes} {text[language].likes}</span>
                                                <span>{post.replies_count} {text[language].replies}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">{text[language].noResults}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Groups Tab */}
                <TabsContent value="groups">
                    <div className="flex justify-end mb-4">
                        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {text[language].createGroup}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{text[language].createGroup}</DialogTitle>
                                </DialogHeader>
                                <CreateGroupForm
                                    onGroupCreated={() => {
                                        setShowCreateGroup(false);
                                        loadData();
                                    }}
                                    language={language}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGroupFilter(group.name)}>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            {topicIcons[group.topic] || <Hash className="w-5 h-5" />}
                                            <CardTitle className="text-lg">{group.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {group.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" /> {group.members_count || 0} {text[language].members}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" /> {group.posts_count || 0} {text[language].posts}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Hash className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">{text[language].noGroups}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos">
                    {videos.length > 0 ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-red-600 hover:bg-red-700">
                                            <Play className="w-4 h-4 mr-2" />
                                            {text[language].videoFeed}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm max-h-screen p-0 overflow-hidden">
                                        <VideoFeed language={language} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video) => (
                                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            <img
                                                src={video.thumbnail_url || '/api/placeholder/300/200'}
                                                alt={video.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Play className="w-12 h-12 text-white" />
                                            </div>
                                            <Badge className="absolute top-2 left-2">
                                                {text[language].categories[video.category] || video.category}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {video.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>@{video.author_name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span>{video.views_count} views</span>
                                                    <span>•</span>
                                                    <span>{video.likes_count} likes</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">{text[language].noVideos}</p>
                        </div>
                    )}
                </TabsContent>

                {/* Farmers Tab */}
                <TabsContent value="farmers">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.length > 0 ? (
                            profiles.map((profile) => (
                                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-white font-bold text-xl">
                                                {profile.display_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{profile.display_name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{profile.location}</p>
                                        {profile.bio && (
                                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{profile.bio}</p>
                                        )}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {Array.isArray(profile.specialties) ? 
                                                profile.specialties.slice(0, 3).map((specialty, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                )) : 
                                                <span className="text-xs text-gray-500">No specialties</span>
                                            }
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                {text[language].viewProfile}
                                            </Button>
                                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                                {text[language].connect}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">{text[language].noFarmers}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* QR Code Scanner */}
            <QRCodeScanner
                isOpen={showQRScanner}
                onClose={() => setShowQRScanner(false)}
                onScanSuccess={handleQRScanSuccess}
            />
        </div>
    );
}