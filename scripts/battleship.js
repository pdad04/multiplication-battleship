const opponentLocations = {
    acc: [],
    bs: [],
    sub:[],
    des:[],
    patrol:[],
  }
  
  const opponentGrid = document.getElementById('opponent');
  const equation = document.getElementById('equation');
  const form = document.getElementById('user-input');
  let bsSunk = document.getElementById('bs');
  let accSunk = document.getElementById('acc');
  let desSunk = document.getElementById('des');
  let patrolSunk = document.getElementById('patrol');
  let subSunk = document.getElementById('sub');
  let clickedLoc = null;
  let terms = null;
  let totalSunk = 0;
  
  opponentGrid.addEventListener('click', handleClick);
  form.addEventListener('submit', checkAnswer);
  
  
  function startGame(){
    for(let locs in opponentLocations){
      if(opponentLocations[locs].length){
        opponentLocations[locs].length = 0;
      }
    }

    totalSunk = 0;
    
    const hits = document.getElementsByClassName('hit');
    const miss = document.getElementsByClassName('miss');
    
    if(hits.length !== 0 || miss.length !== 0){
      Array.from(hits).forEach(el => el.classList.remove('hit'));
      Array.from(miss).forEach(el => el.classList.remove('miss'));
    }
   
    setAircraftCarrierLoc();
    setBattleshipLoc();
    setSubLoc();
    setDestroyerLoc();
    setPatrolLoc();
  }
  
  function checkIfLocsAvailable(first, second, neededSpaces){
    let count = 0;
    let space = `${first}-${second}`;
    const locations = [];
    
    // 1 = Place locations horizontally; 0 = Place locations vertically
    let direction = Math.floor(Math.random() * Math.floor(2));
    
    while(count < neededSpaces){
      for(loc in opponentLocations){
        if(opponentLocations[loc].includes(space)){
          return false;
        }
      }
  
      locations.push(space);
      
      if(direction === 0){
        space = `${first}-${second += 1}`;
      }else{
        space = `${first += 1}-${second}`
      }
      count++;
    }
    
    return locations;
  }
  
  
  function setAircraftCarrierLoc(){
    const max = 8;
    const min = 1;
    
    let firstCoord = Math.floor(Math.random() * (max - min + 1) + min);
    let secondCoord = Math.floor(Math.random() * (max - min + 1) + min);
    
    let locations = checkIfLocsAvailable(firstCoord,secondCoord, 5);
    
    if(locations){
      opponentLocations.acc.push(...locations);
    }  
  }
  
  function setBattleshipLoc(){
    const max = 9;
    const min = 1;
    
    let firstCoord = Math.floor(Math.random() * (max - min + 1) + min);
    let secondCoord = Math.floor(Math.random() * (max - min + 1) + min);
    
    let locations = checkIfLocsAvailable(firstCoord, secondCoord, 4);
    
    if(locations){
      opponentLocations.bs.push(...locations);
    }else{
      setBattleshipLoc();
    }
    
  }
  
  function setSubLoc(){
    const max = 10;
    const min = 1;
    
    let firstCoord = Math.floor(Math.random() * (max - min + 1) + min);
    let secondCoord = Math.floor(Math.random() * (max - min + 1) + min);
    
    let locations = checkIfLocsAvailable(firstCoord, secondCoord, 3);
    
    if(locations){
      opponentLocations.sub.push(...locations);
    }else{
      setSubLoc();
    }
  }
  
  function setDestroyerLoc(){
    const max = 10;
    const min = 1;
    
    let firstCoord = Math.floor(Math.random() * (max - min + 1) + min);
    let secondCoord = Math.floor(Math.random() * (max - min + 1) + min);
    
    let locations = checkIfLocsAvailable(firstCoord, secondCoord, 3);
    
    if(locations){
      opponentLocations.des.push(...locations);
    }else{
      setDestroyerLoc();
    }  
  }
  
  function setPatrolLoc(){
    const max = 11;
    const min = 1;
    
    let firstCoord = Math.floor(Math.random() * (max - min + 1) + min);
    let secondCoord = Math.floor(Math.random() * (max - min + 1) + min);
    
    let locations = checkIfLocsAvailable(firstCoord, secondCoord, 2);
    
    if(locations){
      opponentLocations.patrol.push(...locations);
    }else{
      setPatrolLoc();
      return;
    }
  }
  
  
  function handleClick(event){
    document.getElementById('answer').value = ""
    document.getElementById('answer').focus();
   
    clickedLoc = event.target.childNodes[0];
    terms = event.target.id.split("-");
  
    if(terms.length === 2){
      equation.innerText = `${terms[0]} x ${terms[1]}`;
    }
    
  }
  
  function checkAnswer(event){
    event.preventDefault();
    const answerInput = document.getElementById('answer');
    const answer = parseInt(answerInput.value);
  
    
    if(answer === terms[0] * terms[1]){
      for(loc in opponentLocations){
        if(opponentLocations[loc].includes(terms.join('-'))){
          const hitLoc = opponentLocations[loc].indexOf(terms.join('-'));
          opponentLocations[loc].splice(hitLoc, 1);
          
          if(opponentLocations[loc].length === 0) {
            switch(loc){
              case "acc": 
                accSunk.innerText = "SUNK";
                break;
              case "bs":
                bsSunk.innerText = "SUNK";
                break;
              case "sub":
                subSunk.innerText = "SUNK";
                break;
              case "patrol":
                patrolSunk.innerText = "SUNK";
                break;
              case "des":
                desSunk.innerText = "SUNK";
                break;
            }
            totalSunk++;
          }
          
          clickedLoc.classList.add("hit");
        }
      }
      
      if(totalSunk === 5){
        const winner = document.getElementById('winner');
        
        winner.style.opacity = 1;
        winner.style.zIndex = 0;
        
        setTimeout( () => {
          winner.style.opacity = 0;
          winner.style.zIndex = -1;
        }, 3000);
      }
      
      if(!clickedLoc.classList.contains("hit")){
        clickedLoc.classList.add("miss");
      }
    }else{
      const wrongAnswer = document.getElementById('wrong-answer');
      wrongAnswer.style.opacity = 1;
      answerInput.classList.add('wrong-answer');
      setTimeout(() => {
        answerInput.classList.remove('wrong-answer');
        wrongAnswer.style.opacity = 0;
      }, 1500);
        
     }
  }