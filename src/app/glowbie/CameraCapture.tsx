'use client';

import { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Start the camera when component mounts
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        // Request camera access with constraints for front camera if available
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Front camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('カメラへのアクセスが拒否されました。設定から許可してください。');
      }
    };
    
    startCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Capture image from video stream
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL (base64 encoded image)
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Pass the image data to parent component
    onCapture(imageDataUrl);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Glowbie 写真を撮影</h2>
        </div>
        
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {error ? (
            <div className="text-white text-center p-4">{error}</div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              {/* Hidden canvas for image processing */}
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}
        </div>
        
        <div className="p-4 flex justify-between">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
          
          <button 
            onClick={captureImage}
            disabled={!cameraReady}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${!cameraReady ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            撮影
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
