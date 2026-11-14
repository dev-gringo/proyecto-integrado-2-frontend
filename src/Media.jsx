import { useState, useEffect } from 'react';

export default function Media() {
  const [peliculas, setPeliculas] = useState([]);
  
  // Listas para los selectores desplegables (llaves foráneas)
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const initialForm = {
    serial: '',
    titulo: '',
    sinopsis: '',
    urlPelicula: '',
    imagenPortada: '',
    añoEstreno: new Date().getFullYear(),
    generoPrincipal: '',
    directorPrincipal: '',
    productora: '',
    tipo: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const API_URL = 'http://localhost:4000/api/media';

  // Cargar películas y todos los catálogos relacionados
  const cargarTodo = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPeliculas(data))
      .catch(err => console.error("Error al cargar media:", err));

    fetch('http://localhost:4000/api/generos').then(r => r.json()).then(setGeneros);
    fetch('http://localhost:4000/api/directores').then(r => r.json()).then(setDirectores);
    fetch('http://localhost:4000/api/productoras').then(r => r.json()).then(setProductoras);
    fetch('http://localhost:4000/api/tipos').then(r => r.json()).then(setTipos);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const abrirModalCrear = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const abrirModalEditar = (pelicula) => {
    setEditId(pelicula._id);
    setFormData({
      serial: pelicula.serial || '',
      titulo: pelicula.titulo || '',
      sinopsis: pelicula.sinopsis || '',
      urlPelicula: pelicula.urlPelicula || '',
      imagenPortada: pelicula.imagenPortada || '',
      añoEstreno: pelicula.añoEstreno || 2024,
      generoPrincipal: pelicula.generoPrincipal?._id || pelicula.generoPrincipal || '',
      directorPrincipal: pelicula.directorPrincipal?._id || pelicula.directorPrincipal || '',
      productora: pelicula.productora?._id || pelicula.productora || '',
      tipo: pelicula.tipo?._id || pelicula.tipo || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const method = editId ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      añoEstreno: Number(formData.añoEstreno)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`No se pudo guardar: ${data.mensaje || data.message || JSON.stringify(data)}`);
        return;
      }

      setShowModal(false);
      cargarTodo();
    } catch (err) {
      console.error("Error en petición:", err);
      alert("Error de conexión con el servidor.");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta producción?')) return;
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => cargarTodo())
      .catch(err => console.error("Error al eliminar:", err));
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-200">Catálogo de Producciones</h3>
        <button 
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          + Agregar Producción
        </button>
      </div>

      {/* GRID ESTILO CUEVANA */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {peliculas.map((pelicula) => (
          <div key={pelicula._id} className="bg-[#151822] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 shadow-lg flex flex-col justify-between group">
            <div>
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
                {pelicula.imagenPortada ? (
                  <img
                    src={pelicula.imagenPortada}
                    alt={pelicula.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Sin Portada</div>
                )}
                
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                  {pelicula.añoEstreno}
                </div>

                {/* Botón flotante para ver enlace */}
                {pelicula.urlPelicula && (
                  <a 
                    href={pelicula.urlPelicula} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </a>
                )}
              </div>

              <div className="p-4">
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                  {pelicula.tipo?.nombre || 'Producción'} • {pelicula.generoPrincipal?.nombre || 'General'}
                </span>
                <h4 className="text-gray-100 font-semibold truncate mt-0.5" title={pelicula.titulo}>
                  {pelicula.titulo}
                </h4>
                <p className="text-gray-500 text-xs line-clamp-2 mt-1">{pelicula.sinopsis}</p>
              </div>
            </div>

            {/* Botones de acción en la tarjeta */}
            <div className="px-4 py-3 bg-[#10131c] border-t border-gray-800/80 flex justify-between text-xs font-medium">
              <button 
                onClick={() => abrirModalEditar(pelicula)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(pelicula._id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        
        {peliculas.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-20 border-2 border-dashed border-gray-700 rounded-xl">
            <p>No se encontraron producciones registradas.</p>
          </div>
        )}
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN DE MEDIA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151822] p-6 md:p-8 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editId ? 'Editar Producción' : 'Nueva Producción'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Serial (Único)</label>
                  <input 
                    type="text" required
                    value={formData.serial}
                    onChange={(e) => setFormData({...formData, serial: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: COM-001"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Título</label>
                  <input 
                    type="text" required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: ¿Qué pasó ayer?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">URL de la Película</label>
                  <input 
                    type="url" required
                    value={formData.urlPelicula}
                    onChange={(e) => setFormData({...formData, urlPelicula: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">URL Imagen de Portada</label>
                  <input 
                    type="url" required
                    value={formData.imagenPortada}
                    onChange={(e) => setFormData({...formData, imagenPortada: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="https://imagen.com/poster.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Año de Estreno</label>
                  <input 
                    type="number" required
                    value={formData.añoEstreno}
                    onChange={(e) => setFormData({...formData, añoEstreno: Number(e.target.value)})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Género Principal</label>
                  <select 
                    required
                    value={formData.generoPrincipal}
                    onChange={(e) => setFormData({...formData, generoPrincipal: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {generos.filter(g => g.estado === 'Activo').map(g => (
                      <option key={g._id} value={g._id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Director Principal</label>
                  <select 
                    required
                    value={formData.directorPrincipal}
                    onChange={(e) => setFormData({...formData, directorPrincipal: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {directores.filter(d => d.estado === 'Activo').map(d => (
                      <option key={d._id} value={d._id}>{d.nombres || d.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Productora</label>
                  <select 
                    required
                    value={formData.productora}
                    onChange={(e) => setFormData({...formData, productora: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {productoras.filter(p => p.estado === 'Activo').map(p => (
                      <option key={p._id} value={p._id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs uppercase mb-1">Tipo</label>
                  <select 
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {tipos.map(t => (
                      <option key={t._id} value={t._id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase mb-1">Sinopsis</label>
                <textarea 
                  required
                  value={formData.sinopsis}
                  onChange={(e) => setFormData({...formData, sinopsis: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none h-20"
                  placeholder="Resumen de la trama..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-400 bg-gray-800/50 hover:bg-gray-800 hover:text-white">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  {editId ? 'Actualizar Producción' : 'Guardar Producción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}