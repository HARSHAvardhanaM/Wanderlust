
const likeBtn = document.getElementById("likeBtn");
const id = listing._id;
if(userNow.liked.includes(id)){
    likeBtn.classList.add("red");     
}
likeBtn.addEventListener("click",async()=>{
    if(!likeBtn.classList.contains("red")){
        let have1 = userNow.liked.includes(id)
        likeBtn.classList.add("red");
        userNow.liked.push(listing._id);
        if(have1){
            userNow.liked.pop();
        }
        console.log(userNow.liked)
    }
    else if(likeBtn.classList.contains("red")){
        const id = listing._id;
        likeBtn.classList.remove("red");
        const liked = [...userNow.liked];
        let update = liked.filter((ele)=>ele != id);
        userNow.liked = [];
        userNow.liked =[...update];
        console.log(userNow.liked)
    }
    
});