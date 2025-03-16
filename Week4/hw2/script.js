//reference: https://javascript.plainenglish.io/implement-localstorage-with-expiry-time-a2af662f7705
(function() {
    if (!document.querySelector('.ins-api-users')) {
        console.error('Required div with class "ins-api-users" not found');
        return;
    }
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
function loadjQuery() {
    return new Promise((resolve, reject) => {
        if (window.jQuery) {
          
            resolve(window.jQuery);
            console.log(window.jQuery)
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        script.integrity = 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => resolve(window.jQuery);
        script.onerror = () => {
            reject(new Error('Failed to load jQuery'));
            document.head.removeChild(script);
        };
        document.body.appendChild(script);
    });
}

window.customLocalStorage=
{
    getItem(key)
    {
        // getting the data from localStorage using the key
        let result=JSON.parse(window.localStorage.getItem(key));

        if(result)
        {
            /*
                if data expireTime is less then current time
                means item has expired,
                in this case removing the item using the key
                and return the null.
            */
            if(result.expireTime<=Date.now())
            {
                window.localStorage.removeItem(key);
                return null;
            }
            // else return the data.
            return result.data;
        }
        //if there is no data provided the key, return null.
        return null;
    },

    /*
        accepting the key, value and expiry time as a parameter
        default expiry time is 1 days in milliseconds.
    */
    setItem(key, value, maxAge=24*60*60*1000)
    {
        // Storing the value in object.
        let result=
        {
            data:value
        }

        if(maxAge)
        {
            /*
                setting the expireTime currentTime + expiry Time 
                provided when method was called.
            */
            result.expireTime=Date.now()+maxAge;
        }
        window.localStorage.setItem(key,JSON.stringify(result));
    },
    removeItem(key)
    {
        window.localStorage.removeItem(key);
    },
    clear()
    {
        window.localStorage.clear();
    }
}
loadjQuery()
.then(()=>{
    $(()=>{
        const addObserver=()=>{
            const observer = new MutationObserver((event) => {
                console.log(event[0].target)
                        const cardsContainer = event[0].target
                        if (cardsContainer && cardsContainer.children.length === 0) {
                            showRetrieveButton();
                            console.log("buradayiz")
                        }
            });
            observer.observe(document.querySelector('.cards-container'), {
                childList: true,   
            }); }

        const showRetrieveButton = () => {
            $(".ins-api-users").html(`
                <h1 class="user-list-header">User List</h1>
                <div class="buttons">
                <button class="btn retrieveAllUser" type="button">Retrieve all users</button>
                <button class="btn resetSessionStorage" type="button">Reset session storage</button>
                </div>           `);
           
           const retrieveButton = $(".retrieveAllUser");
           if (sessionStorage.getItem('retrieveButtonUsed')) {
               retrieveButton.prop('disabled', true);
               retrieveButton.css({
                   'opacity': '0.5',
                   'cursor': 'not-allowed'
               });
               retrieveButton.attr('title', 'This button can only be used once per session');
           }
            
            $(".retrieveAllUser").click(() => {
                sessionStorage.setItem('retrieveButtonUsed', 'true');

                customLocalStorage.removeItem("ins-api-users");
                displayUsers();
            });
            $(".resetSessionStorage").click(() => {
                sessionStorage.removeItem('retrieveButtonUsed');
                const retrieveButton = $(".retrieveAllUser");
                retrieveButton.prop('disabled', false);
                retrieveButton.css({
                    'opacity': '1',
                    'cursor': 'pointer'
                });
                retrieveButton.removeAttr('title');
            });
        };

        const getData =async()=> {
             const users= customLocalStorage.getItem("ins-api-users");
             if (users){
                 return users;
             }else{
             const url = " https://jsonplaceholder.typicode.com/users";
             try {
               const response = await fetch(url);
               if (!response.ok) {
                 throw new Error(`Response status: ${response.status}`);
               }
               const json = await response.json();
               // setted default expiry time 1 day.
               customLocalStorage.setItem("ins-api-users",json);
               return json;
             } catch (error) {
               console.error(error.message);
             }
           }
         }
     
         const displayUsers = async () => {
            const users = await getData();
            if (!users || users.length === 0) {
               showRetrieveButton();
               return;
           }
            const html = `
               <h1 class="user-list-header">User List</h1>
               <div class="cards-container">
                   ${users.map((users) => {
                       return `
                       <div class="card" data-id="${users.id}">
                           <div class="card-body">
                               <h5 class="card-title">${users.name}</h5>
                               <p class="card-text">${users.email}</p>
                               <p class="card-text">${users.address.city}, ${users.address.street}, ${users.address.suite}</p>
                               <button class="delete-btn" type="button"><i class="fas fa-trash"></i></button>
                               
                           </div>
                       </div>
                       `
                   }).join("")}
               </div>`;
            
            $(".ins-api-users").html(html);
            addObserver()
     
             $(".delete-btn").click(async function () {
                 const card = $(this).closest(".card");
                 const userId = card.find(".card-title").text();
                 const users=customLocalStorage.getItem("ins-api-users");
                 const updatedUsers = users.filter((user) => user.name !== userId);

                 customLocalStorage.setItem("ins-api-users", updatedUsers);
                 card.remove();


             });
         }
         const style = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Nunito", sans-serif;
            }

           .ins-api-users {
               padding: 20px;
               max-width: 1400px;
               margin: 0 auto;
               background: #f0f2f5;
               min-height: 100vh;
           }

           .cards-container {
               display: grid;
               grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
               gap: 25px;
               padding: 10px;
               margin-bottom: 20px;
           }
  
             .user-list-header {
                 text-align: center;
                 color: #1a365d;
                 font-size: 2.5rem;
                 margin-bottom: 40px;
                 font-weight: 700;
                 text-transform: uppercase;
                 letter-spacing: 1px;
             }
  
             .cards-container {
                 display: grid;
                 grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                 gap: 25px;
                 padding: 10px;
                  margin-bottom: 20px;
             }
  
             .card {
                 border-radius: 20px;
                 background: white;
                 box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                 transition: all 0.3s ease;
                 position: relative;
                 border: 1px solid rgba(255, 255, 255, 0.2);
             }
  
             .card:hover {
                 transform: translateY(-10px);
                 box-shadow: 0 20px 40px rgba(0,0,0,0.1);
             }
  
             .card-body {
                 padding: 30px;
                 position: relative;
                 background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95));
             }
  
             .card-title {
                 color: #2d3748;
                 font-size: 1.5rem;
                 font-weight: 700;
                 margin-bottom: 20px;
                 letter-spacing: -0.5px;
             }
  
             .card-text {
                 color: #4a5568;
                 margin-bottom: 15px;
                 font-size: 1rem;
                 line-height: 1.6;
             }
  
             .delete-btn {
                 background: none;
                 border: none;
                 color: #e53e3e;
                 cursor: pointer;
                 padding: 12px;
                 transition: all 0.3s ease;
                 position: absolute;
                 top: 15px;
                 right: 15px;
                 border-radius: 50%;
                 width: 45px;
                 height: 45px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 background-color: rgba(229, 62, 62, 0.1);
                 z-index: 2;
             }
  
             .delete-btn:hover {
                 color: #fff;
                 background-color: #e53e3e;
                 transform: rotate(90deg);
             }
  
             .delete-btn i {
                 font-size: 1.2rem;
             }
  
             .btn {
                padding: 15px 30px;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 18px;
                margin: 30px 30px;
                display: block;
                transition: all 0.3s ease;
            }
             .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }
            
             .buttons{
             display:flex;
             justify-content: center;

             }

            .retrieveAllUser {
                background: linear-gradient(135deg, #3182ce, #2c5282);
                box-shadow: 0 4px 6px rgba(49, 130, 206, 0.25);
            }
                 .retrieveAllUser:disabled {
                background: linear-gradient(135deg, #3182ce, #2c5282);
                transform: none;
                box-shadow: 0 4px 6px rgba(49, 130, 206, 0.25);
            }
  
            .retrieveAllUser:hover {
                background: linear-gradient(135deg, #2c5282, #1a365d);
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(49, 130, 206, 0.3);
            }
  
            .retrieveAllUser:disabled:hover {
                background: linear-gradient(135deg, #3182ce, #2c5282);
                transform: none;
                box-shadow: 0 4px 6px rgba(49, 130, 206, 0.25);
            }

            .resetSessionStorage {
                background: linear-gradient(135deg, #e53e3e, #c53030);
                box-shadow: 0 4px 6px rgba(229, 62, 62, 0.25);
            }

            .resetSessionStorage:hover {
                background: linear-gradient(135deg, #c53030, #9b2c2c);
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(229, 62, 62, 0.3);
            }
         `;
     
         $('<style>').text(style).appendTo('head');
           displayUsers()
          
     })
}).catch(error => {
    console.error('Error:', error);
});

})();