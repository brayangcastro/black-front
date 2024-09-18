 
// ecosystem.config.js para la primera aplicación
module.exports = {
  apps: [{
    name: 'Front 1 3000',
    script: 'npm',
    args: 'run dev',
    env: {
      PORT: 3000, // Asegúrate de que este coincida con el puerto en vite.config.js
    }
  }]
};
 
