
let keys = [];

function keyPress(element){
    element.addEventListener('keydown',event=>{
        if (!keys.includes(event.key)) {
            keys.push(event.key);
          }
        //console.log(keys);
    })
    element.addEventListener('keyup',event=>{
        var index = keys.indexOf(event.key);
        if (index > -1) {
            keys.splice(index, 1);
        }
        //console.log(keys);
    })
}

export {keyPress, keys}