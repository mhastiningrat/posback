function c(qty){
    let pricetag = [
        { min_qty: 1, price: 3000 }, // Rp 3.800 per unit untuk pembelian 1 barang
        { min_qty: 2, price: 2000 }, // Rp 3.550 per unit untuk pembelian 2 barang
        { min_qty: 5, price: 1000 }, // Rp 3.300 per unit untuk pembelian 5 barang
    ];

    let totalPrice = 0
    let newQty = qty;

    function d(pricetag,nqty){
        
            let getQty = Math.floor(nqty / pricetag.min_qty)
            if(getQty !== 0){
                console.log("newQty === "+ nqty)
                console.log("getQty === "+getQty)
                let itunganHarga = (getQty * pricetag.min_qty) * pricetag.price
                totalPrice += itunganHarga
                newQty -= getQty * pricetag.min_qty

                console.log("Formula itunganHarga === "+ getQty * pricetag.min_qty + " x  " + pricetag.price)
                console.log("itunganHarga === "+ itunganHarga)
            }
       
    }
    
    for(let i = pricetag.length - 1; i >= 0; i--){
      
        if(newQty >= pricetag[i].min_qty){
            d(pricetag[i],newQty)
        }
    }

    console.log(totalPrice)
}


c(11)