
let cart = []
let modalKey = 0

let modalQt = 1

//(1)Criar uma constante que represente a chamada de um querySelector para deixar o código mais organizado
const c = function(el){
    return document.querySelector(el)
}

const cs = (el) => document.querySelectorAll(el)


//(1)Mapear a lista pizzaJson.map()
pizzaJson.map(function(item, indice) {

    let pizzaItem = c('.models .pizza-item').cloneNode(true)  

    pizzaItem.setAttribute('data-key', indice)

    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    pizzaItem.querySelector('a').addEventListener('click', function(evento){
        evento.preventDefault() //desabilita o padrão <a> que atualiza a página

        let key = evento.target.closest('.pizza-item').getAttribute('data-key')

        modalQt = 1

        modalKey = key

         //(5)Preencher no modal as informações das pizzas clicadas Preenchendo a imagem da pizza
         c('.pizzaBig img').src = pizzaJson[key].img 

        //(5)Prenchendo o nome da pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name

        //(5)Preenchendo a descrição da pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description

        //------------- Sizes das pizzas ---------------

        //(5)Revomendo o tamanho selecionado anteriormente no Modal 
        c('.pizzaInfo--size.selected').classList.remove('selected')

        //(5)Percorrendo e Preenchendo os itens selecionados com um forEach()
        cs('.pizzaInfo--size').forEach(function(size, sizeIndice){

            if(sizeIndice == 2){
                size.classList.add('selected')
            }

            //Buscando as informações no JSON
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndice]
        })

        //----------------------------------------------

        //(5)Preenchendo o preço da pizza formatado (,)
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`

        //(5)Prenchendo e removendo a quantidade das pizzas
        c('.pizzaInfo--qt').innerHTML = modalQt
        
        //(4)Criando um efeito de animação para abrir o modal, quando a pizza for clicada
        c('.pizzaWindowArea').style.opacity = '0'
        c('.pizzaWindowArea').style.display = 'flex'

        setTimeout(function(){
            c('.pizzaWindowArea').style.opacity = '1'
        }, 200)
    })

        //(1)Preencher as informações em pizzaItem dentro de pizza-area usando append para sempre adicionar mais um conteúdo.
        c('.pizza-area').append(pizzaItem)

})

//Passo(6)- Criando uma função de eventos com animação no modal ao ser fechado
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=> {
        
        c('.pizzaWindowArea').style.display ='none'

    }, 500)
}

//(6)Fechando o modal ao clicar em cancelar ou voltar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item) {
    item.addEventListener('click', closeModal)
})

//Passo(7)- Modificando quantidade das pizzas no modal
    c('.pizzaInfo--qtmenos').addEventListener('click', function(){
        if(modalQt > 1){
            modalQt--
            c('.pizzaInfo--qt').innerHTML = modalQt

            /*Implemento adicional (apenas estética)*/
            let valores = parseFloat(c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[modalKey].price.toFixed(2)}`)

            let novoValor = parseFloat(modalQt * valores)

        console.log(valores)
        console.log(parseFloat(novoValor))
    
        c('.pizzaInfo--actualPrice').innerHTML = 'R$ ' + novoValor.toFixed(2).replace('.', ',')
        /*FIM/ Implemento adicional (apenas estética)*/
        }
    })

    let pizza = c('.pizzaInfo--qtmais').addEventListener('click', function(){
        modalQt++
        c('.pizzaInfo--qt').innerHTML = modalQt

        /*Implemento adicional (apenas estética)*/
        let valores = parseFloat(c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[modalKey].price.toFixed(2)}`)

        let novoValor = parseFloat(modalQt * valores)

        console.log(valores)
        console.log(parseFloat(novoValor))
    
        c('.pizzaInfo--actualPrice').innerHTML = 'R$ ' + novoValor.toFixed(2).replace('.', ',')
        /*FIM/ Implemento adicional (apenas estética)*/
    })

    //(7)Habilitando a seleção de tamanhos das pizzas
    cs('.pizzaInfo--size').forEach(function(size, sizeIndice){

        //(7)Selecionando um item e desmarcando outro
        size.addEventListener('click', function(evento){

            c('.pizzaInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')
        })
    })

    //Passo (8)- Interação de adicionar ao carrinho
    c('.pizzaInfo--addButton').addEventListener('click', () =>{

        let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

        //(8)Juntando tamanhos de pizzas identicas no mesmo array
        let indentifier = pizzaJson[modalKey].id + '@' + size

        //(8)Identificar se no carrinho já existe outro item com o mesmo identificador
        let key = cart.findIndex(function(item) {
            return item.indentifier == indentifier
        })

        if(key > -1){

            cart[key].qt += modalQt

        }

        else{

            //(8)Qual a pizza?
        cart.push({
            indentifier,
            id:pizzaJson[modalKey].id,
            //(8)Qual o tamanho?
            size:size,
            //(8)Quantas pizzas?
            qt:modalQt
        })

        }

        //(9)Atualizar o carrinho antes de fechar modal
        updateCart()

        //(8)Após escolher a pizza fechar o modal
        closeModal()
    })

    //(10)Fazer o aside aparecer no modo mobile
    c('.menu-openner').addEventListener('click', function(){
        if(cart.length > 0) {
        c('aside').style.left = '0'
        }
    })

    c('.menu-closer').addEventListener('click', function(){
        c('aside').style.left = '100vw'
    })
//------------------------------------------------------

//(9)- Configurando a exibição de mostrar o carrinho
function updateCart() {

    //(10)Exibir a qtd de itens no carrinho do mobile
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')

        //(9)Zerando a listagem de pizzas para não ficar repetindo campos para pizzas iguais
        c('.cart').innerHTML = ''

        //(9)Variáveis dos valores do carrinho
        let subtotal = 0
        let desconto = 0
        let total = 0

        //(9)- Percorrendo os itens do carrinho
        for(let i in cart) {

            let pizzaItem = pizzaJson.find( function(item){

                return item.id == cart[i].id
            })

            subtotal += pizzaItem.price * cart[i].qt

            //(9)- Clonar o carrinho
            let cartItem = c('.models .cart--item').cloneNode(true)

            //(9)Preenchendo as informações no aside
            let pizzaSizeName
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;

                case 1:
                    pizzaSizeName = 'M'
                    break;

                case 2:
                    pizzaSizeName = 'G'
                    break;
            
                default:
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            //(9)- Modificando quantidade no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', function(){
                if(cart[i].qt > 1) {
                cart[i].qt --
            }
            else{
                cart.splice(i, 1)
            }

                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', function(){
                cart[i].qt ++
                updateCart()
            })

            c('.cart').append(cartItem)
        }
        //(9)Exibindo os valores no Aside 
        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`
    }

    else{
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}