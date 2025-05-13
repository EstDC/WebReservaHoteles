import React, { useState } from 'react';

const ChevronDown = ({ open }) => (
  <svg
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    width="24"
    height="24"
    fill="none"
    stroke="#252525"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ExtrasModal = ({ extras, open, onClose, onConfirm, initialSelected = {} }) => {
  const [selected, setSelected] = useState(initialSelected);
  const [expanded, setExpanded] = useState({});

  const handleToggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const total = extras.reduce((sum, extra) => (
    selected[extra.id] ? sum + extra.precio : sum
  ), 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col relative shadow-2xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold">Completa tu estancia añadiendo servicios extra</h2>
          <button className="text-3xl text-gray-400 hover:text-black" onClick={onClose}>×</button>
        </div>
        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 px-8 py-2">
          {extras.map(extra => (
            <div key={extra.id} className="border-b last:border-b-0">
              <button
                type="button"
                className="w-full flex justify-between items-center py-4 text-lg font-medium text-left focus:outline-none"
                onClick={() => handleToggleExpand(extra.id)}
              >
                <span>{extra.nombre}</span>
                <span className="flex items-center gap-4">
                  <span className="text-base font-normal text-gray-700">{extra.precio.toFixed(2)} €</span>
                  <ChevronDown open={!!expanded[extra.id]} />
                </span>
              </button>
              {expanded[extra.id] && (
                <div className="pb-4 pl-2 pr-2 text-gray-600 text-base bg-gray-50 rounded">
                  <p className="mb-2">{extra.descripcion}</p>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={!!selected[extra.id]}
                      onChange={() => handleToggleSelect(extra.id)}
                      className="accent-primary w-5 h-5"
                    />
                    <span className="ml-2">Añadir este servicio extra</span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Footer fijo con resumen y botones */}
        <div className="border-t px-8 py-6 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="font-semibold text-lg flex-1">
            Servicios añadidos: <span className="font-bold">{total.toFixed(2)} €</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
            <button
              className="w-full md:w-auto text-gray-700 border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition"
              onClick={onClose}
              type="button"
            >
              No quiero añadir servicios extra
            </button>
            <button
              className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition disabled:opacity-50"
              disabled={total === 0}
              onClick={() => onConfirm(selected)}
              type="button"
            >
              Añadir servicios y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrasModal;