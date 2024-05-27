function double(n){
    return n*2
}
function call(val){
    console.log(val)
}
call(()=>double(3))