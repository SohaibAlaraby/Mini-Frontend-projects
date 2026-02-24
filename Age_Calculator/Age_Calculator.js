const birthDateInput = document.getElementById("date");
const calculatorbtn = document.getElementById("cal-age-btn");
const finalMessage = document.getElementById("final-message");

function calculateAge(event) {
    if(!birthDateInput.value) return;
    let value = birthDateInput.value;
    let birthDate = new Date(value);
    let todayDate = new Date();
    if(birthDate > todayDate){ 
        finalMessage.innerHTML=`You will be born soon😂`
        return;
    }
    let years = todayDate.getFullYear() - birthDate.getFullYear();
    let months = todayDate.getMonth() - birthDate.getMonth();
    let days = todayDate.getDate() -birthDate.getDate();
    /*
    1- todayDate month < birthDate month => months < 0 => years-- && months += 12;
    2- todayDate month = birthDate month => months = 0
        2.1- todayDate month = birthDate month => months = 0 and todayDate.getDate() < birthDate.getDate() => before its birthday => years-- && months += 12;
        2.2- todayDate month = birthDate month => months = 0 and todayDate.getDate() > birthDate.getDate() => after its birthday => continue;
    3- years < 1 
        3.1- todayDate.getDate() < birthDate.getDate() => before birthday => months-- days+nof days last months;
        3.2- todayDate.getDate() > birthDate.getDate() => after birthday => continue ;
    */
   if(months < 0 || months == 0 && days < 0){
        years--;
        months += 12;
   }

   if(days < 0) {
    months--;
    let lastDayOfLastMonth = new Date(todayDate.getFullYear(),todayDate.getMonth(), 0).getDate();
    days += lastDayOfLastMonth;
   }
   finalMessage.innerHTML=`Your Age is <strong>${years}</strong> years <strong>${months}</strong> months <strong>${days}</strong> days`;

}

calculatorbtn.addEventListener("click", calculateAge);
