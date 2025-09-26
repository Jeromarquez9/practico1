const readline = require("readline");

class Task {
  constructor(titulo, descripcion = "", vencimiento = null, dificultad = 1) {
    if (!titulo || titulo.trim() === "" || titulo.length > 100) {
      throw new Error("El título es obligatorio y debe tener hasta 100 caracteres.");
    }
    if (descripcion.length > 500) {
      throw new Error("La descripción no puede superar 500 caracteres.");
    }

    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = 1;
    this.creacion = new Date();
    this.vencimiento = vencimiento ? new Date(vencimiento) : null;
    this.dificultad = dificultad;
  }

  mostrarDetalles() {
    console.log("\n===== 📌 Detalles de la tarea =====");
    console.log("Título:", this.titulo);
    console.log("Descripción:", this.descripcion || "(vacía)");
    console.log("Estado:", Task.estados[this.estado]);
    console.log("Dificultad:", Task.dificultades[this.dificultad]);
    console.log("Fecha de creación:", this.creacion.toLocaleString());
    console.log("Fecha de vencimiento:", this.vencimiento ? this.vencimiento.toLocaleDateString() : "(sin fecha)");
    console.log("===================================\n");
  }

  static estados = {
    1: "Pendiente",
    2: "En curso",
    3: "Terminada",
    4: "Cancelada",
  };

  static dificultades = {
    1: "Fácil ⭐",
    2: "Medio ⭐⭐",
    3: "Difícil ⭐⭐⭐",
  };
}
class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  agregarTarea(tarea) {
    this.tareas.push(tarea);
  }

  listarTareas(estado = null) {
    let lista = this.tareas;
    if (estado) {
      lista = lista.filter((t) => t.estado === estado);
    }
    if (lista.length === 0) {
      console.log("❌ No hay tareas para mostrar.");
    } else {
      lista.forEach((t, i) => {
        console.log(`${i + 1}. ${t.titulo} (${Task.estados[t.estado]})`);
      });
    }
    return lista;
  }

  buscarTareas(palabra) {
    return this.tareas.filter((t) => t.titulo.toLowerCase().includes(palabra.toLowerCase()));
  }
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const gestor = new GestorTareas();

