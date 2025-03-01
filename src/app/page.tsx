"use client";

import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-white text-black">
      {/* Judul */}
      <div className="text-center">
        <p className="text-md font-semibold tracking-wider">EST</p>
        <h1 className="text-6xl font-bold">photobooth</h1>
        <p className="text-md font-semibold tracking-wider">2025</p>
        <p className="text-sm mt-2 text-gray-700">
          Capture the moment, cherish the magic, <br />
          relive the love
        </p>
      </div>

      {/* Tombol START */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => router.push("/photobooth")}
          className="flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-full 
          hover:bg-blue-500 hover:text-white transition shadow-md"
        >
          START <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>

        </button>

        {/* Ikon Hati */}
        <a href="https://bagibagi.co/iqi" target="blank" className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-pink-500 hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>

        </a>
      </div>
    </div>
  );
}
