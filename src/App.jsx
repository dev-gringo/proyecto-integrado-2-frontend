import { useState } from 'react'
import Media from './Media'
import Generos from './Generos'
import Directores from './Directores'
import Productoras from './Productoras'
import Tipos from './Tipos'

function App() {
  // Estado para saber en qué módulo estamos (por defecto empezamos en 'media')
  const [activeTab, setActiveTab] = useState('media');

  // Lista de nuestros módulos
  const modulos = ['media', 'generos', 'directores', 'productoras', 'tipos'];

  return (
    <div className="flex h-screen bg-[#0f111a] text-gray-100 font-sans overflow-hidden">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#151822] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-500 tracking-wider">CUEVANA 3.0</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {modulos.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-600/10 text-blue-500 font-semibold border border-blue-500/20' 
                  : 'text-gray-400 hover:bg-[#1e2230] hover:text-gray-200'
              }`}
            >
              {tab === 'media' ? 'Películas y Series' : tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col bg-[#0f111a] overflow-hidden">
        {/* Cabecera (Header) */}
        <header className="h-20 border-b border-gray-800 bg-[#151822]/80 backdrop-blur flex items-center px-8">
          <h2 className="text-2xl font-semibold capitalize text-white">
            Gestión de {activeTab === 'media' ? 'Películas y Series' : activeTab}
          </h2>
        </header>

        {/* ÁREA DINÁMICA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'media' && <Media />}
          {activeTab === 'generos' && <Generos />}
          {activeTab === 'directores' && <Directores />}
          {activeTab === 'productoras' && <Productoras />}
          {activeTab === 'tipos' && <Tipos />}
        </div>
      </main>

    </div>
  )
}

export default App