function menuPrincipal() {
  console.log(`
===== 📋 Menú Principal =====
1. Ver mis tareas
2. Buscar tarea
3. Agregar tarea
0. Salir
`);
  rl.question("Seleccione una opción: ", (opcion) => {
    switch (opcion.trim()) {
      case "1":
        menuVerTareas();
        break;
      case "2":
        menuBuscarTarea();
        break;
      case "3":
        menuAgregarTarea();
        break;
      case "0":
        console.log("👋 ¡Hasta luego!");
        rl.close();
        break;
      default:
        console.log("❌ Opción inválida.");
        menuPrincipal();
    }
  });
}
function menuVerTareas() {
  console.log(`
===== 📂 Ver Tareas =====
1. Todas
2. Pendientes
3. En curso
4. Terminadas
0. Volver
`);
  rl.question("Seleccione una opción: ", (opcion) => {
    let lista = [];
    switch (opcion.trim()) {
      case "1":
        lista = gestor.listarTareas();
        break;
      case "2":
        lista = gestor.listarTareas(1);
        break;
      case "3":
        lista = gestor.listarTareas(2);
        break;
      case "4":
        lista = gestor.listarTareas(3);
        break;
      case "0":
        return menuPrincipal();
      default:
        console.log("❌ Opción inválida.");
        return menuVerTareas();
    }

    if (lista && lista.length > 0) {
      rl.question("Ingrese el número de la tarea para ver detalles (0 para volver): ", (num) => {
        const i = parseInt(num) - 1;
        if (num === "0") return menuVerTareas();
        if (i >= 0 && i < lista.length) {
          const tarea = lista[i];
          tarea.mostrarDetalles();
          menuEditarTarea(tarea);
        } else {
          console.log("❌ Número inválido.");
          menuVerTareas();
        }
      });
    } else {
      menuVerTareas();
    }
  });
}
function menuEditarTarea(tarea) {
  console.log(`
===== ✏️ Editar Tarea =====
1. Cambiar estado
2. Cambiar descripción
3. Cambiar dificultad
0. Volver
`);
  rl.question("Seleccione una opción: ", (op) => {
    switch (op.trim()) {
      case "1":
        console.log(`
Seleccione nuevo estado:
1. Pendiente
2. En curso
3. Terminada
4. Cancelada
`);
        preguntarNumero("Ingrese opción (1-4): ", 1, 4, tarea.estado, (nuevoEstado) => {
          tarea.estado = nuevoEstado;
          console.log("✅ Estado actualizado con éxito.");
          menuEditarTarea(tarea);
        });
        break;
      case "2":
        rl.question("Nueva descripción: ", (desc) => {
          tarea.descripcion = desc;
          console.log("✅ Descripción actualizada.");
          menuEditarTarea(tarea);
        });
        break;
      case "3":
        console.log(`
Seleccione nueva dificultad:
1. Fácil ⭐
2. Medio ⭐⭐
3. Difícil ⭐⭐⭐
`);
        preguntarNumero("Ingrese opción (1-3): ", 1, 3, tarea.dificultad, (dif) => {
          tarea.dificultad = dif;
          console.log("✅ Dificultad actualizada.");
          menuEditarTarea(tarea);
        });
        break;
      case "0":
        menuPrincipal();
        break;
      default:
        console.log("❌ Opción inválida.");
        menuEditarTarea(tarea);
    }
  });
}
function menuBuscarTarea() {
  rl.question("Ingrese palabra clave a buscar: ", (palabra) => {
    const resultados = gestor.buscarTareas(palabra);
    if (resultados.length === 0) {
      console.log("❌ No se encontraron tareas.");
      return menuPrincipal();
    }
    resultados.forEach((t, i) => {
      console.log(`${i + 1}. ${t.titulo} (${Task.estados[t.estado]})`);
    });
    rl.question("Ingrese el número de la tarea para ver detalles (0 para volver): ", (num) => {
      const i = parseInt(num) - 1;
      if (num === "0") return menuPrincipal();
      if (i >= 0 && i < resultados.length) {
        const tarea = resultados[i];
        tarea.mostrarDetalles();
        menuEditarTarea(tarea);
      } else {
        console.log("❌ Número inválido.");
        menuBuscarTarea();
      }
    });
  });
}
function menuAgregarTarea() {
  rl.question("Título: ", (titulo) => {
    rl.question("Descripción: ", (descripcion) => {
      rl.question("Fecha de vencimiento (YYYY-MM-DD) (opcional): ", (fecha) => {
        console.log(`
Seleccione la dificultad:
1. Fácil ⭐
2. Medio ⭐⭐
3. Difícil ⭐⭐⭐
        `);
        rl.question("Ingrese opción de dificultad (1-3, por defecto 1): ", (dif) => {
          console.log(`
Seleccione el estado inicial:
1. Pendiente
2. En curso
3. Terminada
4. Cancelada
          `);
          rl.question("Ingrese opción de estado (1-4, por defecto 1): ", (estado) => {
            try {
              const tarea = new Task(
                titulo,
                descripcion,
                fecha || null,
                parseInt(dif) || 1
              );
              tarea.estado = parseInt(estado) || 1;
              gestor.agregarTarea(tarea);
              console.log("✅ Tarea agregada con éxito.");
            } catch (e) {
              console.log("❌ Error:", e.message);
            }
            menuPrincipal();
          });
        });
      });
    });
  });
}
function preguntarNumero(pregunta, min, max, defecto, callback) {
  rl.question(pregunta, (valor) => {
    let num = parseInt(valor);
    if (isNaN(num)) num = defecto;
    if (num < min || num > max) {
      console.log("❌ Valor inválido.");
      return preguntarNumero(pregunta, min, max, defecto, callback);
    }
    callback(num);
  });
}
menuPrincipal();
