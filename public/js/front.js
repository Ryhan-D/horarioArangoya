





function init() {

    subirTareas();
    comprobarImagen();
}




init();

function eliminarTareas(idTarea, nombreAsignatura) {

    if (!idTarea) {
        alert('ID de tarea no válido');
        return;
    }


    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) {
        return;
    }

    fetch(`http://localhost:3000/api/tareas/${idTarea}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                console.log("Tarea eliminada");
                cargarTareas();
                verTareas(nombreAsignatura);

            } else {

                console.log("error al borrar");
            }
        })
        .catch(error => console.error('Error al borrar: ', error));

}

function cargarTareas() {

    fetch('http://localhost:3000/api/tareas/nombres')
        .then(response => {
            console.log('Response status:', response.status);//esto me gusta para saber que todo ha ido bien en consola
            console.log('Response ok:', response.ok);
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('asignaturasContainer');
            container.innerHTML = '';

            data.forEach(item => {

                const card = document.createElement('div');
                card.className = 'asignatura-card';
                card.innerHTML = `
                <div class="tituloContador">
                <h3>${item.nombre_asignatura}</h3> 
                <p style="font-size:18px">quedan <span style="font-size:22px;color:${item.cantidad_tareas > 3 ? '#F98B7C' : '#72cb10'}">${item.cantidad_tareas}</span> tareas pendientes</p>
                </div>
                <button onclick="verTareas('${item.nombre_asignatura}')">Ver tareas</button>
            `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para toggle del contenido de las tarjetas
function esconderContenidoTarea(header) {
    const taskCard = header.closest('.tarea-card');
    const content = taskCard.querySelector('.task-content');
    const icon = header.querySelector('.expand-icon');

    // Toggle classes
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');

    // Add animation effect
    if (content.classList.contains('expanded')) {
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.style.maxHeight = '0px';
    }
}

function comprobarCantidadDias(fecha) {
    const fechaTarea = new Date(fecha);
    const fechaActual = new Date();
    const milisegundosEnUnDia = 1000 * 60 * 60 * 24;
    const diasRestantes = (fechaTarea - fechaActual) / milisegundosEnUnDia;

    return diasRestantes ? diasRestantes : 'N/D';

}
function formatearFecha(fecha) {

    if (!fecha) return 'Sin fecha';

    const dateActual = new Date();
    const añosFuncionamiento = [2025, 2026];
    const date = new Date(fecha);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return ((date.getFullYear() === añosFuncionamiento[0]) || (date.getFullYear() === añosFuncionamiento[1])) ? date.toLocaleDateString('es-Es', opciones) : 'Sin fecha';

}
function verTareas(nombreAsignatura) {
    const url = `http://localhost:3000/api/tareas/buscar?nombreAsignatura=${encodeURIComponent(nombreAsignatura)}`;



    fetch(url).then(response => response.json())
        .then(data => {
            const seccionAsignatura = document.getElementById('tareas-select');
            seccionAsignatura.innerHTML = '';

            data.forEach(item => {
                const fechaFormateada = formatearFecha(item.fecha);
                const diasFaltantes = comprobarCantidadDias(item.fecha);
                const diasFaltantesFinal = diasFaltantes === 'N/D' ? 'N/D' : Math.round(diasFaltantes);
                const mensajeDias = Math.abs(diasFaltantesFinal) > 1 ? ' Dias' : ' Dia';
                const card = document.createElement('div');
                card.className = 'tarea-card';
                card.innerHTML = `
                    <div class="task-header" onclick="esconderContenidoTarea(this)">
                        <div class="task-info">
                            <h3 class="task-title">${item.label_tarea}</h3>
                             <button type="button" data-id="${item.id}" 
                            class="btn-eliminar" 
                            title="Eliminar tarea">
                        🗑️
                    </button>
                            <div class="task-date">
                                <svg class="date-icon" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                ${fechaFormateada}
                                 <p style="color:${Math.sign(diasFaltantesFinal) === -1 ?
                        'red' : '#355749'};font-size:18px;font-weight:bold;">${Math.sign(diasFaltantesFinal) === -1 ?
                            (Math.abs(diasFaltantesFinal) + mensajeDias + ' de retraso') : (Math.abs(diasFaltantesFinal) + mensajeDias + (mensajeDias === ' Dias' ? ' restantes' : ' restante'))} 

                            </div>
                        </div>
                        <svg class="expand-icon" viewBox="0 0 24 24">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                        </svg>
                    </div>
                    <div class="task-content">
                        <div class="task-description">
                            <h4>Descripción de la tarea:</h4>
                            ${item.nombre_tarea || 'Sin descripción disponible'}
                        </div>
                    </div>
                `;
                const btnEliminar = card.querySelector('.btn-eliminar');
                btnEliminar.addEventListener('click', (e) => {
                    e.stopPropagation(); //para que no expanda la tarea
                    const id = e.target.dataset.id;
                    eliminarTareas(id, nombreAsignatura);
                });
                seccionAsignatura.appendChild(card);
            });
        }
        )
        .catch(error => console.error('error: ', error));

    const tareas = document.getElementById('tareas-select');
    const alta = document.getElementById('tareas-alta');

    tareas.style.display = 'flex';
    alta.style.display = 'none';

    const titulo = document.getElementById('titulo-select');
    const btnVolver = document.getElementById('btn-volver');
    titulo.style.display = 'flex';
    btnVolver.addEventListener('click', () => {
        tareas.style.display = 'none';
        alta.style.display = 'flex';
        titulo.style.display = 'none';
    })

}
function animacionHoras() {
    const ahora = new Date();
    const diaSemana = ahora.getDay();


    let semana = (diaSemana > 0 && diaSemana < 6) ? true : false;

    if (semana) {

        const horaContainer = document.getElementById('seccionHora');
        horaContainer.style.display = 'flex';
    }





}

