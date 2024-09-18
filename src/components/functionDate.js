export default function obtenerFecha(cadenaFecha) {
    // Crear un objeto de fecha a partir de la cadena de fecha
    const fecha = new Date(cadenaFecha);

    // Check if the date is valid
    if (isNaN(fecha.getTime())) {
        // Return a default value or handle the invalid date appropriately
        // For example, return null or 'Invalid date' or any other placeholder
        return 'Invalid date'; // Or null, or another placeholder value
    } else {
        // Obtener solo la fecha en formato YYYY-MM-DD
        const fechaFormateada = fecha.toISOString().split('T')[0];
        return fechaFormateada;
    }
}
