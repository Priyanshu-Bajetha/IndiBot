// import bot from "./assets/bot.svg";
// import user from "./assets/user.svg";

// const form = document.querySelector("form");
// const chatContainer = document.querySelector("#chat_container");

// let loadInterval;

// //application k loading k liye functon jbtak ans generate hoga  har 300 milli second m kuc load krane k lie, and condition daldi ki jb . reach hojae toh
// function loader(element) {
//   element.textContent = "";

//   loadInterval = setInterval(() => {
//     element.textContent += ".";

//     if (element.textContext === "....") {
//       element.textContent = "";
//     }
//   }, 300);
// }

// // jab answer load krta h api toh letter by letter type krke krta h so uske lie function user xp acha lagta isse

// function typeText(element, text) {
//   let index = 0;

//   let interval = setInterval(() => {
//     if (index < text.length) {
//       element.innerHTML += text.charAt(index); //character ko return krega specific index jo ai return krega
//       index++;
//     } else {
//       clearInterval(interval);
//     }
//   }, 20);
// }

// //unique id  for every single message  to map over them

// function generateUniqueId() {
//   const timestamp = Date.now();
//   const randomNumber = Math.random();
//   const hexadecimalString = randomNumber.toString(16); //for 16 charcters

//   return `id-${timestamp}-${hexadecimalString}`;
// }

// //function for chat stripe , taki diff dike user vs ai response ka

// function chatStripe(isAi, value, uniqueId) {
//   return (
//     //using template strings to create spaces  normal '' string se spaces ni ate
//     `
//     <div class="wrapper ${isAi && "ai"}">
//       <div class="chat">
//         <div class="profile>
//           <img>
//             src="${isAi ? bot : user}"
//             alt="${isAi ? "bot" : "user"}"
//           </>
//         </div>
//         <div class="message" id=${uniqueId}>${value}</div>
//       </div>
//     </div>
//     `
//   );
// }

// //trigger to get the AI generated response

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const data = new FormData(form);

//   //user's chatstripe to add
//   chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

//   form.reset(); //to clear the form

//   //Bots Stripe
//   const uniqueId = generateUniqueId();
//   chatContainer.innerHTML += chatStripe(true, "", uniqueId);

//   chatContainer.scrollTop = chatContainer.scrollHeight;

//   //fetch newly created div
//   const messageDiv = document.getElementById(uniqueId);

//   // turning on the loader
//   loader(messageDiv);

//   //fetch data from server -> bots response

//   const response = await fetch('http://localhost:5000', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ prompt: data.get("prompt")
//    })
//   })

//   clearInterval(loadInterval);
//   messageDiv.innerHTML = "";

//   if (response.ok) {
//     const data = await response.json();
//     const parsedData = data.bot.trim(); //trims any trailing spaces and \n'
//     typeText(messageDiv, parsedData);
//   } else {
//     const err = await response.text();
//     messageDiv.innerHTML = "Something Went Wrong";

//     alert(err);
//   }
// };

// //handle submit ko load krne k lye..
// form.addEventListener("submit", handleSubmit);
// form.addEventListener("keyup", (e) => {
//   if (e.keyCode === 13) {
//     //this is the enter key
//     handleSubmit(e);
//   }
// })



import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})