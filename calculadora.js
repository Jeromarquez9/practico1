const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ingrese el primer número: ", (num1) => {
  rl.question("Ingrese la operación (+, -, *, /): ", (operador) => {
    rl.question("Ingrese el segundo número: ", (num2) => {
      
      let numero1 = parseFloat(num1);
      let numero2 = parseFloat(num2);
      let resultado;

      switch (operador) {
        case "+":
          resultado = numero1 + numero2;
          break;
        case "-":
          resultado = numero1 - numero2;
          break;
        case "*":
          resultado = numero1 * numero2;
          break;
        case "/":
          if (numero2 !== 0) {
            resultado = numero1 / numero2;
          } else {
            resultado = "Error: no se puede dividir por 0.";
          }
          break;
        default:
          resultado = "Usa +, -, * o /.";
      }

      console.log("Resultado:", resultado);
      rl.close();
    });
  });
});
