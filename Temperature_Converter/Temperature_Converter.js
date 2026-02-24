const CelsiusInput = document.getElementById("celsius-input");
const FahrenheitInput = document.getElementById("Fahrenheit-input");
const KelvinInput = document.getElementById("Kelvin-input");
function Temperature_Converter(event) {
    let value = parseFloat(event.target.value);
    let id = event.target.id;
    if(Number.isNaN(value)){
        CelsiusInput.value = "";
        FahrenheitInput.value = "";
        KelvinInput.value = "";
        return;
    }
    if(id === "celsius-input") {
        FahrenheitInput.value = (value * 1.8 + 32).toFixed(2);
        KelvinInput.value = (value + 273.15).toFixed(2);

    } else if(id === "Fahrenheit-input"){
        CelsiusInput.value = ((value - 32) / 1.8).toFixed(2);
        KelvinInput.value = (((value - 32) / 1.8) + 273.15).toFixed(2);

    } else if(id === "Kelvin-input") {
        FahrenheitInput.value = ((value - 273.15) * 1.8 + 32).toFixed(2);
        CelsiusInput.value = (value - 273.15).toFixed(2);
    }
    }

[CelsiusInput, FahrenheitInput, KelvinInput].forEach(
    (element) => {
       element.addEventListener("input", Temperature_Converter); 
    }
);

