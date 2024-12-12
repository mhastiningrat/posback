export const collectPcode = (product) => {
    let pcode = '';

    if(product.length > 0){
        for(let i in product){
            if(pcode.length > 0) pcode+=','
            pcode+= `'${product[i].pcode}'`
        }

        return pcode;
    }else{
        return false;
    }
}