





function init() {

    subirTareas();
    comprobarImagen();
}




init();



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

function verTareas(nombreAsignatura) {
    const url = `http://localhost:3000/api/tareas/buscar?nombreAsignatura=${encodeURIComponent(nombreAsignatura)}`;



    fetch(url).then(response => response.json())
        .then(data => {
            const seccionAsignatura = document.getElementById('tareas-select');
            seccionAsignatura.innerHTML = '';
            seccionAsignatura.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'asignatura-card';
                card.innerHTML = `
                <h2>'${item.label_tarea}'</h2>
                <p>'${item.fecha}'<p>
`;
                seccionAsignatura.appendChild(card)
            })
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