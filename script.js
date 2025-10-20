document.addEventListener('DOMContentLoaded', () => {

            // --- SIMULACIÓN DE BASE DE DATOS ---
            // Simula los menús guardados
            const menuSemanalDB = {
                1: { // Lunes
                    desayuno: "Café con leche y 2 medialunas",
                    almuerzo: "Milanesa con puré",
                    merienda: "Tostado",
                    cena: "Guiso de lentejas"
                },
                2: { /* Martes */ },
                // ... etc
            };
            
            // Simula el conteo de reservas
            let reservasCountDB = {
                desayuno: 120,
                almuerzo: 250,
                merienda: 90,
                cena: 45
            };

            // --- REFERENCIAS AL DOM ---
            const userMenuButton = document.getElementById('user-menu-button');
            const userMenu = document.getElementById('user-menu');
            const currentDateEl = document.getElementById('current-date');
            const observacionFecha = document.getElementById('observacion-fecha');

            // Modales
            const modalActualizarMenu = document.getElementById('modal-actualizar-menu');
            const modalObservacion = document.getElementById('modal-observacion');
            const modalConfirmacion = document.getElementById('modal-confirmacion');

            // Botones de apertura/cierre
            const btnOpenMenu = document.getElementById('btn-open-menu');
            const btnOpenObservacion = document.getElementById('btn-open-observacion');
            const btnCancelMenu = document.getElementById('btn-cancel-menu');
            const btnCancelObservacion = document.getElementById('btn-cancel-observacion');
            const btnConfirmarFinal = document.getElementById('btn-confirmar-final');
            const btnCancelarFinal = document.getElementById('btn-cancelar-final');

            // Formularios
            const formActualizarMenu = document.getElementById('form-actualizar-menu');
            const formObservacion = document.getElementById('form-observacion');
            const formInformar = document.getElementById('form-informar');

            // Displays Sección 1 (Menú)
            const menuDisplays = {
                desayuno: document.getElementById('menu-desayuno'),
                almuerzo: document.getElementById('menu-almuerzo'),
                merienda: document.getElementById('menu-merienda'),
                cena: document.getElementById('menu-cena')
            };
            
            // Displays Sección 2 (Reservas)
            const countDisplays = {
                desayuno: document.getElementById('count-desayuno'),
                almuerzo: document.getElementById('count-almuerzo'),
                merienda: document.getElementById('count-merienda'),
                cena: document.getElementById('count-cena')
            };
            const btnActualizarReservas = document.getElementById('btn-actualizar-reservas');

            // Estado
            let currentAction = null; // 'menu', 'observacion', 'informar'

            // --- LÓGICA DEL MENÚ DE USUARIO ---
            userMenuButton.addEventListener('click', () => {
                const isHidden = userMenu.classList.contains('hidden');
                if (isHidden) {
                    userMenu.classList.remove('hidden');
                    setTimeout(() => userMenu.classList.remove('opacity-0', 'scale-95'), 10);
                } else {
                    userMenu.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => userMenu.classList.add('hidden'), 300);
                }
            });
            window.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => userMenu.classList.add('hidden'), 300);
                }
            });

            // --- LÓGICA DE FECHA ---
            const now = new Date();
            const fechaLarga = now.toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const fechaCorta = now.toLocaleDateString('es-ES');
            currentDateEl.textContent = fechaLarga;
            observacionFecha.textContent = fechaLarga;

            // Obtener día de la semana (1=Lunes, ..., 0=Domingo)
            // Ajustamos para que Lunes sea 1 y Domingo sea 7 (aunque el modal solo tiene L-V)
            const todayIndex = (now.getDay() === 0) ? 7 : now.getDay(); 

            // --- LÓGICA DE MANEJO DE MODALES ---

            // Abrir
            btnOpenMenu.addEventListener('click', (e) => {
                e.preventDefault();
                // Setea el día actual en el modal
                document.getElementById('menu-dia').value = todayIndex;
                modalActualizarMenu.classList.remove('hidden');
            });
            btnOpenObservacion.addEventListener('click', (e) => {
                e.preventDefault();
                modalObservacion.classList.remove('hidden');
            });

            // Cancelar (Cerrar)
            btnCancelMenu.addEventListener('click', () => modalActualizarMenu.classList.add('hidden'));
            btnCancelObservacion.addEventListener('click', () => modalObservacion.classList.add('hidden'));
            btnCancelarFinal.addEventListener('click', () => modalConfirmacion.classList.add('hidden'));

            // Envío de Formularios (abre modal de confirmación)
            formActualizarMenu.addEventListener('submit', (e) => {
                e.preventDefault();
                currentAction = 'menu';
                modalConfirmacion.classList.remove('hidden');
            });

            formObservacion.addEventListener('submit', (e) => {
                e.preventDefault();
                currentAction = 'observacion';
                modalConfirmacion.classList.remove('hidden');
            });
            
            formInformar.addEventListener('submit', (e) => {
                e.preventDefault();
                currentAction = 'informar';
                modalConfirmacion.classList.remove('hidden');
            });

            // Confirmación Final (la acción real)
            btnConfirmarFinal.addEventListener('click', () => {
                if (currentAction === 'menu') {
                    // 1. Leer datos del modal
                    const dia = document.getElementById('menu-dia').value;
                    const servicio = document.getElementById('menu-servicio').value;
                    const descripcion = document.getElementById('menu-descripcion').value;
                    
                    // 2. Simular guardado en DB
                    if (!menuSemanalDB[dia]) {
                        menuSemanalDB[dia] = {};
                    }
                    menuSemanalDB[dia][servicio] = descripcion;
                    console.log("Menú actualizado:", menuSemanalDB);
                    
                    // 3. Si el día actualizado es HOY, refrescar la UI principal
                    if (dia == todayIndex) {
                        loadMenu();
                    }
                    
                    // 4. Cerrar modales y resetear form
                    modalActualizarMenu.classList.add('hidden');
                    formActualizarMenu.reset();

                } else if (currentAction === 'observacion') {
                    const texto = document.getElementById('observacion-texto').value;
                    console.log(`Observación guardada (${fechaCorta}): ${texto}`);
                    // ... Aquí iría el fetch() a PHP ...
                    
                    modalObservacion.classList.add('hidden');
                    formObservacion.reset();
                    
                } else if (currentAction === 'informar') {
                    const servicio = document.getElementById('select-notificar-servicio').value;
                    console.log(`Informando a alumnos: "${servicio}" está listo.`);
                    // ... Aquí iría el fetch() a PHP para disparar la notificación ...
                    // Esto cambiaría el estado que ve el alumno en su página.
                }

                modalConfirmacion.classList.add('hidden');
                currentAction = null;
            });

            // --- LÓGICA DE CARGA DE DATOS (Sección 1 y 2) ---

            /** Carga el menú del día actual desde la DB simulada */
            function loadMenu() {
                const menuHoy = menuSemanalDB[todayIndex] || {};
                
                menuDisplays.desayuno.textContent = menuHoy.desayuno || "No definido";
                menuDisplays.almuerzo.textContent = menuHoy.almuerzo || "No definido";
                menuDisplays.merienda.textContent = menuHoy.merienda || "No definido";
                menuDisplays.cena.textContent = menuHoy.cena || "No definido";
            }

            /** Carga el conteo de reservas desde la DB simulada */
            function loadReservas() {
                // Simula que los números cambian
                reservasCountDB.desayuno += Math.floor(Math.random() * 3);
                reservasCountDB.almuerzo += Math.floor(Math.random() * 2);

                countDisplays.desayuno.textContent = reservasCountDB.desayuno;
                countDisplays.almuerzo.textContent = reservasCountDB.almuerzo;
                countDisplays.merienda.textContent = reservasCountDB.merienda;
                countDisplays.cena.textContent = reservasCountDB.cena;
            }

            // Evento para el botón de actualizar reservas
            btnActualizarReservas.addEventListener('click', () => {
                // Simula una carga
                btnActualizarReservas.textContent = "Cargando...";
                btnActualizarReservas.disabled = true;
                
                setTimeout(() => {
                    loadReservas();
                    btnActualizarReservas.textContent = "Actualizar";
                    btnActualizarReservas.disabled = false;
                }, 500); // 0.5 seg de delay
            });

            // --- INICIALIZACIÓN ---
            function init() {
                loadMenu();
                loadReservas();
            }

            init();
        });