function comprobarImagen() {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const hora = ahora.getHours();


    let laboral = ((diaSemana > 0 && diaSemana < 6) && (hora >= 8 && hora < 15)) ? true : false;

    if (laboral) {

        const img = document.getElementById('imgHoras');
        const titulo = document.getElementById('tituloHoras');
        img.src = './public/img/img_laboral.gif';
        titulo.textContent = 'vamoh a darle!';
    }

}
function renderizarPagina(componente) {

    const componentHorario = document.getElementById("horario-section");
    const componentNotas = document.getElementById("notas-section");
    const componentApuntes = document.getElementById("apuntes-section");

    if (componente == "horario") {
        componentHorario.style.display = 'block';
        componentApuntes.style.display = 'none';
        animacionHoras();
    } else if (componente == "notas") {
        componentHorario.style.display = 'none';
        componentApuntes.style.display = 'none';
        componentNotas.style.display('flex');

    } else if (componente == "apuntes") {

        cargarTareas();

        componentHorario.style.display = 'none';
        // componentNotas.style.display('none');   <-cagada, va con = no en () como funcion
        componentApuntes.style.display = 'grid';
    }

}

function subirTareas() {
    document.getElementById('formTareas').addEventListener('submit', async function (e) {
        e.preventDefault(); //evita redireccion

        const formData = new FormData(e.target);

        try {
            const response = await fetch('http://localhost:3000/api/tareas/subir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputNombre: formData.get('inputNombre'),
                    inputFecha: formData.get('inputFecha'),
                    inputTarea: formData.get('inputTarea'),
                    labelTarea: formData.get('labelTarea')
                })
            });

            if (response.ok) {
                const dialog = document.getElementById('myDialog');
                dialog.style.display = 'flex';
                setTimeout(() => {
                    dialog.style.display = 'none';
                }, 2000);
                e.target.reset();
                cargarTareas();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}