import Swal from 'sweetalert2';

export const actualizarAvance = ()=>{
//seleccionar las tareas existentes
const tareas_E = document.querySelectorAll('li.tarea');

if(tareas_E.length){
    const tareasCompletadas = document.querySelectorAll('i.completo');
    //calcular el avance
    const avance = Math.round((tareasCompletadas.length / tareas_E.length ) * 100);
    console.log(avance);

    //mostrar el avance

    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    if(avance == 100){
        Swal.fire(
            'Felicidade!!',
            'Completaste todas tus tareas!',
            'success'
        );
    }
}
}