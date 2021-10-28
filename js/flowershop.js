//  Delivery option drop down with jQuery

$(document).ready(function () {
    $("#accordion").accordion({
        animate: 400,
        collapsible: true
    });

    // Jquery hide and show function

    $("#Toggle").click(function () {
        $("#discountcontainer").toggle(600);
    });

    // when the delivery input is charged from the default, the new value is added to session storage and the page reloaded

    $('.deliveryInput').change(function (event) {
        let deliveryCost = parseInt(event.target.value);
        sessionStorage.setItem("delivery", deliveryCost);
        location.reload();
    });
});

// jQuery animation with chained effects for the product info modal

function showModal(modalInfo) {
    $(modalInfo)
        .slideDown(800).css('color', 'green');
}

// Started with an empty array

let items = [];


//Constructor function to create all the music items.

function Flower(name, price) {
    this.name = name;
    this.price = price;
    this.quantity = 1;
}

// When a user clicks the button to "add to cart", the function checks if the item already exists in the cart. 


function addFlower(event) {
    initSessionStorage();
    items = JSON.parse(sessionStorage.getItem("flowers"));
    let flowerInCart = items.find(function (p) {
        return p.name == event.target.name;
    });

    // If the item already exists in the cart, just increase the quantity of that item 

    if (flowerInCart) {
        flowerInCart.quantity++;

        // If the item does not exist in the cart, create a new order item and add it to the array 

    } else {
        let newFlower = new Flower(
            event.target.name,
            event.target.value,
        );
        items.push(newFlower);
    }

    // Add to session storage 

    sessionStorage.setItem("flowers", JSON.stringify(items));
    let total = calcTotal();
    addedToCart(total);
}

/* This function is called when the page loads. If it's being called for the first time
   the table is empty. As the user inputs information the table is populated. */

function displayOrders() {

    // Getting the table to add entries to

    let orderTable = document.getElementById("orderList");
    orderTable.classList.add("table");

    // Checking if this is the first time the page has been loaded

    initSessionStorage();

    // If it's not the first page load get the objects from sessionStorage and add it to items

    items = JSON.parse(sessionStorage.getItem("flowers"));

    // Loop through each entry in the array

    items.forEach(function (p, i) {

        // For each entry, create a row. Add cells to the row with relevant information. 

        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        let priceCell = document.createElement("td");
        let quantityCell = document.createElement("td");

        nameCell.innerHTML = p.name;
        priceCell.innerHTML = "R" + p.price * p.quantity;
        quantityCell.innerHTML = p.quantity;

        // Let the quantity cell be editable so the user can update quantity values

        quantityCell.contentEditable = true;

        // Add cells with information to the row

        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(quantityCell);


        /* Inside each row add a delete button. On button click call deleteOrderItem function 
        and removes that object from the array. Update the array in sessionStorage. Reload the page. */

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn-danger")
        deleteButton.innerHTML = "Remove Item";
        deleteButton.addEventListener("click", function deleteOrderItem() {
            items.splice(p, 1);
            sessionStorage.setItem("flowers", JSON.stringify(items));
            location.reload();
        });

        // Also inside each row add a save button.  

        let saveButton = document.createElement("button");
        saveButton.classList.add("btn-success");
        saveButton.innerHTML = "Save";

        // on click get the information added to the editable quantity cell

        saveButton.addEventListener("click", function editOrderItem(event) {

            let updatedQuantity = event.target.parentNode.childNodes[2].textContent;

            // Update quantity

            items[i].quantity = parseInt(updatedQuantity);

            // Add new quantity to sessionstorage

            sessionStorage.setItem("flowers", JSON.stringify(items));
            location.reload();

        });

        // Add button to rows

        row.appendChild(saveButton);
        row.appendChild(deleteButton);

        // Add rows to table

        orderTable.appendChild(row);

    });

    // Display delivery information

    let delivery = sessionStorage.getItem("delivery");
    dispdelivery = document.getElementById("displayDelivery")
    dispdelivery.innerText = "R" + delivery;

    // Display discount information

    let discount = sessionStorage.getItem("discount");
    dispdisc = document.getElementById("displayDiscount")
    dispdisc.innerText = discount + "%";

    // Display total information

    let total = calcTotal();
    let displayTotal = document.getElementById("endTotal");
    displayTotal.textContent = "R" + total;

    // Display subtotal information

    let subtotal = calcSubTotal();
    let displaysubTotal = document.getElementById("subtotal");
    displaysubTotal.textContent = "R" + subtotal;


    // Display vat information

    let vat = calcVat()
    let displayVat = document.getElementById("vat");
    displayVat.textContent = "R" + vat;

}

// Checking the page has been loaded before and if there are any items in the cart, discounts applied or delivery selected

function initSessionStorage() {
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("flowers", JSON.stringify(items));
        sessionStorage.setItem("discount", 0);
        sessionStorage.setItem("delivery", 100);
        sessionStorage.setItem("hasCodeRunBefore", true);
    }
}

// Start with total being zero. 

function calcTotal() {
    let total = 0;
    items = JSON.parse(sessionStorage.getItem("flowers"));

    // Calculating the subtotal for each item

    items.forEach(function (p) {
        let subtotal = p.price * p.quantity;
        total = total + subtotal;
    });

    // applying discount coupon and calculating subtotal after discount

    let discount = sessionStorage.getItem("discount");
    if (discount != 0) {
        let discountAmount = (discount / 100) * total;
        total = total - discountAmount;
    }

    // adding delivery costs if the user hasn't selected "collection" option

    delivery = sessionStorage.getItem("delivery");
    if (delivery != 0) {
        total = total + parseInt(delivery);
    }

    return total.toFixed(2);
}

// Calculate vat

function calcVat() {
    let vat = 0;
    items = JSON.parse(sessionStorage.getItem("flowers"));
    items.forEach(function (p) {
        let subtotal = p.price * p.quantity;
        vat = (subtotal / 100) * 15;
    });
    return vat.toFixed(2);
}

// Calculate subtotal

function calcSubTotal() {
    let subtotal = 0;
    items = JSON.parse(sessionStorage.getItem("flowers"));
    items.forEach(function (p) {
        subtotal = subtotal + (p.price * p.quantity);
    });
    return subtotal.toFixed(2);
}

// An alert when items are added to the car showing the total owed with standard shipping

function addedToCart(total) {
    alert("Thank you for your purchase.\nTotal: R" + total);
}

// On click of the submit button the function checks if the user has entered an appropriate discount coupon voucher

function calculateDiscount() {
    let discount = 0;
    let discountCode = document.getElementById("discountCode");
    if (discountCode.value === "poppy10") {
        discount = 10;
    }
    sessionStorage.setItem("discount", discount);
    location.reload();
}

// On click of the confirm order button, the function checks if the cart is empty if not generates a reference number for the order and alerts the user

function confirmOrder() {
    items = JSON.parse(sessionStorage.getItem("flowers"));
    if (items === null || items.length === 0) {
        alert("cart is empty");
    } else {
        let referenceNumber = new Date().valueOf();
        alert("Order confirmed, Reference No. " + referenceNumber);
    }



}