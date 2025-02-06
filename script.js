console.log("let's start");
 URL="/songs/"
 let currentAudio;
 let beat_svg;
 let btn_svg;
 let click_card;
 let card_icon;
 let card_bg;
 let previous_card;
 let marquee;
 let curtop;
let play_btn=document.querySelector(".playbar-btn").getElementsByTagName("span")[0];
let volume=document.querySelector(".range");
let songs;
let content=document.querySelector(".content");
//adding  event listener to window load 

window.addEventListener("load",()=>{
   document.querySelector(".range").value=100;
});



async function getsongs(folder){
    let song= await fetch(`${URL}${folder}`);
    let res= await song.text();
    let div=document.createElement("div");
    div.innerHTML=res;
    let a=div.getElementsByTagName("a");
    
     songs=[];
    for(let i=0; i<a.length;i++){
       const element=a[i];
       if(element.href.endsWith(".mp3")){
        songs.push(element.href);
       }
    }
    
    let images= await getSongImages(folder);
    let song_listUL=document.querySelector(".song-list").getElementsByTagName("ul")[0];
    song_listUL.innerHTML="";
    for(let item of songs){
       let track=item;
       let r_song= item.replaceAll("%20"," ").replace(".mp3","").split(`/${folder}/`)[1];
       let song=r_song.split("-");
       console.log(r_song)
       song_listUL.innerHTML=song_listUL.innerHTML+`<li>
       <span class="music_beats"><img class="beats" src="svgs/music-beats.svg" alt=""></span>
                <span class="song-btn"><img class="play"  src="svgs/play-button.svg" alt="play-btn">
                <a href="${track}"></a>
                </span>
                
                <img class="song-img" src="${images[r_song]}" alt="" />
                <div class="song-detail">
                  <h3 class="style-h3">${song[0]}</h3>
                  <p class="style-p">${song[1]}</p>
                </div>
              </li>`
   }
   let  f_song=document.querySelector(".song-list").getElementsByTagName("div")[0];
   displaysong(f_song);  

   currentAudio = new Audio(songs[0]);
   currentAudio.addEventListener("timeupdate", updateTime);
   currentAudio.addEventListener("loadedmetadata", updateTime);
   let e=document.querySelector(`a[href="${currentAudio.src}"]`).parentNode.parentNode;
   beat_svg = await e.querySelector(".music_beats");
   btn_svg = await e.querySelector(".song-btn");
   

   
//Attach event listener to each song

 Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(  e=>{
   e.querySelector(".song-btn").addEventListener("click",async()=>{
        let audio= e.getElementsByTagName("a")[0];
        playmusic(audio.href);
       });   
    }); 
  return songs;
}

//music playing function

async function playmusic(element){
   if(currentAudio){
      currentAudio.pause();
   }
   let a=document.querySelector(`a[href="${element}"]`);
      let e= a.parentNode.parentNode;
     
      if(beat_svg || btn_svg ){
         svg_ff();
      }
      beat_svg = e.querySelector(".music_beats");
      btn_svg = e.querySelector(".song-btn");
      svg_on();
      let song =e.getElementsByTagName("div")[0];
      displaysong(song);

      currentAudio=new Audio(element);
      currentAudio.addEventListener("timeupdate", updateTime);
      currentAudio.play();
      
      let curfolder=currentAudio.src.split("/songs/").slice(1)[0].split("/").slice(0)[0];
        let card= document.querySelector(`[data-folder="${curfolder}"]`);
      
        click_card= await card.querySelector(".click-card");
        card_icon= await card.querySelector(".card-icon");
        card_bg=card;
        if(click_card.style.opacity==0){
           
           card_style_off(click_card,card_icon,card_bg);
        }
      card_icon.getElementsByTagName("img")[0].src="svgs/pause.svg"; 
      play_btn.getElementsByTagName("img")[0].src="svgs/pause.svg";
      updateCards(card,e);
      currentAudio.volume=volume.value/100;
     
}

// music time update function

