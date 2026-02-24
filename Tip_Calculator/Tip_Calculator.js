function calculateTip(BillInput,TipInput){
    if(BillInput.value === undefined) return 0.00;
    let billAmount = Number(BillInput.value);
    if(TipInput.value === undefined) return billAmount;
    let tipPercentage = Number(TipInput.value);
    let total = billAmount + ((tipPercentage/100)*billAmount);
    return total.toFixed(2);
}
function showResultToUser(event){
    event.preventDefault();
    let BillInput = document.getElementById("bill_amount");
    let TipInput = document.getElementById("tip_percentage");
    let container = document.getElementsByClassName("container")[0];
    let finalResult = calculateTip(BillInput,TipInput);
    let displayedResult = document.querySelector(".container p#displayResult");
    displayedResult.innerHTML = `Total: <strong>${finalResult}</strong>`;

}


let caculateButton = document.getElementById("calc-btn");
caculateButton.addEventListener("click",  showResultToUser);

