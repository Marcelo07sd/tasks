
document.getElementById('form-cliente').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar que recargue la página

    let content = document.getElementById('content').value;

    fetch('/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content})
    })
    .then(response => response.json())
    .then(data => {
        let lista_tareas = document.getElementById('lista-tareas');
        let nuevo_contenedor = document.createElement('div');
        let nuevo_li = document.createElement('li');
        let nuevo_span = document.createElement('span');
        let nuevo_a_done = document.createElement('a');
        let nuevo_a_edit = document.createElement('a');
        let nuevo_a_delete = document.createElement('a');

        nuevo_contenedor.id = `tarea-contenedor-${data.id}`

        nuevo_li.classList.add('content');

        nuevo_span.id = `span-${data.id}`
        nuevo_span.textContent = data.content;

        nuevo_a_done.setAttribute('data-done-id', data.id);
        nuevo_a_done.classList.add('btn', 'btn-success', 'btn-sm', 'radius', 'boton-done');
        nuevo_a_done.textContent = 'done';

        nuevo_a_edit.setAttribute('data-edit-id', data.id);
        nuevo_a_edit.classList.add('btn', 'btn-warning', 'btn-sm', 'radius', 'boton-edit');
        nuevo_a_edit.textContent = 'edit';

        

        nuevo_a_delete.setAttribute('data-delete-id', data.id);
        nuevo_a_delete.classList.add('btn', 'btn-danger', 'btn-sm', 'radius', 'boton-delete');
        nuevo_a_delete.textContent = 'delete';

        
        lista_tareas.appendChild(nuevo_contenedor);
        nuevo_contenedor.appendChild(nuevo_li);
        nuevo_li.appendChild(nuevo_span);
        nuevo_contenedor.appendChild(nuevo_a_done);
        nuevo_contenedor.appendChild(nuevo_a_edit);
        nuevo_contenedor.appendChild(nuevo_a_delete);
    });

    document.getElementById('content').value = "";
    
});

document.getElementById('lista-tareas').addEventListener('click', event => {
    if (event.target.classList.contains('boton-done')) {
        event.preventDefault();

        let id = event.target.getAttribute('data-done-id');

        fetch(`/done/${id}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            let span_id = document.getElementById(`span-${id}`);
            if (data.done) {
                span_id.classList.add('done');
            } else {
                span_id.classList.remove('done');
            }
        });
    } else if (event.target.classList.contains('boton-delete')){
        event.preventDefault();

        let id = event.target.getAttribute('data-delete-id');

        fetch(`/delete/${id}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            let nuevo_contenedor = document.getElementById(`tarea-contenedor-${data.id}`);
            nuevo_contenedor.remove();
        });
    } else if (event.target.classList.contains('boton-edit')){
        event.preventDefault();
        
        let id = event.target.getAttribute('data-edit-id');
        let div_editor = document.getElementById('div-cliente-edit')
        
        div_editor.style.display = 'block'

        fetch(`/edit/${id}`, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            console.log(`La edición del ${data.id} fue ${data.result}`)
            document.getElementById('content-edit').value = data.content
        });

        document.getElementById('form-cliente-edit').addEventListener('submit', function(event) {
            let content_edit = document.getElementById('content-edit').value;
            event.preventDefault();
            fetch(`/edit/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content_edit: content_edit})
            })
            .then(response => response.json())
            .then(data => {
                div_editor.style.display = 'none'
                document.getElementById('content-edit').value = "";

                let elemento_modificado = document.getElementById(`span-${data.id}`)
                elemento_modificado.textContent = data.content
            })
        })
    }

});
