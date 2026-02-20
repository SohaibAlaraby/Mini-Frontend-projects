const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const start_btn = document.getElementById("start");
const stop_btn = document.getElementById("stop");
const reset_btn = document.getElementById("reset");
const toggle = document.querySelector('.toggle');
const toggle_sun = document.querySelector('.toggle .fa-sun');
const toggle_moon = document.querySelector('.toggle .fa-moon');
const toggle_circle = document.querySelector('.toggle .toggle-circle');
/*
This var is the one way stop and start communicate
when stop is clicked var will be true and the start will stop counting down and set it false again for the next start click
*/
let stop_flag=false;
/*
This var cure the race condition => when start btn is clicked multiple time the timer is going faster and faster and this is not acceptable
*/
let timerLock = false; 
/*
This var is storing the first value to restore it when reset btn is clicked
*/
let startValInSeconds ;
let timerCounter ;
let hoursLastValue ;
let minutesLastValue;
let secondsLastValue;
function initiat(){
    startValInSeconds = (parseInt(hours.textContent) || 0) * 3600 +(parseInt(minutes.textContent) || 0)*60 +(parseInt(seconds.textContent) || 0);
    timerCounter = startValInSeconds;
    hoursLastValue = 0;
    minutesLastValue = 0;
    secondsLastValue = 0;
}
function formatAllfields(hoursContent,minutesContent,secondsContent) {
    return [hours,minutes,seconds].map(element => {

        if(element === hours){
            if(Number.isNaN(hoursContent)) {
                return String(hoursLastValue).padStart(2,'0');
            } else {
                return String(hoursContent).padStart(2,'0');
            }
        } else if(element === minutes) {
            if(Number.isNaN(minutesContent)) {
                return String(minutesLastValue).padStart(2,'0');
            } else {
                return String(minutesContent).padStart(2,'0');
            }
        } else if(element === seconds) {
            if(Number.isNaN(secondsContent)) {
                return String(secondsLastValue).padStart(2,'0');
            } else {
                return String(secondsContent).padStart(2,'0');
            }
        }
    
    });
}
function startTimer(event) {
    if(!timerLock) {
        /*
        Do not set timerLock inside the setTimout
        it is set once at the begining of the startTimer
        */
        timerLock = true;
        stop_flag = false;
        [hours,minutes,seconds].forEach((element) => element.contentEditable = "false");
        setTimeout(function ticTac() {
            if(timerCounter === -1) {
                stop_flag =true;
            }

            if(stop_flag){
                stop_flag = false;
                timerLock = false;
                [hours,minutes,seconds].forEach((element) => element.contentEditable = "true");
                return;
            }
            
            seconds.textContent = String(timerCounter % 60).padStart(2,'0');
            minutes.textContent = String(Math.floor((timerCounter % 3600)/60)).padStart(2,'0');
            hours.textContent = String(Math.floor((timerCounter / 3600))).padStart(2,'0');
            timerCounter--;
            setTimeout(ticTac,1000);
        },1000);

    }
}

function stopTimer(event) {
    if(timerLock) {
        stop_flag = true;
    }
}

