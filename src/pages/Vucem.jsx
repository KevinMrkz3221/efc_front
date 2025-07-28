import React from 'react';

export default function Vucem() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-4">Vucem</h1>
        <p className="text-gray-600 mb-6">Esta es la vista de integración con VUCEM. Aquí podrás consultar, gestionar o integrar funcionalidades relacionadas con la Ventanilla Única de Comercio Exterior Mexicana.</p>
        <div className="flex flex-col gap-4 items-center">
          <svg className="w-16 h-16 text-blue-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M12 8v8" />
          </svg>
          <span className="text-blue-700 font-semibold">Próximamente podrás ver información y acciones de VUCEM aquí.</span>
        </div>
      </div>
    </div>
  );
}
