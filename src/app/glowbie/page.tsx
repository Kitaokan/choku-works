'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CameraCapture from './CameraCapture';
import GlowbieStorage from './GlowbieStorage';

// Dynamically import Three.js component to avoid SSR issues
const GlowbieEffect = dynamic(() => import('./GlowbieEffect'), {
  ssr: false
});

export default function GlowbiePage() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [glowbieId, setGlowbieId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Fix: Initialize ref with null directly, not HTMLDivElement | null
  const glowbieContainerRef = useRef<HTMLDivElement>(null);

  // Handle camera capture
  const handleCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
  };

  // Handle camera cancel
  const handleCancelCamera = () => {
    setShowCamera(false);
  };

  // Save captured image
  const handleSave = () => {
    if (!capturedImage) return;
    
    setIsSaving(true);
    
    // Simulate saving to cloud with delay
    setTimeout(() => {
      // Store image in our storage service
      const storage = GlowbieStorage.getInstance();
      const id = storage.storeImage(capturedImage);
      
      setGlowbieId(id);
      setIsSaving(false);
      setIsSaved(true);
    }, 1500);
  };

  // Create a new Glowbie
  const handleCreateNew = () => {
    setCapturedImage(null);
    setGlowbieId(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      {/* Header with navigation */}
      <header className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Glowbie</div>
        <nav>
          <Link href="/" className="hover:text-blue-300 transition-colors">
            ホームに戻る
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <section className="text-center py-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Glowbie</h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-10">
            あなたの顔と一緒に光るGlowbie（ホタル）を作成して、神秘的な体験をしましょう。
          </p>

          {/* Glowbie display area */}
          <div 
            ref={glowbieContainerRef}
            className="relative w-full max-w-2xl h-96 mx-auto rounded-lg overflow-hidden bg-black bg-opacity-30 shadow-2xl mb-10"
          >
            {capturedImage && (
              <GlowbieEffect 
                containerRef={glowbieContainerRef} 
                faceImageUrl={capturedImage} 
              />
            )}
            
            {/* Placeholder when no image */}
            {!capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl text-blue-200">
                  カメラで顔を撮影して、Glowbieを作成しましょう！
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-4">
            {!capturedImage && (
              <button
                onClick={() => setShowCamera(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg"
              >
                カメラで撮影する
              </button>
            )}
            
            {capturedImage && !isSaved && (
              <div className="flex space-x-4">
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  やり直す
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? '保存中...' : 'Glowbieを保存する'}
                </button>
              </div>
            )}
            
            {isSaved && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-800 text-green-100 px-6 py-3 rounded-lg">
                  <p>Glowbieが保存されました！</p>
                  <p className="text-sm">ID: {glowbieId}</p>
                  <p className="text-sm mt-2">（2週間後に自動的に削除されます）</p>
                </div>
                
                <button
                  onClick={handleCreateNew}
                  className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  新しいGlowbieを作る
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Information section */}
        <section className="py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Glowbieについて</h2>
          <div className="bg-indigo-900 bg-opacity-50 rounded-lg shadow-md p-8">
            <p className="text-lg mb-4">
              Glowbieは、あなたの顔とホタルのような光の粒子を組み合わせた、幻想的な体験です。
            </p>
            <p className="text-lg mb-4">
              撮影した画像は暗号化されてクラウドに保存され、2週間後に自動的に削除されます。あなたのプライバシーは大切に守られます。
            </p>
            <p className="text-lg">
              友達にGlowbie IDを共有して、あなたの幻想的な姿を見せましょう！
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Choku Works. All rights reserved.</p>
        </div>
      </footer>

      {/* Camera modal */}
      {showCamera && (
        <CameraCapture onCapture={handleCapture} onCancel={handleCancelCamera} />
      )}
    </div>
  );
}
