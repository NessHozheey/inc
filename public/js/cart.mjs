export let cart
getFromStorage()


export function addToCart (Breed, TypeID, ImageSRC, Country, Price, Quantity) {

  let cartID = 0;

  if (cart.length < 1)
    cartID = 1

  else {
   cartID = (cart[(cart.length - 1)].cartID + 1)
  }


  let order =  {
    cartID,
    TypeID,
    Breed,
    ImageSRC,
    Country,
    Quantity: Number(Quantity),
    Price
  }

  let matchingCartItem;
  cart.forEach( (cartItem) => {
    
    if (cartItem.Breed === Breed && cartItem.Country === Country) 
      matchingCartItem = cartItem;
    
  } );
 
  if(matchingCartItem) {
    let checkTotal = Number(matchingCartItem.Quantity) + Number(Quantity)

    if (checkTotal > 7000)
      //-lockAddButtons()
      //-
      return 
    else 
      matchingCartItem.Quantity += Number(Quantity);
  } else {
    cart.push(order)
  }




  saveToStorage()
}

export function removeFromCart (cartID) {
  let newCart = []
  cart.forEach(e => {
    if (e.cartID !== cartID) {
      newCart.push(e)
    }

  cart = newCart
  saveToStorage()
})
setItemsQuantity()
}

export function updatePriceDiv () {
  if (calculateCartPrice() !== 0) {
  let deliveryPrice = 70
  $(".checkCartPrice").text(calculateCartPrice() + '₴')
  $(".checkDeliveryPrice").text(deliveryPrice + "₴")
  $(".checkTotalPrice").text((Number(calculateCartPrice()) + Number(deliveryPrice)) + "₴").css({
    color: "green"
  })
} else {
   $(".checkout-quantity-eggs").text('')
    $(".checkCartPrice").text('—')
    $(".checkDeliveryPrice").text("—")
    $(".checkTotalPrice").text("—")
}
}

