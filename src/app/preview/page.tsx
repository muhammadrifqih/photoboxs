"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<string>("#cdb4db"); // Default warna ungu muda
    const [addDate, setAddDate] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null); // Canvas untuk HD download

    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photobooth_photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            router.push("/"); // Redirect jika tidak ada foto
        }
    }, [router]);

    useEffect(() => {
        drawPreview(false); // Gambar preview kecil
    }, [photos, selectedFrame, addDate]);

    const drawPreview = async (isHD: boolean) => {
        const canvas = isHD ? hiddenCanvasRef.current : canvasRef.current;
        if (!canvas || photos.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleFactor = isHD ? 3 : 1; // Skala HD hanya saat download
        const imgWidth = 300;
        const imgHeight = 200;
        const padding = 20;
        const borderSize = 20;
        const footerHeight = 80;

        canvas.width = (imgWidth + borderSize * 2) * scaleFactor;
        canvas.height = (photos.length * (imgHeight + padding) + borderSize * 2 + footerHeight) * scaleFactor;

        ctx.fillStyle = selectedFrame;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const textColor = ["#000000", "#7d0000", "#0000ff"].includes(selectedFrame) ? "white" : "black";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";

        ctx.font = `${20 * scaleFactor}px Arial`;

        await Promise.all(
            photos.map((photo, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = photo;
                    img.onload = () => {
                        const x = borderSize * scaleFactor;
                        const y = (index * (imgHeight + padding) + borderSize) * scaleFactor;
                        ctx.drawImage(img, x, y, imgWidth * scaleFactor, imgHeight * scaleFactor);
                        resolve();
                    };
                });
            })
        );

        ctx.fillText("photobooth", canvas.width / 2, canvas.height - 40 * scaleFactor);

        if (addDate) {
            ctx.font = `${16 * scaleFactor}px Arial`;
            ctx.fillText(new Date().toLocaleDateString("id-ID"), canvas.width / 2, canvas.height - 15 * scaleFactor);
        }
    };

    const downloadImage = async () => {
        await drawPreview(true); // Gambar ulang dalam HD
        if (!hiddenCanvasRef.current) return;

        const link = document.createElement("a");
        link.href = hiddenCanvasRef.current.toDataURL("image/png");
        link.download = "photobooth_result.png";
        link.click();
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6 gap-12  bg-gradient-to-b from-blue-200 to-white">
            {/* CANVAS PREVIEW (Kecil) */}
            <canvas ref={canvasRef} className="border  shadow-lg w-60 h-auto"></canvas>

            {/* PENGATURAN FRAME & OPSI */}
            <div className="flex flex-col items-start gap-4">
                <h2 className="text-xl font-semibold">customize your photo</h2>
                <label className="font-semibold">frame:</label>
                <div className="flex gap-2">
                    {["#f8a5c2", "#c4e8ff", "#fef3b3", "#97a97c", "#cdb4db", "#e3c5a8", "#7d0000", "#ffffff", "#000000", "#0000ff"].map((color) => (
                        <button key={color} className="w-11 h-11 rounded-full border" style={{ backgroundColor: color }} onClick={() => setSelectedFrame(color)}></button>
                    ))}
                </div>

                {/* OPSI TANGGAL */}
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addDate} onChange={() => setAddDate(!addDate)} /> Add Date
                </label>

                {/* TOMBOL NAVIGASI */}
                <div className="flex gap-4 mt-4">
                    <button onClick={() => router.push("/photobooth")} className="px-6 py-2 border rounded-full ">RETAKE</button>
                    <button onClick={downloadImage} className="px-6 py-2 border rounded-full text-blue-500 hover:bg-blue-500 hover:text-white">DOWNLOAD</button>
                </div>
            </div>

            {/* HIDDEN CANVAS untuk Download */}
            <canvas ref={hiddenCanvasRef} className="hidden"></canvas>
        </div>
    );
}
