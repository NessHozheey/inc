$(() => {
  //- ENTER BUTTON TRIGGER EGGS INPUT
  $("input[name='eggQuantity']").on('keydown', (e) => {
    if (e.which === 13) {
      $(".OP-add-to-cart").trigger('click') 
      $("input[name='eggQuantity'").addClass('warningFocus')
      setTimeout(() => {
      $("input[name='eggQuantity'").removeClass('warningFocus')

      },1000)
    }
  })

  // ESC BUTTON TRIGGER X ORDER PREVIEW
  $(".order-preview").on('keydown', (e) => {
    if (e.which === 27)
      $(".x-order-preview").trigger('click')
  })

  
})


 

