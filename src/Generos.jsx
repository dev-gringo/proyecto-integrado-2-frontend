import { useState, useEffect } from 'react';

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // Guarda el ID si estamos editando
  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'Activo',
    descripcion: ''
  });

  const API_URL = 'http://localhost:4000/api/generos';

  // 1. READ (Leer)
  const cargarGeneros = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setGeneros(data))
      .catch(err => console.error("Error al obtener géneros:", err));
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  // Abrir modal para CREAR
  const abrirModalCrear = () => {
    setEditId(null);
    setFormData({ nombre: '', estado: 'Activo', descripcion: '' });
    setShowModal(true);
  };

  // Abrir modal para EDITAR
  const abrirModalEditar = (genero) => {
    setEditId(genero._id);
    setFormData({
      nombre: genero.nombre,
      estado: genero.estado,
      descripcion: genero.descripcion || ''
    });
    setShowModal(true);
  };

  // 2. CREATE y 3. UPDATE (Guardar cambios)
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        cargarGeneros();
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  // 4. DELETE (Eliminar)
  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este género?')) return;

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => cargarGeneros())
      .catch(err => console.error("Error al eliminar:", err));
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-200">Gestión de Géneros</h3>
        <button 
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          + Nuevo Género
        </button>
      </div>

      <div className="bg-[#151822] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e2230] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {generos.map((genero) => (
                <tr key={genero._id} className="hover:bg-[#1a1d27] transition-colors group">
                  <td className="p-4 text-gray-200 font-medium">{genero.nombre}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      genero.estado === 'Activo' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {genero.estado}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{genero.descripcion}</td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => abrirModalEditar(genero)}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(genero._id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {generos.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No hay géneros registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VENTANA MODAL PARA CREAR / EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#151822] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editId ? 'Editar Género' : 'Crear Nuevo Género'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nombre del Género</label>
                <input 
                  type="text" 
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Ciencia Ficción"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Estado</label>
                <select 
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Descripción</label>
                <textarea 
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none h-24"
                  placeholder="Breve descripción del género..."
                ></textarea>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-400 bg-gray-800/50 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}