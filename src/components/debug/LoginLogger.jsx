import React, { useEffect, useState } from 'react';

const LoginLogger = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Función para actualizar los logs
    const updateLogs = () => {
      const storedLogs = JSON.parse(localStorage.getItem('loginLogs') || '[]');
      setLogs(storedLogs);
    };

    // Actualizar logs cada segundo
    const interval = setInterval(updateLogs, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  if (logs.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '500px',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Login Logs</h4>
      {logs.map((log, index) => (
        <div key={index} style={{ marginBottom: '5px' }}>
          <div style={{ color: '#888' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
          <div>{log.message}</div>
          {log.data && (
            <pre style={{ 
              margin: '5px 0', 
              padding: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              overflowX: 'auto'
            }}>
              {JSON.stringify(log.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoginLogger; 