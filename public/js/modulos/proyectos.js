import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){

    btnEliminar.addEventListener('click', e=>{
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto);
        // return
        //console.log('diste click en eliminar');
        Swal.fire({
            title: 'Estas Seguro?',
            text: "Un proyecto no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borralo!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //enviar la patecion con axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                console.log(url);
               axios.delete( url, {params: {urlProyecto}})
               .then((res)=>{
                   console.log(res);
                   Swal.fire(
                     'Borrado!',
                     'Este Proyecto fue elimado',
                     'success'
                   );
                   //redireccion al inicio
                   setTimeout(()=>{
                     window.location.href = '/';
                   },1500);
               })
               .catch(()=>{
                   Swal.fire({
                       icon: 'error',
                       title: 'Hubo un error',
                        text: 'No se pudo elimanar el Proyecto'
                    }
                   )
               });
            }
          });
    }   )
}

export default btnEliminar;