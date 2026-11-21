import { useState, useEffect } from 'react';

export default function Directores() {
  const [directores, setDirectores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    estado: 'Activo'
  });

  const API_URL = 'https://proyecto-integrado-2-backend.onrender.com/api/directores';

  const cargarDirectores = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setDirectores(data))
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    cargarDirectores();
  }, []);

  const abrirModalCrear = () => {
    setEditId(null);
    setFormData({ nombres: '', estado: 'Activo' });
    setShowModal(true);
  };

  const abrirModalEditar = (director) => {
    setEditId(director._id);
    setFormData({
      nombres: director.nombres || director.nombre || '',
      estado: director.estado
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        cargarDirectores();
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este director?')) return;
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => cargarDirectores())
      .catch(err => console.error("Error al eliminar:", err));
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-200">Gestión de Directores</h3>
        <button 
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          + Nuevo Director
        </button>
      </div>

      <div className="bg-[#151822] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e2230] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Nombres</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {directores.map((director) => (
              <tr key={director._id} className="hover:bg-[#1a1d27] transition-colors">
                <td className="p-4 text-gray-200 font-medium">{director.nombres || director.nombre}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    director.estado === 'Activo' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {director.estado}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => abrirModalEditar(director)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Editar</button>
                  <button onClick={() => handleDelete(director._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {directores.length === 0 && (
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay directores registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#151822] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editId ? 'Editar Director' : 'Nuevo Director'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nombres del Director</label>
                <input 
                  type="text" required
                  value={formData.nombres}
                  onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Christopher Nolan"
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
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-400 bg-gray-800/50 hover:bg-gray-800 hover:text-white">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">{editId ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}