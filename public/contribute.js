const form = document.getElementById("eventForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const title = document.getElementById("title").value;
const location = document.getElementById("location").value;
const description = document.getElementById("description").value;

const res = await fetch("/post-event",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
location,
description
})

});

if(res.status === 401){

alert("Please login first");

window.location = "signin.html";

return;

}

form.reset();

loadEvents();

});

async function loadEvents(){

const res = await fetch("/events");

const events = await res.json();

const container = document.getElementById("events");

container.innerHTML="";

events.reverse().forEach(event=>{

const div = document.createElement("div");

div.className = "event-card";

div.innerHTML = `

<h3>${event.title}</h3>

<p>${event.description}</p>

<div class="location">📍 ${event.location}</div>

<div class="user">Posted by: ${event.createdBy?.name || "User"}</div>

`;

container.appendChild(div);

});

}
fetch("/check-auth")
.then(res => res.json())
.then(data => {
    const authLink = document.getElementById("authLink");
    const userSection = document.getElementById("userSection");

    if (data.loggedIn) {
        authLink.style.display = "none";
        userSection.style.display = "inline-block";
    } else {
        authLink.style.display = "inline-block";
        userSection.style.display = "none";
    }
});

loadEvents();