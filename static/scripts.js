
window.onload = function() {
        let input = document.getElementById("miInput");
        let longitudTexto = input.value.length;
        input.focus();  // Asegura que el input esté activo
        input.setSelectionRange(longitudTexto, longitudTexto); // Mueve el cursor al final
    };