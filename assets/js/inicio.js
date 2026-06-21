lista.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-action]");
    if(!boton) return;
    const id = Number(boton.dataset.id);
    const action = boton.dataset.action;
    if(accion==="eliminar") {
        eliminarTarea(id);
    }
});