function updateTime(){
   document.querySelector(".song-time").innerHTML=`${formatTime(currentAudio.currentTime)}/${formatTime(currentAudio.duration)}`; 
   document.querySelector(".circle").style.left=(currentAudio.currentTime/currentAudio.duration)*89 + "%";
   document.querySelector(".progress").style.left=(currentAudio.currentTime/currentAudio.duration)*100 + "%";
   if(currentAudio.currentTime===currentAudio.duration){
      let a=document.querySelector(`a[href="${currentAudio.src}"]`);
      let curfolder=currentAudio.src.split("/songs/").slice(1)[0].split("/").slice(0)[0];
      let card= document.querySelector(`[data-folder="${curfolder}"]`);
      card_icon=  card.querySelector(".card-icon");
      let e= a.parentNode.parentNode;
      beat_svg = e.querySelector(".music_beats");
      btn_svg = e.querySelector(".song-btn");
      svg_ff();
      play_btn.getElementsByTagName("img")[0].src="svgs/play-button.svg";
      card_icon.getElementsByTagName("img")[0].src="svgs/play-button.svg"; 
   }
   
}

// song name and artist in playbar
function displaysong(song){
   let song_info=document.querySelector(".song-info");
   song_info.innerHTML=`<h3 class="style-h3">${song.getElementsByTagName("h3")[0].innerHTML}</h3>-<p class="style-p">${song.getElementsByTagName("p")[0].innerHTML}</p> `;
   
}

// music beat and play button on
function svg_on(){
   beat_svg.style.opacity = 1;
   btn_svg.style.opacity = 0;
}
// music beat and play button on
function svg_ff(){
   beat_svg.style.opacity=0;
   btn_svg.style.opacity=1;
}

