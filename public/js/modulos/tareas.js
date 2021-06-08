import Swal from 'sweetalert2';
import axios from 'axios';

import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            //console.log(idTarea);
            //requet hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {id: idTarea})
                .then( (res) =>{
                 if(res.status === 200){
                     icono.classList.toggle('completo');
                     actualizarAvance();
                 }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
             idTarea = tareaHTML.dataset.tarea

            Swal.fire({
                title: 'Estas Seguro?',
                text: "Una Tarea borrada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borralo!',
                cancelButtonText: 'Cancelar'
            })
            .then((result) => {
                //console.log(result);
               
                if (result.value) {
                    //enviar la patecion con axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                   // console.log(url);
                 axios.delete( url, {params: {idTarea}})
                    .then((res)=>{
                       // console.log(res);
                       //Elimanar el nodo que es todo el li
                       if(res.status === 200){
                        
                           tareaHTML.parentElement.removeChild(tareaHTML);
                           actualizarAvance();
                       }
                        Swal.fire(
                            'Borrado!',
                            'Esta Tarea fue elimada',
                            'success'
                        );
                        //redireccion al inicio
                        // setTimeout(()=>{
                        //     window.location.href = '/';
                        // },3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                                text: 'No se pudo elimanar la tarea'
                            }
                        )
                    });
                }
            });
        }
    });
}

export default tareas;