const currency = { //exchange rate
    usd: 1.18667,
    gbp: 0.853352
}

let data = []; //array to store form

let formDataType = { 
    curr: '',
    full: 0,
    emi: {
        monthly: 0,
        months: 0
    }
};

const amount = 199; //course amount

const container = document.getElementById('container');
const euroBtn = document.getElementById('euro');
const usdBtn = document.getElementById('usd');
const gbpBtn = document.getElementById('gbp');
const fullPrice = document.getElementById('payFull-convert');
const installments = document.getElementById('payInstallments-convert');
const btn = document.getElementById('btn-proceed');

const currencies = document.querySelectorAll('input[name="currency"]');
currencies.forEach(e => {
    e.addEventListener('change', function(){
        switchCurrency(this.value);
    })
});

const getPercentage = (price, offPrice) => {
    let percentage = price * offPrice / 100;
    return percentage;
}

const switchCurrency = (value) => {
    let price;
    let offerPrice = 50;
    let months = 6;
    let symbol;
    let monthly;

    if(value === 'gbp'){
        symbol = '&#163;';
        price = amount * currency.gbp;
        offerPrice = getPercentage(price, offerPrice);
        switchUI(symbol, price, offerPrice);

        //emi
        monthly = offerPrice / months;
        switchEmi(symbol, monthly, months);
    }
    else if(value === 'usd'){
        symbol = '&#36;';
        price = amount * currency.usd;
        offerPrice = getPercentage(price, offerPrice);
        switchUI(symbol, price, offerPrice);

        //emi
        monthly = offerPrice / months;
        switchEmi(symbol, monthly, months);
    }
    else if(value === 'euro'){
        symbol = '&euro;';
        price = amount;
        offerPrice = getPercentage(price, offerPrice);
        switchUI(symbol, price, offerPrice);

        //emi
        monthly = offerPrice / months;
        switchEmi(symbol, monthly, months);
    }

    formDataType.curr = value;
}

const switchUI = (curr, price, offerPrice) => {
    let html;

    html = `<div class="fullPrice">${curr}<strike><span class="price">${price.toFixed(2)}</span></strike>
        <span class="offerPrice">${offerPrice.toFixed(2)}</span></div>`;

    fullPrice.innerHTML = '';
    fullPrice.insertAdjacentHTML('beforeend', html);

    formDataType.full = offerPrice.toFixed(2);
}

const switchEmi = (curr, monthly, months) => {
    let html;

    html = `<div class="emi">${curr}<span>${monthly.toFixed(2)}</span>/month for <span>${months}</span>months</div>`;

    installments.innerHTML = '';
    installments.insertAdjacentHTML('beforeend', html);

    formDataType.emi.monthly = monthly.toFixed(2);
    formDataType.emi.months = months;
}

window.addEventListener('load', () => switchCurrency('euro'));

//checkbox 
const checkPaymentType = document.querySelectorAll('input[name="paymentMethod"]');
checkPaymentType.forEach((e) => e.addEventListener('change', function(event){
    event.preventDefault();
    for(let i = 0; i < checkPaymentType.length; i++){
        if(checkPaymentType[i] !== this){
            checkPaymentType[i].checked = false;
           // formDataType = this.value;
        }
    }
}));

//form submit
const submit = document.getElementById('submit');

submit.addEventListener('submit', function(e){
    e.preventDefault();
    let checkedBtn = 0;
    for(let i=0; i< checkPaymentType.length; i++){
        checkPaymentType[i].checked ? checkedBtn++ : checkedBtn;
    }
    if(checkedBtn < 1) {
        alert('please select a payment method');
    }
    else{
        data.push(formDataType);
        localStorage.setItem('test1', JSON.stringify(data));
        cleanUp();
    }
});

const userDetails = () => {
    let html = `<form class="userDetails" id="userDetails">
    <h1 title="course">Course name</h1>

    <p id="error"></p>
    <div class="form-group">
        <label for="firstname">First name:</label><input type="text" value="" id="firstname" name="firstname"  autocomplete="off" aria-label="firstname" placeholder="First Name" >
    </div>
    <div class="form-group">
        <label for="lastname">Last name:</label><input type="text" value="" id="lastname" name="lastname"  autocomplete="off" aria-label="lastname" placeholder="Last Name" >
    </div>
    <div class="form-group">
        <label for="email">Email:</label><input type="email" value="" id="email" name="email"  autocomplete="off" aria-label="email" placeholder="xyz@example.com" >
    </div>
    <div class="form-group">
        <label for="mobilenumber">Mobile Number:</label><input type="number" value="" id="mobilenumber"  autocomplete="off" aria-label="mobilenumber" name="mobilenumber" placeholder="Mobile Number">
    </div>
    <button type="submit" class="btn" id="btn-details">Proceed to Payment</button>
</form>`;

    container.insertAdjacentHTML('beforeend', html);
}

const cleanUp = () => {
    //clean the container
    container.innerHTML = '';

    //add new form
    userDetails();

    document.getElementById('userDetails').addEventListener('submit', handleSubmit);
}

const showErr = (value) => {
    let err = document.getElementById('error');
    err.textContent = `Please enter a valid ${value}`;
}

const handleSubmit = (e) => {

    const userForm = document.getElementById('userDetails');
        const userData = {
            firstname: '',
            lastname: '',
            email: '',
            mobilenumber: 0
        };

    const userDataArr = [];

    userData.firstname = userForm.elements['firstname'].value;
    userData.lastname = userForm.elements['lastname'].value;
    userData.email = userForm.elements['email'].value;
    userData.mobilenumber = userForm.elements['mobilenumber'].value;
    
    if(userData.firstname === ""){
        e.preventDefault();
        showErr('firstname');
    }
    else if(userData.lastname === ""){
        e.preventDefault();
        showErr('lastname');
    }
    else if(userData.email === ""){
        e.preventDefault();
        showErr('email');
    }
    else{
        userDataArr.push(userData);
        localStorage.setItem('userData', JSON.stringify(userDataArr));
    }
}