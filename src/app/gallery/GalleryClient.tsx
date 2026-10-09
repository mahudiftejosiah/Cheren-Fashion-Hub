'use client';

import React, { useState } from 'react';
import { Play, X, Image as ImageIcon, Film, Crown, Sparkles } from 'lucide-react';

interface MediaWithItem {
  id: string;
  url: string;
  mediaType: string;
  altText: string | null;
  fashionItem: {
    title: string;
    category: string;
  };
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
}

interface GalleryClientProps {
  mediaItems: MediaWithItem[];
  videos: VideoItem[];
}

export function GalleryClient({ mediaItems, videos }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState<'PHOTOS' | 'VIDEOS'>('PHOTOS');
  const [activePhoto, setActivePhoto] = useState<MediaWithItem | null>(null);

  return (
    <div className="space-y-10">
      
      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-2 rounded-full bg-zinc-900 border border-gold-500/30 shadow-xl">
          <button
            onClick={() => setActiveTab('PHOTOS')}
            className={`flex items-center space-x-2 px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'PHOTOS'
                ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-amber-600 text-zinc-950 shadow-gold-glow scale-105 border border-amber-200'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 stroke-[2.2]" />
            <span>High-Res Photos ({mediaItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('VIDEOS')}
            className={`flex items-center space-x-2 px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'VIDEOS'
                ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-amber-600 text-zinc-950 shadow-gold-glow scale-105 border border-amber-200'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 stroke-[2.2]" />
            <span>Video Showcase ({videos.length})</span>
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      {activeTab === 'PHOTOS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((media) => (
            <div
              key={media.id}
              onClick={() => setActivePhoto(media)}
              className="group relative rounded-3xl overflow-hidden luxury-border bg-zinc-950 h-88 cursor-pointer shadow-xl transition-all"
            >
              <img
                src={media.url}
                alt={media.altText || media.fashionItem.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block">
                  {media.fashionItem.category}
                </span>
                <h3 className="font-fashion-serif text-xl font-bold truncate group-hover:text-gold-300 transition-colors">
                  {media.fashionItem.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {activeTab === 'VIDEOS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-3xl overflow-hidden luxury-border bg-zinc-900 shadow-2xl p-4 space-y-4"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950">
                <video
                  controls
                  poster={vid.thumbnailUrl}
                  className="w-full h-full object-cover"
                  preload="none"
                >
                  <source src={vid.videoUrl} type="video/mp4" />
                </video>
              </div>
              <div className="px-2 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block">
                  {vid.category}
                </span>
                <h3 className="font-fashion-serif text-xl font-bold text-white">
                  {vid.title}
                </h3>
                <p className="text-zinc-400 text-xs font-light">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Photo Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-gold-500/30 text-gold-400 hover:text-white hover:border-gold-400 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activePhoto.url}
              alt={activePhoto.fashionItem.title}
              className="max-w-full max-h-[75vh] object-contain rounded-3xl luxury-border shadow-gold-glow-lg"
            />
            <div className="mt-5 text-center text-white space-y-1">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
                {activePhoto.fashionItem.category}
              </span>
              <h3 className="font-fashion-serif text-2xl font-bold">
                {activePhoto.fashionItem.title}
              </h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
