"use client";

import { useEffect, useRef, useState } from "react";

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });
  const [allPhotosTaken, setAllPhotosTaken] = useState(false);

  useEffect(() => {
    startCamera();
    setupCanvas();
  }, []);

  const startCamera = async () => {
    if (streamRef.current) {
      stopCamera();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setVideoSize({
            width: videoRef.current!.videoWidth,
            height: videoRef.current!.videoHeight,
          });
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureAuto = async () => {
    setAllPhotosTaken(false); // Reset status foto
    clearCanvas(); // Hapus foto sebelumnya

    for (let i = 0; i < 3; i++) {
      for (let j = 3; j > 0; j--) {
        setCountdown(j);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);
      capturePhoto(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setAllPhotosTaken(true); // ✅ Tampilkan tombol download setelah semua foto selesai
  };

  const capturePhoto = (index: number) => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 🔊 Memainkan suara shutter
        const shutterSound = new Audio("/shutter.mp3");
        shutterSound.play();

        drawToPreview(canvas.toDataURL(), index);
      }
    }
  };

  const setupCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PhotoBooth Memories", canvasRef.current.width / 2, 60);
        ctx.font = "18px Arial";
        ctx.fillText("Thank you for using PhotoBooth!", canvasRef.current.width / 2, canvasRef.current.height - 60);
        ctxRef.current = ctx;
        ctx.font = "16px Arial";
        ctx.fillText(
          new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          canvasRef.current.width / 2,
          canvasRef.current.height - 40
        );
      }
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setupCanvas(); // Gambar ulang teks default
    }
  };

  const drawToPreview = (imageSrc: string, index: number) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const previewWidth = 300;
      const previewHeight = (img.height / img.width) * previewWidth;
      const yPos = 120 + index * (previewHeight + 20);
      ctx.drawImage(img, 50, yPos, previewWidth, previewHeight);
    };
  };

  const downloadPhoto = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "photobooth_result.jpg";
    link.href = canvas.toDataURL("image/jpeg"); // Format JPG
    link.click();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="flex flex-row items-start justify-center gap-8">
        {/* KAMERA + KONTROL */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <video ref={videoRef} autoPlay className="w-[800px] h-[450px] rounded-lg shadow-lg" />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold rounded-lg">
                {countdown}
              </div>
            )}
          </div>

          {/* TOMBOL KONTROL */}
          <div className="flex gap-2">
            <button onClick={captureAuto} className="p-2 bg-green-500 text-white rounded">
              CEKREK !!!
            </button>
          </div>
        </div>

        {/* CANVAS PREVIEW */}
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={1000}
            style={{ width: "200px", height: "500px" }}
            className="rounded-lg shadow-lg"
          />

          {/* TOMBOL DOWNLOAD HANYA MUNCUL JIKA FOTO SELESAI */}
          {allPhotosTaken && (
            <button onClick={downloadPhoto} className="p-2 mt-3 bg-blue-500 text-white rounded">
              Download Hasil
            </button>
          )}
        </div>
        <button style={{ backgroundColor: 'blue', color: 'white' }}>BG</button>
      </div>
    </div>
  );
}
