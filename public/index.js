import { createNavigator } from "./navigator.js";
import { login } from "./login.js"
import { scriptTodo } from "./scriptTodo.js";
import { createPubSub } from "./puSUB.js"
import { generatePublic } from "./public.js"

const pubsub = createPubSub();
const navigator = createNavigator(document.querySelector("#container"));

const todo = scriptTodo(undefined, pubsub);
const _public = generatePublic(document.querySelector("#crs"), pubsub);
login(undefined, pubsub).then(async () => {

    _public.build();
    await todo.load();
    
    _public.render();
    
    const errorMessage = document.getElementById('error-message');
    
    insertButton.onclick = () => {
        const caroselloName = caroselloInput.value.trim();
        if (caroselloName === '') {
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }
    
        const carosello = {
            name: caroselloName,
            completed: false
        };
    
        todo.send({ carosello: carosello })
            .then(() => todo.load())
            .then((json) => {
                todo.setCarosellos(json.carosellos);
                caroselloInput.value = "";
                render();
            });
    };
    
    todo.load().then((json) => {
        todo.setCarosellos(json.carosellos);
        todo.render();
    });
    
    
    setInterval(() => {
        todo.load().then((json) => {
            todo.setCarosellos(json.carosellos);
            //caroselloInput.value = "";
            todo.render();
        });
    }, 30000);
    
    
    (async () => {
        const inputFile = document.querySelector('#file'); // c'è
        const button = document.querySelector("#insertButton"); // c'è
        const link = document.querySelector("#link"); //c'è
        const fileListContainer = document.querySelector("#caroselloList"); // c'è
    
        const loadFileList = async () => {
            const res = await fetch("/carosello");
            const files = await res.json();
            todo.render()
        }
    
        const handleSubmit = async (event) => {
            const formData = new FormData();
            formData.append("file", inputFile.files[0]);
            const body = formData;
            try {
              
                await todo.send(body)
                loadFileList();
    
    
    
            } catch (e) {
                console.log(e);
            }
        }
    
        button.onclick = handleSubmit;
        loadFileList();
    })();
    
});
