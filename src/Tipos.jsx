import { useState, useEffect } from 'react';

export default function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const API_URL = 'http://localhost:4000/api/tipos';

  const cargarTipos = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const abrirModalCrear = () => {
    setEditId(null);
    setFormData({ nombre: '', descripcion: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (tipo) => {
    setEditId(tipo._id);
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || ''
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
        cargarTipos();
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este tipo?')) return;
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => cargarTipos())
      .catch(err => console.error("Error al eliminar:", err));
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-200">Gestión de Tipos</h3>
        <button 
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          + Nuevo Tipo
        </button>
      </div>

      <div className="bg-[#151822] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e2230] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Descripción</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {tipos.map((tipo) => (
              <tr key={tipo._id} className="hover:bg-[#1a1d27] transition-colors">
                <td className="p-4 text-gray-200 font-medium">{tipo.nombre}</td>
                <td className="p-4 text-gray-400 text-sm">{tipo.descripcion}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => abrirModalEditar(tipo)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Editar</button>
                  <button onClick={() => handleDelete(tipo._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {tipos.length === 0 && (
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay tipos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#151822] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editId ? 'Editar Tipo' : 'Nuevo Tipo'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nombre</label>
                <input 
                  type="text" required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Película, Serie..."
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Descripción</label>
                <textarea 
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none h-24"
                  placeholder="Descripción del tipo de producción..."
                ></textarea>
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