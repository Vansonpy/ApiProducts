$(document).ready(function () {
    $.ajax({
        url: "https://dummyjson.com/products",
    }).done(function (result) {
       products = result.products;
       console.log(products);
       render();
       action();
       submit();
    });
    
    var products = [];
    var prices = [];
    const bodyTable = document.getElementById('bodyTable');
    const totalValue = document.querySelector('input[name=priceValue');
    const subMit = document.querySelector('input[name=submit');

    function render(){
        prices = [];
        $('#bodyTable tr').remove();
        for (let index = 0; index < products.length; index++) {
                addRow(products[index]);            
        }
        totalPrice();
        runImage();
    }

    function addRow(product){
        let row = bodyTable.insertRow()
        addCol(row,addImage(product));
        addCol(row, `<textarea name = 'title' readonly>${product.title}</textarea>`);
        addCol(row, `<textarea name = 'brand' readonly>${product.brand}</textarea>`);
        addCol(row, `<textarea name = 'description' readonly>${product.description}</textarea>`);
        addCol(row, `<textarea name = 'price' readonly>${product.price}</textarea>`);
        addCol(row,`<input type='button' name='delete' value='Delete' id=${product.id}> 
        <input type='button' name='edit' value='Edit' id=${product.id}>`);
        prices.push(product.price)
    }

    function addCol(row,value){
        let col = row.insertCell();
        col.innerHTML = value;
    }

    function totalPrice(){
        let priceSum = 0
        for (let index = 0; index < prices.length; index++) {
            priceSum += prices[index];
        }
        totalValue.value = priceSum;
    }

    function reSearch(text,arr){
        for (let index = 0; index < arr.length; index++) {
            if(arr[index].defaultValue === text){
                return [false,index+1]
            }    
        }  
        return [true]; 
    }
    function action(){
        const dotEdit = $('input[name=edit]');
        const dotDelete = $('input[name=delete]');
        const editTitle = $('textarea[name=title]');
        const editBrand = $('textarea[name=brand]');
        const editDescription = $('textarea[name=description]');
        const editPrice = $('textarea[name=price]');
        const dotSave = document.querySelector('input[defaultValue=Save]');
        Array.from(dotEdit).forEach(function(dot,index){
            dot.addEventListener('click',function(e){
                if(dot.value==='Save'){
                    if(Number(editPrice[index].value)<0||isNaN(Number(editPrice[index].value))){
                        alert("Price is fail");
                    }else {
                        dot.value = 'Edit';
                    const textArea = e.target.parentElement.parentElement.querySelectorAll('textarea')
                    Array.from(textArea).forEach(function(area,index){
                        area.classList.remove('edit')
                        area.setAttribute("readonly","")
                    })
                    products[index].title = editTitle[index].value;
                    products[index].brand = editBrand[index].value;
                    products[index].price = editPrice[index].value;
                    prices.splice(index,1,Number(products[index].price) )
                    products[index].editDescription = editDescription[index].value;
                    totalPrice();
                    }
                }else if(dot.value==='Edit' && reSearch('Save', Array.from(dotEdit))[0]){
                    dot.value = 'Save';
                    console.log(dot.defaultValue)
                    console.log(Array.from(dotEdit))
                    console.log(dotSave)
                    const textArea = e.target.parentElement.parentElement.querySelectorAll('textarea')
                    Array.from(textArea).forEach(function(area,index){
                        area.classList.add('edit')
                        area.removeAttribute('readonly')
                    })
                }else{
                    alert(`Edit is fail '${reSearch('Save', Array.from(dotEdit))[1]}'`);
                }
            })
        })

        Array.from(dotDelete).forEach(function(dot,index){
            dot.addEventListener('click',function(e){
                if (confirm("You need remove line") == true) {
                    filterProducts(dot.id);
                    action();
                    totalPrice();
                }
            })
        })        
    }

    function filterProducts(id){
        products = products.filter(function(product){
            return product.id != id;
        })
        render();
    }

    function submit(){
        subMit.addEventListener('click', function (e) {
            $.ajax({
                type: "POST",
                url: "https://dummyjson.com/products/add",
                data:  products
            }).done(function () {
                alert("second success");
            }).fail(function () {
                alert("error");
            });
            console.log(products)
        })
    }

    function addImage(product){
        let arrayLink = product.images.map(function(value,index){
            return `<div class="slider-item" data-index="${index}"><img src='${value}'alt=""></div>`
        })

        let arrayDot = product.images.map(function(value,index){
            if(index==0){
                return `<input type="button" name="dot" value="${index}" class="active"></div>`
            }else{
                return `<input type="button" name="dot" value="${index}" ></div>`
            }
        })
        return `<div class="slider-wrapper"><div class="slider-main">${arrayLink.join("")}</div></div>${arrayDot.join("")}`;
    }

    function runImage(){
        const dotSlier = document.querySelectorAll('input[name=dot]')
        const sliderItemWidth = 500;
        let postionX = 0;
        let indexX = 0;
        Array.from(dotSlier).forEach(function(dot,index){
            dot.addEventListener('mouseenter',function(e){
                const slideIndex = parseInt(dot.value);
                indexX = slideIndex;
                postionX = -1 * indexX * sliderItemWidth;
                let sliderMain = e.target.parentElement.querySelector(".slider-main")
                sliderMain.style = `transform: translateX(${postionX}px)`
                const dotsInSlider = e.target.parentElement.querySelectorAll('input[name=dot]')
                Array.from(dotsInSlider).forEach(function(dot,index){
                    dot.classList.remove("active");
                })
                e.target.classList.add("active");
            })
        })
    }
})