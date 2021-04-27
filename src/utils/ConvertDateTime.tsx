export function ConvertDate( duration : number ){
    const hours = Math.floor( duration / (60*60) );
    const minutes = Math.floor((duration %  (60+60)) / 60);
    const secunds = duration % 60;

    // NUM FAZ O MENOR SENTIDO !!
    const timestring = [hours , minutes , secunds]
    .map( hora => hora.toString().padStart(2,'0')).join(':');

    return timestring;
}

