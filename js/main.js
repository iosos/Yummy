
// loading

$(document).ready(function () {
    $(".spinner-loading").fadeOut(500);
    $("body").css("overflow", "visible");
});

//open & close sidebar

let hiddenColWidth = $(".sidebar .hidden-col").outerWidth();
closeMenu();

function closeMenu() {

    $("#sidebar").animate(
        {
            left: -hiddenColWidth,
        },
        500
    );
    $(".menu li").animate(
        {
            top: 500,
        },
        500
    );

    $(".show-hide-menu").removeClass("fa-x");
    $(".show-hide-menu").addClass("fa-align-justify");

}

function openMenu() {
    $("#sidebar").animate(
        {
            left: 0,
        },
        500
    );
    for (let i = 0; i < 5; i++) {
        $(".menu li").eq(i).animate(
            {
                top: 0,
            },
            (i + 5) * 100
        )
    }
    $('.show-hide-menu').removeClass("fa-align-justify");
    $('.show-hide-menu').addClass("fa-x");

}

$("i.show-hide-menu").on("click", function () {
    if ($("#sidebar").css("left") == "0px") {
        closeMenu();

    } else {

        openMenu();
    }
});


let searchNav = document.getElementById('search-tab');
let categoriesNav = document.getElementById("categories-tab");
let areaNav = document.getElementById("areas-tab");
let ingredientNav = document.getElementById("ingredient-tab");
let contactNav = document.getElementById("contact-tab");
let searchLayer = document.getElementById('search-layer');
var searchByName = document.getElementById('searchByName');
var searchByChar = document.getElementById('searchByChar');
let displayAllData = document.getElementById("display-all-data");

searchCharData('a');

// Show search inputs 
searchNav.addEventListener("click", function () {
    displayAllData.innerHTML = "";
    searchLayer.style.display = "block";
    closeMenu();

});


// Search meals by name

async function searchNameData(keyword) {
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + keyword);
    if (data.status == 200 && data.ok == true) {
        let result = await data.json();
        showMeals(result.meals);
    }
}

searchByName.addEventListener("keyup", function () {

    if (searchByName.value != null && searchByName.value != '') {
        displayAllData.innerHTML = "";
        $(".spinner-loading-items").fadeIn(500);
        searchNameData(searchByName.value);
        $(".spinner-loading-items").fadeOut(500);
    }
});

//Search meals by first letter

async function searchCharData(firstChar) {


    let data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + firstChar);
    if (data.status == 200 && data.ok == true) {
        let result = await data.json();
        showMeals(result.meals);
    }
}

searchByChar.addEventListener("keyup", function () {

    if (searchByChar.value != null && searchByChar.value != '') {
        closeMenu();
        displayAllData.innerHTML = "";
        $(".spinner-loading-items").fadeIn(500);
        searchCharData(searchByChar.value);
        $(".spinner-loading-items").fadeOut(500);
    }
});


// List meal
function showMeals(meals) {
    let mealsContainer = "";
    for (let i = 0; i < meals.length; i++) {
        mealsContainer += `
        <div class="col-md-3 py-3">
                <div onclick="mealDetailsData('${meals[i].idMeal}')" class="parent-div  overflow-hidden position-relative rounded-2">
                    <img class="w-100" src="${meals[i].strMealThumb}" >
                    <div class="overlay-div p-4 d-flex  align-items-center  position-absolute text-black">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
                </div>
        </div>`;
    }

    displayAllData.innerHTML = mealsContainer
}

// get melas  by id

async function mealDetailsData(id) {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        $(".spinner-loading-items").fadeIn(500);
        showMealDetailsData(result.meals[0]);
        $(".spinner-loading-items").fadeOut(500);
    }
}