function saveToStorage () {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function getFromStorage() {
 cart = JSON.parse(localStorage.getItem('cart')) || []
}

export function showCart () {
  cart.forEach(item => {
    console.log(item)
  })
}

export function clearCart () {
  cart.length = 0
  saveToStorage()
}

export function totalQuantity() {
  let sum = 0
  cart.forEach(item => {
     sum += Number(item.Quantity)
  })
  return sum
}

export function calculateCartPrice() {
  let sum = 0
  cart.forEach(item => {
     sum += Number(item.Quantity) * Number(item.Price)
  })
  return sum
}

export function updateQuantity() {
    $('.cart-eggs-quantity').children('p').html(totalQuantity())
}

export function setItemsQuantity() {
  let i = 0 
  cart.forEach(e => {
    i++
  })
  if (i == 1)
  $(".checkout-title-quantity").text(`${i} товар`)
  if (i == 2 || i == 3 || i == 4)
  $(".checkout-title-quantity").text(`${i} товари`)
  if (i > 4)
  $(".checkout-title-quantity").text(`${i} товарів`)
  if (  i == 0 || $(".checkCartPrice").text() == '0₴') {
    if ($(document).width() > 500) {
    $(".checkout-title-quantity").css({
      fontSize: '16px'
    })
  } else {
    $(".checkout-title-quantity").css({
      fontSize: '13px'
    })

  }
    
    $(".checkout-title-quantity").text('Ви ще нічого не додавали до корзини.')
    $(".checkout-title-quantity-div").css({
      justifyContent: "center",
      top: '150px'
    })
    updatePriceDiv()
   
  } else {
         
      $(".checkout-title-quantity-div").css({
        justifyContent: "space-between"
      })
      $(".checkout-quantity-eggs").text(totalQuantity() + ' шт.')
    }

}
export function cartToHTML() {
  setItemsQuantity()
  updatePriceDiv()
  cart.forEach(e => {

    $("<div>", {id: e.cartID})
    .attr('class', `order-row order-row-${e.cartID}`)
    .appendTo($(".div-ordered"))



    $("<div>", {class: `checkout-img-section checkout-img-section-${e.cartID}`}).append(

      $("<img>", {src: e.ImageSRC, height: '100px', width: '100px'}),
      $("<img>", {src: e.Country, height: '25px'}).attr('id', 'checkCountry') 
    
    ).appendTo(`.order-row-${e.cartID}`)


    $("<div>", {class: `checkout-text-section checkout-text-section-${e.cartID}`}).append (

      $("<p>").text(`${e.Breed}`).attr('class', 'checkBreed').attr('id', `checkBreed-${e.cartID}`),
      $("<p>").text(`${e.Quantity} шт.`).attr('class', 'checkQuantity').attr("id", `checkQuantity-${e.cartID}`),
      $("<a>").text("Змінити").attr("class", "changePick").attr('id', `changePick-${e.cartID}`).attr("value", `${e.cartID}`),

      $("<img>", {src: "icons/tick.svg", class: `checkoutTick checkoutTick-${e.cartID}`, height: "20px"}).hide(),

      $("<img>", {src: "icons/no.svg", class: `checkoutNo checkoutNo-${e.cartID}`, height: "17px"}).hide(),

      $("<input>", {type: 'number',name: `${e.cartID}`,max: "7000", width: '30px', class: `forChange forChange-${e.cartID}`}).hide(),

      $("<p>").text(`${e.Price} ₴/шт.`).attr('id', 'checkPrice'),
      $("<img>").attr("src" , "icons/trashcan.svg").attr("class", "trashImg").attr("height", "18px").attr("id", `trashImg-${e.cartID}`).attr("value", `${e.cartID}`),

      $("<p>", {
        class: `limitWarning limitWarning-${e.cartID}`
      }).text('Ліміт: 7000 шт.').hide()
    
    ).appendTo(`.order-row-${e.cartID}`)

    
    if ( `${e.Breed}`.length > 14) {
      $(".checkout-text-section").children(`p#checkBreed-${e.cartID}`).css({
        fontSize: '15px'
      })
    } 

    if ((e.Quantity) > 999) {
      $(`#checkQuantity-${e.cartID}`).css({
        fontSize: "13px",
        top: '-17.5px'
      })
      $(`#changePick-${e.cartID}`).css({
        left: "42px"
      })
    }
  
    $(`#trashImg-${e.cartID}`).on('click', () => {
      removeFromCart(e.cartID)
      updatePriceDiv()
      setItemsQuantity()
      $(`.order-row-${e.cartID}`).remove()
    
    })
  
    $(`#changePick-${e.cartID}`).on('click', () => {
     
     $(`#changePick-${e.cartID}`).hide()
     $(`#checkQuantity-${e.cartID}`).hide()
     $(`.checkoutTick-${e.cartID}`).show()
     $(`.checkoutNo-${e.cartID}`).show()
     $(`#trashImg-${e.cartID}`).css({
       left: "115px",
       top: '-17px'
     }) 
     $(`.forChange-${e.cartID}`).show().trigger('focus')
    })
    
    function hideChangeOption () {
   $(`#changePick-${e.cartID}`).show()
   $(`#checkQuantity-${e.cartID}`).show()
   $(`.checkoutTick-${e.cartID}`).hide()
   $(`.checkoutNo-${e.cartID}`).hide()
   $(`.forChange-${e.cartID}`).val(null).hide()
   $(`#trashImg-${e.cartID}`).css({
    top: '-22px',
    right: '-70px'
   })
  }
    $(`.checkoutNo-${e.cartID}`).on('click', () => {
      
      hideChangeOption()
    })

    $(`.checkoutTick-${e.cartID}`).on('click', () => {
      let Input = $(`input[name='${e.cartID}']`)
      let chickMinOrder = 30
      let GooseNTurkeyMinOrder = 10
      let duckMinOrder = 15
      
      function quantityChecker(minOrder) {

        if (Input.val() > 7000 || Input.val() < minOrder) {
          Input.addClass('red-border-warning')
        
          setTimeout( () => {
            Input.removeClass('red-border-warning')},1000)
            Input.val(null)
            Input.attr('placeholder', `>${(minOrder - 1)}`)
           
          } 
          else if (Input.val() % 1 !== 0) {
            Input.addClass('red-border-warning')
            setTimeout( () => {
              Input.removeClass('red-border-warning')},1000)
              Input.val(null) 
          }
          else if ((Number(totalQuantity()) - Number(e.Quantity) + Number(Input.val()))
            > 7000) {

              Input.addClass('red-border-warning')
              $(`.limitWarning-${e.cartID}`).fadeIn()
          
              setTimeout( () => {
                Input.removeClass('red-border-warning')
                $(`.limitWarning-${e.cartID}`).fadeOut()
              
              },1500)
                Input.val(null)

          } 
          else {
         
            if (Input.val() > 999) {
              $(`#checkQuantity-${e.cartID}`).css({
                fontSize: "13px",
                top: "-17.5px"
              })
      
              $(`#changePick-${e.cartID}`).css({
                left: "42px"
              })
            } else {
                $(`#checkQuantity-${e.cartID}`).css({
                  fontSize: "14px",
                  top: "-17px"
                })
        
                $(`#changePick-${e.cartID}`).css({
                  left: "38px"
                }) 
              }

          e.Quantity = Input.val()
          $(`#checkQuantity-${e.cartID}`).text(Input.val() + ' шт.')
          saveToStorage()
          updatePriceDiv()
          setItemsQuantity()
          hideChangeOption() 
        }
      } 

      if (!Input.val()) {
        Input.addClass('warningFocus')
        Input.trigger('focus')
        setTimeout( () => {
          Input.removeClass('warningFocus')},1000)
          return
      }

      if (e.TypeID < 10) 
        quantityChecker(chickMinOrder)
      
      if (e.TypeID === 10) 
        quantityChecker(duckMinOrder)

      if (e.TypeID > 10) 
        quantityChecker(GooseNTurkeyMinOrder)
      
    
     
      
      
      

              
    })
    
    

  })
}


