//reference: https://javascript.plainenglish.io/implement-localstorage-with-expiry-time-a2af662f7705
function loadjQuery() {
    return new Promise((resolve, reject) => {
        if (window.jQuery) {
            resolve(window.jQuery);
        } else {
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
            script.onload = () => resolve(window.jQuery);
            script.onerror = () => reject(new Error('jQuery yüklenemedi'));
            document.head.appendChild(script);
        }
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
        const getData =async()=> {
             const users= customLocalStorage.getItem("ins-api-users");
             if (users &&users.length > 0){
                 console.log("from cache")
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
             console.log(users)
     
             const html = users.map((users) => {
                 return `
                 <div class="card" data-id="${users.id}">
                 <div class="card-body">
                   <h5 class="card-title">${users.name}</h5>
                   <p class="card-text">${users.email}</p>
                   <p class="card-text">${users.address.city}, ${users.address.street} , ${users.address.suite}</p>
                  <button class="delete-btn" type="button"><i class="fas fa-trash"></i></button>
                 </div>
                 </div>
                 `
             }).join("");
             
             $(".ins-api-users").html(html);
     
             $(".delete-btn").click(async function () {
                 const card = $(this).closest(".card");
                 const userId = card.find(".card-title").text();
                 const users=customLocalStorage.getItem("ins-api-users");
                 const updatedUsers = users.filter((user) => user.name !== userId);
                 
                 customLocalStorage.setItem("ins-api-users", updatedUsers);
                 
                 card.remove();
                 
                // refresh the data if there is no user left
                 if (updatedUsers.length === 0) {
                     await displayUsers();
                 }
             });
         }
     
     
         const style = `
         .card {
             margin: 10px;
             border: 1px solid #ddd;
             border-radius: 8px;
             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
             transition: transform 0.2s;
         }
     
         .card:hover {
             transform: translateY(-5px);
             box-shadow: 0 4px 8px rgba(0,0,0,0.2);
         }
     
         .card-body {
             padding: 20px;
             position: relative;
         }
     
         .card-title {
             color: #333;
             font-size: 1.25rem;
             margin-bottom: 10px;
         }
     
         .card-text {
             color: #666;
             margin-bottom: 8px;
         }
     
         .ins-api-users {
             display: grid;
             grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
             gap: 20px;
             padding: 20px;
             max-width: 1200px;
             margin: 0 auto;
         }
         .delete-btn {
             background: none;
             border: none;
             color: #dc3545;
             cursor: pointer;
             padding: 8px;
             transition: color 0.3s;
             position: absolute;
             top: 10px;
             right: 10px;
         }
         
         .delete-btn:hover {
             color: #c82333;
         }
         
         .delete-btn i {
             font-size: 1.2rem;
         }
         `;
     
         $('<style>').text(style).appendTo('head');
     
      
         // $(".retrieveAllUser").click(()=>{
         //     displayUsers();
         // })
     
           displayUsers()
     
           
     })
        


}).catch(error => {
    console.error('Hata:', error);
});

