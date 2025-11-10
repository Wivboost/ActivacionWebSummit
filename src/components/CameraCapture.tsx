'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './CameraCapture.module.scss';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  label: string;
  capturedImage?: string;
}

export default function CameraCapture({ onCapture, label, capturedImage }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efecto para manejar el stream del video
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // Llamar explícitamente a play() para asegurar que el video se reproduzca
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      setIsOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${label.replace(/\s+/g, '-')}.jpg`, {
              type: 'image/jpeg'
            });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <div className={styles.cameraCapture}>
      <label className={styles.label}>{label}</label>
      
      {capturedImage ? (
        <div className={styles.preview}>
          <img src={capturedImage} alt="Captured photo" />
          <button
            type="button"
            onClick={startCamera}
            className={styles.retakeButton}
          >
            Take another photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startCamera}
          className={styles.captureButton}
        >
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {label}
        </button>
      )}

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={styles.video}
              style={{ minHeight: '300px' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className={styles.controls}>
              <button type="button" onClick={capturePhoto} className={styles.captureBtn}>
                Capture
              </button>
              <button type="button" onClick={stopCamera} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}