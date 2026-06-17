// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5qH3sRL4kKDVPvdH-egPDfr_iH0Plgnx8tS6RVqP8Ab2p9v_DbtXGJ8cJqxtTeCk0/exec";

const CONFIG = {
    // Modo de datos: 'localStorage' o 'googleSheets'
    dataMode: 'localStorage',
    
    // Colores indicadores
    colors: {
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    },

    // Porcentajes para indicadores
    thresholds: {
        success: 90,
        warning: 70
    }
};
