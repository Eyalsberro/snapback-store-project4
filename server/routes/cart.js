const { SQL } = require('../dbconfig')

const router = require('express').Router()

// ADD A CART
router.post('/addcart', async (req, res) => {
    try {
        const { user_id } = req.body


        const cartAlreadyExcited = await SQL(`SELECT * 
        FROM cart
        WHERE userID = '${user_id}'`)

        if (cartAlreadyExcited.length != 0) {
            return res.status(400).send({ err: "**You have a cart" })
        }


        const addcart = await SQL(`INSERT INTO cart(user_id)
        VALUES(${user_id})`)


        res.send(addcart)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

})


// ADD PRODUCT TO THE CART 
router.post("/addtocart", async (req, res) => {
    try {
        const { product_id, qt, cart_id } = req.body;

        await SQL(`INSERT INTO cartItems(qt,product_id ,cart_id)
        VALUES(${qt},${product_id},${cart_id})`)


        res.send({msg:'Prodcut Was Add To Cart'})

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});



// GET SPCIFIC CART OF CUSTOMER BY USER ID
router.get('/:user_id', async (req, res) => {
    try {
        const cartuser = await SQL(`SELECT 
                cart.cartID,
                product.productID,
                cart.user_id,
                product.productName,
                product.price,
                product.img,
                cartitems.qt,
                product.price * cartitems.qt AS Total
            FROM
                cartitems
                    INNER JOIN
                product ON cartitems.product_id = product.productID
                    INNER JOIN
                cart ON cartitems.cart_id = cart.cartID
            WHERE
                cart.user_id = ${req.params.user_id}`)
        res.send(cartuser)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})
 

// DELETE A PRODUCT FROM CART
router.delete("/delete/:cardid/:productid", async (req, res) => {
    try {

        await SQL(`DELETE from cartitems
        WHERE cart_id =${req.params.cardid}
        AND product_id =${req.params.productid}`)


        res.send({msg:'Prodcut Was Deleted'})

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// DELETE ALL PRODUCTS FROM CART
router.delete("/deleteall/:cardid", async (req, res) => {
    try {

        await SQL(`DELETE from cartitems
        WHERE cart_id =${req.params.cardid}`)


        res.send({msg:'Cart Was Deleted'})

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});

// GET CART DATE (for the login process)
router.get('/cartdate/:user_id', async (req, res) => {

    try {
        const cartdate = await SQL(`SELECT cartDate FROM cart WHERE user_id = ${req.params.user_id}`)
        res.send(cartdate)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }

});





module.exports = router