function resetTimer(event) {
    //padStart to ensure that the fields are displayed using 2 digits always
    timerCounter = startValInSeconds;
    hours.textContent = String(Math.floor(startValInSeconds / 3600)).padStart(2,'0');
    minutes.textContent = String(Math.floor((startValInSeconds % 3600)/60)).padStart(2,'0');
    seconds.textContent = String(startValInSeconds % 60).padStart(2,'0');
    if(timerLock) {
        stop_flag = true;
    }


}
initiat();
[hours,minutes,seconds].forEach((element,index,arr) => {

    /*
    we only allow the numbers and the necessary sptial key to write or delete it or navigate
    */
   element.addEventListener("keydown", (event)=> {
        let allowableKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
            'Tab', 'Home', 'End'];

        if(allowableKeys.includes(event.key)) {
            return;
        }

        let isNumber = event.key >= '0' && event.key <= '9';
        /*
        if there is element is selected isTextSelected will be true ()
        */
        const isTextSelected = window.getSelection().toString().length > 0;
        /*
        this will allow the edit when the field is selected because any value will be written will delete the selected one
        after that the selection ends so we prevent any write more than 2 digits
        */
        if(isNumber) {
            if(element.textContent.length >= 2 && !isTextSelected){
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    });

    /*
    when focus on hours or minutes or seconds fields it will be selected by automatically
    Do not use document.execCommand('selectAll', false, null) as it is deprecated
    To select element use select API and Range API as addEventListener method below.
    */

    element.addEventListener("focus",(event)=>{
        /*
        we ensure that the focus event will be handled after mousedown event to prevent the last to override the selection of the first
        */
        setTimeout(() => {
            if(window.getSelection()){
            //selection object
            let selection = window.getSelection();
            //create a range ruler
            let range = document.createRange();
            //make the range ruler fit the content of the node
            range.selectNodeContents(element);
            //remove any other range or selections
            selection.removeAllRanges();
            //add this selection
            selection.addRange(range);
            hoursLastValue = parseInt(hours.textContent.trim()) || 0;
            minutesLastValue = parseInt(minutes.textContent.trim()) || 0;
            secondsLastValue = parseInt(seconds.textContent.trim()) || 0;
            
        }},0);
        
    });

    /*
    when user leave the field of hours or minutes or seconds we need to fix the miss he left behind
    1- we need to apply the carry over princible => for example if user wrote 61 in seconds field we need to show it as 01:01 not 00:61
    this code is made to handle large values with more than two digits but we strict the num of digits to be only 2 so it will be more than fine
    2- we need to reformate all field that has 1 digits or none 
    */
    element.addEventListener("blur",(event)=>{
        let hoursContent = parseInt(hours.textContent);
        let minutesContent = parseInt(minutes.textContent);
        let secondsContent = parseInt(seconds.textContent);

        if(element === seconds && secondsContent > 59) {
            let totalSeconds = hoursContent * 3600 + minutesContent * 60 + secondsContent;
            let maxSeconds = 99 * 3600 + 59 * 60 + 59;

            totalSeconds = Math.min(totalSeconds , maxSeconds);
            hoursContent = Math.floor(totalSeconds /3600);
            minutesContent = Math.floor((totalSeconds % 3600) /60);
            secondsContent = totalSeconds % 60 ;
        } else if(element === minutes && minutesContent > 59) {
            let totalMinutes = hoursContent * 60 + minutesContent;
            let maxMinutes = 99 * 60 + 59 ;

            totalMinutes = Math.min(totalMinutes , maxMinutes);
            hoursContent = Math.floor(totalMinutes /60);
            minutesContent = totalMinutes % 60;
        }

        [hoursContent,minutesContent,secondsContent] =formatAllfields(hoursContent,minutesContent,secondsContent);
        seconds.textContent = secondsContent;
        minutes.textContent = minutesContent;
        hours.textContent = hoursContent;
        [hoursContent,minutesContent,secondsContent] = [hoursContent,minutesContent,secondsContent].map(el => {
            return parseInt(el) || 0;
        });
        startValInSeconds = hoursContent * 3600 + minutesContent * 60 + secondsContent;
        let isAllFieldEditable = [hours, minutes, seconds].every((element) => element.isContentEditable);
        if(isAllFieldEditable) {
            timerCounter = startValInSeconds;
        }
    });

    element.addEventListener("paste", (event) => {
        //do not paste text
        event.preventDefault();
        //give me the data to be pasted from event or browser as text
        let pasteData = (event.clipboardData || window.clipboardData).getData('text');
        //replace any non-numeric character with nothing
        let cleanData = pasteData.replace(/\D/g,'');
        if(cleanData.length > 0) {
            //only numbers remains take only the first 2 digits
            let finalData = cleanData.slice(0,2);
            //give me selection object to take some infos about cursor position and number of ranges and selected text
            let selection = window.getSelection();
            //how many ranges? nothing! go out 
            if(!selection.rangeCount) return;
            //delete the selected/hightlighted text from document
            selection.deleteFromDocument();
            //create text node and put the data in it
            let textNode = document.createTextNode(finalData);
            //insert this node in the first range
            selection.getRangeAt(0).insertNode(textNode);
            //finally put the cursor in the end of the content
            selection.collapseToEnd();
            
        }

    })
});
function handleLightDarkMode() {
    toggle.classList.toggle("toggle-dark");
    document.body.classList.toggle("body-dark");
    
}
start_btn.addEventListener('click', startTimer);
stop_btn.addEventListener('click',stopTimer);
reset_btn.addEventListener('click',resetTimer);
toggle.addEventListener('click',handleLightDarkMode);
/*
focus event => fire when you focus on element by clicking on it or use Tab to reach it 
blur event => fire when element lose focus

*/
