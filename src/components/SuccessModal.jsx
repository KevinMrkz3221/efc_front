import React from 'react';

export default function SuccessModal({ open, onClose, message = 'Descarga exitosa' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-8 max-w-sm w-full flex flex-col items-center animate-fade-in">
        <svg className="h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold text-green-700 mb-2">{message}</h2>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Cerrar
        </button>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease; }
      `}</style>
    </div>
  );
}
