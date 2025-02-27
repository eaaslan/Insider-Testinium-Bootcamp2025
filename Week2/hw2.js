
const collatzChainLength=(num)=>{
let counter=1;
while(num>1){
    counter++;
    if(num%2==0){
        num/=2;
    }else{
        num=3*num+1
    }
}
return counter
}

const findLongestChain=(limit)=>{
    let maxLength=-Infinity;
    let maxLengthIndex=-Infinity;

    for(let i = 0; i <limit ;i++){
        let currentLength=collatzChainLength(i);

        if(currentLength>maxLength){
            maxLength=currentLength;
            maxLengthIndex=i;
        }
    }

    return {
        number:maxLengthIndex,
        length:maxLength
    } ;
}


console.log(findLongestChain(1000000))