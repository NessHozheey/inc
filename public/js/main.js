$(() => {
  //- ENTER BUTTON TRIGGER EGGS INPUT
  $("input[name='eggQuantity']").on('keydown', (e) => {
    if (e.which === 13)
      $(".OP-add-to-cart").trigger('click')
  })

  // ESC BUTTON TRIGGER X ORDER PREVIEW
  $(".order-preview").on('keydown', (e) => {
    if (e.which === 27)
      $(".x-order-preview").trigger('click')
  })

  
})


 