//seconds to minute:second converter
function formatTime(seconds) {
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedMinutes = minutes.toString().padStart(2, '0');
   const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds}`;
}

//song image fetching
async function getSongImages(folder){
   let image= await fetch(`${URL}${folder}/image.json`);
   let res= await image.json();
   return res;
}

//card style on
function card_style_on(click_card,card_icon,card_bg){
   click_card.style.opacity=0;
   card_bg.style.backgroundColor='';
   card_icon.getElementsByTagName("img")[0].src="svgs/play-button.svg";
   card_icon.classList.remove("x");
}

//card style off
function card_style_off(click_card,card_icon,card_bg){
   click_card.style.opacity=1;
   card_bg.style.backgroundColor='#202020';
   card_icon.getElementsByTagName("img")[0].src="svgs/pause.svg";
   card_icon.classList.add("x");
}

// song pause
function song_pause(){
   currentAudio.pause();
   play_btn.getElementsByTagName("img")[0].src="svgs/play-button.svg";
   svg_ff();
   card_icon.getElementsByTagName("img")[0].src="svgs/play-button.svg"; 
};

// song play
function song_play(){
   currentAudio.play();
   play_btn.getElementsByTagName("img")[0].src="svgs/pause.svg";
   svg_on();
   card_icon.getElementsByTagName("img")[0].src="svgs/pause.svg"; 
}


 //displaying Albums
 async function displayAlbums(){
   let album= await fetch(URL);
   let res= await album.text();
   let div=document.createElement("div");
    div.innerHTML=res;
    let a=div.getElementsByTagName("a");
    let array=Array.from(a);
   for(let i=0; i<array.length;i++){
      const element=array[i];
      if(element.href.includes("songs/")){
      let folder=(element.href);
      let album= await fetch(`${folder}/info.json`);
      let res= await album.json();
      content.innerHTML= content.innerHTML+`<div data-folder=${res.title} class="card">
               <span class="click-card"></span>
               <div class="marquee" ></div>
               <span class="play-btn card-icon">
                <img class="icon-p" src="svgs/play-button.svg" alt="play button" />
              </span>
              <img
                class="card-img"
                src="${res.src}"
                alt="Viral Hits"
              />
              <h3>${res.title}</h3>
              <p class="descript">${res.description}</p>
            </div>`
      }
   }
   
//getting songs from source (card)
   Array.from(document.querySelectorAll(".card")).forEach((e)=>{
      e.addEventListener("click",async item=>{
         
         let curfolder=currentAudio.src.split("/songs/").slice(1)[0].split("/").slice(0)[0];
         let folder=item.currentTarget.dataset.folder;
         
         if(click_card || card_icon || card_bg ){
         card_style_on(click_card,card_icon,card_bg);
         }
         click_card= await e.querySelector(".click-card");
         card_icon= await e.querySelector(".card-icon");
         card_bg=e;
         card_style_off(click_card,card_icon,card_bg);

         if(curfolder!=folder){

           let adrs=currentAudio.src.slice(0,currentAudio.src.lastIndexOf('/'));
            let album= await fetch(`${adrs}/info.json`);
            let res= await album.json();
            
            if(previous_card || marquee){
               previous_card.src=res.src;
               marquee.style.opacity=0;
               
            }
           
            if(currentAudio){
               currentAudio.pause();
            }
           await getsongs(folder);
           
           playmusic(songs[0]);
         }else if(currentAudio.paused) {
            song_play();
         }
         
       else{
         song_pause();
      }

      let b=document.querySelector(`a[href="${currentAudio.src}"]`).parentNode.parentNode;
      updateCards(e,b);
   })
   
   })
 }

//main function

async function main(){
     await getsongs("Ambient");
    
    displayAlbums();

    //Attach event listener to playbar buttons

    play_btn.addEventListener("click",async()=>{
      currentAudio.volume=volume.value/100;
      let curfolder=currentAudio.src.split("/songs/").slice(1)[0].split("/").slice(0)[0];
      let a=document.querySelector(`a[href="${currentAudio.src}"]`).parentNode.parentNode;
      let e= document.querySelector(`[data-folder="${curfolder}"]`);
      
      click_card= await e.querySelector(".click-card");
         card_icon= await e.querySelector(".card-icon");
         card_bg=e;
         if(click_card.style.opacity==0){
            updateCards(e,a);
            card_style_off(click_card,card_icon,card_bg);
         }
         
   if(currentAudio.paused){
      song_play();
   }
   else{
      song_pause();
   }
})

//adding listener to seekbar
document.querySelector(".seekbar").addEventListener("click",async e=>{
   let progress= e.offsetX/e.target.getBoundingClientRect().width;
   document.querySelector(".circle").style.left=progress*89 +"%";
   currentAudio.currentTime= currentAudio.duration*progress;
   let curfolder=currentAudio.src.split("/songs/").slice(1)[0].split("/").slice(0)[0];
   let card= document.querySelector(`[data-folder="${curfolder}"]`);
   if(e.offsetX!=e.target.getBoundingClientRect().width){
      currentAudio.play();
      play_btn.getElementsByTagName("img")[0].src="svgs/pause.svg";
      let a=document.querySelector(`a[href="${currentAudio.src}"]`).parentNode.parentNode;
      beat_svg = await a.querySelector(".music_beats");
      btn_svg = await a.querySelector(".song-btn");
      svg_on();
      click_card= await card.querySelector(".click-card");
      card_icon= await card.querySelector(".card-icon");
      card_bg=card;
      card_icon.getElementsByTagName("img")[0].src="svgs/pause.svg";
      if(click_card.style.opacity==0){
         updateCards(card,a);
         card_style_off(click_card,card_icon,card_bg);
      }
      
   }

})

//adding listener to previous
 document.querySelector(".previous").addEventListener("click",()=>{
   let index=songs.indexOf(currentAudio.src);
   if(index-1<0){
      playmusic(songs[songs.length-1]);
   }else{
      playmusic(songs[index-1]);
   }
   
 });
 
//adding listener to next
document.querySelector(".next").addEventListener("click",()=>{
   let index=songs.indexOf(currentAudio.src);
   if(index+1==songs.length){
      playmusic(songs[0]);
   }else{
      playmusic(songs[index+1]);
   }
   
 });
 
 //adding listener to volume

 volume.addEventListener("change",(e)=>{
   currentAudio.volume = e.target.value/100;
   let volume_icon=document.querySelector(".volume-icon");
   if(currentAudio.volume>0.5){
      volume_icon.src="svgs/highvolume.svg";
   }else if (currentAudio.volume<0.5 && currentAudio.volume>0 ){
      volume_icon.src="svgs/midvolume.svg";
   }else {
      volume_icon.src="svgs/zerovolume.svg";
   }
 })

 //Adding listener to humberger
 document.querySelector(".hamburger").addEventListener("click",()=>{
   
  document.querySelector(".left").style.left='0%';
 })
  //Adding listener to cross
  document.querySelector(".cross").addEventListener("click",()=>{
   
   document.querySelector(".left").style.left='-100%';
  })

}
main();

function updateCards(card,song){
   let a=song.querySelector(".song-img").src;
   let song_name=song.querySelector(".song-detail").getElementsByTagName("h3")[0].innerHTML;
   let song_art=song.querySelector(".song-detail").getElementsByTagName("p")[0].innerHTML;
   previous_card= card.querySelector(".card-img");
         previous_card.src=a;
         marquee=card.querySelector(".marquee");
         marquee.innerHTML= `<div class="mark"><div class="name">${song_name}</div><div id="space"> -</div> <div class="art">${song_art}</div></div>`;
         marquee.style.opacity=1;
}


