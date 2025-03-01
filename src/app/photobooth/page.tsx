"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PhotoBooth() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [countdown, setCountdown] = useState<number | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [allPhotosTaken, setAllPhotosTaken] = useState(false);
    const [flash, setFlash] = useState(false);
    const router = useRouter();

    useEffect(() => {
        startCamera();
    }, []);

    const startCamera = async () => {
        if (streamRef.current) stopCamera();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    };

    const playShutterSound = () => {
        const audio = new Audio("/shutter.mp3"); // Pastikan file ini ada di public/
        audio.play();
    };

    const captureAuto = async () => {
        setPhotos([]);
        setAllPhotosTaken(false);
        for (let i = 0; i < 3; i++) {
            for (let j = 3; j > 0; j--) {
                setCountdown(j);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            setCountdown(null);
            capturePhoto();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setAllPhotosTaken(true);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageSrc = canvas.toDataURL("image/png");
            setPhotos(prev => [...prev, imageSrc]);

            // 🔥 Efek Flash
            setFlash(true);
            setTimeout(() => setFlash(false), 100);

            // 🔊 Mainkan suara
            playShutterSound();
        }
    };

    const goToPreview = () => {
        if (photos.length === 0) return;
        sessionStorage.setItem("photobooth_photos", JSON.stringify(photos));
        router.push("/preview");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative  bg-gradient-to-b from-blue-200 to-white">
            {/* 🔥 Flash Effect */}
            {flash && <div className="absolute inset-0 bg-white opacity-80 animate-fade-out pointer-events-none"></div>}

            <div className="flex items-start gap-8">
                <div className="relative">
                    <video ref={videoRef} autoPlay className=" rounded-lg shadow-lg" />
                    {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                            {countdown}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    {photos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Photo ${index + 1}`} className="w-50 h-35     object-cover rounded-md border" />
                    ))}
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => {
                        setPhotos([]);  // Hapus foto lama
                        setAllPhotosTaken(false);  // Reset status
                        captureAuto();  // Mulai pengambilan foto lagi
                    }}
                    className="py-2 bg-white text-blue-500 border hover:bg-blue-500 hover:text-white rounded-full px-5"
                >
                    {allPhotosTaken ? "Retake" : "Take Photo "}
                </button>

                {allPhotosTaken && (
                    <button onClick={goToPreview} className="py-2 bg-blue-500 text-white rounded-full px-5">
                        Next
                    </button>
                )}
            </div>


            {/* 🔥 Tambahkan animasi CSS */}
            <style jsx>{`
                @keyframes fade-out {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .animate-fade-out {
                    animation: fade-out 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