function showMealDetailsData(mealData) {

    searchLayer.style.display = "none";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (mealData[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">
                                ${mealData[`strMeasure${i}`]} ${mealData[`strIngredient${i}`]}
                            </li>`;
        }
    }

    let ingredientTags = mealData.strTags;
    let tags = '';
    if (ingredientTags != null || ingredientTags != undefined) {
        ingredientTags = ingredientTags.split(",");
        for (let i = 0; i < ingredientTags.length; i++) {
            tags += `<li class="alert alert-danger m-2 p-1">${ingredientTags[i]}</li>`;
        }
    }

    let mealContainer = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${mealData.strMealThumb}">
            <h2>${mealData.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${mealData.strInstructions}</p>
            <h3><span class="fw-bold">Area : </span>${mealData.strArea}</h3>
            <h3><span class="fw-bold">Category : </span>${mealData.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex flex-wrap">${tags}</ul>
            <a target="_blank" href="${mealData.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${mealData.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`;

    displayAllData.innerHTML = mealContainer;
}


// Show categories 
categoriesNav.addEventListener("click", function () {
    CategoriesData();
});

//List all categories

async function CategoriesData() {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        $(".spinner-loading-items").fadeIn(500);
        showMealsByCategory(result.categories);
        $(".spinner-loading-items").fadeOut(500);
    }

}


function showMealsByCategory(cats) {
    let categoriesContainer = "";
    for (let i = 0; i < cats.length; i++) {
        categoriesContainer += `
        <div class="col-md-3">
                <div onclick="mealsCategoryDetailsData('${cats[i].strCategory}')" class="parent-div position-relative overflow-hidden rounded-2">
                    <img class="w-100" src="${cats[i].strCategoryThumb}">
                    <div class="overlay-div p-4   text-center  position-absolute text-black">
                        <h3>${cats[i].strCategory}</h3>`;

        categoriesContainer += `<p>${cats[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>`;
    }

    displayAllData.innerHTML = categoriesContainer
}


// Filter meals by Category

async function mealsCategoryDetailsData(cat) {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + cat);
    //console.log(data);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        //console.log(data);
        $(".spinner-loading-items").fadeIn(500);
        showMeals(result.meals); // pass meals to function [showMeals]
        $(".spinner-loading-items").fadeOut(500);
    }
}

// Show areas 
areaNav.addEventListener("click", function () {
    areasData();
});


// list all areas

async function areasData() {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';

    let data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    //console.log(data);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        // console.log(data);
        $(".spinner-loading-items").fadeIn(500);
        showMealsByArea(result.meals); // pass to this func
        $(".spinner-loading-items").fadeOut(500);
    }

}

//show all area 

function showMealsByArea(area) {
    let areaContainer = "";

    for (let i = 0; i < area.length; i++) {
        areaContainer += `<div class="col-md-3">
                                <div onclick="mealsAreaDetilas('${area[i].strArea}')" class="rounded-2 text-center">
                                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                                        <h3>${area[i].strArea}</h3>
                                </div>
                        </div>`;
    }

    displayAllData.innerHTML = areaContainer;
}

// get area name from api  

async function mealsAreaDetilas(area) {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';
    //https://www.themealdb.com/api/json/v1/1/filter.php?a=American
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + area);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        //console.log(data);
        $(".spinner-loading-items").fadeIn(500);
        showMeals(result.meals); // pass meals to function [showMeals]
        $(".spinner-loading-items").fadeOut(500);

    }

}

//Show Ingredients 
ingredientNav.addEventListener("click", function () {
    ingredientsData();
});

//list all Ingredients

async function ingredientsData() {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';

    let data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    //console.log(data);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        //console.log(result.meals);
        $(".spinner-loading-items").fadeIn(500);
        //showIngredients(result.meals); // pass to this func
        showIngredients(result.meals.slice(0, 20)); // pass to this func
        $(".spinner-loading-items").fadeOut(500);
    }
}

//show all Ingredients 

function showIngredients(ingredients) {
    //console.log(ingredients[0].strDescription);
    let ingredientsContainer = "";
    //for (let i = 0; i < 30; i++) {
    for (let i = 0; i < ingredients.length; i++) {
        ingredientsContainer += `
        <div class="col-md-3">
                <div onclick="mealsIngredientsDetilas('${ingredients[i].strIngredient}')" class="rounded-2 text-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredients[i].strIngredient}</h3>
                        <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p> 
                </div>
        </div>`;
    }

    displayAllData.innerHTML = ingredientsContainer;
}

// get ingredients from api 

async function mealsIngredientsDetilas(ingredients) {
    closeMenu();
    displayAllData.innerHTML = "";
    $(".spinner-loading-items").fadeIn(500);
    searchLayer.style.display = "none";
    searchByName.value = '';
    searchByChar.value = '';
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredients);
    if (data.status == 200 && data.ok == true) {
        result = await data.json();
        $(".spinner-loading-items").fadeIn(500);
        showMeals(result.meals); // pass meals to function [showMeals]
        $(".spinner-loading-items").fadeOut(500);

    }

}

// Show search inputs 

contactNav.addEventListener("click", function () {
    closeMenu();
    displayAllData.innerHTML = `
<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="validateName()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter full name (Special characters and numbers not allowed)
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailError" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter a valid egyptian Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `

    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true

    })
})
let ageInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (ageInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameError").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameError").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailError").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneError").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageError").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordError").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordError").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordError").classList.replace("d-none", "d-block")

        }
    }
    // validation to enable submit buttin if all return true

    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}
// regex 

function nameValidation() {
    return (/^([\w]{3,})+\s+([\w\s]{3,25})+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/([-!#-'+/-9=?A-Z^-~]+(\.[-!#-'+/-9=?A-Z^-~]+)|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^(002)?01[0125][0-9]{8}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    if (document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value) {
        return (true);
    }
}

