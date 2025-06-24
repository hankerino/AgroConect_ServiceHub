import React, { useState, useEffect, useRef } from "react";
import { VideoPost } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, MoreVertical } from "lucide-react";

export default function VideoFeed({ language = 'pt' }) {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef([]);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            const videoData = await VideoPost.list('-created_date', 20);
            setVideos(videoData);
        } catch (error) {
            console.error("Error loading videos:", error);
        }
    };

    const handleVideoClick = (index) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleLike = async (videoId) => {
        // Implement like functionality
        setVideos(prev => prev.map(video => 
            video.id === videoId 
                ? { ...video, likes_count: video.likes_count + 1 }
                : video
        ));
    };

    const handleShare = (video) => {
        if (navigator.share) {
            navigator.share({
                title: video.title,
                text: video.description,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const text = {
        pt: {
            categories: {
                tutorial: "Tutorial",
                showcase: "Demonstração",
                problem_solving: "Solução de Problemas",
                harvest: "Colheita",
                equipment: "Equipamentos",
                tips: "Dicas",
                success_story: "História de Sucesso",
                daily_life: "Dia a Dia"
            },
            views: "visualizações",
            likes: "curtidas",
            comments: "comentários",
            shares: "compartilhamentos"
        },
        en: {
            categories: {
                tutorial: "Tutorial",
                showcase: "Showcase",
                problem_solving: "Problem Solving",
                harvest: "Harvest",
                equipment: "Equipment", 
                tips: "Tips",
                success_story: "Success Story",
                daily_life: "Daily Life"
            },
            views: "views",
            likes: "likes",
            comments: "comments",
            shares: "shares"
        }
    };

    return (
        <div className="max-w-sm mx-auto h-screen overflow-hidden relative">
            <div 
                className="h-full transition-transform duration-300 ease-out"
                style={{
                    transform: `translateY(-${currentVideoIndex * 100}vh)`
                }}
            >
                {videos.map((video, index) => (
                    <div key={video.id} className="h-screen relative flex-shrink-0">
                        <video
                            ref={el => videoRefs.current[index] = el}
                            className="w-full h-full object-cover cursor-pointer"
                            src={video.video_url}
                            poster={video.thumbnail_url}
                            loop
                            muted={isMuted}
                            playsInline
                            onClick={() => handleVideoClick(index)}
                        />
                        
                        {/* Video Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                        
                        {/* Play/Pause Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {!isPlaying && (
                                <div className="bg-black/50 rounded-full p-4">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                        
                        {/* Video Info */}
                        <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
                            <div className="space-y-2">
                                <Badge variant="secondary" className="mb-2">
                                    {text[language].categories[video.category] || video.category}
                                </Badge>
                                
                                <h3 className="font-semibold text-lg leading-tight">
                                    {video.title}
                                </h3>
                                
                                <p className="text-sm opacity-90 line-clamp-2">
                                    {video.description}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-sm">
                                    <span>@{video.author_name}</span>
                                    <span>•</span>
                                    <span>{video.author_location}</span>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-xs opacity-75">
                                    <span>{video.views_count} {text[language].views}</span>
                                    <span>•</span>
                                    <span>{video.likes_count} {text[language].likes}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex flex-col space-y-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                                onClick={() => handleLike(video.id)}
                            >
                                <Heart className="w-6 h-6" />
                            </Button>
                            <div className="text-center text-white text-xs">
                                {video.likes_count}
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                            >
                                <MessageCircle className="w-6 h-6" />
                            </Button>
                            <div className="text-center text-white text-xs">
                                {video.comments_count}
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                                onClick={() => handleShare(video)}
                            >
                                <Share className="w-6 h-6" />
                            </Button>
                            <div className="text-center text-white text-xs">
                                {video.shares_count}
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </Button>
                        </div>
                        
                        {/* Top Controls */}
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                            >
                                <MoreVertical className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Navigation Dots */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
                {videos.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-8 rounded-full transition-colors ${
                            index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
                        }`}
                        onClick={() => setCurrentVideoIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}