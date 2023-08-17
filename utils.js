document.querySelector(".home").addEventListener('click', goHome)
document.querySelector(".play-btn").addEventListener('click', startRattle)

export let view = 'home'

function goHome() {
    let quantity = document.querySelector("#quantity").value;

    let size = document.querySelector("#one").checked;

    console.log(quantity);
    console.log(size);

    document.querySelector(".home-view").style["display"] = "block";
    document.querySelector(".rattle-view").style["display"] = "none";
    view = 'home'
}

document.querySelector("#quantity").oninput = function () {
    document.querySelector(".quantity-range").innerHTML = this.value;
}

function startRattle() {
    let quantity = document.querySelector("#quantity").value;

    let size = document.querySelector("#one").checked;

    console.log(quantity);
    console.log(size);

    document.querySelector(".home-view").style["display"] = "none";
    document.querySelector(".rattle-view").style["display"] = "block";
    view = 'rattle'
}